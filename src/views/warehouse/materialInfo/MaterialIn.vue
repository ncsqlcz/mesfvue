<!--刘宇2018/7/3-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="3" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">入库</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" class="text-right">
          <el-form-item>
            <el-select placeholder="是否报废" size="medium" v-model="filters.status"  style="width:120px" @change="getList">
                <el-option v-for="item in options" :value="item.value" :label="item.label" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="所有仓库" size="medium" v-model="warehouseName"  style="width:120px" @focus="getWarehouse">
            </el-select>
          </el-form-item>
          <el-form-item>
             <!-- <el-date-picker  type="date" placeholder="选择开单开始日期" v-model="searchTime" style="width:180px"  @blur="getTime"></el-date-picker>
             <el-date-picker  type="date" placeholder="选择开单结束日期"  v-model="filters.endTime" style="width:180px"  @change="getList"></el-date-picker> -->
             <el-date-picker v-model="searchTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
           <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入记录人姓名" @keyup.native.enter="getList" style="width:140px"></el-input>
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
    <material-table headType="materialin"
                    :meterialList="dataList"
                    :filters="filters"
                    @view="openViewDialog"
                    @edit="openEditDialog"
                    @delete="handleDelete"
                    @record="openRecordDialog">
    </material-table>
    <!--分页 start -->
    <el-col :span="24" class="toolbar">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      :current-page="filters.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="filters.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="filters.total">
    </el-pagination>
    </el-col>
    <!--分页 end -->
    <!--入库登记 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">物料入库</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{recept.reciptDate}}</span>
          <span class="el-dialog__title">单据编号：{{recept.reciptNumber}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:24px;">基础信息</span>
        </el-col>

      </el-row>
      <el-form :inline="true"  @submit.native.prevent>
        <el-col class="p-2" :span="12">
        <el-form-item> 
          <span>记录人:{{getUser.userName}}</span>
        </el-form-item>
        </el-col>
        <el-col class="p-2" :span="12">
        <el-form-item  class="text-right">
          <span style="font-size：15px;">入库仓库:</span>
          <el-select  size="medium" placeholder="请选择" v-model="materiawarehouseName.warehouse_name"  style="width:120px" @focus="getRKWarehouse">
            <!-- <el-option value="" placeholder="请选择"></el-option> -->
          </el-select>
        </el-form-item>
         </el-col>
         <el-col class="toolbar" :span="24" style="margin-top:5px" >
          <span style="font-size：15px;">已选择物料</span>
         </el-col>
        <el-table :data="addmateria" highlight-current-row
           v-loading="visible.addLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" >
          <template slot-scope="scope">
            <el-input type="text" @focus="getSupplier(scope.row)" v-model="scope.row.supplier_name" style="color: #ccc;" placeholder="请选择"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="" label="库位">
          <template slot-scope="scope">
            <el-input type="text" @focus="getLocation(scope.row)" v-model="scope.row.location_name" style="color: #ccc;" placeholder="请选择"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="" label="物料批次号" >
          <template slot-scope="scope">
            <el-input type="text"  v-model="scope.row.material_batch_number" style="color: #ccc;" placeholder="输入批次号"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="" label="入库数量" >
          <template slot-scope="scope">
            <el-input type="text"  v-model="scope.row.storage_quantity" style="color: #ccc;" placeholder="输入数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <el-button type="danger" @click="Delete(scope.row)">移除</el-button>
          </template>
        </el-table-column>
        </el-table>
       <el-row class="toolbar">
        <el-col :span="12" class="text-left"><p style="font-size：20px;">选择物料</p></el-col>
        <el-col :span="7" class="text-right"><el-input placeholder="输入编号或名称" v-model="axiosData.keyword" @change="getMareriaInfo"></el-input></el-col>
        <el-col :span="4" class="material-search"><el-button type="primary" size="medium" icon="el-icon-search" @click="getMareriaInfo">查询</el-button></el-col>
        </el-row>
        <el-table :data="materiaInfo" highlight-current-row
                   v-loading="visible.addLoading"
                   @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="addData(scope.row)" icon="el-icon-plus">添加</el-button>
            <!-- <el-button type="primary" @click="addData(scope.row)" icon="el-icon-plus" v-if="!status" disabled>添加</el-button> -->
          </template>
        </el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24" class="toolbar text-left">
          <el-pagination layout="total, sizes, prev, pager, next" :page-size="axiosData.pageSize"
                :total="axiosData.total"
                @current-change="handlePage" @size-change="handleSize">
          </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false"   @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click="submitData()">提交</el-button>
       </div>
    </el-dialog>
    <!--详情 start-->
    <el-dialog :visible.sync="visible.handleView" :close-on-click-modal="false" @close="" width="75%" height="80%" v-if="choiseFinishedData.length>0">
      <div ref="print"> <!--打印用-->
      <span slot="title" class="el-dialog__title">入库详情</span>
      <div class="print-area w-100">
        <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
          <el-row class="toolbar recording lh-40">
            <el-col class="headedit" :span="4">
              <p class="my-0">记录人：{{ MaterialStorages[0].recorder_name}}</p>
            </el-col>
            <el-col :span="5">
                <p class="my-0">入库名称：{{ MaterialStorages[0].warehouse_name}}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">开单日期:{{ MaterialStorages[0].recipt_date}}</p>
            </el-col>
            <el-col :span="5"  class="headedit">
              <p class="my-0">单据编号:{{ MaterialStorages[0].recipt_number}}</p>
            </el-col>
            <el-col :span="5" class="text-right print-exclude">
              <el-tooltip effect="dark" content="" placement="left">
                <div slot="content">如果打印字段显示不完全，<br/>可调整打印缩放</div>
                <el-button type="primary" size="medium" @click="print">打印</el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>    
        <el-table :data=" MaterialStorages" highlight-current-row
                  v-loading="visible.listLoading"
                  @selection-change="this.sels = sels">
          <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
          <el-table-column prop="material_number" label="物料编号" ></el-table-column>
          <el-table-column prop="material_name" label="物料名称" ></el-table-column>
          <el-table-column prop="material_batch_number" label="物料批次号" ></el-table-column>
          <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
          <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
          <el-table-column prop="storage_quantity" label="入库数量" ></el-table-column>
          <el-table-column prop="material_unit" label="单位" ></el-table-column>
          <el-table-column prop="location_name" label="库位" ></el-table-column>
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
    <el-dialog :visible.sync="visible.handleEdit" :close-on-click-modal="false" @close="" width="75%" height="80%"  v-if="MaterialStorages.length>0">
      <span slot="title" class="el-dialog__title">修改入库信息</span>
      <el-form :inline="true" :model="filters" @submit.native.prevent>
       <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
          <el-row class="toolbar recording">
            <el-col class="headedit" :span="6">
                <p>记录人：{{MaterialStorages[0].recorder_name}}</p>
            </el-col>
            <el-col :span="6">
                <p>仓库：{{MaterialStorages[0].warehouse_name}}</p>
              <!-- <el-form-item label="仓库:" label-position="left">
                <el-input v-model.trim="MaterialStorages[0].warehouse_name" size="medium" placeholder="A仓库" @keyup.native.enter="getList" style="width:140px"></el-input>
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
        <el-table :data="MaterialStorages" highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_batch_number" label="物料批次号" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column>
        <el-table-column prop="supplier_name" label="供应商" >
          <template slot-scope="scope">
             <el-input size="small"   @focus="getSupplier(scope.row)" v-model="scope.row.supplier_name"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="storage_quantity" label="入库数量" >
          <template slot-scope="scope">
             <el-input size="small" v-model="scope.row.storage_quantity"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="location_name" label="库位" ></el-table-column>
        </el-table>
      <!--分页-->
        <el-col :span="24" class="toolbar text-left">
           <el-pagination layout="total, sizes, prev, pager ,next" :page-size="detail.pageSize"
                          :total="detail.total"
                          @current-change="handlePageChange" @size-change="handleSizeChange">
           </el-pagination>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer mt-4">
        <el-button size="medium" @click.native="visible.handleEdit = false"   @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click="isHandle()">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑 end-->

    <!--历史记录-->
    <el-dialog :visible.sync="visible.historyRecord" :close-on-click-modal="false" @close="" width="75%" height="80%" v-if="choiseFinishedData.length>0">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">历史记录</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{choiseFinishedData[0].recipt_date}}</span>
          <span class="el-dialog__title">单据编号：{{choiseFinishedData[0].recipt_number}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar" :span="24">
        <el-col class="text-right">
          <el-select placeholder="请选择修改时间" size="small" @change="getHistory"
                    v-model="historyData.time" style="width: auto;">
            <el-option v-for="value in timeList" :value="value" :label="value" :key="value"></el-option>
          </el-select>
          <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12 class="pt-2"><span style="font-size:18px">记录人：{{choiseFinishedData[0].recorder_name}}</span></el-col>
        <el-col :span=12><span style="font-size:18px">入库仓库：{{choiseFinishedData[0].warehouse_name}}</span></el-col>
      </el-row>
       <el-table :data="choiseFinishedData" highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="material_number" label="物料编号" ></el-table-column>
        <el-table-column prop="material_name" label="物料名称" ></el-table-column>
        <el-table-column prop="material_batch_number" label="物料批次号" ></el-table-column>
        <el-table-column prop="material_model" label="规格/型号" ></el-table-column> 
        <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
        <el-table-column prop="storage_quantity" label="入库数量" ></el-table-column>
        <el-table-column prop="material_unit" label="单位" ></el-table-column>
        <el-table-column prop="location_name" label="库位" ></el-table-column>
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
  queryWarehouse,
  generateReciptNumber,
  querySupplier,
  queryMaterialStorage,
  deleteMaterialStorage,
  historyMaterialStorage,
  modifyMaterialStorage,
  saveMaterialStorage,
  queryMaterial,
  queryHistoryTime
} from "../../../api/warehouse";
import MaterialTable from "./components/MaterialTable.vue";
import { mapGetters } from "vuex";
export default {
  name: "MaterialIn",
  data() {
    return {
      filters: {
        status: "0",
        type: "info",
        keyword: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        time: "",
        total: 0
      },
      detail: {
        status: "",
        type: "detail",
        keyword: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        total: 0
      },
      axiosData: {
        keyword: "",
        page: 1,
        pageSize: 10,
        total: 0
      },
       historyData: {
        reciptNumber: '',
        page: 1,
        pageSize: 10,
        time: "",
        total:0,
      },
      total: 0,
      timeList: [],
      searchTime: "", // 接收所选时间,
      dataList: [],
      warehouseName: "", //仓库数据
      materiawarehouseName: {},
      supplier: {},
      location: {},
      timeList:[],
      // bitchNumber: '',//物料批次号
      // quantity: '', //物料数量
      recept: {},
      recorder_name: "Alan",
      recorder_id: 666,
      materiaInfo: [], //物料信息
      addmateria: [], //点击添加获取到的数据
      status: true, //用来控制添加按钮的有效性
      postName: [], //用占位用
      choiseFinishedData: [{}], //弹出框表格数据使用
      modifySupplierName: "",
      modifyStorageQuantity: "",
      MaterialStorages: [{}], //物料修改是的参数集合
       options: [{ value: "1", label: "已报废" }, { value: "0", label: "正常" }],
      visible: {
        addLoading: false,
        listLoading: false,
        editLoading: false,
        addForm: false,
        handleView: false, ////详情弹出框
        handleEdit: false, //修改弹出框
        historyRecord: false //历史弹出框
      }
      // isAddForm: true
    };
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  components: { MaterialTable },
  mounted() {
    this.getList();
  },
  watch: {},
  methods: {
    doPrint(){
      this.$print(this.$refs.print)
    },
    getTime(val) {
       if (val) {
        this.filters.startTime = this.$root.formatDate(val[0])
        this.filters.endTime = this.$root.formatDate(val[1])
      } else {
        this.filters.startTime = ''
        this.filters.endTime = ''
      }
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
    //  获取物料信息
    getList() {
      this.visible.listLoading = true;
      queryMaterialStorage(this.filters).then(res => {
        console.log(res);
        if (res.status === 0) {
          this.filters.total = res.map.line;
          this.dataList = res.map.materialStorageInfoDTOs;
          this.dataList.map(v => {
            v.recipt_date = utils.formatDate.format(
              new Date(v.recipt_date),
              "yyyy-MM-dd"
            );
          });
        } else {
          this.$message.error(res.msg);
        }
        this.visible.listLoading = false;
      });
    },
    initAll() {
      this.materiawarehouseName = "";
      this.addmateria = [];
      this.supplier = [];
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
    handlePage(val) {
      this.axiosData.page = val;
      this.getMareriaInfo();
    },
    // 新增入库每页数量改变
    handleSize(val) {
      this.axiosData.pageSize = val;
      this.getMareriaInfo();
    },
    //  历史记录每页数量改变
    handleHistorySizeChange(val) {
      this.historyData.pageSize = val;
      this.getHistory();
    },
    handleHistoryPageChange(val) {
      this.historyData.page = val;
      this.getHistory();
    },
    // 重置
    reset() {
      this.filters = {
        status: "0",
        type: "info",
        keyword: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1
      };
      this.warehouseName = "";
      this.searchTime="",
      this.getList();
    },
    // 入库登记
    handleAdd() {
      this.visible.addForm = true;
      generateReciptNumber({ type: "WLRK" }).then(res => {
        if (res.status === 0) {
          this.recept = res.map;
        } else {
          this.$message.error(res.msg);
        }
      });
      this.initAll();
      this.getMareriaInfo();
    },
    // 查询物料信息
    getMareriaInfo() {
      queryMaterial(this.axiosData).then(res => {
        if (res.status === 0) {
          this.axiosData.total = res.map.line;
          this.materiaInfo = res.map.materialInfoDTOs;
        } else if (res.status === 2) {
          this.axiosData.total = 0;
          this.materiaInfo = [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //点击添加获取信息
    addData(row) {
      if(!this.materiawarehouseName){
          this.$message.error("请先选择仓库")
      }else {
      let data = {
        material_batch_number: "",
        supplier_id: "",
        supplier_name: "",
        warehouse_id: "",
        warehouse_name: "",
        recipt_date: this.recept.reciptDate,
        recipt_number: this.recept.reciptNumber,
        recorder_id: this.recorder_id,
        recorder_name: this.recorder_name,
        storage_quantity: "",
        location_id: "",
        location_name: "",
        material_id: row.material_id,
        material_model: row.material_model,
        material_name: row.material_name,
        material_number: row.material_number,
        material_unit: row.material_unit
      };
      this.addmateria.push(data);
      }
    },
    // 移除添加的信息
    Delete(row) {
      console.log(row);
      let index = this.addmateria.findIndex((value, index, arr) => {
        return value.material_id == row.material_id;
      });
      this.addmateria.splice(index, 1);
    },
    // 获取仓库数据
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
          this.warehouseName = res.rows[0].warehouse_name;
          let data = Object.assign(this.filters, {
            warehouseId: res.rows[0].warehouse_id
          });
          this.getList(data);
        });
    },
     getRKWarehouse() {
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
          if (
            this.materiawarehouseName.warehouse_id !==
              res.rows[0].warehouse_id &&
            this.addmateria.length > 0 &&
            this.location
          ) {
            this.$confirm(
              "重新选择仓库会清空你选择的所有信息，是否继续？",
              "提示",
              { type: "warning" }
            ).then(action => {
              if (action === "confirm") {
                this.materiawarehouseName.warehouse_id =
                  res.rows[0].warehouse_id;
                this.materiawarehouseName.warehouse_name =
                  res.rows[0].warehouse_name;
                // 清空信息
                this.addmateria
                  .forEach(item => {
                    item.location_id = "";
                    item.location_name = "";
                  })
              } 
            }).catch(() => {});
          }else {
                console.log(res);
                this.materiawarehouseName = res.rows[0];
              }
        });
    },
    // 获取供应商数据
    getSupplier(row) {
      this.$mesSupplier
        .show("选择供应商", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: [row.supplier_id] // 选中的id数组
        })
        .then(res => {
          this.supplier = res.rows[0];
          row.supplier_id = res.rows[0].supplier_id;
          row.supplier_name = res.rows[0].supplier_name;
        });
    },
    getLocation(row) {
      if(!this.materiawarehouseName.warehouse_id) {
          this.$message.info('请先选择仓库')
      }else{
        this.$mesWareHouseLocation
        .show("选择库位", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: "",
            warehouseId: "6e2a2b42916640c19560edd959560ed4" // 仓库id
          },
          selectedIds: [row.location_id] // 选中的id数组
        })
        .then(res => {
          console.log(res);
          this.location = res.rows[0];
          row.location_id = res.rows[0].location_id;
          row.location_name = res.rows[0].location_name;
        });
      } 
    },
    //点击提交入库信息
    submitData() {
      this.addmateria.forEach(item => {
        item.material_batch_number = item.material_batch_number;
        item.supplier_id = this.supplier.supplier_id;
        item.supplier_name = this.supplier.supplier_name;
        item.storage_quantity = item.storage_quantity;
        item.location_id = this.location.location_id;
        item.location_name = this.location.location_name;
        item.warehouse_id= this.materiawarehouseName.warehouse_id;
        item.warehouse_name= this.materiawarehouseName.warehouse_name;
      });
      let para = {
        materialStorages: JSON.stringify(this.addmateria)
      };
      if(this.checkSelectedList()){
        this.$confirm("确定提交吗？", "提示", { type: "warning" }).then(
        action => {
          if (action === "confirm") {
            saveMaterialStorage(para)
              .then(res => {
                console.log(res);
                if (res.status == 0) {
                  this.$message({
                    message: "入库成功",
                    type: "success"
                  });
                  this.materiawarehouseName = "";
                  this.addmateria = [];
                  this.supplier = [];
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
    checkSelectedList () {
      for (let i = 0; i < this.addmateria.length; i++) {
        let orderInfo = `第${i + 1}行，`
        let item = this.addmateria[i]
        if (!item.storage_quantity) {
          this.$message.info(orderInfo + `出库数量不能为空`)
          return false
        }
        if(!item.supplier_id) {
          this.$message.info(orderInfo + `供应商不能为空`)
          return false
        }
        if(!item.location_id) {
          this.$message.info(orderInfo + `库位不能为空`)
          return false
        }
      }
      return true
    },
    // 报废物料数据
    handleDelete(row) {
      this.$confirm("此操作可能会影响库存量，您确定要继续吗？")
        .then(action => {
          if (action === "confirm") {
            deleteMaterialStorage({ reciptNumber: row.recipt_number }).then(
              res => {
                if (res.status === 0) {
                  this.$message({ message: "报废成功", type: "success" });
                } else {
                  this.$message({ message: "报废失败", type: "error" });
                }
                this.visible.addLoading = false;
                this.getList();
              }
            );
          }
        })
        .catch();
    },
    clearData() {
      setTimeout(() => {
        this.$refs.addForm.resetFields();
      }, 300);
    },
    // 查看详情
    openViewDialog(value) {
      this.visible.handleView = true;
      this.getDetail(value);
    },
    getDetail(value) {
      let data = Object.assign(this.detail, {
        reciptNumber: value.recipt_number
      });
      queryMaterialStorage(data).then(res => {
        console.log(res);

        if (res.status === 0) {
          this.MaterialStorages = res.map.materialStorageDetailDTOs;
          // console.log(this.choiseFinishedData)
          this.detail.total = res.map.materialStorageDetailDTOs.length;
          this.MaterialStorages.map(v => {
            v.recipt_date = utils.formatDate.format(
              new Date(v.recipt_date),
              "yyyy-MM-dd"
            );
          });
          // this.resetForm()
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 修改物料入库信息
    openEditDialog(value) {
      this.visible.handleEdit = true;
      this.initAll();
      this.getDetail(value);
    },
    // 提交修改信息
    isHandle() {
      this.$confirm("修改出库数会影响库存数量是否提交修改？","提示", { type: "warning" }).then(active=>{
        if(active==="confirm"){
          let afterMaterialStorages = {
            afterMaterialStorages: JSON.stringify(this.MaterialStorages)
          };
          modifyMaterialStorage(afterMaterialStorages).then(res => {
            console.log(res);
            if (res.status === 0) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              // this.getList()
              
            } else {
              this.$message.error(res.msg);
            }
            this.visible.handleEdit = false;
          }).catch(()=>{});
        }
      })
      
    },
    // 查看历史记录
    openRecordDialog(value) {
      // console.log(value);
      this.visible.historyRecord = true;
      this.getTimeList(value)
    },
    getTimeList(value){
      this.historyData.reciptNumber=value.recipt_number
      queryHistoryTime({
        type:'WLRK',
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
    getHistory(){
      historyMaterialStorage(this.historyData).then(res => {
        // console.log(res);
        if (res.status == 0) {
          this.choiseFinishedData = res.map.materialStorageRecordDetailList;
          this.choiseFinishedData.map(v => {
            v.recipt_date = utils.formatDate.format(
              new Date(v.recipt_date),
              "yyyy-MM-dd"
            );
          });
          this.total = this.choiseFinishedData.length;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 清空数据,没有起到作用
    resetForm() {
      this.filters = {
        status: "",
        type: "info",
        keyword: "",
        warehouseId: "",
        startTime: "",
        endTime: "",
        reciptNumber: "",
        pageSize: 10,
        page: 1,
        time: ""
      };
    },
    // 打印
    print () {
      utils.print(document.querySelector('.print-area'))
    }
  }
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
.el-input__inner {
  height: 33px;
  font-size: 13px;
  box-shadow: none;
  border: none;
  outline: 0 none;
}
</style>
