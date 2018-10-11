<template>
  <el-dialog  class="mes-dialog" :visible.sync="detailsData.show" width="60%" :close-on-click-modal="false">
    <section>
        <!--基础信息-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size:16px">基础信息</span>
        </div>
        <div class="detail-table">
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">计划名称</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_name}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">设备编号</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_numker}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">计划类型</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_type}}</p>
            </div>
          </div>
            <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">创建者</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_creator}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">创建时间</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_date | time}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">总负责人</p>
              <p class="td-value">{{detailsData.basisInfo.devices_upkeep_plan_principal}}</p>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card margin">
        <div slot="header" class="clearfix">
          <span style="font-size:16px">明细记录</span>
        </div>
        <el-table :data="upkeepProjects" border>
          <el-table-column type="index" :index="getIndex" width="50"></el-table-column>
          <el-table-column prop="devices.devices_control_devices_name" label="设备名称"></el-table-column>
          <el-table-column prop="devices.devices_control_devices_number" label="设备编号"></el-table-column>
          <el-table-column prop="upkeepProject.devices_upkeep_project_name" label="保养项目"></el-table-column>
          <el-table-column prop="upkeepProject.devices_upkeep_project_standard" label="保养基准"></el-table-column>
          <el-table-column prop="upkeepProject.devices_upkeep_project_period"  label="周期"></el-table-column>
          <el-table-column prop="devices_upkeep_principal" label="负责人"></el-table-column>
          <el-table-column label="明细记录">
            <template slot-scope="scope">
              <el-button type="primary" size="medium" @click="particulars(scope.row.devices_upkeep_plan_project_id)">明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
        </div>
      </el-card>
      <el-card class="box-card margin">
        <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">变更记录</span>
        </div>
        <el-table :data="upkeepChanges" border>
          <el-table-column prop="devices.devices_control_devices_name" label="设备名称"></el-table-column>
          <el-table-column prop="devices.devices_control_devices_number" label="设备编号"></el-table-column>
          <el-table-column prop="devices_upkeep_change_type" label="变更类型"></el-table-column>
          <el-table-column prop="devices_upkeep_change_content" label="变更内容"></el-table-column>
          <el-table-column prop="devices_upkeep_change_reasons" label="变更原因"></el-table-column>
          <el-table-column label="记录时间">
             <template slot-scope="scope">
              {{scope.row.devices_upkeep_change_time | time}}
            </template>
          </el-table-column>
          <el-table-column prop="devices_upkeep_change_people" label="记录人"></el-table-column>
          <el-table-column prop="devices_upkeep_change_identify_people" label="确认人"></el-table-column>
        </el-table>
      </el-card>
      <!--明细-->
      <el-dialog class="mes-dialog" title="保养明细记录" :visible.sync="show" width="50%" :close-on-click-modal="false" append-to-body>
        <el-table :data="upkeepEnters" border>
          <el-table-column type="index" :index="getIndex2" width="50"></el-table-column>
          <el-table-column label="计划日期">
             <template slot-scope="scope">
              {{scope.row.devices_upkeep_enter_schedule | time}}
            </template>
          </el-table-column>
          <el-table-column label="实施日期">
             <template slot-scope="scope">
              {{scope.row.devices_upkeep_enter_date | time}}
            </template>
          </el-table-column>
          <el-table-column prop="devices_upkeep_enter_result" label="保养结果"></el-table-column>
          <el-table-column prop="devices_upkeep_enter_feedback" label="异常情况记录"></el-table-column>
          <el-table-column prop="devices_upkeep_enter_people"  label="记录人"></el-table-column>
          <el-table-column prop="devices_upkeep_enter_identify_people" label="确认人"></el-table-column>
        </el-table>
        <div class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="particularsPage.pageSize" :total="particularsPage.total" @current-change="handlePageChange2" @size-change="handleSizeChange2"></el-pagination>
        </div>
      </el-dialog>
    </section>
  </el-dialog>
</template>
<script>
import {queryUpkeepPlans} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'MaintainRecord_details',
  props: ['detailsData'],
  data () {
    return {
      data: '',
      upkeepChanges: [],
      upkeepProjects: [],
      upkeepEnters: [],
      show: false,
      pageSize: 10,
      page: 1,
      total: 0,
      axiosData: {
        type: 'planDetail',
        planId: '',
        headNum: 1
      },
      particularsAxiosData: {
        type: 'enter',
        planProjectId: '',
        headNum: 1
      },
      particularsPage: {
        pageSize: 10,
        page: 1,
        total: 0
      }
    }
  },
  methods: {
    created () {
      this.axiosData.planId = this.detailsData.basisInfo.devices_upkeep_plan_id
      this.getData()
    },
    getData () {
      queryUpkeepPlans(this.axiosData).then((data) => {
        if (data.status === 0) {
            this.total = data.map.lines
            this.upkeepChanges = data.map.upkeepChanges
            this.upkeepProjects = data.map.upkeepProjects
        } else {
            this.upkeepChanges = []
            this.upkeepProjects = []
            this.total = 0
        }
      })
    },
    // 明细aixos
    particularsData () {
       queryUpkeepPlans(this.particularsAxiosData).then((data) => {
        if (data.status === 0) {
            this.particularsPage.total = data.map.lines
            this.upkeepEnters = data.map.upkeepEnters
        } else {
            this.upkeepEnters = []
            this.particularsPage.total = 0
        }
      })
    },
    // 明细
    particulars (id) {
      this.show = true
      this.upkeepEnters = []
      this.particularsAxiosData.planProjectId = id
      this.particularsData ()
    },
    // 列表索引
    getIndex (index) {
      return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
    },
    getIndex2 (index) {
      return parseInt(this.particularsPage.pageSize) * parseInt(this.particularsPage.page - 1) + index + 1
    },
    // 页面改变
    handlePageChange (val) {
      this.page = val
      this.getData()
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    // 页面改变
    handlePageChange2 (val) {
      this.particularsPage.page = val
      this.particularsData ()
    },
    // 每页数量改变
    handleSizeChange2 (val) {
      this.particularsPage.pageSize = val
      this.particularsData ()
    },
  },
  filters: {
    status (value) {
      if (value === '0') {
        return '未执行'
      } else if (value === '1') {
        return '执行中'
      } else if (value === '2') {
        return '已完成'
      }
    },
    time (value) {
      return utils.formatDate.format(new Date(value), 'yyyy-MM-dd')
    }
  }
}
</script>
<style scoped lang="scss">
</style>
