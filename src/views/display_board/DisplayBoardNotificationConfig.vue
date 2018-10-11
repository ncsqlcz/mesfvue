/*
 * @Author: liucz 
 * @Date: 2018-06-12 13:51:27 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-06-21 16:16:35
 */
<template>
  <section>
    <el-row class="p-3">
      <el-col :span="24">
        <el-form @submit.native.prevent>
          <el-form-item :label="$t(`msg['发送内容']`)">
            <el-input v-model.trim="content" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="send" :disabled="content===''">{{ $t(`msg['发送']`) }}</el-button>
            <el-button size="medium" type="" @click="close" :disabled="contentId===''">{{ $t(`msg['关闭通知']`) }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import { 
    querySpectacularsMessage, deleteSpectacularsMessage,
    insertSpectacularsMessage
    } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'display-board-notification-config',
    data () {
      return {
        content: '',
        contentId: ''
      }
    },
    computed: {
      ...mapGetters({
        getUser: 'getUser'
      })
    },
    mounted () {
      this.initPage()
    },
    methods: {
      ...mapActions([]),
      initPage () {
        querySpectacularsMessage().then(res => {
          if (res.status === 0) {
            this.content = res.data.system_dynamic_message_body
            this.contentId = res.data.system_dynamic_message_id
          } else {
            this.content = ''
            this.contentId = ''
          }
        })
      },
      send () {
        if (this.content === '') {
          this.$message.info(this.$t(`msg['内容不能为空']`))
        } else {
          insertSpectacularsMessage({messageBody: this.content}).then(res => {
            if (res.status === 0) {
              this.$message.success(this.$t(`msg['成功']`))
            } else {
              this.$message.warning(res.msg || this.$t(`msg['失败']`))
            }
            this.initPage()
          })
          // this.$message.success(this.$t(`msg['成功']`))
          // this.initPage()
          // this.$message.success(this.$t(`msg['失败']`))
        }
      },
      close () {
        if (this.contentId !== '') {
          this.$confirm('确认关闭消息吗？', {
            title: '提示',
            type: 'warning'
          }).then(action => {
            if (action === 'confirm') {
              deleteSpectacularsMessage({messageId: this.contentId}).then(res => {
                if (res.status === 0) {
                  this.$message.success(this.$t(`msg['已关闭']`))
                } else {
                  this.$message.warning(res.msg || this.$t(`msg['失败']`))
                }
                this.initPage()
              })
            }
          }).catch(() => {})
        }
      }
    },
    watch: {}
  }
</script>

<style scoped lang="scss">

</style>

<style>
</style>