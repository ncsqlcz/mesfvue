<!--刘川中 2018.5.15-->
<template>
  <el-row style="background-color: transparent">
    <el-col :span="24">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="24" class="text-right">
            <el-form-item :span="4">
              <el-select v-model="filters.productionStatus" :placeholder="$t(`msg['选择生产状态']`)" size="medium" @change="getList">
                <el-option
                  v-for="item in productionStatusList"
                  v-if="item.value !== '0'"
                  :key="item.value"
                  :label="$t(`msg['${item.label}']`)"
                  :value="item.type">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :span="4">
              <el-input v-model.trim="filters.keyword" size="medium" :placeholder="$t(`msg['输入关键字']`)" @keyup.native.enter="getList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">{{ $t(`msg.search`) }}</el-button>
              <el-button size="medium" @click="reset">{{ $t(`msg.reset`) }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="production_plan_order_number" :label="$t(`msg['订单编号']`)" width="200" sortable></el-table-column>
        <el-table-column prop="production_plan_batch_number" :label="$t(`msg['生产批次']`)" sortable></el-table-column>
        <el-table-column prop="production_order_production_number" :label="$t(`msg['需求量']`)" width="" sortable></el-table-column>
        <el-table-column prop="production_estimated_completion_time" :label="$t(`msg['预计完成日期']`)" width="" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.production_estimated_completion_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="production_plan_production_priority" :label="$t(`msg['生产优先级']`)" width="" sortable></el-table-column>
        <el-table-column prop="planStatus.plan_audit_status" :label="$t(`msg['审核状态']`)" sortable>
          <template slot-scope="scope">
            {{ $t(`msg['${getAuditStatusDict[scope.row.planStatus.plan_audit_status]}']`) }}
          </template>
        </el-table-column>
        <el-table-column prop="planStatus.plan_production_status" :label="$t(`msg['生产状态']`)" width="130" sortable>
          <template slot-scope="scope">
            {{ $t(`msg['${getStatusName(scope.row.planStatus.plan_production_status)}']`) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t(`msg['操作']`)" width="200">
          <template slot-scope="scope">
            <el-button type="" size="small" icon="el-icon-view" @click="handleDetailView(scope.row)">{{ $t(`msg['计划详情']`) }}</el-button>
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

    <details-dialog :visible.sync="visible.planDetailsDialog" :plan-id="planId" :config='detailsDialogConfig'></details-dialog>
  </el-row>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryDraftPlanOutline } from '../../../api/api'
  import { mapGetters, mapActions } from 'vuex'
  import DetailsDialog from '../children/DetailsDialog'

  export default {
    name: 'm-plan-scheduled',
    data () {
      return {
        filters: {
          keyword: '',
          type: 'production',
          productionStatus: 'inProduction',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
          planDetailsDialog: false
        },
        planId: '',
        detailsDialogConfig: {
          activeTabName: 'details',
          show: {
            details: true,
            process: true,
            progress: true,
            approval: true
          }
        }
      }
    },
    components: { DetailsDialog },
    computed: {
      ...mapGetters({
        user: 'getUser',
        productionStatusList: 'getProductionStatusList',
        getAuditStatusDict: 'getAuditStatusDict'
      })
    },
    mounted () {
      this.getList()
    },
    methods: {
      ...mapActions([]),
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
          keyword: '',
          type: 'production',
          productionStatus: 'inProduction',
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
          // userId: this.getUser.userId,
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        }, this.filters)
        this.visible.listLoading = true
        queryDraftPlanOutline(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.line
            this.list = res.map.plans
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.visible.listLoading = false
        })
      },
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
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
      // 详情
      handleDetailView (row) {
        this.planId = row.production_plan_id
        this.visible.planDetailsDialog = true
      }
    }
  }
</script>

<style scoped>

</style>
