<!--张叶青 2018/04/012 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="medium" @click="AddSection">新增工艺段</el-button>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="3">
            <el-select placeholder="全部类型" v-model="productTypeId" size="medium" style="width:160px" @change="getList">
              <el-option v-for="item in productType" :key="item.product_type_name" :label="item.product_type_name" :value="item.product_model_type_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="3">
            <el-select placeholder="启用" v-model="status" size="medium" @change="getList" style="width:90px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入名称或编号" @keyup.native.enter="getList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" v-on:click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->

    <!--列表 start-->
    <el-table :data="section" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="50" label="序号"></el-table-column>
      <el-table-column prop="craft_segment_name" label="工艺段名称"></el-table-column>
      <el-table-column prop="craft_segment_number" label="工艺段编号"></el-table-column>
      <el-table-column prop="craft_segment_versions" label="工艺版本"></el-table-column>
      <el-table-column prop="product_model_type_name" label="所属产品类型"></el-table-column>
      <el-table-column prop="product_model_genre" label="产品型号"></el-table-column>
      <el-table-column prop="craft_segment_quality_rate" label="优率"></el-table-column>
      <el-table-column label="使用状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.useStatus" size="medium" @change="statusChanged(scope.row)">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="craft_number" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="processDetail(scope.row)">详情</el-button>
          <el-button type="success" size="small" icon="el-icon-plus" @click="handleDelete(scope.row)">添加到模板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页start -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize" :total="filters.total" @current-change="handlePageChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页end -->
    <!--详情 start-->
    <el-dialog :visible.sync="visible.detailForm" :title="title" :close-on-click-modal="false" width="70%">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <div class="detail-table" >
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">工艺段名称</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_name}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">工艺段编号</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_number}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">工艺段版本号</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_versions}}</p>
                </div>
              </div>
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">所属产品类型</p>
                  <p class="td-value">{{craftSegmentList.product_model_type_name}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">产品型号</p>
                  <p class="td-value">{{craftSegmentList.product_model_genre}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">优率</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_quality_rate}}</p>
                </div>
              </div>
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">录入时间</p>
                  <p class="td-value">{{getTime(craftSegmentList.craft_segment_creation_time)}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">录入人员</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_creation_staff}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">备注</p>
                  <p class="td-value">{{craftSegmentList.craft_segment_describe}}</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工序" name="second">
            <div class="detail-table" >
              <el-table :data="craftSegmentList.segmentWorkstageList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
                <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                <el-table-column prop="workstage.workstage_name" label="工序名称"></el-table-column>
                <el-table-column prop="workstage.workstage_number" label="工序编号"></el-table-column>
                <el-table-column prop="workstage.workstage_polarity" label="极性"></el-table-column>
                <el-table-column prop="workstage.workstage_versions" label="工序版本"></el-table-column>
                <el-table-column prop="workstage.product_model_type_name" label="所属产品类型"></el-table-column>
                <el-table-column prop="workstage.product_model_genre" label="产品型号"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="事项说明" name="third">
            <div class="detail-table" >
              <el-table :data="craftSegmentList.processDescribles" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
                <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                <el-table-column prop="proceeding" label="事项"></el-table-column>
                <el-table-column prop="explain" label="说明"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <!--详情 end-->

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addLoading" title="新增工序" :close-on-click-modal="false" width="75%">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-card class="box-card">
              <div slot="header" class="clearfix" style="line-height:36px">
                <el-button style="float: right;" type="primary" size="medium" @click="craftVersions()">查看历史版本信息</el-button>
              </div>
              <el-form :inline="true" label-width="100px" style="margin-top: 10px">
                <el-col :span=24>
                  <el-form-item label="工艺段名称" prop="sectionName">
                    <el-input placeholder="请选择（必选）" @focus="selectCraftSegment()" v-model="addForm.sectionName" readonly :rules="addFormRules"></el-input>
                  </el-form-item>
                  <el-form-item label="工艺段编号" prop="crafsectionNumbertName">
                    <el-input v-model="addForm.sectionNumber" readonly :rules="addFormRules"></el-input>
                  </el-form-item>
                  <el-form-item label="工艺版本号" prop="sectionVersion">
                    <el-input v-model="addForm.sectionVersion" :rules="addFormRules" placeholder="输入（必填）"></el-input>
                  </el-form-item>
                  <el-form-item label="所属产品类型" prop="productModelName">
                    <el-autocomplete v-model="addForm.productModelName" :fetch-suggestions="queryProductTypeNameList" @select="productTypeSelect"
                      placeholder="请选择（必选）">
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item label="产品型号" prop="productModelGenre">
                    <el-input readonly v-show="!addForm.productModelName"></el-input>
                    <el-autocomplete v-model="addForm.productModelGenre" :fetch-suggestions="queryProductModelNameList" @select="productModelSelect"
                      placeholder="请选择（必选）" v-show="addForm.productModelName">
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input placeholder="请输入" v-model="addForm.describe" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
              <div>
                <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('first')">下一步</el-button>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="工序" name="second">
            <el-card>
              <div class="detail-table" >
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="selectProcess">添加工序</el-button>
                </div>
                <el-table highlight-current-row :data="process" @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="workstage_name" label="工序名称"></el-table-column>
                  <el-table-column prop="workstage_number" label="工序编号"></el-table-column>
                  <el-table-column prop="workstage_polarity" label="极性"></el-table-column>
                  <el-table-column prop="workstage_versions" label="工序版本"></el-table-column>
                  <el-table-column prop="product_model_type_name" label="所属产品类型"></el-table-column>
                  <el-table-column prop="product_model_genre" label="所属产品型号"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" icon="el-icon-arrow-up" @click="craftSegmenUp(scope.$index)">上移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-arrow-down" @click="craftSegmenDown(scope.$index)">下移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-delete" @click="deleteCraftSegmen(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('second')">下一步</el-button>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="事项说明" name="third">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="addTempData()">添加行</el-button>
                </div>
                <el-table highlight-current-row :data="tempData" @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column label="事项" width="200">
                    <template slot-scope="scope">
                      <el-input placeholder="请输入" v-model="scope.row.proceeding"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="说明">
                    <template slot-scope="scope">
                      <el-input placeholder="请输入" v-model="scope.row.explain"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTempData(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="submitButton()">提交</el-button>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
    <!--新增 end-->
    <!-- 历史版本信息 -->
   <sectionversions :sectionVersion="sectionVersion" ref="method"></sectionversions>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {
    queryCraftSegmentOutline, getProductTypeList, queryCraftSegmentParticulars, queryProductTypeAboutModel, saveCraftSegment
  } from '../../../api/api'
  import { mapGetters } from 'vuex'
   import sectionversions from '../children/sectionVersions'  
  export default {
     name: 'MaintainRecord',
      components: {
        'sectionversions': sectionversions,
      },
    data() {
      return {
        filters: {
          pageSize: 10,
          page: 1,
          total: 0,
          type: 'vague',
          keyword: ''
        },
        sectionVersion: {
          show: false,
          deviceId: ''
        },
        section: [],
        pictureInfo: '',
        craftSegmentList: [],
        environmentparam: [],
        semiFinishedProductParam: [],
        status: '0',
        productType: [],
        process: [],
        tempData: [],
        i: [],
        activeName: 'first',
        productTypeId: '',
        title: '工序详情',
        visible: {
          listLoading: false,
          detailForm: false,
          addLoading: false,
          editLoading: false
        },
        addForm: {
          productModelGenre: '',
          productModelName: '',
          productTypeId: '',
          productModelId: '',
          sectionName: '',
          sectionNumber: '',
          sectionVersion: '',
          sectionId: '',
          describe: ''
        },
        addFormRules: {
          sectionName: { required: true, message: '工艺段名称不能为空', trigger: 'blur' },
          sectionNumber: { required: true, message: '工艺段编号不能为空', trigger: 'blur' },
          sectionVersion: { required: true, message: '工艺段版本不能为空', trigger: 'blur' },
          productModelName: { required: true, message: '所属产品类型不能为空', trigger: 'blur' },
          productModelGenre: { required: true, message: '产品型号不能为空', trigger: 'blur' }
        },
        // 环境参数
        environmentParam: [
          // 温度
          {
            name: '温度',
            type: 'fixedValue',
            fixedValue: 0,
            scopeValue: {
              minValue: 0,
              maxValue: 0
            },
            floatScopeValue: 0,
            unit: '°C'
          },
          // 湿度
          {
            name: '湿度',
            type: 'fixedValue',
            fixedValue: 0,
            scopeValue: {
              minValue: 0,
              maxValue: 0
            },
            floatScopeValue: 0,
            unit: '%RH'
          },
          // 露点
          {
            name: '露点',
            type: 'fixedValue',
            fixedValue: 0,
            scopeValue: {
              minValue: 0,
              maxValue: 0
            },
            floatScopeValue: 0,
            unit: 'g/m³'
          },
          // 清洁度
          {
            name: '清洁度',
            type: 'fixedValue',
            fixedValue: 0,
            scopeValue: {
              minValue: 0,
              maxValue: 0
            },
            floatScopeValue: 0,
            unit: 'μm'
          }
        ],
        options: [
          { value: '0', label: '启用' },
          { value: '1', label: '弃用' }
        ],
        useStatus: '',
        querySearchPostTimeout: null
      }
    },
    computed: {
      ...mapGetters(['getUser'])
    },
    mounted() {
      this.getList()
    },
    methods: {
      //  页面改变
      handlePageChange(val) {
        this.filters.page = val
        this.getList()
      },
      //  每页数量改变
      handleSizeChange(val) {
        this.filters.pageSize = val
        this.getList()
      },
      // 列表索引
      getIndex(index) {
        return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
      },
      // 重置
      reset() {
        this.filters = {
          type: 'vague',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取产品类型列表
      getTypeList() {
        getProductTypeList({
          type: 'vague',
          status: 0
        }).then(data => {
          this.productType = data.map.productTypes
        })
      },
      //  获取工艺段列表
      getList() {
        this.getTypeList()
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
        }, this.filters)
        if (this.productTypeId) {
          para['productTypeId'] = this.productTypeId
        }
        queryCraftSegmentOutline(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.line
            res.map.craftSegment.forEach(item => {
              if (item.craft_segment_status === '0') {
                item.useStatus = '0'
              } else {
                item.useStatus = '1'
              }
            })
            this.section = res.map.craftSegment
          } else {
            this.filters.total = 0
            this.section = []
          }
        })
      },
      // 工艺段详情
      processDetail(row) {
        queryCraftSegmentParticulars({
          'craftSegmentVersionsIds[]': row.craft_segment_id,
          headNum: 1
        }).then((res) => {
          if (res.status === 0) {
            this.craftSegmentList = res.map.craftSegmentList[0]
            if (res.map.pictureInfo) {
              this.pictureInfo = res.map.pictureInfo[0]
            }
            this.visible.detailForm = true
          } else {
          }
        })
      },
      // 切换
      handleClick(tab, event) {
      },
      // 下一页
      nextButton(event) {
        if (event === 'first') {
          this.activeName = 'second'
        } else if (event === 'second') {
          this.activeName = 'third'
        }
      },
      // 新增工艺段
      AddSection() {
        this.visible.addLoading = true
      },
      // 产品类型列表
      queryProductTypeNameList(queryString, cb) {
        getProductTypeList({
          type: 'vague',
          status: 0,
          productTypeName: queryString
        }).then(data => {
          if (data.status === 0) {
            cb(data.map.productTypes.map(v => {
              return {
                value: v.product_type_name,
                product_model_type_id: v.product_model_type_id
              }
            }))
          } else {
            let arr = []
            cb(arr)
          }
        })
      },
      // 选择产品类型
      productTypeSelect(item) {
        this.addForm.productTypeId = item.product_model_type_id
      },
      // 产品型号
      queryProductModelNameList(queryString, cb) {
        queryProductTypeAboutModel({
          type: 'precise',
          status: 0,
          productTypeId: this.addForm.productTypeId
        }).then(data => {
          if (data.status === 0) {
            cb(data.map.productType.map(v => {
              return {
                value: v.product_model_genre,
                product_model_id: v.product_model_id
              }
            }))
          } else {
            let arr = []
            cb(arr)
          }
        })
      },
      // 选择产品型号
      productModelSelect(item) {
        this.addForm.productModelId = item.product_model_id
      },
      // 选择工艺段
      selectCraftSegment() {
        this.$mesCraftSegment.show({
          type: 'vague'
        }).then((res) => {
          console.log(res)
          this.addForm.sectionId = res.rows[0].craft_segment_basics_id
          this.addForm.sectionName = res.rows[0].craft_segment_name
          this.addForm.sectionNumber = res.rows[0].craft_segment_number
        })
      },
      // 添加工序
      selectProcess() {
        this.$mesProcess.show({
          type: 'vague'
        }).then((res) => {
          console.log(res.rows[0])
          let data = res.rows[0]
          this.process.push(res.rows[0])
        })
      },
      // 上移工序
      craftSegmenUp(row) {
        if (row > 0) {
          let arr = this.process.slice(row - 1)
          this.process = this.process.slice(0, row - 1)
          let temp = arr[0]
          arr[0] = arr[1]
          arr[1] = temp
          for (let i = 0; i < arr.length; i++) {
            this.process.push(arr[i])
          }
        }
      },
      // 下移工序
      craftSegmenDown(row) {
        if (row < this.process.length - 1) {
          let arr = this.process.slice(row)
          this.process = this.process.slice(0, row)
          let temp = arr[0]
          arr[0] = arr[1]
          arr[1] = temp
          for (let i = 0; i < arr.length; i++) {
            this.process.push(arr[i])
          }
        }
      },
      // 删除工序
      deleteCraftSegmen(row) {
        this.process.splice(row, 1)
      },
      // 查看历史版本
      craftVersions (){
         this.sectionVersion.show = true
      },
      // 添加事项
      addTempData() {
        this.tempData.push({
          proceeding: '',
          explain: ''
        })
        this.i++
      },
      // 删除事项
      deleteTempData(row) {
        this.tempData.splice(row, 1)
      },
      // 修改状态
      statusChanged(row) {
        this.$confirm('确认修改状态?').then(action => {
          if (action === 'confirm') {
            let craftBasicsIds = row.craft_id
            if (row.useStatus === '1') {
              modifyCraftVersionsStatus({
                type: 'deprecated',
                'craftIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({ message: '弃用成功', type: 'success' })
                } else {
                  this.$message({ message: '弃用失败', type: 'error' })
                }
                this.getList()
              })
            } else {
              modifyCraftVersionsStatus({
                type: 'recover',
                'craftIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({ message: '启用成功', type: 'success' })
                } else {
                  this.$message({ message: '启用失败', type: 'error' })
                }
                this.getList()
              })
            }
          }
        }).catch(action => {
          if (action === 'cancel') {
            if (row.isAssigned === '1') {
              row.isAssigned = '0'
            } else {
              row.isAssigned = '1'
            }
          }
        })
      },
      // 编辑
      handleEdit(row) {
        this.addForm = {
          classId: row.role_class_id,
          className: row.role_class_name,
          classDetail: row.role_class_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete(row) {
        this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
          if (action === 'confirm') {
            removeShift({ classId: row.role_class_id, status: '1' }).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '删除成功', type: 'success' })
              } else {
                this.$message({ message: '删除失败', type: 'error' })
              }
              this.visible.addLoading = false
              this.getList()
            })
          }
        }).catch()
      },
      //  提交
      submitButton() {
        let processDescrible = []
        let i = 1
        let processIds = []
        this.tempData.forEach((val, key) => {
          processDescrible.push({
            order: i,
            proceeding: val.proceeding,
            explain: val.explain
          })
          i++
        })
        this.process.forEach((val, key) => {
          processIds.push(val.workstage_id)
        });
        if (processDescrible) {
          processDescrible = JSON.stringify(processDescrible)
        } else {
          processDescrible = ''
        }
        let data = {
          basicsId: this.addForm.sectionId,
          modelId: this.addForm.productModelId,
          modelTypeId: this.addForm.productTypeId,
          segmentName: this.addForm.sectionName,
          segmentNumber: this.addForm.sectionNumber,
          segmentVersions: this.addForm.sectionVersion,
          typeName: this.addForm.productModelName,
          modelGenre: this.addForm.productModelGenre,
          creationStaff: this.getUser.staffNumber,
          creationStaffid: this.getUser.userId,
          segmentDescribe: this.addForm.describe,
          'workstageIds[]': processIds.toString(),
          processDescribleStrs: processDescrible

        }
        saveCraftSegment(data).then((data) => {
          if (data.status === 0) {
            this.$message({
              message: '新建成功',
              type: 'success'
            })
            this.loading = false
            this.basicInformation = {
              planName: '',
              planType: '',
              creator: '',
              planPrincipal: ''
            }
            this.creatorName = ''
            this.planPrincipalName = ''
            this.devices = []
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 转换时间格式
      getTime(timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
      }
    },
    watch: {
    }
  }
</script>

<style>
  .el-table th>.cell {
    color: #333;
  }
</style>