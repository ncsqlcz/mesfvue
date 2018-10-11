<!--刘川中 2018.5.15-->
<template>
  <section class="content">
    <el-tabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
      <!-- 等待审核 -->
      <el-tab-pane :label="$t(`msg['等待审核']`)" name="waitCheck">
        <my-plan-table :filters="statusConfig['waitCheck'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['waitCheck'].detailsDialogConfig"
          v-if="activeTabName==='waitCheck' || statusConfig['waitCheck'].visited">
        </my-plan-table>
      </el-tab-pane>
      <!-- 审核历史 -->
      <el-tab-pane :label="$t(`msg['审核历史']`)" name="checkHistory">
        <my-plan-table :filters="statusConfig['checkHistory'].filters" :user-id="getUser.userId"
          :details-dialog-config="statusConfig['checkHistory'].detailsDialogConfig"
          v-if="activeTabName==='checkHistory' || statusConfig['checkHistory'].visited">
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
    name: 'm-plan-audited',
    data () {
      return {
        activeTabName: 'waitCheck',
        statusConfig: {
          'waitCheck': {
            visited: true,
            filters: {
              type: 'check',
              employeeType: 'verifier_staff',
              checkStatus: 'waitCheck'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              show: {
                details: true,
                process: true,
                progress: true,
                approval: true,
                operation: false
              }
            }
          },
          'checkHistory': {
            visited: false,
            filters: {
              type: 'check',
              employeeType: 'verifier_staff',
              checkStatus: 'checkHistory'
            },
            detailsDialogConfig: {
              activeTabName: 'details',
              type: '我审核的',
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
