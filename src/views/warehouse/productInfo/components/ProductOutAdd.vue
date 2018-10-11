/*
 * @Author: liucz 
 * @Date: 2018-09-13 11:10:13 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-19 17:36:23
 */
<template>
    <!--详情 start-->
    <el-dialog :visible.sync="visibleDialog" @close="" width="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">出库登记</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{ formatDate(data.recipt_date, 'yyyy-MM-dd') }}</span>
          <span class="el-dialog__title">单据编号：{{ data.recipt_number }}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:18px;">基础信息</span>
        </el-col>
      </el-row>

      <div class="p-2 flex-wrap" style="line-height: 36px">
        <div class="w-50">
          <span>记录人: {{ data.recorder_name }}</span>
        </div>
        <div class="w-50">
          <span>出库仓库: </span>
          <el-input size="medium" v-model="data.warehouse_name" class="pointer" style="width: 200px;"
                    placeholder="点击选择" readonly @click.native="handleSelectWarehouse"></el-input>
        </div>
      </div>

      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size：15px;">已选择成品</span>
        </el-col>
      </el-row>
      <el-table :data="selectedList" highlight-current-row
                  v-loading="selectedLoading"
                  @selection-change="this.sels = sels">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="finish_product_number" label="成品编号" ></el-table-column>
        <el-table-column prop="finish_product_name" label="成品名称" ></el-table-column>
        <!-- <el-table-column prop="finish_product_category" label="成品种类" ></el-table-column>
        <el-table-column prop="finish_product_type" label="成品类型" ></el-table-column> -->
        <el-table-column prop="finish_product_model" label="型号" ></el-table-column>
        <!-- <el-table-column prop="finish_product_param" label="成品参数" ></el-table-column> -->
        <!-- <el-table-column prop="finish_product_batch_number" label="成品批次号" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.finish_product_batch_number" placeholder="请输入"
                       size="small" style="width: 100px;"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column prop="finish_delivery_quantity" label="出库数量" >
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.finish_delivery_quantity" size="small"
                              :controls="false" style="width: 80px;"
                              :min="0" :max="parseFloat(scope.row.inventory_quantity)"></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="location_name" label="库位" >
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.location_name" class="pointer" style="width: 100px;"
                    placeholder="选择库位" readonly @click.native="handleSelectLocation(scope.row)"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <!-- <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleRemove(scope)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <p> </p>
      <el-row class="toolbar">
        <el-col :span="4" class="lh-40">
          <span style="font-size：18px;">请选择成品</span>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form :model="filters" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-select placeholder="所有种类" size="medium" @change="getList"
                          v-model="filters.category" style="width:120px">
                <el-option v-for="value in allProducts" 
                          :value="value.finish_product_category"
                          :label="value.finish_product_category"
                          :key="value.finish_product_category"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select placeholder="所有类型" size="medium" @change="getList"
                          v-model="filters.type" style="width:120px">
                <el-option v-for="value in allProducts" 
                          :value="value.finish_product_type" :label="value.finish_product_type" :key="value.finish_product_type"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select placeholder="型号" size="medium" @change="getList"
                          v-model="filters.model" style="width:120px">
                <el-option v-for="value in allProducts" 
                          :value="value.finish_product_model"
                          :label="value.finish_product_model"
                          :key="value.finish_product_model"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input size="medium" v-model="filters.keyword" placeholder="输入编号或名称" style="width: 150px;"
                        @keyup.native.enter="getList" clearable @clear="getList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
              <el-button size="medium" @click="reset">重置</el-button>
            </el-form-item>
         </el-form>
        </el-col>
      </el-row>
      <el-table :data="list" highlight-current-row v-loading="listLoading">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="finish_product_number" label="成品编号" ></el-table-column>
        <el-table-column prop="finish_product_name" label="成品名称" ></el-table-column>
        <!-- <el-table-column prop="finish_product_category" label="成品种类" ></el-table-column>
        <el-table-column prop="finish_product_type" label="成品类型" ></el-table-column> -->
        <el-table-column prop="finish_product_model" label="型号" ></el-table-column>
        <!-- <el-table-column prop="finish_product_param" label="成品参数" ></el-table-column> -->
        <el-table-column prop="inventory_quantity" label="库存量" ></el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" style="width: 100px;">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-plus"
                       :disabled="selectedIdList.includes(scope.row.finish_product_id + scope.row.warehouse_id + scope.row.finish_product_batch_number)"
                       @click="handleAdd(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" 
          :page-size="filters.pageSize"
          :total="filters.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer mt-4">
        <el-button size="medium" @click.native="visibleDialog = false">取消</el-button>
        <el-button type="primary" size="medium" :disabled="selectedList.length === 0"
                  @click.native="handleSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--详情 end-->
