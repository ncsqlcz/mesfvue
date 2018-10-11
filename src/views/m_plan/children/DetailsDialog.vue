<!--刘川中 2018.5.12-->
<template>
  <section>
    <!-- 生产计划信息 -->
    <el-dialog
      title="生产计划信息"
      :visible.sync="visibleDialog"
      width="70%"
      class="mes-dialog">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
        <!-- 生产计划详情 -->
        <el-tab-pane :label="$t(`msg['生产计划详情']`)" name="details" v-if="config.show.details">
          <el-collapse v-model="activeCollapseNames" @change="handleCollapseChange" ref="printable">
            <el-collapse-item name="1">
              <h3 slot="title">{{ $t(`msg['基础信息']`) }}</h3>
              <!-- 基础信息 start -->
              <div class="detail-table" v-loading="visible.detailsLoading">
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">订单编号</p>
                    <p class="td-value">{{ plan.production_plan_order_number }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">是否新产</p>
                    <p class="td-value">{{ plan.production_plan_judge_whether }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">生产批号</p>
                    <p class="td-value">{{ plan.production_plan_batch_number }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">生产优先级</p>
                    <p class="td-value">{{ plan.production_plan_production_priority }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">成品类型</p>
                    <p class="td-value">{{ plan.product_type_name }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">成品型号</p>
                    <p class="td-value">{{ plan.product_model_name }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">工艺级</p>
                    <p class="td-value">{{ plan.craft_name }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">工艺版本</p>
                    <p class="td-value">{{ plan.craft_versions }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">生产线</p>
                    <p class="td-value">{{ plan.product_line_name }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">优率</p>
                    <p class="td-value">{{ plan.production_plan_optimal_rate }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">成品容量（Ah）</p>
                    <p class="td-value">{{ plan.product_model_capacity }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">成品型号单位</p>
                    <p class="td-value">{{ plan.product_model_unit }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">需求量</p>
                    <p class="td-value">{{ plan.production_order_production_number }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">批次排产数</p>
                    <p class="td-value">{{ plan.production_batch_production_number }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">排产优率</p>
                    <p class="td-value">{{ plan.production_scheduling_optimization_rate }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">预计产出量</p>
                    <p class="td-value">{{ plan.production_expected_output }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">排产容量(WAH)</p>
                    <p class="td-value">{{ plan.production_scheduling_capacity }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">创建人</p>
                    <p class="td-value">{{ plan.production_founder_staff }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">计划审核人</p>
                    <p class="td-value">{{ plan.production_verifier_staff }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">生产计划负责人</p>
                    <p class="td-value">{{ plan.production_responsible_staff }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">创建时间</p>
                    <p class="td-value">{{ getTime(plan.production_creation_time) }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">预定开始时间</p>
                    <p class="td-value">{{ getTime(plan.production_scheduled_start_time) }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">预定完成时间</p>
                    <p class="td-value">{{ getTime(plan.production_estimated_completion_time) }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">实际产出量</p>
                    <p class="td-value">{{ plan.production_actual_output }}</p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">实际开始时间</p>
                    <p class="td-value">{{ getTime(plan.production_actual_start_time) }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name">实际完成时间</p>
                    <p class="td-value">{{ getTime(plan.production_actual_finish_time) }}</p>
                  </div>
                  <div class="w-33 detail-table-item">
                    <p class="th-name"></p>
                    <p class="td-value"></p>
                  </div>
                </div>
                <div class="detail-table-row">
                  <div class="w-33 detail-table-item">
                    <p class="th-name">生产批号二维码</p>
                    <p class="td-value">
                      <img :src="QRCodeUrl + '?data=' + plan.production_plan_QRCode" v-if='plan.production_plan_QRCode'>
                    </p>
                  </div>
                </div>


              </div>
              <!-- 基础信息 end -->
            </el-collapse-item>
            <el-collapse-item name="2">
              <h3 slot="title">{{ $t(`msg['BOM清单']`) }}</h3>
              <!--列表 start-->
              <el-table :data="plan.planUseMaterialList" highlight-current-row v-loading="loading.detailsLoading">
                <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
                <el-table-column prop="warehouse_material_name" :label="$t(`msg['名称']`)" width="" sortable></el-table-column>
                <el-table-column prop="warehouse_material_standard" :label="$t(`msg['规格']`)" width="" sortable></el-table-column>
                <el-table-column prop="warehouse_material_model" :label="$t(`msg['型号']`)" width="" sortable></el-table-column>
                <el-table-column prop="supplier_name" :label="$t(`msg['供应商']`)" width="" sortable></el-table-column>
                <el-table-column prop="plan_required_amount" :label="$t(`msg['需求量']`)" width="" sortable></el-table-column>
                <el-table-column prop="warehouse_material_units" :label="$t(`msg['单位']`)" width="" sortable></el-table-column>
                <el-table-column prop="plan_quotes_actual_inventory" :label="$t(`msg['实际库存']`)" width="" sortable></el-table-column>
                <el-table-column prop="plan_quotes_anticipated_stock" :label="$t(`msg['预计库存']`)" width="" sortable></el-table-column>
                <el-table-column :label="$t(`msg['操作']`)" width="200">
                  <template slot-scope="scope">
                    <el-button type="" size="small" icon="el-icon-view" @click="handleBOMDetailView(scope.row)">{{ $t(`msg['详情']`) }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--列表 end-->
            </el-collapse-item>
            <el-collapse-item name="3">
              <h3 slot="title">{{ $t(`msg['工单信息']`) }}</h3>
              <!--列表 start-->
              <el-table :data="plan.workOrderList" highlight-current-row v-loading="loading.detailsLoading">
                <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
                <el-table-column prop="work_order_number" :label="$t(`msg['工单号']`)" width="" sortable></el-table-column>
                <el-table-column prop="planQuotesWorkstage.workstage_name" :label="$t(`msg['工序']`)" width="" sortable></el-table-column>
                <el-table-column prop="planQuotesWorkstage.workstage_polarity" :label="$t(`msg['级性']`)" width="" sortable></el-table-column>
                <el-table-column prop="planQuotesWorkstage.semi_finish_genre" :label="$t(`msg['半成品型号']`)" width="" sortable></el-table-column>
                <el-table-column prop="planQuotesWorkstage.expected_output" :label="$t(`msg['预计产出量']`)" width="" sortable></el-table-column>
                <el-table-column prop="role_workshop_name" :label="$t(`msg['生产车间']`)" width="" sortable></el-table-column>
                <el-table-column prop="work_order_estimated_completion_time" :label="$t(`msg['预定完成时间']`)" width="" sortable>
                  <template slot-scope="scope">
                    {{ getTime(scope.row.work_order_estimated_completion_time) }}
                  </template>
                </el-table-column>
                <el-table-column prop="work_order_responsible" :label="$t(`msg['工单负责人']`)" width="" sortable></el-table-column>
                <el-table-column :label="$t(`msg['操作']`)" width="220">
                  <template slot-scope="scope">
                    <el-button type="" size="small" icon="el-icon-view" @click="handleWordOrderDetailView(scope.row)">{{ $t(`msg['详情']`) }}</el-button>
                    <el-button type="" size="small" icon="el-icon-view" @click="handleWordOrderProcessView(scope.row)">{{ $t(`msg['过程']`) }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--列表 end-->
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <!-- 生产过程详情 -->
        <el-tab-pane :label="$t(`msg['生产过程详情']`)" name="process" v-if="config.show.process">
          <div class="border p-3">
            <el-steps finish-status="success" process-status="process"
                      direction="vertical" :active="planProcessRecords.length"
                      :space="stepSpace" v-loading="loading.processLoading">
              <el-step
                v-for="(value, index) in planProcessRecords"
                :key="index"
                :title="value.process_records_operator + ' ' + getTime(value.process_records_operation_time) + ' ' + value.process_records_operation_executive"
                  :description="value.process_records_operating_instructions"></el-step>
            </el-steps>
          </div>
        </el-tab-pane>
        <!-- 生产进度详情 -->
        <el-tab-pane :label="$t(`msg['生产进度详情']`)" name="progress" v-if="config.show.progress">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已完成工单量 / 全部工单量</span>
              <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <div class="text item">
              <el-progress :stroke-width="25" :percentage="evolve"></el-progress>
            </div>
          </el-card>
          
          <el-card class="box-card mt-4">
            <div slot="header" class="clearfix">
              <span>工单生产进度</span>
            </div>
            <div class="text item">
              <el-steps
                :space="stepSpace"
                :active="workOrders.length"
                finish-status="success"
                process-status="process"
                direction="vertical">
                <el-step
                  v-for="(item, index) in workOrders"
                  :key="index"
                  :title="item.work_order_number"
                  :status="scheduleStatus(item)"
                  :description="'预计产出量: ' + item.work_order_expected_output + ' ' + '实际产出量: ' + (item.work_order_actual_output || 0)"
                >
                </el-step>
              </el-steps>
            </div>
          </el-card>
        </el-tab-pane>
        <!-- 审核详情 -->
        <el-tab-pane :label="$t(`msg['审核详情']`)" name="approval" v-if="config.show.approval">
          <div class="border p-3">
            <el-steps
              :space="stepSpace"
              :active="planCheckRecords.length"
              finish-status="success"
              process-status="process"
              direction="vertical">
              <el-step
                v-for="(item, index) in planCheckRecords"
                :key="index"
                :title="item.process_records_operator + ' ' + getTime(item.process_records_operation_time) + ' ' + item.process_records_operation_executive"
                :description="'备注：' + (item.process_records_operating_instructions || '')"
              >
              </el-step>
            </el-steps>
          </div>
        </el-tab-pane>
        <!--<el-tab-pane label="定时任务补偿" name="fifth">-->
          <!--计划操作-->
        <!--</el-tab-pane>-->
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="medium" @click="print">{{ $t(`msg['打印']`) }}</el-button> -->
        <el-button size="medium" @click="visibleDialog = false">{{ $t(`msg['关闭']`) }}</el-button>
      </span>
    </el-dialog>

    <!-- 工单过程 -->
    <el-dialog
      title="工单过程"
      :visible.sync="visibleWorkOrderDialog"
      width="45%">
      <div class="border p-3">
        <el-steps finish-status="success" process-status="process"
                  direction="vertical" :active="workOrderProcess.length"
                  :space="stepSpace" v-loading="loading.workOrderProcessLoading">
          <el-step
            v-for="(value, index) in workOrderProcess"
            :key="index"
            :title="value.process_records_operator + ' ' + getTime(value.process_records_operation_time) + ' ' + value.process_records_operation_executive"
            :description="value.process_records_operating_instructions"></el-step>
        </el-steps>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="visibleWorkOrderDialog = false">{{ $t(`msg['关闭']`) }}</el-button>
      </span>
    </el-dialog>
  </section>

</template>

<script>
import utils from '../../../common/js/utils'
import '../../../styles/print.css'
import {
  queryPlanParticulars,
  queryPlanProcessParticulars,
  queryPlanEvolveParticulars,
  queryPlanCheckParticulars,
  createQRCodeUrl,
  queryWorkOrderParticulars,
  queryWorkOrderProcessParticulars
} from '../../../api/api'
export default {
  name: 'plan-details',
  data () {
    return {
      visibleDialog: this.visible,
      visibleWorkOrderDialog: false,
      activeTabName: '',
      activeCollapseNames: ['1', '2', '3'],
      plan: {
        planStatus: {},
        planUseMaterialList: [],
        workOrderList: []
      },
      planProcessRecords: [],
      evolve: 0.00,
      workOrders: [],
      planCheckRecords: [],
      QRCodeUrl: createQRCodeUrl,
      loading: {
        detailsLoading: false,
        processLoading: false,
        progressLoading: false,
        approvalLoading: false,
        workOrderProcessLoading: false
      },
      stepSpace: '80px',
      workOrderProcess: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    planId: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      default: () => {
        return {
          activeTabName: 'details',
          show: {
            details: true,
            process: false,
            progress: false,
            approval: false
          }
        }
      }
    }
  },
  computed: {},
  mounted () {
    if (this.config.activeTabName || this.config.show[this.config.activeTabName]) {
      this.activeTabName = this.config.activeTabName
    } else {
      this.activeTabName = 'details'
    }
  },
  methods: {
    // 列表索引
    getIndex (index) {
      return utils.getHeadNumAdapter(1, this.plan.workOrderList.length, index)
    },
    initData (activeTabName) {
      switch (activeTabName) {
      case 'details': // 生产计划详情
        if (this.plan.production_plan_order_number === undefined) {
          this.loading.detailsLoading = true
          queryPlanParticulars({planId: this.planId}).then(res => {
            this.loading.detailsLoading = false
            if (res.status === 0) {
              this.plan = res.map.plan
            }
          })
        }
        break;
      case 'process': // 生产过程详情
        if (this.planProcessRecords.length === 0) {
          this.loading.processLoading = true
          queryPlanProcessParticulars({planId: this.planId}).then(res => {
            this.loading.processLoading = false
            if (res.status === 0) {
              this.planProcessRecords = res.map.PlanProcessRecords
            }
          })
        }
        break;
      case 'progress':  // 生产进度详情
        if (this.workOrders.length === 0) {
          this.loading.progressLoading = true
          queryPlanEvolveParticulars({planId: this.planId}).then(res => {
            this.loading.progressLoading = false
            if (res.status === 0) {
              this.evolve = parseFloat(res.map.evolve)
              this.workOrders = res.map.workOrders
            }
          })
        }
        break;
      case 'approval':  // 审核详情
        if (this.planCheckRecords.length === 0) {
          this.loading.approvalLoading = true
          queryPlanCheckParticulars({planId: this.planId}).then(res => {
            this.loading.approvalLoading = false
            if (res.status === 0) {
              this.planCheckRecords = res.map.PlanProcessRecords
            }
          })
        }
        break;
      }
    },
    clearData () {
      this.plan = {
        planStatus: {},
        planUseMaterialList: [],
        workOrderList: []
      }
      this.planProcessRecords = []
      this.evolve = 0.00
      this.workOrders = []
      this.planCheckRecords = []
    },
    // 切换trab
    handleTabClick (tab, event) {
      // console.log(tab, event);
      this.initData(tab.name)
    },
    // 生产计划详情 折叠展开
    handleCollapseChange (val) {
      console.log(val)
    },
    getTime (timestamp) {
      if (!timestamp) {
        return ''
      } else {
        return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm')
      }
    },
    // 物料详情
    handleBOMDetailView (row) {
      this.$mesBasicInfoTable.show(this.$t(`msg['物料详情']`), {
          table: {
            props: [
              this.$t(`msg['物料名称']`), this.$t(`msg['规格']`),
              this.$t(`msg['型号']`), this.$t(`msg['供应商']`),
              this.$t(`msg['单位']`), this.$t(`msg['备注']`),
              this.$t(`msg['类型']`), this.$t(`msg['需求量']`)
            ],
            values: [
              row.warehouse_material_name, row.warehouse_material_standard,
              row.warehouse_material_model, row.supplier_name,
              row.warehouse_material_units, row.plan_quotes_material_describe,
              row.plan_quotes_material_type, row.plan_required_amount
            ]
          }
        })
    },
    // 工单信息
    handleWordOrderDetailView (row) {
      queryWorkOrderParticulars({workOrderId: row.work_order_id}).then(res => {
        if (res.status === 0) {
          let row = res.map.workOrder
          this.$mesBasicInfoTable.show(this.$t(`msg['工单详情']`), {
          table: {
            props: [
              this.$t(`msg['工单号']`), this.$t(`msg['预计产出量']`),
              this.$t(`msg['生产车间']`), this.$t(`msg['工单创建人']`),
              this.$t(`msg['工单负责人']`), this.$t(`msg['工序负责人']`),
              this.$t(`msg['预定开始时间']`), this.$t(`msg['预定完成时间']`),
              this.$t(`msg['实际开始时间']`), this.$t(`msg['实际完成时间']`),
              this.$t(`msg['实际产出量']`), this.$t(`msg['班次']`),
              this.$t(`msg['工序名称']`), this.$t(`msg['工序编号']`),
              this.$t(`msg['级性']`), this.$t(`msg['工序版本号']`),
              this.$t(`msg['工序优率']`), this.$t(`msg['半成品单位']`),
              this.$t(`msg['半成品类型']`), this.$t(`msg['半成品型号']`),
              this.$t(`msg['创建时间']`)
            ],
            values: [
              row.work_order_number, row.work_order_expected_output,
              row.role_workshop_name, row.work_order_creators,
              row.work_order_responsible, row.planQuotesWorkstage.workstage_responsible,
              this.getTime(row.work_order_scheduled_start_time), this.getTime(row.work_order_estimated_completion_time),
              this.getTime(row.work_order_actual_start_time), this.getTime(row.work_order_actual_finish_time),
              row.work_order_actual_output, row.work_order_classes,
              row.planQuotesWorkstage.workstage_name, row.planQuotesWorkstage.workstage_number,
              row.planQuotesWorkstage.workstage_polarity, row.planQuotesWorkstage.workstage_versions,
              row.planQuotesWorkstage.workstage_quality_rate, row.planQuotesWorkstage.semi_finish_unit,
              row.planQuotesWorkstage.semi_finish_type_name, row.planQuotesWorkstage.semi_finish_genre,
              this.getTime(row.work_order_creation_time)
            ]
          }
        })
        }
      })
    },
    // 工单过程
    handleWordOrderProcessView (row) {
      let param = { workOrderId: row.work_order_id }
      this.visibleWorkOrderDialog = true
      this.loading.workOrderProcessLoading = true
      queryWorkOrderProcessParticulars(param).then(res => {
        this.loading.workOrderProcessLoading = false
        if (res.status === 0) {
          this.workOrderProcess = res.map.processRecord
        }
      })
    },
    scheduleStatus (item) {
      if (item.workOrderStatus.plan_production_status === '3') {
        return 'success'
      } else {
        return 'process'
      }
    },
    print () {
      let delayTime = 0
      if (this.activeCollapseNames.length < 3) {
        // 全部展开后再打印
        this.activeCollapseNames = ['1', '2', '3']
        delayTime = 500
      }
      setTimeout(() => {
        utils.print(this.$refs.printable.$el)
      }, delayTime)
    }
  },
  watch: {
    visibleDialog (val) {
      this.$emit('update:visible', val)
    },
    visible (val) {
      this.visibleDialog = val
      if (val) {
        this.initData(this.activeTabName)
      } else {
        this.clearData()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
