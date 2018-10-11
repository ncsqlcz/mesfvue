/* 定义所有异步组件 */

// 登录页面
// const Login = r => require.ensure([], () => r(require('./views/Login')), 'Login')
// 404页面
// const NotFound = r => require.ensure([], () => r(require('./views/404.vue')), 'NotFound')
// home页
const Home = r => require.ensure([], () => r(require('./views/Home.vue')), 'Home')
// 首页
const Index = r => require.ensure([], () => r(require('./views/Index.vue')), 'Index')
// 空白页，为第三级菜单预留的
const Blank = r => require.ensure([], () => r(require('./views/Blank.vue')), 'Blank')

/* 系统管理 */
const Staff = r => require.ensure([], () => r(require('./views/system/Staff.vue')), 'Staff')
const Post = r => require.ensure([], () => r(require('./views/system/Post.vue')), 'Post')
const Shift = r => require.ensure([], () => r(require('./views/system/Shift.vue')), 'Shift')
const ShiftDetail = r => require.ensure([], () => r(require('./views/system/ShiftDetail.vue')), 'ShiftDetail')
const Permissions = r => require.ensure([], () => r(require('./views/system/Permissions.vue')), 'Permissions')
const Structure = r => require.ensure([], () => r(require('./views/system/Structure.vue')), 'Structure')
const ProductLines = r => require.ensure([], () => r(require('./views/system/ProductLines.vue')), 'ProductLines')
const Workshop = r => require.ensure([], () => r(require('./views/system/Workshop.vue')), 'Workshop')
const Workstage = r => require.ensure([], () => r(require('./views/system/Workstage.vue')), 'Workstage')
const PostConfig = r => require.ensure([], () => r(require('./views/system/children/PostConfig.vue')), 'PostConfig')
const StaffConfig = r => require.ensure([], () => r(require('./views/system/children/StaffConfig.vue')), 'StaffConfig')
const DeviceConfig = r => require.ensure([], () => r(require('./views/system/children/DeviceConfig.vue')), 'DeviceConfig')
const WorkstageConfig = r => require.ensure([], () => r(require('./views/system/children/WorkstageConfig.vue')), 'WorkstageConfig')
const ProcessConfig = r => require.ensure([], () => r(require('./views/system/children/ProcessConfig.vue')), 'ProcessConfig')
const LineWorkshopConfig = r => require.ensure([], () => r(require('./views/system/children/LineWorkshopConfig.vue')), 'LineWorkshopConfig')
const AboutUs = r => require.ensure([], () => r(require('./views/system/other/AboutUs.vue')), 'AboutUs')
const HelpDoc = r => require.ensure([], () => r(require('./views/system/other/HelpDoc.vue')), 'HelpDoc')
const LoginLog = r => require.ensure([], () => r(require('./views/system/other/LoginLog.vue')), 'LoginLog')
const Password = r => require.ensure([], () => r(require('./views/system/other/Password.vue')), 'Password')
const UserInfo = r => require.ensure([], () => r(require('./views/system/other/UserInfo.vue')), 'UserInfo')

/* 设备管控 */
const DevicesStatus = r => require.ensure([], () => r(require('./views/devices/DevicesStatus.vue')), 'DevicesStatus')
const DevicesStandingBook = r => require.ensure([], () => r(require('./views/devices/DevicesStandingBook.vue')), 'DevicesStandingBook')
const SpotCheckRecord = r => require.ensure([], () => r(require('./views/devices/devicesSpotCheck/SpotCheckRecord.vue')), 'SpotCheckRecord')
const AddSpotCheck = r => require.ensure([], () => r(require('./views/devices/devicesSpotCheck/AddSpotCheck.vue')), 'AddSpotCheck')
const MaintainRecord = r => require.ensure([], () => r(require('./views/devices/devicesMaintain/MaintainRecord.vue')), 'MaintainRecord')
const MalfunctionRecord = r => require.ensure([], () => r(require('./views/devices/MalfunctionRecord.vue')), 'MalfunctionRecord')
const MaintainBook = r => require.ensure([], () => r(require('./views/devices/devicesMaintain/MaintainBook.vue')), 'MaintainBook')
const AddMaintain = r => require.ensure([], () => r(require('./views/devices/devicesMaintain/AddMaintain.vue')), 'AddMaintain')

