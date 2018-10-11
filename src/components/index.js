import ProductType from './ProductType/index.js'
import ProductModel from './ProductModel/index.js'
import BasicInfoTable from './BasicInfoTable/index.js'
import Staff from './Staff/index.js'
import Supplier from './Supplier/index.js'
import MPlanBatch from './MPlanBatch/index.js'
import WorkShop from './WorkShop/index.js'
import WareHouse from './WareHouse/index.js'
import Post from './Post/index.js'
import Device from './Device/index.js'
import DeviceProject from './DeviceProject/index.js'
import Process from './Process/index.js'
import Shift from './Shift/index.js'
import WorkOrder from './WorkOrder/index.js'
import AddParams from './AddParams/index.js'
import Craft from './Craft/index.js'
import CraftSegment from './CraftSegment/index.js'
import WorkStepBasic from './WorkStepBasic/index.js'
import WorkStepOutline from './WorkStepOutline/index.js'
import WorkstageBasics from './WorkstageBasics/index.js'
import WorkstageByWorkShopId from './WorkstageByWorkShopId/index.js'
import DeviceType from './DeviceType/index.js'
import Material from './Material/index.js'
import SemiFinishedProduct from './SemiFinishedProduct/index.js'
import ProductionBatchNumber from './ProductionBatchNumber/index.js'
import Battery from './Battery/index.js'
import WareHouseLocation from './WareHouseLocation/index.js'

const components = [
  ProductType,
  ProductModel,
  BasicInfoTable,
  Staff,
  Supplier,
  MPlanBatch,
  WorkShop,
  WareHouse,
  Post,
  Device,
  DeviceProject,
  Process,
  Shift,
  WorkOrder,
  AddParams,
  Craft,
  CraftSegment,
  WorkStepBasic,
  WorkStepOutline,
  WorkstageBasics,
  WorkstageByWorkShopId,
  DeviceType,
  Material,
  SemiFinishedProduct,
  ProductionBatchNumber,
  Battery,
  WareHouseLocation
]

const install = function (Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component)
  })
  // 产品类型
  Vue.prototype.$mesProductType = ProductType
  // 产品型号
  Vue.prototype.$mesProductModel = ProductModel
  // 基础信息表格
  Vue.prototype.$mesBasicInfoTable = BasicInfoTable
  // 员工
  Vue.prototype.$mesStaff = Staff
  // 供应商
  Vue.prototype.$mesSupplier = Supplier
  // 生产计划批次
  Vue.prototype.$mesMPlanBatch = MPlanBatch
  // 车间
  Vue.prototype.$mesWorkShop = WorkShop
  // 仓库
  Vue.prototype.$mesWareHouse = WareHouse
  // 职位
  Vue.prototype.$mesPost = Post
  // 设备
  Vue.prototype.$mesDevice = Device
  // 设备项目
  Vue.prototype.$mesDeviceProject = DeviceProject
  // 工序
  Vue.prototype.$mesProcess = Process
  // 班次
  Vue.prototype.$mesShift = Shift
  // 工单
  Vue.prototype.$mesWorkOrder = WorkOrder
  // 参数
  Vue.prototype.$mesAddParams = AddParams
  // 工艺
  Vue.prototype.$mesCraft = Craft
  // 工艺段
  Vue.prototype.$mesCraftSegment = CraftSegment
  // 工步基本信息
  Vue.prototype.$mesWorkStepBasic = WorkStepBasic
  // 工步
  Vue.prototype.$mesWorkStepOutline = WorkStepOutline
  // 工序
  Vue.prototype.$mesWorkstageBasics = WorkstageBasics
  // 工序
  Vue.prototype.$mesWorkstageByWorkShopId = WorkstageByWorkShopId
  // 设备类型
  Vue.prototype.$mesDeviceType = DeviceType
  // 物料或物料批次
  Vue.prototype.$mesMaterial = Material
  // 半成品
  Vue.prototype.$mesSemiFinishedProduct = SemiFinishedProduct
  // 生产批号
  Vue.prototype.$mesProductionBatchNumber = ProductionBatchNumber
  // 电池型号
  Vue.prototype.$mesBattery = Battery
  // 库位
  Vue.prototype.$mesWareHouseLocation = WareHouseLocation
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

const modules = {
  version: '1.0.0',
  author: 'liuchuanzhong',
  install,
  ProductType,
  ProductModel,
  BasicInfoTable,
  Staff,
  Supplier,
  MPlanBatch,
  WorkShop,
  WareHouse,
  Post,
  Device,
  DeviceProject,
  Process,
  Shift,
  WorkOrder,
  AddParams,
  Craft,
  CraftSegment,
  WorkStepBasic,
  WorkStepOutline,
  WorkstageBasics,
  WorkstageByWorkShopId,
  DeviceType,
  Material,
  SemiFinishedProduct,
  ProductionBatchNumber,
  Battery,
  WareHouseLocation
}

export default modules
