/* * @Author:danqihao * @Date: 2018-04-08 17:44:13 * @Last Modified by: danqihao * @Last Modified time: 2018-04-12 08:42:43
*/

<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="6">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addSupplier">新增</el-button>
      </el-col>
      <el-col :span="3" :offset="12">
        <el-select placeholder="请选择成品型号" size="medium" @change="getBasicInfo()" v-model="req.productModelId">
          <el-option value="" label="全部型号" size="medium"> </el-option>
          <el-option v-for="(val,index) in productModel" :value="val.warehouse_product_model_id" :key="index" :label="val.warehouse_product_model_name"
            size="medium">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="请输入内容" size="medium" @keyup.native.enter="searchs" v-model="req.productName">
          <el-button slot="append" icon="el-icon-search" @click="getBasicInfo()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="成品名称:">
              <span>{{ props.row.warehouse_product_name }}</span>
            </el-form-item>
            <el-form-item label="成品型号:">
              <span>{{ props.row.productModel.warehouse_product_model_name }}</span>
            </el-form-item>
            <el-form-item label="电芯尺寸(直径/高度):">
              <span>{{ props.row.warehouse_product_size }}</span>
            </el-form-item>
            <el-form-item label="电芯容量(mAh):">
              <span>{{ props.row.warehouse_product_capacity }}</span>
            </el-form-item>
            <el-form-item label="电芯内阻(MaxmΩ):">
              <span>{{ props.row.warehouse_product_resistance }}</span>
            </el-form-item>
            <el-form-item label="电芯电压(v):">
              <span>{{ props.row.warehouse_product_voltage }}</span>
            </el-form-item>
            <el-form-item label="电芯K值(mV/d):">
              <span>{{ props.row.warehouse_product_k }}</span>
            </el-form-item>
            <el-form-item label="保质期(月):">
              <span>{{ props.row.warehouse_product_shelf_life }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="名称" prop="warehouse_product_name"> </el-table-column>
      <el-table-column label="型号" prop="productModel.warehouse_product_model_name"> </el-table-column>
      <el-table-column label="电芯容量(mAh)" prop="warehouse_product_capacity"> </el-table-column>
      <el-table-column label="电芯内阻(MaxmΩ)" prop="warehouse_product_resistance"> </el-table-column>
      <el-table-column label="电芯电压(v)" prop="warehouse_product_voltage"> </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="editProduct(scope.row)" type="primary">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_product_id)" type="danger">删除</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="50%">
      <span slot="title" class="el-dialog__title" v-if="visible.addFormType">新增成品信息</span>
      <span slot="title" class="el-dialog__title" v-else>编辑成品信息</span>
      <el-form :model="form" label-width="180px" :rules="rules" ref="form" class="clearfix" size="small">
        <el-col :span="12">
          <el-form-item label="成品名称:" prop="productName">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯型号:" prop="productModelId">
            <el-select placeholder="请选择" v-model="form.productModelId" style="height:36px">
              <el-option v-for="(val,index) in productModel" :value="val.warehouse_product_model_id" :key="index" :label="val.warehouse_product_model_name"
                size="medium">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯尺寸(直径/高度):" prop="productSize">
            <el-input auto-complete="off" type="number" min=0 size="medium" placeholder="请输入内容(必填)" v-model="form.productSize"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯容量(mAh)" prop="productCapacity">
            <el-input auto-complete="off" type="number" min=0 size="medium" placeholder="请输入内容(必填)" v-model="form.productCapacity"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯内阻(MaxmΩ):" prop="productResistance">
            <el-input auto-complete="off" type="number" min=0 size="medium" placeholder="请输入内容(必填)" v-model="form.productResistance"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯电压(v):" prop="productVoltage">
            <el-input auto-complete="off" type="number" min=0 size="medium" placeholder="请输入内容(必填)" v-model="form.productVoltage"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电芯K值(mV/d):" prop="productK">
            <el-input auto-complete="off" type="number" min=0 size="medium" placeholder="请输入内容(必填)" v-model="form.productK"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保质期(月):">
            <el-input-number :min="0" :max="120" v-model="form.productShelfLife"></el-input-number>
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
  // import utils from '../../common/js/utils'
  import { queryProductInfos, saveProductInfos, removeProductInfos, modifyProductInfo } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        req: {
          productId: '',
          productName: '',
          productModelId: '',
          headNum: 1
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
          productId: '',
          productName: '',
          productModelId: '',
          productSize: '',
          productCapacity: '',
          productResistance: '',
          productVoltage: '',
          productK: '',
          productShelfLife: ''
        },
        rules: {
          productName: [
            { required: true, message: '请输入成品名称', trigger: 'blur' }
          ],
          productModelId: [
            { required: true, message: '请选择成品型号', trigger: 'blur' }
          ],
          productSize: [
            { required: true, message: '请输入成品尺寸', trigger: 'blur' }
          ],
          productCapacity: [
            { required: true, message: '请输入成品容量', trigger: 'blur' }
          ],
          productResistance: [
            { required: false, message: '请输入成品电阻', trigger: 'blur' }
          ],
          productVoltage: [
            { required: false, message: '请输入成品电压', trigger: 'blur' }
          ],
          productK: [
            { required: false, message: '请输入成品K值', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapGetters(['productModel'])
    },
    mounted () {
      this.getBasicInfo()
      this.initProductModel()
    },
    methods: {
      ...mapActions(['initProductModel']),
      getBasicInfo () {
        this.visible.loading = true
        queryProductInfos(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.products
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
        if (this.form.productName !== '') {
          this.resetForm()
        }
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getBasicInfo()
      },
      editProduct (val) {
        this.visible.addFormType = false
        this.visible.addForm = true
        this.form.productId = val.warehouse_product_id
        this.form.productName = val.warehouse_product_name
        this.form.productModelId = val.productModel.warehouse_product_model_id
        this.form.productSize = val.warehouse_product_size
        this.form.productCapacity = val.warehouse_product_capacity
        this.form.productResistance = val.warehouse_product_resistance
        this.form.productVoltage = val.warehouse_product_voltage
        this.form.productK = val.warehouse_product_k
        this.form.productShelfLife = val.warehouse_product_shelf_life
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeProductInfos({
            productId: val
          }).then((data) => {
            if (data.status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getBasicInfo()
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
                saveProductInfos(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.visible.addForm = false
                    this.getBasicInfo()
                  } else {
                    this.$message({
                      type: 'danger',
                      message: data.msg
                    });
                  }
                })
              } else if (!this.visible.addFormType) {
                modifyProductInfo(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '修改成功'
                    });
                    this.visible.addForm = false
                    this.getBasicInfo()
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
          productId: '',
          productName: '',
          productModelId: '',
          productSize: '',
          productCapacity: '',
          productResistance: '',
          productVoltage: '',
          productK: '',
          productShelfLife: ''
        }
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