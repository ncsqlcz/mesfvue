import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
Vue.use(Vuex)

// 应用初始状态
const state = {
  locale: 'zh_CN',
  token: localStorage.getItem('token') || '',   // 保存服务器给的token
  returnPath: sessionStorage.returnPath || '',  // 重新登录之后返回的url
  routes: [],                                   // 所有的路由信息
  user: null,                                   // 用户基本信息
  visible: {
  },                                           // 全局控制显示、隐藏
  productTypes: [],                             // 成品类型
  deviceTypes: [],                              // 设备类型
  warehouseName: [],                            // 仓库管理
  productModel: [],                             // 成品型号
  workstageList: [],                            // 工序
  workshopList: [],                             // 车间
  productionStatusList: [                       // 生产状态
    {label: '未生产', value: '0', type: 'noProduction'},
    {label: '生产中', value: '1', type: 'inProduction'},
    {label: '已暂停', value: '2', type: 'pause'},
    {label: '已完成', value: '3', type: 'complete'},
    {label: '已停止', value: '4', type: 'stop'}
  ],
  paramValueTypeList: [                         // 参数值类型
    {label: '固定值', value: 'constantValue'},
    {label: '范围值', value: 'rangeValue'},
    {label: '浮动值', value: 'deviationValue'}
  ],
  voltageUnit: ['V', 'kV', 'mV', 'μV'],         // 常用电压单位
  currentUnit: ['A', 'kA', 'mA', 'μA'],         // 常用电流单位
  resistanceUnit: ['Ω', 'kΩ', 'MΩ', 'GΩ'],       // 常用电阻单位
  weightUnit: ['g', 'mg', 'kg'],                 // 常用重量单位
  temperatureUnit: ['℃', '℉'],                 // 常用温度单位
  sizeUnit: ['cm', 'mm', 'dm', 'm', 'km', 'μm'], // 常用尺寸单位
  rateUnit: ['%', '‰'],                         // 速率单位
  capacityUnit: ['mAh', 'Ah'],                  // 容量单位
  polarityList: [                               // 极性
    {label: '无极性', value: '无极性'},
    {label: '正极', value: '正极'},
    {label: '负极', value: '负极'}
  ],
  deviceStatusList: [],                          // 设备状态类型
  auditStatusDict: {                             // 审核状态
    '0': '未审核',
    '1': '等待审核',
    '2': '审核未通过',
    '3': '审核通过',
    '4': '等待审核（关闭）',
    '5': '审核未通过（关闭生产计划）',
    '6': '审核通过（关闭生产计划）'
  }
}

// 创建 store 实例
const store = new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})

export default store
