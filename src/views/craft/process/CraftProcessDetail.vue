<!--张叶青 2018/04/012 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="medium" @click="AddProcess">新增工序</el-button>
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
    <el-table :data="workstages" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"  label="序号"></el-table-column>
      <el-table-column prop="workstage_name" label="工序名称" sortable></el-table-column>
      <el-table-column prop="workstage_number" label="工序编号" sortable></el-table-column>
      <el-table-column prop="workstage_versions" label="工序版本"></el-table-column>
      <el-table-column prop="product_model_type_name" label="产品类型"></el-table-column>
      <el-table-column prop="craft_number" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="processDetail(scope.row)">详情</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleDelete(scope.row)">添加到模板</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="abandon(scope.row)" v-if="scope.row.workstage_status == 0 ">弃用</el-button>
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
          <el-tab-pane label="基础信息" name="first"></el-tab-pane>
          <el-tab-pane label="工步" name="second"></el-tab-pane>
          <el-tab-pane label="环境参数" name="third"></el-tab-pane>
          <el-tab-pane label="半成品参数" name="fourth"></el-tab-pane>
          <el-tab-pane label="过程说明" name="fifth"></el-tab-pane>
        </el-tabs>
        <div class="detail-table" v-show="activeName=='first'">
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">工序名称</p>
              <p class="td-value">{{workstageList.workstage_name}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">工序编号</p>
              <p class="td-value">{{workstageList.workstage_number}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">工序版本号</p>
              <p class="td-value">{{workstageList.workstage_versions}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">所属产品类型</p>
              <p class="td-value">{{workstageList.product_model_type_name}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">产品型号</p>
              <p class="td-value">{{workstageList.product_model_genre}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">优率</p>
              <p class="td-value">{{workstageList.workstage_quality_rate}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">半成品类型</p>
              <p class="td-value">{{workstageList.semi_finish_type_name}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">半成品型号</p>
              <p class="td-value">{{workstageList.semi_finish_genre}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">半成品单位</p>
              <p class="td-value">{{workstageList.semi_finish_unit}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">极性</p>
              <p class="td-value">{{workstageList.workstage_polarity}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">录入人员</p>
              <p class="td-value">{{workstageList.workstage_creation_staff}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">备注</p>
              <p class="td-value">{{workstageList.workstage_describe}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">过程图例</p>
              <p class="td-value">
                <el-button type="text" v-if="pictureInfo" download="工序过程图例" @click="showProcessMapModal()">
                  <i class="fa fa-tasks fa-fw"></i>查看图片
                </el-button>
              </p>
            </div>
          </div>
        </div>
        <div class="detail-table" v-show="activeName=='second'">
          <el-table :data="workstageList.stageAndStepRelationList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="workstep.craft_control_workstep_name" label="工步名称"></el-table-column>
            <el-table-column prop="workstep.craft_control_workstep_num" label="工步编号"></el-table-column>
            <el-table-column prop="workstep.product_polar" label="极性"></el-table-column>
            <el-table-column prop="workstep.craft_control_workstep_version" label="工步版本"></el-table-column>
            <el-table-column prop="workstep.product_type_name" label="所属产品类型"></el-table-column>
            <el-table-column prop="workstep.product_model_genre" label="产品型号"></el-table-column>
          </el-table>
        </div>
        <div class="detail-table" v-show="activeName=='third'">
          <el-table :data="environmentparam" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="workstage_use_parameter_name" label="参数名称"></el-table-column>
            <el-table-column prop="workstage_use_parameter_value_type" label="参数类型"></el-table-column>
            <el-table-column prop="workstage_use_parameter_constant_value" label="值"></el-table-column>
            <el-table-column prop="workstage_use_parameter_unit" label="单位"></el-table-column>
          </el-table>
        </div>
        <div class="detail-table" v-show="activeName=='fourth'">
          <el-table :data="semiFinishedProductParam" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="workstage_use_parameter_name" label="参数名称"></el-table-column>
            <el-table-column prop="craft_segment_number" label="参数类型"></el-table-column>
            <el-table-column prop="workstage_use_parameter_constant_value" label="值"></el-table-column>
            <el-table-column prop="workstage_use_parameter_unit" label="单位"></el-table-column>
          </el-table>
        </div>
        <div class="detail-table" v-show="activeName=='fifth'">
          <el-table :data="workstageList.processDescribleList" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="proceeding" label="事项"></el-table-column>
            <el-table-column prop="explain" label="说明"></el-table-column>
          </el-table>
        </div>
      </template>
    </el-dialog>
    <!--详情 end-->

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addLoading" title="新增工序" :close-on-click-modal="false" width="75%">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-card class="box-card">
              <el-form :inline="true" label-width="100px">
                <el-col :span=24>
                  <el-form-item label="工序名称">
                    <el-input placeholder="请选择（必选）" @focus="selectCarft()" v-model="addForm.processName" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="工序编号">
                    <el-input v-model="addForm.processNumber" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="工序版本号">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="所属产品类型" prop="productTypeName">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="产品型号">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="优率">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="半成品类型" prop="productTypeName">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="半产品型号">
                    <el-input placeholder="请选择（必选）" v-model="addForm.creatorName" clearable>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="半成品单位">
                    <el-input v-model="addForm.describe" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="极性">
                    <el-input v-model="addForm.describe" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="录入人员">
                    <el-input v-model="addForm.describe" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input placeholder="请输入" v-model="addForm.describe" clearable></el-input>
                  </el-form-item>
                  <el-form-item label="过程图例">
                    <el-input v-model="addForm.describe" readonly></el-input>
                  </el-form-item>
                </el-col>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('first')">下一步</el-button>
                </div>
              </el-form>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="工步" name="second">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="selectStep">添加工步</el-button>
                </div>
                <el-table highlight-current-row :data="step" @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="craft_control_workstep_name" label="工步名称"></el-table-column>
                  <el-table-column prop="craft_control_workstep_num" label="工步编号"></el-table-column>
                  <el-table-column prop="product_polar" label="极性"></el-table-column>
                  <el-table-column prop="craft_control_workstep_version" label="工步版本"></el-table-column>
                  <el-table-column prop="product_type_name" label="所属产品类型"></el-table-column>
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
          <el-tab-pane label="环境参数" name="third">
            <el-card>
              <div class="detail-table">
                <el-table :data="environmentParam" highlight-current-row @selection-change="this.sels = sels">
                  <el-table-column prop="name" label="名称" width='100'></el-table-column>
                  <el-table-column prop="type" label="参数类型">
                    <template slot-scope="scope">
                      <el-select v-model="environmentParam.type" size="medium" @change="getList" style="width:150px">
                        <el-option key="固定值" label="固定值" value="固定值"></el-option>
                        <el-option key="范围值" label="范围值" value="范围值"></el-option>
                        <el-option key="浮动值" label="浮动值" value="浮动值"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="值">
                    <template slot-scope="scope" v-if="environmentParam.type =='固定值'">
                      <el-input > </el-input>
                    </template>
                    <template slot-scope="scope" v-if="environmentParam.type!='固定值'">
                      <el-input style=" width: 45%;float: left"> </el-input>
                      <el-input style=" width: 45%;float: left;margin-left:10px"> </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位" width='100'></el-table-column>
                </el-table>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('third')">下一步</el-button>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="半成品参数" name="fourth">
            <el-card>
              <div class="detail-table">
                <div slot="header" class="clearfix" style="line-height:36px">
                  <el-button style="float: right;margin-top: 10px;" type="primary" size="medium" @click="selectStep">添加半成品参数</el-button>
                </div>
                <el-table highlight-current-row :data="step" @selection-change="this.sels = sels">
                  <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                  <el-table-column prop="craft_control_workstep_name" label="名称"></el-table-column>
                  <el-table-column prop="craft_segment_number" label="参数类型"></el-table-column>
                  <el-table-column prop="craft_segment_polarity" label="值"></el-table-column>
                  <el-table-column prop="craft_segment_versions" label="单位"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" icon="el-icon-arrow-up" @click="craftSegmenUp(scope.$index)">上移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-arrow-down" @click="craftSegmenDown(scope.$index)">下移</el-button>
                      <el-button type="text" size="medium" icon="el-icon-delete" @click="deleteCraftSegmen(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div>
                  <el-button style="float: right;margin-top: 10px;margin-bottom: 10px;" type="primary" size="medium" @click="nextButton('fourth')">下一步</el-button>
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="过程说明" name="fifth">
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
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {
    queryWorkstageOutline, getProductTypeList, queryWorkstageParticulars
  } from '../../../api/api'
  export default {
    data() {
      return {
        filters: {
          pageSize: 10,
          page: 1,
          total: 0,
          keyword: ''
        },
        workstages: [],
        pictureInfo: '',
        workstageList: [],
        environmentparam: [],
        semiFinishedProductParam: [],
        status: '0',
        productType: [],
        step: [],
        activeName: 'first',
        productTypeId: '',
        title: '工序详情',
        versions: '',
        visible: {
          listLoading: false,
          detailForm: false,
          addLoading: false,
          editLoading: false
        },
        addForm: {
          productTypeName: '',
          productTypeId: '',
          productModelId: '',
          productModelName: '',
          processName: '',
          processNumber: '',
          processId: '',
          describe: ''
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
        options1: [
          { value: '0', label: '正极' },
          { value: '1', label: '负极' }
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
      handlePageChange (val) {
        this.filters.page = val
        this.getList()
      },
      //  每页数量改变
      handleSizeChange (val) {
        this.filters.pageSize = val
        this.getList()
      },
      // 列表索引
      getIndex (index) {
        return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
      },
      // 重置
      reset () {
        this.filters = {
          type: 'public',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取产品类型列表
      getTypeList () {
        getProductTypeList({
          type: 'vague',
          status: 0
        }).then(data => {
          this.productType = data.map.productTypes
        })
      },
      //  获取工序列表
      getList () {
        this.getTypeList()
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
          polarity: this.versions
        }, this.filters)
        if (this.productTypeId) {
          para['productTypeId'] = this.productTypeId
        }
        queryWorkstageOutline(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            res.map.workstages.forEach(item => {
              if (item.workstage_status === '0') {
                item.useStatus = '0'
              } else {
                item.useStatus = '1'
              }
            })
            this.workstages = res.map.workstages
          } else {
            this.filters.total = 0
            this.workstages = []
          }
        })
      },
      // 工序详情
      processDetail (row) {
        queryWorkstageParticulars({
          versionType: 'public',
          'workstageIds[]': row.workstage_id,
          headNum: 1
        }).then((res) => {
          if (res.status === 0) {
            this.workstageList = res.map.workstageList[0]
            if (res.map.pictureInfo) {
              this.pictureInfo = res.map.pictureInfo[0]
            }
            this.workstageList.useParametersList.forEach(element => {
              element.workstage_use_parameter_value_type = this.processDetailValueType(element.workstage_use_parameter_value_type)
            });
            this.environmentparam = (() => {
              return this.workstageList.useParametersList.filter(function (elem) {
                return elem.standard_parameter_type_name === '环境参数'
              })
            })()
            this.semiFinishedProductParam = (() => {
              return this.workstageList.useParametersList.filter(function (elem) {
                return elem.standard_parameter_type_name !== '环境参数'
              })
            })()
            this.visible.detailForm = true
          } else {
          }
        })
      },
      // 切换
      handleClick (tab, event) {
      },
      showProcessMapModal () {
        window.open('http://www.imes-inc.ser:6789/mes/queryWorkstagePicture.do?fileName=' + this.pictureInfo.img_name)
      },
      processDetailValueType (valueType) {
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
      // BOM管理
      bomManage (row) {
        this.$router.push({
          path: '/craft/bomManage',
          query: {
            type: 'craftVersionsId',
            id: row.craft_id,
            title: '工艺：' + row.craft_name
          }
        })
      },
      // 新增工序
      AddProcess () {
        this.visible.addLoading = true
      },
      selectStep () {
        this.$mesWorkStepOutline.show({
          status: 0
        }).then((res) => {
          console.log(res.rows[0])
          let data = res.rows[0]
          this.step.push(res.rows[0])
        })
      },
      // 修改状态
      statusChanged (row) {
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
      nextButton (event) {
        if (event === 'first') {
          this.activeName = 'second'
        } else if (event === 'second') {
          this.activeName = 'third'
        } else if (event === 'third') {
          this.activeName = 'fourth'
        } else if (event === 'fourth') {
          this.activeName = 'fifth'
        }
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          classId: row.role_class_id,
          className: row.role_class_name,
          classDetail: row.role_class_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
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
      // 转换时间格式
      getTime (timestamp) {
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