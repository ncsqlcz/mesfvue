<!--刘宇2018/7/3-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="3" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">出库</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" class="text-right">
          <el-form-item>
            <el-select placeholder="是否报废" size="medium" v-model="filters.status"  style="width:120px" @change="getList">
              <el-option v-for="item in options" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
           <el-input v-model.trim="filters.recorder" size="medium" placeholder="输入记录人姓名" @keyup.native.enter="getList" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="出库仓库" size="medium" v-model="warehousename"  style="width:120px" @focus="getWarehouse">
            </el-select>
          </el-form-item>
          <el-form-item>
             <!-- <el-date-picker  type="date" placeholder="选择开单开始日期"  style="width:180px"></el-date-picker>
             <el-date-picker  type="date" placeholder="选择开单结束日期"  style="width:180px"></el-date-picker> -->
             <el-date-picker v-model="searchTime" size="medium" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->
    <!--列表 start-->
    <material-table headType="materialout"
                    :meterialList="dataList"
                    :filters="filters"
                    @view="openViewDialog"
                    @edit="openEditDialog"
                    @delete="openDeleteDialog"
                    @record="openRecordDialog">
      </material-table> 
    <!--分页 start -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页 end -->
    <!--出库登记 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">出库登记</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{recipt.reciptDate}}</span>
          <span class="el-dialog__title">单据编号：{{recipt.reciptNumber}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:24px;">基础信息</span>
        </el-col>
        <!-- <el-col class="text-right" :span="12">
          <el-button type="primary" size="medium"  @click="historyRecord">历史记录</el-button>
        </el-col> -->
      </el-row>
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col class="p-2" :span="12">
        <el-form-item> 
          <span >记录人:</span>
        </el-form-item>
        </el-col>
        <el-col class="p-2" :span="12">
        <el-form-item  class="text-right">
          <span style="font-size：15px;">出库仓库:</span>
          <el-select  size="medium" v-model="materiawarehouseName.warehouse_name" placeholder="请选择"  style="width:120px" @focus="getRKWarehouse">
          <!-- <el-option value="" placeholder="请选择"></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option> -->
          </el-select>
        </el-form-item>
         </el-col>
         <el-col class="toolbar" :span="24" >
          <span style="font-size：15px;">已选择物料</span>
         </el-col>
        <el-table :data="addmateria" highlight-current-row
                  v-loading="visible.addLoading"
                  @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="inventory_quantity" label="库存量" ></el-table-column>
        <el-table-column prop="" label="出库数量" >
           <template slot-scope="scope">
            <el-input type="text"  v-model="scope.row.material_delivery_quantity" style="color: #ccc;" placeholder="请输入"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <el-button type="danger" @click="Delete(scope)">移除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <el-row class="toolbar">
        <el-col :span="8" class="text-left"><p style="font-size：20px;">选择物料</p></el-col>
        <el-col  :span="4" class="text-right">
          <el-select  v-model="supplier.supplier_name" placeholder="供应商" style="width:120px" @focus="getSupplier" >
          </el-select>
        </el-col>
        <el-col :span="6" class="text-right"><el-input v-model="axiosData.keyword"  placeholder="输入编号或名称" @change="getMaterialInventory"></el-input></el-col>
        <el-col :span="4" class="material-search"><el-button type="primary" size="medium" icon="el-icon-search" @click="getMaterialInventory">查询</el-button> </el-col>
        </el-row>
        <el-table :data="MaterialInventoryData" highlight-current-row
                  v-loading="visible.addLoading"
                  @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="inventory_quantity" label="库存量" ></el-table-column>
         <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" @click="addData(scope.row)" icon="el-icon-plus" :disabled="selectedList.includes(scope.row.material_id+scope.row.supplier_id+scope.row.warehouse_id+scope.row.material_batch_number)">添加</el-button>
            <!-- <el-button type="primary" @click="addData(scope.row)" icon="el-icon-plus" v-if="!status" disabled>添加</el-button> -->
          </template>
        </el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24" class="toolbar text-left">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                :total="axiosData.total"
                @current-change="handlePage" 
                @size-change="handleSize">
          </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false"   @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click="submitData">提交</el-button>
       </div>
    </el-dialog>
    <!--出库登记 end -->

    <!--详情 start-->
    <el-dialog :visible.sync="visible.handleView" :close-on-click-modal="false" @close="" width="75%" height="80%" v-if="MaterialStorages.length>0">
      <div ref="print">
      <span slot="title" class="el-dialog__title">物料出库详情</span>
      <div class="print-area w-100">
        <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
          <el-row class="toolbar recording">
            <el-col class="headedit" :span="4">
              <p class="my-0">记录人：{{MaterialStorages[0].recorder_name}}</p>
            </el-col>
            <el-col :span="5">
                <p class="my-0">出库仓库：{{MaterialStorages[0].warehouse_name}}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">开单日期:{{MaterialStorages[0].recipt_date}}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">单据编号:{{MaterialStorages[0].recipt_number}}</p>
            </el-col>
            <el-col :span="5" class="text-right print-exclude">
              <el-tooltip effect="dark" content="" placement="left">
                <div slot="content">如果打印字段显示不完全，<br/>可调整打印缩放</div>
                <el-button type="primary" size="medium" @click="print">打印</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>    
        <el-table :data="detailMaterialStorages" highlight-current-row
                v-loading="visible.listLoading"
                @selection-change="this.sels = sels">
          <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
          <el-table-column prop="material_number" label="物料编号" ></el-table-column>
          <el-table-column prop="material_name" label="物料名称" ></el-table-column>
          <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
          <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
          <el-table-column prop="material_delivery_quantity" label="出库数量" ></el-table-column>
          <el-table-column prop="material_unit" label="单位" ></el-table-column>
          <!-- <el-table-column label="操作" ></el-table-column> -->
        </el-table>
      </div>
      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" 
          :page-size="filters.pageSize"
          :total="detail.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
      </div>
      <div slot="footer" class="dialog-footer">
        
      </div>
    </el-dialog>
    <!--详情 end-->

     <!--修改 start-->
    <el-dialog :visible.sync="visible.handleEdit" :close-on-click-modal="false" @close="clearModifyData()" width="75%" height="80%" v-if="MaterialStorages.length>0">
      <span slot="title" class="el-dialog__title">修改出库信息</span>
      <el-form :inline="true" :model="filters" @submit.native.prevent>
       <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
          <el-row class="toolbar recording">
            <el-col class="headedit" :span="6">
                <p>记录人：{{MaterialStorages[0].recorder_name}}</p>
            </el-col>
            <el-col :span="6">
              <p>仓库：{{MaterialStorages[0].warehouse_name}}</p>
              <!-- <el-form-item label="仓库:" label-position="left">
                <el-input v-model="MaterialStorages[0].warehouse_name" size="medium" placeholder="" @keyup.native.enter="getList" style="width:140px"></el-input>
              </el-form-item> -->
            </el-col>
            <el-col :span="6"  class="headedit">
              <p>开单日期:{{MaterialStorages[0].recipt_date}}</p>
            </el-col>
            <el-col :span="6"  class="headedit">
              <p>单据编号:{{MaterialStorages[0].recipt_number}}</p>
            </el-col>
          </el-row>
       </el-col>    
        <el-table :data="detailMaterialStorages" highlight-current-row
                  v-loading="visible.editLoading"
                  @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="material_delivery_quantity" label="出库数量" >
          <template slot-scope="scope">
             <el-input size="small" v-model="scope.row.material_delivery_quantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        </el-table>
      <!--分页-->
        <el-col :span="24" class="toolbar">
           <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                          :total="detail.total"
                           @current-change="handlePageChange" @size-change="handleSizeChange">
           </el-pagination>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.handleEdit = false"   @close="clearModifyData()">取消</el-button>
        <el-button type="primary" size="medium" @click="isHandle()">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑 end-->

    <!--历史记录-->
    <el-dialog :visible.sync="visible.historyRecord" :close-on-click-modal="false" @close="" width="75%" height="80%" v-if="historydetailRecord.length>0">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">历史记录</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{historydetailRecord[0].recipt_date}}</span>
          <span class="el-dialog__title">单据编号：{{historydetailRecord[0].recipt_number}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar" :span="24">
        <el-col class="text-right">
          <el-select placeholder="选择修改时间" size="medium" v-model="historyData.time" style="width:200px" @change="getHistory">
          <!-- <el-option value=""></el-option> -->
          <el-option v-for="value in timeList" :value="value" :label="value" :key="value"></el-option>
          </el-select>
          <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12 class="pt-2"><span style="font-size:18px">记录人：{{historydetailRecord[0].recorder_name}}</span></el-col>
        <el-col :span=12><span style="font-size:18px">出库仓库：{{historydetailRecord[0].warehouse_name}}</span></el-col>
      </el-row>
       <el-table :data="historyRecord" highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="material_delivery_quantity" label="出库数量" ></el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <!-- <el-table-column prop="location_name" label="库位" ></el-table-column> -->
        </el-table>
         <!--分页-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                         :total="total"
                         @current-change="handleHistoryPageChange" @size-change="handleHistorySizeChange">
          </el-pagination>
        </el-col>
        <div slot="footer" class="dialog-footer">

        </div>
    </el-dialog>

  </section>
</template>

<script>
import '@/styles/print.css'
import utils from "../../../common/js/utils";
import {
  queryMaterialInventory,
  queryMaterialDelivery,
  modifyMaterialDeliveryScrap,
  generateReciptNumber,
  queryMaterialDeliveryHistory,
  saveMaterialDelivery,
  modifyMaterialDelivery,
   queryHistoryTime
} from "../../../api/warehouse";
import MaterialTable from "./components/MaterialTable.vue";
export default {
  data() {
    return {
      filters: {
        status: "0",
        type: "info",
        recorder: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        time: "",
        total: null
      },
      detail: {
        status: 0,
        type: "detail",
        recorder: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        total: null
      },
      axiosData: {
        materialName: "",
        warehouseId: "",
        supplierId: "",
        keyword: "",
        page: 1,
        pageSize: 10,
        type: "inventory",
        total: 0
      }, //查询库存
       historyData: {
        reciptNumber: '',
        page: 1,
        pageSize: 10,
        time: "",
        total:0,
      },
      MaterialInventoryData: [],
      total: 0,
      timeList:[],
      selectedList:[],
      recorder_name: "Alan",
      recorder_id: 666,
      supplier: [], //供应商
      materiawarehouseName: {},
      dataList: [], //出库物料总信息
      MaterialStorages: {}, //出库详情相关数据 单号，记录人等
      detailMaterialStorages: [], //出库详情具体数据
      searchTime: "",
      historyRecord: [], //历史记录具体数据
      historydetailRecord: {}, //历史记录相关数据
      // choiseFinishedData: [],
      // FinishedData: [],
      // postName: [],
      warehousename: "", //出库查询选择仓库
      recipt: {}, //接受出库日期和编号
      options: [
        { value: "1", label: "已报废" },
        { value: "0", label: "正常" },
      ],
      querySearchPostTimeout: null,
      visible: {
        addLoading: false,
        listLoading: false,
        editLoading: false,
        addForm: false,
        handleView: false,
        handleEdit: false,
        historyRecord: false
      },
      addmateria: [],
      modifyPara: []
    };
  },
  computed: {},
  components: { MaterialTable },
  mounted() {
    this.getList();
  },
  methods: {
    // 打印订单详情订单
    doPrint(){
      this.$print(this.$refs.print)
    },
    getTime(val) {
      if (val) {
        this.filters.startTime = this.$root.formatDate(val[0]);
        this.filters.endTime = this.$root.formatDate(val[1]);
      } else {
        this.filters.startTime = "";
        this.filters.endTime = "";
      }
      this.getList();
    },
    //  页面改变
    handlePageChange(val) {
       console.log(val)
      this.filters.page = val;
      this.getList();
    },
    //  每页数量改变
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
      handlePage(val) {
      this.axiosData.page = val;
     this. getMaterialInventory();
    },
       // 新增出库每页数量改变
    handleSize(val) {
      this.axiosData.pageSize = val;
      this.getMaterialInventory();
    },
    handleHistoryPageChange(val) {
      this.historyData.page = val;
      this.getHistory();
    },
    //  历史记录每页数量改变
    handleHistorySizeChange(val) {
      this.historyData.pageSize = val;
      this.getHistory();
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      );
    },
    // 获取仓库信息
    getWarehouse() {
      this.$mesWareHouse
        .show("选择仓库", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: this.filters.warehouseId // 选中的id数组
        })
        .then(res => {
          this.warehousename = res.rows[0].warehouse_name;
          let data = Object.assign(this.filters, {
            warehouseId: res.rows[0].warehouse_id
          });
          this.getList(data);
        });
    },
    // 重置
    reset() {
      this.filters = {
        status: "0",
        type: "info",
        recorder: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        time: ""
      };
      this.warehousename = "";
      this.searchTime="",
      this.getList();
    },
    //  获取用户列表
    getList() {
      this.visible.listLoading = true;
      queryMaterialDelivery(this.filters).then(res => {
        console.log(res);
        if (res.status === 0) {
          this.dataList = res.map.materialDeliveryInfoDTOs;
          this.filters.total = res.map.line;
          this.dataList.map(v => {
            v.recipt_date = utils.formatDate.format(
              new Date(v.recipt_date),
              "yyyy-MM-dd"
            );
          });
        } else if (res.status === 2) {
          this.$message.error(res.msg);
          this.dataList = [];
          this.total = 0;
        } else {
          this.$message.error(res.msg);
        }
        this.visible.listLoading = false;
      });
    },
    //出库登记
    handleAdd(row) {
      this.visible.addForm = true;
      generateReciptNumber({ type: "WLCK" }).then(res => {
        // console.log(res)
        if (res.status === 0) {
          this.recipt = res.map;
        } else {
          this.$message.error(res.msg);
        }
      });
      this.initAll();
      // this.getMaterialInventory();
    },
    // 获取物料库存
    getMaterialInventory() {
      if(this.axiosData.warehouseId === ''){
          this.$message.error('请先选择出库仓库')
      }else{
        queryMaterialInventory(this.axiosData).then(res => {
        console.log(res);
        if (res.status === 0) {
          this.axiosData.total = res.map.line;
          this.MaterialInventoryData = res.map.materialInventoryDTOs;
        } else if (res.status === 2) {
          this.axiosData.total = 0;
          this.MaterialInventoryData = [];
        } else {
          this.$message.error(res.msg);
        }
      });
      }
    },
    // 获取仓库
    getRKWarehouse() {
      this.$mesWareHouse
        .show("选择仓库", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: this.axiosData.warehouseId // 选中的id数组
        })
        .then(res => {
          if (
            this.materiawarehouseName.warehouse_id !==
              res.rows[0].warehouse_id &&
            this.addmateria.length > 0
          ) {
            this.$confirm(
              "重新选择仓库会清空你填写的出库数量，是否继续？",
              "提示",
              { type: "warning" }
            )
              .then(action => {
                if (action === "confirm") {
                  this.materiawarehouseName.warehouse_id =
                    res.rows[0].warehouse_id;
                  this.materiawarehouseName.warehouse_name =
                    res.rows[0].warehouse_name;
                  // 清空信息
                  this.addmateria = [];
                  this.axiosData.warehouseId = res.rows[0].warehouse_id;
                  this.getMaterialInventory();
                }
              })
              .catch(() => {});
          } else {
            console.log(res);
            this.materiawarehouseName = res.rows[0];
            this.axiosData.warehouseId = res.rows[0].warehouse_id;
            this.getMaterialInventory();
          }
        });
    },
    // 获取供应商
    getSupplier(row) {
      this.$mesSupplier
        .show("选择供应商", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: this.axiosData.supplierId // 选中的id数组
        })
        .then(res => {
          console.log(res);
          this.supplier = res.rows[0];
          this.axiosData.supplierId = res.rows[0].supplier_id;
          this.getMaterialInventory();
        });
    },
    addData(row) {
      console.log(row);
      let data = {
        material_delivery_quantity: "",
        material_id: row.material_id,
        recipt_date: this.recipt.reciptDate,
        recipt_number: this.recipt.reciptNumber,
        recorder_id: this.recorder_id,
        recorder_name: this.recorder_name,
        supplier_id: row.supplier_id,
        warehouse_id: this.materiawarehouseName.warehouse_id,
        warehouse_name: this.materiawarehouseName.warehouse_name,
        material_model: row.material_model,
        material_name: row.material_name,
        material_number: row.material_number,
        material_unit: row.material_unit,
        supplier_name: row.supplier_name,
        inventory_quantity:row.inventory_quantity,
        material_batch_number:row.material_batch_number
      };
      this.addmateria.push(data);
      // console.log(this.addmateria)
      this.selectedList.push(
        row.material_id + row.supplier_id + this.materiawarehouseName.warehouse_id+row.material_batch_number
      )
    },
    Delete(row) {
      this.addmateria.splice(row.$index, 1);
      this.selectedList.splice(row.$index, 1)
    },
    submitData() {
      this.addmateria.forEach(item => {
        item.material_delivery_quantity = item.material_delivery_quantity;
      });
      let para = {
        materialDeliveries: JSON.stringify(this.addmateria)
      };
      if (this.checkSelectedList()) {
        this.$confirm("确定提交吗？", "提示", { type: "warning" }).then(
          action => {
            if (action === "confirm") {
              saveMaterialDelivery(para)
                .then(res => {
                  console.log(res);
                  if (res.status == 0) {
                    this.$message({
                      message: "出库成功",
                      type: "success"
                    });
                    this.materiawarehouseName = "";
                    this.addmateria = [];
                    this.supplier = [];
                    this.resetForm();
                    this.getList();
                  } else {
                    this.$message.error(res.msg);
                  }
                })
                .catch(() => {});
            }
            this.visible.addForm = false;
          }
        );
      }
    },
    // 重置axiosData
    resetForm() {
      this.axiosData = {
        materialName: "",
        warehouseId: "",
        supplierId: "",
        keyword: "",
        page: 1,
        pageSize: 10,
        type: "inventory",
        total: 0
      };
    },
    initAll() {
      this.materiawarehouseName = "";
      this.addmateria = [];
      this.supplier = [];
      this.MaterialInventoryData=[];
      this.axiosData.total=0;
      this.axiosData.supplierId="",
      this.axiosData.warehouseId="",
      this.selectedList=[];
    },
    clearData() {
      setTimeout(() => {
        this.$refs.addForm.resetFields();
      }, 300);
    },
    clearModifyData() {
      this.modifyPara = [];
      this.MaterialStorages = [];
      this.detailMaterialStorages = [];
    },
    // 产看物料出库详情页面
    openViewDialog(value) {
      this.visible.handleView = true;
      this.getMaterialDelivery(value);
    },
    getMaterialDelivery(value) {
      let para = Object.assign(this.detail, {
        reciptNumber: value.recipt_number
      });
      queryMaterialDelivery(para).then(res => {
        console.log(res);
        if (res.status === 0) {
          this.MaterialStorages = res.map.materialDeliveryDetailList;
          let StorageData = [];
          this.MaterialStorages.forEach(item => {
            item.materialDeliveryInfoDetailToListDTOs.forEach(data => {
              StorageData.push(data);
            });
          });
          this.detailMaterialStorages = StorageData;
          this.MaterialStorages[0].recipt_date = utils.formatDate.format(
            new Date(this.MaterialStorages[0].recipt_date),
            "yyyy-MM-dd"
          );
          console.log(this.modifyPara);
          this.detail.total = res.map.line;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 进行修改
    openEditDialog(value) {
      this.visible.handleEdit = true;
      this.getMaterialDelivery(value);
    },
    // 提交修改
    isHandle() {
      this.$confirm("修改出库数会影响库存数量是否提交修改？", "提示", {
        type: "warning"
      }).then(action => {
        if (action === "confirm") {
          this.detailMaterialStorages.forEach(item => {
            item.material_delivery_id = item.material_delivery_id;
            item.material_delivery_quantity = item.material_delivery_quantity;
            item.recipt_number = item.recipt_number;
          });
          let afterMaterialStorages = {
            afterMaterialDeliveries: JSON.stringify(this.detailMaterialStorages)
          };
          // console.log(data)
          modifyMaterialDelivery(afterMaterialStorages)
            .then(res => {
              // console.log(res)
              if (res.status === 0) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
              } else {
                this.$message.error(res.msg);
              }
              this.visible.handleEdit = false;
            })
            .catch(() => {});
        }
      });
    },
    // 报废数据
    openDeleteDialog(value) {
      this.$confirm("此操作可能会影响库存量，您确定要继续吗？")
        .then(action => {
          if (action === "confirm") {
            modifyMaterialDeliveryScrap({
              reciptNumber: value.recipt_number
            }).then(res => {
              console.log(res);
              if (res.status === 0) {
                this.$message({ message: "报废成功", type: "success" });
              } else {
                this.$message({ message: "报废失败", type: "error" });
              }
              this.getList();
            });
          }
        })
        .catch();
    },
    // 查看历史记录
    openRecordDialog(value) {
      this.visible.historyRecord = true;
      // this.getHistory(value);
      this.getTimeList(value)
    },
    getTimeList(value){
       this.historyData.reciptNumber=value.recipt_number
      queryHistoryTime({
        type:'WLCK',
        reciptNumber:value.recipt_number
      }).then(res=>{
        console.log(res)
        if(res.status==0){
          res.map.timeList.reverse().forEach((time, index) => {
            res.map.timeList[index] = this.$root.formatDate(time)
          })
          this.timeList = res.map.timeList
          this.timeList = [...new Set(this.timeList)]
          if (this.timeList.length > 0) {
            this.historyData.time = this.timeList[0]
          } else {
            this.historyData.time = ''
          }
          this.getHistory();
        }
      })
    },
    // 获取历史记录
    getHistory() {
      queryMaterialDeliveryHistory(this.historyData).then(res => {
        console.log(res);
        if (res.status == 0) {
          this.historydetailRecord = res.map.materialDeliveryDetailList;
          this.total = res.map.line;
          let StorageData = [];
          this.historydetailRecord.forEach(item => {
            item.materialDeliveryInfoDetailToListDTOs.forEach(data => {
              StorageData.push(data);
            });
          });
          this.historyRecord = StorageData;
          this.historydetailRecord[0].recipt_date = utils.formatDate.format(
            new Date(this.historydetailRecord[0].recipt_date),
            "yyyy-MM-dd"
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 数据校验
    checkSelectedList() {
      for (let i = 0; i < this.addmateria.length; i++) {
        let orderInfo = `第${i + 1}行，`;
        let item = this.addmateria[i];
        if (!item.material_delivery_quantity) {
          this.$message.info(orderInfo + `出库数量不能为空`);
          return false;
        }
      }
      return true;
    },
    // 打印
    print () {
      utils.print(document.querySelector('.print-area'))
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
.add-title {
  span {
    font-size: 16px;
  }
}
.recording {
  padding: 0;
}
.headedit {
  line-height: "36px";
}
.material-search {
  padding-left: 3px;
  margin-top: 3px;
}
</style>
