import axios from 'axios'
import qs from 'qs'
import { wareHouseBase } from './base.js'

// 供应商
export const querySupplier = params => { return axios.post(`${wareHouseBase}/warehouseManage/supplier/querySupplier.do`, qs.stringify(params)).then(res => res.data) }
export const saveSupplier = params => { return axios.post(`${wareHouseBase}/warehouseManage/supplier/saveSupplier.do`, qs.stringify(params)).then(res => res.data) }
export const modifySupplier = params => { return axios.post(`${wareHouseBase}/warehouseManage/supplier/modifySupplier.do`, qs.stringify(params)).then(res => res.data) }
export const removeSupplier = params => { return axios.post(`${wareHouseBase}/warehouseManage/supplier/removeSupplier.do`, qs.stringify(params)).then(res => res.data) }
// 仓库
export const saveWarehouse = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/saveWarehouse.do`, qs.stringify(params)).then(res => res.data) }
export const modifyWarehouse = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/modifyWarehouse.do`, qs.stringify(params)).then(res => res.data) }
export const queryWarehouse = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/queryWarehouse.do`, qs.stringify(params)).then(res => res.data) }
export const removeWarehouse = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/removeWarehouse.do`, qs.stringify(params)).then(res => res.data) }
export const saveLocation = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/saveLocation.do`, qs.stringify(params)).then(res => res.data) }
export const queryLocation = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/queryLocation.do`, qs.stringify(params)).then(res => res.data) }
export const removeLocation = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/removeLocation.do`, qs.stringify(params)).then(res => res.data) }
export const modifyLocation = params => { return axios.post(`${wareHouseBase}/warehouseManage/warehouse/modifyLocation.do`, qs.stringify(params)).then(res => res.data) }
// 物料基础信息
export const queryMaterial = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialBasic/queryMaterial.do`, qs.stringify(params)).then(res => res.data) }
export const modifyMaterial = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialBasic/modifyMaterial.do`, qs.stringify(params)).then(res => res.data) }
export const saveMaterial = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialBasic/saveMaterial.do`, qs.stringify(params)).then(res => res.data) }
export const removeMaterial = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialBasic/removeMaterial.do`, qs.stringify(params)).then(res => res.data) }
// 成品基础信息
export const saveFinishProduct = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProduct/saveFinishProduct.do`, qs.stringify(params)).then(res => res.data) }
export const modifyFinishProduct = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProduct/modifyFinishProduct.do`, qs.stringify(params)).then(res => res.data) }
export const queryFinishProduct = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProduct/queryFinishProduct.do`, qs.stringify(params)).then(res => res.data) }
export const removeFinishProduct = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProduct/removeFinishProduct.do`, qs.stringify(params)).then(res => res.data) }
export const queryProductCategoryOrParam = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProduct/queryProductCategoryOrParam.do`, qs.stringify(params)).then(res => res.data) }
// 物料库存
export const queryMaterialStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialStorage/queryMaterialStorage.do`, qs.stringify(params)).then(res => res.data) } // 查詢物料
export const deleteMaterialStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialStorage/modifyMaterialStorageScrap.do`, qs.stringify(params)).then(res => res.data) } // 删除、报废物料
export const historyMaterialStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialStorage/queryMaterialStorageHistory.do`, qs.stringify(params)).then(res => res.data) } // 查看入库历史记录
export const modifyMaterialStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialStorage/modifyMaterialStorage.do`, qs.stringify(params)).then(res => res.data) } // 修改记录
export const saveMaterialStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialStorage/saveMaterialStorage.do`, qs.stringify(params)).then(res => res.data) } // 新增记录
// 成品信息
export const queryFinishProductStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/queryFinishProductStorage.do`, qs.stringify(params)).then(res => res.data) }
export const saveFinishProductStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/saveFinishProductStorage.do`, qs.stringify(params)).then(res => res.data) }
export const modifyFinishProductStorage = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/modifyFinishProductStorage.do`, qs.stringify(params)).then(res => res.data) }
export const queryFinishProductStorageHistory = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/queryFinishProductStorageHistory.do`, qs.stringify(params)).then(res => res.data) }
export const modifyFinishProductStorageScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/modifyFinishProductStorageScrap.do`, qs.stringify(params)).then(res => res.data) }
export const queryFinishInventory = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductStorage/queryFinishInventory.do`, qs.stringify(params)).then(res => res.data) }
export const saveFinishProductDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/saveFinishProductDelivery.do`, qs.stringify(params)).then(res => res.data) }
export const queryFinishProductDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/queryFinishProductDelivery.do`, qs.stringify(params)).then(res => res.data) }
export const modifyFinishProductDeliveryScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/modifyFinishProductDeliveryScrap.do`, qs.stringify(params)).then(res => res.data) }
export const queryFinishProductDeliveryHistory = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/queryFinishProductDeliveryHistory.do`, qs.stringify(params)).then(res => res.data) }
export const modifyFinishProductDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/modifyFinishProductDelivery.do`, qs.stringify(params)).then(res => res.data) }
// 物料出库信息
export const queryMaterialDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/queryMaterialDelivery.do`, qs.stringify(params)).then(res => res.data) } 
export const queryMaterialDeliveryHistory = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/queryMaterialDeliveryHistory.do`, qs.stringify(params)).then(res => res.data) } 
export const modifyMaterialDeliveryScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/modifyMaterialDeliveryScrap.do`, qs.stringify(params)).then(res => res.data) }
export const queryMaterialInventory = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/queryMaterialInventory.do`, qs.stringify(params)).then(res => res.data) } //获取物料库存
export const saveMaterialDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/saveMaterialDelivery.do`, qs.stringify(params)).then(res => res.data) } //获取物料库存
export const modifyMaterialDelivery = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialDelivery/modifyMaterialDelivery.do`, qs.stringify(params)).then(res => res.data) } //获取物料库存
// （WLRK:物料入库，WLCK:物料出库，WLDB:物料调拨，SLPD:盘点，CPRK:成品入库，CPCK:成品出库）
export const queryHistoryTime = params => { return axios.post(`${wareHouseBase}/warehouseManage/finishProductDelivery/queryHistoryTime.do`, qs.stringify(params)).then(res => res.data) }
// （WLRK:物料入库，WLCK:物料出库，WLDB:物料调拨，SLPD:盘点，CPRK:成品入库，CPCK:成品出库）
export const generateReciptNumber = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialBasic/generateReciptNumber.do`, qs.stringify(params)).then(res => res.data) }


//物料调拨
export const queryMaterialAllocate = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/queryMaterialAllocate.do`, qs.stringify(params)).then(res => res.data) }
export const saveMaterialAllocate = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/saveMaterialAllocate.do`, qs.stringify(params)).then(res => res.data) }
export const queryMaterialAllocateHistory = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/queryMaterialAllocateHistory.do`, qs.stringify(params)).then(res => res.data) }
export const modifyMaterialAllocate = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/modifyMaterialAllocate.do`, qs.stringify(params)).then(res => res.data) }
export const modifyMaterialAllocateScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/modifyMaterialAllocateScrap.do`, qs.stringify(params)).then(res => res.data) }
// export const modifyMaterialAllocateScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/materialAllocate/modifyMaterialAllocateScrap.do`, qs.stringify(params)).then(res => res.data) }

// 物料盘点
export const saveQuantityInventory = params => { return axios.post(`${wareHouseBase}/warehouseManage/quantityInventory/saveQuantityInventory.do`, qs.stringify(params)).then(res => res.data) }
export const queryQuantityInventory = params => { return axios.post(`${wareHouseBase}/warehouseManage/quantityInventory/queryQuantityInventory.do`, qs.stringify(params)).then(res => res.data) }
export const modifyQuantityInventoryScrap = params => { return axios.post(`${wareHouseBase}/warehouseManage/quantityInventory/modifyQuantityInventoryScrap.do`, qs.stringify(params)).then(res => res.data) }
export const queryQuantityInventoryHistory = params => { return axios.post(`${wareHouseBase}/warehouseManage/quantityInventory/queryQuantityInventoryHistory.do`, qs.stringify(params)).then(res => res.data) }
export const modifyQuantityInventory = params => { return axios.post(`${wareHouseBase}/warehouseManage/quantityInventory/modifyQuantityInventory.do`, qs.stringify(params)).then(res => res.data) }
