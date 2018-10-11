<!--刘川中 2018.6.01-->
<template>
  <section>
    <el-row :gutter="20" class="">
      <el-col :span="8">
        <el-card class="box-card" style="height:100%;overflow:auto">
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['上传图片']`) }}</el-col>
            <el-col :span="12" class="text-right">
              <el-button type="success" size="medium" icon="el-icon-upload" @click="onUploadPicture()" 
                :disabled="pictureList.length === 0">{{ $t(`msg['开始上传']`) }}</el-button>
            </el-col>
          </div>
          <el-upload
            ref="upload"
            :http-request="onUploadPicture"
            :on-change="uploadAmount"
            :on-remove="handleRemove"
            :action="upLoadBillboardPicUrl"
            :file-list="pictureList"
            :auto-upload="false"
            :multiple="true"
            accept="image/jpeg,image/jpg,image/npg"
            list-type="picture">
            <el-button size="small" type="primary">{{ $t(`msg['选择文件']`) }}</el-button>
            <div slot="tip" class="el-upload__tip" style="font-size:14px">{{ $t(`msg['slideShowUploadLimitTips']`) }}</div>
          </el-upload>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <el-col :span="12" class="card-header">{{ $t(`msg['选择图片']`) }}</el-col>
            <el-col :span="12" class="text-right">
              <el-button type="danger" size="small" @click="imgDelete()" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['删除选中']`) }}</el-button>
              <el-button type="success" size="small" @click="submitSelectImg" :disabled="list.length === 0 || selectedIds.length === 0">{{ $t(`msg['播放选中']`) }}</el-button>
            </el-col>
          </div>
          <el-table ref="multipleTableImg" :data="list" tooltip-effect="dark" style="width: 100%" v-loading="visible.listLoading"
            @select="handleRowSelect" @select-all="handleImgSelectAll" @selection-change="handleImgSelectionChange">
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column type="index" :index="getIndex" :label="$t(`msg['序号']`)" :min-width="40"></el-table-column>
            <el-table-column prop="img_save_time" :label="$t(`msg['上传日期']`)" width="180px">
              <template slot-scope="scope">
                {{ getTime(scope.row.img_save_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="img_name" :label="$t(`msg['名称']`)" :min-width="150"></el-table-column>
            <el-table-column prop="img_format" :label="$t(`msg['格式']`)" :min-width="80"></el-table-column>
            <el-table-column prop="img_size" :label="$t(`msg['大小']`)" :min-width="80"></el-table-column>
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
  queryBillboardPic, upLoadBillboardPicUrl,
  deleteBillboardPics, queryBoardPlan,
  insertBillboardPicProgram, upLoadBillboardPic
  } from '../../../api/api'
export default {
  name: 'slideshow-config',
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
        listLoading: false
      },
      selectedInit: [],
      selectedIds: [],
      selectedIdsLoaded: false,
      upLoadBillboardPicUrl: upLoadBillboardPicUrl,
      pictureList: []
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
  mounted () {},
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
    // 初始化页面，主要是重新获取用户选中的图片列表
    initPage () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.getSchemeInfo().then(this.getList).catch(() => {})
    },
    // 获取已经选中的图片
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
              // 最初选中的图片
              res.map.pictureList.forEach(item => {
                if (item) {
                  this.selectedInit.push(item.img_id)
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
        headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
      }, this.filters)
      this.visible.listLoading = true
      queryBillboardPic(para).then((res) => {
        if (res.status === 0) {
          // this.filters.page = data.currentPage
          this.filters.total = res.map.counts
          this.list = res.map.bbplist
          // 只初始化一次选中的图片列表
          if (!this.selectedIdsLoaded) {
            this.selectedIdsLoaded = true
            this.selectedIds = [...new Set([...this.selectedInit, ...this.selectedIds])]
          }
          if (this.selectedIds.length > 0) {
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
    // 单个checkbox选中
    handleRowSelect (rows, row) {
      let checked = false
      rows.map(v => v.img_id).forEach(id => {
        if (id === row.img_id) {
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
      // 新增
      if (type === 'add') {
        this.selectedIds = [...new Set([...this.selectedIds, ...rows.map(v => v.img_id)])]
        if (this.selectedIds.length > 10) {
          this.$message.warning(this.$t(`msg['最多选择10张图片哦']`))
          this.selectedIds.splice(10, this.selectedIds.length - 10)
          this.toggleSelectionImg(this.list)
        }
      } else if (type === 'del') {
        // 删除
        rows.forEach(row => {
          let index = this.selectedIds.indexOf(row.img_id)
          if (index > -1) {
            this.selectedIds.splice(index, 1)
          }
        })
      }
    },
    // 图片表格选中-保留之前选中
    handleImgSelectionChange(rows) {
      this.checkedSelectRows(rows, rows, 'add')
    },
    toggleSelectionImg(rows) {
      if (rows.length > 0) {
          // 遍历所有行
        rows.forEach(row => {
          if (this.selectedIds.length > 0) {
            this.selectedIds.forEach(id => {
              if (row.img_id === id) {
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
    // 单张删除 和 选中删除
    imgDelete (row) {
      let ids = ''
      let msg = ''
      if (row) {
        msg = this.$t(`msg['确认删除这张图片吗']`)
        // 单个删除
        ids = row.img_id
      } else {
        // 删除选中
        msg = this.$t(`msg['确认删除选中图片吗']`)
        ids = this.selectedIds.join(',')
      }
      if (ids !== '') {
        this.$confirm(msg, {
          title: this.$t(`msg['提示']`),
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
            deleteBillboardPics({ ids: ids }).then(res => {
              if (res.status === 0) {
                this.$message.success(this.$t(`msg['删除成功']`))
              } else {
                this.$message.warning(res.msg || this.$t(`msg['删除失败']`))
              }
              this.initPage()
            })
          }
        }).catch(() => {})
      }

    },
    // 播放选中
    submitSelectImg () {
      if (this.selectedIds.length === 0) {
        this.$message.info(this.$t(`msg['没有选中的图片']`))
      } else {
        let params = {
          planId: this.planId,
          picIds: this.selectedIds.join(',')
        }
        insertBillboardPicProgram(params).then(res => {
          if (res.status === 0) {
            this.$message.success(this.$t(`msg['成功']`))
          } else {
            this.$message.warning(res.msg || this.$t(`msg['失败']`))
          }
        })
      }
    },
    // 上传图片
    onUploadPicture () {
      let form = new FormData()
      for (let value of this.pictureList) {
        form.append('file', value.raw)
        form.append('PlanId', this.planId)
      }
      upLoadBillboardPic(form).then(res => {
        if (res.status === 0) {
          this.$message.success(this.$t(`msg['成功']`))
          this.pictureList = []
          this.getList()
        } else {
          this.$message.warning(res.msg || this.$t(`msg['失败']`))
        }
      })
      // this.$refs.upload.submit()
    },
    // 已选择的图片
    uploadAmount(file, fileList) {
      this.pictureList = fileList
    },
    handleRemove(file, fileList) {
      this.pictureList = fileList
    },
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
