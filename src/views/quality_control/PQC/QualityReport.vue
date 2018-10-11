<!-- 魏彬祥 2018.4.26 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData" onsubmit="return false">
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" >新增</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
            <el-input v-model.trim="axiosData.reportName" size="medium" placeholder="输入关键字" @keyup.native.enter="getData()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getData()">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--内容-->
    <el-table :data="dataList" highlight-current-row v-loading="listLoading">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="quality_pqc_report_name" label="报告名称" sortable></el-table-column>
      <el-table-column prop="quality_pqc_product_batch" label="生产批次" sortable></el-table-column>
      <el-table-column prop="workOrderDO.work_order_number" label="工单号" sortable></el-table-column>
      <el-table-column prop="className" label="班次" sortable></el-table-column>
      <el-table-column prop="semiFinishName" label="半成品名称" sortable></el-table-column>
      <el-table-column prop="qualityCheckMethodDO.quality_check_method_status" label="检验方式" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" >详情</el-button>
          <el-button size="medium" type="primary" >修改</el-button>
          <el-button size="medium" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
  </section>
</template>
<script>
import {queryPQCReportRecord} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'QualityReport',
  data () {
    return {
      dataList: [],
      pageSize: 10,
      page: 1,
      total: 0,
      listLoading: false,
      axiosData: {
        type: 'info',
        reportName: '',
        headNum: 1
      },
    }
  },
  methods: {
    // 获取基础数据
    getData () {
      let data = Object.assign(this.axiosData, {
        headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
      })
      this.listLoading = true
      queryPQCReportRecord(data).then((data) => {
        this.listLoading = false
        if (data.status === 0) {
          this.dataList = data.map.pqcReport
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
    // 重置
    reset () {
      this.axiosData = {
        type: 'info',
        reportName: '',
        headNum: 1
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
  },
  mounted () {
    this.getData()
  }
}
</script>
<style scoped lang="scss">

</style>
