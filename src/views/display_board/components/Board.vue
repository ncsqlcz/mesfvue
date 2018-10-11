<!--刘川中 2018.6.01-->
<template>
  <section class="h-100">
    <el-carousel :interval="50000" class="board-carousel h-100">
      <el-carousel-item v-for="(item, index) in chartsData" :key="index" class="h-100">
        <el-card class="h-100 chart-card">
          <div slot="header" class="card-header">{{ settings[index].name + ' ' + (item.workstageName || '') }}</div>
          <!-- 柱状图 或 柏拉图 -->
          <ve-histogram class="h-100" height="100%"
              :data="item.chartData" :settings="item.chartSettings"
              v-if="item.typeName === '柱状图' || item.typeName === '柏拉图'"
              ref='refCharts'
          ></ve-histogram>

          <!-- 折线图 -->
          <ve-line class="h-100" height="100%" 
              :data="item.chartData" :settings="item.chartSettings" 
              v-if="item.typeName === '折线图'"
              ref='refCharts'
          ></ve-line>

          <!-- 表格 -->
          <div class="table-box" v-show="item.tableData && item.tableData.length > 0">
            <el-table :data="item.tableData" v-if="item.typeName === '表格'">
                <el-table-column v-for="(value, key) of item.labelAndProps" :prop="value.prop" :label="value.label" :key="key"></el-table-column>
            </el-table>
          </div>

          <div class="no-data" v-show="item.noData === true">
            <p>{{ $t(`msg['暂无数据']`) }}</p>
          </div>
        </el-card>
      </el-carousel-item>
    </el-carousel>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {
    queryWorkOrderOutlineForms,
    queryWorkstageAscend,
    queryWorkOrderAscend,
    queryDevicesOEE,
    queryDevicesException,
    queryDevicesExceptionAndMalfunction,
    queryIQCReport,
    queryIQCUnqualifiedReport,
    queryPQCUnqualifiedReport,
    queryPQCReportRecord,
    queryFQCReportForms
    } from '../../../api/api'
  import { mapGetters, mapActions } from 'vuex'
  import vCharts from 'v-charts'
