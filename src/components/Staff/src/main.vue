<!-- 刘川中 2018.4.3 -->
<template>
  <el-dialog :title="title || '选择员工' " :visible.sync="visible" class="mes-dialog" width="40%">
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="10" class="text-left">
          <el-select v-model="postId" placeholder="请选择职位"
                     size="medium"
                     @change="getDataList"
                     v-if="type === 'post'">
            <el-option
              v-for="item in postList"
              :key="item.role_post_id"
              :label="item.role_post_name"
              :value="item.role_post_id">
            </el-option>
          </el-select>
          <span v-else>&nbsp;</span>
        </el-col>
        <el-col :span="14" class="text-right">
          <el-form-item>
            <el-input v-model="filters.staffName" placeholder="输入关键字" @keyup.native.enter="handleSearch" size="small"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click.native="handleSearch" icon="el-icon-search" size="small">查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--列表 start-->
    <el-table :data="list" v-loading="listLoading"
              row-class-name="el-mini-row pointer"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="toggleCurrentRow"
              :highlight-current-row="!multiple">
      <el-table-column type="selection" width="55" v-if="multiple"></el-table-column>
      <el-table-column type="index" :index="getIndex" v-else></el-table-column>
      <el-table-column prop="role_staff_name" label="姓名" sortable></el-table-column>
      <el-table-column prop="role_staff_number" label="工号" sortable></el-table-column>
      <el-table-column prop="post.role_post_name" label="职位" width="200" sortable></el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页start -->
    <div class="clearfix">
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                       :total="filters.total"
                       @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>

      <!--确认选择 start-->
      <el-col :span="24" class="text-right mt-4" v-if="multiple">
        <el-button type="success" size="" @click="confirmSelected" :disabled="!selectedRows || selectedRows.length === 0">确认选择</el-button>
      </el-col>
      <!--确认选择 end-->
    </div>
    <!--分页end -->
  </el-dialog>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { getStaffList } from '../../../api/api'
  export default {
    name: 'staff',
    data () {
      return {
        title: '',
        type: '',
        postList: [],
        filters: {
          type: 'other',
          status: 0,
          page: 1,
          pageSize: 10,
          total: 0,
          staffName: '',
          postId: ''
        },
        action: '', // 动作
        visible: false,
        selectedRows: null,
        list: [],
        listLoading: false,
        callback: null,
        multiple: false,
        selectedIds: [],
        postId: ''
      }
    },
    mounted () {
    },
    methods: {
      handleSelectionChange (val) {
        this.selectedRows = val
      },
      // 确认选择
      confirmSelected (row) {
        this.visible = false
        if (this.multiple) {
          // 选择多行
          this.selectedRows = this.$refs.multipleTable.selection
        } else {
          // 选择单行
          this.selectedRows = [row]
        }
        this.handleAction('selected')
      },
      handleAction (action) {
        this.action = action
        // 手动触发instance的回调，用以resolve
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
          this.$refs.multipleTable.clearSelection()
        }, 0)
      },
      // 多选情况
      toggleCurrentRow (row) {
        if (this.multiple) {
          this.$refs.multipleTable.toggleRowSelection(row)
        } else {
          this.confirmSelected(row)
        }
      },
      // 列表索引
      getIndex (index) {
        return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
      },
      // 获取数据列表
      getDataList () {
        if (this.type === 'post' && this.postList.length === 0) {
          return
        }
        if (this.type === 'post') {
          this.filters.type = 'other'
        } else {
          this.filters.type = 'info'
        }
        this.listLoading = true
        let para = Object.assign(this.filters, {
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          postId: this.postId
        })
        getStaffList(para).then((data) => {
          if (data.status === 0) {
            this.filters.total = data.map.lines
            this.list = data.map.staffs
            this.checkSelectedIds()
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.listLoading = false
        })
      },
      // 初始选择的行
      checkSelectedIds () {
        if (!this.multiple) {
          this.$nextTick(() => {
            this.$refs.multipleTable.setCurrentRow()
          })
        }
        // 多行选择的情况
        if (this.selectedIds.length > 0 && this.multiple) {
          this.selectedIds.forEach(id => {
            this.list.forEach((item, index) => {
              if (item.role_staff_id === id) {
                this.$nextTick(() => {
                  this.$refs.multipleTable.toggleRowSelection(this.list[index], true)
                })
              } else {
                this.$refs.multipleTable.toggleRowSelection(this.list[index], false)
              }
            })
          })
        } else if (this.selectedIds.length > 0 && !this.multiple) {  // 单行选择的情况
          this.list.forEach((item, index) => {
            if (item.role_staff_id === this.selectedIds[0]) {
              this.$nextTick(() => {
                this.$refs.multipleTable.setCurrentRow(this.list[index])
              })
            }
          })
        } else if (this.selectedIds.length === 0) {
          try {
            this.$refs.multipleTable.clearSelection()
          } catch (e) {}
        }
      },
      // 页码改变
      handlePageChange (val) {
        this.filters.page = val
        this.getDataList()
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.filters.pageSize = val
        this.getDataList()
      },
      handleSearch () {
        if (this.type === 'post' && this.postId === '') {
          this.$message({message: '请先选择职位', type: 'warning'})
        } else {
          this.getDataList()
        }
      },
      postChange (postId) {

      }
    },
    watch: {
      type (val) {
        switch (val) {
        case 'all':
          this.getDataList()
          break;
        case 'post':
          if (this.postList.length === 0) {
            this.$message({message: '职位数据为空，请先配置职位', type: 'warning'})
          } else {
            this.postId = this.postList[0].role_post_id
            this.getDataList()
          }
          break;
        default:
          this.getDataList()
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
