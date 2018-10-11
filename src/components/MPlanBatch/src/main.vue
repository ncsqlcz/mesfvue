<!-- 刘川中 2018.4.3 -->
<template>
  <el-dialog :title="title || '选择生产计划批次' " :visible.sync="visible" class="mes-dialog" width="50%">
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent class="text-right">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="输入关键字" @keyup.native.enter="getDataList" size="small"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click.native="getDataList" icon="el-icon-search" size="small">查询</el-button>
        </el-form-item>
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
      <el-table-column prop="production_plan_batch_number" label="计划批次" sortable></el-table-column>
      <el-table-column label="开始时间" sortable>
        <template slot-scope="scope">
          {{ formatDate(scope.row.production_scheduled_start_time, 'yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column label="结束时间" sortable>
        <template slot-scope="scope">
          {{ formatDate(scope.row.production_estimated_completion_time, 'yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column prop="production_responsible_staff" label="负责人" width="200" sortable></el-table-column>
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
  import { getMPlanBatchNumberList } from '../../../api/api'
  export default {
    name: 'm-plan-batch',
    data () {
      return {
        filters: {
          type: '',
          status: 0,
          page: 1,
          pageSize: 10,
          total: 0,
          keyword: ''
        },
        action: '', // 动作
        visible: false,
        selectedRows: null,
        list: [],
        listLoading: false,
        callback: null,
        title: '',
        multiple: false,
        selectedIds: []
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      formatDate (time) {
        if (time === null) {
          return ''
        } else {
          return utils.formatDate.format(new Date(time), 'yyyy-MM-dd')
        }
      },
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
        // this.list = []
        this.listLoading = true
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        }, this.filters)
        getMPlanBatchNumberList(para).then((data) => {
          if (data.status === 0) {
            this.filters.total = data.map.line
            this.list = data.map.plans
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
              if (item.production_plan_id === id) {
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
            if (item.production_plan_id === this.selectedIds[0]) {
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
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
