/* * @Author:danqihao * @Date: 2018-04-08 17:43:48 * @Last Modified by: danqihao * @Last Modified time: 2018-04-16 14:38:45
*/

<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="12">
        <el-button type="primary" size="medium" icon="el-icon-arrow-left" @click="back">返回</el-button>
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="add">新增成品类型</el-button>
      </el-col>
      <el-col :span="4" :offset="4">
        <el-select placeholder="请选择类型" size="medium" @change="statusChangge()" v-model="req.status">
          <el-option value="0" label="启用" size="medium"></el-option>
          <el-option value="1" label="弃用" size="medium"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入内容" size="medium" v-model="req.keyWord" @keyup.native.enter="statusChangge">
          <el-button slot="append" icon="el-icon-search" @click="statusChangge"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="类型名称">
              <span>{{ props.row.product_type_name }}</span>
            </el-form-item>
            <el-form-item label="类型编号">
              <span>{{ props.row.product_type_number }}</span>
            </el-form-item>
            <el-form-item label="类型描述">
              <span>{{ props.row.product_type_describe }}</span>
            </el-form-item>
            <el-form-item label="使用状态">
              <span>{{ props.row.product_type_status ==="0"?"启用":"弃用" }}</span>
            </el-form-item>
            <el-form-item label="创建人员">
              <span>{{ props.row.product_type_creation_staff }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.product_type_creation_time | times }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="类型名称" prop="product_type_name"> </el-table-column>
      <el-table-column label="类型编号" prop="product_type_number"> </el-table-column>
      <el-table-column label="类型描述" prop="product_type_describe"> </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-delete" @click="changeStatus(scope.row.product_model_type_id)" type="danger" v-if="scope.row.product_type_status == 0 ">弃用</el-button>
          <el-button size="small" icon="el-icon-delete" @click="changeStatus(scope.row.product_model_type_id)" type="primary" v-else>启用</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-row>
      <el-col class="text-right">
        <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next" :current-page="currenPage"
          :page-size="pagesize" :total=lines></el-pagination>
      </el-col>
    </el-row>

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="40%">
      <span slot="title" class="el-dialog__title">新增成品类型</span>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" class="clearfix" size="small">
        <el-col :span="20">
          <el-form-item label="类型名称:" prop="typeName">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.typeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="类型编号:" prop="typeNumber">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.typeNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="类型描述:">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.typeDescribe"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { getProductTypeList, modifyProductTypeStatus, saveProductType } from '../../../api/api'
  import { mapGetters, mapActions } from 'vuex'


  export default {
    data() {
      return {
        req: {
          type: 'vague',
          headNum: 1,
          status: '0',
          keyWord: ''
        },
        dataList: [],
        lines: 0, // 条数
        currenPage: 1, // 当前页
        pagesize: 10,   // 页码

        form: {
          typeName: '',
          typeNumber: '',
          typeDescribe: '',
          creationStaff: '',
          creationStaffId: '',
        },
        visible: {
          loading: false,
          addForm: false,
        },
        rules: {
          typeName: [
            { required: true, message: '请输入类型名称', trigger: 'blur' }
          ],
          typeNumber: [
            { required: true, message: '请输入类型编号', trigger: 'blur' }
          ]
        },
      }
    },
    computed: {
      ...mapGetters(['getUser'])
    },
    mounted() {
      this.getBasic()
    },
    methods: {
      //  获取用户列表
      getBasic () {
        this.visible.loading = true
        getProductTypeList(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.productTypes
            this.lines = data.map.lines
            this.visible.loading = false
          } else {
            this.dataList = []
            this.lines = 0
            this.visible.loading = false
          }
        })
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getBasic()
      },
      statusChangge () {
        this.req.headNum = 1
        this.getBasic()
      },
      add () {
        this.visible.addForm = true
        this.resetForm()
      },
      addSubmit () {
        this.form.creationStaff = this.getUser.userName
        this.form.creationStaffId = this.getUser.userId
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确定添加此条信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              saveProductType(
                this.form
              ).then((data) => {
                if (data.status === 0) {
                  this.$message({
                    type: 'success',
                    message: '添加成功'
                  });
                  this.visible.addForm = false
                  this.getBasic()
                } else {
                  this.$message({
                    type: 'danger',
                    message: data.msg
                  });
                }
              })
            })
          } else {
            this.$message({
              type: 'danger',
              message: '添加失败'
            });
          }
        });
      },
      changeStatus (val) {
        const statusName = this.req.status == '0' ? '弃用' : '启用'
        const statusType = this.req.status == '0' ? 'deprecated' : 'recover'
        this.$confirm('确定' + statusName + '此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          modifyProductTypeStatus({
            type: statusType,
            'productTypeIds[]': val
          }).then((data) => {
            if (data.status === 0) {
              this.$message({
                type: 'success',
                message: statusName + '成功'
              });
              this.getBasic()
            } else {
              this.$message.error({ message: statusName + '失败' });
            }
          })
        })
      },
      back () {
        window.history.go(-1)
      },
      resetForm () {
        this.form = {
          typeName: '',
          typeNumber: '',
          typeDescribe: '',
        }
      }
    },
    filters: {
      times(val) {
        return utils.formatDate.format(new Date(val), 'yyyy-MM-dd hh:mm:ss')
      }
    },
    watch: {}
  }
</script>

<style scoped lang="scss">
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;
  }

  td.el-table__expanded-cell[class*=cell] {
    padding: 20px 105px !important;
  }

  th {
    padding: 5px 0 !important;
  }
</style>