/* 仓储管理 */
const Suppliers = r => require.ensure([], () => r(require('./views/warehouse/basicInfo/Suppliers.vue')), 'Suppliers')
const Warehouse = r => require.ensure([], () => r(require('./views/warehouse/basicInfo/Warehouse.vue')), 'Warehouse')
const MaterialBaseInfo = r => require.ensure([], () => r(require('./views/warehouse/basicInfo/MaterialBaseInfo.vue')), 'MaterialBaseInfo')
const productBaseInfo = r => require.ensure([], () => r(require('./views/warehouse/basicInfo/ProductBaseInfo.vue')), 'productBaseInfo')

const MaterialDetail = r => require.ensure([], () => r(require('./views/warehouse/materialInfo/MaterialDetail.vue')), 'MaterialDetail')
const MaterialIn = r => require.ensure([], () => r(require('./views/warehouse/materialInfo/MaterialIn.vue')), 'MaterialIn')
const MaterialOut = r => require.ensure([], () => r(require('./views/warehouse/materialInfo/MaterialOut.vue')), 'MaterialOut')
const MaterialAllocation = r => require.ensure([], () => r(require('./views/warehouse/materialInfo/MaterialAllocation.vue')), 'MaterialAllocation')
const WarehouseCheck = r => require.ensure([], () => r(require('./views/warehouse/materialInfo/WarehouseCheck.vue')), 'WarehouseCheck')

const ProductIn = r => require.ensure([], () => r(require('./views/warehouse/productInfo/ProductIn.vue')), 'ProductIn')
const ProductList = r => require.ensure([], () => r(require('./views/warehouse/productInfo/ProductList.vue')), 'ProductList')
const ProductOut = r => require.ensure([], () => r(require('./views/warehouse/productInfo/ProductOut.vue')), 'ProductOut')


/* const WarehouseBasic = r => require.ensure([], () => r(require('./views/warehouse/warehouseBasic.vue')), 'WarehouseBasic')
const MaterialComing = r => require.ensure([], () => r(require('./views/warehouse/materialComing.vue')), 'MaterialComing')
const MaterialIn = r => require.ensure([], () => r(require('./views/warehouse/materialIn.vue')), 'MaterialIn')
const MaterialOut = r => require.ensure([], () => r(require('./views/warehouse/materialOut.vue')), 'MaterialOut')
const MaterialReturn = r => require.ensure([], () => r(require('./views/warehouse/materialReturn.vue')), 'materialReturn')

const productInfo = r => require.ensure([], () => r(require('./views/warehouse/productInfo.vue')), 'productInfo')
const productStock = r => require.ensure([], () => r(require('./views/warehouse/productStock.vue')), 'productStock')
const productIn = r => require.ensure([], () => r(require('./views/warehouse/productIn.vue')), 'productIn')
const productOut = r => require.ensure([], () => r(require('./views/warehouse/productOut.vue')), 'productOut')

const WarehouseCheck = r => require.ensure([], () => r(require('./views/warehouse/warehouseCheck.vue')), 'WarehouseCheck')
const MaterialAllocation = r => require.ensure([], () => r(require('./views/warehouse/MaterialAllocation.vue')), 'MaterialAllocation') */

/* 工艺管理 */
const ProductBasic = r => require.ensure([], () => r(require('./views/craft/basicInfo/ProductBasic.vue')), 'ProductBasic')
const ProductType = r => require.ensure([], () => r(require('./views/craft/children/ProductType.vue')), 'ProductType')
const CraftDetail = r => require.ensure([], () => r(require('./views/craft/management/CraftDetail.vue')), 'CraftDetail')
const AddCraft = r => require.ensure([], () => r(require('./views/craft/management/AddCraft.vue')), 'AddCraft')
const BomManage = r => require.ensure([], () => r(require('./views/craft/children/BomManage.vue')), 'BomManage')
const CraftBasicManage = r => require.ensure([], () => r(require('./views/craft/management/CraftBasicManage.vue')), 'CraftBasicManage')
const CraftProcessDetail = r => require.ensure([], () => r(require('./views/craft/process/CraftProcessDetail.vue')), 'CraftProcessDetail')
const CraftProcessBasicManage = r => require.ensure([], () => r(require('./views/craft/process/CraftProcessBasicManage.vue')), 'CraftProcessBasicManage')
const CraftStepDetail = r => require.ensure([], () => r(require('./views/craft/step/CraftStepDetail.vue')), 'CraftStepDetail')
const CraftStepBasicManage = r => require.ensure([], () => r(require('./views/craft/step/CraftStepBasicManage.vue')), 'CraftStepBasicManage')
const CraftStepParams = r => require.ensure([], () => r(require('./views/craft/step/CraftStepParams.vue')), 'CraftStepParams')
const SectionBasicManage = r => require.ensure([], () => r(require('./views/craft/section/SectionBasicManage.vue')), 'SectionBasicManage')
const SectionDetail = r => require.ensure([], () => r(require('./views/craft/section/SectionDetail.vue')), 'SectionDetail')

