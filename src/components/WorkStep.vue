<!-- 刘川中 2018.4.13 -->
<template>
	<el-row>
    <el-tabs type="border-card">
		  <el-tab-pane label="工步">
				<!--列表 start-->
		    <el-table :data="stageAndStepRelationList" v-loading="visible.listLoading"
		              row-class-name="el-mini-row"
		              highlight-current-row>
		      <el-table-column type="index" :index="getIndex"></el-table-column>
		      <el-table-column prop="workstep.craft_control_workstep_name" label="工步名称" sortable></el-table-column>
		      <el-table-column prop="workstep.craft_control_workstep_num" label="工步编号" sortable></el-table-column>
		      <el-table-column prop="workstep.craft_control_workstep_version" label="工步版本" sortable></el-table-column>
		      <el-table-column prop="" label="操作" width="380">
		      	<template slot-scope="scope">
              <div v-if="visible.addButton">
                <el-button type="primary" size="small" @click="handleMaterialDetail(scope.row, 'add')">添加物料</el-button>
                <el-button type="primary" size="small" @click="handleWorkstepDetail(scope.row, 'add')">添加工步参数</el-button>
                <el-button type="primary" size="small" @click="handleDeviceUserRecordDetail(scope.row, 'add')">添加设备操作记录</el-button>
              </div>
              <div v-else>
                <el-button type="success" size="small" @click="handleMaterialDetail(scope.row)">物料详情</el-button>
                <el-button type="success" size="small" @click="handleWorkstepDetail(scope.row)">工步参数</el-button>
                <el-button type="success" size="small" @click="handleDeviceUserRecordDetail(scope.row)">设备操作记录</el-button>
              </div>
		      	</template>
		      </el-table-column>
		    </el-table>
		    <!--列表 end-->

				<!--分页start -->
		    <div class="clearfix" hidden>
		      <el-col :span="24" class="toolbar">
		        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
		                       :total="filters.total"
		                       @current-change="handlePageChange" @size-change="handleSizeChange">
		        </el-pagination>
		      </el-col>
		    </div>
		    <!--分页end -->
		  </el-tab-pane>
		  <el-tab-pane label="环境参数">
				<!--列表 start-->
		    <el-table :data="useParametersList1" v-loading="visible.listLoading"
		              row-class-name="el-mini-row"
		              highlight-current-row>
		      <el-table-column type="index" :index="getIndex"></el-table-column>
		      <el-table-column prop="workstage_use_parameter_name" label="参数名称" sortable></el-table-column>
		      <el-table-column prop="workstage_use_parameter_value_type" label="值类型" sortable>
		      	<template slot-scope="scope">
		      		{{ getParamLabel(scope.row.workstage_use_parameter_value_type) }}
		      	</template>
		      </el-table-column>
		      <el-table-column prop="workstage_use_parameter_constant_value" label="参考值" sortable></el-table-column>
		      <el-table-column prop="workstage_use_parameter_unit" label="单位" sortable></el-table-column>
		      <el-table-column prop="" label="操作" width="100">
		      	<template slot-scope="scope">
		      		<el-button type="primary" size="small" @click="handleEnvironmentDetail(scope.row, 'add')" v-if="visible.addButton">添加参数</el-button>
		      		<el-button type="success" size="small" @click="handleEnvironmentDetail(scope.row)" v-else>参数详情</el-button>
		      	</template>
		      </el-table-column>
		    </el-table>
		    <!--列表 end-->
		  </el-tab-pane>
		  <el-tab-pane label="半成品参数">
				<!--列表 start-->
		    <el-table :data="useParametersList2" v-loading="visible.listLoading"
		              row-class-name="el-mini-row"
		              highlight-current-row>
		      <el-table-column type="index" :index="getIndex"></el-table-column>
		      <el-table-column prop="workstage_use_parameter_name" label="参数名称" sortable></el-table-column>
		      <el-table-column prop="workstage_use_parameter_value_type" label="值类型" sortable>
		      	<template slot-scope="scope">
		      		{{ getParamLabel(scope.row.workstage_use_parameter_value_type) }}
		      	</template>
		      </el-table-column>
		      <el-table-column prop="workstage_use_parameter_constant_value" label="参考值" sortable></el-table-column>
		      <el-table-column prop="workstage_use_parameter_unit" label="单位" sortable></el-table-column>
		      <el-table-column prop="" label="操作" width="100">
		      	<template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEnvironmentDetail(scope.row, 'add')" v-if="visible.addButton">添加参数</el-button>
              <el-button type="success" size="small" @click="handleEnvironmentDetail(scope.row)" v-else>参数详情</el-button>
		      	</template>
		      </el-table-column>
		    </el-table>
		    <!--列表 end-->
		  </el-tab-pane>
		</el-tabs>
    <!-- 物料详情 -->
    <el-dialog :visible.sync="visible.material" title="物料详情" width="70%" class="mes-dialog">
      <el-tabs type="border-card">
        <el-tab-pane label="投料详情一">
          <el-table :data="useMaterielList" v-loading="visible.useMaterielListLoading"
                    row-class-name="el-mini-row"
                    highlight-current-row>
            <el-table-column type="index" :index="getUseMaterielListIndex"></el-table-column>
            <el-table-column prop="craft_materiel_name" label="物料名称" sortable></el-table-column>
            <el-table-column prop="craft_materiel_specifications" label="规格" sortable></el-table-column>
            <el-table-column prop="craft_materiel_model" label="型号" sortable></el-table-column>
            <el-table-column prop="craft_materiel_unit" label="单位" sortable></el-table-column>
            <el-table-column prop="" label="操作" width="220">
              <template slot-scope="scope">
                <el-button type="" size="small" @click="handleMaterialDetailView(scope.row)">参数详情</el-button>
                <el-button type="primary" size="small" @click="handleMaterialDetailView(scope.row, 'add')" v-if="visible.addButton">添加</el-button>
                <!--<el-button type="danger" size="small" icon="el-icon-delete" @click="handleMaterialParamsDel(scope.row)" v-if="visible.delButton">删除</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="clearfix">
            <el-col :span="24" class="toolbar">
              <el-pagination layout="total, sizes, prev, pager ,next" :page-size="materialFilters.pageSize"
                             :total="materialFilters.total"
                             @current-change="handleMaterialPageChange" @size-change="handleMaterialSizeChange">
              </el-pagination>
            </el-col>
          </div>
        </el-tab-pane>
        <el-tab-pane label="投料详情二">
          <el-col class="toolbar">
            <el-form :inline="true" :model="material2Filters" @submit.native.prevent>
              <el-col :span="24" class="text-right">
                <el-form-item :span="4">
                  <el-select v-model="material2Filters.type" placeholder="查看方式" @change="getUseMaterielList2" size="medium">
                    <el-option
                      v-for="item in materialTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item>-->
                  <!--<el-button size="medium" @click="materialFilters.type = ''; getUseMaterielList2()">重置</el-button>-->
                <!--</el-form-item>-->
              </el-col>
            </el-form>
          </el-col>
          <el-table :data="useMaterielList2" v-loading="visible.useMaterielList2Loading"
                    row-class-name="el-mini-row"
                    highlight-current-row>
            <el-table-column type="index" :index="getUseMaterielList2Index"></el-table-column>
            <el-table-column prop="craft_materiel_name" label="物料名称" sortable></el-table-column>
            <el-table-column prop="craft_materiel_specifications" label="规格" sortable></el-table-column>
            <el-table-column prop="craft_materiel_model" label="型号" sortable></el-table-column>
            <el-table-column prop="craft_materiel_unit" label="单位" sortable></el-table-column>
            <el-table-column prop="step_use_material_time" label="投料时间" sortable>
              <template slot-scope="scope">
                {{ getTime(scope.row.step_use_material_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="step_use_material_amount" label="使用数量" sortable></el-table-column>
            <el-table-column prop="step_use_material_user" label="投料人" sortable></el-table-column>
            <el-table-column prop="step_use_material_number" label="物料编号" sortable></el-table-column>
            <el-table-column prop="step_use_material_describe" label="备注" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 工步参数 -->
    <el-dialog :visible.sync="visible.workstep" title="工步参数" width="70%" class="mes-dialog">
      <el-tabs type="border-card">
        <el-tab-pane label="工步详情一">
          <el-table :data="workstepParameterList" v-loading="visible.workstepParameterListLoading"
                  row-class-name="el-mini-row"
                  highlight-current-row>
          <el-table-column type="index" :index="getWorkstepParameterListIndex"></el-table-column>
          <el-table-column prop="craft_workstep_parameter_name" label="参数" sortable></el-table-column>
            <el-table-column prop="craft_workstep_parameter_value_type" label="值类型" sortable>
              <template slot-scope="scope">
                {{ getParamLabel(scope.row.craft_workstep_parameter_value_type) }}
              </template>
            </el-table-column>
          <el-table-column prop="workstep_parameter_constant_value" label="参考值" sortable></el-table-column>
          <el-table-column prop="workstep_parameter_unit" label="单位" sortable></el-table-column>
          <el-table-column prop="devices_control_devices_type_id" label="设备类型" sortable>
              <template slot-scope="scope">
                {{ getDeviceLabel(scope.row.devices_control_devices_type_id) }}
              </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="" size="small" @click="handleWorkstepParameterDetailView(scope.row)">参数详情</el-button>
              <el-button type="primary" size="small" @click="handleWorkstepParameterDetailView(scope.row, 'add')" v-if="visible.addButton">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
        <el-tab-pane label="工步详情二">
          <el-col class="toolbar">
            <el-form :inline="true" :model="workstep2Filters" @submit.native.prevent>
              <el-col :span="24" class="text-right">
                <el-form-item :span="4">
                  <el-select v-model="workstep2Filters.type" placeholder="查看方式" @change="getWorkstepParameterList2" size="medium">
                    <el-option
                      v-for="item in parameteRecordTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--<el-form-item>-->
                <!--<el-button size="medium" @click="workstep2Filters.type = ''; getWorkstepParameterList2()">重置</el-button>-->
                <!--</el-form-item>-->
              </el-col>
            </el-form>
          </el-col>
            <el-table :data="workstepParameterList2" v-loading="visible.workstepParameterList2Loading"
                    row-class-name="el-mini-row"
                    highlight-current-row>
            <el-table-column type="index" :index="getWorkstepParameterList2Index"></el-table-column>
            <el-table-column prop="craft_workstep_parameter_name" label="参数名称" sortable></el-table-column>
            <el-table-column prop="craft_workstep_parameter_value_type" label="参数类型" sortable>
              <template slot-scope="scope">
                {{ getParamLabel(scope.row.craft_workstep_parameter_value_type) }}
              </template>
            </el-table-column>
            <el-table-column prop="workstep_parameter_constant_value" label="参考值" sortable></el-table-column>
            <el-table-column prop="step_use_steady_state_value" label="实际值" sortable></el-table-column>
            <el-table-column prop="devices_control_devices_type_id" label="设备类型" sortable>
              <template slot-scope="scope">
                {{ getDeviceLabel(scope.row.devices_control_devices_type_id) }}
              </template>
            </el-table-column>
            <el-table-column prop="devices_control_devices_number" label="设备编号" sortable></el-table-column>
            <el-table-column prop="step_use_note_taker" label="记录人" sortable></el-table-column>
            <el-table-column prop="step_use_write_time" label="记录时间" width="150" sortable>
              <template slot-scope="scope">
                {{ getTime(scope.row.step_use_write_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="step_use_describe" label="备注" sortable></el-table-column>
          </el-table>
          <div class="clearfix">
            <el-col :span="24" class="toolbar">
              <el-pagination layout="total, sizes, prev, pager ,next" :page-size="workstep2Filters.pageSize"
                             :total="workstep2Filters.total"
                             @current-change="handleWorkstep2PageChange" @size-change="handleWorkstep2SizeChange">
              </el-pagination>
            </el-col>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 设备操作记录 -->
    <el-dialog :visible.sync="visible.deviceLog" title="设备操作记录" width="50%" class="mes-dialog">
      <!--<el-col class="toolbar">-->
        <!--<el-form :inline="true" :model="deviceLogFilters" @submit.native.prevent>-->
          <!--<el-col :span="24" class="text-right">-->
            <!--<el-form-item :span="4">-->
              <!--<el-input v-model.trim="deviceLogFilters.keyword" size="medium" placeholder="输入关键字" @keyup.native.enter="getDeviceLogList"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item>-->
              <!--<el-button type="primary" size="medium" @click="getDeviceLogList" icon="el-icon-search">查询</el-button>-->
              <!--<el-button size="medium" @click="deviceLogFilters.keyword = ''; getDeviceLogList()">重置</el-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-form>-->
      <!--</el-col>-->
      <el-table :data="deviceLogList" v-loading="visible.deviceLogListLoading"
                row-class-name="el-mini-row"
                highlight-current-row>
        <el-table-column type="index" :index="getDeviceLogListIndex"></el-table-column>
        <el-table-column prop="devices_control_devices_name" label="设备名称" sortable></el-table-column>
        <el-table-column prop="devices_control_devices_number" label="设备编号" sortable></el-table-column>
        <el-table-column prop="devices_operation_start_time" label="开始时间" width="150" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.devices_operation_start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="devices_operation_end_time" label="结束时间" width="150" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.devices_operation_end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="devices_operation_operator_type" label="操作状态" sortable></el-table-column>
        <el-table-column prop="devices_operation_operator" label="操作人" sortable></el-table-column>
        <el-table-column prop="" label="操作" width="" v-if="visible.delButton">
          <template slot-scope="scope">
            <!--<el-button type="" size="small" @click="handleDeviceLogDetailView(scope.row)">参数详情</el-button>-->
            <!--<el-button type="primary" size="small" @click="handleDeviceLogDetailView(scope.row, 'add')" v-if="visible.addButton">添加</el-button>-->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDeviceLogDel(scope.row)" v-if="visible.delButton">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="deviceLogFilters.pageSize"
                         :total="deviceLogFilters.total"
                         @current-change="handleDeviceLogPageChange" @size-change="handleDeviceLogSizeChange">
          </el-pagination>
        </el-col>
      </div>
    </el-dialog>

    <!-- 物料参数详情 -->
    <el-dialog :visible.sync="visible.materialParams" title="物料参数详情" width="50%" class="mes-dialog">
      <el-table :data="materialParamsList" v-loading="visible.materialParamsListLoading"
                row-class-name="el-mini-row"
                highlight-current-row>
        <el-table-column type="index" :index="getMaterialParamsListIndex"></el-table-column>
        <el-table-column prop="step_use_material_time" label="投料时间" width="150" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.step_use_material_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="step_use_material_amount" label="使用数量" sortable></el-table-column>
        <el-table-column prop="step_use_material_user" label="投料人" sortable></el-table-column>
        <el-table-column prop="step_use_material_number" label="物料编号" width="150" sortable></el-table-column>
        <el-table-column prop="step_use_material_describe" label="备注" sortable></el-table-column>
        <el-table-column prop="" label="操作" width="" v-if="visible.delButton">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="small" icon="el-icon-edit" @click="handleMaterialParamsEdit(scope.row)">修改</el-button>-->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleMaterialParamsDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="materialParamsFilters.pageSize"
                         :total="materialParamsFilters.total"
                         @current-change="handleMaterialParamsPageChange" @size-change="handleMaterialParamsSizeChange">
          </el-pagination>
        </el-col>
      </div>
    </el-dialog>

    <!-- 工步参数详情 -->
    <el-dialog :visible.sync="visible.workstepParams" title="工步参数详情" width="50%" class="mes-dialog">
      <el-table :data="workstepParamsList" v-loading="visible.workstepParamsListLoading"
                row-class-name="el-mini-row"
                highlight-current-row>
        <el-table-column type="index" :index="getWorkstepParamsListIndex"></el-table-column>
        <el-table-column prop="step_use_steady_state_value" label="参数值" sortable></el-table-column>
        <el-table-column prop="step_use_note_taker" label="记录人" sortable></el-table-column>
        <el-table-column prop="step_use_write_time" label="记录时间" width="150" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.step_use_write_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="devices_control_devices_number" label="设备编号" sortable></el-table-column>
        <el-table-column prop="step_use_describe" label="备注" sortable></el-table-column>
        <el-table-column prop="" label="操作" width="" v-if="visible.delButton">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="small" icon="el-icon-edit" @click="handleWorkstepParamsEdit(scope.row)">修改</el-button>-->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleWorkstepParamsDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="workstepParamsFilters.pageSize"
                         :total="workstepParamsFilters.total"
                         @current-change="handleWorkstepParamsPageChange" @size-change="handleWorkstepParamsSizeChange">
          </el-pagination>
        </el-col>
      </div>
    </el-dialog>

    <!-- 环境参数, 半成品参数详情 -->
    <el-dialog :visible.sync="visible.environmentParamsDetail" title="参数详情" width="50%" class="mes-dialog">
      <el-table :data="environmentParamsDetailList" v-loading="visible.environmentParamsDetailListLoading"
                row-class-name="el-mini-row"
                highlight-current-row>
        <el-table-column type="index" :index="getEnvironmentParamsDetailListIndex"></el-table-column>
        <el-table-column prop="parameter_record_steady_state_value" label="实际值" sortable></el-table-column>
        <el-table-column prop="parameter_record_note_taker" label="记录人" sortable></el-table-column>
        <el-table-column prop="parameter_record_write_time" label="记录时间" width="150" sortable>
          <template slot-scope="scope">
            {{ getTime(scope.row.parameter_record_write_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="parameter_record_describe" label="备注" sortable></el-table-column>
        <el-table-column prop="" label="操作" width="" v-if="visible.delButton">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="small" icon="el-icon-edit" @click="handleWorkstepParamsEdit(scope.row)">修改</el-button>-->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleEnvironmentParamsDetailDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="environmentParamsDetailFilters.pageSize"
                         :total="environmentParamsDetailFilters.total"
                         @current-change="handleEnvironmentParamsDetailPageChange" @size-change="handleEnvironmentParamsDetailSizeChange">
          </el-pagination>
        </el-col>
      </div>
    </el-dialog>

	</el-row>
</template>

<script>
  import utils from '../common/js/utils'
  import {
    queryWorkstageParticulars, queryWorkOrderParameteRecord,
    queryStepParticulars, queryWorkOrderMaterialUseRecord,
    queryWorkOrderDevicesOperationRecord, saveWorkOrderMaterialUseRecord,
    saveWorkOrderStepParameteRecord, saveWorkOrderDevicesOperationRecord,
    queryWorkOrderStepParameteRecord, removeWorkOrderDevicesOperationRecord,
    removeWorkOrderMaterialUseRecord, removeWorkOrderStepParameteRecord,
    removeWorkOrderParameteRecord, saveWorkOrderParameteRecord
  } from '../api/api'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'work-step',
    data () {
      return {
        filters: {
          type: 'info',
          status: 0,
          page: 1,
          pageSize: 10,
          total: 0
        },
        materialFilters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        material2Filters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        workstepFilters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        workstep2Filters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        deviceLogFilters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        environmentParamsFilters: {
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        environmentParamsDetailFilters: {
          parameteId: '',
          type: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        materialParamsFilters: {
          type: 'norm',
          workOrderId: '',
          stepMaterialId: '',
          page: 1,
          pageSize: 10,
          total: 0
        },
        workstepParamsFilters: {
          stepParameteId: '',
          type: 'norm',
          page: 1,
          pageSize: 10,
          total: 0
        },
        materialTypeList: [
          {label: '按物料名称', value: 'materialName'},
          {label: '按时间升序', value: 'materialUseTimeAsc'},
          {label: '按物料降序', value: 'materialUseTimeDesc'}
        ],
        parameteRecordTypeList: [
          {label: '按参数名称查看', value: 'stepParameteName'},
          {label: '按时间升序', value: 'parameteRecordTimeAsc'},
          {label: '按物料降序', value: 'parameteRecordTimeDesc'}
        ],
        visible: {
          listLoading: false,
          material: false,
          workstep: false,
          deviceLog: false,
          environment: false,
          semiProduct: false,
          useMaterielListLoading: false,
          useMaterielList2Loading: false,
          workstepParameterListLoading: false,
          workstepParameterList2Loading: false,
          deviceLogListLoading: false,
          environmentParams: false,
          environmentParamsDetail: false,
          environmentParamsListLoading: false,
          environmentParamsDetailListLoading: false,
          AddMaterialRecord: false,
          addButton: false,
          delButton: false,
          materialParams: false,
          workstepParams: false,
          materialParamsListLoading: false,
          workstepParamsListLoading: false
        },
        list: [],
        processDescribleList: [],
        stageAndStepRelationList: [],
        useParametersList: [],
        useParametersList1: [],
        useParametersList2: [],
        stepId: '',
        stepMaterialId: '',
        useMaterielList: [],
        useMaterielList2: [],
        workstepParameterList: [],
        workstepParameterList2: [],
        deviceLogList: [],
        environmentParamsList: [],
        environmentParamsDetailList: [],
        materialParamsList: [],
        workstepParamsList: [],
        craft: {}
      }
    },
    props: {
      workstageIds: {
        type: String,
        default: ''
      },
      workOrderId: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters({
        paramValueTypeList: 'getParamValueTypeList',
        deviceTypes: 'getDeviceTypes'
      })
    },
    mounted () {
      if (this.workstageIds !== '') {
        this.getList()
      }
      if (this.deviceTypes.length === 0) {
        this.initDevicesTypes()
      }
      this.visible.addButton = this.$router.history.current.query.type === 'add'
      this.visible.delButton = !this.visible.addButton && (this.$router.history.current.path.indexOf('my_workorder') > 0)
    },
    methods: {
      ...mapActions(['initDevicesTypes']),
      // 列表索引
      getIndex (index) {
        return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
      },
      getUseMaterielListIndex (index) {
        return utils.getHeadNumAdapter(this.materialFilters.page, this.materialFilters.pageSize, index)
      },
      getUseMaterielList2Index (index) {
        return utils.getHeadNumAdapter(this.workstepFilters.page, this.workstepFilters.pageSize, index)
      },
      getWorkstepParameterListIndex (index) {
        return utils.getHeadNumAdapter(this.workstep2Filters.page, this.workstep2Filters.pageSize, index)
      },
      getWorkstepParameterList2Index (index) {
        return utils.getHeadNumAdapter(this.deviceLogFilters.page, this.deviceLogFilters.pageSize, index)
      },
      getDeviceLogListIndex (index) {
        return utils.getHeadNumAdapter(this.deviceLogFilters.page, this.deviceLogFilters.pageSize, index)
      },
      getEnvironmentParamsListIndex (index) {
        return utils.getHeadNumAdapter(this.environmentParamsFilters.page, this.environmentParamsFilters.pageSize, index)
      },
      getEnvironmentParamsDetailListIndex (index) {
        return utils.getHeadNumAdapter(this.environmentParamsFilters.page, this.environmentParamsFilters.pageSize, index)
      },
      getMaterialParamsListIndex (index) {
        return utils.getHeadNumAdapter(this.materialParamsFilters.page, this.materialParamsFilters.pageSize, index)
      },
      getWorkstepParamsListIndex (index) {
        return utils.getHeadNumAdapter(this.workstepParamsFilters.page, this.workstepParamsFilters.pageSize, index)
      },
      // 获取数据列表
      getList () {
        // this.list = []
        this.visible.listLoading = true
        let para = Object.assign({
          'workstageIds[]': this.workstageIds,
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        })
        queryWorkstageParticulars(para).then((res) => {
          if (res.status === 0) {
            // this.filters.total = res.map.lines
            this.list = res.map.workstageList
            this.processDescribleList = this.list[0].processDescribleList
            this.stageAndStepRelationList = this.list[0].stageAndStepRelationList
            this.useParametersList = this.list[0].useParametersList
            this.useParametersList.map(v => {
              if (v.standard_parameter_type_name === '环境参数') {
                this.useParametersList1.push(v)
              } else {
                this.useParametersList2.push(v)
              }
            })
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.visible.listLoading = false
        })
      },
      // 页码改变
      handlePageChange (val) {
        this.filters.page = val
        this.getList()
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.materialFilters.pageSize = val
        this.getList()
      },
      handleMaterialPageChange (val) {
        this.filters.page = val
        this.getUseMaterielList()
      },
      handleMaterialSizeChange (val) {
        this.materialFilters.pageSize = val
        this.getUseMaterielList()
      },
      handleWorkstep2PageChange (val) {
        this.workstep2Filters.page = val
        this.getWorkstepParameterList2()
      },
      handleWorkstep2SizeChange (val) {
        this.workstep2Filters.pageSize = val
        this.getWorkstepParameterList2()
      },
      handleDeviceLogPageChange (val) {
        this.deviceLogFilters.page = val
        this.getDeviceLogList()
      },
      handleDeviceLogSizeChange (val) {
        this.deviceLogFilters.pageSize = val
        this.getDeviceLogList()
      },
      handleMaterialParamsPageChange (val) {
        this.materialParamsFilters.page = val
        this.getMaterialParamsList()
      },
      handleMaterialParamsSizeChange (val) {
        this.materialParamsFilters.pageSize = val
        this.getMaterialParamsList()
      },
      handleWorkstepParamsPageChange (val) {
        this.workstepParamsFilters.page = val
        this.getWorkstepParamsList()
      },
      handleWorkstepParamsSizeChange (val) {
        this.workstepParamsFilters.pageSize = val
        this.getWorkstepParamsList()
      },
      handleEnvironmentParamsDetailPageChange (val) {
        this.environmentParams.page = val
        this.getEnvironmentParamsDetailList()
      },
      handleEnvironmentParamsDetailSizeChange (val) {
        this.environmentParams.pageSize = val
        this.getEnvironmentParamsDetailList()
      },
      getParamLabel (value) {
        let label = ''
        this.paramValueTypeList.map(v => {
          if (v.value === value) {
            label = v.label
          }
        })
        return label
      },
      getDeviceLabel (value) {
        let label = ''
        this.deviceTypes.map(v => {
          if (v.value === value) {
            label = v.label
          }
        })
        return label
      },
      handleMaterialDetail (row, type) {
        this.visible.material = true
        this.stepId = row.workstep.craft_control_workstep_id
        this.getUseMaterielList()
        this.getUseMaterielList2()
      },
      getUseMaterielList () {
        this.visible.useMaterielListLoading = true
        queryStepParticulars(Object.assign({'stepIds[]': this.stepId}, this.materialFilters)).then((res) => {
          if (res.status === 0) {
            this.useMaterielList = res.map.workstepList[0].useMaterielList
            this.workstepParameterList = res.map.workstepList[0].workstepParameterList
          } else {
            this.useMaterielList = []
            this.workstepParameterList = []
          }
          this.visible.useMaterielListLoading = false
        })
      },
      // 物料详情不同的查看方式
      getUseMaterielList2 () {
        this.visible.useMaterielList2Loading = true
        this.material2Filters.type = this.material2Filters.type || this.materialTypeList[0].value
        queryWorkOrderMaterialUseRecord({
          stepId: this.stepId,
          type: this.material2Filters.type,
          workOrderId: this.workOrderId,
          headNum: utils.getHeadNumAdapter(this.material2Filters.page, this.material2Filters.pageSize)
        }).then(res => {
          if (res.status === 0) {
            this.material2Filters.total = res.map.line
            this.useMaterielList2 = res.map.materialUseRecords
          } else {
            this.material2Filters.total = 0
            this.useMaterielList2 = []
          }
          this.visible.useMaterielList2Loading = false
        })
      },
      getWorkstepParameterList2 () {
        this.visible.workstepParameterList2Loading = true
        this.workstep2Filters.type = this.workstep2Filters.type || this.parameteRecordTypeList[0].value
        queryWorkOrderStepParameteRecord({
          stepId: this.stepId,
          type: this.workstep2Filters.type,
          workOrderId: this.workOrderId,
          headNum: utils.getHeadNumAdapter(this.workstep2Filters.page, this.workstep2Filters.pageSize)
        }).then(res => {
          if (res.status === 0) {
            this.workstep2Filters.total = res.map.line
            this.workstepParameterList2 = res.map.stepParameteRecords
          } else {
            this.workstep2Filters.total = 0
            this.workstepParameterList2 = []
          }
          this.visible.workstepParameterList2Loading = false
        })
      },
      handleWorkstepDetail (row, type) {
        this.visible.workstep = true
        this.stepId = row.workstep.craft_control_workstep_id
        this.getUseMaterielList()
        this.getWorkstepParameterList2()
      },
      handleDeviceUserRecordDetail (row, type) {
        if (type === 'add') {
          this.handleDeviceLogDetailView(row, type)
        } else {
          this.visible.deviceLog = true
          this.stepId = row.workstep.craft_control_workstep_id
          this.getDeviceLogList()
        }
      },
      handleEnvironmentDetail (row, type) {
        // console.log(row);
        if (type === 'add') {
          this.$mesAddParams.show('添加参数', {
            paramNames: ['参数值', '记录人', '记录时间', '备注']
          }).then(data => {
            let params = []
            data.rows.forEach(item => {
              params.push({
                'work_order_id': this.workOrderId,
                'craft_workstep_parameter_main_id': row.workstage_use_parameter_main_id,
                'craft_workstep_parameter_id': '',
                'standard_parameter_type_id': row.standard_parameter_type_id,
                'workstage_id': row.workstage_id,
                'parameter_record_steady_state_value': item.param_value,
                'parameter_record_write_time': item.record_time,
                'parameter_record_note_taker': item.record_user,
                'parameter_record_note_taker_id': item.record_user_id,
                'parameter_record_describe': item.remark,
                'parameter_record_value_type': row.workstage_use_parameter_value_type
              })
            })
            saveWorkOrderParameteRecord({type: 'save', parameteRecords: JSON.stringify(params)}).then(res => {
              if (res.status === 0) {
                this.$message.success('参数添加成功')
              } else {
                this.$message.error(res.msg || '参数添加失败')
              }
            })
          })
        } else {
          this.visible.environmentParamsDetail = true
          // this.visible.environment = true
          this.environmentParamsDetailFilters.parameteId = row.workstage_use_parameter_main_id
          this.getEnvironmentParamsDetailList()
        }
      },
      handleSemiProductDetail (row) {
        console.log(row);
      },
      // 物料详情
      handleMaterialDetailView (row, type) {
        // console.log(row);
        if (type === 'add') {
          this.$mesAddParams.show('添加物料', {
            paramNames: ['投料时间', '使用数量', '物料编号', '投料人', '备注']
          }).then(data => {
            let params = []
            data.rows.forEach(item => {
              params.push({
                'craft_materiel_id': row.craft_materiel_id,
                'craft_materiel_main_id': row.craft_materiel_main_id,
                'step_use_material_time': item.use_material_time,
                'step_use_material_amount': item.use_material_amount,
                'step_use_material_user': item.use_material_user,
                'step_use_material_user_id': item.use_material_user_id,
                'step_use_material_describe': item.remark,
                'craft_materiel_unit': row.craft_materiel_unit,
                'craft_materiel_name': row.craft_materiel_name,
                'craft_materiel_specifications': row.craft_materiel_specifications,
                'craft_materiel_model': row.craft_materiel_model,
                'step_use_material_number': item.use_material_time,
                'work_order_id': this.workOrderId
              })
            })
            saveWorkOrderMaterialUseRecord({type: 'save', materialUseRecords: JSON.stringify(params)}).then(res => {
              if (res.status === 0) {
                this.$message.success('物料添加成功')
              } else {
                this.$message.error(res.msg || '物料添加失败')
              }
            })
          })
        } else {
          this.visible.materialParams = true
          this.materialParamsFilters.stepMaterialId = row.craft_materiel_id
          this.getMaterialParamsList()
        }
      },
      // 添加工步参数
      handleWorkstepParameterDetailView (row, type) {
        console.log(row);
        if (type === 'add') {
          this.$mesAddParams.show('添加工步参数', {
            paramNames: ['参数值', '记录人', '记录时间', '设备编号', '备注']
          }).then(data => {
            let params = []
            data.rows.forEach(item => {
              params.push({
                'craft_workstep_parameter_main_id': row.craft_workstep_parameter_main_id,
                'step_use_steady_state_value': item.param_value,
                'step_use_note_taker': item.record_user,
                'step_use_note_taker_id': item.record_user_id,
                'step_use_write_time': item.record_time,
                'devices_control_devices_number': item.device_number,
                'step_use_describe': item.remark,
                'workstep_parameter_unit': row.workstep_parameter_unit,
                'craft_workstep_parameter_id': row.craft_control_workstep_id,
                'craft_workstep_parameter_name': row.craft_workstep_parameter_name,
                'step_use_parameter_value_type': row.craft_workstep_parameter_value_type,
                'devices_control_devices_type_id': row.devices_control_devices_type_id,
                'work_order_id': this.workOrderId
              })
            })
            saveWorkOrderStepParameteRecord({type: 'save', stepParameteRecords: JSON.stringify(params)}).then(res => {
              if (res.status === 0) {
                this.$message.success('参数添加成功')
              } else {
                this.$message.error(res.msg || '参数添加失败')
              }
            })
          })
        } else {
          // console.log(row)
          this.visible.workstepParams = true
          this.workstepParamsFilters.stepParameteId = row.craft_workstep_parameter_main_id
          this.getWorkstepParamsList()
        }
      },
      // 添加设备操作记录
      handleDeviceLogDetailView (row, type) {
        // console.log(row)
        if (type === 'add') {
          this.$mesAddParams.show('添加设备操作记录', {
            paramNames: ['设备编号', '开始时间', '结束时间', '设备状态', '操作人']
          }).then(data => {
            let params = []
            data.rows.forEach(item => {
              params.push({
                'work_order_id': this.workOrderId,
                'craft_control_workstep_id': row.workstage_id,
                'devices_control_devices_id': item.device_id,
                'devices_control_devices_name': item.device_name,
                'devices_control_devices_number': item.device_number,
                'devices_operation_start_time': item.start_time,
                'devices_operation_end_time': item.end_time,
                'devices_operation_operator': item.operator,
                'devices_operation_operator_id': item.operator_id,
                'devices_operation_operator_type': item.device_status
              })
            })
            saveWorkOrderDevicesOperationRecord({type: 'save', devicesOperationRecords: JSON.stringify(params)}).then(res => {
              if (res.status === 0) {
                this.$message.success('添加成功')
              } else {
                this.$message.error(res.msg || '添加失败')
              }
            })
          })
        } else {
          // console.log(row)
        }
      },
      handleEnvironmentParamsDetailView (row) {

      },
      getDeviceLogList () {
        this.visible.deviceLogListLoading = true
        queryWorkOrderDevicesOperationRecord(Object.assign({'stepId': this.stepId}, this.deviceLogFilters)).then((res) => {
          if (res.status === 0) {
            this.deviceLogFilters.total = res.map.line
            this.deviceLogList = res.map.devicesOperationRecords
          } else {
            this.deviceLogList = []
            this.deviceLogFilters.total = 0
          }
          this.visible.deviceLogListLoading = false
        })
      },
      getMaterialParamsList () {
        this.visible.materialParamsListLoading = true
        this.materialParamsFilters.workOrderId = this.workOrderId
        queryWorkOrderMaterialUseRecord(Object.assign({
          headNum: utils.getHeadNumAdapter(this.materialParamsFilters.page, this.materialParamsFilters.pageSize)
        }, this.materialParamsFilters)).then((res) => {
          if (res.status === 0) {
            this.materialParamsFilters.total = res.map.line
            this.materialParamsList = res.map.materialUseRecords
          } else {
            this.materialParamsList = []
            this.materialParamsFilters.total = 0
          }
          this.visible.materialParamsListLoading = false
        })
      },
      getWorkstepParamsList () {
        this.visible.workstepParamsListLoading = true
        this.workstepParamsFilters.workOrderId = this.workOrderId
        queryWorkOrderStepParameteRecord(Object.assign({
          headNum: utils.getHeadNumAdapter(this.workstepParamsFilters.page, this.workstepParamsFilters.pageSize)
        }, this.workstepParamsFilters)).then((res) => {
          if (res.status === 0) {
            this.workstepParamsFilters.total = res.map.line
            this.workstepParamsList = res.map.stepParameteRecords
          } else {
            this.workstepParamsList = []
            this.workstepParamsFilters.total = 0
          }
          this.visible.workstepParamsListLoading = false
        })
      },
      getEnvironmentParamsDetailList () {
        this.visible.environmentParamsDetailListLoading = true
        queryWorkOrderParameteRecord(Object.assign({
          headNum: utils.getHeadNumAdapter(this.environmentParamsDetailFilters.page, this.environmentParamsDetailFilters.pageSize)
        }, this.environmentParamsDetailFilters)).then((res) => {
          if (res.status === 0) {
            this.environmentParamsDetailFilters.total = res.map.line
            this.environmentParamsDetailList = res.map.parameteRecords
          } else {
            this.environmentParamsDetailList = []
            this.environmentParamsDetailFilters.total = 0
          }
          this.visible.environmentParamsDetailListLoading = false
        })
      },
      handleEnvironmentParamsDetailDel (row) {
        this.$confirm('确定要删除此条数据吗？', '提示').then(action => {
          if (action === 'confirm') {
            let para = {
              'parameteRecordIds[]': row.parameter_record_id
            }
            removeWorkOrderParameteRecord(para).then(res => {
              if (res.status === 0) {
                this.$message.success('删除成功')
                this.getEnvironmentParamsDetailList()
              } else {
                this.$message.error(res.msg || '删除失败')
              }
            })
          }
        }).catch()
      },
      handleDeviceLogDel (row) {
        let para = {
          'devicesOperationRecordIds[]': row.devices_operation_record_id
        }
        removeWorkOrderDevicesOperationRecord(para).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功')
            this.getDeviceLogList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        })
      },
      handleMaterialParamsDel (row) {
        // console.log(row);
        this.$confirm('确定要删除此条数据吗？', '提示').then(action => {
          if (action === 'confirm') {
            let para = {
              'materialUseRecordIds[]': row.material_use_record_id
            }
            removeWorkOrderMaterialUseRecord(para).then(res => {
              if (res.status === 0) {
                this.$message.success('删除成功')
                this.getMaterialParamsList()
              } else {
                this.$message.error(res.msg || '删除失败')
              }
            })
          }
        }).catch()
      },
      handleWorkstepParamsDel (row) {
        // console.log(row);
        this.$confirm('确定要删除此条数据吗？', '提示').then(action => {
          if (action === 'confirm') {
            let para = {
              'stepParameteRecordIds[]': row.step_parameter_record_id
            }
            removeWorkOrderStepParameteRecord(para).then(res => {
              if (res.status === 0) {
                this.$message.success('删除成功')
                this.getWorkstepParamsList()
              } else {
                this.$message.error(res.msg || '删除失败')
              }
            })
          }
        }).catch()
      },
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss')
        }
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
