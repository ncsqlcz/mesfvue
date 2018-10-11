<!--刘川中 2018.4.12-->
<template>
  <section>
    <div class="detail-table mt-4">
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">工单号</p>
          <p class="td-value">{{ order.work_order_number }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">所属生产批号</p>
          <p class="td-value">{{ order.plan.production_plan_batch_number }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">产品型号</p>
          <p class="td-value">{{ order.plan.product_model_name }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">工艺</p>
          <p class="td-value">{{ order.plan.craft_name}}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">工艺版本</p>
          <p class="td-value">{{ order.plan.craft_versions }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">工序</p>
          <p class="td-value">{{ order.planQuotesWorkstage.workstage_name }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">工序优率</p>
          <p class="td-value">{{ order.planQuotesWorkstage.workstage_quality_rate }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">工序负责人</p>
          <p class="td-value">{{ order.planQuotesWorkstage.workstage_responsible }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">极性</p>
          <p class="td-value">{{ order.planQuotesWorkstage.workstage_polarity }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">半成品类型</p>
          <p class="td-value">{{ order.planQuotesWorkstage.semi_finish_type_name }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">半成品型号</p>
          <p class="td-value">{{ order.planQuotesWorkstage.semi_finish_genre }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">预计产出量</p>
          <p class="td-value">{{ order.work_order_expected_output }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">半成品单位</p>
          <p class="td-value">{{ order.planQuotesWorkstage.semi_finish_unit }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">生产线</p>
          <p class="td-value">{{ order.plan.product_line_name }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">生产车间</p>
          <p class="td-value">{{ order.role_workshop_name }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">生产优先级</p>
          <p class="td-value">{{ order.plan.production_plan_production_priority }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">工单创建人</p>
          <p class="td-value">{{ order.work_order_creators }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">工单负责人</p>
          <p class="td-value">{{ order.work_order_responsible }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">工单创建时间</p>
          <p class="td-value">{{ getTime(order.work_order_creation_time) }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">预定开始日期</p>
          <p class="td-value">{{ getTime(order.work_order_scheduled_start_time) }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">预定完成时间</p>
          <p class="td-value">{{ getTime(order.work_order_estimated_completion_time) }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">实际产出量</p>
          <p class="td-value">{{ order.work_order_actual_output }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">实际开始时间</p>
          <p class="td-value">{{ order.work_order_actual_start_time }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name">实际完成日期</p>
          <p class="td-value">{{ order.work_order_actual_finish_time }}</p>
        </div>
      </div>
      <div class="detail-table-row">
        <div class="w-33 detail-table-item">
          <p class="th-name">班次</p>
          <p class="td-value">{{ order.work_order_classes }}</p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name"></p>
          <p class="td-value"></p>
        </div>
        <div class="w-33 detail-table-item">
          <p class="th-name"></p>
          <p class="td-value"></p>
        </div>
      </div>
    </div>
    <!--其它参数-->
    <div class="mt-4">
	  	<component :is="currentWorkStep"
                 v-if="order.planQuotesWorkstage.workstage_id"
                 :workstage-ids='order.planQuotesWorkstage.workstage_id'
                 :work-order-id='workOrderId'
  		></component>
    </div>

  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryWorkOrderParticulars } from '../../../api/api'
  import WorkStep from '../../../components/WorkStep'
  // import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'work-order-detail',
    data () {
      return {
        type: '',
        workOrderId: this.$router.history.current.params.id,
        order: {
          plan: {},
          planQuotesWorkstage: {},
          workOrderStatus: {}
        },
        currentWorkStep: 'WorkStep'
      }
    },
    components: { WorkStep },
    mounted () {
      queryWorkOrderParticulars({workOrderId: this.workOrderId}).then(res => {
        if (res.status === 0) {
          this.order = res.map.workOrder
        }
      })
    },
    methods: {
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
      }
    }
  }
</script>

<style scoped>

</style>