/* 生产计划 */
const MPlanOverview = r => require.ensure([], () => r(require('./views/m_plan/Overview.vue')), 'MPlanOverview')
const MyPlanStarted = r => require.ensure([], () => r(require('./views/m_plan/mine/Started.vue')), 'MyPlanStarted')
const MyPlanAudited = r => require.ensure([], () => r(require('./views/m_plan/mine/Audited.vue')), 'MyPlanAudited')
const MyPlanResponsibility = r => require.ensure([], () => r(require('./views/m_plan/mine/Responsibility.vue')), 'MyPlanResponsibility')
const MyPlanScheduled = r => require.ensure([], () => r(require('./views/m_plan/mine/Scheduled.vue')), 'MyPlanScheduled')

/* 生产工单 */
const MExecutiveManagement = r => require.ensure([], () => r(require('./views/m_executive/Management.vue')), 'Management')
const WorkOrderDetail = r => require.ensure([], () => r(require('./views/m_executive/children/WorkOrderDetail.vue')), 'WorkOrderDetail')
const MyWorkOrder = r => require.ensure([], () => r(require('./views/m_executive/MyWorkOrder.vue')), 'MyWorkOrder')

/* 生产过程 */
const Picking = r => require.ensure([], () => r(require('./views/m_process/Picking.vue')), 'Picking')

/* 质量管控 */
const ProjectType = r => require.ensure([], () => r(require('./views/quality_control/basic/ProjectType.vue')), 'ProjectType')
const InspectType = r => require.ensure([], () => r(require('./views/quality_control/basic/InspectType.vue')), 'InspectType')
const InspectMethod = r => require.ensure([], () => r(require('./views/quality_control/basic/InspectMethod.vue')), 'InspectMethod')
const InspectTool = r => require.ensure([], () => r(require('./views/quality_control/basic/InspectTool.vue')), 'InspectTool')
const BadCode = r => require.ensure([], () => r(require('./views/quality_control/basic/BadCode.vue')), 'BadCode')

const StockReport = r => require.ensure([], () => r(require('./views/quality_control/IQC/StockReport.vue')), 'StockReport')
const KindTemplate = r => require.ensure([], () => r(require('./views/quality_control/IQC/KindTemplate.vue')), 'KindTemplate')
const MeterialTemplate = r => require.ensure([], () => r(require('./views/quality_control/IQC/MeterialTemplate.vue')), 'MeterialTemplate')

const QualityReport = r => require.ensure([], () => r(require('./views/quality_control/PQC/QualityReport.vue')), 'QualityReport')
const DetectionScheme = r => require.ensure([], () => r(require('./views/quality_control/PQC/DetectionScheme.vue')), 'DetectionScheme')
const DetectionProject = r => require.ensure([], () => r(require('./views/quality_control/PQC/DetectionProject.vue')), 'DetectionProject')

const ClearReport = r => require.ensure([], () => r(require('./views/quality_control/FQC/ClearReport.vue')), 'ClearReport')
const ClearTemplate = r => require.ensure([], () => r(require('./views/quality_control/FQC/ClearTemplate.vue')), 'ClearTemplate')

/* 报表管理 */

/* 看板管理 */
const DisplayBoard = r => require.ensure([], () => r(require('./views/display_board/DisplayBoard.vue')), 'DisplayBoard')
const DisplayBoardConfig = r => require.ensure([], () => r(require('./views/display_board/DisplayBoardConfig.vue')), 'DisplayBoardConfig')
const DisplayBoardNotificationConfig = r => require.ensure([], () => r(require('./views/display_board/DisplayBoardNotificationConfig.vue')), 'DisplayBoardNotificationConfig')