</template>

<script>
import utils from "@/common/js/utils";
import {
  queryFinishInventory,
  queryFinishProduct,
  saveFinishProductDelivery,
  generateReciptNumber,
} from "@/api/warehouse";
export default {
  name: "ProductInAdd",
  data() {
    return {
      filters: {
        // number: '',
        warehouseId: '',
        keyword: '',
        category: '',
        type: '',
        model: '',
        page: 1,
        pageSize: 10,
        onekey:'detail',
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
      selectedLocationFlag: false, // 已经选择的库位
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  computed: {},
  mounted() {},
  watch: {
    visible(val) {
      this.visibleDialog = val;
      if (val) {
        // 生成工单时间和单据号
        generateReciptNumber({ type: 'CPCK'}).then(res => {
          this.data.recipt_date = new Date(res.map.reciptDate).getTime()
          this.data.recipt_number = res.map.reciptNumber
        })
        this.initData()
        this.getAll()
      }
    },
    visibleDialog(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    // 初始化数据
    initData () {
      this.list = []
      this.selectedList = []
      this.selectedIdList = []
      this.selectedLocationFlag = false
      this.data.warehouse_id = ''
      this.data.warehouse_name = ''
      this.filters={
        // number: '',
        warehouseId: '',
        keyword: '',
        category: '',
        type: '',
        model: '',
        page: 1,
        pageSize: 10,
        onekey:'detail',
        total: 0
      }
      // this.reset()
    },
    // 选择仓库
    handleSelectWarehouse () {
      this.$mesWareHouse.show('选择仓库', {
        reRender: true,
        multiple: false,
        params: {
          keyword: ''
        },
        selectedIds: [this.data.warehouse_id],
      }).then(res => {
        if (
            this.data.warehouse_id !== res.rows[0].warehouse_id &&
            this.selectedList.length > 0
          ) {
          this.$confirm('重新选择仓库已选择的数据，是否继续？', '提示', { type: 'warning'}).then(action => {
            if (action === 'confirm') {
              this.data.warehouse_id = res.rows[0].warehouse_id
              this.data.warehouse_name = res.rows[0].warehouse_name
              // 清空已选择数据
              this.selectedList = []
              this.selectedIdList = []
              this.filters.warehouseId = res.rows[0].warehouse_id
              this.getList()
            }
          }).catch(() => {})
        } else {
          this.data.warehouse_id = res.rows[0].warehouse_id
          this.data.warehouse_name = res.rows[0].warehouse_name
          this.filters.warehouseId = res.rows[0].warehouse_id
          this.getList()
        }
      })
    },
    // 获取所有成品基础信息
    getAll() {
      queryFinishProduct({
        page: 1,
        pageSize: 99999
      }).then(res => {
        if (res.status === 0) {
          this.allProducts = res.map.finishProductInfoDTOs
        } else {
          this.allProducts = []
        }
      })
    },
    // 获取列表
    getList() {
      // if (this.listLoading || this.filters.warehouseId === '') return;
      if(this.filters.warehouseId === ''){
          this.$message.error('请先选择仓库')
      }
      this.listLoading = true;
      queryFinishInventory(this.filters).then(res => {
        if (res.status === 0) {
          this.filters.total = res.map.line;
          this.list = res.map.finishInventoryDTOs;
          this.list.forEach(item => {
            // 生成唯一的id
            item.uniqId = item.finish_product_id + item.warehouse_id + item.finish_product_batch_number
          })
        } else {
          this.list = [];
          this.filters.total = 0;
        }
        this.listLoading = false;
      });
    },
    //  页面改变
    handlePageChange(val) {
      this.filters.page = val;
      this.getList();
    },
    //  每页数量改变
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      );
    },
    reset () {
      this.filters = {
        // number: '',
        warehouseId: this.data.warehouse_id,
        keyword: '',
        category: '',
        type: '',
        model: '',
        page: 1,
        pageSize: 10,
        onekey:'detail',
        total: 0
      }
      this.getList()
    },
    // 添加
    handleAdd (row) {
      let data = {
        "finish_delivery_quantity": '', // 出库数量
        "finish_product_id": row.finish_product_id,
        "location_id": '', // 库位id
        "location_name": '', // 库位名字
        "recipt_date": this.data.recipt_date, // 入库时间
        "recipt_number": this.data.recipt_number, // 单据编号
        "recorder_id": this.data.recorder_id,
        "recorder_name": this.data.recorder_name,
        "warehouse_id": this.data.warehouse_id
      }
      Object.keys(row).forEach(key => {
        data[key] = row[key]
      })
      this.selectedList.push(data)
      this.selectedIdList.push(row.finish_product_id + row.warehouse_id + row.finish_product_batch_number)
    },
    // 移除
    handleRemove (scope) {
      this.selectedIdList.splice(scope.$index, 1)
      this.selectedList.splice(scope.$index, 1)
    },
    // 选择库位
    handleSelectLocation (row) {
      if (this.data.warehouse_id === '') {
        this.$message.info('请先选择仓库')
      } else {
        this.$mesWareHouseLocation.show('选择库位', {
          reRender: true,
          multiple: false,
          params: {
            warehouseId: this.data.warehouse_id
          },
          selectedIds: [row.location_id],
        }).then(res => {
          this.selectedLocationFlag = true
          row.location_id = res.rows[0].location_id
          row.location_name = res.rows[0].location_name
        })
      }
    },
    // 提交
    handleSubmit () {
      this.submitLoading = true
      if (this.checkSelectedList()) {
        let params = this.selectedList.map(row => {
          return {
            "finish_delivery_quantity": row.finish_delivery_quantity, // 出库数量
            "finish_product_id": row.finish_product_id,
            "location_id": '', // 库位id
            "location_name": '', // 库位名字
            "recipt_date": this.data.recipt_date, // 入库时间
            "recipt_number": this.data.recipt_number, // 单据编号
            "recorder_id": this.data.recorder_id,
            "recorder_name": this.data.recorder_name,
            "warehouse_id": this.data.warehouse_id
          }
        })
        this.$confirm('确定提交吗？', '提示', { type: 'warning'}).then((action) => {
          if (action === 'confirm') {
            saveFinishProductDelivery({
              finishDeliveries: JSON.stringify(params)
            }).then(res => {
              this.submitLoading = false
              if (res.status === 0) {
                this.$message.success('成功')
                this.visibleDialog = false
                this.$emit('save')
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }).catch(() => {})
      }
      this.submitLoading = false
    },
    // 数据校验
    checkSelectedList () {
      if (!this.data.warehouse_id) {
        this.$message.info(`请选择仓库`)
        return false
      }
      for (let i = 0; i < this.selectedList.length; i++) {
        let orderInfo = `第${i + 1}行，`
        let item = this.selectedList[i]
        // if (!item.finish_product_batch_number) {
        //   this.$message.info(orderInfo + `批次号不能为空`)
        //   return false
        // }
        if (!item.finish_delivery_quantity) {
          this.$message.info(orderInfo + `出库数量不能为空`)
          return false
        }
        // if (!item.location_id) {
        //   this.$message.info(orderInfo + `库位不能为空`)
        //   return false
        // }
      }
      return true
    }
  }
};
</script>

<style scoped>
</style>