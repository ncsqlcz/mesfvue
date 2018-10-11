<template>
  <section class="form-section">
    <h3>密码修改</h3>
    <el-form :model="form" label-width="80px" label-position="right" :rules="formRules" ref="form" class="clearfix">
      <el-col :span="24">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model.trim="form.oldPassword" auto-complete="off" size="medium" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model.trim="form.newPassword" auto-complete="off" size="medium" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model.trim="form.checkPassword" auto-complete="off" size="medium" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" size="medium" @click.native="submit" :loading="visible.loading" class="w-100">确认修改</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { modifyUserPassword } from '../../../api/api'
  import {mapGetters} from 'vuex'
  export default {
    name: 'password',
    data () {
      return {
        form: {
          userId: '',
          oldPassword: '',
          newPassword: '',
          checkPassword: ''
        },
        formRules: {
          oldPassword: {required: true, validator: this.checkOldPassword, trigger: 'blur'},
          newPassword: {required: true, validator: this.checkNewPassword, trigger: 'blur'},
          checkPassword: {required: true, validator: this.checkPassword, trigger: 'blur'}
        },
        visible: {
          loading: false
        }
      }
    },
    computed: {
      ...mapGetters(['getUser'])
    },
    mounted () {
      this.form.userId = this.getUser.userId
    },
    methods: {
      checkOldPassword (rule, value, callback) {
        if (!value) {
          return callback(new Error('旧密码不能为空'))
        }
        if (!(utils.reg.password.test(value))) {
          callback(new Error('密码格式有误'))
          return false
        } else {
          callback()
        }
      },
      checkNewPassword (rule, value, callback) {
        if (!value) {
          return callback(new Error('新密码不能为空'))
        }
        if (!(utils.reg.password.test(value))) {
          callback(new Error('密码格式是大小写字母、数字组成的6-16位字符,不能纯数字或字母'))
          return false
        } else if (this.form.checkPassword !== '' && value !== this.form.checkPassword) {
          callback(new Error('密码不一致'))
          return false
        } else {
          callback()
        }
      },
      checkPassword (rule, value, callback) {
        if (!value) {
          return callback(new Error('确认密码不能为空'))
        }
        if (!(utils.reg.password.test(value))) {
          callback(new Error('密码格式是大小写字母、数字组成的6-16位字符,不能纯数字或字母'))
          return false
        } else {
          callback()
        }
      },
      submit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确认修改吗？', '提示', {}).then(() => {
              this.visible.loading = true
              modifyUserPassword(this.form).then((res) => {
                this.visible.loading = false
                if (res.status === 0) {
                  this.$message({ message: '修改成功', type: 'success' })
                  this.$refs['form'].resetFields()
                } else {
                  this.$message({ message: res.msg || '修改失败', type: 'warning' })
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .form-section{
    width: 450px;
    h3{
      padding-left: 225px;
    }
  }
</style>
