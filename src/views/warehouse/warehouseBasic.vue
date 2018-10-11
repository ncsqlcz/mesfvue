/* * @Author:danqihao * @Date: 2018-04-08 17:43:48 * @Last Modified by: danqihao * @Last Modified time: 2018-04-13 10:09:30
*/

<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="6">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addMaterial">新增</el-button>
        <el-button type="primary" size="medium" icon="el-icon-circle-plus">导入物料信息</el-button>
      </el-col>
      <el-col :span="4" :offset="14">
        <el-input placeholder="请输入内容" size="medium" v-model="req.value" @keyup.native.enter="searchs">
          <el-button slot="append" icon="el-icon-search" @click="searchs"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="物料名称">
              <span>{{ props.row.warehouse_material_name }}</span>
            </el-form-item>
            <el-form-item label="物料规格">
              <span>{{ props.row.warehouse_material_standard }}</span>
            </el-form-item>
            <el-form-item label="所属类型">
              <span>{{ props.row.warehouse_material_type_name }}</span>
            </el-form-item>
            <el-form-item label="物料型号">
              <span>{{ props.row.warehouse_material_model }}</span>
            </el-form-item>
            <el-form-item label="物料单位">
              <span>{{ props.row.warehouse_material_units }}</span>
            </el-form-item>
            <el-form-item label="保质期(月)">
              <span>{{ props.row.warehouse_material_shelf_life }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="名称" prop="warehouse_material_name"> </el-table-column>
      <el-table-column label="规格" prop="warehouse_material_standard"> </el-table-column>
      <el-table-column label="型号" prop="warehouse_material_model"> </el-table-column>
      <el-table-column label="单位" prop="warehouse_material_units"> </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="editMaterial(scope.row)" type="primary">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_material_id)" type="danger">删除</el-button>
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
      <span slot="title" class="el-dialog__title" v-if="editType=='新增'">新增物料信息</span>
      <span slot="title" class="el-dialog__title" v-else>编辑物料信息</span>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" class="clearfix" size="small">
        <el-col :span="20">
          <el-form-item label="物料名称:" prop="materialName">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.materialName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="物料类型:" prop="materialTypeId">
            <el-select placeholder="请选择" v-model="form.materialTypeId">
              <el-option value="WMT01" label="固体" size="medium">固体 </el-option>
              <el-option value="WMT02" label="液体" size="medium">液体</el-option>
              <el-option value="WMT03" label="气体" size="medium">气体</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="物料规格:" prop="materialStandard">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.materialStandard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="物料型号:" prop="materialModel">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.materialModel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="单位:" prop="materialUnits">
            <el-input auto-complete="off" size="medium" clearable placeholder="请输入内容(必填)" v-model="form.materialUnits"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="保质期(月)" prop="materialShelfLife">
            <el-input-number :min="1" :max="120" v-model="form.materialShelfLife"></el-input-number>
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
  import { getWarehouseBasic, removeMaterialInfo, queryMaterials, saveMaterialInfos, modifyMaterialInfo } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'


  export default {
    data () {
      return {
        req: {
          type: 'inventory',
          headNum: 1,
          value: '',
          key: 'keyWord'
        },
        dataList: [],
        lines: 0, // 条数
        currenPage: 1, // 当前页
        pagesize: 10,   // 页码

        form: {
          materialId: '',
          materialName: '',
          materialTypeId: '',
          materialStandard: '',
          materialModel: '',
          materialUnits: '',
          materialShelfLife: '',
        },
        visible: {
          listLoading: false,
          addForm: false,
          editForm: false,
          addLoading: false,
          editLoading: false
        },
        rules: {
          materialName: [
            { required: true, message: '请输入物料名称', trigger: 'blur' }
          ],
          materialTypeId: [
            { required: true, message: '请选择物料类型', trigger: 'change' }
          ],
          materialStandard: [
            { required: true, message: '请输入物料规格', trigger: 'blur' }
          ],
          materialModel: [
            { required: true, message: '请输入物料型号', trigger: 'blur' }
          ],
          materialUnits: [
            { required: true, message: '请输入物料单位', trigger: 'blur' }
          ],
          materialShelfLife: [
            { required: true, message: '请输入保质期(月)', trigger: 'blur' }
          ],
        },
        editType: ''
      }
    },
    computed: {
      ...mapGetters(['getDeviceTypes'])
    },
    mounted () {
      this.initDevicesTypes()
      this.getMaterials()
    },
    methods: {
      ...mapActions(['initDevicesTypes']),
      //  获取用户列表
      getMaterials () {
        this.req.type = 'inventory'
        getWarehouseBasic(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.materials
            this.lines = data.map.materialInventryLine
          } else {
            this.dataList = []
            this.lines = 0
          }
        })
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        if (this.req.value == '') {
          this.getMaterials()
        } else {
          queryMaterials (this.req).then((data) => {
            if (data.status === 0) {
              this.dataList = data.map.materials
              this.lines = data.map.materialInfoLine
            } else {
              this.dataList = []
              this.lines = 0
            }
          })
        }
      },
      // 搜索框
      searchs () {
        this.req.headNum = 1
        this.req.type = 'info'
        queryMaterials (this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.materials
            this.lines = data.map.materialInfoLine
          } else {
            this.dataList = []
            this.lines = 0
          }
        })
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeMaterialInfo({
            materialId: val
          }).then((data) => {
            if (data.status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getMaterials()
            } else {
              this.$message({
                type: 'danger',
                message: '删除失败'
              });
            }
          })
        })
      },
      addMaterial () {
        this.editType = '新增'
        this.visible.addForm = true
        this.resetForm()
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
              if (this.editType == '新增') {
                saveMaterialInfos(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.visible.addForm = false
                    this.getMaterials()
                  } else {
                    this.$message({
                      type: 'danger',
                      message: data.msg
                    });
                  }
                })
              } else if (this.editType == '编辑') {
                modifyMaterialInfo(
                  this.form
                ).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      type: 'success',
                      message: '修改成功'
                    });
                    this.visible.addForm = false
                    this.getMaterials()
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
      editMaterial (val) {
        this.editType = '编辑'
        this.visible.addForm = true
        this.form.materialId = val.warehouse_material_id
        this.form.materialName = val.warehouse_material_name
        this.form.materialTypeId = val.warehouse_material_type_id
        this.form.materialStandard = val.warehouse_material_standard
        this.form.materialModel = val.warehouse_material_model
        this.form.materialUnits = val.warehouse_material_units
        this.form.materialShelfLife = val.warehouse_material_shelf_life
      },
      resetForm () {
        this.form = {
          materialId: '',
          materialName: '',
          materialTypeId: '',
          materialStandard: '',
          materialModel: '',
          materialUnits: '',
          materialShelfLife: '',
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