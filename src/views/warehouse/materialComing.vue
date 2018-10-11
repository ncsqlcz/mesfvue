/* * @Author: danqihao * @Date: 2018-04-08 17:42:07 * @Last Modified by: danqihao * @Last Modified time: 2018-04-13 11:42:45
*/
<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="3">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addRecord">登记</el-button>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select placeholder="请选择类型" size="medium" @change="typeChange()" v-model="materialType">
          <el-option value="WMT01" label="固体" size="medium">固体 </el-option>
          <el-option value="WMT02" label="液体" size="medium">液体</el-option>
          <el-option value="WMT03" label="气体" size="medium">气体</el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-date-picker @change="timeChange()" v-model="timesList" type="datetimerange" align="right" size="medium" unlink-panels
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="selectTime">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入内容" size="medium" @keyup.native.enter="searchs" v-model="searchsValue">
          <el-button slot="append" icon="el-icon-search" @click="searchs"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column label="名称" prop="material.warehouse_material_name"> </el-table-column>
      <el-table-column label="规格" prop="material.warehouse_material_standard"> </el-table-column>
      <el-table-column label="型号" prop="material.warehouse_material_model"> </el-table-column>
      <el-table-column label="单位" prop="material.warehouse_material_units"> </el-table-column>
      <el-table-column label="物料批次" prop="warehouse_material_batch"> </el-table-column>
      <el-table-column label="品质" prop="">
        <template slot-scope="scope">{{scope.row.warehouse_material_quality === "0"?"合格":"不合格"}}</template>
      </el-table-column>
      <el-table-column label="登记数量" prop="warehouse_material_record_number"> </el-table-column>
      <el-table-column label="供应商" prop="supplier.supplier_name"> </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="lookDetail(scope.row)" type="">详情</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_material_record_id)" type="danger">删除</el-button>
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
      <span slot="title" class="el-dialog__title">来料登记</span>
      <el-container>
        <el-main>
          <span style="height:40px; line-height:40px; display:block;padding:2px 10px" class="toolbar">基础信息</span>
          <el-row :gutter="20">
            <el-col :span="8">
              <div>
                <el-input placeholder="请输入内容" v-model="people" @click.native="selectPeople()">
                  <template slot="prepend">登记人员</template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <el-input placeholder="请输入内容" v-model="supplier" @click.native="selectSupplier()">
                  <template slot="prepend">供应商</template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <span class="time">登记时间</span>
                <el-date-picker style="width:60% !important" v-model="time" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期时间">
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
                <th style="width: 15%;">物料批次</th>
                <th style="width: 10%;">品质</th>
                <th style="width: 10%;">登记数量</th>
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
                  <el-input size="medium" placeholder="请输入内容(必填)" v-model="selectMaterialList[index].batch"></el-input>
                </td>
                <td>
                  <el-select placeholder="请选择" v-model="selectMaterialList[index].quality">
                    <el-option value="0" label="合格" size="medium"> </el-option>
                    <el-option value="1" label="不合格" size="medium"></el-option>
                  </el-select>
                </td>
                <td>
                  <el-input auto-complete="off" size="medium" placeholder="请输入" type="number" min=0 v-model="selectMaterialList[index].num"
                    :value="value.num" @blur="test(value.num,index)"></el-input>
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
            <el-col :span="5">
              <!-- <el-select  placeholder="请选择" v-model="form.materialTypeId" size="medium">
                                    <el-option  value="WMT01" label="固体"  size="medium">固体 </el-option>
                                    <el-option  value="WMT02" label="液体"  size="medium">液体</el-option>
                                    <el-option  value="WMT03" label="气体"  size="medium">气体</el-option>
                                </el-select> -->
            </el-col>
            <el-col :span="5" :offset="14">
              <el-input placeholder="请输入内容" size="medium" v-model="moduleReq.value" @keyup.native.enter="materialSearchs">
                <el-button slot="append" icon="el-icon-search" @click="materialSearchs"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="materialList" style="width: 100% ;padding:3px 0" border>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="名称" prop="warehouse_material_name"> </el-table-column>
            <el-table-column label="规格" prop="warehouse_material_standard"> </el-table-column>
            <el-table-column label="型号" prop="warehouse_material_model"> </el-table-column>
            <el-table-column label="单位" prop="warehouse_material_units"> </el-table-column>
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
  import { getWarehouseBasic, queryMaterials, removeMaterialRecords, saveMaterialRecords } from '../../api/api'

  export default {
    data () {
      return {
        req: {
          type: 'record',
          headNum: 1
        },
        moduleReq: {
          type: 'inventory',
          headNum: 1,
          value: '',
          key: 'keyWord'
        },
        dataList: [],
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
        supplier: '',
        supplierId: '',
        time: '',
        addMaterialList: []
      }
    },
    computed: {
    },
    mounted () {
      this.getBasic()
      this.getMaterials()
    },
    methods: {
      getBasic () {
        this.visible.loading = true
        getWarehouseBasic(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.materialRecords
            this.lines = data.map.materialRecordLines
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
            this.dataList = data.map.materialRecords
            this.lines = data.map.materialRecordLines
            this.visible.loading = false
          } else {
            this.visible.loading = false
            this.dataList = []
            this.lines = 0
          }
        })
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getBasic()
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeMaterialRecords({
            recordIds: val
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
        if (this.people === '' || this.supplier === '' || this.time === '') {
          this.$message({
            type: 'danger',
            message: '请填写或选择正确的基础信息'
          });
          return false
        }
        if (this.selectMaterialList.length !== 0) {
          this.addMaterialList = []
          this.selectMaterialList.forEach((val, index) => {
            if (val.batch === '' || val.batch === null || val.batch === undefined) {
              this.$message({
                type: 'warning',
                message: '请填写正确的物料批次号'
              });
              addStatus = false
            }
            if (val.quality === '' || val.quality === null || val.quality === undefined) {
              this.$message({
                type: 'warning',
                message: '请选择物料品质'
              });
              addStatus = false
            }
            if (val.num === '' || val.num === null || val.num === undefined) {
              this.$message({
                type: 'warning',
                message: '请填写正确的物料数量'
              });
              addStatus = false
            }
            if (val.num <= 0) {
              this.$message({
                type: 'warning',
                message: '物料登记数量不能小于等于零'
              });
              addStatus = false
            }
            const temp = `${val.warehouse_material_id}:${val.batch}:${val.quality}:${val.num}`
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
            saveMaterialRecords({
              staffId: this.peopleId,
              supplierId: this.supplierId,
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
      typeChange () {
        this.req = {
          type: 'record',
          headNum: 1,
          key: 'materialTypeId',
          value: this.materialType
        }
        this.queryMaterial()
      },
      searchs () {
        this.req = {
          type: 'record',
          headNum: 1,
          value: this.searchsValue,
          key: 'keyWord'
        }
        this.queryMaterial()
      },
      timeChange () {
        this.req = {
          type: 'record',
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
          '登记详情', {
            table: {
              props: ['物料名称:', '物料规格:', '物料类型:', '物料型号:', '单位:', '数量:', '品质:', '供应商:', '负责人:', '来料时间:'],
              values: [row.material.warehouse_material_name, row.material.warehouse_material_standard || '暂无数据', row.material.warehouse_material_type_name, row.material.warehouse_material_model,
                row.material.warehouse_material_units, row.warehouse_material_record_number, row.warehouse_material_quality === 0 ? '合格' : '不合格', row.supplier ? row.supplier.supplier_name : '暂无数据',
                row.staff ? row.staff.role_staff_name : '暂无数据', utils.formatDate.format(new Date(row.warehouse_material_record_time), 'yyyy-MM-dd hh:mm:ss')]
            }
          })
      },
      //  获取物料列表
      getMaterials () {
        this.moduleReq.type = 'inventory'
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
      MaterialhandleCurrentChange (val) {
        this.moduleReq.headNum = (val - 1) * 10 + 1;
        if (this.moduleReq.value === '') {
          this.getMaterials()
        } else {
          queryMaterials(this.moduleReq).then((data) => {
            if (data.status === 0) {
              this.materialList = data.map.materials
              this.materialLines = data.map.materialInfoLine
            } else {
              this.materialList = []
              this.materialLines = 0
            }
          })
        }
      },
      // 搜索框
      materialSearchs () {
        this.moduleReq.headNum = 1
        this.moduleReq.type = 'info'
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
      addMaterial (val) {
        const temp = {}
        temp.warehouse_material_name = val.warehouse_material_name
        temp.warehouse_material_id = val.warehouse_material_id
        temp.warehouse_material_standard = val.warehouse_material_standard
        temp.warehouse_material_model = val.warehouse_material_model
        temp.warehouse_material_units = val.warehouse_material_units
        temp.num = ''
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
      selectSupplier () {
        this.$mesSupplier.show('', {
          selectIds: [this.supplierId]
        }).then(res => {
          this.supplier = res.rows[0].supplier_name
          this.supplierId = res.rows[0].supplier_id
        })
      },
      addRecord () {
        this.visible.addForm = true
      },
      test (value, index) {
        if (value <= 0) {
          this.$message.error({ message: '登记数量不能小于等于零' });
          this.selectMaterialList[index].num = ''
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