<!--刘川中 2018.6.01-->
<template>
  <section>
    <el-row>
      <el-col class="toolbar">
        <el-form :inline="true" :model="schemeModel" @submit.native.prevent>
          <el-col :span="12" class="text-left">
            <el-form-item :span="4">
              <el-select v-model="planId" :placeholder="$t(`msg['选择方案']`)" @change="initPage(false)" size="">
                <el-option
                  v-for="item in getBoardList" :key="item.value"
                  :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button size="medium" type="success" plain icon="fa fa-exchange" @click="handleSynchronize"> {{ $t(`msg['同步']`) }}</el-button>
            <el-button size="medium" type="primary" plain @click="addScheme">{{ $t(`msg['添加新方案']`) }}</el-button>
            <el-button size="medium" type="danger" plain @click="removeScheme">{{ $t(`msg['删除此方案']`) }}</el-button>
          </el-col>
        </el-form>
      </el-col>
    </el-row>

    <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick" v-if="boardType !== '工艺看板'">
      <el-tab-pane :label="$t(`msg['方案管理']`)" name="方案管理">
        <el-row class="px-3 mb-3">
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-card v-loading="visible.planLoading" v-show="planId" class="tab-card px-3">
              <el-form :inline="false" size="medium" label-width="120px" ref="schemeForm">
                <el-form-item :label="$t(`msg['方案名称']`)">
                  <el-input :placeholder="$t(`msg['方案名称']`)" v-model="schemeForm.planName"></el-input>
                </el-form-item>
                <el-form-item :label="$t(`msg['方案创建人']`)">
                  <el-input :placeholder="$t(`msg['方案创建人']`)" v-model="schemeForm.creator" disabled></el-input>
                </el-form-item>
                <el-form-item label="方案创建人ID" class="hidden">
                  <el-input placeholder="方案创建人ID" v-model="schemeForm.creatorId" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t(`msg['方案创建人时间']`)">
                  <el-input :placeholder="$t(`msg['方案创建人时间']`)" v-model="schemeForm.createTime" disabled></el-input>
                </el-form-item>
                <el-form-item class="text-right">
                  <el-button type="primary" size="medium" @click="onSaveScheme">{{ $t(`msg['保存']`) }}</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane :label="$t(`msg['轮播图']`)" name="轮播图" v-if="boardType === '宣传看板'">
        <slideshow-config v-if="this.tabIsLoaded['轮播图']" :reload="randNum" :plan-id="planId"></slideshow-config>
      </el-tab-pane>
      <el-tab-pane :label="$t(`msg['左上区']`)" name="左上区" v-else>
        <chartshow-config v-if="this.tabIsLoaded['左上区']" 
          :plan-id="planId" position="左上区" :board-type="boardType" :form-names="reportFormNames" :reload="randNum"></chartshow-config>
      </el-tab-pane>

      <el-tab-pane :label="$t(`msg['视频']`)" name="视频" v-if="boardType === '宣传看板'">
        <videoshow-config v-if="this.tabIsLoaded['视频']" :reload="randNum" :plan-id="planId"></videoshow-config>
      </el-tab-pane>
      <el-tab-pane :label="$t(`msg['右上区']`)" name="右上区" v-else>
        <chartshow-config v-if="this.tabIsLoaded['右上区']" 
          :plan-id="planId" position="右上区" :board-type="boardType" :form-names="reportFormNames" :reload="randNum"></chartshow-config>
      </el-tab-pane>

      <el-tab-pane :label="$t(`msg['左下区']`)" name="左下区">
        <chartshow-config v-if="this.tabIsLoaded['左下区']" 
          :plan-id="planId" position="左下区" :board-type="boardType" :form-names="reportFormNames" :reload="randNum"></chartshow-config>
      </el-tab-pane>

      <el-tab-pane :label="$t(`msg['右下区']`)" name="右下区">
        <chartshow-config v-if="this.tabIsLoaded['右下区']" 
          :plan-id="planId" position="右下区" :board-type="boardType" :form-names="reportFormNames" :reload="randNum"></chartshow-config>
      </el-tab-pane>
    </el-tabs>

    <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick" v-else>
      <el-tab-pane :label="$t(`msg['方案管理']`)" name="方案管理">
        <el-row class="px-3 mb-3">
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-card v-loading="visible.planLoading" v-show="planId" class="tab-card px-3">
              <el-form :inline="false" size="medium" label-width="120px" ref="schemeForm">
                <el-form-item :label="$t(`msg['方案名称']`)">
                  <el-input :placeholder="$t(`msg['方案名称']`)" v-model="schemeForm.planName"></el-input>
                </el-form-item>
                <el-form-item :label="$t(`msg['方案创建人']`)">
                  <el-input :placeholder="$t(`msg['方案创建人']`)" v-model="schemeForm.creator" disabled></el-input>
                </el-form-item>
                <el-form-item label="方案创建人ID" class="hidden">
                  <el-input placeholder="方案创建人ID" v-model="schemeForm.creatorId" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t(`msg['方案创建人时间']`)">
                  <el-input :placeholder="$t(`msg['方案创建人时间']`)" v-model="schemeForm.createTime" disabled></el-input>
                </el-form-item>
                <el-form-item class="text-right">
                  <el-button type="primary" size="medium" @click="onSaveScheme">{{ $t(`msg['保存']`) }}</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      
      <!-- 工艺看板配置 -->
      <el-tab-pane :label="$t('msg[\'' + craftTabName + '\']')" name="工艺看板" v-if="boardType === '工艺看板'">
        <el-row class="px-3">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item :label="$t(`msg['选择看板内容']`)">
              <el-radio-group v-model="craftBoardContentTypeValue" @change="handleSelectCraftContentType">
                <el-radio label="video">{{ $t(`msg['视频']`) }}</el-radio>
                <el-radio label="picture">{{ $t(`msg['轮播图']`) }}</el-radio>
                <el-radio label="pdf">pdf</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-row>
        
        <div v-if="this.tabIsLoaded['工艺看板']">
          <videoshow-config :reload="randNum" v-show="craftBoardContentTypeValue === 'video'" :plan-id="planId"></videoshow-config>
          <slideshow-config :reload="randNum" v-show="craftBoardContentTypeValue === 'picture'" :plan-id="planId"></slideshow-config>
          <pdfshow-config :reload="randNum" v-show="craftBoardContentTypeValue === 'pdf'" :plan-id="planId" :roll-time="pdfScrollTime"></pdfshow-config>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加方案弹窗 -->
    <el-dialog :visible.sync="visible.addSchemeDialog" :title="$t(`msg['新增方案']`)" width="40%">
      <el-form :inline="false" :model="schemeAddForm" :rules="schemAddRules" size="medium" label-width="120px" ref="schemeAddForm">
        <el-form-item :label="$t(`msg['看板类型']`)">
          <el-input :placeholder="$t(`msg['看板类型']`)" v-model="boardType" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t(`msg['方案名称']`)">
          <el-input :placeholder="$t(`msg['方案名称']`)" v-model.trim="schemeAddForm.planName"></el-input>
        </el-form-item>
        <el-form-item :label="$t(`msg['方案创建人']`)">
          <el-input :placeholder="$t(`msg['方案创建人']`)" v-model="schemeAddForm.creator" disabled></el-input>
        </el-form-item>
        <el-form-item label="方案创建人ID" class="hidden">
          <el-input placeholder="方案创建人ID" v-model="schemeAddForm.creatorId" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="visible.addSchemeDialog = false">{{ $t(`msg['取消']`) }}</el-button>
        <el-button size="medium" type="primary" @click="onAddScheme">{{ $t(`msg['确定']`) }}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import {
    queryWorkOrderOutline, queryReportForm,
    queryBoardPlan, modifyBoardPlan,
    saveBoardPlan, removeBoardPlan,
    uploadBillboardVedioUrl, synchronizationBillboardScheme,
    queryBillboardType, saveBillboardMediaType
    } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'
  import SlideshowConfig from './components/SlideshowConfig.vue'
  import VideoshowConfig from './components/VideoshowConfig.vue'
  import ChartshowConfig from './components/ChartshowConfig.vue'
  import PdfshowConfig from './components/PdfshowConfig.vue'

  export default {
    name: 'display-board-config',
    data () {
      return {
        boardType: '',  // 当前看板类型
        planId: '', // 当前选择计划的id
        tabActiveName: '方案管理',  // 当前激活的tab名字
        tabIsLoaded: {  // 记录哪一个tab是被点击加载过的，避免重复加载
          '方案管理': false,
          '轮播图': false,
          '工艺看板': false,
          '左上区': false,
          '视频': false,
          '右上区': false,
          '左下区': false,
          '右下区': false
        },
        boardPlans: [], // 所有的看板计划
        schemeModel: {},
        // 方案管理表单
        schemeForm: {
          planId: '',
          planType: '',     // 方案类型
          planName: '',     // 方案名称
          lastPlanName: '', // 记录之前的方案名称
          creator: '',     // 方案创建人
          creatorId: '',
          createTime: ''   // 方案创建时间
        },
        // 新增方案管理表单
        schemeAddForm: {
          planType: '',
          planName: '',
          creator: '',
          creatorId: ''
        },
        schemAddRules: {
          planName: { required: true, message: '请输入名称', trigger: 'blur' }
        },
        videoFilters: {
          keyword: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        videoList: [],  // 视频列表
        videoSelectedIds: [],  // 已选中视频
        visible: {
          addSchemeDialog: false,
          planLoading: false,
        },
        randNum: 0, // 通过随机数去触发子组件更新
        boardAreaCharts: [],
        reportFormNames: [], // 报表类型，所有区域共享
        craftTabName: '视频', // 工艺看板选中的名字
        craftBoardContentTypeValue: 'video',
        craftBoardContentTypeList: [ // 工艺看板内容列表
          {id: 1, label: '视频', value: 'video'},
          {id: 2, label: '轮播图', value: 'picture'},
          {id: 3, label: 'pdf', value: 'pdf'}
        ],
        pdfScrollTime: 20
      }
    },
    components: { SlideshowConfig, VideoshowConfig, ChartshowConfig, PdfshowConfig },
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
      }
    },
    mounted () {
      this.boardType = this.$route.meta.type
      this.initPage()
      this.tabIsLoaded[this.tabActiveName] = true
    },
    methods: {
      ...mapActions(['initWorkstageList', 'initWorkshopList']),
      // 初始化整个页面
      initPage (initBoardPlan) {
        // 所有tab都初始化成未加载
        for (let key in this.tabIsLoaded) {
          this.tabIsLoaded[key] = false
        }
        // 工艺看板媒体类型初始化
        this.initCraftMediaType()

        // 加载当前tab的数据，组件
        this.$nextTick(() => {
          this.handleTabClick({name: this.tabActiveName})
        })
        if (initBoardPlan === false) {
          this.getSchemeInfo()
        } else {
          this.clearData()
          this.getBoardPlan().then(this.getSchemeInfo)
        }
        this.getReportFormNames().then(() => {})
      },
      // 获取所有看板计划
      getBoardPlan () {
        this.visible.planLoading = true
        return new Promise((resolve, reject) => {
          queryBoardPlan({ type: 'info', headNum: 1}).then(res => {
            if (res.status === 0) {
              this.boardPlans = res.map.boardPlans
              // 默认选中第一个
              this.$nextTick(() => {
                if (this.getBoardList.length > 0) {
                  this.planId = this.getBoardList[0].value
                }
                // 工艺看板媒体类型初始化
                this.initCraftMediaType()
              })
            } else {
              this.boardPlans = []
              this.visible.planLoading = false
            }
            resolve()
          }).catch(() => {
            this.visible.planLoading = false
            this.boardPlans = []
            this.clearData()
            reject()
          })
        })
      },
      // 获取当前方案信息
      getSchemeInfo () {
        if (this.planId !== '') {
          let params = {
            type: 'boardPlanConfigures',
            planId: this.planId,
            headNum: 1
          }
          queryBoardPlan(params).then(res => {
            this.visible.planLoading = false
            if (res.status === 0) {
              // 初始化方案表单
              this.schemeForm = {
                planId: this.planId,
                planType: this.boardType,
                planName: res.map.boardPlan.board_plan_name,
                lastPlanName: res.map.boardPlan.board_plan_name,
                creator: res.map.boardPlan.board_plan_creator,
                creatorId: res.map.boardPlan.board_plan_creator_id,
                createTime: utils.formatDate.format(new Date(res.map.boardPlan.board_plan_create_time), 'yyyy-MM-dd hh:mm:ss'),
              }
              // 初始化选择的视频，图片
              res.map.pictureList.forEach(item => {
                this.imgSelectedIds.push(item.img_id)
              })
              if (res.map.vedioList && res.map.vedioList.length > 0) {
                this.videoSelectedIds = [res.map.vedioList[0].billboard_vedio_id]
              } else {
                this.videoSelectedIds = ''
              }
              this.boardAreaCharts = res.map.boardPlan.boardAreaCharts || []
              // 如果是工艺看板，并且选择了pdf，会有滚动时间
              if (res.map.pdfList && res.map.pdfList.length > 0) {
                this.pdfScrollTime = res.map.pdfList[0].pdf_roll_time
              } else {
                this.pdfScrollTime = 20
              }
            } else {
              this.boardPlans = []
            }
          }).catch(() => {
            this.visible.planLoading = false
          })
        }
      },
      // 工艺看板媒体类型初始化
      initCraftMediaType () {
        if (this.boardType === '工艺看板' && this.planId !== '') {
          queryBillboardType({planId: this.planId}).then(res => {
            if (res.status === 0) {
              this.craftBoardContentTypeValue = res.map.billboardCraft.billboard_madirtype_type
              this.craftBoardContentTypeList.forEach(item => {
                if (item.value === this.craftBoardContentTypeValue) {
                  this.craftTabName = item.label
                }
              })
            }
            // 触发看板子组件列表更新
            this.$nextTick(() => {
              this.randNum = Math.random()
            })
          })
        }
      },
      // 获取报表类型
      getReportFormNames () {
        return new Promise((resolve, reject) => {
          queryReportForm({ type: this.boardType, headNum: 1 }).then(res => {
            if (res.status === 0) {
              this.reportFormNames = res.map.boardTypes
              resolve()
            } else {
              this.reportFormNames = []
            }
          })
        })
      },
      // 修改方案
      onSaveScheme () {
        if (this.schemeForm.planName === this.schemeForm.lastPlanName) {
          this.$message.info('没有修改')
        } else {
          this.schemeForm.lastPlanName = this.schemeForm.planName
          modifyBoardPlan(this.schemeForm).then(res => {
            if (res.status === 0) {
              this.$message.success('修改成功')
              this.boardPlans.forEach(item => {
                if (item.board_plan_id === this.planId) {
                  item.board_plan_name = this.schemeForm.planName
                }
              })
            } else {
              this.$message.error(res.msg || '修改失败')
            }
          })
        }
      },
      // 添加方案
      addScheme () {
        this.visible.addSchemeDialog = true
        this.schemeAddForm.planType = this.boardType
        this.schemeAddForm.planName = ''
        this.schemeAddForm.creator = this.getUser.userName
        this.schemeAddForm.creatorId = this.getUser.userId
      },
      // 新增方案
      onAddScheme () {
        if (this.schemeAddForm.planName === '') {
          this.$message.info('名称不能为空')
        } else {
          this.$refs['schemeAddForm'].validate((valid) => {
            if (valid) {
              let data = {
                board_plan_type: this.schemeAddForm.planType,
                board_plan_name: this.schemeAddForm.planName,
                board_plan_creator: this.schemeAddForm.creator,
                board_plan_creator_id: this.schemeAddForm.creatorId,
                board_plan_create_time: ''
              }
              let submitData = {
                'boardPlan': JSON.stringify(data),
                'areaChart': '',
                'boardAxis': ''
              }
              saveBoardPlan(submitData).then(res => {
                if (res.status === 0) {
                  this.visible.addSchemeDialog = false
                  this.$message.success('新增成功')
                  this.$refs['schemeAddForm'].resetFields()
                  this.initPage()
                } else {
                  this.$message.error(res.msg || '新增失败')
                }
              })
            } else {
              return false
            }
          })
        }
      },
      // 移除方案
      removeScheme () {
        this.$confirm('是否删除该方案？', {
          title: '提示',
          type: 'warning'
        }).then(action => {
          if (action === 'confirm') {
            removeBoardPlan({ planId: this.planId }).then(res => {
              if (res.status === 0) {
                this.$message.success('删除成功')
                this.initPage()
              } else {
                this.$message.warning(res.msg || '删除失败')
              }
            })
          }
        }).catch(() => {})
      },
      clearData () {
        this.planId = ''
        this.imgList = []
        this.imgSelectedIds = []
        this.videoList = []
        this.videoSelectedIds = []
      },
      // 同步方案
      handleSynchronize () {
        synchronizationBillboardScheme({billboardId: this.planId}).then(res => {
          if (res.status === 0) {
            this.$message.success('成功')
          } else {
            this.$message.warning(res.msg || '失败')
          }
        })
      },
      // 标签切换
      handleTabClick (tab) {
        // console.log(tab.name)
        if (!this.tabIsLoaded[tab.name]) {
          this.$nextTick(() => {
            this.randNum = Math.random()
          })
        }
        this.tabIsLoaded[tab.name] = true
      },
      // 选择媒体类型
      handleSelectCraftContentType () {
        this.craftBoardContentTypeList.forEach(item => {
          if (item.value === this.craftBoardContentTypeValue) {
            this.craftTabName = item.label
          }
        })
        // 保存选中的媒体类型
        saveBillboardMediaType({planId: this.planId, mediaType: this.craftBoardContentTypeValue}).then(res => {
          if (res.status === 0) {
            this.$message.success('已保存')
          } else {
            this.$message.error('保存失败')
          }
        })
      }
    },
    watch: {
      '$route' (val) {
        this.boardType = val.meta.type
        this.tabActiveName = '方案管理'
        this.initPage()
      }
    }
  }
</script>

<style scoped lang="scss">
.tab-card {
  min-height: 300px;
}
</style>
