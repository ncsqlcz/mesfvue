/* * @Author: danqihao * @Date: 2018-04-10 14:04:56 * @Last Modified by: danqihao * @Last Modified time: 2018-04-12 17:18:51
*/
<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="3">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addCheck">盘点</el-button>
      </el-col>
      <el-col :span="21">
        <el-col :span="4" :offset="6">
          <el-select placeholder="请选择仓库" size="medium" @change="warehouseChange()" v-model="warehouseId">
            <el-option value="" label="全部仓库" size="medium"> </el-option>
            <el-option v-for="(val,index) in warehouseName" :value="val.warehouse_id" :key="index" :label="val.warehouse_name" size="medium">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select placeholder="请选择类型" size="medium" @change="typeChange()" v-model="materialType">
            <el-option value="" label="全部类型" size="medium"> </el-option>
            <el-option value="WMT01" label="固体" size="medium">固体 </el-option>
            <el-option value="WMT02" label="液体" size="medium">液体</el-option>
            <el-option value="WMT03" label="气体" size="medium">气体</el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker @change="timeChange()" v-model="timesList" type="daterange" align="right" size="small" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="selectTime">
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入内容" size="medium" @keyup.native.enter="searchs" v-model="searchsValue">
            <el-button slot="append" icon="el-icon-search" @click="searchs"></el-button>
          </el-input>
        </el-col>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="名称" prop="material.warehouse_material_name"> </el-table-column>
      <el-table-column label="规格" prop="material.warehouse_material_standard"> </el-table-column>
      <el-table-column label="型号" prop="material.warehouse_material_model"> </el-table-column>
      <el-table-column label="单位" prop="material.warehouse_material_units"> </el-table-column>
      <el-table-column label="账面数(数量/金额)" prop="supplier.supplier_name || '暂无数据'">
        <template slot-scope="scope">{{scope.row.warehouse_material_number }}/{{scope.row.warehouse_material_money || "null"}} </template>
      </el-table-column>
      <el-table-column label="盘盈亏(数量金额)">
        <template slot-scope="scope">{{scope.row.warehouse_material_check_number }}/{{scope.row.warehouse_material_check_money || "null"}} </template>
      </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="lookDetail(scope.row)" type="">详情</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_material_check_id)" type="danger">删除</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="60%">
      <span slot="title" class="el-dialog__title">库存盘点</span>
      <el-container>
        <el-main>
          <span style="height:40px; line-height:40px; display:block;padding:2px 10px" class="toolbar">基础信息</span>
          <el-row :gutter="20">
            <el-col :span="8">
              <div>
                <el-input placeholder="请输入内容" v-model="people" @click.native="selectPeople()">
                  <template slot="prepend">盘点人员</template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-input placeholder="请输入内容" v-model="addWarehouse" @click.native="selectWousehouse()">
                  <template slot="prepend">盘点仓库</template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <span class="time">盘点时间</span>
                <el-date-picker v-model="time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-container>
        <el-main>
          <span style="height:40px ;line-height:40px ;display:block;padding:2px 10px" class="toolbar">已选择的物料</span>
          <table>
            <thead>
              <tr>
                <th style="width: 8%;padding:5px 0"> 序号</th>
                <th style="width: 15%;">名称 </th>
                <th style="width: 10%;">规格</th>
                <th style="width: 10%;">型号</th>
                <th style="width: 8%;">单位</th>
                <th style="width: 10%;">账面数</th>
                <th style="width: 10%;">盘点数</th>
                <th style="width: 15%;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value,index) in selectMaterialList" :key="index">
                <td>{{index+1}}</td>
                <td>{{value.warehouse_material_name}}</td>
                <td>{{value.warehouse_material_standard}}</td>
                <td>{{value.warehouse_material_model}}</td>
                <td>{{value.warehouse_material_units}}</td>
                <td>
                  <el-input size="medium" placeholder="请输入内容(必填)" type="number" min=0 :value='value.entryNum' @blur="test(value.entryNum,index)"
                    v-model="selectMaterialList[index].entryNum"></el-input>
                </td>
                <td>
                  <el-input size="medium" placeholder="请输入内容(必填)" type="number" min=0 :value='value.checkNum' @blur="test(value.checkNum,index)"
                    v-model="selectMaterialList[index].checkNum"></el-input>
                </td>

                <td>
                  <el-button type="text" @click.native="removeSelect(index)">删除</el-button>
                </td>
              </tr>
              <tr v-show="!selectMaterialList.length">
                <td colspan=15 class="text-center text-warning">没有可以显示的数据，请重新选择</td>
              </tr>
            </tbody>
          </table>
        </el-main>
      </el-container>
      <el-container>
        <el-main>
          <el-row :gutter="20" class="toolbar" style="height:50px">
            <el-col :span="5">
              <span style="height:20px, line-height:20px">选择物料</span>
            </el-col>
            <!-- <el-col :span="4" :offset="9"> 
                            <el-select  placeholder="请选择类型" size="medium" @change="getMaterials()" v-model="moduleReq.materialTypeId">
                                <el-option  value="" label="全部类型"  size="medium"> </el-option>
                                <el-option  value="WMT01" label="固体"  size="medium">固体 </el-option>
                                <el-option  value="WMT02" label="液体"  size="medium">液体</el-option>
                                <el-option  value="WMT03" label="气体"  size="medium">气体</el-option>
                            </el-select>
                        </el-col> -->
            <!-- <el-col :span="4" > 
                            <el-select  placeholder="请选择仓库" size="medium" @change="getMaterials()" v-model="moduleReq.warehouseId">
                                <el-option  value="" label="全部仓库"  size="medium"> </el-option>
                                <el-option  v-for="(val,index) in warehouseName" 
                                :value="val.warehouse_id"
                                :key="index" 
                                :label="val.warehouse_name" 
                                size="medium">
                                </el-option>
                            </el-select>
                        </el-col> -->
            <el-col :span="5" :offset="14">
              <el-input placeholder="请输入内容" size="medium" v-model="moduleReq.value" @keyup.native.enter="materialSearchs">
                <el-button slot="append" icon="el-icon-search" @click="materialSearchs"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="materialList" style="width: 100% ;padding:3px 0" border>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="名称" prop="warehouse_material_name"> </el-table-column>
            <el-table-column label="类型" prop="warehouse_material_type_name"> </el-table-column>
            <el-table-column label="规格" prop="warehouse_material_standard"> </el-table-column>
            <el-table-column label="型号" prop="warehouse_material_model"> </el-table-column>
            <el-table-column label="单位" prop="warehouse_material_units"> </el-table-column>
            <!-- <el-table-column   label="出库数量"   prop="warehouse_material_batch_number">  </el-table-column> -->
            <el-table-column label="编辑" prop="">
              <template slot-scope="scope">
                <el-button size="small" icon="el-icon-circle-plus" @click="addMaterial(scope.row)" type="danger">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row>
            <el-col class="text-right">
              <el-pagination @current-change="MaterialhandleCurrentChange" background layout="total,prev,pager,next" :current-page="materialCurrenPage"
                :page-size="materialPagesize" :total=materialLines></el-pagination>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import { getWarehouseBasic, queryMaterials, removeMaterialChecks, saveMaterialChecks } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        req: {
          type: 'check',
          headNum: 1,
          key: '',
          value: ''
        },
        moduleReq: {
          type: 'inventory',
          headNum: 1,
          value: ''
        },
        dataList: [],
        warehouseId: '',
        materialType: '',
        searchsValue: '',
        lines: 0, // 条数
        currenPage: 1, // 当前页
        pagesize: 10,   // 页码
        visible: {
          addForm: false,
          addFormType: true,
          loading: false
        },
        selectTime: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timesList: '',
        selectMaterialList: [],
        materialList: [],
        materialLines: 0, // 条数
        materialCurrenPage: 1, // 当前页
        materialPagesize: 10,   // 页码
        people: '',
        peopleId: '',
        addWarehouse: '',
        addWarehouseId: '',
        time: '',
        addMaterialList: []
      }
    },
    computed: {
      ...mapGetters(['warehouseName'])
    },
    mounted () {
      this.initWarehouseName()
      this.getBasic()
    },
    methods: {
      ...mapActions(['initWarehouseName']),

      getBasic () {
        this.visible.loading = true
        getWarehouseBasic(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.materialChecks
            this.lines = data.map.materialCheckLines
            this.visible.loading = false
          } else {
            this.dataList = []
            this.lines = 0
            this.visible.loading = false
          }
        })
      },
      queryMaterial () {
        this.visible.loading = true
        queryMaterials(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.materialChecks
            this.lines = data.map.materialCheckLines
            this.visible.loading = false
          } else {
            this.visible.loading = false
            this.dataList = []
            this.lines = 0
          }
        })
      },
      handleCurrentChange (val) {
        if (this.req.key === '' || this.req.key === null || this.req.key === undefined) {
          this.req.headNum = (val - 1) * 10 + 1;
          this.getBasic()
        } else {
          this.req.headNum = (val - 1) * 10 + 1;
          this.queryMaterial()
        }
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeMaterialChecks({
            checkIds: val
          }).then((data) => {
            if (data.status === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getBasic()
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败'
              });
            }
          })
        })
      },
      addSubmit () {
        var addStatus = true
        if (this.people === '' || this.addWarehouse === '' || this.time === '') {
          this.$message({
            type: 'danger',
            message: '请填写或选择正确的基础信息'
          });
          return false
        }
        if (this.selectMaterialList.length !== 0) {
          this.addMaterialList = []
          this.selectMaterialList.forEach((val, index) => {
            if (val.checkNum <= 0 || val.entryNum <= 0) {
              this.$message({
                type: 'warning',
                message: '盘点数量或账面数量不能小于等于零'
              });
              addStatus = false
            }
            const temp = `${val.warehouse_material_id}:${val.entryNum}:${val.checkNum}`
            this.addMaterialList.push(temp)
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请填写或选择正确的物料信息'
          });
          return false
        }
        if (addStatus === true) {
          this.$confirm('确定添加此条物料信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            saveMaterialChecks({
              staffId: this.peopleId,
              warehouseCheckId: this.addWarehouseId,
              dateStr: this.time,
              materials: this.addMaterialList.toString()
            }).then((data) => {
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
                  message: '添加失败'
                });
              }
            })
          })
        }
      },
      warehouseChange () {
        if (this.warehouseId === '' || this.warehouseId === null || this.warehouseId === undefined) {
          this.req = {
            type: 'check',
            headNum: 1
          }
          this.getBasic()
        } else {
          this.req = {
            type: 'check',
            headNum: 1,
            key: 'warehouseId',
            value: this.warehouseId
          }
          this.queryMaterial()
        }
      },
      typeChange () {
        if (this.materialType === '' || this.materialType === null || this.materialType === undefined) {
          this.req = {
            type: 'check',
            headNum: 1
          }
          this.getBasic()
        } else {
          this.req = {
            type: 'check',
            headNum: 1,
            key: 'materialTypeId',
            value: this.materialType
          }
          this.queryMaterial()
        }
      },
      searchs () {
        if (this.searchsValue === '' || this.searchsValue === null || this.searchsValue === undefined) {
          this.req = {
            type: 'check',
            headNum: 1
          }
          this.getBasic()
        } else {
          this.req = {
            type: 'check',
            headNum: 1,
            value: this.searchsValue,
            key: 'keyWord'
          }
          this.queryMaterial()
        }
      },
      timeChange () {
        this.req = {
          type: 'check',
          headNum: 1,
          value: 1,
          key: 'date',
          startDate: this.timesList[0].getTime(),
          endDate: this.timesList[1].getTime()
        }
        this.queryMaterial()
      },
      // 查看详情
      lookDetail (row) {
        this.$mesBasicInfoTable.show(
          '盘点详情', {
            table: {
              props: ['物料名称:', '物料类型:', '物料规格:', '物料型号:', '单位:', '账面数数据量:', '账面数数据金额:', '盘盈亏数量:', '盘盈亏金额:', '盘点人员', '盘点时间:', '变动原因'],
              values: [row.material.warehouse_material_name, row.material.warehouse_material_type_name, row.material.warehouse_material_standard,
              row.material.warehouse_material_model, row.material.warehouse_material_units, row.warehouse_material_number || '暂无数据', row.warehouse_material_money || '暂无数据',
              row.warehouse_material_check_number || '暂无数据', row.warehouse_material_check_money || '暂无数据',
              row.staff ? row.staff.role_staff_name : '暂无数据', utils.formatDate.format(new Date(row.warehouse_material_check_time), 'yyyy-MM-dd hh:mm:ss'), row.warehouse_material_change_reason || '暂无数据']
            }
          })
      },
      //  获取物料列表
      getMaterials () {
        getWarehouseBasic(this.moduleReq).then((data) => {
          if (data.status === 0) {
            this.materialList = data.map.materials
            this.materialLines = data.map.materialInventryLine
          } else {
            this.materialList = []
            this.materialLines = 0
          }
        })
      },
      addGetMaterials () {
        queryMaterials(this.moduleReq).then((data) => {
          if (data.status === 0) {
            this.materialList = data.map.materials
            this.materialLines = data.map.materialInfoLine
          } else {
            this.materialList = []
            this.materialLines = 0
          }
        })
      },
      MaterialhandleCurrentChange (val) {
        if (this.moduleReq.value !== '') {
          this.moduleReq.headNum = (val - 1) * 10 + 1;
          this.addGetMaterials()
        } else {
          this.moduleReq.headNum = (val - 1) * 10 + 1;
          this.getMaterials()
        }
      },
      // 搜索框
      materialSearchs () {
        if (this.moduleReq.value !== '') {
          this.moduleReq = {
            type: 'info',
            headNum: 1,
            key: 'keyWord',
            value: this.moduleReq.value
          },
            this.addGetMaterials()
        } else {
          this.moduleReq = {
            type: 'inventory',
            headNum: 1,
            value: ''
          },
            this.getMaterials()
        }
      },
      addWarehouseChange () {
        this.moduleReq.headNum = 1
        this.getMaterials()
      },
      addMaterial (val) {
        const temp = {}
        temp.warehouse_material_name = val.warehouse_material_name
        temp.warehouse_material_id = val.warehouse_material_id
        temp.warehouse_material_standard = val.warehouse_material_standard
        temp.warehouse_material_model = val.warehouse_material_model
        temp.warehouse_material_units = val.warehouse_material_units
        temp.checkNum = ''
        temp.entryNum = ''
        this.selectMaterialList.push(temp)
      },
      removeSelect (index) {
        this.selectMaterialList.splice(index, 1)
      },
      selectPeople () {
        this.$mesStaff.show('', {
          selectIds: [this.peopleId],
          type: 'all'
        }).then(res => {
          this.people = res.rows[0].role_staff_name
          this.peopleId = res.rows[0].role_staff_id
        })
      },
      selectWousehouse (index) {
        this.$mesWareHouse.show('', {
          selectIds: []
        }).then(res => {
          this.addWarehouse = res.rows[0].warehouse_name
          this.addWarehouseId = res.rows[0].warehouse_id
        })
      },
      addCheck () {
        this.visible.addForm = true
        this.getMaterials()
      },
      addtypeChange () {
        this.moduleReq.headNum = 1
        this.getMaterials()
      },
      test (value, index) {
        if (value <= 0) {
          this.$message.error({ message: '数量不能小于等于零' });
          if (value === 'value.entryNum') {
            this.selectMaterialList[index].entryNum = ''
          } else {
            this.selectMaterialList[index].checkNum = ''
          }
        }
      }
    },
    watch: {}
  }
</script>

<style scoped lang="scss">
  .time {
    border: 1px solid #dcdfe6;
    border-right: none;
    background-color: #f5f7fa;
    padding: 11px 20px;
    color: #909399;
    border-radius: 4px;
    margin-right: -8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }

  table tr th,
  table tr td {
    border: 1px solid #dcdfe6;
    text-align: center;
  }

  table input {
    border: none !important;
  }

  .el-input__inner {
    border: 0px solid #dcdfe6 !important;
  }
</style>