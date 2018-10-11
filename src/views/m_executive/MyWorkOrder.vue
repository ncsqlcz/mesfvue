<!--刘川中 2018.4.12-->
<template>
  <el-row style="background-color: transparent">
    <!--右边列表-->
    <el-col :span="24">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="24" class="text-right">
            <el-form-item :span="4">
              <el-select v-model="filters.workstageBasicsId" placeholder="选择工序" @change="getList">
                <el-option
                  v-for="item in workstageList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :span="4">
              <el-select v-model="filters.workshopId" placeholder="选择车间" @change="getList">
                <el-option
                  v-for="item in workshopList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :span="4">
              <el-select v-model="filters.workOrderProductionStatus" placeholder="选择生产状态" @change="getList">
                <el-option
                  v-for="item in productionStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :span="4">
              <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
              <el-button size="medium" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="work_order_number" label="工单号" width="200" sortable></el-table-column>
        <el-table-column prop="plan.production_plan_batch_number" label="生产批号" sortable></el-table-column>
        <el-table-column prop="planQuotesWorkstage.workstage_name" label="工序" sortable></el-table-column>
        <el-table-column prop="work_order_expected_output" label="计划生产数量" width="130" sortable></el-table-column>
        <el-table-column prop="work_order_actual_output" label="目前生产数量" width="130" sortable></el-table-column>
        <el-table-column prop="work_order_estimated_completion_time" label="预计完成日期" width="130" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.work_order_estimated_completion_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="work_order_actual_finish_time" label="实际完成日期" width="130" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.work_order_actual_finish_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="plan.production_plan_production_priority" label="生产优先级" width="130" sortable></el-table-column>
        <el-table-column prop="workOrderStatus.plan_production_status" label="生产状态" width="100" sortable>
          <template slot-scope="scope">
            {{ getStatusName(scope.row.workOrderStatus.plan_production_status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="success" size="small" @click="handleWorkOrderView(scope.row)">工单详情</el-button>
            <el-button type="success" size="small" @click="handleProcessView(scope.row)">过程详情</el-button>
            <div class="mt-3">
              <el-button type="primary" size="small" @click="handleAddProcessView(scope.row)">添加过程记录</el-button>
              <el-button type="warning" size="small" @click="handleStart(scope.row)"
                         :disabled="scope.row.workOrderStatus.plan_production_status === '0'">开始</el-button>
              <el-button type="warning" size="small" @click="handleComplete(scope.row)"
                         :disabled="scope.row.workOrderStatus.plan_production_status === '0'">完成</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--列表 end-->

      <!--分页start -->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                       :total="filters.total"
                       @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
      <!--分页end -->
    </el-col>

    <!--工单过程-->
    <el-dialog :visible.sync="visible.processDialog" title="工单过程详情" width="40%">
      <div :style="{height: processSteps.length * 80 + 'px'}">
        <el-steps direction="vertical" :active="1">
          <el-step
            v-for="(item, index) in processSteps" :key="index"
            :title="item.process_records_operator"
            :description="getTime(item.process_records_operation_time) + ' ' + item.process_records_operation_executive">
            <div slot="icon"><i class="fa fa-user-o"></i></div>
          </el-step>
        </el-steps>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>
  import utils from '../../common/js/utils'
  import { queryWorkOrderOutline, queryWorkOrderProcessParticulars, modifyWorkOrderProductionStatus } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'workshop',
    data () {
      return {
        filters: {
          workstageBasicsId: '',
          workshopId: '',
          workOrderProductionStatus: '',
          keyword: '',
          type: 'vague',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
          processDialog: false
        },
        processSteps: []
      }
    },
    computed: {
      ...mapGetters({
        workstageList: 'getWorkstageList',
        workshopList: 'getWorkshopList',
        productionStatusList: 'getProductionStatusList',
        getUser: 'getUser'
      })
    },
    mounted () {
      this.getList()
      if (this.workstageList.length === 0) {
        this.initWorkstageList()
      }
      if (this.workshopList.length === 0) {
        this.initWorkshopList()
      }
    },
    methods: {
      ...mapActions(['initWorkstageList', 'initWorkshopList']),
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
          workstageBasicsId: '',
          workshopId: '',
          workOrderProductionStatus: '',
          keyword: '',
          type: 'vague',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      // 获取列表
      getList () {
        // 注意后端分页用的字段是headNum, 所以要转换一下
        let para = Object.assign({
          userId: this.getUser.userId,
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        }, this.filters)
        this.visible.listLoading = true
        queryWorkOrderOutline(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.line
            this.list = res.map.workOrders
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.visible.listLoading = false
        })
      },
      getStatusName (status) {
        let label = ''
        this.productionStatusList.map(v => {
          if (v.value === status) {
            label = v.label
          }
        })
        return label
      },
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
      },
      handleWorkOrderView (row) {
        this.$router.push({ path: '/mExecutive/myWorkorder/' + row.work_order_id })
      },
      handleProcessView (row) {
        this.visible.processDialog = true
        queryWorkOrderProcessParticulars({workOrderId: row.work_order_id}).then(res => {
          if (res.status === 0) {
            this.processSteps = res.map.processRecord
          } else {
            this.processSteps = []
          }
        })
      },
      handleAddProcessView (row) {
        this.$router.push({ path: `/mExecutive/myWorkorder/${row.work_order_id}?type=add` })
      },
      handleStart (row) {
        console.log(row);
        this.$confirm('您确定开始生产此工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            type: 'inProduction',
            userId: this.getUser.userId,
            'workOrderIds[]': row.work_order_id
          }
          modifyWorkOrderProductionStatus(para).then(res => {
            if (res.status === 0) {
              this.$message.success('工单状态已修改为开始生产')
            } else {
              this.$message.error(res.msg || '状态修改失败')
            }
          })
        }).catch(() => {})
      },
      handleComplete (row) {
        this.$confirm('工单是否生产完成? \n完成后的工单生产数据将不可修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {
            type: 'complete',
            userId: this.getUser.userId,
            'workOrderIds[]': row.work_order_id
          }
          modifyWorkOrderProductionStatus(para).then(res => {
            if (res.status === 0) {
              this.$message.success('工单状态已修改为完成')
            } else {
              this.$message.error(res.msg || '状态修改失败')
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style scoped>

</style>
