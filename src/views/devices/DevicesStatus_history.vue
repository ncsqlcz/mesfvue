<!-- 魏彬祥 2018.4.3 -->
<template>
  <el-dialog  class="mes-dialog" title="历史状况及参数" :visible.sync="historyData.dialogTableVisible" width="60%" :close-on-click-modal="false">
    <el-col :span=24 class="toolbar">
      <el-col :span=4>
        <el-button type="primary" size="medium" @click="innerVisible = true" :disabled="!dataList.length">导出Excel</el-button>
      </el-col>
      <el-col :span=20>
        <el-col :offset=5 :span=4 class="text-center">
          <el-pagination layout="sizes" @size-change="handleSizeChange" size="medium"></el-pagination>
        </el-col>
        <el-col :span=10>
          <el-date-picker type="datetimerange" v-model="searchTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" size="medium" style="width:100%">
          </el-date-picker>
        </el-col>
        <el-col :span=5>
          <el-input placeholder="输入关键字" size="medium" v-model="axiosData.deviceParameter" @keyup.native.enter="getData">
            <el-button icon="el-icon-search" slot="append" size="small" @click="getData"></el-button>
          </el-input>
        </el-col>
      </el-col>
    </el-col>
    <el-table :data="dataList" :span-method="objectSpanMethod" border>
      <el-table-column property="dynamic_acquisition_parameter" label="参数名" sortable></el-table-column>
      <el-table-column property="dynamic_acquisition_parameter_unit" label="参数单位" sortable></el-table-column>
      <el-table-column label="采集时间" sortable><template slot-scope="scope">{{ scope.row.dynamic_acquisition_time | times }}</template></el-table-column>
      <el-table-column property="dynamic_acquisition_devices_status" label="设备状态" sortable></el-table-column>
      <el-table-column property="" label="备注" sortable></el-table-column>
    </el-table>
    <footer class="overflow_hidden">
      <el-col :span="24" class="toolbar text-center">
        <el-button type="primary" size="medium" @click="prev" :disabled="axiosData.headNum == 1 || !dataList.length">上一页</el-button>
        <el-button type="primary" size="medium" @click="next" :disabled="!dataList.length">下一页</el-button>
      </el-col>
    </footer>
    <el-dialog width="30%"  class="mes-dialog" title="请选择导出数量" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <section class="overflow_hidden">
        <el-col :offset=6 :span=10>
           <el-select placeholder="请选择" v-model="exporNumber">
            <el-option :value="500"></el-option>
            <el-option :value="1000"></el-option>
            <el-option :value="2000"></el-option>
            <el-option :value="5000"></el-option>
            <el-option :value="10000"></el-option>
          </el-select>
        </el-col>
        <el-col :span=23 class="text-right">
             <el-button type="primary" size="medium" @click="exportExcel" >确认</el-button>
        </el-col>
      </section>
    </el-dialog>
  </el-dialog>
</template>
<script>
  import {getHistoryParameters, queryPerHistoryParameters} from '../../api/api'
  import utils from '../../common/js/utils'
  export default {
    name: 'devicesStatus_history',
    props: [ 'historyData' ],
    data () {
      return {
        innerVisible: false, // 导出excel弹出框
        dataList: [],
        searchTime: [new Date() - 86400000, new Date()], // 接收所选时间
        repeatDataCount: [], // 合并表格计数器
        pickerOptions2: utils.pickerOptionsBefore2, // 时间快捷键选择器
        exporNumber: '10000', // 导出条数
        axiosData: {
          deviceId: '771f54c4905411e7966812eb78deb327',
          headNum: 1,
          tailNum: 10,
          startTime: '2013-04-01 00:00:00',
          endTime: '2018-04-03 23:59:59',
          deviceParameter: ''
        }
      }
    },
    mounted () {
    },
    methods: {
      // 获取基础数据
      getData () {
        let data = Object.assign(this.axiosData, {
          deviceId: this.historyData.deviceId,
          startTime: utils.formatDate.format(new Date(this.searchTime[0]), 'yyyy-MM-dd hh:mm:ss'),
          endTime: utils.formatDate.format(new Date(this.searchTime[1]), 'yyyy-MM-dd hh:mm:ss')
        })
        getHistoryParameters(data).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.historyParameters.dynamicAcquisitions
            // 合并表格条件生成
            this.repeatDataCount[0] = 0
            for (let i = 0, len = this.dataList.length, index = 0; i < len; i++) {
              for (let j = i + 1; j < len; j++) {
                if (this.dataList[i].dynamic_acquisition_time !== this.dataList[j].dynamic_acquisition_time) {
                  index++
                  i = j
                  this.repeatDataCount[index] = j
                }
              }
              if (i === len - 1) {
                this.repeatDataCount[++index] = len
              }
            }
          } else if (data.status === 2) {
            this.dataList = []
            this.$message.error('暂无数据');
          } else {
            this.$message.error('数据有误');
          }
        })
      },
      // 表格合并
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 3) {
          for (let i = 0, len = this.repeatDataCount.length; i < len; i++) {
            if (rowIndex === this.repeatDataCount[i]) {
              return {
                rowspan:this.repeatDataCount[i + 1] - this.repeatDataCount[i],
                colspan: 1
              }
            }
          }
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.axiosData.tailNum = val
        this.getData()
      },
      // 导出excel
      exportExcel () {
        this.axiosData.startTime = utils.formatDate.format(new Date(this.searchTime[0]), 'yyyy-MM-dd hh:mm:ss')
        this.axiosData.endTime = utils.formatDate.format(new Date(this.searchTime[1]), 'yyyy-MM-dd hh:mm:ss')
        location.href = `${queryPerHistoryParameters}?deviceId=${this.axiosData.deviceId}&headNum=${this.axiosData.headNum}&tailNum=${this.exporNumber}&startTime=${this.axiosData.startTime}&endTime=${this.axiosData.endTime}&deviceParameter=${this.axiosData.deviceParameter}`
        this.innerVisible = false
      },
      // 上一页
      prev () {
        this.axiosData.headNum = this.axiosData.headNum - this.axiosData.tailNum < 1 ? 1 : this.axiosData.headNum - this.axiosData.tailNum
        this.getData()
      },
      // 下一页
      next () {
        this.axiosData.headNum = this.axiosData.tailNum + this.axiosData.headNum
        this.getData()
      }
    },
    filters: {
      times (val) {
        return utils.formatDate.format(new Date(val), 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
