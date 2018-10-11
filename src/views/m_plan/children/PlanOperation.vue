<!--刘川中 2018.5.18-->
<template>
  <section>
    <!-- 生产计划操作 -->
    <el-dialog
      title="生产计划操作"
      :visible.sync="visibleDialog"
      width="40%"
      class="mes-dialog">
      <el-row class="border p-4">
        <el-col :span="24" v-if="config.type === '我发起的'">
            <el-row class="mb-4">
              <el-col :span="24">
                <el-button :disabled="!config.enableBtns.resubmit" type="primary" size="medium" @click="planResubmit">{{ $t(`msg['重新发起']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.issued" type="primary" size="medium" @click="planIssued">{{ $t(`msg['下发']`) }}</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-button :disabled="!config.enableBtns.recoverPlan" type="primary" size="medium" @click="planRecoverPlan">{{ $t(`msg['恢复计划']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.closeProduction" type="primary" size="medium" @click="planCloseProduction">{{ $t(`msg['申请关闭']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.perpetualClose" type="primary" size="medium" @click="planPerpetualClose">{{ $t(`msg['关闭']`) }}</el-button>
              </el-col>
            </el-row>
        </el-col>
        <el-col :span="24" v-if="config.type === '我审核的'">
          <el-row>
              <el-col :span="24">
                <el-button :disabled="!config.enableBtns.approvalHandle" type="primary" size="medium" @click="planApprovalHandle">{{ $t(`msg['计划审批']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.careof" type="primary" size="medium" @click="planCareof">{{ $t(`msg['转交']`) }}</el-button>
              </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" v-if="config.type === '我负责的'">
          <el-row>
              <el-col :span="24">
                <el-button :disabled="!config.enableBtns.pauseProduction" type="primary" size="medium" @click="pauseProduction">{{ $t(`msg['暂停生产']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.continueProduction" type="primary" size="medium" @click="continueProduction">{{ $t(`msg['恢复生产']`) }}</el-button>
                <el-button :disabled="!config.enableBtns.finishProduction" type="primary" size="medium" @click="finishProduction">{{ $t(`msg['完成生产']`) }}</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="visibleDialog = false">{{ $t(`msg['关闭']`) }}</el-button>
      </span>
    </el-dialog>
  </section>

</template>

<script>
import utils from '../../../common/js/utils'
import '../../../styles/print.css'
import {

} from '../../../api/api'
export default {
  name: 'plan-operation',
  data () {
    return {
      visibleDialog: this.visible,
      visibleWorkOrderDialog: false,
      btnConfig: {
      }
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
          type: '我发起的',
          enableBtns: {}
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    // 重新发起
    planResubmit () {
      this.$confirm('确定重新发起该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planResubmit')
          
        }
      })
    },
    // 下发
    planIssued () {
      this.$confirm('确定下发该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planIssued')
          
        }
      })
    },
    // 恢复计划
    planRecoverPlan () {
      this.$confirm('确定恢复计划该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planRecoverPlan')
          
        }
      })
    },
    // 申请关闭
    planCloseProduction () {
      this.$confirm('确定申请关闭该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planCloseProduction')
          
        }
      })
    },
    // 关闭
    planPerpetualClose () {
      this.$confirm('确定关闭该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planPerpetualClose')
          
        }
      })
    },
    // 计划审批
    planApprovalHandle () {
      this.$confirm('确定计划审批该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planApprovalHandle')
          
        }
      })
    },
    // 转交
    planCareof () {
      this.$confirm('确定转交该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('planCareof')
          
        }
      })
    },
    // 暂停生产
    pauseProduction () {
      this.$confirm('确定暂停生产该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('pauseProduction')
          
        }
      })
    },
    // 恢复生产
    continueProduction () {
      this.$confirm('确定恢复生产该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('continueProduction')
          
        }
      })
    },
    // 完成生产
    finishProduction () {
      this.$confirm('确定完成生产该计划吗？', {
        title: '提示',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          console.log('finishProduction')
          
        }
      })
    },
  },
  watch: {
    visibleDialog (val) {
      this.$emit('update:visible', val)
    },
    visible (val) {
      this.visibleDialog = val
    },
    config (val) {
      this.btnConfig = val
    }
  }
}
</script>

<style scoped lang="scss">

</style>
