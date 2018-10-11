<template>
    <el-dialog :visible.sync="visibleDialog" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">调拨登记</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{ formatDate(data.recipt_date, 'yyyy-MM-dd') }}</span>
          <span class="el-dialog__title">单据编号：{{ data.recipt_number }}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:24px;">基础信息</span>
        </el-col>
      </el-row>
      <el-form :inline="true" :model="axiosData" @submit.native.prevent>
        <el-col class="p-2" :span="12">
        <el-form-item> 
          <span >记录人:{{ data.recorder_name }}</span>
        </el-form-item>
        </el-col>
        <el-col class="p-2" :span="12">
        <el-form-item  class="text-right">
          <span style="font-size：15px;">调出仓库:</span>
          <el-select  size="medium" v-model="data.warehouse_name"  style="width:120px" @focus="handleSelectWarehouse">
        
          </el-select>
        </el-form-item>
         </el-col>
         <el-col class="toolbar" :span="24" >
          <span style="font-size：15px;">已选择物料</span>
         </el-col>
        <el-table :data="selectedList" highlight-current-row
           v-loading="selectedLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column>
        <el-table-column prop="" label="单位" ></el-table-column>
        <el-table-column prop="" label="物料批次号" ></el-table-column>
        <el-table-column prop="" label="供应商" ></el-table-column>
        <el-table-column prop="" label="调拨数量" ></el-table-column>
        <el-table-column prop="" label="转入仓库" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <!-- <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button> -->
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleRemove(scope)">移除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <el-row class="toolbar">
        <el-col :span="12" class="text-left"><p style="font-size：20px;">选择物料</p></el-col>
        <el-col :span="4" class="text-right"><el-input placeholder="输入物料名称或规格型号" v-model="axiosData.keyword" @change="getList"></el-input></el-col>
        <el-col :span="4">
          <el-select  v-model="supplier.supplier_name" placeholder="供应商" style="width:120px" @focus="getSupplier" >
          </el-select>
        </el-col>
        <el-col :span="4" class="material-search"><el-button type="primary" size="medium" icon="el-icon-search">查询</el-button></el-col>
        </el-row>
        <el-table :data="list" highlight-current-row
           v-loading="listLoading"
           @selection-change="this.sels = sels" >
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_batch_number" label="物料批次号" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="location_name" label="库位" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-plus"
                       :disabled="selectedIdList.includes(scope.row.finish_product_id + scope.row.warehouse_id + scope.row.finish_product_batch_number)"
                       @click="handleAdd(scope.row)">添加</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24" class="toolbar text-left">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="axiosData.pageSize"
                :total="axiosData.total"
                @current-change="handlePageChange" @size-change="handleSizeChange">
          </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer mt-4">
        <el-button size="medium" @click.native="visibleDialog = false">取消</el-button>
        <el-button type="primary" size="medium" :disabled="selectedList.length === 0"
                  @click.native="handleSubmit" :loading="submitLoading">提交</el-button>
      </div>
    </el-dialog>
