/*
 * @Author: liucz 
 * @Date: 2018-09-12 16:31:04 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-21 10:54:31
 */
<template>
    <!--详情 start-->
    <el-dialog :visible.sync="visibleDialog" @close="" width="80%">
      <span slot="title" class="el-dialog__title" v-if="editType === 'details'">详情</span>
      <span slot="title" class="el-dialog__title" v-else>修改</span>
      <!-- 可打印区域 -->
      <div class="print-area w-100">
        <el-col :span="24" style="border：1px solid #ccc">
          <el-row class="toolbar recording lh-40">
            <el-col class="headedit" :span="4">
              <p class="my-0">记录人：{{ data.recorder_name }}</p>
            </el-col>
            <el-col :span="5">
                <p class="my-0">盘点仓库{{ data.warehouse_name }}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">开单日期: {{ formatDate(data.recipt_date, 'yyyy-MM-dd') }}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">单据编号: {{ data.recipt_number }}</p>
            </el-col>
            <el-col :span="5" class="text-right print-exclude">
              <el-tooltip effect="dark" content="" placement="left">
                <div slot="content">如果打印字段显示不完全，<br/>可调整打印缩放</div>
                <el-button type="primary" size="medium" @click="print" v-if="editType === 'details'">打印</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>
        <el-table :data="list" highlight-current-row v-loading="listLoading" style="width: 100%;">
          <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
          <el-table-column prop="material_number" label="物料编号" ></el-table-column>
          <el-table-column prop="material_name" label="物料名称" ></el-table-column>
          <el-table-column prop="material_batch_number" label="物料批次号" ></el-table-column>
          <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
          <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
          <el-table-column prop="physical_number" label="账面数" ></el-table-column>
          <!-- 数量 -->
          <el-table-column prop="physical_number" label="盘点数">
            <template slot-scope="scope">
              <el-input-number size="small"
                              v-if="editType === 'edit'"
                              v-model="scope.row[moduleKey[module].num]"
                              @change="handleNumberChange(scope, moduleKey[module].id)"
                              :controls="false" :min="0" style="width: 100px;"
                              class="border-transparent"
                              :class="{'active-border': updatedIdList.includes(scope.row[moduleKey[module].id])}"></el-input-number>
              <span v-else>{{ scope.row[moduleKey[module].num] }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="profit_loss_number" label="盈亏数量"></el-table-column> -->
          <el-table-column prop="profit_loss_number" label="盈亏数量">
            <template slot-scope="scope">
              <span v-if="editType === 'details'">
                {{ scope.row.profit_loss_number }}
              </span>
              <span v-else>
                {{ utils.sub(scope.row.actual_number, scope.row.physical_number) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="material_unit" label="单位" ></el-table-column>
        </el-table>
      </div>
      
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
        <el-button size="medium" @click.native="visibleDialog = false">关闭</el-button>
        <el-button type="primary" size="medium" :disabled="updatedList.length === 0" :loading="submitLoading"
                  @click.native="handleSubmit" v-if="editType === 'edit'">提交</el-button>
      </div>
    </el-dialog>
    <!--详情 end-->
</template>

<script>
import '@/styles/print.css'
import utils from "@/common/js/utils";
import {
  queryQuantityInventory,
  modifyQuantityInventory
} from "@/api/warehouse";
export default {
  name: "WarehouseCheckDetails",
  data() {
    return {
      filters: {
        type: "detail",
        reciptNumber: "",
        status: "",
        page: 1,
        pageSize: 10,
        total: 0
      },
      editType: 'details',
      visibleDialog: false,
      listLoading: false,
      submitLoading: false,
      list: [],
      listCopy: [],
      beforeUpdateList: [], // 修改之前得数据
      updatedList: [], // 修改后的数据
      moduleKey: {
        in: {
          id: 'quantity_inventory_id', // 每行数据的主键
          num: 'actual_number',
          name: '盘点数'
        },
        out: {
          id: 'finish_delivery_id',
          num: 'finish_delivery_quantity',
          name: '出库数量'
        }
      },
      utils: utils
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    reciptNumber: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'details'
    },
    module: {
      type: String,
      default: 'in'
    }
  },
  computed: {
    updatedIdList () {
      return this.updatedList.map(v => v[this.moduleKey[this.module].id])
    }
  },
  mounted() {},
  watch: {
    visible(val) {
      this.visibleDialog = val;
    },
    visibleDialog(val) {
      this.$emit("update:visible", val);
      // 清空相关数据
      if (!val) {
        setTimeout(() => {
          // this.list = []
          // this.listCopy = []
          this.beforeUpdateList = []
          this.updatedList = []
        })
      } else {
        setTimeout(this.getList)
      }
    },
    reciptNumber(val) {
      this.visibleDialog && setTimeout(this.getList)
    },
    type (val) {
      this.editType = val
      this.visibleDialog && setTimeout(this.getList)
    }
  },
  methods: {
    // 获取列表
    getList() {
      this.filters.reciptNumber = this.reciptNumber
      if (this.listLoading) return;
      this.listLoading = true;
      let getListFn = queryQuantityInventory
      // if (this.module === 'out') {
      //   getListFn = queryFinishProductDelivery
      // }
      getListFn(this.filters).then(res => {
        if (res.status === 0) {
          this.filters.total = res.map.line;
          this.list = res.map.QuantityInventoryDetailDTO.quantityInventoryDetailToListDTOs;
          this.listCopy = utils.deepCopy(this.list);

          // 加载之前修改过的数据
          this.updatedList.forEach(item => {
            this.list.forEach(val => {
              if (item[this.moduleKey[this.module].id] === val[this.moduleKey[this.module].id]) {
                val[this.moduleKey[this.module].num] = item[this.moduleKey[this.module].num]
              }
            })
          })
        } else {
          this.list = [];
          this.listCopy = [];
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
    // 打印
    print () {
      utils.print(document.querySelector('.print-area'))
    },
    // 用户输入
    handleNumberChange (scope, key) {
      // 记录之前的数据
      if (!this.beforeUpdateList.some(item => item[key] === scope.row[key])) {
        this.beforeUpdateList.push(utils.deepCopy(this.listCopy[scope.$index]))
      }
      // 记录修改后的数据
      if (!this.updatedList.some(item => item[key] === scope.row[key])) {
        this.updatedList.push(utils.deepCopy(scope.row))
      } else {
        this.updatedList.forEach(item => {
          // 数据重新赋值
          if (item[key] === scope.row[key]) {
            Object.keys(item).forEach(k => {
              item[k] = scope.row[k]
            })
            return true
          }
        })
      }
      // 对比修改前后的数据 - 去掉没有修改的数据
      for (let i = 0; i < this.beforeUpdateList.length; i++) {
        let before = this.beforeUpdateList[i]
        let after = this.updatedList[i]
        if (parseInt(before[this.moduleKey[this.module].num]) === parseInt(after[this.moduleKey[this.module].num])) {
          this.beforeUpdateList.splice(i, 1)
          this.updatedList.splice(i, 1)
          i--
        }
      }
    },
    // 提交
    handleSubmit () {
      this.$confirm('确定提交吗？', '提示', { type: 'warning'}).then((action) => {
        if (action === 'confirm') {
          this.submitLoading = true
          let params = []
          this.updatedList.forEach(item => {
            if (this.module === 'in') {
              params.push({
                "actual_number": item.actual_number,
                "material_inventory_id": item.material_inventory_id,
                "profit_loss_number": utils.sub(item.actual_number, item.physical_number),
                "quantity_inventory_id": this.data.quantity_inventory_id, // 物料盘点id
                "recipt_number": this.data.recipt_number // 单据编号
              })
            } else if (this.module === 'out') {
              // params.push({
              //   "finish_delivery_id": item.finish_delivery_id,
              //   "finish_delivery_quantity": item.finish_delivery_quantity,
              //   "finish_product_id": item.finish_product_id,
              //   "location_id": item.location_id,
              //   "location_name": item.location_name,
              //   "recipt_date": item.recipt_date,
              //   "recipt_number": this.data.recipt_number,
              //   "recorder_id": item.recorder_id,
              //   "recorder_name": item.recorder_name,
              //   "warehouse_id": item.warehouse_id,
              // })
            }
          })
          let updateFn = modifyQuantityInventory
          let data = { afterQuantityInventories: JSON.stringify(params) }
          // if (this.module === 'out') {
          //   updateFn = modifyFinishProductDelivery
          //   data = { afterFinishDeliveries: JSON.stringify(params) }
          // }
          updateFn(data).then(res => {
            this.submitLoading = false
            if (res.status === 0) {
              this.$message.success('已修改')
              this.visibleDialog = false
              this.$emit('save')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      }).catch(() => {})
    }
  }
};
</script>

<style lang="scss">
@import '~scss_vars';
.border-transparent {
  border: 1px solid transparent;
}

// 高亮显示修改之后的input
.active-border input{
  border: 1px solid $color-active;
}
.active-border input:hover{
  border: 1px solid $color-active;
}
</style>