import { SET_WORKSHOP_LIST } from '../../../vuex/mutation-types';

  export default {
    name: 'board',
    data () {
      return {
        filters: {
          keyword: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        visible: {},
        settings: [],
        chartsData: [],
        xyNamesDict: {
          '工单编号': 'work_order_number',
          '日期': 'work_order_time',
          '时间': 'work_order_time',
          '生产批次号': 'production_plan_batch_number',
          '工序': 'product_model_name', // 工序 用型号代替了
          '不良数量': 'rejects_batch_quantity',
          '计划产量': 'production_expected_output',
          '计划数量': 'production_expected_output',
          '实际产量': 'product_element_num',
          '实际完成数量': 'product_element_num',
          '不良率': 'adverse_rate',
          '计划达成率': 'plan_optimal_rate',
          '电芯编号': 'work_order_time',
          '电阻': 'plan_optimal_rate',
          '电压': 'production_expected_output',
          '设定电流': 'product_element_num',
          '不良数': 'rejects_batch_quantity',
          '优率': 'good_products_rate',
          '良品数': 'good_products_num',
          '产出量': 'product_element_num',
          '坏品率': 'scrap_rate',
          '总坏品数': '',
          '总不良数': '',
          '总产出量': '',
          '总坏品率': '',
          '负荷时间': 'loadTime',
          '停机时间': 'downTime',
          '设备稼动率': 'devices_utilization_rate',
          'OEE': 'devices_oees',
          '平均OEE': 'devices_oees',
          '设备编号': 'devices_control_devices_number',
          '合格数': 'quality_iqc_good_product_number',
          '合格率': 'quality_iqc_good_product_rate',
          '物料批次号': 'warehouse_product_batch',
          '电池批号': 'warehouse_product_batch',
          '容量': 'product_element_num',
        },
        tableDict: {
          '工序': 'workstage_name',
          '生产批次号': 'production_plan_batch_number',
          '计划产量': 'production_expected_output',
          '计划数量': 'production_expected_output',
          '实际产量': 'product_element_num',
          '计划达成率': 'plan_optimal_rate',
          '不良数量': 'rejects_batch_quantity',
          '不良率': 'adverse_rate',
          '实际完成数量': 'product_element_num',
          '不良数': 'rejects_batch_quantity',
          '优率': 'good_products_rate',
          '良品数': 'good_products_num',
          '工单编号': 'work_order_number',
          '检测时间': 'quality_iqc_inspection_date',
          '检测报告数': 'warehouse_material_number',
          '合格报告数': 'quality_iqc_good_product_number',
          '合格率': 'quality_iqc_good_product_rate',
          '部位': 'devices_exception_record_part',
          '设备名称': 'devices_control_devices_name',
          '异常次数': '异常次数',
          '发生异常时间': 'devices_exception_record_time',
          '编号': 'devices_control_devices_number'
        },
        qualityXYNamesDict: {
          '时间': 'quality_iqc_examine_date',
          '物料批次号': 'warehouse_material_batch',
          '合格数': '',
          '合格率': '',
          '良品数': 'goodNum',
          '良品率': 'goodYield',
          '不良描述': 'quality_iqc_unqualified_remark',
          '不良次数': 'badness_sum',
          '不良代号': 'badness_code',
          '不良率': 'badness_rate',
          '生产批次号': 'quality_pqc_product_batch',
        },
        // 各种报表请求的接口不太一样
        reportsUrlDict: {
          '工序生产报表': {
            fn: queryWorkOrderOutlineForms,
            resName: 'workstageAndWorkOrderAscends'
          },
          '计划达成率报表': {
            fn: queryWorkOrderOutlineForms,
            resName: 'workstageAndWorkOrderAscends'
          },
          '电芯数据查询报表': {
            fn: queryWorkOrderOutlineForms,
            resName: 'workstageAndWorkOrderAscends'
          },
          '工序优率及不良率报表': {
            fn: queryWorkstageAscend,
            resName: 'workOrderAscends'
          },
          '综合坏品及坏品分布报表': {
            fn: queryWorkstageAscend,
            resName: 'workOrderAscends'
          },
          '工单优率及不良率报表': {
            fn: queryWorkOrderAscend,
            resName: 'workOrderAscends'
          },
          '工单坏品及坏品分布报表': {
            fn: queryWorkOrderAscend,
            resName: 'workOrderAscends'
          },
          '设备OEE报表': {
            fn: queryDevicesOEE,
            resName: 'oees'
          },
          '设备异常报表': {
            fn: queryDevicesException,
            resName: 'exceptions'
          },
          '设备维修报表': {
            fn: queryDevicesExceptionAndMalfunction,
            resName: 'malfunctions'
          },
          'IQC优率报表': {
            fn: queryIQCReport,
            resName: 'iqcReports'
          },
          'IQC不良内容统计及分布报表': {
            fn: queryIQCUnqualifiedReport,
            resName: 'unqualifieds'
          },
          'PQC不良内容统计及分布报表': {
            fn: queryPQCUnqualifiedReport,
            resName: 'unqualifieds'
          },
          'PQC优率报表': {
            fn: queryPQCReportRecord,
            resName: 'pqcReport'
          },
          'FQC优率报表': {
            fn: queryFQCReportForms,
            resName: 'fqcReports'
          },
        }
      }
    },
    props: {
      chartsSettings: {
        type: Array,
        required: true,
        default: []
      },
      resize: Number
    },
    computed: {},
    mounted () {
      this.initBoardData().then(() => {
        this.$forceUpdate()
      }).catch(() => {})
    },
    methods: {
      ...mapActions([]),
      // 初始化看板图表数据
      initBoardData () {
        let promiseList = []
        // console.log(this.settings)
        this.settings.forEach((setting, index) => {
          let searchId
          let searchValue
          let workstageId
          setting.boardReportSearchs.sort((a, b) => { return Number(a.board_report_search_order) > Number(b.board_report_search_order) })
          // 只传board_report_search_order === '1' 的参数
          setting.boardReportSearchs.forEach(item => {
            if (item.board_report_search_order === '1') {
              searchId = item.boardReportFormSearchDOs.board_report_search_value_id
              searchValue = item.boardReportFormSearchDOs.board_report_search_value
            }
            if (item.board_report_search_name === '工序') {
              workstageId = item.boardReportFormSearchDOs.board_report_search_value_id
            }
          })
          // console.log(setting)
          // 一般情况的参数, 通用参数，只是每个接口传的 id 和 value 不同
          let params = { startDate: setting.startDate, endDate: setting.endDate, headNum:1 }
          switch (setting.name) {
            case '工序生产报表':
              params.workstageId = workstageId
              break
            case '计划达成率报表':
              params.workstageId = workstageId
              break
            case '电芯数据查询报表':
              params.workstageId = workstageId
              break
            case '工序优率及不良率报表':
              params.workstageId = workstageId
              setting.boardReportSearchs.forEach(item => {
                if (item.board_report_search_name === '报表类型') {
                  params.type = item.boardReportFormSearchDOs.board_report_search_value
                }
              })
              break
            case '综合坏品及坏品分布报表':
              params.workstageId = workstageId
              setting.boardReportSearchs.forEach(item => {
                if (item.board_report_search_name === '报表类型') {
                  params.type = item.boardReportFormSearchDOs.board_report_search_value
                }
              })
              break
            case '工单优率及不良率报表':
              params.workstageId = workstageId
              params.productionBatch = searchValue
              break
            case '工单坏品及坏品分布报表':
              params.workstageId = workstageId
              params.productionBatch = searchValue
              break
            case '设备OEE报表':
              params.devicesId = searchId
              break
            case '设备异常报表':
              params.devicesId = searchId
              break
            case '设备维修报表':
              params.devicesId = searchId
              break
            case 'IQC优率报表':
              params.materialId = searchId
              params.materialBatch = searchValue
              break
            case 'IQC不良内容统计及分布报表':
              params.materialId = searchId
              params.materialBatch = searchValue
              break
            case 'PQC不良内容统计及分布报表':
              params.semiFinishId = searchId
              params.productBatch = searchValue
              break
            case 'PQC优率报表':
              params.semiFinishId = searchId
              params.productBatch = searchValue
              // params.type = 'info'
              break
            case 'FQC优率报表':
              params.productModel = searchId
              params.ProductBatch = searchValue
              break
          }

          // if (index === 0)
          // if (setting.id === '2361e41cdc6a42968bf56b84889177d0')   // 这行可以对单个图表的数据进行调试，id是board_area_chart_id
          promiseList.push(new Promise(resolve => {
            // console.log(setting.name + ' 参数：', params)
            this.reportsUrlDict[setting.name].fn(params).then(res => {
              if (res.status === 0) {
                this.chartsData[index] = this.getChartsData(setting, res, res.map[this.reportsUrlDict[setting.name].resName])
              } else {
                this.chartsData[index] = {noData: true}
              }
              setTimeout(() => {
                this.chartsResize()
              }, 0)
              resolve()
            })
          }))
        })
        if (this.settings.length > 0) {
          return Promise.all([...promiseList])
        } else {
          return new Promise((resolve, reject) => {
            reject()
          })
        }
      },
      // 获取所有图表数据
      getChartsData (setting, res, workstageAndWorkOrderAscends) {
        let workstageName = res.map.workstage_name || ''
        if (setting.typeName === '表格') {
          switch (setting.name) {
          case '设备OEE报表':
            workstageName = res.map.oees ? res.map.oees[0].devices_control_devices_name : ''
            break
          case '电芯数据查询报表':
            workstageName = res.map.oees ? res.map.oees[0].devices_control_devices_name : ''
            break
          }
          let tableData = this.getTableChartData(setting, workstageAndWorkOrderAscends)
          // console.log(tableData)
          return {
            workstageName: workstageName,
            typeName: setting.typeName,
            labelAndProps: tableData.props,
            tableData: tableData.rows
          }
        } else {
          let dataSettings = this.getChartDataSettingsWorkStage(setting, workstageAndWorkOrderAscends)
          // console.log(dataSettings.chartSettings)
          return {
            workstageName: workstageName,
            typeName: setting.typeName,
            chartData: dataSettings.chartData,
            chartSettings: dataSettings.chartSettings
          }
        }
      },
      // 根据报表种类获取图表数据
      getChartDataSettingsWorkStage (setting, workstageAndWorkOrderAscends) {
        let chartData = {
          columns: [],
          rows: []
        }
        let chartSettings = {
          metrics: [],
          label: { normal: { show: true, position: 'top' } },
        }
        let xName = setting.xName
        // Y轴有哪些名称
        let yNameValues = []
        for (let key in setting) {
          if (key.indexOf('yName') > -1) {
            yNameValues.push(setting[key])
          }
        }
        chartData.columns = [xName, ...yNameValues]

        // 带有关键字 '率' 的 Y轴 - 因为要显示成折线
        let showLineNames = []

        // console.log(setting.typeName, setting)
        switch (setting.typeName) {
        case '折线图':
        case '柱状图':
          chartSettings.dimension = chartSettings.dimension || []
          chartSettings.dimension.push(xName)
        case '柏拉图':
          chartSettings.metrics = chartSettings.metrics || []
          chartSettings.metrics = [...yNameValues]
          // console.log(chartSettings.metrics)

          workstageAndWorkOrderAscends.forEach(item => {
            let row = {}
            row[xName] = item[this.xyNamesDict[xName]]
            // 因为工序有些接口用 product_model_name, 有些用workstage_name，唉~
            if (xName === '工序') {
              row[xName] = item[this.xyNamesDict[xName]] || item.workstage_name
            }
            // 一般情况
            yNameValues.forEach(yName => {
              // 因为计划达成率有 '%' 字符，所以要转换成数字
              if (yName.indexOf('率') > -1) {
                showLineNames.push(yName)
                let rate = 0
                if (isNaN(Number(item[this.xyNamesDict[yName]]))) {
                  rate = parseFloat(item[this.xyNamesDict[yName]])
                } else {
                  rate = Number(item[this.xyNamesDict[yName]])
                }
                row[yName] = rate / 100
              } else {
                // 每个Y轴名称对应哪一个值
                row[yName] = item[this.xyNamesDict[yName]]
              }

              // 特殊情况
              switch (setting.name) {
              case '设备OEE报表':
                if (xName === '时间') {
                  row[xName] = this.getTime(item.loadTime)
                }
                if (xName === '日期') {
                  row[xName] = item.loadTime
                }
                break
              case '设备异常报表':
                if (xName === '时间') {
                  row[xName] = this.getTime(item.exception_record_time)
                }
                break
              case 'IQC优率报表':
                if (xName === '时间') {
                  row[xName] = this.getTime(item.quality_iqc_inspection_date)
                  if (setting.typeName === '柏拉图') {
                    row[xName] = this.getTime(item.quality_iqc_examine_date)
                  }
                }
                if (yName === '良品率') {
                  row[yName] = Number(item.quality_iqc_good_product_rate)
                }
                break
              case 'IQC不良内容统计及分布报表':
                break
              case 'PQC不良内容统计及分布报表':
                break
              case 'PQC优率报表':
                if (xName === '时间') {
                  row[xName] = this.getTime(item.quality_pqc_check_date)
                }
                if (xName === '生产批次号') {
                  row[xName] = item[this.qualityXYNamesDict[xName]]
                }
                if (yName === '合格率') {
                  // showLineNames.push(yName)
                  // row[yName] = Number(item.semi_finish_good_rate) / 100
                  row[yName] = Number(item.semi_finish_good_rate)
                }
                break
              case 'FQC优率报表':
                if (xName === '时间') {
                  row[xName] = this.getTime(item.quality_fqc_check_date)
                }
                row[yName] = item[this.qualityXYNamesDict[yName]]
                if (yName.indexOf('率') > -1) {
                  showLineNames.push(yName)
                  row[yName] = parseFloat(item[this.qualityXYNamesDict[yName]]) / 100
                }
                if (yName === '合格率') {
                  row[yName] = parseFloat(item.quality_iqc_good_product_rate) / 100
                }
                break
              }
            })

            let rateData = this.getAllRateData(workstageAndWorkOrderAscends)
            if (rateData['总坏品数']) {
              row['总坏品数'] = rateData['总坏品数']
            }
            if (rateData['总不良数']) {
              row['总不良数'] = rateData['总不良数']
            }
            if (rateData['总产出量']) {
              row['总产出量'] = rateData['总产出量']
            }
            if (rateData['总坏品率']) {
              row['总坏品率'] = rateData['总坏品率']
            }
            // console.log(row)
            chartData.rows.push(row)
          })
          break
        }
        // 柏拉图的配置不太一样-单独处理
        if (setting.typeName === '柏拉图') {
          // 初始化数据类型
          chartSettings.showLine = chartSettings.showLine || []
          chartSettings.yAxisType = chartSettings.yAxisType || []
          chartSettings.yAxisName = chartSettings.yAxisName || []
          
          chartSettings.showLine = showLineNames
          chartSettings.axisSite = { right: showLineNames }
          chartSettings.yAxisType = ['normal', 'normal']
          chartSettings.yAxisName = [' ', ' ']
        }
        return {
          chartData: chartData,
          chartSettings: chartSettings
        }
      },
      // 如果图表是表格
      getTableChartData (setting, workstageAndWorkOrderAscends) {
        // console.log(workstageAndWorkOrderAscends)
        // 表格的表头名称
        let xOptionName = {}
        // 表格的每一行数据
        let rows = []

        // 字段优先级排序排序
        let props = []
        let priority = ['工序', '生产批次号', '设备名称']
        workstageAndWorkOrderAscends.forEach(item => {
          let xOptionNameValue = {}
          setting.optionName.forEach(option => {
            let optionsName = option.boardAxisOptions[0].board_axis_options_name
            // console.log(item, optionsName, this.tableDict[optionsName])
            xOptionName[optionsName] = this.tableDict[optionsName]
            if (optionsName.indexOf('时间') > -1) {
              xOptionNameValue[this.tableDict[optionsName]] = this.getTime(item[xOptionName[optionsName]])
            } else {
              xOptionNameValue[this.tableDict[optionsName]] = item[xOptionName[optionsName]]
            }
          })
          // console.log(xOptionNameValue)
          rows.push(xOptionNameValue)
        })

        // 优先级高的排前面
        for (let key in xOptionName) {
          priority.forEach((name, index) => {
            if (key === name) {
              props[index] = {
                label: key,
                prop: this.tableDict[key]
              }
            }
          })
        }
        for (let key in xOptionName) {
          if (priority.indexOf(key) < 0) {
            props.push({
                label: key,
                prop: this.tableDict[key]
              })
          }
        }
        // 清除空的数据
        for (let i = 0; i < props.length; i++) {
          if (props[i] === undefined) {
            props.splice(i, 1)
            i--
          }
        }
        // console.log(props)

        return {
          props: props,
          rows: rows
        }
      },
      // 获取 总坏品数, 总不良数, 总产出量, 总坏品率
      getAllRateData (ascends) {
        let scrapSum = 0
        let badOutputSum = 0
        let outputSum = 0
        let allSum = 0
        let allScrapRate = 0
        let badOutputRate = 0
        ascends.forEach(item => {
          // 总坏品数
          scrapSum += parseInt(item.scrap_num)
          // 总产出量
          outputSum += parseInt(item.product_element_num)
          // 总不良数
          badOutputSum += parseInt(item.rejects_batch_quantity)
        })
        allSum = scrapSum + outputSum + badOutputSum
        allScrapRate = utils.div(scrapSum, allSum).toFixed(4)
        return {
          '总坏品数': scrapSum,
          '总不良数': badOutputSum,
          '总产出量': outputSum,
          '总坏品率': allScrapRate
        }
      },
      chartsResize () {
        if (this.$refs['refCharts'] && this.$refs['refCharts'].length > 0) {
          this.$refs['refCharts'].forEach(item => {
            item.echarts.resize()
          })
        }
      },
      getTime (timestamp) {
        if (!timestamp) {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss')
        }
      }
    },
    watch: {
      chartsSettings (vals) {
        this.chartsData = []
        this.settings = vals
        this.initBoardData().then(() => {
          this.$forceUpdate()
        }).catch(() => {})
      },
      resize () {
        this.chartsResize()
      }
    }
  }
</script>

<style scoped lang="scss">
.no-data{
  position: relative;
  height: 100%;
  p{
    position: absolute;
    z-index: 2;
    text-align: center;
    color: #999;
    top: 50%;
    width: 100%;
    margin: 0 0;
    margin-top: -46px;
  }
}
</style>
<style>
.chart-card .table-box{
  height: calc(100% - 59px);
  width: 100%;
  overflow-y: auto;
}
.chart-card .el-card__header{
  padding: 0 0;
}
.chart-card .card-header {
  padding: 8px 10px;
}
.chart-card .el-card__body{
  padding: 0 0;
  height: 100%;
}
</style>
