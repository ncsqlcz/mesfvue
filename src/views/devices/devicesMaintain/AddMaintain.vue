<!-- 魏彬祥 2018.4.12 -->
<template>
  <section :loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">基础信息</span>
          <el-button style="float: right;" type="primary" size="medium" @click="selectDevice">增加设备</el-button>
      </div>
       <el-form :inline="true" :model="basicInformation" label-width="100px">
        <el-col :span=24>
          <el-form-item label="计划类型">
            <el-select placeholder="请选择（必选）" v-model="basicInformation.planType">
              <el-option value="月度保养"></el-option>
              <el-option value="假期保养"></el-option>
              <el-option value="年度保养"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划名称">
            <el-input  placeholder="请选择（必选）" clearable  v-model="basicInformation.planName"></el-input>
          </el-form-item>
           <el-form-item label="创建者" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('creator')" v-model="creatorName" clearable></el-input>
          </el-form-item>
          <el-form-item label="总负责人" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('planPrincipal')" v-model="planPrincipalName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="box-card margin_top" v-for="(value,index) in devices" :key="value.devices_control_devices_id">
      <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">{{'设备名称：'+ value.devices_control_devices_name + '; 编号：'+value.devices_control_devices_number}}</span>
          <el-button style="float: right;margin-left:10px" type="primary" size="medium" @click="removeDevice(index)">移除设备</el-button>
          <el-button style="float: right;" type="primary" size="medium" @click="selectProject(value)">增加项目</el-button>
      </div>
      <el-table :data="value.projects" highlight-current-row>
        <el-table-column prop="devices_upkeep_project_name" label="项目名称" sortable></el-table-column>
        <el-table-column prop="devices_upkeep_project_standard" label="保养基准" sortable></el-table-column>
        <el-table-column prop="devices_upkeep_project_period" label="周期" sortable></el-table-column>
        <el-table-column label="负责人" sortable>
          <template slot-scope="scope">
             <el-input  placeholder="请选择（必选）" @focus="selectStaff('principalName',scope.row), value" v-model="scope.row.principalName" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="计划日期" sortable>
          <template slot-scope="scope">
           <el-date-picker type="date" v-model="scope.row.scheduleDate" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="scope">
            <el-button size="medium" type="danger" @click="removeProject(scope.$index, value)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card margin_top text-center">
      <el-button type="primary" size="medium" @click="submit">确认提交</el-button>
    </el-card>
  </section>
</template>
<script>
import {saveUpkeepPlan} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'AddMaintain',
  data () {
    return {
      basicInformation: {
        planName: '',
        planType: '',
        creator: '',
        planPrincipal: ''
      },
      creatorName: '',
      planPrincipalName: '',
      devices: [],
      loading: false
    }
  },
  methods: {
    // 选择人员
    selectStaff (type, value) {
      this.$mesStaff.show({
        type: 'all',
        reRender: true,
        selectedIds: []
      }).then((data) => {
        if (type === 'creator') {
          this.basicInformation.creator = data.rows[0].role_staff_id
          this.creatorName = data.rows[0].role_staff_name
        } else if (type === 'planPrincipal') {
          this.basicInformation.planPrincipal = data.rows[0].role_staff_id
          this.planPrincipalName = data.rows[0].role_staff_name
        } else if (type === 'principalName') {
          value.principal = data.rows[0].role_staff_id
          value.principalName = data.rows[0].role_staff_name
        }
      })
    },
    // 选择设备
    selectDevice () {
      this.$mesDevice({}).then((data) => {
        data.rows[0].projects = []
        this.devices.push(data.rows[0])
      })
    },
    // 增加项目
    selectProject (value) {
      this.$mesDeviceProject({}).then((data) => {
        value.projects.push({
          devices_upkeep_project_name: data.rows[0].devices_upkeep_project_name,
          devices_upkeep_project_standard: data.rows[0].devices_upkeep_project_standard,
          devices_upkeep_project_period: data.rows[0].devices_upkeep_project_period,
          devicesId: value.devices_control_devices_id,
          projectId: data.rows[0].devices_upkeep_project_id,
          principal: '',
          principalName: '',
          scheduleDate: ''
        })
      })
    },
    // 移除设备
    removeDevice (index) {
      this.devices.splice(index, 1)
    },
    // 移除项目
    removeProject (index, value) {
      value.projects.splice(index, 1)
    },
    // 确认
    submit () {
      if (this.devices.length) {
        let basicInformation = false
        let project = false
        let projectList = []
        for (var i in this.basicInformation) {
          if (this.basicInformation[i] === '') {
            basicInformation = true
          }
        }
        // 判断加遍历项目
        this.devices.forEach((value, index) => {
          value.projects.forEach((val, key) => {
            for (var i in val) {
              if (val[i] === '') {
                project = true
              }
            }
            projectList.push({
              devicesId: val.devicesId,
              projectId: val.projectId,
              principal: val.principal,
              scheduleDate: val.scheduleDate
            })
          })
        })
        if (basicInformation) {
          this.$message.error({
            message: '基础数据不完整'
          })
        } else if (project) {
          this.$message.error({
            message: '项目数据不完整'
          })
        } else {
          this.loading = true
          let data = Object.assign(this.basicInformation, {
            planNum: utils.formatDate.format(new Date(), 'yyyyMMddhhmmss') + '新建',
            createDate: utils.formatDate.format(new Date(), 'yyyy-MM-dd'),
            projects: JSON.stringify(projectList)
          })
          saveUpkeepPlan(data).then((data) => {
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
        }
      } else {
        this.$message.error({
          message: '请先添加一个设备'
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.margin_top {
  margin-top: 10px
}
</style>
