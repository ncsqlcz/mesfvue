/* * @Author:danqihao * @Date: 2018-04-08 17:44:13 * @Last Modified by: danqihao * @Last Modified time: 2018-04-12 08:44:04
*/

<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="6">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addSupplier">新增</el-button>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="名称" prop="supplier_name"> </el-table-column>
      <el-table-column label="性质" prop="supplier_property"> </el-table-column>
      <el-table-column label="电话" prop="supplier_phone"> </el-table-column>
      <el-table-column label="地址" prop="supplier_address" width="350"> </el-table-column>
      <el-table-column label="邮箱" prop="supplier_email"> </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="editSupplier(scope.row)" type="primary">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.supplier_id)" type="danger">删除</el-button>
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
      <span slot="title" class="el-dialog__title" v-if="visible.addFormType">新增供应商信息</span>
      <span slot="title" class="el-dialog__title" v-else>编辑供应商信息</span>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" class="clearfix" size="small">
        <el-col :span="20">
          <el-form-item label="供应商名称:" prop="supplierName">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="供应商性质:" prop="supplierProperty">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.supplierProperty"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="供应商电话:" prop="supplierPhone">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.supplierPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="供应商地址" prop="supplierAddress">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.supplierAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="供应商邮箱:" prop="supplierEmail">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.supplierEmail"></el-input>
          </el-form-item>
        </el-col>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>



  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import { querySuppliers, saveSupplier, removeSuppliers, modifySuppliers } from '../../api/api'

  export default {
    data () {
      return {
        req: {
          type: 'all',
          headNum: 1,
          supplierId: ''
        },
        dataList: [],
        lines: 0, // 条数
        currenPage: 1, // 当前页
        pagesize: 10,   // 页码

        visible: {
          addForm: false,
          addFormType: true,
          loading: false
        },

        form: {
          supplierId: '',
          supplierName: '',
          supplierProperty: '',
          supplierPhone: '',
          supplierAddress: '',
          supplierEmail: ''
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          supplierProperty: [
            { required: true, message: '请输入供应商类型', trigger: 'blur' }
          ],
          supplierPhone: [
            { required: true, validator: utils.checkTel, trigger: 'blur' }
          ],
          supplierAddress: [
            { required: true, message: '请输入供应商地址', trigger: 'blur' }
          ],
          supplierEmail: [
            { required: false, validator: utils.checkEmail, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
    },
    mounted () {
      this.getSuppliers()
    },
    methods: {
      getSuppliers () {
        this.visible.loading = true
        querySuppliers(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.suppliers
            this.lines = data.map.lines
            this.visible.loading = false
          } else {
            this.dataList = []
            this.lines = 0
          }
          this.visible.loading = false
        })
      },
      addSupplier () {
        this.visible.addFormType = true
        this.visible.addForm = true
        if (this.form.supplierId !== '') {
          this.resetForm()
        }
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getSuppliers()
      },
      editSupplier (val) {
        this.visible.addFormType = false
        this.visible.addForm = true
        this.form.supplierId = val.supplier_id
        this.form.supplierName = val.supplier_name
        this.form.supplierProperty = val.supplier_property
        this.form.supplierPhone = val.supplier_phone
        this.form.supplierAddress = val.supplier_address
        this.form.supplierEmail = val.supplier_email
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeSuppliers({
            supplierId: val
          }).then((data) => {
            if (data.status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getSuppliers()
            } else {
              this.$message({
                type: 'danger',
                message: '删除失败'
              });
            }
          })
        })
      },
      addSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$confirm('确定添加此条物料信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              if (this.visible.addFormType) {
                saveSupplier(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.visible.addForm = false
                    this.getSuppliers()
                  } else {
                    this.$message({
                      type: 'danger',
                      message: data.msg
                    });
                  }
                })
              } else if (!this.visible.addFormType) {
                modifySuppliers(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '修改成功'
                    });
                    this.visible.addForm = false
                    this.getSuppliers()
                  } else {
                    this.$message({
                      type: 'danger',
                      message: data.msg
                    });
                  }
                })
              }
            })
          } else {
            this.$message({
              type: 'danger',
              message: '添加失败'
            });
          }
        });
      },
      resetForm () {
        this.form = {
          supplierId: '',
          supplierName: '',
          supplierProperty: '',
          supplierPhone: '',
          supplierAddress: '',
          supplierEmail: ''
        }
      }
    },
    watch: {}
  }
</script>

<style scoped lang="scss">
</style>