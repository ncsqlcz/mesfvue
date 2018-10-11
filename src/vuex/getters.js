// 获取 locale,控制语言切换
export const getLocale = state => {
  state.locale = localStorage.getItem('locale') || 'zh_CN'
  return state.locale
}
// 获取 user
export const getUser = state => {
  state.user = JSON.parse(sessionStorage.getItem('user')) || {}
  return state.user
}
// 获取 token
export const getToken = state => {
  state.token = localStorage.getItem('token') || ''
  return state.token
}
// 获取 routes
export const getRoutes = state => {
  // state.routes = JSON.parse(localStorage.getItem('routes')) || []
  return state.routes
}
// 获取 returnPath
export const getReturnPath = state => {
  state.token = sessionStorage.getItem('returnPath') || ''
  return state.returnPath
}
// 设备类型
export const getDeviceTypes = state => {
  return state.deviceTypes
}
// 仓库名称
export const warehouseName = state => {
  return state.warehouseName
}
// 成品型号
export const productModel = state => {
  return state.productModel
}
// 成品类型
export const productTypes = state => {
  return state.productTypes
}
// 生产状态
export const getProductionStatusList = state => {
  return state.productionStatusList
}
// 工序
export const getWorkstageList = state => {
  return state.workstageList
}
// 车间
export const getWorkshopList = state => {
  return state.workshopList
}
// 参数值类型
export const getParamValueTypeList = state => {
  return state.paramValueTypeList
}
// 常用电压单位
export const voltageUnit = state => {
  return state.voltageUnit
}
// 常用电流单位
export const currentUnit = state => {
  return state.voltageUnit
}
// 常用电阻单位
export const resistanceUnit = state => {
  return state.resistanceUnit
}
// 常用重量单位
export const weightUnit = state => {
  return state.weightUnit
}
// 常用温度单位
export const temperatureUnit = state => {
  return state.temperatureUnit
}
// 常用尺寸单位
export const sizeUnit = state => {
  return state.sizeUnit
}
// 速率单位
export const rateUnit = state => {
  return state.rateUnit
}
// 容量单位
export const capacityUnit = state => {
  return state.capacityUnit
}
// 设备状态类型
export const getDeviceStatusList = state => {
  return state.deviceStatusList
}
// 极性
export const getPolarityList = state => {
  return state.polarityList
}
// 审核状态
export const getAuditStatusDict = state => {
  return state.auditStatusDict
}
