/* * @Author:danqihao * @Date: 2018-04-08 17:44:13 * @Last Modified by: danqihao * @Last Modified time: 2018-04-12 17:17:12
*/

<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="3">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addIn">入库</el-button>
      </el-col>
      <el-col :span="6" :offset="6">
        <el-date-picker @change="timeChange()" v-model="timesList" type="datetimerange" align="right" size="medium" value-format="yyyy-MM-dd hh:mm:ss"
          unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="selectTime">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="请选择成品型号" size="medium" @change="getBasicInfo()" v-model="req.productModelId">
          <el-option value="" label="全部型号" size="medium"> </el-option>
          <el-option v-for="(val,index) in productModel" :value="val.warehouse_product_model_id" :key="index" :label="val.warehouse_product_model_name"
            size="medium">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="请选择仓库" size="medium" @change="getBasicInfo()" v-model="req.warehouseId">
          <el-option value="" label="全部仓库" size="medium"> </el-option>
          <el-option v-for="(val,index) in warehouseName" :value="val.warehouse_id" :key="index" :label="val.warehouse_name" size="medium">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="请输入内容" size="medium" @keyup.native.enter="searchs" v-model="req.keyWord">
          <el-button slot="append" icon="el-icon-search" @click="getBasicInfo()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="名称" prop="product.warehouse_product_name"> </el-table-column>
      <el-table-column label="型号" prop="product.productModel.warehouse_product_model_name"> </el-table-column>
      <el-table-column label="批次" prop="warehouse_product_batch"> </el-table-column>
      <el-table-column label="入库数量" prop="warehouse_product_entry_number"> </el-table-column>
      <el-table-column label="入库时间">
        <template slot-scope="scope">{{ scope.row.warehouse_product_entry_time | times }}</template>
      </el-table-column>
      <el-table-column label="编辑" prop="" width="200">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="lookDetail(scope.row)">详情</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_product_entry_id)" type="danger">删除</el-button>
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
      <span slot="title" class="el-dialog__title">入库登记</span>
      <el-container>
        <el-main>
          <span style="height:40px; line-height:40px; display:block;padding:2px 10px" class="toolbar">基础信息</span>
          <el-row>
            <el-col :span="12">
              <div>
                <el-input placeholder="请输入内容" v-model="people" @click.native="selectPeople()">
                  <template slot="prepend">入库人员</template>
                </el-input>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="time">入库时间</span>
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
                <th style="width: 6%;padding:5px 0"> 序号</th>
                <th style="width: 10%;">名称 </th>
                <th style="width: 10%;">型号</th>
                <th style="width: 10%;">批次</th>
                <th style="width: 8%;">入库数量</th>
                <th style="width: 10%;">仓库</th>
                <th style="width: 15%;">生产日期</th>
                <th style="width: 8%;">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value,index) in selectproductList" :key="index">
                <td>{{index+1}}</td>
                <td>{{value.warehouse_product_name}}</td>
                <td>{{value.warehouse_product_model_name}}</td>
                <td>
                  <el-input size="medium" placeholder="请输入(必填)" v-model="selectproductList[index].batch"></el-input>
                </td>
                <td>
                  <el-input size="medium" placeholder="请输入(必填)" min=0 type="number" :value='value.num' @blur="test(value.num,index)" v-model="selectproductList[index].num"></el-input>
                </td>
                <td>
                  <el-select placeholder="请选择仓库" size="medium" v-model="selectproductList[index].warehouse">
                    <el-option v-for="(val,index) in warehouseName" :value="val.warehouse_id" :key="index" :label="val.warehouse_name" size="medium">
                    </el-option>
                  </el-select>
                </td>
                <td>
                  <el-date-picker v-model="selectproductList[index].data" type="datetime" value-format="timestamp" placeholder="选择日期时间">
                  </el-date-picker>
                </td>
                <td>
                  <el-button type="text" @click.native="removeSelect(index)">删除</el-button>
                </td>

              </tr>
              <tr v-show="!selectproductList.length">
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
              <span style="height:20px, line-height:20px">选择成品</span>
            </el-col>
            <el-col :span="4" :offset="9">
              <el-select placeholder="请选择成品型号" size="medium" @change="queryProductInfos()" v-model="moduleReq.productModelId">
                <el-option value="" label="全部型号" size="medium"> </el-option>
                <el-option v-for="(val,index) in productModel" :value="val.warehouse_product_model_id" :key="index" :label="val.warehouse_product_model_name"
                  size="medium">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input placeholder="请输入内容" size="medium" v-model="moduleReq.productName" @keyup.native.enter="queryProductInfos()">
                <el-button slot="append" icon="el-icon-search" @click="queryProductInfos()"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table :data="productList" style="width: 100% ;padding:3px 0" border>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="名称" prop="warehouse_product_name"> </el-table-column>
            <el-table-column label="型号" prop="productModel.warehouse_product_model_name"> </el-table-column>

            <el-table-column label="编辑" prop="">
              <template slot-scope="scope">
                <el-button size="small" icon="el-icon-circle-plus" @click="addProduct(scope.row)" type="danger">添加</el-button>
              </template>
            </el-table-column>

          </el-table>
          <el-row>
            <el-col class="text-right">
              <el-pagination @current-change="producthandleCurrentChange" background layout="total,prev,pager,next" :current-page="productCurrenPage"
                :page-size="productPagesize" :total=productLines></el-pagination>
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
  import { queryProductEntrys, removeProductEntrys, queryProductInfos, saveProductEntrys } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        req: {
          productEntryId: '',
          productId: '',
          keyWord: '',
          productModelId: '',
          warehouseId: '',
          startDate: '',
          endDate: '',
          headNum: 1
        },
        moduleReq: {
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
          loading: false,
          addForm: false
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
        selectproductList: [],
        productList: [],
        productLines: 0, // 条数
        productCurrenPage: 1, // 当前页
        productPagesize: 10,   // 页码
        people: '',
        peopleId: '',
        time: '',
        addProductList: []
      }
    },
    computed: {
      ...mapGetters(['productModel', 'warehouseName'])
    },
    mounted () {
      this.getBasicInfo()
      this.initProductModel()
      this.initWarehouseName()
    },
    methods: {
      ...mapActions(['initProductModel', 'initWarehouseName']),
      getBasicInfo () {
        this.visible.loading = true
        queryProductEntrys(this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.productEntrys
            this.lines = data.map.lines
            this.visible.loading = false
          } else {
            this.dataList = []
            this.lines = 0
          }
          this.visible.loading = false
        })
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getBasicInfo()
      },
      remove (val) {
        this.$confirm('确定删除此条信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          removeProductEntrys({
            entryIds: val
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
      lookDetail (row) {
        this.$mesBasicInfoTable.show(
          '成品入库信息', {
            table: {
              props: ['成品名称', '成品型号', '成品批次', '所在仓库', '入库数量', '生产日期', '入库人员', '入库时间'],
              values: [row.product.warehouse_product_name, row.product.productModel.warehouse_product_model_name, row.warehouse_product_batch, row.warehouse.warehouse_name,
                row.warehouse_product_entry_number, utils.formatDate.format(new Date(row.warehouse_product_production_date), 'yyyy-MM-dd hh:mm:ss'),
                row.staff.role_staff_name, utils.formatDate.format(new Date(row.warehouse_product_entry_time), 'yyyy-MM-dd hh:mm:ss')]
            }
          })
      },
      timeChange () {
        this.req.startDate = this.timesList[0]
        this.req.endDate = this.timesList[1]
        this.getBasicInfo()
      },
      addIn () {
        this.visible.addForm = true
        this.queryProductInfos()
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
      addSubmit () {
        var addStatus = true
        if (this.people === '' || this.time === '') {
          this.$message({
            type: 'danger',
            message: '请填写或选择正确的基础信息'
          });
          return false
        }
        if (this.selectproductList.length !== 0) {
          this.addProductList = []
          this.selectproductList.forEach((val, index) => {
            if (val.batch === '' || val.batch === null || val.batch === undefined) {
              this.$message({
                type: 'warning',
                message: '请填写成品入库批次'
              });
              addStatus = false
            }
            if (val.warehouse === '' || val.warehouse === null || val.warehouse === undefined) {
              this.$message({
                type: 'warning',
                message: '请选择成品入库仓库'
              });
              addStatus = false
            }
            if (val.data === '' || val.data === null || val.data === undefined) {
              this.$message({
                type: 'warning',
                message: '请选择成品生产时间'
              });
              addStatus = false
            }
            if (val.num === '' || val.num === null || val.num === undefined) {
              this.$message({
                type: 'warning',
                message: '请填写正确的入库数量'
              });
              addStatus = false
            }
            if (val.num <= 0) {
              this.$message({
                type: 'warning',
                message: '入库数量不能小于等于零'
              });
              addStatus = false
            }
            const temp = `${val.warehouse_product_id}:${val.batch}:${val.num}:${val.warehouse}:${val.data}`
            console.log(temp)
            this.addProductList.push(temp)
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
            saveProductEntrys({
              staffId: this.peopleId,
              dateStr: this.time,
              products: this.addProductList.toString()
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
      queryProductInfos () {
        queryProductInfos(this.moduleReq).then((data) => {
          if (data.status === 0) {
            this.productList = data.map.products
            this.productLines = data.map.lines
          } else {
            this.productList = []
            this.productLines = 0
          }
        })
      },
      addProduct (val) {
        const temp = {}
        temp.warehouse_product_id = val.warehouse_product_id
        temp.warehouse_product_name = val.warehouse_product_name
        temp.warehouse_product_model_name = val.productModel.warehouse_product_model_name
        temp.batch = ''
        temp.num = ''
        temp.warehouse = ''
        temp.data = ''
        this.selectproductList.push(temp)
      },
      removeSelect (index) {
        this.selectproductList.splice(index, 1)
      },
      producthandleCurrentChange (val) {
        this.moduleReq.headNum = (val - 1) * 10 + 1;
        this.queryProductInfos()
      },
      test (value, index) {
        if (value <= 0) {
          this.$message.error({ message: '入库数量不能小于等于零' });
          this.selectproductList[index].num = ''
        }
      }
    },
    filters: {
      times (val) {
        return utils.formatDate.format(new Date(val), 'yyyy-MM-dd hh:mm:ss')
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