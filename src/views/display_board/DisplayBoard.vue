<!--刘川中 2018.6.01-->
<template>
  <section>
    <el-row>
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="6" class="text-left">
            <el-form-item>
              <el-select v-model="planId" placeholder="选择看板" @change="initAllBoard" size="">
                <el-option
                  v-for="item in getBoardList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <!-- 通知滚动组件 -->
            <text-scroll :text="notification" :scroll-time="textScrollTime" v-if='notification' :resize="randNum"></text-scroll>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="16" v-loading="visible.loading" class="board-container" v-if="boardType != '工艺看板'">
      <!-- 视频 -->
      <el-col :span="12" class="board-item" v-if="boardType === '宣传看板'">
        <video v-if="boardVideoSrc" :src="boardVideoSrc" controls autoplay loop muted class="w-100 h-100">您的浏览器不支持 video 标签</video>
        <p v-else class="color-999 text-center no-data">暂无数据</p>
      </el-col>
      <!-- 轮播图 -->
      <el-col :span="12" class="board-item" v-if="boardType === '宣传看板'" ref='imgCarousel'>
        <div v-if="slideImgs.length > 0" class="h-100">
          <el-carousel :interval="5000" class="board-carousel">
            <el-carousel-item v-for="item in slideImgs" :key="item.img_id">
              <img :src="sendFileToCustomerUrl + '?fileName=' + item.img_name" :alt="item.img_name" class="slide-img">
            </el-carousel-item>
          </el-carousel>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('imgCarousel')"></i>
        </div>
        <p v-else class="color-999 text-center no-data">暂无数据</p>
      </el-col>

      <!-- 左上 -->
      <el-col :span="12" class="board-item" v-if="boardType !== '宣传看板'" ref="ltCarousel">
        <div v-show="ltChartsSettings.length > 0" class="h-100">
          <board :charts-settings="ltChartsSettings" :resize="randNum" v-if="ltChartsSettings"></board>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('ltCarousel')"></i>
        </div>
        <p v-show="ltChartsSettings.length===0" class="color-999 text-center no-data">暂无数据</p>
      </el-col>
      <!-- 右上 -->
      <el-col :span="12" class="board-item" v-if="boardType !== '宣传看板'" ref="rtCarousel">
        <div v-show="rtChartsSettings.length > 0" class="h-100">
          <board :charts-settings="rtChartsSettings" :resize="randNum" v-if="ltChartsSettings"></board>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('rtCarousel')"></i>
        </div>
        <p v-show="rtChartsSettings.length===0" class="color-999 text-center no-data">暂无数据</p>
      </el-col>

      <!-- 左下 -->
      <el-col :span="12" class="board-item" ref="lbCarousel">
        <div v-show="lbChartsSettings.length > 0" class="h-100">
          <board :charts-settings="lbChartsSettings" :resize="randNum" v-if="ltChartsSettings"></board>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('lbCarousel')"></i>
        </div>
        <p v-show="lbChartsSettings.length===0" class="color-999 text-center no-data">暂无数据</p>
      </el-col>
      <!-- 右下 -->
      <el-col :span="12" class="board-item" ref="rbCarousel">
        <div v-show="rbChartsSettings.length > 0" class="h-100">
          <board :charts-settings="rbChartsSettings" :resize="randNum" v-if="ltChartsSettings"></board>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('rbCarousel')"></i>
        </div>
        <p v-show="rbChartsSettings.length===0" class="color-999 text-center no-data">暂无数据</p>
      </el-col>

    </el-row>

    <!-- 工艺看板 -->
    <el-row v-if="boardType === '工艺看板'" v-loading="visible.loading" class="board-container craft-container" style="">
      <el-col :span="24" ref="craftWrap" class="h-100">
        <!-- 视频 -->
        <el-col :span="24" class="board-item mt-0 bg-white" v-if="craftMediaType === 'video'" style="min-height: 600px;">
          <div v-if="boardVideoSrc !== ''">
            <video :src="boardVideoSrc" controls autoplay loop muted class="">您的浏览器不支持 video 标签</video>
            <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('craftWrap')"></i>
          </div>
          <p v-else class="color-999 text-center no-data">暂无数据 {{ boardVideoSrc }} </p>
        </el-col>
        <!-- 轮播图 -->
        <el-col :span="24" class="board-item mt-0 h-100 bg-white" v-if="craftMediaType === 'picture'" ref='imgCarousel' style="min-height: 600px;">
          <div v-if="slideImgs.length > 0" class="w-100 h-100 " style="position: absolute; z-index: 2;">
            <el-carousel :interval="5000" class="board-carousel h-100" v-if="slideImgs.length > 0">
              <el-carousel-item v-for="item in slideImgs" :key="item.img_id">
                <img :src="sendFileToCustomerUrl + '?fileName=' + item.img_name" :alt="item.img_name" class="slide-img">
              </el-carousel-item>
            </el-carousel>
            <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('craftWrap')"></i>
          </div>
          <p v-else class="color-999 text-center no-data">暂无数据</p>
        </el-col>
        <!-- pdf -->
        <el-col :span="24" class="board-item mt-0 h-100 bg-white" ref='longPictureScroll' style="min-height: 600px" v-if="craftMediaType === 'pdf'">
          <long-picture-scroll :picture-list="pdfPictureList" :scroll-time="scrollTime" :resize="randNum"></long-picture-scroll>
          <i class="fa fa-arrows-alt full-screen pointer" @click="fullScreen('craftWrap')"></i>
        </el-col>
      </el-col>
    </el-row>

  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import SocketService from '../../common/js/websocket'
  import { 
    queryBoardPlan, sendFileToCustomerUrl,
    querySpectacularsMessage, queryBillboardType,
    sendPdfFileToCustomerUrl
    } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'
  import Board from './components/Board.vue'
  import TextScroll from './components/TextScroll.vue'
  import LongPictureScroll from './components/LongPictureScroll.vue'

  export default {
    name: 'display-board',
    data () {
      return {
        filters: {
          keyword: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        // 所有的看板菜单
        boardPlans: [],
        boardTypeList: [ '宣传看板', '生产看板', '设备看板', '质量看板'],
        boardType: '',
        planId: '',
        visible: {
          loading: false
        },
        sendFileToCustomerUrl: sendFileToCustomerUrl,
        boardVideoSrc: '',
        slideImgs: [],
        // 图表设置
        chartsSettings: [],
        // 图表位置
        chartsPosition: {
          '左上': 'da6c7f0a00544cdca3f9ac8c251412fb',
          '右上': '2a1119f4ff6647ba8f6b6688c70ec8c5',
          '左下': 'cffb025256024ba786f5ba6c5bd05f1f',
          '右下': '1ea89b0188164365a11a50118ad8fd84'
        },
        currentTime: '',
        yesterday: '',
        lastweek: '',
        lastmonth: '',
        randNum: 0,
        notification: '',
        textScrollTime: 20, // 通知文字滚动时间
        pdfPictureList: [],
        scrollTime: 30,
        craftMediaType: '' // 工艺看板的媒体类型
      }
    },
    computed: {
      ...mapGetters({
        getUser: 'getUser'
      }),
      // 根据boardType返回相应的看板列表
      getBoardList () {
        let arr = []
        this.boardPlans.forEach(item => {
          if (item.board_plan_type === this.boardType) {
            arr.push({
                label: item.board_plan_name,
                value: item.board_plan_id
              })
          }
        })
        return arr
      },
      ltChartsSettings () {
        let arr = []
        this.chartsSettings.forEach(item => {
          if (item.positionId === this.chartsPosition['左上']) {
            arr.push(item)
          }
        })
        return arr
      },
      rtChartsSettings () {
        let arr = []
        this.chartsSettings.forEach(item => {
          if (item.positionId === this.chartsPosition['右上']) {
            arr.push(item)
          }
        })
        return arr
      },
      lbChartsSettings () {
        let arr = []
        this.chartsSettings.forEach(item => {
          if (item.positionId === this.chartsPosition['左下']) {
            arr.push(item)
          }
        })
        return arr
      },
      rbChartsSettings () {
        let arr = []
        this.chartsSettings.forEach(item => {
          if (item.positionId === this.chartsPosition['右下']) {
            arr.push(item)
          }
        })
        return arr
      },
    },
    components: { Board, TextScroll, LongPictureScroll },
    mounted () {
      this.boardType = this.$route.meta.type
      this.initPage()
      this.initSocketService()
    },
    methods: {
      ...mapActions(['initWorkstageList', 'initWorkshopList', 'setRoutes']),
      // 初始化页面
      initPage () {
        this.getMessage()
        this.currentTime = new Date(new Date().setHours(0, 0, 0, 0)) // 当天0点时间戳(秒)
        this.yesterday = this.currentTime - 86400000                 // 昨天0点时间戳(秒)
        this.lastweek = this.currentTime - 86400000 * 7              // 7天前0点时间戳(秒)
        this.lastmonth = new Date(new Date().setHours(0, 0, 0, 0)).setMonth((new Date().getMonth() - 1))            // 一个月前前0点时间戳(秒)
        this.visible.loading = true
        queryBoardPlan({ type: 'info', headNum: 1}).then(res => {
          if (res.status === 0) {
            this.boardPlans = res.map.boardPlans
            this.$nextTick(() => {
              this.planId = this.getBoardList[0].value
              this.initAllBoard()
            })
          } else {
            this.boardPlans = []
          }
        }).catch(() => {
          this.visible.loading = false
          this.boardPlans = []
          this.clearData()
        })
      },
      // 初始化所有看板
      initAllBoard () {
        let params = {
          type: 'boardPlanConfigures',
          planId: this.planId,
          headNum: 1
        }
        queryBoardPlan(params).then(res => {
          this.visible.loading = false
          if (res.status === 0) {
            if (this.boardType === '宣传看板') {
              // 视频和轮播图数据
              this.boardVideoSrc = sendFileToCustomerUrl + '?fileName=' + res.map.vedioList[0].billboard_vedio_name
              this.slideImgs = res.map.pictureList
            }
            if (this.boardType === '工艺看板') {
              this.initCraftBoard(res)
            }
            this.chartsSettings = this.getChartsSettings(res.map.boardPlan.boardAreaCharts)
          } else {
            this.clearData()
          }
        }).catch(() => {
          this.visible.loading = false
          this.clearData()
        })
      },
      // 清空相关数据
      clearData () {
        this.boardVideoSrc = ''
        this.slideImgs = []
        this.chartsSettings = []
      },
      // 消息
      getMessage () {
        querySpectacularsMessage().then(res => {
          if (res.status === 0) {
            this.notification = res.data.system_dynamic_message_body
            this.textScrollTime = this.getTextScrollTime(this.notification)
          } else {
            this.notification = ''
          }
        })
      },
      getTextScrollTime (notification) {
        let time = 20
        if (notification === '') {
          return time + notification.split('').length / 5
        } else {
          return time
        }
      },
      // 全屏
      fullScreen (ref, isEsc) {
        if (this.$refs[ref].isFullScreen) {
          this.$refs[ref].isFullScreen = false
          this.$refs[ref].$el.classList.remove('w-100', 'h-100')
          if (!isEsc) {
            utils.exitFullScreen(this.$refs[ref].$el)
          }
        } else {
          // 按下esc键会触发 window.onresize
          window.onresize = () => {
            this.setRandNum()
            if (!utils.checkFullScreen()) {
              this.$refs[ref].isFullScreen = true
              this.fullScreen(ref, true)
              window.onresize = null
            }
          }
          this.$refs[ref].$el.classList.add('w-100', 'h-100')
          this.$refs[ref].isFullScreen = true
          utils.requestFullScreen(this.$refs[ref].$el)
        }
      },
      // 图表的设置信息
      getChartsSettings (boardAreaCharts) {
        let settings = []
        boardAreaCharts.forEach(item => {
          switch (item.board_area_start_date) {
          case 'day':
            item.board_area_start_date = utils.formatDate.format(new Date(this.yesterday), 'yyyy-MM-dd hh:mm:ss')
            break
          case 'week':
            item.board_area_start_date = utils.formatDate.format(new Date(this.lastweek), 'yyyy-MM-dd hh:mm:ss')
            break
          case 'month':
            item.board_area_start_date = utils.formatDate.format(new Date(this.lastmonth), 'yyyy-MM-dd hh:mm:ss')
            break
          default:
            item.board_area_start_date = utils.formatDate.format(new Date(item.board_area_start_date), 'yyyy-MM-dd hh:mm:ss')
            break
          }
          item.board_area_end_date = utils.formatDate.format(new Date(this.currentTime - 1), 'yyyy-MM-dd hh:mm:ss')

          // 图表类型设置
          let settingItem = {
              boardReportSearchs: item.boardReportSearchs,
              id: item.board_area_chart_id, // 图标id
              typeName: item.board_type_name, // 表类型名称
              name: item.board_report_form_name, // 表名称
              startDate: item.board_area_start_date, // 开始时间
              endDate: item.board_area_end_date, // 结束时间
              samplingNumber: item.board_area_sampling_number, // 抽样数量
              intervalStatus: item.board_area_interval_status, // 是否轮播
              intervalTime: item.board_area_interval_time, // 轮播间隔时间
              positionId: item.board_area_configure_id
          } // 所有图表都有的配置信息
          
          switch (item.board_type_name) {
          case '表格':
            settingItem.optionName = item.boardAxis // 表头名称
            break
          case '柏拉图':
            // 有多个y轴名称：yName1, yName2...
            this.setPlatoXYNames(settingItem, item.boardAxis)
            break
          // 其它-柱状图
          default:
            settingItem.xName = item.boardAxis[0].board_axis_type === 'x' ? item.boardAxis[0].boardAxisOptions[0].board_axis_options_name: item.boardAxis[1].boardAxisOptions[0].board_axis_options_name // x轴名称
            settingItem.yName = item.boardAxis[1].board_axis_type === 'y' ? item.boardAxis[1].boardAxisOptions[0].board_axis_options_name: item.boardAxis[0].boardAxisOptions[0].board_axis_options_name // y轴名称
            break
          }
          settings.push(settingItem)
        })
        return settings
      },
      // 设置柏拉图X轴和多个Y轴名称
      setPlatoXYNames (settingItem, boardAxis) {
        let count = 0
        boardAxis.forEach((item, index) => {
            if (item.board_axis_type === 'x') {
              settingItem['xName'] = item.boardAxisOptions[0].board_axis_options_name
            }
            if (item.board_axis_type === 'y') {
              settingItem['yName' + ( ++count )] = item.boardAxisOptions[0].board_axis_options_name
            }
        })
      },
      setRandNum () {
        // 触发图表的resize
        this.randNum = Math.random()
      },
      getTime (timestamp) {
        if (!timestamp) {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd hh:mm:ss')
        }
      },
      //  SocketService相关
      initSocketService () {
        // socketService初始化
        SocketService.connect('/refreshBillboardWebSocket')
        SocketService.on('socket_opened', socket => {
          // console.log(socket)
        })
        // 重连
        SocketService.on('socket_reconnect', () => {
          console.log('socket_reconnect')
          this.initSocketService()
        })

        // 刷新看板
        SocketService.on('refreshBillboard', data => {
          console.log('refreshBillboard data:', data)
          if (this.planId === data.billboardId) {
            this.initPage()
          }
        })
        // 刷新通知
        SocketService.on('refreshMessage', data => {
          if (this.notification !== data.message) {
            this.notification = ''
            this.$nextTick(() => {
              this.notification = data.message
              this.textScrollTime = this.getTextScrollTime(this.notification)
            })
          }
        })
      },
      // 工艺看板初始化
      initCraftBoard (res) {
        queryBillboardType({planId: this.planId}).then(_res => {
          if (_res.status === 0) {
            // 工艺看板初始化
            this.craftMediaType = _res.map.billboardCraft.billboard_madirtype_type
            switch (this.craftMediaType) {
              case 'video':
                this.$nextTick(() => {
                  this.boardVideoSrc = sendFileToCustomerUrl + '?fileName=' + res.map.vedioList[0].billboard_vedio_name
                })
              break
              case 'picture':
                this.$nextTick(() => {
                  this.slideImgs = res.map.pictureList
                })
              break
              case 'pdf':
                if (res.map.pdfList.length > 0) {
                  this.scrollTime = 0
                  this.pdfPictureList = []
                  this.$nextTick(() => {
                    this.scrollTime = parseFloat(res.map.pdfList[0].pdf_roll_time)
                    this.pdfPictureList = [sendPdfFileToCustomerUrl + '?fileName=' + res.map.pdfList[0].pdf_name]
                  })
                }
              break
            }
          } else {
            this.craftMediaType = 'video'
            this.boardVideoSrc = ''
            this.pdfPictureList = []
            this.slideImgs = []
          }
        })
      }
    },
    watch: {
      '$route' (val) {
        this.boardType = val.meta.type
        this.initPage()
      }
    },
    destroyed () {
      SocketService.close()
    }
  }
</script>

<style scoped lang="scss">
@import '~scss_vars';
.board-container{
  background-color: transparent;
  min-height: 480px;
  .board-item {
    position: relative;
    min-height: 300px;
    height: 480px;
    overflow: hidden;
    margin-top: .5rem;
    .board-carousel{
      height: 100%;
    }
    .slide-img {
      display: block;
      height: 100%;
      margin: 0 auto;
    }
    // 全屏按钮
    .full-screen{
      position: absolute;
      z-index: 9;
      bottom: 0;
      right: 8px;
      font-size: 130%;
      color: #999;
      &:hover{
        color: #666;
      }
    }
    .no-data {
      text-align: center;
			border: none;
			outline: 0;
			padding: 0;
			margin: 0;
			height: 16px;
			width: 100px;
			position: absolute;
			z-index: 11;
			top: 50%;
			left: 50%;
			margin-top: -8px;
			margin-left: -50px;
			color: #aaa;
    }
  }
}
.craft-container {
  video{
    width: 100%;
    height: auto;
  }
  .board-item:first-child{
    height: auto;
  }
  .board-item:last-child{
    height: 100%;
  }
  .full-screen{
    right: 0 !important;
  }
}
</style>

<style>
.board-carousel .el-carousel__container {
  height: 100%;
}
</style>