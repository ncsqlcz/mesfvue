<!-- 魏彬祥 2018.4.12 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData">
        <el-col :span="24" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="axiosData.planType" @change="getData">
              <el-option value="" label="全部类型"></el-option>
              <el-option value="月度保养" label="月度保养"></el-option>
              <el-option value="假期保养" label="假期保养"></el-option>
              <el-option value="年度保养" label="年度保养"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="axiosData.planName" size="medium" placeholder="输入计划名称关键字" @keyup.native.enter="getData"></el-input>
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
      <el-table-column prop="devices_upkeep_plan_numker" label="计划编号" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_plan_name" label="计划名称" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_plan_type" label="计划类型" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_plan_creator" label="创建者" sortable></el-table-column>
      <el-table-column label="创建时间" sortable>
        <template slot-scope="scope">
          {{scope.row.devices_upkeep_plan_date | date}}
        </template>
      </el-table-column>
      <el-table-column label="计划状态" sortable><template slot-scope="scope">{{scope.row.devices_upkeep_plan_status | status}}</template></el-table-column>
      <el-table-column prop="devices_upkeep_plan_principal" label="总负责人" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="detailModule(scope.row)">详情</el-button>
          <el-button size="medium" type="primary">审核</el-button>
          <el-button size="medium" type="primary" @click="executeModule(scope.row)">执行</el-button>
        </template>
      </el-table-column>
    </el-table>
     <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--执行和审核模态框-->
    <execute :executeData="executeData" ref="execute"></execute>
    <detail :detailsData="detailsData" ref="details"></detail>
  </section>
</template>
<script>
import {queryUpkeepPlans} from '../../../api/api'
import utils from '../../../common/js/utils'
import execute from './MaintainRecord_execute'
import details from './MaintainRecord_details'
export default {
  name: 'MaintainRecord',
  components: {
    'execute': execute,
    'detail': details
  },
  data () {
    return {
      dataList: [],
      listLoading: false,
      pageSize: 10,
      page: 1,
      total: 0,
      axiosData: {
        headNum: 1,
        type: 'plan',
        planType: '',
        planName: ''
      },
      executeData: {
        show: false,
        result: '',
        planId: ''
      },
      detailsData: {
        show: false,
        basisInfo: ''
      }
    }
  },
  methods: {
    // 获取基础数据
    getData () {
      let data = Object.assign(this.axiosData, {
        headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
      })
      this.listLoading = true
      queryUpkeepPlans(data).then((data) => {
        this.listLoading = false
        if (data.status === 0) {
          this.dataList = data.map.planList
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
    // 列表索引
    getIndex (index) {
      return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
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
    // 重置
    reset () {
      this.axiosData = {
        headNum: 1,
        type: 'plan',
        planType: '',
        planName: ''
      }
      this.getData()
    },
    executeModule (value) {
      this.executeData.show = true
      this.executeData.planId =  value.devices_upkeep_plan_id
      this.$refs.execute.created()
    },
    detailModule (value) {
      this.detailsData.show = true
      this.detailsData.basisInfo = value
      this.$refs.details.created()
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
    date (value) {
      return utils.formatDate.format(new Date(value), 'yyyy-MM-dd')
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>

</style>

