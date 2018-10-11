import axios from 'axios'
import store from '../vuex/store'
import { MessageBox } from 'element-ui'
import qs from 'qs'
import {
  base,
  wareHouseBase
} from './base.js'

// 重构的仓储管理接口
import * as warehouse from './warehouse'

// 带cookie请求
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// request 请求拦截器 - 请求之前headers加token
axios.interceptors.request.use(
  config => {
    // 登录不用加token
    // 每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
    if (config.url.indexOf('/tokens') < 0 && store.state.token) {
      config.headers.Authorization = `Bearer ${store.state.token}`
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// response 错误统一处理
axios.interceptors.response.use(
  res => {
    if (res.data.status === 9) {
      localStorage.removeItem('token')
      MessageBox.alert(
        window.i18n._vm._data.messages[window.i18n._vm._data.locale]['msg'].ReLoginTips,
        window.i18n._vm._data.messages[window.i18n._vm._data.locale]['msg'].Tips, {
          type: 'warning',
          confirmButtonText: window.i18n._vm._data.messages[window.i18n._vm._data.locale]['msg'].ReLogin
        }).then(() => {
          window.location.href = '/login'
        })
      return Promise.reject(res)
    }
    return res
  },
  err => {
    // console.log(err)
    MessageBox.alert(
      window.i18n._vm._data.messages[window.i18n._vm._data.locale]['msg'].NetworkError,
      window.i18n._vm._data.messages[window.i18n._vm._data.locale]['msg'].Tips, {
        type: 'error',
        closeOnClickModal: true,
        closeOnPressEscape: true
      }).then(() => {})
    return Promise.reject(err)
  }
)

/* 登录 start */
export const toLogin = params => { return axios.post(`${base}/toLogin.do`, qs.stringify(params)).then(res => res.data) }
export const queryUserFunctions = params => { return axios.post(`${base}/queryUserFunctions.do`, qs.stringify(params)).then(res => res.data) }
export const queryWithoutPermission = params => { return axios.post(`${base}/queryWithoutPermission.do`, qs.stringify(params)).then(res => res.data) }
/* 登录 end */

/* 系统管理 start */
export const getStaffList = params => { return axios.post(`${base}/queryStaff.do`, qs.stringify(params)).then(res => res.data) }
export const saveStaff = params => { return axios.post(`${base}/saveStaff.do`, qs.stringify(params)).then(res => res.data) }
export const editStaff = params => { return axios.post(`${base}/modifyStaff.do`, qs.stringify(params)).then(res => res.data) }
export const removeStaff = params => { return axios.post(`${base}/removeStaff.do`, qs.stringify(params)).then(res => res.data) }
export const saveUser = params => { return axios.post(`${base}/saveUser.do`, qs.stringify(params)).then(res => res.data) }
export const removeUser = params => { return axios.post(`${base}/removeUsers.do`, qs.stringify(params)).then(res => res.data) }
export const getPostList = params => { return axios.post(`${base}/queryPost.do`, qs.stringify(params)).then(res => res.data) }
export const savePost = params => { return axios.post(`${base}/savePost.do`, qs.stringify(params)).then(res => res.data) }
export const editPost = params => { return axios.post(`${base}/modifyPost.do`, qs.stringify(params)).then(res => res.data) }
export const removePost = params => { return axios.post(`${base}/removePost.do`, qs.stringify(params)).then(res => res.data) }
export const queryFunction = params => { return axios.post(`${base}/queryFunction.do`, qs.stringify(params)).then(res => res.data) }
export const removeFunction = params => { return axios.post(`${base}/removeFunction.do`, qs.stringify(params)).then(res => res.data) }
export const addFunctions = params => { return axios.post(`${base}/addFunctions.do`, qs.stringify(params)).then(res => res.data) }
export const addWorkshops = params => { return axios.post(`${base}/addWorkshops.do`, qs.stringify(params)).then(res => res.data) }
export const modifyWorkshop = params => { return axios.post(`${base}/modifyWorkshop.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkshop = params => { return axios.post(`${base}/saveWorkshop.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkshop = params => { return axios.post(`${base}/removeWorkshop.do`, qs.stringify(params)).then(res => res.data) }
export const queryProductLines = params => { return axios.post(`${base}/queryProductLines.do`, qs.stringify(params)).then(res => res.data) }
export const queryTeamStaff = params => { return axios.post(`${base}/queryTeamStaff.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkShopInfos = params => { return axios.post(`${base}/queryWorkShopInfos.do`, qs.stringify(params)).then(res => res.data) }
export const modifyProductLines = params => { return axios.post(`${base}/modifyProductLines.do`, qs.stringify(params)).then(res => res.data) }
export const saveProductLines = params => { return axios.post(`${base}/saveProductLines.do`, qs.stringify(params)).then(res => res.data) }
export const removeProductLines = params => { return axios.post(`${base}/removeProductLines.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkstageBasics = params => { return axios.post(`${base}/queryWorkstageBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryTeamPost = params => { return axios.post(`${base}/queryTeamPost.do`, qs.stringify(params)).then(res => res.data) }
export const removeTeamPost = params => { return axios.post(`${base}/removeTeamPost.do`, qs.stringify(params)).then(res => res.data) }
export const addPost = params => { return axios.post(`${base}/addPost.do`, qs.stringify(params)).then(res => res.data) }
export const removeTeamStaff = params => { return axios.post(`${base}/removeTeamStaff.do`, qs.stringify(params)).then(res => res.data) }
export const addStaff = params => { return axios.post(`${base}/addStaff.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkShopWorkstages = params => { return axios.post(`${base}/removeWorkShopWorkstages.do`, qs.stringify(params)).then(res => res.data) }
export const addWorkShopWorkstages = params => { return axios.post(`${base}/addWorkShopWorkstages.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkshops = params => { return axios.post(`${base}/saveWorkshops.do`, qs.stringify(params)).then(res => res.data) }
export const queryUserLoginRecord = params => { return axios.post(`${base}/queryUserLoginRecord.do`, qs.stringify(params)).then(res => res.data) }
export const modifyUserPassword = params => { return axios.post(`${base}/modifyUserPassword.do`, qs.stringify(params)).then(res => res.data) }
export const queryStaffInformation = params => { return axios.post(`${base}/queryStaffInformation.do`, qs.stringify(params)).then(res => res.data) }
export const modifyPasswordOrUndo = params => { return axios.post(`${base}/modifyPasswordOrUndo.do`, qs.stringify(params)).then(res => res.data) }

// 班次列表
export const getShiftList = params => { return axios.post(`${base}/queryClasses.do`, qs.stringify(params)).then(res => res.data) }
// 新增班次
export const addShift = params => { return axios.post(`${base}/saveClasses.do`, qs.stringify(params)).then(res => res.data) }
// 编辑班次
export const editShift = params => { return axios.post(`${base}/modifyClasses.do`, qs.stringify(params)).then(res => res.data) }
// 删除班次
export const removeShift = params => { return axios.post(`${base}/removeClasses.do`, qs.stringify(params)).then(res => res.data) }
// 删除班次员工表
export const removeClassStaff = params => { return axios.post(`${base}/removeClassStaff.do`, qs.stringify(params)).then(res => res.data) }
// 新增班次员工表
export const addClassStaff = params => { return axios.post(`${base}/saveClassStaff.do`, qs.stringify(params)).then(res => res.data) }
// 更改班次员工表
export const changeClassStaff = params => { return axios.post(`${base}/changeClassStaff.do`, qs.stringify(params)).then(res => res.data) }
// 产线
// export const queryProductLines = params => { return axios.post(`${base}/queryProductLines.do`, qs.stringify(params)).then(res => res.data) }
// 工序
// export const queryWorkstageBasics = params => { return axios.post(`${base}/queryWorkstageBasics.do`, qs.stringify(params)).then(res => res.data) }

/* 系统管理 end */

/* 设备管控 start */
export const getDeviceParametersList = params => { return axios.post(`${base}/getDeviceParameters.do`, qs.stringify(params)).then(res => res.data) } // 获取设备实时采集的参数
export const getHistoryParameters = params => { return axios.post(`${base}/getHistoryParameters.do`, qs.stringify(params)).then(res => res.data) } // 获取设备历史采集的参数
export const queryDeviceTypes = params => { return axios.post(`${base}/queryDevicesTypes.do`, qs.stringify(params)).then(res => res.data) } // 获取设备类型
export const queryDevices = params => { return axios.post(`${base}/queryDevices.do`, qs.stringify(params)).then(res => res.data) } // 获取设备基础信息
export const saveDevicesTypeInfo = params => { return axios.post(`${base}/saveDevicesTypeInfo.do`, qs.stringify(params)).then(res => res.data) } // 新增设备类型
export const modifyDevicesInfo = params => { return axios.post(`${base}/modifyDevicesInfo.do`, qs.stringify(params)).then(res => res.data) } // 修改设备类型
export const removeDevicesInfo = params => { return axios.post(`${base}/removeDevicesInfo.do`, qs.stringify(params)).then(res => res.data) } // 删除设备类型
export const queryIPCAll = params => { return axios.post(`${base}/queryIPCAll.do`, qs.stringify(params)).then(res => res.data) } // 获取工共机ip
export const saveDevicesLedgerInfo = params => { return axios.post(`${base}/saveDevicesLedgerInfo.do`, qs.stringify(params)).then(res => res.data) } // 新增设备
export const removeDevicesLedgerInfo = params => { return axios.post(`${base}/removeDevicesLedgerInfo.do`, qs.stringify(params)).then(res => res.data) } // 删除设备
export const modifyDevicesLedgerInfo = params => { return axios.post(`${base}/modifyDevicesLedgerInfo.do`, qs.stringify(params)).then(res => res.data) } // 修改设备
export const saveDevicesCheck = params => { return axios.post(`${base}/saveDevicesCheck.do`, qs.stringify(params)).then(res => res.data) } // 新增点检表
export const queryCheckPlan = params => { return axios.post(`${base}/queryCheckPlan.do`, qs.stringify(params)).then(res => res.data) } // 查询点检设备
export const queryUpkeepPlans = params => { return axios.post(`${base}/queryUpkeepPlans.do`, qs.stringify(params)).then(res => res.data) } // 查询保养记录
export const queryDevicesMalfunction = params => { return axios.post(`${base}/queryDevicesMalfunction.do`, qs.stringify(params)).then(res => res.data) } // 查询故障记录
export const saveUpkeepPlan = params => { return axios.post(`${base}/saveUpkeepPlan.do`, qs.stringify(params)).then(res => res.data) } // 新建保养计划
export const saveUpkeepProject = params => { return axios.post(`${base}/saveUpkeepProject.do`, qs.stringify(params)).then(res => res.data) } // 新建保养指导项目
export const modifyUpkeepProject = params => { return axios.post(`${base}/modifyUpkeepProject.do`, qs.stringify(params)).then(res => res.data) } // 修改保养指导项目
export const saveMalfunctionRecordInfo = params => { return axios.post(`${base}/saveMalfunctionRecordInfo.do`, qs.stringify(params)).then(res => res.data) } // 新建故障记录
export const modifyMalfunctionRecordInfo = params => { return axios.post(`${base}/modifyMalfunctionRecordInfo.do`, qs.stringify(params)).then(res => res.data) } // 修改故障记录
export const removeMalfunctionRecordInfo = params => { return axios.post(`${base}/removeMalfunctionRecordInfo.do`, qs.stringify(params)).then(res => res.data) } // 删除故障记录
export const saveDevicesEntrys = params => { return axios.post(`${base}/saveDevicesEntrys.do`, qs.stringify(params)).then(res => res.data) } // 新增点检项目
export const saveDevicesException = params => { return axios.post(`${base}/saveDevicesException.do`, qs.stringify(params)).then(res => res.data) } // 新增异常记录
export const modifyDevicesEntry = params => { return axios.post(`${base}/modifyDevicesEntry.do`, qs.stringify(params)).then(res => res.data) } // 修改异常记录
export const modifyDevicesException = params => { return axios.post(`${base}/modifyDevicesException.do`, qs.stringify(params)).then(res => res.data) } // 修改点检项目
export const modifyCheckStatus = params => { return axios.post(`${base}/modifyCheckStatus.do`, qs.stringify(params)).then(res => res.data) } // 修改点检状态
export const queryPerHistoryParameters = `${base}/queryPerHistoryParameters.do` // 导出excel
export const exportExcelDevicesInfo = `${base}/exportExcelDevicesInfo.do` // 导出excel
export const queryDevicesTeam = params => { return axios.post(`${base}/queryDevicesTeam.do`, qs.stringify(params)).then(res => res.data) }
export const removeTeamDevices = params => { return axios.post(`${base}/removeTeamDevices.do`, qs.stringify(params)).then(res => res.data) }
export const addTeamDevices = params => { return axios.post(`${base}/addTeamDevices.do`, qs.stringify(params)).then(res => res.data) }

/* 设备管控 end */

/* 仓储管理 start */
export const getWarehouseBasic = params => { return axios.post(`${base}/queryAllMaterials.do`, qs.stringify(params)).then(res => res.data) } // 获取物料信息
export const removeMaterialInfo = params => { return axios.post(`${base}/removeMaterialInfo.do`, qs.stringify(params)).then(res => res.data) } // 删除物料信息
export const queryMaterials = params => { return axios.post(`${base}/queryMaterials.do`, qs.stringify(params)).then(res => res.data) } // 搜索物料信息
export const saveMaterialInfos = params => { return axios.post(`${base}/saveMaterialInfos.do`, qs.stringify(params)).then(res => res.data) } // 添加物料信息
export const modifyMaterialInfo = params => { return axios.post(`${base}/modifyMaterialInfo.do`, qs.stringify(params)).then(res => res.data) }  // 编辑物料信息
export const querySuppliers = params => { return axios.post(`${base}/querySuppliers.do`, qs.stringify(params)).then(res => res.data) } // 加载供应商信息
export const saveSupplier = params => { return axios.post(`${base}/saveSupplier.do`, qs.stringify(params)).then(res => res.data) } // 添加供应商信息
export const removeSuppliers = params => { return axios.post(`${base}/removeSuppliers.do`, qs.stringify(params)).then(res => res.data) } // 删除 供应商信息
export const modifySuppliers = params => { return axios.post(`${base}/modifySuppliers.do`, qs.stringify(params)).then(res => res.data) } // 编辑 供应商信息
export const queryMaterialInventory = params => { return axios.post(`${base}/queryMaterialInventory.do`, qs.stringify(params)).then(res => res.data) } // 获取物料登记信息
export const removeMaterialRecords = params => { return axios.post(`${base}/removeMaterialRecords.do`, qs.stringify(params)).then(res => res.data) } // 删除物料登记信息
export const saveMaterialRecords = params => { return axios.post(`${base}/saveMaterialRecords.do`, qs.stringify(params)).then(res => res.data) } // 添加物料登记信息
export const saveMaterialEntrys = params => { return axios.post(`${base}/saveMaterialEntrys.do`, qs.stringify(params)).then(res => res.data) } // 添加物料入库信息
export const removeMaterialEntrys = params => { return axios.post(`${base}/removeMaterialEntrys.do`, qs.stringify(params)).then(res => res.data) } // 删除物料入库信息
export const removeMaterialOuts = params => { return axios.post(`${base}/removeMaterialOuts.do`, qs.stringify(params)).then(res => res.data) } // 删除物料出库信息
export const removeMaterialReturns = params => { return axios.post(`${base}/removeMaterialReturns.do`, qs.stringify(params)).then(res => res.data) } // 删除物料退还信息
export const saveMaterialOuts = params => { return axios.post(`${base}/saveMaterialOuts.do`, qs.stringify(params)).then(res => res.data) } // 添加物料出库信息
export const saveMaterialReturns = params => { return axios.post(`${base}/saveMaterialReturns.do`, qs.stringify(params)).then(res => res.data) } // 添加物料退还信息
export const queryProductInfos = params => { return axios.post(`${base}/queryProductInfos.do`, qs.stringify(params)).then(res => res.data) } // 成品信息
export const removeProductInfos = params => { return axios.post(`${base}/removeProductInfos.do`, qs.stringify(params)).then(res => res.data) } // 删除成品信息
export const queryProductModels = params => { return axios.post(`${base}/queryProductModels.do`, qs.stringify(params)).then(res => res.data) } // 成品型号
export const saveProductInfos = params => { return axios.post(`${base}/saveProductInfos.do`, qs.stringify(params)).then(res => res.data) } // 添加成品信息
export const modifyProductInfo = params => { return axios.post(`${base}/modifyProductInfo.do`, qs.stringify(params)).then(res => res.data) } // 编辑 成品信息
export const queryProductInventorys = params => { return axios.post(`${base}/queryProductInventorys.do`, qs.stringify(params)).then(res => res.data) } // 成品库存信息
export const queryProductEntrys = params => { return axios.post(`${base}/queryProductEntrys.do`, qs.stringify(params)).then(res => res.data) } // 成品入库信息
export const removeProductEntrys = params => { return axios.post(`${base}/removeProductEntrys.do`, qs.stringify(params)).then(res => res.data) } // 移除成品入库信息
export const saveProductEntrys = params => { return axios.post(`${base}/saveProductEntrys.do`, qs.stringify(params)).then(res => res.data) } // 添加成品入库信息
export const queryProductOuts = params => { return axios.post(`${base}/queryProductOuts.do`, qs.stringify(params)).then(res => res.data) } // 成品出库信息
export const removeProductOuts = params => { return axios.post(`${base}/removeProductOuts.do`, qs.stringify(params)).then(res => res.data) } // 删除成品出库信息
export const saveProductOuts = params => { return axios.post(`${base}/saveProductOuts.do`, qs.stringify(params)).then(res => res.data) } // 添加成品出库信息
export const removeMaterialChecks = params => { return axios.post(`${base}/removeMaterialChecks.do`, qs.stringify(params)).then(res => res.data) } // 移除仓库盘点信息
export const saveMaterialChecks = params => { return axios.post(`${base}/saveMaterialChecks.do`, qs.stringify(params)).then(res => res.data) } // 添加仓库盘点信息
export const removeMaterialTransfers = params => { return axios.post(`${base}/removeMaterialTransfers.do`, qs.stringify(params)).then(res => res.data) } // 删除仓库调拨信息
export const saveMaterialTransfers = params => { return axios.post(`${base}/saveMaterialTransfers.do`, qs.stringify(params)).then(res => res.data) } // 添加仓库调拨信息
export const getSupplierList = params => { return axios.post(`${base}/querySuppliers.do`, qs.stringify(params)).then(res => res.data) } // 查询供应商
export const getWarehouseList = params => { return axios.post(`${base}/queryWarehouses.do`, qs.stringify(params)).then(res => res.data) } // 仓库列表

/* 仓储管理 end */

/* 工艺管理 start */
// 获取指定工艺版-本下所有的物料信息，如查询出来的物料有相同（id）则去重，但对应的物料数量累加
export const queryCraftBOM = params => { return axios.post(`${base}/queryCraftBOM.do`, qs.stringify(params)).then(res => res.data) }
// 导出工艺指导书，获取工艺下的所有数据详情，导出至Excel表格
export const exportCraftInstructor = `${base}/exportCraftInstructor.do`
// 保存新增工艺数据
export const saveCraft = params => { return axios.post(`${base}/saveCraft.do`, qs.stringify(params)).then(res => res.data) }
// 根据工艺版本id（集合）查询出对应的工艺详情
export const queryCraftParticulars = params => { return axios.post(`${base}/queryCraftParticulars.do`, qs.stringify(params)).then(res => res.data) }
// 查询所有工艺信息（检索条件：产品类型、产线、工艺名称&工艺编号、使用状态、分页）
export const queryCraftOutline = params => { return axios.post(`${base}/queryCraftOutline.do`, qs.stringify(params)).then(res => res.data) }
// 修改该工艺版本的使用状态
export const modifyCraftVersionsStatus = params => { return axios.post(`${base}/modifyCraftVersionsStatus.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftVersions = params => { return axios.post(`${base}/queryCraftVersions.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftBOMParticulars = params => { return axios.post(`${base}/queryCraftBOMParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const saveCraftBOM = params => { return axios.post(`${base}/saveCraftBOM.do`, qs.stringify(params)).then(res => res.data) }
export const modifyCraftBOMStatus = params => { return axios.post(`${base}/modifyCraftBOMStatus.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftUseMaterialMenu = params => { return axios.post(`${base}/queryCraftUseMaterialMenu.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftBasics = params => { return axios.post(`${base}/queryCraftBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryProductModel = params => { return axios.post(`${base}/queryProductModel.do`, qs.stringify(params)).then(res => res.data) }
export const modifyProductModelStatus = params => { return axios.post(`${base}/modifyProductModelStatus.do`, qs.stringify(params)).then(res => res.data) }
export const queryProductTypeAboutModel = params => { return axios.post(`${base}/queryProductTypeAboutModel.do`, qs.stringify(params)).then(res => res.data) }
export const modifyProductTypeStatus = params => { return axios.post(`${base}/modifyProductTypeStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveProductType = params => { return axios.post(`${base}/saveProductType.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftSegmentOutline = params => { return axios.post(`${base}/queryCraftSegmentOutline.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftSegmentBasics = params => { return axios.post(`${base}/queryCraftSegmentBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryStepBasics = params => { return axios.post(`${base}/queryStepBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryStepOutline = params => { return axios.post(`${base}/queryStepOutline.do`, qs.stringify(params)).then(res => res.data) }
export const modifyCraftBasicsStatus = params => { return axios.post(`${base}/modifyCraftBasicsStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveCraftBasics = params => { return axios.post(`${base}/saveCraftBasics.do`, qs.stringify(params)).then(res => res.data) }
export const modifyWorkstageBasicsStatus = params => { return axios.post(`${base}/modifyWorkstageBasicsStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkstageBasics = params => { return axios.post(`${base}/saveWorkstageBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkstageOutline = params => { return axios.post(`${base}/queryWorkstageOutline.do`, qs.stringify(params)).then(res => res.data) }
export const modifyStepBasicsStatus = params => { return axios.post(`${base}/modifyStepBasicsStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveStepBasics = params => { return axios.post(`${base}/saveStepBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryStepBasicsAboutParameter = params => { return axios.post(`${base}/queryStepBasicsAboutParameter.do`, qs.stringify(params)).then(res => res.data) }
export const queryParameterUnits = params => { return axios.post(`${base}/queryParameterUnits.do`, qs.stringify(params)).then(res => res.data) }
export const queryNormParameter = params => { return axios.post(`${base}/queryNormParameter.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftSegmentParticulars = params => { return axios.post(`${base}/queryCraftSegmentParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const saveCraftSegment = params => { return axios.post(`${base}/saveCraftSegment.do`, qs.stringify(params)).then(res => res.data) }
export const modifyCraftSegmentBasicsStatus = params => { return axios.post(`${base}/modifyCraftSegmentBasicsStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveCraftSegmentBasics = params => { return axios.post(`${base}/saveCraftSegmentBasics.do`, qs.stringify(params)).then(res => res.data) }
export const queryCraftSegmentVersions = params => { return axios.post(`${base}/queryCraftSegmentVersions.do`, qs.stringify(params)).then(res => res.data) }
export const queryParameterType = params => { return axios.post(`${base}/queryParameterType.do`, qs.stringify(params)).then(res => res.data) }

/* 工艺管理 end */

/* 生产计划 start */
export const getProductTypeList = params => { return axios.post(`${base}/queryProductType.do`, qs.stringify(params)).then(res => res.data) }
export const getMPlanBatchNumberList = params => { return axios.post(`${base}/queryPlanBatchNumber.do`, qs.stringify(params)).then(res => res.data) }
export const queryDraftPlanOutline = params => { return axios.post(`${base}/queryDraftPlanOutline.do`, qs.stringify(params)).then(res => res.data) }
export const queryPlanParticulars = params => { return axios.post(`${base}/queryPlanParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryPlanProcessParticulars = params => { return axios.post(`${base}/queryPlanProcessParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryPlanEvolveParticulars = params => { return axios.post(`${base}/queryPlanEvolveParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryPlanCheckParticulars = params => { return axios.post(`${base}/queryPlanCheckParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const createQRCodeUrl = `${base}/createQRCode.do`
export const queryFormsBatchNumber = params => { return axios.post(`${base}/queryFormsBatchNumber.do`, qs.stringify(params)).then(res => res.data) }
export const querySemiFinishedProductModel = params => { return axios.post(`${base}/querySemiFinishedProductModel.do`, qs.stringify(params)).then(res => res.data) }

/* 生产计划 end */

/* 生产执行 start */
/* 生产执行 end */

/* 生产过程 start */
export const queryWorkOrderOutline = params => { return axios.post(`${base}/queryWorkOrderOutline.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderParticulars = params => { return axios.post(`${base}/queryWorkOrderParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkstageParticulars = params => { return axios.post(`${base}/queryWorkstageParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderProcessParticulars = params => { return axios.post(`${base}/queryWorkOrderProcessParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryStepParticulars = params => { return axios.post(`${base}/queryStepParticulars.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderMaterialUseRecord = params => { return axios.post(`${base}/queryWorkOrderMaterialUseRecord.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderStepParameteRecord = params => { return axios.post(`${base}/queryWorkOrderStepParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderDevicesOperationRecord = params => { return axios.post(`${base}/queryWorkOrderDevicesOperationRecord.do`, qs.stringify(params)).then(res => res.data) }
export const modifyWorkOrderProductionStatus = params => { return axios.post(`${base}/modifyWorkOrderProductionStatus.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkOrderMaterialUseRecord = params => { return axios.post(`${base}/saveWorkOrderMaterialUseRecord.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkOrderStepParameteRecord = params => { return axios.post(`${base}/saveWorkOrderStepParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderOperatorType = params => { return axios.post(`${base}/queryWorkOrderOperatorType.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkOrderDevicesOperationRecord = params => { return axios.post(`${base}/saveWorkOrderDevicesOperationRecord.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkOrderDevicesOperationRecord = params => { return axios.post(`${base}/removeWorkOrderDevicesOperationRecord.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkOrderMaterialUseRecord = params => { return axios.post(`${base}/removeWorkOrderMaterialUseRecord.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkOrderStepParameteRecord = params => { return axios.post(`${base}/removeWorkOrderStepParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderParameteRecord = params => { return axios.post(`${base}/queryWorkOrderParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
export const removeWorkOrderParameteRecord = params => { return axios.post(`${base}/removeWorkOrderParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
export const saveWorkOrderParameteRecord = params => { return axios.post(`${base}/saveWorkOrderParameteRecord.do`, qs.stringify(params)).then(res => res.data) }
/* 生产过程 end */

/* 质量管控 start */
// 项目类型管理-列表
export const getProjectTypeList = params => { return axios.post(`${base}/queryQualityProjectType.do`, qs.stringify(params)).then(res => res.data) }
// 项目类型管理-新增
export const addProjectTypeList = params => { return axios.post(`${base}/saveQualityProjectType.do`, qs.stringify(params)).then(res => res.data) }
// 项目类型管理-删除
export const removeProjectTypeList = params => { return axios.post(`${base}/removeQualityProjectType.do`, qs.stringify(params)).then(res => res.data) }
// 项目类型管理-编辑
export const modifyProjectTypeList = params => { return axios.post(`${base}/modifyQualityProjectType.do`, qs.stringify(params)).then(res => res.data) }

// 类模板管理-查询
export const queryIQCTemplate = params => { return axios.post(`${base}/queryIQCTemplate.do`, qs.stringify(params)).then(res => res.data) }
// 进货检验报告-查询
export const queryIQCReport = params => { return axios.post(`${base}/queryIQCReport.do`, qs.stringify(params)).then(res => res.data) }
// 品质报告-查询
export const queryPQCReportRecord = params => { return axios.post(`${base}/queryPQCReportRecord.do`, qs.stringify(params)).then(res => res.data) }
// 检测方案管理-查询
export const queryPQCTemplate = params => { return axios.post(`${base}/queryPQCTemplate.do`, qs.stringify(params)).then(res => res.data) }
// 检测计划管理-查询
export const queryPQCPlan = params => { return axios.post(`${base}/queryPQCPlan.do`, qs.stringify(params)).then(res => res.data) }

// 电芯出货报告-查询
export const queryFQCReport = params => { return axios.post(`${base}/queryFQCReport.do`, qs.stringify(params)).then(res => res.data) }
// 出货报告模板管理-查询
export const queryFQCTemplate = params => { return axios.post(`${base}/queryFQCTemplate.do`, qs.stringify(params)).then(res => res.data) }
// 检验项目管理-列表
export const getInspectType = params => { return axios.post(`${base}/queryQualityProject.do`, qs.stringify(params)).then(res => res.data) }
// 检验项目管理-新增
export const addInspectType = params => { return axios.post(`${base}/saveQualityProject.do`, qs.stringify(params)).then(res => res.data) }
// 检验项目管理-删除
export const removeInspectType = params => { return axios.post(`${base}/removeQualityProject.do`, qs.stringify(params)).then(res => res.data) }
// 检验项目管理-编辑
export const modifyInspectType = params => { return axios.post(`${base}/modifyQualityProject.do`, qs.stringify(params)).then(res => res.data) }
// 获取项目类型
export const queryProjectTypes = params => { return axios.post(`${base}/queryQualityProjectType.do`, qs.stringify(params)).then(res => res.data) }

// 检验方式管理-列表
export const getInspectProjectType = params => { return axios.post(`${base}/queryCheckMethod.do`, qs.stringify(params)).then(res => res.data) }
// 检验方式管理-新增
export const addInspectProjectType = params => { return axios.post(`${base}/saveCheckMethod.do`, qs.stringify(params)).then(res => res.data) }
// 检验方式管理-删除
export const removeInspectProjectType = params => { return axios.post(`${base}/removeCheckMethod.do`, qs.stringify(params)).then(res => res.data) }
// 检验方式管理-编辑
export const modifyInspectProjectType = params => { return axios.post(`${base}/modifyCheckMethod.do`, qs.stringify(params)).then(res => res.data) }

// 测试量具管理-列表
export const getAppliance = params => { return axios.post(`${base}/queryAppliance.do`, qs.stringify(params)).then(res => res.data) }
// 测试量具管理-新增
export const addAppliance = params => { return axios.post(`${base}/saveAppliance.do`, qs.stringify(params)).then(res => res.data) }
// 测试量具管理-删除
export const removeAppliance = params => { return axios.post(`${base}/removeAppliance.do`, qs.stringify(params)).then(res => res.data) }
// 测试量具管理-编辑
export const modifyAppliance = params => { return axios.post(`${base}/modifyAppliance.do`, qs.stringify(params)).then(res => res.data) }

// 不良代号管理-列表
export const getUnqualified = params => { return axios.post(`${base}/queryUnqualified.do`, qs.stringify(params)).then(res => res.data) }
// 不良代号管理-新增
export const addUnqualified = params => { return axios.post(`${base}/saveUnqualified.do`, qs.stringify(params)).then(res => res.data) }
// 不良代号管理-删除
export const removeUnqualified = params => { return axios.post(`${base}/removeUnqualified.do`, qs.stringify(params)).then(res => res.data) }
// 不良代号管理-编辑
export const modifyUnqualified = params => { return axios.post(`${base}/modifyUnqualified.do`, qs.stringify(params)).then(res => res.data) }

/* 质量管控 end */

/* 报表管理 start */

/* 报表管理 end */

/* 看板管理 start */

/* 看板管理 end */
export const queryBoardPlan = params => { return axios.post(`${base}/queryBoardPlan.do`, qs.stringify(params)).then(res => res.data) }
export const sendFileToCustomerUrl = `${base}/sendFileToCustomer.do`
export const sendPdfFileToCustomerUrl = `${base}/sendPdfFileToCustomer.do`
export const queryWorkOrderOutlineForms = params => { return axios.post(`${base}/queryWorkOrderOutlineForms.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkstageAscend = params => { return axios.post(`${base}/queryWorkstageAscend.do`, qs.stringify(params)).then(res => res.data) }
export const queryWorkOrderAscend = params => { return axios.post(`${base}/queryWorkOrderAscend.do`, qs.stringify(params)).then(res => res.data) }
export const queryDevicesOEE = params => { return axios.post(`${base}/queryDevicesOEE.do`, qs.stringify(params)).then(res => res.data) }
export const queryDevicesException = params => { return axios.post(`${base}/queryDevicesException.do`, qs.stringify(params)).then(res => res.data) }
export const queryDevicesExceptionAndMalfunction = params => { return axios.post(`${base}/queryDevicesExceptionAndMalfunction.do`, qs.stringify(params)).then(res => res.data) }
export const queryIQCUnqualifiedReport = params => { return axios.post(`${base}/queryIQCUnqualifiedReport.do`, qs.stringify(params)).then(res => res.data) }
export const queryPQCUnqualifiedReport = params => { return axios.post(`${base}/queryPQCUnqualifiedReport.do`, qs.stringify(params)).then(res => res.data) }
export const queryFQCReportForms = params => { return axios.post(`${base}/queryFQCReportForms.do`, qs.stringify(params)).then(res => res.data) }
export const queryReportForm = params => { return axios.post(`${base}/queryReportForm.do`, qs.stringify(params)).then(res => res.data) }
export const modifyBoardPlan = params => { return axios.post(`${base}/modifyBoardPlan.do`, qs.stringify(params)).then(res => res.data) }
export const saveBoardPlan = params => { return axios.post(`${base}/saveBoardPlan.do`, qs.stringify(params)).then(res => res.data) }
export const removeBoardPlan = params => { return axios.post(`${base}/removeBoardPlan.do`, qs.stringify(params)).then(res => res.data) }
export const upLoadBillboardPicUrl = `${base}/upLoadBillboardPic.do`
export const uploadBillboardVedioUrl = `${base}/uploadBillboardVedio.do`
export const upLoadBillboardPdfUrl = `${base}/upLoadBillboardPdf.do`
export const queryBillboardPic = params => { return axios.post(`${base}/queryBillboardPic.do`, qs.stringify(params)).then(res => res.data) }
export const deleteBillboardPics = params => { return axios.post(`${base}/deleteBillboardPics.do`, qs.stringify(params)).then(res => res.data) }
export const insertBillboardPicProgram = params => { return axios.post(`${base}/insertBillboardPicProgram.do`, qs.stringify(params)).then(res => res.data) }
export const upLoadBillboardPic = form => { return axios.post(`${base}/upLoadBillboardPic.do`, form).then(res => res.data) }
export const uploadBillboardVedio = form => { return axios.post(`${base}/uploadBillboardVedio.do`, form).then(res => res.data) }
export const upLoadBillboardPdf = form => { return axios.post(`${base}/upLoadBillboardPdf.do`, form).then(res => res.data) }
export const queryBillboardPdf = params => { return axios.post(`${base}/queryBillboardPdf.do`, qs.stringify(params)).then(res => res.data) }
export const deleteBillboardPdf = params => { return axios.post(`${base}/deleteBillboardPdf.do`, qs.stringify(params)).then(res => res.data) }
export const insertBillboardPdfProgram = params => { return axios.post(`${base}/insertBillboardPdfProgram.do`, qs.stringify(params)).then(res => res.data) }
export const queryBillboardType = params => { return axios.post(`${base}/queryBillboardType.do`, qs.stringify(params)).then(res => res.data) }
export const saveBillboardMediaType = params => { return axios.post(`${base}/saveBillboardMediaType.do`, qs.stringify(params)).then(res => res.data) }
export const selectVedioInfo = params => { return axios.post(`${base}/selectVedioInfo.do`, qs.stringify(params)).then(res => res.data) }
export const insertBillboardVedioProgram = params => { return axios.post(`${base}/insertBillboardVedioProgram.do`, qs.stringify(params)).then(res => res.data) }
export const deleteBillboardVedio = params => { return axios.post(`${base}/deleteBillboardVedio.do`, qs.stringify(params)).then(res => res.data) }
export const queryAxisOptions = params => { return axios.post(`${base}/queryAxisOptions.do`, qs.stringify(params)).then(res => res.data) }
export const removeBoardAreaChart = params => { return axios.post(`${base}/removeBoardAreaChart.do`, qs.stringify(params)).then(res => res.data) }
export const saveBoardPlanConfigure = params => { return axios.post(`${base}/saveBoardPlanConfigure.do`, qs.stringify(params)).then(res => res.data) }
export const modifyBoardAreaCharts = params => { return axios.post(`${base}/modifyBoardAreaCharts.do`, qs.stringify(params)).then(res => res.data) }
export const queryReportFormType = params => { return axios.post(`${base}/queryReportFormType.do`, qs.stringify(params)).then(res => res.data) }
export const querySpectacularsMessage = params => { return axios.post(`${base}/querySpectacularsMessage.do`, qs.stringify(params)).then(res => res.data) }
export const insertSpectacularsMessage = params => { return axios.post(`${base}/insertSpectacularsMessage.do`, qs.stringify(params)).then(res => res.data) }
export const deleteSpectacularsMessage = params => { return axios.post(`${base}/deleteSpectacularsMessage.do`, qs.stringify(params)).then(res => res.data) }
export const synchronizationBillboardScheme = params => { return axios.post(`${base}/synchronizationBillboardScheme.do`, qs.stringify(params)).then(res => res.data) }

/* 追溯模块 start */

/* 追溯模块 end */

/* SPC start */

/* SPC end */

/* 以下是RESTful api 示例 （可能以后api会支持） */
// 新增用户
// export const addUser = params => { return axios.post(`${base}/users`, qs.stringify(params)).then(res => res.data) }
// 删除用户
// export const removeUser = id => { return axios.delete(`${base}/users/${id}`).then(res => res.data) }
// 修改用户
// export const editUser = params => { return axios.put(`${base}/users/${params.user_id}`, qs.stringify(params)).then(res => res.data) }
// 获取用户列表
// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }
