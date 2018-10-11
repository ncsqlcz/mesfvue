<!-- 魏彬祥 2018.4.11 -->
<template>
  <el-dialog  class="mes-dialog" title="点检登记" :visible.sync="executeData.show" width="60%" :close-on-click-modal="false">
    <section v-loading="loading">
      <!--基础信息-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="font-size:16px">基础信息</span>
        </div>
        <div class="detail-table">
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">设备名称</p>
              <p class="td-value">{{checksData.devices ? checksData.devices.devices_control_devices_name : ''}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">设备编号</p>
              <p class="td-value">{{checksData.devices ? checksData.devices.devices_control_devices_number : ''}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">点检表版本号</p>
              <p class="td-value">{{checksData.devices_check_plan_version}}</p>
            </div>
          </div>
            <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">状态</p>
              <p class="td-value" v-if="result !== '审核'">{{checksData.devices_check_plan_status === '0' ? '启用' : '关闭'}}</p>
              <p class="td-value" v-else>
                <el-select v-model="deviceResult" @change="selectResult">
                  <el-option value="0" label="启用"></el-option>
                  <el-option value="1" label="关闭"></el-option>
                </el-select>
              </p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">创建人</p>
              <p class="td-value">{{checksData.devices_check_plan_creator}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">点检人</p>
              <p class="td-value">{{checksData.devices_check_plan_people}}</p>
            </div>
          </div>
          <div class="detail-table-row">
            <div class="w-33 detail-table-item">
              <p class="th-name">班长确认人</p>
              <p class="td-value">{{checksData.devices_check_plan_artisan}}</p>
            </div>
            <div class="w-33 detail-table-item">
              <p class="th-name">技术确认人</p>
              <p class="td-value">{{checksData.devices_check_plan_creator}}</p>
            </div>
          </div>
        </div>

      </el-card>
      <!--点检项目:执行-->
      <el-card class="box-card margin" v-if="result !== '审核'">
        <div slot="header" class="clearfix">
          <span style="font-size:16px">点检项目</span>
          <el-date-picker type="date" v-model="axiosData.startDate" @change="getData" placeholder="选择日期" value-format="yyyy-MM-dd" :default-value="new Date()" size="medium" style="float: right;" :clearable="false">
          </el-date-picker>
        </div>
        <el-table :data="projectList" border>
          <el-table-column prop="devices_check_project_name" label="项目名称"></el-table-column>
          <el-table-column prop="devices_check_project_standard" label="基准"></el-table-column>
          <el-table-column prop="devices_check_project_method" label="点检方法"></el-table-column>
          <el-table-column prop="devices_check_project_period" label="点检时机"></el-table-column>
          <el-table-column prop="devices_check_project_day" label="班次"></el-table-column>
          <el-table-column label="点检结果" width="130">
            <template slot-scope="scope">
              <el-select v-model="scope.row.result" v-if="scope.row.devices_check_project_result === '' || scope.row.devices_check_project_result === null">
                <el-option value="良好"></el-option>
                <el-option value="异常"></el-option>
                <el-option value="送检"></el-option>
              </el-select>
              <div v-else>{{scope.row.devices_check_project_result}}</div>
            </template>
          </el-table-column>
          <el-table-column label="点检人" width="130">
            <template slot-scope="scope">
              <el-input placeholder="请选择" v-model="scope.row.enterStaff" @focus="selectStaff('enterStaff', scope.row)" v-if="scope.row.devices_check_enter_people === '' || scope.row.devices_check_enter_people === null"></el-input>
              <div v-else>{{scope.row.devices_check_enter_people}}</div>
            </template>
          </el-table-column>
          <el-table-column label="班长确认" width="130">
            <template slot-scope="scope">
              {{scope.row.devices_check_enter_monitor}}
            </template>
          </el-table-column>
          <el-table-column label="技术确认" width="130">
            <template slot-scope="scope">
              {{scope.row.devices_check_enter_artisan}}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--点检项目:审核-->
      <el-card class="box-card margin" v-else>
        <div slot="header" class="clearfix">
          <span style="font-size:16px">点检项目</span>
          <el-date-picker type="date" v-model="axiosData.startDate" @change="getData" placeholder="选择日期" value-format="yyyy-MM-dd" :default-value="new Date()" size="medium" style="float: right;" :clearable="false">
          </el-date-picker>
        </div>
        <el-table :data="projectList" border>
          <el-table-column prop="devices_check_project_name" label="项目名称"></el-table-column>
          <el-table-column prop="devices_check_project_standard" label="基准"></el-table-column>
          <el-table-column prop="devices_check_project_method" label="点检方法"></el-table-column>
          <el-table-column prop="devices_check_project_period" label="点检时机"></el-table-column>
          <el-table-column prop="devices_check_project_day" label="班次"></el-table-column>
          <el-table-column label="点检结果" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.devices_check_project_result}}</div>
            </template>
          </el-table-column>
          <el-table-column label="点检人" width="130">
            <template slot-scope="scope">
              {{scope.row.devices_check_enter_people}}
            </template>
          </el-table-column>
          <el-table-column label="班长确认" width="130">
            <template slot-scope="scope" v-if="scope.row.devices_check_enter_id !== null && scope.row.devices_check_enter_id !== ''">
              <div v-if="scope.row.devices_check_enter_monitor !== '' && scope.row.devices_check_enter_monitor !== null">{{scope.row.devices_check_enter_monitor}}</div>
              <el-input placeholder="请选择" v-model="scope.row.monitor" @focus="selectStaff('monitor', scope.row)" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="技术确认" width="130">
            <template slot-scope="scope" v-if="scope.row.devices_check_enter_id !== null && scope.row.devices_check_enter_id !== ''">
              <div v-if="scope.row.devices_check_enter_artisan !== '' && scope.row.devices_check_enter_artisan !== null">{{scope.row.devices_check_enter_artisan}}</div>
              <el-input placeholder="请选择" v-model="scope.row.artisan" @focus="selectStaff('artisan', scope.row)" v-else></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--异常记录:执行-->
      <el-card class="box-card margin" v-if="result !== '审核'">
        <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">异常记录</span>
          <el-button style="float: right;" type="primary" size="medium" @click="addProject">增加项目</el-button>
        </div>
        <el-table :data="exceptionsData" border>
          <el-table-column label="发生时间">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_id !==''">{{scope.row.devices_exception_record_time |date}}</div>
              <el-date-picker v-model="scope.row.devices_exception_record_time" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" v-else></el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="异常内容">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_id !==''">{{scope.row.devices_exception_record_detail}}</div>
              <el-input v-model="scope.row.devices_exception_record_detail" placeholder="请输入" style="width:100%" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="记录人">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_id !==''">{{scope.row.devices_exception_record_people}}</div>
              <el-input v-model="scope.row.devices_exception_record_peopleName" @focus="selectStaff('record', scope.row)" placeholder="请选择" style="width:100%" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="异常处置">
              <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_id !==''">{{scope.row.devices_exception_record_handling}}</div>
              <el-input v-model="scope.row.devices_exception_record_handling" placeholder="请输入" style="width:100%" v-else></el-input>
            </template>
          </el-table-column>
          <el-table-column label="确认人">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_id !==''">{{scope.row.devices_exception_record_identify_people}}</div>
              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="medium" type="danger" @click="remove(scope.$index)" v-if="scope.row.devices_exception_record_id ===''">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!--异常记录:审核-->
      <el-card class="box-card margin" v-else>
        <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">异常记录</span>
        </div>
        <el-table :data="exceptionsData" border>
          <el-table-column label="发生时间">
            <template slot-scope="scope">
              <div>{{scope.row.devices_exception_record_time |date}}</div>
            </template>
          </el-table-column>
          <el-table-column label="异常内容">
            <template slot-scope="scope">
              <div>{{scope.row.devices_exception_record_detail}}</div>
            </template>
          </el-table-column>
          <el-table-column label="记录人">
            <template slot-scope="scope">
              <div>{{scope.row.devices_exception_record_people}}</div>
            </template>
          </el-table-column>
          <el-table-column label="异常处置">
              <template slot-scope="scope">
              <div>{{scope.row.devices_exception_record_handling}}</div>
            </template>
          </el-table-column>
          <el-table-column label="确认人">
            <template slot-scope="scope">
              <div v-if="scope.row.devices_exception_record_identify_people !== '' && scope.row.devices_exception_record_identify_people !== null">{{scope.row.devices_exception_record_handling}}</div>
              <el-input v-model="scope.row.identifyName" @focus="selectStaff('identify', scope.row)" placeholder="请选择" style="width:100%" v-else></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card text-center">
        <el-button type="primary" size="medium" @click="submit(result)">确认</el-button>
      </el-card>
    </section>
  </el-dialog>
</template>
<script>
import {queryCheckPlan, saveDevicesException, saveDevicesEntrys, modifyDevicesEntry, modifyDevicesException, modifyCheckStatus} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'SpotCheckRecord_execute',
  props: ['executeData'],
  data () {
    return {
      result: '',
      checksData: [],
      exceptionsData: [],
      projectList: [],
      loading: false,
      deviceResult: '0',
      day: ['上午', '下午'],
      projectListIndex: 0,
      exceptionsListIndex: 0,
      axiosData: {
        type: 'detail',
        checkId: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        headNum: 1
      }
    }
  },
  methods: {
    created () {
      this.projectListIndex = 0
      this.exceptionsListIndex = 0
      this.deviceResult = this.executeData.status
      this.result = this.executeData.result
      this.axiosData.checkId = this.executeData.checkId
      this.axiosData.startDate = utils.formatDate.format(new Date(), 'yyyy-MM-dd')
      this.axiosData.startTime = utils.formatDate.format(new Date(), 'yyyy-MM-01')
      this.axiosData.endTime = utils.formatDate.format(new Date(), 'yyyy-MM-30')
      this.getData()
    },
    getData () {
      this.loading = true
      setTimeout (()=> {
        this.loading = false
      }, 800)
      let data = Object.assign(this.axiosData, {
        endDate: this.axiosData.startDate,
      })
      queryCheckPlan(data).then((data) => {
        this.checksData = data.map.checks[0]
        this.exceptionsData = data.map.exceptions
        this.projectList = []
        if (data.map.checks[0].devicesCheckProjects !== null) {
          data.map.checks[0].devicesCheckProjects.forEach((value, index) => {
            if (value.devicesCheckEnters[0].devices_check_enter_id === null) {
              for (let i = 0; i < this.day.length; i++) {
                this.projectList.push({
                  devices_check_enter_id: '',
                  devices_check_project_id: value.devices_check_project_id,
                  devices_check_project_name: value.devices_check_project_name,
                  devices_check_project_standard: value.devices_check_project_standard,
                  devices_check_project_method: value.devices_check_project_method,
                  devices_check_project_period: value.devices_check_project_period,
                  devices_check_project_day: this.day[i],
                  devices_check_project_result: '',
                  devices_check_enter_people: '',
                  devices_check_enter_monitor: '',
                  devices_check_enter_artisan: '',
                  enterStaff: '',
                  enterStaffId: '',
                  artisan: '',
                  artisanId: '',
                  monitor: '',
                  monitorId: '',
                  result: ''
                })
              }
            } else {
              value.devicesCheckEnters.forEach((val, key) => {
                this.projectList.push({
                  devices_check_enter_id: val.devices_check_enter_id,
                  devices_check_project_id: value.devices_check_project_id,
                  devices_check_project_name: value.devices_check_project_name,
                  devices_check_project_standard: value.devices_check_project_standard,
                  devices_check_project_method: value.devices_check_project_method,
                  devices_check_project_period: value.devices_check_project_period,
                  devices_check_project_day: val.devices_check_enter_result_am === '' ? '下午' : '上午',
                  devices_check_project_result: val.devices_check_enter_result_am === '' ? val.devices_check_enter_result_pm : val.devices_check_enter_result_am,
                  devices_check_enter_people: val.devices_check_enter_people,
                  devices_check_enter_monitor: val.devices_check_enter_monitor,
                  devices_check_enter_artisan: val.devices_check_enter_artisan,
                  enterStaff: '',
                  enterStaffId: '',
                  artisan: '',
                  artisanId: '',
                  monitor: '',
                  monitorId: '',
                  result: ''
                })
              })
            }
          })
        }
      })
    },
    selectStaff (type, value) {
      this.$mesStaff.show({
        type: 'all',
        reRender: true,
        selectedIds: []
      }).then((data) => {
        if (type === 'enterStaff') {
          value.enterStaffId = data.rows[0].role_staff_id
          value.enterStaff = data.rows[0].role_staff_name
        } else if (type === 'record') {
          value.devices_exception_record_people = data.rows[0].role_staff_id
          value.devices_exception_record_peopleName = data.rows[0].role_staff_name
        } else if (type === 'identify') {
          value.devices_exception_record_identify_peopleId = data.rows[0].role_staff_id
          value.identifyName = data.rows[0].role_staff_name
        } else if (type === 'monitor') {
          value.monitorId = data.rows[0].role_staff_id
          value.monitor = data.rows[0].role_staff_name
        } else if (type === 'artisan') {
          value.artisanId = data.rows[0].role_staff_id
          value.artisan = data.rows[0].role_staff_name
        }
      })
    },
    addProject () {
      this.exceptionsData.push({
        devices_exception_record_id: '',
        devices_exception_record_time: '',
        devices_exception_record_detail: '',
        devices_exception_record_people: '',
        devices_exception_record_peopleName: '',
        devices_exception_record_handling: '',
        devices_exception_record_identify_people: '',
        devices_exception_record_identify_peopleName: '',
      })
    },
    remove (index) {
      this.exceptionsData.splice(index, 1)
    },
    submit (type) {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        if (type === '') {
          if (this.projectListIndex > 1) {
            var projectList = []
            this.projectList.forEach((value, index) => {
              projectList.push({
                projectId: value.devices_check_project_id,
                enterStaff: value.enterStaffId,
                monitor: value.devices_check_enter_monitor,
                artisan: value.devices_check_enter_artisan,
                resultAM:'',
                resultPM: '',
                enterTime: this.axiosData.startDate
              })
              if (value.devices_check_project_day === '上午') {
                projectList[index].resultAM = value.result === '' ? value.devices_check_project_result : value.result
              } else {
                projectList[index].resultPM = value.result === '' ? value.devices_check_project_result : value.result
              }
            })
            let data = {
              enters: JSON.stringify(projectList)
            }
            saveDevicesEntrys(data).then((data) => {
              if (data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.executeData.show = false
                this.getData()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
          if (this.exceptionsListIndex > 1) {
            var exceptionsData = []
            this.exceptionsData.forEach((value, index) => {
              if (value.devices_exception_record_id === '') {
                exceptionsData.push({
                  devices_check_plan_id: this.axiosData.checkId,
                  recordTime: value.devices_exception_record_time,
                  devices_exception_record_detail: value.devices_exception_record_detail,
                  devices_exception_record_people: value.devices_exception_record_people,
                  devices_exception_record_handling: value.devices_exception_record_handling,
                  devices_exception_record_identify_people: value.devices_exception_record_identify_people
                })
              }
            })
            let data = {
              exceptionRecords: JSON.stringify(exceptionsData)
            }
            saveDevicesException(data).then((data) => {
              if (data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.executeData.show = false
                this.getData()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          if (this.projectListIndex > 1) {
            var projectList = []
            this.projectList.forEach((value, index) => {
              projectList.push({
                checkEnterId: value.devices_check_enter_id,
                monitor: value.monitorId,
                artisan: value.artisanId,
              })
            })
            let data = {
               enters: JSON.stringify(projectList)
            }
            modifyDevicesEntry(data).then((data) => {
              if (data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.executeData.show = false
                this.getData()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
          if (this.exceptionsListIndex > 1) {
            var exceptionsData = []
            this.exceptionsData.forEach((value, index) => {
              if (value.devices_exception_record_identify_peopleId !== undefined) {
                exceptionsData.push({
                  exceptionId: value.devices_exception_record_id,
                  identifyStaff: value.identifyName,
                })
              }
            })
            let data = {
              exceptionRecords: JSON.stringify(exceptionsData)
            }
            modifyDevicesException(data).then((data) => {
              if (data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.executeData.show = false
                this.getData()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        }
      })
    },
    selectResult () {
      this.$confirm('您确定要更改此状态吗？', '提示', {}).then(() => {
        let data = {
          planId: this.axiosData.checkId,
          planStatus: this.deviceResult
        }
        modifyCheckStatus(data).then((data) => {
          if (data.status === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.executeData.show = false
            this.$emit('getList')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  },
  filters: {
    date (value) {
      return utils.formatDate.format(new Date(value), 'yyyy-MM-dd')
    }
  },
  watch: {
    projectList: {
      handler(newValue, oldValue) {
        this.projectListIndex++
      },
      deep: true
    },
    exceptionsData: {
      handler(newValue, oldValue) {
        this.exceptionsListIndex++
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
.el_input .el-input-group__prepend {
  min-width:80px;
}
.el_input .el-input__inner{
  background-color: #fff!important;
  color: #333!important;
}
.padding {
  padding: 3px 0
}
.margin {
  margin-top: 10px
}
</style>

