<!--刘川中 2018.6.01-->
<template>
  <section>
    <el-row :gutter="20" class="">
      <el-col :span="8">
        <el-card class="box-card" style="height:100%;overflow:auto" v-loading="visible.uploading">
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['上传视频']`) }}</el-col>
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
            :action="uploadBillboardVedioUrl"
            :file-list="fileList"
            :auto-upload="false"
            :multiple="false"
            accept="video/mp4,video/webm,video/ogg"
            list-type="picture">
            <el-button size="small" type="primary">{{ $t(`msg['选择文件']`) }}</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size:14px">{{ $t(`msg['videoShowUploadLimitTips']`) }}</div>
        </el-upload>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['选择视频']`) }}</el-col>
            <el-col :span="12" class="text-right hidden">
              <el-button type="danger" size="small" @click="imgDelete()" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['删除选中']`) }}</el-button>
              <el-button type="success" size="small" @click="submitSelectImg" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['播放选中']`) }}</el-button>
            </el-col>
          </div>
          <el-table ref="multipleTableImg" :data="list" tooltip-effect="dark" style="width: 100%" v-loading="visible.listLoading" class="multipleTableImg"
            @select="handleRowSelect" @select-all="handleImgSelectAll" @selection-change="handleImgSelectionChange">
            <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
            <el-table-column type="index" :index="getIndex" :label="$t(`msg['序号']`)" :min-width="40"></el-table-column>
            <el-table-column prop="billboard_vedio_save_time" :label="$t(`msg['上传日期']`)" width="180px">
              <template slot-scope="scope">
                {{ getTime(scope.row.billboard_vedio_save_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="billboard_vedio_name" :label="$t(`msg['名称']`)" :min-width="150"></el-table-column>
            <el-table-column prop="billboard_vedio_format" :label="$t(`msg['格式']`)" :min-width="80"></el-table-column>
            <el-table-column prop="billboard_vedio_size" :label="$t(`msg['大小']`)" :min-width="80"></el-table-column>
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
  selectVedioInfo, uploadBillboardVedioUrl,
  deleteBillboardVedio, queryBoardPlan,
  insertBillboardVedioProgram, uploadBillboardVedio
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
        listLoading: false,
        uploading: false
      },
      selectedInit: [],
      selectedIds: [],
      selectedIdsLoaded: false,
      uploadBillboardVedioUrl: uploadBillboardVedioUrl,
      fileList: [],
      selectTimes: 0, // 选择次数, 避免第一次初始化的时候选中，然后触发选中的接口
      submitting: false // 正在提交选中，避免多次重复提交
    }
  },
  props: {
    reload: {
      type: Number
    },
    planId: {
      type: String,
      required: true
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
    // 初始化页面，主要是重新获取用户选中的视频列表
    initPage () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
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
              // 最初选中的视频
              res.map.vedioList.forEach(item => {
                if (item) {
                  this.selectedInit.push(item.billboard_vedio_id)
                }
              })
            }
            resolve()
          }).catch(() => {})
        } else {
          reject(new Error('err'))
        }
      })
    },
    // 获取列表
    getList () {
      // 注意后端分页用的字段是headNum, 所以要转换一下
      let para = Object.assign({
        headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
      }, this.filters)
      this.visible.listLoading = true
      selectVedioInfo(para).then((res) => {
        if (res.status === 0) {
          // this.filters.page = data.currentPage
          this.filters.total = res.map.counts
          this.list = res.map.bbvList
          // 只初始化一次选中的列表
          if (!this.selectedIdsLoaded) {
            this.selectedIdsLoaded = true
            this.selectedIds = [...new Set([...this.selectedInit, ...this.selectedIds])]
          }
          // 如果此页有相同id
          let ids = this.list.map(v => v.billboard_vedio_id)
          let hasId = false
          this.selectedIds.forEach(id => {
            if (ids.indexOf(id) > -1) {
              hasId = true
            }
          })
          if (this.selectedIds.length === 0) {
            // 没有选中视频
            this.selectTimes = 1
          } else {
            if (hasId) {
              // 此页有选中的视频
              this.selectTimes = -1
            } else {
              // 此页没有选中的视频，但其它页有选中的视频
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
      if (this.selectedIds.indexOf(row.billboard_vedio_id) > -1) {
        return false
      } else {
        return true
      }
    },
    // 单个checkbox选中
    handleRowSelect (rows, row) {
      let checked = false
      rows.map(v => v.billboard_vedio_id).forEach(id => {
        if (id === row.billboard_vedio_id) {
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
        this.selectedIds = [...new Set([...this.selectedIds, ...rows.map(v => v.billboard_vedio_id)])]
        if (this.selectedIds.length > 1) {
          // this.$message.warning(this.$t(`msg['最多选择1个视频哦']`))
          this.selectedIds.shift()
          this.toggleSelectionImg(this.list)
        }
        this.submitSelectImg()
      } else if (type === 'del') {
        // 删除
        rows.forEach(row => {
          let index = this.selectedIds.indexOf(row.billboard_vedio_id)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        })
      }
    },
    // 表格选中-保留之前选中
    handleImgSelectionChange(rows) {
      this.selectTimes++
      // console.log(this.selectTimes)
      this.checkedSelectRows(rows, rows, 'add')
    },
    toggleSelectionImg(rows) {
      if (rows.length > 0) {
          // 遍历所有行
        rows.forEach(row => {
          if (this.selectedIds.length > 0) {
            this.selectedIds.forEach(id => {
              if (row.billboard_vedio_id === id) {
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
        msg = this.$t(`msg['确认删除此视频吗']`)
        // 单个删除
        ids = row.billboard_vedio_id
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
            deleteBillboardVedio({ vedioId: ids }).then(res => {
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
        // this.$message.info(this.$t(`msg['没有选中的视频']`))
      } else {
        let params = {
          planId: this.planId,
          vedioIds: this.selectedIds.join(',')
        }
        if (!this.submitting && this.selectTimes > 1) {
          this.submitting = true
          insertBillboardVedioProgram(params).then(res => {
            this.submitting = false
            if (res.status === 0) {
              this.$message.success(this.$t(`msg['已选择']`))
            } else {
              this.$message.warning(res.msg || this.$t(`msg['失败']`))
            }
          })
        }
      }
    },
    // 上传视频
    onUploadVideo () {
      // this.$message.info(this.$t(`msg['视频文件较大请不要关闭窗口耐心等待上传']`))
      this.visible.uploading = true
      let form = new FormData()
      for (let value of this.fileList) {
        form.append('file', value.raw)
        form.append('PlanId', this.planId)
      }
      uploadBillboardVedio(form).then(res => {
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
    // 已选择的视频
    uploadAmount(file, fileList) {
      this.fileList = [file]
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
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
