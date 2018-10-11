<!--刘川中 2018.6.01-->
<template>
  <section>
    <el-row class="area-row px-3" v-loading="visible.listLoading">
      <transition-group name="fade" mode="out-in">
        <el-card class="mb-3" v-for="(item, index) in areaCharts" :key="item.id">
          <el-form :inline="true" @submit.native.prevent size="small" :model="areaCharts[index]" label-width="100px">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t(`msg['名称']`)" prop="chartName">
                  <el-input v-model="item.chartName" :placeholder="$t(`msg['请输入']`) + $t(`msg['名称']`)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="$t(`msg['时间']`)" prop="timeType">
                  <el-select v-model="item.timeType" :placeholder="$t(`msg['请选择']`) + $t(`msg['时间']`)">
                    <el-option
                      v-for="val in timeList" :key="val.value"
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>
                  <el-date-picker type="datetimerange" v-model="item.time"  range-separator="-" 
                    :start-placeholder="$t(`msg['开始日期']`)" :end-placeholder="$t(`msg['结束日期']`)"  size="small" 
                    v-show="item.timeType === '自定义'"></el-date-picker> 
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <!-- 选择报表 -->
              <el-col :span="8">
                <el-form-item :label="$t(`msg['报表']`)" prop="reportFormId">
                  <el-select v-model="item.reportFormId" @change="handleSelectReportForm(item)" :placeholder="$t(`msg['请选择']`) + $t(`msg['报表']`)">
                    <el-option
                      v-for="form in reportFormNames" :key="form.board_report_form_name"
                      :label="form.board_report_form_name" :value="form.board_report_form_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show='item.reportFormId'>
                <el-form-item :label="$t('msg[\'' + item.searchs[0].board_report_search_name + '\']')" prop="searchName0">
                  <el-input v-model="item.searchs[0].board_report_search_value" class="pointer" readonly
                    :placeholder="$t('msg[\'' + '选择' + '\']') + $t('msg[\'' + item.searchs[0].board_report_search_name + '\']')"
                    v-show="item.searchs[0].board_report_search_name !='报表类型'" @click.native="handleSelectSearchValue(item, 0)">
                  </el-input>
                  <el-select v-model="item.searchs[0].board_report_search_value" :placeholder="$t(`msg['请选择']`) + $t(`msg['报表类型']`)"
                    v-show="item.searchs[0].board_report_search_name === '报表类型'">
                    <el-option
                      v-for="val in reportTypes" :key="val.value" 
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>            
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show='item.reportFormId'>
                <el-form-item :label="$t('msg[\'' + item.searchs[1].board_report_search_name + '\']')" prop="searchName1">
                  <el-input v-model="item.searchs[1].board_report_search_value" :placeholder="$t('msg[\'' + '选择' + '\']') + $t('msg[\'' + item.searchs[1].board_report_search_name + '\']')"
                    class="pointer" readonly @click.native="handleSelectSearchValue(item, 1)" :disabled="item.searchs[0].board_report_search_value === ''"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <!-- 看板类型 -->
              <el-col :span="8">
                <el-form-item :label="$t(`msg['看板类型']`)" prop="chartTypeId">
                  <el-select v-model="item.chartTypeId" :placeholder="$t(`msg['请选择']`) + $t(`msg['看板类型']`)" 
                    @change="handleSelectChartType(item, index)" :disabled="item.reportFormId === ''">
                    <el-option
                      v-for="val in chartTypes" :key="val.value"
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 选择表头 -->
              <el-col :span="16" v-show="item.chartTypeId === chartTypes[3].value">
                <el-form-item :label="$t(`msg['表头']`)" prop="theadList">
                  <el-checkbox-group v-model="item.theadList" size="small" :disabled="item.chartTypeId === ''">
                    <el-checkbox-button v-for="thead in item.theadOptions" :key="thead.value" :label="thead.label"></el-checkbox-button>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>

              <!-- 选择X轴 -->
              <el-col :span="8" v-show="item.chartTypeId !== chartTypes[3].value">
                <el-form-item :label="$t(`msg['X轴']`)" prop="xAxisOptionId">
                  <el-select v-model="item.xAxisOptionId" :placeholder="$t(`msg['请选择']`) + $t(`msg['X轴']`)" :disabled="item.chartTypeId === ''">
                    <el-option
                      v-for="val in item.xAxisOptions" :key="val.value"
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 选择Y轴 -->
              <el-col :span="8" v-show="item.chartTypeId !== chartTypes[3].value">
                <el-form-item :label="$t(`msg['Y轴']`)" prop="yAxisOptionId">
                  <el-select v-model="item.yAxisOptionId" :placeholder="$t(`msg['请选择']`) + $t(`msg['Y轴']`)" ref="yAxisSelect"
                    :multiple="item.chartTypeId === chartTypes[0].value" :disabled="item.chartTypeId === ''">
                    <el-option
                      v-for="val in item.yAxisOptions" :key="val.value"
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <!-- 随机抽样数 -->
              <el-col :span="8">
                <el-form-item :label="$t(`msg['随机抽样数']`)" prop="sampleNumber">
                  <el-select v-model="item.sampleNumber" :placeholder="$t(`msg['请选择']`) + $t(`msg['随机抽样数']`)" style="width: 130px;">
                    <el-option
                      v-for="val in sampleNumberOptions" :key="val.value"
                      :label="val.label" :value="val.value">
                    </el-option>
                  </el-select>
                  <el-input-number v-model="item.customSampleNumber" :min="1" size="small" :placeholder="$t(`msg['请输入']`) + $t(`msg['随机抽样数']`)" 
                    v-show="item.sampleNumber === '自定义'"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t(`msg['是否轮播']`)" prop="carouselStatus">
                  <el-switch v-model="item.carouselStatus" active-value="1" inactive-value="0" ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-show="item.carouselStatus !== '0'">
                <el-form-item :label="$t(`msg['轮播时间']`)" prop="carouselTime">
                  <el-select placeholder="选择轮播时间" v-model="item.carouselTime" size="small">
                    <el-option label="3秒" value="3"></el-option>
                    <el-option label="5秒" value="5"></el-option>
                    <el-option label="7秒" value="7"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 操作 -->
            <el-row>
              <el-col :span="24" class="text-right">
                <el-button size="small" type="primary" @click="add()" :disabled="notSavedCount === 1">{{ $t(`msg['新增']`) }}</el-button>
                <el-button size="small" type="danger" @click="del(item, index)" :disabled="areaCharts.length === 1 && item.id === ''">{{ $t(`msg['删除']`) }}</el-button>
                <el-button size="small" type="success" @click="save(item)">{{ $t(`msg['保存']`) }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </transition-group>
    </el-row>
  </section>
</template>

<script>
import utils from '../../../common/js/utils'
import {
  queryBoardPlan, queryAxisOptions,
  removeBoardAreaChart, saveBoardPlanConfigure,
  modifyBoardAreaCharts, queryReportFormType
} from '../../../api/api'
export default {
  name: 'chartshow-config',
  data () {
    return {
      filters: {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      },
      list: [],
      visible: {
        listLoading: true
      },
      areaCharts: [],
      areaPositionDict: {
        '左上区': 'da6c7f0a00544cdca3f9ac8c251412fb',
        '右上区': '2a1119f4ff6647ba8f6b6688c70ec8c5',
        '左下区': 'cffb025256024ba786f5ba6c5bd05f1f',
        '右下区': '1ea89b0188164365a11a50118ad8fd84'
      },
      // 报表名称
      reportFormNames: [],
      // 可选时间
      timeList: [
        {label: this.$t(`msg['昨天']`), value: 'day'},
        {label: this.$t(`msg['最近一周']`), value: 'week'},
        {label: this.$t(`msg['最近一个月']`), value: 'month'},
        {label: this.$t(`msg['自定义']`), value: '自定义'}
      ],
      // 报表类型
      reportTypes: [
        {label: this.$t(`msg['日报表']`), value: 'day'},
        {label: this.$t(`msg['周报表']`), value: 'week'},
        {label: this.$t(`msg['月报表']`), value: 'month'}
      ],
      // 表格类型
      chartTypes: [
        {label: this.$t(`msg['柏拉图']`), value: '2432758be3ad4beaabf84297dd9906f6'},
        {label: this.$t(`msg['柱状图']`), value: 'd951823154e34c03a00ae07bbae6c02a'},
        {label: this.$t(`msg['折线图']`), value: '050696bee7c04195b45b9011d3913379'},
        {label: this.$t(`msg['表格']`), value: 'd9afbd838db242bda0b282aeda5e5b5c'}
      ],
      // 随机抽样数
      sampleNumberOptions: [
        {label: '10', value: '10'},
        {label: '20', value: '20'},
        {label: '30', value: '30'},
        {label: this.$t(`msg['自定义']`), value: '自定义'}
      ]
    }
  },
  props: {
    reload: {
      type: Number
    },
    planId: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    boardType: {
      type: String,
      required: false
    },
    formNames: {
      type: Array,
      required: true
    }
  },
  computed: {
    // 没有保存的配置数量
    notSavedCount () {
      let count = 0
      this.areaCharts.forEach(item => {
        if (item.id === '') {
          count++
        }
      })
      return count
    }
  },
  mounted () {},
  methods: {
    // 初始化页面
    initPage () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.reportFormNames = this.formNames
      this.getAreaCharts()
    },
    // 加载所有图表设置
    getAreaCharts () {
      this.visible.listLoading = true
      return new Promise((resolve, reject) => {
        if (this.planId !== '') {
          let params = {
            type: 'boardPlanConfigures',
            planId: this.planId,
            headNum: 1
          }
          this.areaCharts = []
          queryBoardPlan(params).then(res => {
            this.visible.listLoading = false
            if (res.status === 0) {
              let boardAreaCharts = res.map.boardPlan.boardAreaCharts || []
              boardAreaCharts.forEach(item => {
                // 对item.boardReportSearchs 进行排序
                item.boardReportSearchs.sort((a, b) => { return Number(a.board_report_search_order) > Number(b.board_report_search_order) })
                if (item.board_area_configure_id === this.areaPositionDict[this.position]) {
                  this.areaCharts.push(this.tanslateAreaCharts(item))
                }
              })
              if (this.areaCharts.length === 0 || (boardAreaCharts.length === 1 && boardAreaCharts[0].board_area_chart_id === null)) {
                this.areaCharts.push(this.getEmptyAreaChart())
              }
            }
            resolve()
          }).catch(() => {})
        } else {
          reject()
        }
      })
    },
    // 获取列表
    getList () {
      // 注意后端分页用的字段是headNum, 所以要转换一下
      let para = Object.assign({
        headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
      }, this.filters)
      this.visible.listLoading = true
      queryBillboardPic(para).then((res) => {
        if (res.status === 0) {
          // this.filters.page = data.currentPage
          this.filters.total = res.map.counts
          this.list = res.map.bbplist
          // 只初始化一次选中的图片列表
          if (!this.selectedIdsLoaded) {
            this.selectedIdsLoaded = true
            this.selectedIds = [...new Set([...this.selectedInit, ...this.selectedIds])]
          }
          if (this.selectedIds.length > 0) {
            this.$nextTick(() => {
              this.toggleSelectionImg(this.list)
            })
          }
        } else {
          this.filters.total = 0
          this.list = []
        }
        this.visible.listLoading = false
      })
    },
    // 转换对象
    tanslateAreaCharts (item) {
      let obj = {
        id: item.board_area_chart_id,
        chartName: item.board_area_chart_name,
        chartNameOld: item.board_area_chart_name,
        timeType: '', // 时间类型 day week month
        time: [], // 开始时间，结束时间
        reportFormId: '',
        searchs: [], // 搜索参数
        chartTypeId: item.board_type_id,  // 图表类型，柏拉图。。。
        theadList: [], // 选中的表头
        xAxisId: '', // X轴id
        yAxisId: '', // Y轴id
        xAxisOptionId: '', // X轴选择项id
        yAxisOptionId: '', // Y轴选择项id
        sampleNumber: item.board_area_sampling_number, // 抽样数
        customSampleNumber: item.board_area_sampling_number, // 抽样数
        carouselStatus: item.board_area_interval_status, // 是否启用轮播
        carouselTime: item.board_area_interval_time, // 轮播时间
        theadOptions: [], // 表头列表
        xAxisOptions: [], // X轴列表
        yAxisOptions: [], // Y轴列表
      }
      // 根据报表名称查报表ID
      let nameIndex = this.reportFormNames.map(v => v.board_report_form_name).indexOf(item.board_report_form_name)
      obj.reportFormId = this.reportFormNames[nameIndex].board_report_form_id
      // 加载所有表头 XY轴选项
      this.getAxisOptions(obj.reportFormId).then(res => {
        obj.theadOptions = res.theadOptions
        obj.xAxisOptions = res.xAxisOptions
        obj.yAxisOptions = res.yAxisOptions
      })
      // 遍历搜索参数 - board_report_search_name 等于报表类型的 board_report_search_value_id为空
      item.boardReportSearchs.forEach((val, index) => {
        obj.searchs[index] = obj.searchs[index] || {
          board_area_chart_id: item.board_area_chart_id,
          board_report_form_search_id: val.boardReportFormSearchDOs.board_report_form_search_id,
          board_report_search_value_id: val.boardReportFormSearchDOs.board_report_search_value_id,
          board_report_search_id: val.board_report_search_id,  // 搜索类型id
          board_report_search_value: val.boardReportFormSearchDOs.board_report_search_value, // 搜索值, 工序 什么工序，车间 什么车间
          board_report_search_name: val.board_report_search_name // 搜索的名称  如 工序 车间
        }
      })
      // 如果时间不是 day week month 其中一个，就清空就是自定义
      if (this.timeList.map(v => v.value).indexOf(item.board_area_start_date) === -1) {
        obj.time[0] = new Date(item.board_area_start_date)
        obj.time[1] = new Date(item.board_area_end_date)
        obj.timeType = '自定义'
      } else {
        obj.timeType = item.board_area_start_date
      }
      // 初始化表头
      item.boardAxis.forEach(val => {
        if (val.board_axis_type === '表格') {
          obj.theadList.push(val.boardAxisOptions[0].board_axis_options_name)
        } else if (val.board_axis_type === 'x') {
          obj.xAxisId = val.board_axis_id // X轴id，修改的时候需要
          obj.xAxisOptionId = val.boardAxisOptions[0].board_axis_options_id
        } else if (val.board_axis_type === 'y') {
          obj.yAxisId = val.board_axis_id // Y轴id，修改的时候需要
          obj.yAxisOptionId = obj.yAxisOptionId || []
          obj.yAxisOptionId.push(val.boardAxisOptions[0].board_axis_options_id)
        }
      })
      // 柏拉图有多个Y轴，yAxisId为数组类型，其它情况为字符串类型
      if (obj.chartTypeId !== this.chartTypes[0].value) {
        obj.yAxisId = obj.yAxisId[0]
        obj.yAxisOptionId = obj.yAxisOptionId[0]
      }
      // 是不是自定义抽样数量
      if (this.sampleNumberOptions.indexOf(obj.sampleNumber) === -1) {
        obj.sampleNumber = '自定义'
      }
      // console.log(obj)
      return obj
    },
    // 返回一个空的配置数据，用于新增的时候初始化数据
    getEmptyAreaChart () {
      let obj = {
        id: '',
        chartName: '',
        timeType: '', // 时间类型 day week month
        time: [], // 开始时间，结束时间
        reportFormId: '',
        searchs: [], // 搜索参数
        chartTypeId: '',  // 图表类型，柏拉图。。。
        theadList: [], // 选中的表头
        xAxisId: '', // X轴id
        yAxisId: '', // Y轴id
        xAxisOptionId: '', // X轴选择项id
        yAxisOptionId: '', // Y轴选择项id
        sampleNumber: '', // 抽样数
        customSampleNumber: '40', // 抽样数
        carouselStatus: '1', // 是否启用轮播
        carouselTime: '3', // 轮播时间
        theadOptions: [], // 表头列表
        xAxisOptions: [], // X轴列表
        yAxisOptions: [] // Y轴列表
      }
      let searchItem = {
        board_area_chart_id: '',
        board_report_form_search_id: '',
        board_report_search_id: '',
        board_report_search_value: '', // 比如工序名称
        board_report_search_value_id: '', // 比如工序id
        board_report_search_name: '' // 实际上相当于搜索类型 比如工序，车间
      }
      obj.searchs.push(searchItem)
      obj.searchs.push(searchItem)
      return obj
    },
    // 获取所有表头或者XY轴选项
    getAxisOptions (reportFormId) {
      return new Promise((resolve, reject) => {
        queryAxisOptions({ formId: reportFormId}).then(res => {
          let theadOptions = []
          let xAxisOptions = []
          let yAxisOptions = []
          if (res.status === 0) {
            res.map.boardTypes.forEach(item => {
              if (item.board_axis_type === '表头') {
                theadOptions.push({
                  label: item.board_axis_options_name,
                  value: item.board_axis_options_id
                })
              }
              if (item.board_axis_type === 'x') {
                xAxisOptions.push({
                  label: item.board_axis_options_name,
                  value: item.board_axis_options_id
                })
              }
              if (item.board_axis_type === 'y') {
                yAxisOptions.push({
                  label: item.board_axis_options_name,
                  value: item.board_axis_options_id
                })
              }
            })
          }
          resolve({
            theadOptions: theadOptions,
            xAxisOptions: xAxisOptions,
            yAxisOptions: yAxisOptions
          })
        })
      })
    },
    // 选择报表
    handleSelectReportForm (item) {
      item.theadList = []
      // 加载所有表头 XY轴选项
      this.getAxisOptions(item.reportFormId).then(res => {
        item.theadOptions = res.theadOptions
        item.xAxisOptions = res.xAxisOptions
        item.yAxisOptions = res.yAxisOptions
      })
      this.getSearchParams(item).then(searchs => {
        item.searchs = searchs
      })
    },
    // 获取搜索参数
    getSearchParams (item) {
      return new Promise((resole, reject) => {
        queryReportFormType({ formId: item.reportFormId, headNum: 1}).then(res => {
          let searchs = []
          if (res.status === 0) {
            let arr = res.map.boardTypes
            arr.sort((a, b) => { return Number(a.board_report_search_order) > Number(b.board_report_search_order) })
            arr.forEach((val, index) => {
              searchs.push({
                board_area_chart_id: item.id,
                board_report_form_search_id: item.searchs[index].board_report_form_search_id,
                board_report_search_id: val.board_report_search_id,
                board_report_search_value: '', // 比如工序名称
                board_report_search_value_id: '', // 比如工序id
                board_report_search_name: val.board_report_search_name // 实际上相当于搜索类型 比如工序，车间
              })
            })
          } else {
            searchs = []
          }
          resole(searchs)
        })
      })
    },
    // 选择图表类型
    handleSelectChartType (item, index) {
      item.xAxisOptionId = ''
      if (item.chartTypeId === this.chartTypes[0].value) {
        item.yAxisOptionId = []
      } else {
        item.yAxisOptionId = ''
        let input = this.$refs['yAxisSelect'][index].$el.querySelector('input')
        input.style.height = '32px'
        input.placeholder = this.$t(`msg['请选择']`) + this.$t(`msg['Y轴']`)
      }
    },
    add () {
      this.areaCharts.push(this.getEmptyAreaChart())
      // 初始化选择第一个报表
      // this.areaCharts[this.areaCharts.length - 1].reportFormId = this.reportFormNames[0].board_report_form_id
      // this.getSearchParams(this.areaCharts[this.areaCharts.length - 1])
    },
    del (item, index) {
      if (item.id === '') {
        this.areaCharts.splice(index, 1)
        if (this.areaCharts.length === 0) {
          this.areaCharts.push(this.getEmptyAreaChart())
        }
      } else {
        this.$confirm(this.$t(`msg['确认删除吗']`), {
          title: this.$t(`msg['提示']`),
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
            removeBoardAreaChart({ areaChartId: item.id }).then(res => {
              if (res.status === 0) {
                this.$message.success(this.$t(`msg['删除成功']`))
                this.areaCharts.splice(index, 1)
                if (this.areaCharts.length === 0) {
                  this.areaCharts.push(this.getEmptyAreaChart())
                }
              } else {
                this.$message.warning(res.msg || this.$t(`msg['删除失败']`))
              }
            })
          }
        }).catch(() => {})
      }
    },
    // 保存 或 修改
    save (item) {
      let data = this.checkAreaChartResult(item)
      if (data !== false) {
        let saveFn = item.id === '' ? saveBoardPlanConfigure : modifyBoardAreaCharts
        saveFn(data).then(res => {
          if (res.status === 0) {
            this.$message.success(this.$t(`msg['保存成功']`))
            item.chartNameOld = item.chartName
            if (item.id === '') {
              // 如果是新增要刷新一下的，因为这样才会有id
              this.initPage()
            }
          } else {
            this.$message.warning(res.msg || this.$t(`msg['保存失败']`))
          }
        })
      }
    },
    // 校验并返回校验结果
    checkAreaChartResult (item) {
      // 数据检验及提示
      if (item.chartName === '') {
        this.$message.warning(this.$t(`msg['名称不能为空']`))
        return false
      }
      if ( item.timeType === '' || (item.timeType === '自定义' && (item.time === null || item.time.length === 0)) ) {
        this.$message.warning(this.$t(`msg['时间不能为空']`))
        return false
      }
      if (item.reportFormId === '') {
        this.$message.warning(this.$t(`msg['报表不能为空']`))
        return false
      }
      // 搜索参数不能为空
      for (let i = 0, len = item.searchs.length; i < len; i++) {
        if (item.searchs[i].board_report_search_value === '') {
          this.$message.warning(this.$t('msg[\'' + item.searchs[i].board_report_search_name + '\']') + this.$t(`msg['不能为空']`))
          return false
        }
      }
      if (item.chartTypeId === '') {
        this.$message.warning(this.$t(`msg['看板类型不能为空']`))
        return false
      }
      // 表格是表头不能为空，其他图表是XY轴不能为空
      if (item.chartTypeId === this.chartTypes[3].value) {
        if (item.theadList.length === 0) {
          this.$message.warning(this.$t(`msg['表头不能为空']`))
          return false
        }
      } else {
        if (item.xAxisOptionId === '') {
          this.$message.warning(this.$t(`msg['X轴不能为空']`))
          return false
        }
        if (  (item.chartTypeId !== this.chartTypes[0].value && item.yAxisOptionId === '') ||
              (item.chartTypeId === this.chartTypes[0].value && item.yAxisOptionId.length === 0)
           ) {
             this.$message.warning(this.$t(`msg['Y轴不能为空']`))
             return false
           }
      }
      if (item.sampleNumber === '' || (item.sampleNumber === '自定义' && item.customSampleNumber === '')) {
        this.$message.warning(this.$t(`msg['随机抽样数不能为空']`))
        return false
      }

      let areaChartObj = {}  // 基本信息
      let searchValueData = []  // 搜索参数
      let boardAxisData = []  // 表头 XY轴信息
      areaChartObj = {
        board_area_chart_id: item.id,
        board_area_chart_name: item.chartName,
        board_plan_id: this.planId,
        board_area_configure_id: this.areaPositionDict[this.position],
        board_type_id: item.chartTypeId,  // 图表类型ID
        board_report_form_id: item.reportFormId,
        board_area_start_date: '',
        board_area_end_date: '',
        board_area_interval_status: item.carouselStatus,
        board_area_interval_time: item.carouselTime,
        board_area_sampling_number: ''
      }
      // 名称如果没有修改，则不传
      if (item.chartNameOld === item.chartName) {
        areaChartObj.board_area_chart_name = null
      }
      // 时间如果是自定义
      if (item.timeType === '自定义') {
        areaChartObj.board_area_start_date = utils.formatDate.format(new Date(item.time[0]), 'yyyy-MM-dd hh:mm:ss')
        areaChartObj.board_area_end_date = utils.formatDate.format(new Date(item.time[1]), 'yyyy-MM-dd hh:mm:ss')
      } else {
        areaChartObj.board_area_start_date = item.timeType
        areaChartObj.board_area_end_date = item.timeType
      }
      // 随机抽样数如果是自定义
      if (item.sampleNumber === '自定义') {
        areaChartObj.board_area_sampling_number = item.customSampleNumber
      } else {
        areaChartObj.board_area_sampling_number = item.sampleNumber
      }

      // 如果是表格
      if (item.chartTypeId === this.chartTypes[3].value) {
        // 根据名称找到对应的id
        let theadIdList = []
        let theadOptionsLabel = item.theadOptions.map(v => v.label)
        item.theadList.forEach(val => {
          let index = theadOptionsLabel.indexOf(val)
          theadIdList.push(item.theadOptions[index].value)
        })
        item.theadList.forEach((val, index) => {
          boardAxisData.push({
            board_axis_id: '',
            board_area_chart_id: item.id,
            board_axis_options_id: theadIdList[index],
            board_axis_type: '表格'
          })
        })
      } else {
        boardAxisData.push({
          board_axis_id: item.xAxisId,
          board_area_chart_id: item.id,
          board_axis_options_id: item.xAxisOptionId,
          board_axis_type: 'x',
        })
        if (item.chartTypeId === this.chartTypes[0].value) { // 柏拉图
          item.yAxisOptionId.forEach(val => {
            boardAxisData.push({
              board_axis_id: item.yAxisId,
              board_area_chart_id: item.id,
              board_axis_options_id: val,
              board_axis_type: 'y',
            })
          })
        } else {
          boardAxisData.push({
            board_axis_id: item.yAxisId,
            board_area_chart_id: item.id,
            board_axis_options_id: item.yAxisOptionId,
            board_axis_type: 'y',
          })
        }
      }

      // console.log(boardAxisData)
      // return false

      return {
        areaChart: JSON.stringify([areaChartObj]),
        searchValue: JSON.stringify(item.searchs),
        boardAxis: JSON.stringify(boardAxisData)
      }
    },
    // 如果是工序，那就是选择工序，如果是车间就是选择车间
    handleSelectSearchValue (item, searchIndex) {
      let searchItem = item.searchs[searchIndex]
      switch (searchItem.board_report_search_name) {
      case '车间':
        this.$mesWorkShop.show({
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].role_workshop_name
          searchItem.board_report_search_value_id = res.rows[0].role_workshop_id
        })
        break
      case '工序':
        // 有两个报表的工序要特殊处理一下
        if (item.reportFormId === '9cca6726573442f0aefa98e638468c50' || item.reportFormId === 'efe266834d8343c3b7611ed4872d97da') {
          this.$mesWorkstageBasics.show({
            selectedIds: [searchItem.board_report_search_value_id]
          }).then(res => {
            searchItem.board_report_search_value = res.rows[0].workstage_name
            searchItem.board_report_search_value_id = res.rows[0].workstage_basics_id
          })
        } else {
          if (item.searchs[0].board_report_search_value_id === '') {
            this.$message.warning(this.$t(`msg['请先选择车间']`))
          } else {
            this.$mesWorkstageByWorkShopId.show({
              selectedIds: [searchItem.board_report_search_value_id],
              params: {
                type: 'workstage',
                workshopId: item.searchs[0].board_report_search_value_id
              },
              reRender: true
            }).then(res => {
              searchItem.board_report_search_value = res.rows[0].workstage_name
              searchItem.board_report_search_value_id = res.rows[0].workstage_basics_id
            })
          }
        }
        break
      case '设备类型':
        this.$mesDeviceType.show({
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].devices_control_devices_type_name
          searchItem.board_report_search_value_id = res.rows[0].devices_control_devices_type_id
        })
        break
      case '设备编号':
        this.$mesDevice.show({
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].devices_control_devices_number
          searchItem.board_report_search_value_id = res.rows[0].devices_control_devices_id
        })
        break
      case '物料':
        this.$mesMaterial.show('选择物料', {
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].material.warehouse_material_name
          searchItem.board_report_search_value_id = res.rows[0].material.warehouse_material_id
        })
        break
      case '物料批次':
        this.$mesMaterial.show('选择批次', {
          selectedIds: [searchItem.board_report_search_value_id],
          params: {
            type: 'material',
            keyword: '',
            model: item.searchs[0].board_report_search_value_id
          }
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].warehouse_material_batch
          searchItem.board_report_search_value_id = res.rows[0].warehouse_material_batch
        })
        break
      case '半成品':
        this.$mesSemiFinishedProduct.show({
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].semi_finish_name
          searchItem.board_report_search_value_id = res.rows[0].semi_finish_id
        })
        break
      case '生产批号':
        this.$mesProductionBatchNumber.show({
          selectedIds: [searchItem.board_report_search_value_id]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].production_plan_batch_number
          searchItem.board_report_search_value_id = res.rows[0].production_plan_batch_number
        })
        break
      case '电池型号':
        this.$mesBattery.show({
          selectedIds: [searchItem.board_report_search_value]
        }).then(res => {
          searchItem.board_report_search_value = res.rows[0].warehouse_product_model
          searchItem.board_report_search_value_id = res.rows[0].product_model_id
        })
        break
      case '选择工序':
        this.$mesWorkstageBasics.show({
            selectedIds: [searchItem.board_report_search_value_id]
          }).then(res => {
            searchItem.board_report_search_value = res.rows[0].workstage_name
            searchItem.board_report_search_value_id = res.rows[0].workstage_basics_id
          })
        break
      }
    },
    // 页面改变
    handlePageChange (val) {
      this.filters.page = val
      this.getList()
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.filters.pageSize = val
      this.getList()
    },
    // 列表索引
    getIndex (index) {
      return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
    },
    // 重置
    reset () {
      this.filters = {
        PlanId: this.planId,
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.getList()
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
    reload (val) {
      this.initPage()
    },
    planId (val) {
      if (val !== '' && this.formNames.length > 0) {
        this.initPage()
      }
    },
    formNames (vals) {
      if (this.planId !== '' && vals.length > 0) {
        this.initPage()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.area-row{
  min-height: 300px;
}
</style>
