/*
 * @Author: liucz 
 * @Date: 2018-09-13 11:10:13 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-20 15:52:02
 */
<template>
  <!--详情 start-->
  <el-dialog :visible.sync="visibleDialog"
             @close=""
             width="80%"
             :close-on-click-modal="false">
    <el-row class="add-title mb-3">
      <el-col :span="6"><span class="el-dialog__title">盘点登记</span></el-col>
      <el-col :span="18"
              class="text-right">
        <span class="el-dialog__title mr-5">开单日期：{{ formatDate(data.recipt_date, 'yyyy-MM-dd') }}</span>
        <span class="el-dialog__title">单据编号：{{ data.recipt_number }}</span>
      </el-col>
    </el-row>
    <el-row class="toolbar">
      <el-col :span="12">
        <span style="font-size:18px;">基础信息</span>
      </el-col>
    </el-row>

    <div class="p-2 flex-wrap"
         style="line-height: 36px">
      <div class="w-50">
        <span>记录人: {{ data.recorder_name }}</span>
      </div>
      <div class="w-50">
        <span>盘点仓库: </span>
        <el-input size="medium"
                  v-model="data.warehouse_name"
                  class="pointer"
                  style="width: 200px;"
                  placeholder="点击选择"
                  readonly
                  @click.native="handleSelectWarehouse"></el-input>
      </div>
    </div>

    <el-row class="toolbar">
      <el-col :span="12">
        <span style="font-size：15px;">已选择物料</span>
      </el-col>
    </el-row>
    <el-table :data="selectedList"
              highlight-current-row
              v-loading="selectedLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index"
                       width="60"
                       label="序号"></el-table-column>
      <el-table-column prop="material_number"
                       label="物料编号"></el-table-column>
      <el-table-column prop="material_name"
                       label="物料名称"></el-table-column>
      <el-table-column prop="material_batch_number"
                       label="物料批次号"></el-table-column>
      <el-table-column prop="material_model"
                       label="规格/型号"></el-table-column>
      <el-table-column prop="supplier_name"
                       label="供应商"></el-table-column>
      <el-table-column prop="physical_number"
                       label="账面数"></el-table-column>
      <el-table-column prop="actual_number"
                       label="盘点数">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.actual_number"
                           size="small"
                           :controls="false"
                           :min="0"
                           style="width: 80px;"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop=""
                       label="盈亏数量">
        <template slot-scope="scope">
          {{ utils.sub(scope.row.actual_number, scope.row.physical_number) }}
        </template>
      </el-table-column>
      <el-table-column prop="material_unit"
                       label="单位"></el-table-column>
      <!-- <el-table-column prop="location_name" label="库位" >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.location_name" class="pointer" style="width: 100px;"
                    placeholder="选择库位" readonly @click.native="handleSelectLocation(scope.row)"></el-input>
          </template>
        </el-table-column> -->
      <el-table-column prop=""
                       label="操作">
        <template slot-scope="scope">
          <!-- <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     @click="handleRemove(scope)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <p> </p>
    <el-row class="toolbar">
      <el-col :span="4"
              class="lh-40">
        <span style="font-size：18px;">请选择物料</span>
      </el-col>
      <el-col :span="20"
              class="text-right">
        <el-form :model="filters"
                 :inline="true"
                 @submit.native.prevent>
          <el-form-item>
            <el-input size="medium"
                      v-model="filters.keyword"
                      placeholder="输入编号或名称或批次号"
                      style="width: 200px;"
                      @keyup.native.enter="getList"
                      clearable
                      @clear="getList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="getList"
                       icon="el-icon-search">查询</el-button>
            <el-button size="medium"
                       @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table :data="list"
              highlight-current-row
              v-loading="listLoading">
      <el-table-column type="index"
                       :index="getIndex"
                       width="60"
                       label="序号"></el-table-column>
      <el-table-column prop="material_number"
                       label="物料编号"></el-table-column>
      <el-table-column prop="material_name"
                       label="物料名称"></el-table-column>
      <el-table-column prop="material_batch_number"
                       label="物料批次号"></el-table-column>
      <el-table-column prop="material_model"
                       label="规格/型号"></el-table-column>
      <el-table-column prop="supplier_name"
                       label="供应商"></el-table-column>
      <el-table-column prop="inventory_quantity"
                       label="账面数"></el-table-column>
      <el-table-column prop="material_unit"
                       label="单位"></el-table-column>
      <el-table-column prop=""
                       label="操作"
                       style="width: 100px;">
        <template slot-scope="scope">
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     :disabled="selectedIdList.includes(scope.row.material_inventory_id)"
                     @click="handleAdd(scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24"
            class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next"
                     :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <div slot="footer"
         class="dialog-footer mt-4">
      <el-button size="medium"
                 @click.native="visibleDialog = false">取消</el-button>
      <el-button type="primary"
                 size="medium"
                 :disabled="selectedList.length === 0"
                 @click.native="handleSubmit"
                 :loading="submitLoading">提交</el-button>
    </div>
  </el-dialog>
  <!--详情 end-->
</template>