</template>
<script>
import utils from "@/common/js/utils";
import {
  generateReciptNumber,
  queryMaterialInventory
} from "../../../../api/warehouse";
export default {
  name: "ProductInAdd",
  data() {
    return {
       axiosData: {
        materialName: "",
        warehouseId: "",
        supplierId: "",
        keyword: "",
        page: 1,
        pageSize: 10,
        type: "inventory",
        total: null
      }, 
      list: [],
      visibleDialog: false,
      listLoading: false,
      selectedLoading: false,
      submitLoading: false,
      data: {
        delivery_warehouse_id:'',
        location_id:'',
        location_name:'',
        material_allocate_quantity:'',
        material_batch_number:'',
        material_id:'',
        recorder_id: 'test_recorder_id', // test
        recorder_name: 'test_recorder_name', // test
        supplier_id:'',
        warehouse_id: '',
        recipt_date: new Date().getTime(),
        recipt_number: ''
      },
      selectedList: [],
      supplier:[],
      selectedIdList: [],
    //   allProducts: [],
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
        generateReciptNumber({ type: 'WLDB'}).then(res => {
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
      this.selectedList = []
      this.selectedLocationFlag = false
      this.data.warehouse_id = ''
      this.data.warehouse_name = ''
      this.reset()
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
            this.selectedList.length > 0 && 
            this.selectedLocationFlag
          ) {
          this.$confirm('重新选择仓库会清空你填写的所有库位信息，是否继续？', '提示', { type: 'warning'}).then(action => {
            if (action === 'confirm') {
              this.data.warehouse_id = res.rows[0].warehouse_id
              this.data.warehouse_name = res.rows[0].warehouse_name
              // 清空库位信息
              this.selectedList.forEach(item => {
                item.location_id = ''
                item.location_name = ''
                item.warehouse_id = this.data.warehouse_id
                item.warehouse_name = this.data.warehouse_name
              })
            }
          }).catch(() => {})
        } else {
          this.data.warehouse_id = res.rows[0].warehouse_id
          this.data.warehouse_name = res.rows[0].warehouse_name
          // 重新赋值仓库信息
          this.selectedList.forEach(item => {
            item.warehouse_id = this.data.warehouse_id
            item.warehouse_name = this.data.warehouse_name
          })
        }
      })
    },
    // 获取所有成品基础信息
    // getAll() {
    //   queryFinishProduct({
    //     page: 1,
    //     pageSize: 99999
    //   }).then(res => {
    //     if (res.status === 0) {
    //       this.allProducts = res.map.finishProductInfoDTOs
    //     } else {
    //       this.allProducts = []
    //     }
    //   })
    // },
    // 获取列表
    getList() {
      this.listLoading = true;
      queryMaterialInventory(this.axiosData).then(res => {
        if (res.status === 0) {
          this.axiosData.total = res.map.line;
          this.list = res.map.materialInventoryDTOs;
          this.list.forEach(item => {
            // 生成唯一的id
            item.uniqId = item.finish_product_id + item.warehouse_id + item.finish_product_batch_number
          })
        } else {
          this.list = [];
          this.axiosData.total = 0;
        }
        this.listLoading = false;
      });
    },
    //  页面改变
    handlePageChange(val) {
      this.axiosData.page = val;
      this.getList();
    },
    //  每页数量改变
    handleSizeChange(val) {
      this.axiosData.pageSize = val;
      this.getList();
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.axiosData.page,
        this.axiosData.pageSize,
        index
      );
    },
    reset () {
      this.axiosData = {
        number: '',
        keyword: '',
        category: '',
        type: '',
        model: '',
        page: 1,
        pageSize: 10,
        total: 0
      }
      this.getList()
    },
    // 添加
    handleAdd (row) {
      let data = {
        "finish_product_id": row.finish_product_id,
        "finish_product_name": row.finish_product_name,
        "recipt_date": this.data.recipt_date, // 入库时间
        "recipt_number": this.data.recipt_number, // 单据编号
        "recorder_id": this.data.recorder_id,
        "recorder_name": this.data.recorder_name,
        "warehouse_id": this.data.warehouse_id,
        "warehouse_name": this.data.warehouse_name,
        "finish_product_batch_number": '', // 批次号
        "storage_quantity": '', // 入库数量
        "finish_product_category": row.finish_product_category,
        "finish_product_type": row.finish_product_type,
        "finish_product_model": row.finish_product_model,
        "finish_product_param": row.finish_product_param,
        "location_id": '', // 库位id
        "location_name": '', // 库位名字
        "finish_product_number": row.finish_product_number,
      }
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
    // 选择供应商
      getSupplier(row) {
      this.$mesSupplier
        .show("选择供应商", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: this.selectedIds // 选中的id数组
        })
        .then(res => {
          console.log(res);
          this.supplier = res.rows[0];
          row.supplier_id = res.rows[0].supplier_id
          this.axiosData.supplierId = res.rows[0].supplier_id;
          this.getList();
        });
    },
    // 提交
    handleSubmit () {
      this.submitLoading = true
    //   if (this.checkSelectedList()) {
    //     this.$confirm('确定提交吗？', '提示', { type: 'warning'}).then((action) => {
        //   if (action === 'confirm') {
        //     saveFinishProductStorage({
        //       finishStorages: JSON.stringify(this.selectedList)
        //     }).then(res => {
        //       this.submitLoading = false
        //       if (res.status === 0) {
        //         this.$message.success('添加成功')
        //         this.visibleDialog = false
        //         this.$emit('save')
        //       } else {
        //         this.$message.error(res.msg)
        //       }
        //     })
        //   }
        // }).catch(() => {})
    //   }
    //   this.submitLoading = false
    },
    // 数据校验
    checkSelectedList () {
      for (let i = 0; i < this.selectedList.length; i++) {
        let orderInfo = `第${i + 1}行，`
        let item = this.selectedList[i]
        if (!item.finish_product_batch_number) {
          this.$message.info(orderInfo + `批次号不能为空`)
          return false
        }
        if (!item.storage_quantity) {
          this.$message.info(orderInfo + `入库数量不能为空`)
          return false
        }
        if (!item.location_id) {
          this.$message.info(orderInfo + `库位不能为空`)
          return false
        }
      }
      return true
    }
  }
};
</script>

<style scoped>
</style>