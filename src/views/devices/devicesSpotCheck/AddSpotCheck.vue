<!-- 魏彬祥 2018.4.11 -->
<template>
  <section :loading="loading">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span style="font-size:16px">基础信息</span>
      </div>
      <el-form :inline="true" :model="basicInformation" label-width="100px">
        <el-col :span=24>
          <el-form-item label="设备名称" >
            <el-input  placeholder="请选择（必选）" @focus="selectDevice()" v-model="deviceName" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建人" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('creatorName')" v-model="creatorName" clearable></el-input>
          </el-form-item>
           <el-form-item label="点检人" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('peopleName')" v-model="peopleName" clearable></el-input>
          </el-form-item>
          <el-form-item label="班长确认" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('monitorName')" v-model="monitorName" clearable></el-input>
          </el-form-item>
          <el-form-item label="技术确认" >
            <el-input  placeholder="请选择（必选）" @focus="selectStaff('artisanName')" v-model="artisanName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="box-card" style="margin-top:20px">
       <div slot="header" class="clearfix" style="line-height:36px">
          <span style="font-size:16px">点检项目</span>
          <el-button style="float: right;" type="primary" size="medium" @click="addProject">增加项目</el-button>
      </div>
      <el-table :data="projectList" border height="350">
        <el-table-column label="项目名称">
          <template slot-scope="scope">
             <el-input  placeholder="请输入（必填）" v-model="scope.row.name" size="medium" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="基准">
          <template slot-scope="scope">
             <el-input  placeholder="请输入（必填）" v-model="scope.row.standard" size="medium" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column label="点检方法">
          <template slot-scope="scope">
            <el-select size="medium" style="width:100%" placeholder="请选择（必选）" v-model="scope.row.methods">
              <el-option value="目测" label="目测"></el-option>
              <el-option value="实测" label="实测"></el-option>
              <el-option value="其它" label="其它"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="点检周期">
          <template slot-scope="scope">
            <el-select size="medium" style="width:100%" placeholder="请选择（必选）" v-model="scope.row.opportunity">
              <el-option value="班前" label="班前"></el-option>
              <el-option value="班时" label="班时"></el-option>
              <el-option value="班后" label="班后"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button size="medium" type="danger" @click="remove(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span=24 class="text-center" style="padding:10px 0">
        <el-button type="primary" size="medium" @click="submit">确认</el-button>
      </el-col>
    </el-card>
  </section>
</template>
<script>
import {saveDevicesCheck} from '../../../api/api'
export default {
  name: 'AddSpotCheck',
  data () {
    return {
      basicInformation: {
        deviceId: '',
        creator: '',
        people: '',
        monitor: '',
        artisan: ''
      },
      loading: false,
      deviceName: '',
      creatorName: '',
      peopleName: '',
      monitorName: '',
      artisanName: '',
      projectList: []
    }
  },
  created () {
    this.projectList = [{
      name: '',
      standard: '',
      methods: '目测',
      opportunity: '班前'
    }]
  },
  methods: {
    addProject () {
      this.projectList.push({
        name: '',
        standard: '',
        methods: '目测',
        opportunity: '班前'
      })
    },
    remove (index) {
      this.projectList.splice(index, 1)
    },
    submit () {
      let type = false
      let checkProjects = []
      this.projectList.forEach((value, index) => {
        checkProjects.push(`${value.name}:${value.standard}:${value.methods}:${value.opportunity}`)
        for (var i in value) {
          if (value[i] === '') {
            type = true
          }
        }
      })
      if (this.deviceName === '' || this.creatorName === '' || this.peopleName === '' || this.monitorName === '' || this.artisanName === '') {
        this.$message.error({
          message: '基础信息数据不完整'
        })
      } else if (type) {
        this.$message.error({
          message: '点检项目数据不完整'
        })
      } else {
        this.loading = true
        let data = Object.assign(this.basicInformation, {
          checkProjects: checkProjects.toString()
        })
        this.$confirm('确认提交吗？', '提示', {}).then(() => {
          saveDevicesCheck(data).then((data) => {
            if (data.status === 0) {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.loading = false
              this.basicInformation = {
                deviceId: '',
                creator: '',
                people: '',
                monitor: '',
                artisan: ''
              }
              this.deviceName = ''
              this.creatorName = ''
              this.peopleName = ''
              this.monitorName = ''
              this.artisanName = ''
              this.projectList = [{
                name: '',
                standard: '',
                methods: '目测',
                opportunity: '班前'
              }]
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    },
    // 选择人员
    selectStaff (type) {
      this.$mesStaff.show({
        type: 'all',
        reRender: true,
        selectedIds: []
      }).then((data) => {
        if (type === 'creatorName') {
          this.basicInformation.creator = data.rows[0].role_staff_id
          this.creatorName = data.rows[0].role_staff_name
        } else if (type === 'peopleName') {
          this.basicInformation.people = data.rows[0].role_staff_id
          this.peopleName = data.rows[0].role_staff_name
        } else if (type === 'monitorName') {
          this.basicInformation.monitor = data.rows[0].role_staff_id
          this.monitorName = data.rows[0].role_staff_name
        } else if (type === 'artisanName') {
          this.basicInformation.artisan = data.rows[0].role_staff_id
          this.artisanName = data.rows[0].role_staff_name
        }
      })
    },
    selectDevice () {
      this.$mesDevice({}).then((data) => {
        this.basicInformation.deviceId = data.rows[0].devices_control_devices_id
        this.deviceName = data.rows[0].devices_control_devices_name
      })
    }
  }
}
</script>
<style scoped lang="scss">

</style>