/* 追溯模块 */

/* SPC */

let routes = [
  {
    path: '/system',
    component: Home,
    name: '系统管理',
    iconClass: 'fa fa-cog',
    children: [
      {path: '/index', component: Index, name: '首页', hidden: true},
      {path: '/system/staff', component: Staff, name: '员工管理', leaf: true},
      {path: '/system/post', component: Post, name: '职位管理', leaf: true},
      {path: '/system/shift', component: Shift, name: '班次管理', leaf: true},
      {path: '/system/shiftDetail', component: ShiftDetail, name: '班次详情', leaf: true, hidden: true},
      {path: '/system/permissions', component: Permissions, name: '权限管理', leaf: true},
      {
        path: '/system/organization',
        component: Blank,
        name: '组织结构',
        leaf: false,  // 非叶子节点
        children: [
          {path: '/system/organization/structure', component: Structure, name: '组织结构管理'},
          {path: '/system/organization/productionLine', component: ProductLines, name: '产线管理'},
          {path: '/system/organization/workshop', component: Workshop, name: '车间管理'},
          {path: '/system/organization/workstage', component: Workstage, name: '车间工序管理'},
          {path: '/system/organization/postConfig', component: PostConfig, name: '职位配置', hidden: true},
          {path: '/system/organization/staffConfig', component: StaffConfig, name: '人员配置', hidden: true},
          {path: '/system/organization/deviceConfig', component: DeviceConfig, name: '设备配置', hidden: true},
          {path: '/system/organization/workstageConfig', component: WorkstageConfig, name: '车间配置', hidden: true},
          {path: '/system/organization/processConfig', component: ProcessConfig, name: '工序配置', hidden: true},
          {path: '/system/organization/lineWorkshopConfig', component: LineWorkshopConfig, name: '车间配置', hidden: true}
        ]
      },
      {
        path: '/system/others',
        component: Blank,
        name: '其它',
        leaf: false,
        children: [
          {path: '/system/others/password', component: Password, name: '用户信息修改'},
          {path: '/system/others/userInfo', component: UserInfo, name: '用户信息管理'},
          {path: '/system/others/userLoginLog', component: LoginLog, name: '用户登录记录'},
          {path: '/system/others/help', component: HelpDoc, name: '帮助文档'},
          {path: '/system/others/aboutUs', component: AboutUs, name: '关于我们'}
        ]
      }
    ]
  },
  {
    path: '/devices',
    component: Home,
    name: '设备管控',
    iconClass: 'fa fa-wrench',
    children: [
      {path: '/devices/devicesStatus', component: DevicesStatus, name: '设备状况', leaf: true},
      {path: '/devices/DevicesStandingBook', component: DevicesStandingBook, name: '设备台账', leaf: true},
      {
        path: '/devices/devicesSpotCheck',
        component: Blank,
        name: '设备点检',
        leaf: false,
        children: [
          {path: '/devices/devicesSpotCheck/SpotCheckRecord', component: SpotCheckRecord, name: '设备点检'},
          {path: '/devices/devicesSpotCheck/AddSpotCheck', component: AddSpotCheck, name: '新建点检表'}
        ]
      },
      {
        path: '/devices/devicesMaintain',
        component: Blank,
        name: '维护保养',
        leaf: false,
        children: [
          {path: '/devices/devicesMaintain/MaintainRecord', component: MaintainRecord, name: '保养记录'},
          {path: '/devices/devicesMaintain/AddMaintain', component: AddMaintain, name: '新建保养计划'},
          {path: '/devices/devicesMaintain/MaintainBook', component: MaintainBook, name: '保养指导书管理'}
        ]
      },
      {path: '/devices/MalfunctionRecord', component: MalfunctionRecord, name: '故障记录', leaf: true}
    ]
  },
  {
    path: '/warehouse',
    component: Home,
    name: '仓储管理',
    iconClass: 'fa fa-truck',
    children: [
      {
        path: '/warehouse/basicInfo',
        component: Blank,
        name: '基础信息管理',
        leaf: false,
        children: [
          {path: '/warehouse/basicInfo/Suppliers', component: Suppliers, name: '供应商管理'},
          {path: '/warehouse/basicInfo/Warehouse', component: Warehouse, name: '仓库管理'},
          {path: '/warehouse/basicInfo/MaterialBaseInfo', component: MaterialBaseInfo, name: '物料基础信息管理'},
          {path: '/warehouse/basicInfo/productBaseInfo', component: productBaseInfo, name: '成品基础信息管理'}
        ]
      },
      {
        path: '/warehouse/materialInfo',
        component: Blank,
        name: '物料信息',
        leaf: false,
        children: [
          {path: '/warehouse/materialInfo/MaterialDetail', component: MaterialDetail, name: '库存明细'},
          {path: '/warehouse/materialInfo/MaterialIn', component: MaterialIn, name: '物料入库'},
          {path: '/warehouse/materialInfo/MaterialOut', component: MaterialOut, name: '物料出库'},
          {path: '/warehouse/materialInfo/MaterialAllocation', component: MaterialAllocation, name: '物料调拨'},
          {path: '/warehouse/materialInfo/WarehouseCheck', component: WarehouseCheck, name: '数量盘点'}
        ]
      },
      {
        path: '/warehouse/productInfo',
        component: Blank,
        name: '成品信息',
        leaf: false,
        children: [
          {path: '/warehouse/productInfo/ProductList', component: ProductList, name: '库存明细'},
          {path: '/warehouse/productInfo/ProductIn', component: ProductIn, name: '成品入库'},
          {path: '/warehouse/productInfo/ProductOut', component: ProductOut, name: '成品出库'}
        ]
      }
    ]
  },
  {
    path: '/craft',
    component: Home,
    name: '工艺管理',
    iconClass: 'fa fa-puzzle-piece',
    children: [
      {
        path: '/craft/step',
        component: Blank,
        name: '工步管理',
        leaf: false,
        children: [
          {path: '/craft/step/detail', component: CraftStepDetail, name: '工步详情'},
          {path: '/craft/step/basic', component: CraftStepBasicManage, name: '工步基础信息管理'},
          {path: '/craft/step/stepParams', component: CraftStepParams, name: '工步参数管理'}
        ]
      },
      {
        path: '/craft/process',
        component: Blank,
        name: '工序管理',
        leaf: false,
        children: [
          {path: '/craft/process/detail', component: CraftProcessDetail, name: '工序详情'},
          {path: '/craft/process/basic', component: CraftProcessBasicManage, name: '工序基础信息管理'}
        ]
      },
      {
        path: '/craft/section',
        component: Blank,
        name: '工艺段管理',
        leaf: false,
        children: [
          {path: '/craft/section/detail', component: SectionDetail, name: '工艺段详情'},
          {path: '/craft/section/basic', component: SectionBasicManage, name: '工艺段基础信息管理'},
        ]
      },
      {
        path: '/craft/management',
        component: Blank,
        name: '工艺管理',
        leaf: false,
        children: [
          {path: '/craft/detail', component: CraftDetail, name: '工艺详情'},
          {path: '/craft/basic', component: CraftBasicManage, name: '工艺基础信息'},
          {path: '/craft/add', component: AddCraft, name: '新增工艺', hidden: true},
          {path: '/craft/bomManage', component: BomManage, name: 'BOM管理', hidden: true}
        ]
      },
      {
        path: '/craft/basic',
        component: Blank,
        name: 'WIP基础信息管理',
        leaf: false,
        children: [
          {path: '/craft/basic/ProductBasic', component: ProductBasic, name: '成品信息'},
          {path: '/craft/basic/ProductType', component: ProductType, name: '成品类型管理', hidden: true},
          {path: '/craft/basic/semiFinished', component: Index, name: '半成品管理'},
          {path: '/craft/basic/semiFinishedParams', component: Index, name: '半成品参数管理'},
          {path: '/craft/basic/standardParams', component: Index, name: '标准参数管理'}
        ]
      }
    ]
  },
  {
    path: '/mPlan',
    component: Home,
    name: '生产计划',
    iconClass: 'fa fa-calendar-minus-o',
    children: [
      {path: '/mPlan/overview', component: MPlanOverview, name: '生产计划总览', leaf: true},
      {path: '/mPlan/add', component: Index, name: '新建生产计划', leaf: true},
      {
        path: '/mPlan/I',
        component: Blank,
        name: '我的生产计划',
        leaf: false,
        children: [
          {path: '/mPlan/I/started', component: MyPlanStarted, name: '我发起的', leaf: true},
          {path: '/mPlan/I/audited', component: MyPlanAudited, name: '我审核的', leaf: true},
          {path: '/mPlan/I/responsibility', component: MyPlanResponsibility, name: '我负责的', leaf: true},
          {path: '/mPlan/I/scheduled', component: MyPlanScheduled, name: '我调度的', leaf: true}
        ]
      }
    ]
  },
  {
    path: '/mExecutive',
    component: Home,
    name: '生产工单',
    iconClass: 'fa fa-cutlery',
    children: [
      {path: '/mExecutive/management', component: MExecutiveManagement, name: '生产执行管理', leaf: true},
      {path: '/mExecutive/management/:id', component: WorkOrderDetail, name: '生产执行管理', leaf: true, hidden: true},
      {path: '/mExecutive/myWorkorder', component: MyWorkOrder, name: '我的工单', leaf: true},
      {path: '/mExecutive/myWorkorder/:id', component: WorkOrderDetail, name: '我的工单', leaf: true, hidden: true}
    ]
  },
  {
    path: '/mProcess',
    component: Home,
    name: '生产过程',
    iconClass: 'fa fa-hourglass-half',
    children: [
      {path: '/mProcess/picking', component: Picking, name: '领料管理', leaf: true},
      {path: '/mProcess/supplementary', component: Index, name: '补料管理', leaf: true},
      {path: '/mProcess/rejected', component: Index, name: '退料管理', leaf: true},
      {path: '/mProcess/batch', component: Index, name: '调批管理', leaf: true},
      {path: '/mProcess/output', component: Index, name: '产出物管理', leaf: true},
      {path: '/mProcess/batchTransfer', component: Index, name: '批次转出', leaf: true},
      {path: '/mProcess/scrap', component: Index, name: '报废管理', leaf: true},
      {path: '/mProcess/bad', component: Index, name: '不良品管理', leaf: true}
    ]
  },
  {
    path: '/qualityControl',
    component: Home,
    name: '质量管控',
    iconClass: 'fa fa-gavel',
    children: [
      {
        path: '/qualityControl/basic',
        component: Blank,
        name: '基础数据维护',
        leaf: false,
        children: [
          {path: '/qualityControl/basic/projectType', component: ProjectType, name: '项目类型管理'},
          {path: '/qualityControl/basic/inspectType', component: InspectType, name: '检验项目管理'},
          {path: '/qualityControl/basic/inspectMethod', component: InspectMethod, name: '检验方式管理'},
          {path: '/qualityControl/basic/inspectTool', component: InspectTool, name: '测试量具管理'},
          {path: '/qualityControl/basic/badCode', component: BadCode, name: '不良代号管理'}
        ]
      },
      {
        path: '/qualityControl/IQC',
        component: Blank,
        name: 'IQC管理',
        leaf: false,
        children: [
          {path: '/qualityControl/IQC/KindTemplate', component: KindTemplate, name: '类模板管理'},
          {path: '/qualityControl/IQC/MeterialTemplate', component: MeterialTemplate, name: '物料模板管理'},
          {path: '/qualityControl/IQC/StockReport', component: StockReport, name: '进货检验报告'}
        ]
      },
      {
        path: '/qualityControl/PQC',
        component: Blank,
        name: 'PQC管理',
        leaf: false,
        children: [
          {path: '/qualityControl/PQC/QualityReport', component: QualityReport, name: '品质报告'},
          {path: '/qualityControl/PQC/DetectionScheme', component: DetectionScheme, name: '检测方案管理'},
          {path: '/qualityControl/PQC/DetectionProject', component: DetectionProject, name: '检测计划管理'}
        ]
      },
      {
        path: '/qualityControl/FQC',
        component: Blank,
        name: 'FQC管理',
        leaf: false,
        children: [
          {path: '/qualityControl/FQC/ClearTemplate', component: ClearTemplate, name: '出货报告模板管理'},
          {path: '/qualityControl/FQC/ClearReport', component: ClearReport, name: '电芯出货报告'}
        ]
      }
    ]
  },
  {
    path: '/reports',
    component: Home,
    name: '报表管理',
    iconClass: 'fa fa-file-excel-o',
    children: [
      {
        path: '/reports/m',
        component: Blank,
        name: '生产报表',
        leaf: false,
        children: [
          {path: '/reports/m/batteryCells', component: Index, name: '电芯数据查询报表'},
          {path: '/reports/m/productionProcesses', component: Index, name: '工序生产报表'},
          {path: '/reports/m/planGoalRate', component: Index, name: '计划达成率报表'}
        ]
      },
      {
        path: '/reports/devices',
        component: Blank,
        name: '设备报表',
        leaf: false,
        children: [
          {path: '/reports/devices/OEE', component: Index, name: '设备OEE报表'},
          {path: '/reports/devices/error', component: Index, name: '设备异常报表'},
          {path: '/reports/devices/maintenance', component: Index, name: '设备维修报表'}
        ]
      },
      {
        path: '/reports/quality',
        component: Blank,
        name: '质量报表',
        leaf: false,
        children: [
          {path: '/reports/quality/IQC/good', component: Index, name: 'IQC优率报表'},
          {path: '/reports/quality/IQC/bad', component: Index, name: 'IQC不良内容统计及分布'},
          {path: '/reports/quality/PQC/good', component: Index, name: 'PQC优率报表'},
          {path: '/reports/quality/PQC/bad', component: Index, name: 'PQC不良内容统计及分布'},
          {path: '/reports/quality/FQC', component: Index, name: 'FQC优率报表'},
          {path: '/reports/quality/processGoodRate', component: Index, name: '工序优率及不良率'},
          {path: '/reports/quality/badProductDistribution', component: Index, name: '综合坏品及坏品分布'},
          {path: '/reports/quality/worksheetGoodRate', component: Index, name: '工单优率及不良率'},
          {path: '/reports/quality/badWorksheetDistribution', component: Index, name: '工单坏品及坏品分布'}
        ]
      }
    ]
  },
  {
    path: '/board',
    component: Home,
    name: '看板管理',
    iconClass: 'fa fa-clone',
    leaf: false,
    children: [
      {
        path: '/board/display',
        component: Blank,
        name: '看板展示',
        leaf: false,
        children: [
          {path: '/board/display/propagand', component: DisplayBoard, name: '宣传看板', leaf: true, children: [], meta: {type: '宣传看板'}},
          {path: '/board/display/produce', component: DisplayBoard, name: '生产看板', leaf: true, children: [], meta: {type: '生产看板'}},
          {path: '/board/display/device', component: DisplayBoard, name: '设备看板', leaf: true, children: [], meta: {type: '设备看板'}},
          {path: '/board/display/quality', component: DisplayBoard, name: '质量看板', leaf: true, children: [], meta: {type: '质量看板'}},
          {path: '/board/display/craft', component: DisplayBoard, name: '工艺看板', leaf: true, children: [], meta: {type: '工艺看板'}}
        ]
      },
      {
        path: '/board/config',
        component: Blank,
        name: '看板配置',
        leaf: false,
        children: [
          {path: '/board/config/propagand', component: DisplayBoardConfig, name: '宣传看板配置', leaf: true, children: [], meta: {type: '宣传看板'}},
          {path: '/board/config/produce', component: DisplayBoardConfig, name: '生产看板配置', leaf: true, children: [], meta: {type: '生产看板'}},
          {path: '/board/config/device', component: DisplayBoardConfig, name: '设备看板配置', leaf: true, children: [], meta: {type: '设备看板'}},
          {path: '/board/config/quality', component: DisplayBoardConfig, name: '质量看板配置', leaf: true, children: [], meta: {type: '质量看板'}},
          {path: '/board/config/craft', component: DisplayBoardConfig, name: '工艺看板配置', leaf: true, children: [], meta: {type: '工艺看板'}}
        ]
      },
      {path: '/board/config/notification', component: DisplayBoardNotificationConfig, name: '消息通知', leaf: true}
    ]
  },
  {
    path: '/trace',
    component: Home,
    name: '追溯模块',
    iconClass: 'fa fa-external-link',
    children: [
      {path: '/trace/worksheet', component: Index, name: '工单追溯', leaf: true},
      {path: '/trace/forward', component: Index, name: '正向追溯', leaf: true},
      {path: '/trace/backward', component: Index, name: '逆向追溯', leaf: true}
    ]
  },
  {
    path: '/SPC',
    component: Home,
    name: 'SPC',
    iconClass: 'fa fa-line-chart',
    children: [
      {path: '/SPC/DAQ', component: Index, name: '数据采集', leaf: true}
    ]
  }
]

export default routes
