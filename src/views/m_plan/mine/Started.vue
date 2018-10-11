
  <!--刘川中 20
18.5.15-->
<template>
  <section class="content">
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <!-- 审核中 -->
      <el-tab-pane :label="$t(`msg['审核中']`)" name="checkUnderway">
        <my-plan-table :filters="statusConfig['checkUnderway'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['checkUnderway'].detailsDialogConfig"
          v-if="activeTabName==='checkUnderway' || statusConfig['checkUnderway'].visited">
        </my-plan-table>
      </el-tab-pane>
      <!-- 生产中 -->
      <el-tab-pane :label="$t(`msg['生产中']`)" name="inProduction">
        <my-plan-table :filters="statusConfig['inProduction'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['inProduction'].detailsDialogConfig"
          v-if="activeTabName==='inProduction' || statusConfig['inProduction'].visited">
        </my-plan-table>
      </el-tab-pane>
      <!-- 已完成 -->
      <el-tab-pane :label="$t(`msg['已完成']`)" name="complete">
        <my-plan-table :filters="statusConfig['complete'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['complete'].detailsDialogConfig"
          v-if="activeTabName==='complete' || statusConfig['complete'].visited">
        </my-plan-table>
      </el-tab-pane>
      <!-- 已停止 -->
      <el-tab-pane :label="$t(`msg['已停止']`)" name="stop">
        <my-plan-table :filters="statusConfig['stop'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['stop'].detailsDialogConfig"
          v-if="activeTabName==='stop' || statusConfig['stop'].visited">
        </my-plan-table>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryDraftPlanOutline } from '../../../api/api'
  import { mapGetters, mapActions } from 'vuex'
  import MyPlanTable from '../children/PlanTable.vue'

  export default {
    name: 'm-plan-started',
    data () {
      return {
        activeTabName: 'checkUnderway',
        statusConfig: {
          'checkUnderway': {  // 审核中
            visited: true,
            filters: {
              type: 'check',
              employeeType: 'founder_staff',
              checkStatus: 'checkUnderway'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              type: '我发起的',
              show: {
                details: true,
                process: true,
                progress: false,
                approval: false,
                operation: true
              }
            }
          },
          'inProduction': { // 生产中
            visited: false,
            filters: {
              type: 'production',
              employeeType: 'founder_staff',
              productionStatus: 'inProduction'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              type: '我发起的',
              show: {
                details: true,
                process: true,
                progress: true,
                approval: true,
                operation: true
              }
            }
          },
          'complete': { // 已完成
            visited: false,
            filters: {
              type: 'production',
              employeeType: 'founder_staff',
              productionStatus: 'complete'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              type: '我发起的',
              show: {
                details: true,
                process: true,
                progress: true,
                approval: true,
                operation: false
              }
            }
          },
          'stop': { // 已停止
            visited: false,
            filters: {
              type: 'production',
              employeeType: 'founder_staff',
              productionStatus: 'stop'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              type: '我发起的',
              show: {
                details: true,
                process: true,
                progress: true,
                approval: true,
                operation: false
              }
            }
          }
        }
      }
    },
    components: { MyPlanTable },
    computed: {
      ...mapGetters(['getUser'])
    },
    mounted () {},
    methods: {
      ...mapActions([]),
      handleTabClick (tab, e) {
        // console.log(tab.name, e)
        this.statusConfig[tab.name].visited = true
      }
    }
  }
</script>

<style scoped lang="scss">
.content{
  margin-top: -1px;
}
</style>