<script>
import utils from '@/common/js/utils'
import {
  queryMaterialInventory,
  saveQuantityInventory,
  generateReciptNumber
} from '@/api/warehouse'
export default {
  name: 'ProductInAdd',
  data() {
    return {
      filters: {
        materialName: '',
        warehouseId: '',
        supplierId: '',
        keyword: '',
        page: 1,
        pageSize: 10,
        type: 'inventory',
        total: 0
      },
      list: [],
      visibleDialog: false,
      listLoading: false,
      selectedLoading: false,
      submitLoading: false,
      data: {
        recorder_id: 'test_recorder_id', // test
        recorder_name: 'test_recorder_name', // test
        warehouse_id: '',
        warehouse_name: '',
        recipt_date: new Date().getTime(),
        recipt_number: ''
      },
      selectedList: [],
      selectedIdList: [],
      allProducts: [],
      utils: utils
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  mounted() {},
  watch: {
    visible(val) {
      this.visibleDialog = val
      if (val) {
        // 生成工单时间和单据号
        generateReciptNumber({ type: 'SLPD' }).then(res => {
          this.data.recipt_date = new Date(res.map.reciptDate).getTime()
          this.data.recipt_number = res.map.reciptNumber
        })
        this.initData()
      }
    },
    visibleDialog(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    // 初始化数据
    initData() {
      this.selectedList = []
      this.selectedIdList = []
      this.data.warehouse_id = ''
      this.data.warehouse_name = ''
      this.reset()
    },
    // 选择仓库
    handleSelectWarehouse() {
      this.$mesWareHouse
        .show('选择仓库', {
          reRender: true,
          multiple: false,
          params: {
            keyword: ''
          },
          selectedIds: [this.data.warehouse_id]
        })
        .then(res => {
          if (this.selectedList.length > 0) {
            this.$confirm(
              '重新选择仓库会清空你填写的所有数据，是否继续？',
              '提示',
              { type: 'warning' }
            )
              .then(action => {
                if (action === 'confirm') {
                  this.data.warehouse_id = res.rows[0].warehouse_id
                  this.data.warehouse_name = res.rows[0].warehouse_name
                  this.selectedList = []
                  this.selectedIdList = []
                  this.filters.warehouseId = res.rows[0].warehouse_id
                  this.getList()
                }
              })
              .catch(() => {})
          } else {
            this.data.warehouse_id = res.rows[0].warehouse_id
            this.data.warehouse_name = res.rows[0].warehouse_name
            this.selectedList = []
            this.selectedIdList = []
            this.filters.warehouseId = res.rows[0].warehouse_id
            this.getList()
          }
        })
    },
    // 获取列表
    getList() {
      if (this.listLoading || this.filters.warehouseId === '') return
      this.listLoading = true
      queryMaterialInventory(this.filters).then(res => {
        if (res.status === 0) {
          this.filters.total = res.map.line
          this.list = res.map.materialInventoryDTOs
        } else {
          this.list = []
          this.filters.total = 0
        }
        this.listLoading = false
      })
    },
    //  页面改变
    handlePageChange(val) {
      this.filters.page = val
      this.getList()
    },
    //  每页数量改变
    handleSizeChange(val) {
      this.filters.pageSize = val
      this.getList()
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      )
    },
    reset() {
      this.filters = {
        materialName: '',
        warehouseId: '',
        supplierId: '',
        keyword: '',
        page: 1,
        pageSize: 10,
        type: 'inventory',
        total: 0
      }
      this.getList()
    },
    // 添加
    handleAdd(row) {
      let data = {
        actual_number: row.inventory_quantity, // 盘点数量初始值
        physical_number: row.inventory_quantity, // 账面数
        material_inventory_id: row.material_inventory_id,
        profit_loss_number: 0,
        recipt_date: this.data.recipt_date,
        recipt_number: this.data.recipt_number,
        recorder_id: this.data.recorder_id,
        recorder_name: this.data.recorder_name,
        warehouse_id: row.warehouse_id
      }
      Object.keys(row).forEach(key => {
        data[key] = row[key]
      })
      this.selectedList.push(data)
      this.selectedIdList.push(row.material_inventory_id)
    },
    // 移除
    handleRemove(scope) {
      this.selectedIdList.splice(scope.$index, 1)
      this.selectedList.splice(scope.$index, 1)
    },
    // 提交
    handleSubmit() {
      this.submitLoading = true
      if (this.checkSelectedList()) {
        this.$confirm('确定提交吗？', '提示', { type: 'warning' })
          .then(action => {
            if (action === 'confirm') {
              let params = this.selectedList.map(row => {
                return {
                  actual_number: row.actual_number,
                  material_inventory_id: row.material_inventory_id,
                  physical_number: row.physical_number,
                  profit_loss_number: utils.sub(
                    row.actual_number,
                    row.physical_number
                  ),
                  recipt_date: this.data.recipt_date,
                  recipt_number: this.data.recipt_number,
                  recorder_id: this.data.recorder_id,
                  recorder_name: this.data.recorder_name,
                  warehouse_id: row.warehouse_id,
                  supplier_id: row.supplier_id
                }
              })
              saveQuantityInventory({
                quantityInventories: JSON.stringify(params)
              }).then(res => {
                this.submitLoading = false
                if (res.status === 0) {
                  this.$message.success('添加成功')
                  this.visibleDialog = false
                  this.$emit('save')
                } else {
                  this.$message.error(res.msg)
                }
              })
            }
          })
          .catch(() => {})
      }
      this.submitLoading = false
    },
    // 数据校验
    checkSelectedList() {
      if (!this.data.warehouse_id) {
        this.$message.info(`请选择仓库`)
        return false
      }
      for (let i = 0; i < this.selectedList.length; i++) {
        let orderInfo = `第${i + 1}行，`
        let item = this.selectedList[i]
        if (!item.actual_number) {
          this.$message.info(orderInfo + `盘点数不能为空`)
          return false
        }
      }
      return true
    }
  }
}
</script>

<style scoped>
</style>