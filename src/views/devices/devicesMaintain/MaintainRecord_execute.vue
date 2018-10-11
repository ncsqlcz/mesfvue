<!-- 魏彬祥 2018.4.11 -->
<template>
  <el-dialog  class="mes-dialog" title="编辑计划" :visible.sync="executeData.show" width="60%" :close-on-click-modal="false">
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
              <p class="td-value">{{data.devices_upkeep_plan_name}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">设备编号</p>
              <p class="td-value">{{data.devices_upkeep_plan_numker}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">计划类型</p>
              <p class="td-value">{{data.devices_upkeep_plan_type}}</p>
            </div>
          </div>
            <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">创建者</p>
              <p class="td-value">{{data.devices_upkeep_plan_creator}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">创建时间</p>
              <p class="td-value">{{data.devices_upkeep_plan_date | time}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">总负责人</p>
              <p class="td-value">{{data.devices_upkeep_plan_principal}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">下次保养时间</p>
              <p class="td-value">{{data.nextDate}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">状态</p>
              <p class="td-value" v-if="result !== '审核'">{{data.devices_upkeep_plan_status | status}}</p>
              <p class="td-value" v-else>
                <el-select v-model="deviceResult" @change="selectResult">
                  <el-option value="0" label="启用"></el-option>
                  <el-option value="1" label="关闭"></el-option>
                </el-select>
              </p>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card margin">
        <div slot="header" class="clearfix">
          <span style="font-size:16px">设备保养记录</span>
        </div>
        <el-table :data="upkeepProjects" border>
          <el-table-column prop="planProject.devices.devices_control_devices_name" label="设备名称"></el-table-column>
          <el-table-column prop="planProject.devices_upkeep_principal" label="负责人"></el-table-column>
          <el-table-column prop="planProject.upkeepProject.devices_upkeep_project_name" label="项目名称"></el-table-column>
          <el-table-column prop="planProject.upkeepProject.devices_upkeep_project_standard" label="保养基准"></el-table-column>
          <el-table-column label="计划日期">
            <template slot-scope="scope">
              {{scope.row.devices_upkeep_enter_date | time}}
            </template>
          </el-table-column>
          <el-table-column label="实施日期">
            <template slot-scope="scope">
              {{scope.row.devices_upkeep_enter_schedule | time}}
            </template>
          </el-table-column>
          <el-table-column label="保养结果">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_upkeep_enter_result">{{scope.row.devices_upkeep_enter_result}}</div>
              <el-input placeholder="请输入" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="异常情况记录">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_upkeep_enter_feedback">{{scope.row.devices_upkeep_enter_feedback}}</div>
              <el-input placeholder="请输入" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="记录人">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_upkeep_enter_people">{{scope.row.devices_upkeep_enter_people}}</div>
              <el-input placeholder="请选择" v-else></el-input>
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
          <el-button style="float: right;" type="primary" size="medium" @click="addChange">增加变更</el-button>
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
          <el-table-column label="记录人">
            <template slot-scope="scope">
              <el-input placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" v-if="scope.row.devices_upkeep_change_id === ''">
              <el-button type="danger" size="medium">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </section>
  </el-dialog>
</template>
<script>
import {queryUpkeepPlans} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'MaintainRecord_execute',
  props: ['executeData'],
  data () {
    return {
      data: [],
      result: '',
      upkeepChanges: [],
      upkeepProjects: [],
      pageSize: 10,
      page: 1,
      total: 0,
      axiosData: {
        type: 'planExcute',
        planId: '',
        headNum: 1
      }
    }
  },
  methods: {
    created () {
      this.axiosData.planId = this.executeData.planId
      this.result = this.executeData.result
      this.getData('plan')
      this.getData('planExcute')
    },
    getData (type) {
      let data = Object.assign(this.axiosData, {
        type: type
      })
      queryUpkeepPlans(data).then((data) => {
        if (data.status === 0) {
          if (type === 'plan') {
            this.data = data.map.planList[0]
          } else if (type === 'planExcute') {
            this.total = data.map.lines
            this.upkeepChanges = data.map.upkeepChanges
            this.upkeepProjects = data.map.upkeepProjects
          }
        } else {
          if (type === 'plan') {
            this.data = ''
          } else if (type === 'planExcute') {
            this.upkeepChanges = []
            this.upkeepProjects = []
          }
        }
      })
    },
    addChange () {

    },
    // 页面改变
    handlePageChange (val) {
      this.page = val
      this.getData('planExcute')
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.pageSize = val
      this.getData('planExcute')
    }
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
.margin {
  margin-top: 10px
}
</style>
