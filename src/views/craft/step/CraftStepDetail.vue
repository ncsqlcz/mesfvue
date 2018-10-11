<!--张叶青 2018/04/12 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="medium" @click="AddStep">新增工步</el-button>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="3">
            <el-select placeholder="全部类型" v-model="productTypeId" size="medium" style="width:160px" @change="getList">
              <el-option v-for="item in productType" :key="item.product_type_name" :label="item.product_type_name" :value="item.product_model_type_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="3">
            <el-select placeholder="全部极性" v-model="versions" size="medium" @change="getList" style="width:120px">
              <el-option label="全部极性" value=""> </el-option>
              <el-option label="无极性" value="无极性"> </el-option>
              <el-option label="正极" value="正极"> </el-option>
              <el-option label="负极" value="负极"> </el-option>
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
    <el-table :data="step" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"  label="序号"></el-table-column>
      <el-table-column prop="craft_control_workstep_name" label="工步名称" sortable></el-table-column>
      <el-table-column prop="craft_control_workstep_num" label="工步编号" sortable></el-table-column>
      <el-table-column prop="craft_control_workstep_version" label="工步版本"></el-table-column>
      <el-table-column prop="product_model_genre" label="产品型号"></el-table-column>
      <el-table-column label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="processDetail(scope.row)">详情</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleDelete(scope.row)">添加到模板</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="abandon(scope.row)" v-if="scope.row.craft_control_workstep_status == 0 ">弃用</el-button>
          <el-button type="success" size="small" icon="el-icon-success" @click="start(scope.row)" v-else>启用</el-button>
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
            <div class="detail-table">
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">工步名称</p>
                  <p class="td-value">{{workstepList.craft_control_workstep_name}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">工步编号</p>
                  <p class="td-value">{{workstepList.craft_control_workstep_num}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">工步版本号</p>
                  <p class="td-value">{{workstepList.craft_control_workstep_version}}</p>
                </div>
              </div>
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">所属产品类型</p>
                  <p class="td-value">{{workstepList.product_type_name}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">产品型号</p>
                  <p class="td-value">{{workstepList.product_model_genre}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">极性</p>
                  <p class="td-value">{{workstepList.product_polar}}</p>
                </div>
              </div>
              <div class="detail-table-row">
                <div class="w-33 detail-table-item">
                  <p class="th-name">录入人员</p>
                  <p class="td-value">{{workstepList.craft_control_workstep_creation_staff}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">录入时间</p>
                  <p class="td-value">{{getTime(workstepList.craft_control_workstep_creation_time)}}</p>
                </div>
                <div class="w-33 detail-table-item">
                  <p class="th-name">备注</p>
                  <p class="td-value">{{workstepList.craft_control_workstep_describle}}</p>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工步参数" name="second">
            <div class="detail-table">
              <el-table :data="workstepList.workstepParameterList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
                <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                <el-table-column prop="craft_workstep_parameter_name" label="名称"></el-table-column>
                <el-table-column prop="craft_workstep_parameter_value_type" label="值类型"></el-table-column>
                <el-table-column prop="craft_workstep_parameter_value" label="值"></el-table-column>
                <el-table-column prop="deviceType.devices_control_devices_type_name" label="设备类型"></el-table-column>
                <el-table-column prop="workstep_parameter_unit" label="单位"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="使用物料" name="third">
            <div class="detail-table">
              <el-table :data="workstepList.useMaterielList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
                <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                <el-table-column prop="craft_materiel_name" label="名称"></el-table-column>
                <el-table-column prop="craft_materiel_specifications" label="规格"></el-table-column>
                <el-table-column prop="craft_materiel_model" label="型号"></el-table-column>
                <el-table-column prop="craft_materiel_value" label="数量"></el-table-column>
                <el-table-column prop="craft_materiel_value" label="单位"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="过程说明" name="fourth">
            <div class="detail-table" v-show="activeName=='fourth'">
              <el-table :data="workstepList.processDescribleList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
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
    <el-dialog :visible.sync="visible.addLoading" title="新增工步" :close-on-click-modal="false" width="75%">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-card class="box-card">
              <el-form :inline="true" label-width="100px">
                <el-col :span=24>
                  <el-form-item label="工步名称">
                    <el-input placeholder="请选择（必选）" @focus="selectCarft()" v-model="addForm.stepName" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="工步编号">
                    <el-input v-model="addForm.stepNumber" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="工步版本号">
                    <el-input placeholder="请输入（必填）" v-model="addForm.stepVersion" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="所属产品类型" prop="productTypeName">
                    <el-autocomplete v-model="addForm.productTypeName" :fetch-suggestions="queryProductTypeNameList" @select="productTypeSelect"
                      placeholder="请选择（必选）">
                    </el-autocomplete>

                  </el-form-item>
                  <el-form-item label="产品型号">
                    <el-input readonly v-show="!addForm.productTypeName"></el-input>
                    <el-autocomplete v-model="addForm.productModelName" :fetch-suggestions="queryProductModelNameList" @select="productModelSelect"
                      placeholder="请选择（必选）" v-show="addForm.productTypeName">
                    </el-autocomplete>
                  </el-form-item>
                  <el-form-item label="极性">
                    <el-select v-model="addForm.productPolar">
                      <el-option value="正极"></el-option>
                      <el-option value="负极"></el-option>
                      <el-option value="无极性"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="录入人员" prop="productTypeName">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creationStaff" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input placeholder="请选择（必选）" v-model="addForm.describle" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('first')">下一步</el-button>
                </div>
              </el-form>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="工步参数" name="second">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="selectStepParams">添加工步参数</el-button>
                </div>
                <el-table :data="paramsList" highlight-current-row @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="standard_parameter_name" label="参数名称"></el-table-column>
                  <el-table-column prop="craft_segment_number" label="取值类型"></el-table-column>
                  <el-table-column prop="craft_segment_polarity" label="值"></el-table-column>
                  <el-table-column prop="craft_segment_versions" label="单位"></el-table-column>
                  <el-table-column prop="product_model_type_name" label="设备类型"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
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
          <el-tab-pane label="使用物料" name="third">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="selectMateriel">添加物料</el-button>
                </div>
                <el-table highlight-current-row @selection-change="this.sels = sels" >
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="params_name" label="名称"></el-table-column>
                  <el-table-column prop="craft_segment_number" label="规格"></el-table-column>
                  <el-table-column prop="craft_segment_polarity" label="型号"></el-table-column>
                  <el-table-column prop="craft_segment_versions" label="数量"></el-table-column>
                  <el-table-column prop="product_model_type_name" label="单位"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="medium" icon="el-icon-delete" @click="deleteCraftSegmen(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('third')">下一步</el-button>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="过程说明" name="fourth">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="添加行">添加行</el-button>
                </div>
                <el-table highlight-current-row @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="craft_segment_name" label="事项"></el-table-column>
                  <el-table-column prop="craft_segment_number" label="说明"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" icon="el-icon-arrow-up" @click="craftSegmenUp(scope.$index)">上移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-arrow-down" @click="craftSegmenDown(scope.$index)">下移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-delete" @click="deleteCraftSegmen(scope.$index)">删除</el-button>
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
    <params :paramsAdd="paramsAdd" ref="method" v-on:selectValue="selectValues"></params>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {
    queryStepOutline, getProductTypeList, queryStepParticulars, queryProductTypeAboutModel
  } from '../../../api/api'
  import params from '../children/Params' 
  export default {
    name: 'MaintainRecord',
      components: {
        'params': params,
      },
    data() {
      return {
        filters: {
          pageSize: 10,
          page: 1,
          total: 0,
          keyword: ''
        },
        paramsAdd: {
          show: false,
          deviceId: ''
        },
        step: [],
        workstepList: [],
        semiFinishedProductParam: [],
        status: '0',
        productType: [],
        activeName: 'first',
        productTypeId: '',
        title: '工序详情',
        paramsList: [],
        versions: '',
        visible: {
          listLoading: false,
          detailForm: false,
          addLoading: false,
          editLoading: false
        },
        addForm: {
          stepId: '',
          stepName: '',
          stepNumber: '',
          stepVersion: '',
          productTypeName: '',
          productTypeId: '',
          productModelGenre: '',
          productModelId: '',
          productPolar: '',
          creationStaff: '',
          creationStaffId: '',
          describle: ''
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
        options: [{
            value: '0',
            label: '启用'
          },
          {
            value: '1',
            label: '弃用'
          }
        ],
        options1: [{
            value: '0',
            label: '正极'
          },
          {
            value: '1',
            label: '负极'
          }
        ],
        useStatus: '',
        querySearchPostTimeout: null
      }
    },
    computed: {},
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
          type: 'public',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
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
      //  获取工步列表
      getList() {
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
          polarity: this.versions
        }, this.filters)
        if (this.productTypeId) {
          para['productTypeId'] = this.productTypeId
        }
        queryStepOutline(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            res.map.workstepList.forEach(item => {
              if (item.craft_control_workstep_status === '0') {
                item.useStatus = '0'
              } else {
                item.useStatus = '1'
              }
            })
            this.step = res.map.workstepList
          } else {
            this.filters.total = 0
            this.step = []
          }
        })
      },
      // 工步详情
      processDetail(row) {
        queryStepParticulars({
          'stepIds[]': row.craft_control_workstep_id,
          headNum: 1
        }).then((res) => {
          if (res.status === 0) {
            this.workstepList = res.map.workstepList[0]
            this.visible.detailForm = true
            this.workstepList.workstepParameterList.forEach(element => {
              element.craft_workstep_parameter_value_type = this.processDetailValueType(element.craft_workstep_parameter_value_type)
              if (element.craft_workstep_parameter_value_type == '范围值') {
                element.craft_workstep_parameter_value = '最小值' + element.workstep_parameter_minimum_value +
                  '，最大值：' + element.workstep_parameter_max_value
              } else if (element.craft_workstep_parameter_value_type == '浮动值') {
                element.craft_workstep_parameter_value = '值：' + element.workstep_parameter_constant_value +
                  '，浮动范围' + element.workstep_parameter_error_value
              } else {
                element.craft_workstep_parameter_value = element.workstep_parameter_constant_value
              }
            });
          } else {
            this.workstepList = []
          }
        })
      },
      // 切换
      handleClick(tab, event) {},
      nextButton(event) {
        if (event === 'first') {
          this.activeName = 'second'
        } else if (event === 'second') {
          this.activeName = 'third'
        } else if (event === 'third') {
          this.activeName = 'fourth'
        }
      },
      processDetailValueType(valueType) {
        switch (valueType) {
          case 'constantValue':
            return '固定值'
          case 'rangeValue':
            return '范围值'
          case 'deviationValue':
            return '浮动值'
          default:
            return ''
        }
      },
      // 选择工步
      selectCarft() {
        this.$mesWorkStepBasic.show({}).then((res) => {
          console.log(res)
          this.addForm.stepName = res.rows[0].craft_workstep_basics_name
          this.addForm.stepNumber = res.rows[0].craft_workstep_basics_num
          this.addForm.stepId = res.rows[0].craft_workstep_basics_id
        })
      },
      // 新增工序
      AddStep() {
        this.visible.addLoading = true
      },
      // 添加工步参数
      selectStepParams () {
        this.paramsAdd.show = true
      },
      selectValues (msg){
        console.log(msg)
        msg[0].forEach(element => {
          this.paramsList.push('standard_parameter_name',element.standardParameterList[0].standard_parameter_name)
        });

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
                  this.$message({
                    message: '弃用成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '弃用失败',
                    type: 'error'
                  })
                }
                this.getList()
              })
            } else {
              modifyCraftVersionsStatus({
                type: 'recover',
                'craftIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({
                    message: '启用成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '启用失败',
                    type: 'error'
                  })
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
      // 添加物料
      selectMateriel() {
      },
      // 删除
      handleDelete(row) {
        this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
          if (action === 'confirm') {
            removeShift({
              classId: row.role_class_id,
              status: '1'
            }).then((res) => {
              if (res.status === 0) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
              this.visible.addLoading = false
              this.getList()
            })
          }
        }).catch()
      },
      // 提交
      submitButton() {
        let stepDescrible = []
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
          craft_control_workstep_name: this.addForm.stepName,
          craft_control_workstep_num: this.addForm.stepNumber,
          craft_workstep_basics_id:this.addForm.stepId,
          craft_control_workstep_version: this.addForm.stepVersion,
          product_type_name: this.addForm.productTypeName,
          product_model_type_id: this.addForm.productTypeId,
          product_model_genre: this.addForm.productModelGenre,
          product_model_id: this.addForm.productModelId,
          product_polar: this.addForm.productPolar,
          craft_control_workstep_creation_staff: this.addForm.creationStaff,
          craft_control_workstep_creation_staff_id: this.addForm.creationStaffId,
          craft_control_workstep_describle: this.addForm.describle,
          workstepParameterList: processIds.toString(),
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
    watch: {}
  }

</script>

<style>
  .el-table th>.cell {
    color: #333;
  }

</style>
