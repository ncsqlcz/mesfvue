/*
 * @Author: liucz 
 * @Date: 2018-06-12 11:19:37 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-06-28 17:57:55
 */
<template>
  <section>
    <el-row :gutter="20" class="">
      <el-col :span="8">
        <el-card class="box-card" style="height:100%; overflow:auto" v-loading="visible.uploading">
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['上传']`) + 'pdf' }}</el-col>
            <el-col :span="12" class="text-right">
              <el-button type="success" size="medium" icon="el-icon-upload" @click="onUploadVideo()" 
                :disabled="fileList.length === 0">{{ $t(`msg['开始上传']`) }}</el-button>
            </el-col>
          </div>
          <el-upload
            class="upload-demo"
            ref="uploadVideo"
            :http-request="onUploadVideo"
            :on-change="uploadAmount"
            :action="upLoadBillboardPdfUrl"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            accept=".pdf"
            list-type="picture">
            <el-button size="small" type="primary">{{ $t(`msg['选择文件']`) }}</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size:14px">{{ $t(`msg['只能上传pdf文件']`) }}</div>
        </el-upload>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['选择']`) + 'pdf' }}</el-col>
            <el-col :span="12" class="text-right">
              <el-form :inline="true" @submit.native.prevent style="height: 36px;">
                <el-form-item :label="$t(`msg['滚动时间']`)" style="margin-left: 20px;">
                  <el-select v-model="scrollTime" size="small" style="width: 100px;" @change="handleScrollTimeChange">
                    <el-option :value="20" label="20秒"></el-option>
                    <el-option :value="30" label="30秒"></el-option>
                    <el-option :value="50" label="50秒"></el-option>
                    <el-option value="自定义" label="自定义"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show="scrollTime === '自定义'">
                  <el-input size="small" type="number" :min="1" v-model="customScrollTime" style="width: 160px;" @change="handleScrollTimeChange">
                    <template slot="append">秒</template>
                  </el-input>
                </el-form-item>
              </el-form>
              <!-- <el-button type="danger" size="small" @click="imgDelete()" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['删除选中']`) }}</el-button> -->
              <!-- <el-button type="success" size="small" @click="submitSelectImg" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['播放选中']`) }}</el-button> -->
            </el-col>
          </div>
          <el-table ref="multipleTableImg" :data="list" tooltip-effect="dark" style="width: 100%" v-loading="visible.listLoading" class="multipleTableImg"
            @select="handleRowSelect" @select-all="handleImgSelectAll" @selection-change="handleImgSelectionChange">
            <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
            <el-table-column type="index" :index="getIndex" :label="$t(`msg['序号']`)" :min-width="40"></el-table-column>
            <el-table-column prop="pdf_save_time" :label="$t(`msg['上传日期']`)" width="180px">
              <template slot-scope="scope">
                {{ getTime(scope.row.pdf_save_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="pdf_name" :label="$t(`msg['名称']`)" :min-width="150"></el-table-column>
            <el-table-column prop="" :label="$t(`msg['格式']`)" :min-width="80">
              <template slot-scope="scope">pdf</template>
            </el-table-column>
            <el-table-column prop="pdf_size" :label="$t(`msg['大小']`)" :min-width="80"></el-table-column>
            <el-table-column :min-width="80" prop="edit" :label="$t(`msg['编辑']`)" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="imgDelete(scope.row)">{{ $t(`msg['删除']`) }}</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination class="text-left" @current-change="handlePageChange" background small layout="total,prev,pager,next"
          :current-page="filters.page" :page-size="filters.pageSize" :total="filters.total"></el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import utils from '../../../common/js/utils'
import {
  queryBillboardPdf, upLoadBillboardPdfUrl,
  deleteBillboardPdf, queryBoardPlan,
  insertBillboardPdfProgram, upLoadBillboardPdf
  } from '../../../api/api'
export default {
  name: 'videoshow-config',
  data () {
    return {
      filters: {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      },
      list: [],
      visible: {
        listLoading: true,
        uploading: false
      },
      selectedInit: [],
      selectedIds: [],
      selectedIdsLoaded: false,
      upLoadBillboardPdfUrl: upLoadBillboardPdfUrl,
      fileList: [],
      selectTimes: 0, // 选择次数, 避免第一次初始化的时候选中，然后触发选中的接口
      submitting: false, // 正在提交选中，避免多次重复提交
      scrollTime: 20,
      customScrollTime: 60
    }
  },
  props: {
    reload: {
      type: Number
    },
    planId: {
      type: String,
      required: true
    },
    // pdf的滚动时间
    rollTime: {
      type: [String, Number],
      default: 20
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 移除全选按钮
      let cell = this.$refs.multipleTableImg.$el.querySelector('.el-table__header-wrapper').querySelector('.cell')
      cell.parentNode.removeChild(cell)
    })
  },
  methods: {
    // 页面改变
    handlePageChange (val) {
      this.filters.page = val
      this.getList()
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.filters.pageSize = val
      this.getList()
    },
    // 列表索引
    getIndex (index) {
      return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
    },
    // 重置
    reset () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.getList()
    },
    // 初始化页面，主要是重新获取用户选中的pdf列表
    initPage () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.scrollTime = this.rollTime
      this.selectTimes = 0
      this.selectedIds = []
      this.selectedIdsLoaded = false
      this.getSchemeInfo().then(this.getList).catch(() => {})
    },
    // 获取已经选中的
    getSchemeInfo () {
      this.visible.listLoading = true
      return new Promise((resolve, reject) => {
        if (this.planId !== '') {
          let params = {
            type: 'boardPlanConfigures',
            planId: this.planId,
            headNum: 1
          }
          queryBoardPlan(params).then(res => {
            if (res.status === 0) {
              // 最初选中的pdf
              res.map.pdfList && res.map.pdfList.forEach(item => {
                if (item) {
                  this.selectedInit.push(item.pdf_id)
                }
              })
            }
            resolve()
          }).catch(() => {})
        } else {
          reject()
        }
      })
    },    
    // 获取列表
    getList () {
      // 注意后端分页用的字段是headNum, 所以要转换一下
      let para = Object.assign({
        // headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
      }, this.filters)
      this.visible.listLoading = true
      queryBillboardPdf(para).then((res) => {
        if (res.status === 0) {
          // this.filters.page = data.currentPage
          this.filters.total = res.map.lines
          this.list = res.map.billboardPdfList
          // 只初始化一次选中的列表
          if (!this.selectedIdsLoaded) {
            this.selectedIdsLoaded = true
            this.selectedIds = [...new Set([...this.selectedInit, ...this.selectedIds])]
          }
          // 如果此页有相同id
          let ids = this.list.map(v => v.pdf_id)
          let hasId = false
          this.selectedIds.forEach(id => {
            if (ids.indexOf(id) > -1) {
              hasId = true
            }
          })
          if (this.selectedIds.length === 0) {
            // 没有选中pdf
            this.selectTimes = 1
          } else {
            if (hasId) {
              // 此页有选中的pdf
              this.selectTimes = -1
            } else {
              // 此页没有选中的pdf，但其它页有选中的pdf
              this.selectTimes = 1
            }
          }
          if (hasId) {
            this.$nextTick(() => {
              this.toggleSelectionImg(this.list)
            })
          }
        } else {
          this.filters.total = 0
          this.list = []
        }
        this.visible.listLoading = false
      })
    },
    getTime (timestamp) {
      if (!timestamp) {
        return ''
      } else {
        return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    // 已选中的不支持取消选择
    selectable (row, index) {
      if (this.selectedIds.indexOf(row.pdf_id) > -1) {
        return false
      } else {
        return true
      }
    },
    // 单个checkbox选中
    handleRowSelect (rows, row) {
      let checked = false
      rows.map(v => v.pdf_id).forEach(id => {
        if (id === row.pdf_id) {
          checked = true
        }
      })
      // 选中 - 新增一行
      if (checked) {
        this.checkedSelectRows(rows, [row], 'add')
      } else {
        this.checkedSelectRows(rows, [row], 'del')
      }
    },
    // 全部选中
    handleImgSelectAll (rows) {
      // 取消全选
      if (rows.length === 0) {
        this.checkedSelectRows(this.list, this.list, 'del')
      } else {
        this.checkedSelectRows(rows, rows, 'add')
      }
    },
    // 检查行 保证最多只有10个数据
    checkedSelectRows (checkedRows, rows, type = 'add') {
      // 如果没有选中行
      if (rows.length === 0) {
        return false
      }
      // 新增
      if (type === 'add') {
        this.selectedIds = [...new Set([...this.selectedIds, ...rows.map(v => v.pdf_id)])]
        if (this.selectedIds.length > 1) {
          // this.$message.warning(this.$t(`msg['最多选择1个pdf哦']`))
          this.selectedIds.shift()
          this.toggleSelectionImg(this.list)
        }
        this.submitSelectImg()
      } else if (type === 'del') {
        // 删除
        rows.forEach(row => {
          let index = this.selectedIds.indexOf(row.pdf_id)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        })
      }
    },
    // 表格选中-保留之前选中
    handleImgSelectionChange(rows) {
      this.selectTimes++
      this.checkedSelectRows(rows, rows, 'add')
    },
    toggleSelectionImg(rows) {
      if (rows.length > 0) {
          // 遍历所有行
        rows.forEach(row => {
          if (this.selectedIds.length > 0) {
            this.selectedIds.forEach(id => {
              if (row.pdf_id === id) {
                this.$nextTick(() => {
                  // 会触发 handleImgSelectionChange
                  this.$refs.multipleTableImg.toggleRowSelection(row, true)
                })
              } else {
                this.$refs.multipleTableImg.toggleRowSelection(row, false)
              }
            })
          } else {
            this.$refs.multipleTableImg.clearSelection()
          }
        })
      } else {
        this.$refs.multipleTableImg.clearSelection()
      }
    },
    // 单个删除 和 选中删除
    imgDelete (row) {
      let ids = ''
      let msg = ''
      if (row) {
        msg = this.$t(`msg['确认删除此pdf吗']`)
        // 单个删除
        ids = row.pdf_id
      } else {
        // 删除选中
        // msg = this.$t(`msg['确认删除选中图片吗']`)
        ids = this.selectedIds.join(',')
      }
      if (ids !== '') {
        this.$confirm(msg, {
          title: this.$t(`msg['提示']`),
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
            deleteBillboardPdf({ pdfId: ids }).then(res => {
              if (res.status === 0) {
                this.$message.success(this.$t(`msg['删除成功']`))
              } else {
                this.$message.warning(res.msg || this.$t(`msg['删除失败']`))
              }
              this.list = [] // 不清空有可能出现死循环
              this.initPage()
            })
          }
        }).catch(() => {})
      }

    },
    // 播放选中
    submitSelectImg () {
      if (this.selectedIds.length === 0) {
        // this.$message.info(this.$t(`msg['没有选中的pdf']`))
      } else {
        let params = {
          planId: this.planId,
          pdfId: this.selectedIds.join(','),
          rollTime: this.scrollTime === '自定义' ? this.customScrollTime : this.scrollTime
        }
        if (!this.submitting && this.selectTimes > 1) {
          this.submitting = true
          insertBillboardPdfProgram(params).then(res => {
            this.submitting = false
            if (res.status === 0) {
              this.$message.success(this.$t(`msg['已选择']`))
            } else {
              this.$message.warning(res.msg || this.$t(`msg['失败']`))
            }
          }).catch(() => {
            this.submitting = false
          })
        }
      }
    },
    // 上传pdf
    onUploadVideo () {
      this.visible.uploading = true
      let form = new FormData()
      for (let value of this.fileList) {
        form.append('file', value.raw)
        form.append('PlanId', this.planId)
      }
      upLoadBillboardPdf(form).then(res => {
        if (res.status === 0) {
          this.$message.success(this.$t(`msg['成功']`))
          this.fileList = []
          this.initPage()
        } else {
          this.$message.warning(res.msg || this.$t(`msg['失败']`))
          this.fileList = []
        }
        this.visible.uploading = false
      })
      // this.$refs.upload.submit()
    },
    //已选择的pdf
    uploadAmount(file, fileList) {
      this.fileList = [file]
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 选择时间
    handleScrollTimeChange () {
      this.selectTimes  =2
      this.submitSelectImg()
    }
  },
  watch: {
    reload (val) {
      this.initPage()
    },
    planId (val) {
      if (val !== '') {
        this.initPage()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  line-height: 36px;
  font-size: 16px;
}
</style>

<style>
.multipleTableImg .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #409EFF;
  border-color: #409EFF;
  color: #fff;
}
.multipleTableImg .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
  border-color: #fff;
}
</style>