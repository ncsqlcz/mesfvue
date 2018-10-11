<!-- 魏彬祥 2018.4.2 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData">
        <el-col :span="24" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="axiosData.deviceTypeId" @change="selectType">
              <el-option value="" label="全部类型"></el-option>
              <el-option v-for="value in typeList" :value="value.devices_control_devices_type_id" :label="value.devices_control_devices_type_name" :key="value.devices_control_devices_type_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="axiosData.deviceName" size="medium" placeholder="输入关键字" @keyup.native.enter="getData"></el-input>
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
      <el-table-column prop="devicesName" label="设备名称" sortable></el-table-column>
      <el-table-column prop="devicesNum" label="设备编号" sortable></el-table-column>
      <el-table-column label="设备状态" sortable> <template slot-scope="scope">{{ scope.row.devicesStatus == '开机' ? '开机' : '离线' }}</template></el-table-column>
      <el-table-column prop="" label="参数一名称：值(单位)" sortable></el-table-column>
      <el-table-column prop="" label="参数二名称：值(单位)" sortable></el-table-column>
      <el-table-column prop="" label="参数三名称：值(单位)" sortable></el-table-column>
      <el-table-column prop="" label="参数四名称：值(单位)" sortable></el-table-column>
      <el-table-column prop="" label="参数五名称：值(单位)" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" v-show="scope.row.devicesStatus == '开机'">参数详情</el-button>
          <el-button size="medium" type="primary" @click="historyModel(scope.row.devicesID)">历史参数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--模态框-->
    <history :historyData = "historyData" ref="method"></history>
  </section>
</template>

<script>
  import {getDeviceParametersList, queryDeviceTypes} from '../../api/api'
  import history from './DevicesStatus_history'
  import utils from '../../common/js/utils'

  export default {
    name: 'devicesStatus',
    data () {
      return {
        dataList: [],
        typeList: [],
        listLoading: false,
        pageSize: 10,
        page: 1,
        total: 0,
        historyData: {
          dialogTableVisible: false,
          deviceId: ''
        },
        axiosData: {
          headNum: 1,
          lookStatus: 'all',
          deviceName: '',
          deviceTypeId: ''
        }
      }
    },
    components: {
      'history': history
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
        getDeviceParametersList(data).then((data) => {
          this.listLoading = false
          if (data.status === 0) {
            this.dataList = data.map.resultList
            this.total = data.map.count
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
      // 列表索引
      getIndex (index) {
        return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
      },
      // 历史参数
      historyModel (val) {
        this.historyData.dialogTableVisible = true
        this.historyData.deviceId = val
        this.$refs.method.getData()
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
      // 选择设备类型
      selectType () {
        this.getData()
      },
      // 重置
      reset () {
        this.axiosData = {
          headNum: 1,
          lookStatus: 'all',
          deviceName: '',
          deviceTypeId: ''
        }
        this.getData()
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
