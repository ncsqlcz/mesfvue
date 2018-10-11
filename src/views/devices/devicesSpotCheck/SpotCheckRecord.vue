<!-- 魏彬祥 2018.4.8 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData">
        <el-col :span="24" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="axiosData.devicesTypeId" @change="getData">
              <el-option value="" label="全部类型"></el-option>
              <el-option v-for="value in typeList" :value="value.devices_control_devices_type_id" :label="value.devices_control_devices_type_name" :key="value.devices_control_devices_type_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="axiosData.devicesName" size="medium" placeholder="输入关键字" @keyup.native.enter="getData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getData">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--内容-->
    <el-table :data="dataList" highlight-current-row v-loading="listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="devices.devices_control_devices_name" label="设备名称" sortable></el-table-column>
      <el-table-column prop="devices.devices_control_devices_number" label="设备编号" sortable></el-table-column>
      <el-table-column prop="devices_check_plan_version" label="点检版本号" sortable></el-table-column>
      <el-table-column prop="devices_check_plan_people" label="点检人" sortable></el-table-column>
      <el-table-column prop="devices_check_plan_monitor" label="班长确认" sortable></el-table-column>
      <el-table-column prop="devices_check_plan_artisan" label="技术确认" sortable></el-table-column>
      <el-table-column label="计划状态" sortable><template slot-scope="scope">{{scope.row.devices_check_plan_status === '0' ? '启用' : '关闭'}}</template></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary">详情</el-button>
          <el-button size="medium" type="primary" @click="check(scope.row)">审核</el-button>
          <el-button size="medium" type="primary" @click="execute(scope.row)" v-if="scope.row.devices_check_plan_status === '0'">执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--执行和审核模态框-->
    <execute :executeData="executeData" ref="execute"  @getList="getData"></execute>
  </section>
</template>
<script>
  import {queryCheckPlan, queryDeviceTypes} from '../../../api/api'
  import utils from '../../../common/js/utils'
  import execute from './SpotCheckRecord_execute.vue'
  export default {
    name: 'devicesSpotCheck',
    components: {
      'execute': execute
    },
    data () {
      return {
        dataList: [],
        typeList: [],
        listLoading: false,
        pageSize: 10,
        page: 1,
        total: 0,
        axiosData: {
          headNum: 1,
          type: 'info',
          devicesTypeId: '',
          devicesName: ''
        },
        executeData: {
          result: '',
          show: false,
          checkId: '',
          status: ''
        }
      }
    },
    mounted () {
      this.getData()
      this.getType()
    },
    methods: {
      // 获取基础数据
      getData () {
        let data = Object.assign(this.axiosData, {
          headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
        })
        this.listLoading = true
        queryCheckPlan(data).then((data) => {
          this.listLoading = false
          if (data.status === 0) {
            this.dataList = data.map.checks
            this.total = data.map.lines
          } else if (data.status === 2) {
            this.dataList = []
            this.total = 0
            this.$message.error('暂无数据');
          } else {
            this.$message.error('数据有误');
          }
        })
      },
      // 获取设备类型
      getType () {
        queryDeviceTypes(this.axiosData).then((data) => {
          this.typeList = data.map.devices_control_devices_type
        })
      },
      // 重置
      reset () {
        this.axiosData = {
          headNum: 1,
          type: 'info',
          devicesTypeId: '',
          devicesName: ''
        }
        this.getData()
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
      // 列表索引
      getIndex (index) {
        return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
      },
      execute (value) {
        this.executeData.show = true
        this.executeData.checkId = value.devices_check_plan_id
        this.executeData.status = value.devices_check_plan_status
        this.executeData.result = ''
        this.$refs.execute.created()
      },
      check (value) {
        this.executeData.result = '审核'
        this.executeData.show = true
        this.executeData.status = value.devices_check_plan_status
        this.executeData.checkId = value.devices_check_plan_id
        this.$refs.execute.created()
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
