<!--刘宇2018/7/3-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true"
               :model="filters"
               @submit.native.prevent>
        <el-col :span="3"
                class="text-left">
          <el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="handleAdd()"
                       icon="el-icon-plus">调拨</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="text-right">
          <el-form-item>
            <el-select placeholder="是否报废"
                       size="medium"
                       v-model="filters.status"
                       style="width:120px"
                       @change="getList">
              <el-option v-for="item in options"
                         :value="item.value"
                         :label="item.label"
                         :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="filters.keyword"
                      size="medium"
                      placeholder="输入记录人姓名"
                      @keyup.native.enter="getList"
                      style="width:140px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="选择仓库"
                       size="medium"
                       v-model="warehouseName"
                       style="width:120px"
                       @focus="getWarehouse">

            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="getTime"></el-date-picker>
            <!-- <el-date-picker  type="date" placeholder="选择开单开始日期"  style="width:180px"></el-date-picker> -->
            <!-- <el-date-picker  type="date" placeholder="选择开单结束日期"  style="width:180px"></el-date-picker> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="medium"
                       @click="getList"
                       icon="el-icon-search">查询</el-button>
            <el-button size="medium"
                       @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->
    <!--列表 start-->
    <el-table :data="AllocationList"
              highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index"
                       :index="getIndex"
                       width="80"
                       label="序号"></el-table-column>
      <el-table-column prop="recipt_number"
                       label="单据编号"
                       sortable></el-table-column>
      <el-table-column prop="delivery_warehouse_name"
                       label="调出仓库"
                       sortable></el-table-column>
      <el-table-column prop="recorder_name"
                       label="记录人"
                       sortable></el-table-column>
      <el-table-column prop="recipt_date"
                       label="开单日期"
                       sortable></el-table-column>
      <el-table-column label="操作"
                       width="400">
        <template slot-scope="scope">
          <el-button size="small"
                     icon="el-icon-view"
                     @click="handleView(scope.row)">详情</el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="small"
                     @click="handleEdit(scope.row)"
                     v-if="filters.status==0">修改</el-button>
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="small"
                     @click="handleEdit(scope.row)"
                     disabled
                     v-if="scope.row.status === '1' || scope.row.is_on === '1'">修改</el-button>
          <el-button type="danger"
                     size="medium"
                     @click="handleDelete(scope.row)"
                     v-else="filters.status==0">报废</el-button>
          <el-button type="danger"
                     size="medium"
                     @click="handleDelete(scope.row)"
                     disabled
                     v-if="scope.row.status === '1' || scope.row.is_on === '1'">报废</el-button>
          <el-button type="primary"
                     size="small"
                     @click="historyRecord(scope.row)">历史记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->
    <!--分页 start -->
    <el-col :span="24"
            class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next"
                     :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange"
                     @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页 end -->
    <!--调拨登记-->
    <el-dialog :visible.sync="visible.addForm"
               :close-on-click-modal="false"
               @close=""
               width="75%"
               height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">调拨登记</span></el-col>
        <el-col :span="18"
                class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{recipt.reciptDate}}</span>
          <span class="el-dialog__title">单据编号：{{recipt.reciptNumber}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:24px;">基础信息</span>
        </el-col>
      </el-row>
      <el-form :inline="true"
               :model="filters"
               @submit.native.prevent>
        <el-col class="lh-40 py-2"
                :span="12">
          <span>记录人:</span>
        </el-col>
        <el-col class="lh-40 py-2"
                :span="12">
          <span style="font-size：15px;">调出仓库:</span>
          <el-select size="medium"
                     v-model="materiawarehouseName"
                     style="width:120px"
                     @focus="getRKWarehouse">
          </el-select>
        </el-col>
        <el-col class="toolbar"
                :span="24">
          <span style="font-size：15px;">已选择物料</span>
        </el-col>
        <el-table :data="addmateria"
                  highlight-current-row
                  v-loading="visible.addLoading"
                  @selection-change="this.sels = sels"
                  border>
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
                           label="库存数量"></el-table-column>
          <el-table-column prop=""
                           label="调拨数量"
                           width="120px">
            <template slot-scope="scope">
              <el-input-number type="text"
                               v-model="scope.row.material_allocate_quantity"
                               style="color: #ccc; width: 100px;"
                               :min="0"
                               :max="scope.row.inventory_quantity"
                               :controls="false"
                               size="medium"
                               placeholder="输入数量"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="material_unit"
                           label="单位"></el-table-column>
          <el-table-column prop=""
                           label="转入仓库">
            <template slot-scope="scope">
              <el-input type="text"
                        @focus="getAnotherWarehouse(scope.row)"
                        v-model="scope.row.warehouse_name"
                        style="color: #ccc;"
                        placeholder="请选择"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop=""
                           label="库位">
            <template slot-scope="scope">
              <el-input type="text"
                        @focus="getLocation(scope.row)"
                        v-model="scope.row.location_name"
                        style="color: #ccc;"
                        placeholder="请选择"></el-input>
            </template>
          </el-table-column>
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
        <p class="my-0 py-2"></p>
        <!-- 选择物料 -->
        <el-row class="toolbar">
          <el-col :span="4"
                  class="text-left">
            <p style="font-size：20px;"
               class="my-0 lh-40">选择物料</p>
          </el-col>
          <el-col :span="20"
                  class="text-right">
            <el-form :inline="true"
                     :model="filters"
                     @submit.native.prevent>
              <el-form-item>
                <el-input placeholder="输入物料名称或规格型号"
                          v-model="axiosData.keyword"
                          style="width: 200px;"
                          size="medium"
                          @change="getMaterialInventory"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="supplier.supplier_name"
                          size="medium"
                          class="pointer"
                          placeholder="点击选择供应商"
                          readonly
                          @click.native="getSupplier"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           size="medium"
                           icon="el-icon-search"
                           @click="getMaterialInventory">查询</el-button>
                <el-button size="medium"
                           @click="resetMaterial">重置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="MaterialInventoryData"
                  highlight-current-row
                  v-loading="visible.addLoading"
                  @selection-change="this.sels = sels">
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
                           label="库存数量"></el-table-column>
          <el-table-column prop="material_unit"
                           label="单位"></el-table-column>
          <el-table-column prop=""
                           label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         @click="addData(scope.row)"
                         icon="el-icon-plus"
                         :disabled="selectedIdList.includes(scope.row.material_id + scope.row.warehouse_id + scope.row.material_batch_number+scope.row.supplier_id)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24"
              class="toolbar text-left">
        <el-pagination layout="total, sizes, prev, pager ,next"
                       :page-size="axiosData.pageSize"
                       :total="axiosData.total"
                       @current-change="handlePage"
                       @size-change="handleSize">
        </el-pagination>
      </el-col>
      <div slot="footer"
           class="dialog-footer mt-4">
        <el-button size="medium"
                   @click.native="visible.addForm = false"
                   @close="clearData()">取消</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="submitData">提交</el-button>
      </div>
    </el-dialog>
    <!-- <materialTransfer
      :visible.sync="visible.addDialog"
      @save="getList"
    ></materialTransfer> -->
    <!--详情 start-->
    <el-dialog :visible.sync="visible.handleView"
               :close-on-click-modal="false"
               @close=""
               width="75%"
               height="80%"
               v-if="detailList.length>0">
      <div ref="print">
        <span slot="title"
              class="el-dialog__title">调拨详情</span>
        <!-- 可打印区域 -->
        <div class="print-area w-100">
          <el-col :span="24"
                  class="toolbar"
                  style="border：1px solid #ccc">
            <el-row class="toolbar recording lh-40">
              <el-col class="headedit"
                      :span="4">
                <p class="my-0">记录人：{{detailList[0].recorder_name}}</p>
              </el-col>
              <el-col :span="5">
                <p class="my-0">调出仓库：{{detailList[0].delivery_warehouse_name}}</p>
              </el-col>
              <el-col :span="5"
                      class="headedit">
                <p class="my-0">开单日期:{{detailList[0].recipt_date}}</p>
              </el-col>
              <el-col :span="5"
                      class="headedit">
                <p class="my-0">单据编号:{{detailList[0].recipt_number}}</p>
              </el-col>
              <el-col :span="5"
                      class="text-right print-exclude">
                <el-tooltip effect="dark"
                            content=""
                            placement="left">
                  <div slot="content">如果打印字段显示不完全，<br />可调整打印缩放</div>
                  <el-button type="primary"
                             size="medium"
                             @click="print">打印</el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
          <el-table :data="detailList"
                    highlight-current-row
                    v-loading="visible.listLoading"
                    @selection-change="this.sels = sels">
            <el-table-column type="index"
                             :index="getIndex"
                             width="80"
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
            <el-table-column prop="material_allocate_quantity"
                             label="调拨数量"></el-table-column>
            <el-table-column prop="material_unit"
                             label="单位"></el-table-column>
            <el-table-column prop="warehouse_name"
                             label="转入仓库"></el-table-column>
            <el-table-column prop="location_name"
                             label="转入库位"></el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <el-col :span="24"
                class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next"
                         :page-size="detail.pageSize"
                         :total="detail.total"
                         @current-change="handlePageChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </div>
      <div slot="footer"
           class="dialog-footer">
      </div>
    </el-dialog>
    <!--详情 end-->

    <!--修改 start-->
    <el-dialog :visible.sync="visible.handleEdit"
               :close-on-click-modal="false"
               @close=""
               width="75%"
               height="80%"
               v-if="detailList.length>0">
      <span slot="title"
            class="el-dialog__title">修改调拨信息</span>
      <el-form :inline="true"
               :model="filters"
               @submit.native.prevent>
        <el-col :span="24"
                class="toolbar"
                style="border：1px solid #ccc">
          <el-row class="toolbar recording">
            <el-col class="headedit"
                    :span="6">
              <p>记录人：{{detailList[0].recorder_name}}</p>
            </el-col>
            <el-col :span="6">
              <!-- <el-form-item label="仓库:" label-position="left">
                <el-input v-model.trim="filters.staffName" size="medium" placeholder="A仓库" @keyup.native.enter="getList" style="width:140px"></el-input>
              </el-form-item> -->
              <p>调出仓库：{{detailList[0].delivery_warehouse_name}}</p>
            </el-col>
            <el-col :span="6"
                    class="headedit">
              <p>开单日期:{{detailList[0].recipt_date}}</p>
            </el-col>
            <el-col :span="6"
                    class="headedit">
              <p>单据编号:{{detailList[0].recipt_number}}</p>
            </el-col>
          </el-row>
        </el-col>
        <el-table :data="detailList"
                  highlight-current-row
                  v-loading="visible.editLoading"
                  @selection-change="this.sels = sels">
          <el-table-column type="index"
                           :index="getIndex"
                           width="80"
                           label="序号"></el-table-column>
          <el-table-column prop="material_number"
                           label="物料编号"></el-table-column>
          <el-table-column prop="material_name"
                           label="物料名称"></el-table-column>
          <el-table-column prop="material_batch_number"
                           label="物料批次号"></el-table-column>
          <el-table-column prop="material_model"
                           label="规格/型号"></el-table-column>
          <!-- <el-table-column prop="" label="物料批次号" ></el-table-column> -->
          <el-table-column prop="supplier_name"
                           label="供应商"></el-table-column>
          <el-table-column prop="material_allocate_quantity"
                           label="调拨数量">
            <template slot-scope="scope">
              <el-input size="small"
                        v-model="scope.row.material_allocate_quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="material_unit"
                           label="单位"></el-table-column>
          <el-table-column prop="warehouse_name"
                           label="转入仓库"></el-table-column>
          <el-table-column prop="location_name"
                           label="转入库位"></el-table-column>
        </el-table>
        <!--分页-->

        <el-col :span="24"
                class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next"
                         :page-size="filters.pageSize"
                         :total="detail.total"
                         @current-change="handlePageChange"
                         @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="medium"
                   @click.native="visible.handleEdit = false"
                   @close="clearData()">取消</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="isHandle()">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑 end-->

    <!--历史记录-->
    <el-dialog :visible.sync="visible.historyRecord"
               :close-on-click-modal="false"
               @close=""
               width="75%"
               height="80%"
               v-if="choiseFinishedData.length>0">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">历史记录</span></el-col>
        <el-col :span="18"
                class="text-right">
          <span class="el-dialog__title mr-5">开单日期：{{choiseFinishedData[0].recipt_date}}</span>
          <span class="el-dialog__title">单据编号：{{choiseFinishedData[0].recipt_number}}</span>
        </el-col>
      </el-row>
      <el-row class="toolbar"
              :span="24">
        <el-col class="text-right">
          <el-select placeholder="请选择修改时间"
                     size="medium"
                     v-model="historyData.time"
                     style="width:200px"
                     @change="getHistoryData">
            <el-option v-for="value in timeList"
                       :value="value"
                       :label="value"
                       :key="value"></el-option>
          </el-select>
          <el-button type="primary"
                     size="medium"
                     @click="getList"
                     icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12
                class="pt-2"><span style="font-size:18px">记录人：{{choiseFinishedData[0].recorder_name}}</span></el-col>
        <el-col :span=12><span style="font-size:18px">调出仓库：{{choiseFinishedData[0].delivery_warehouse_name}}</span></el-col>
      </el-row>
      <el-table :data="choiseFinishedData"
                highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels"
                border>
        <el-table-column type="index"
                         :index="getIndex"
                         width="80"
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
        <el-table-column prop="material_allocate_quantity"
                         label="调拨数量"></el-table-column>
        <el-table-column prop="material_unit"
                         label="单位"></el-table-column>
        <el-table-column prop="warehouse_name"
                         label="转入仓库"></el-table-column>
        <el-table-column prop="location_name"
                         label="转入库位"></el-table-column>
      </el-table>
      <!--分页-->
      <el-col :span="24"
              class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next"
                       :page-size="filters.pageSize"
                       :total="historyData.total"
                       @current-change="handleHistoryPageChange"
                       @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
      <div slot="footer"
           class="dialog-footer">

      </div>
    </el-dialog>
  </section>
</template>

<script>
import '@/styles/print.css'
import utils from '../../../common/js/utils'
import {
  queryMaterialAllocate,
  generateReciptNumber,
  queryMaterialInventory,
  saveMaterialAllocate,
  queryMaterialAllocateHistory,
  modifyMaterialAllocate,
  modifyMaterialAllocateScrap,
  queryHistoryTime,
  queryMaterialDelivery //查询物料出库情况
} from '../../../api/warehouse'
// import materialTransfer from "./components/materialTransfer.vue";
export default {
  name: 'staff',
  data() {
    // 性别不能为空
    return {
      filters: {
        type: 'info',
        reciptNumber: '',
        status: '0',
        keyword: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        pageSize: 10,
        page: 1,
        total: 0,
        recorder: ''
      },
      detail: {
        type: 'detail',
        reciptNumber: '',
        status: '0',
        keyword: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      axiosData: {
        materialName: '',
        warehouseId: '',
        supplierId: '',
        keyword: '',
        page: 1,
        pageSize: 10,
        type: 'inventory',
        total: 0
      }, //查询库存
      historyData: {
        reciptNumber: '',
        page: 1,
        pageSize: 10,
        time: '',
        total: 0
      },
      timeList: [], //存放修改的时间
      warehouseName: '',
      AllocationList: [],
      detailList: [],
      recipt: {},
      MaterialInventoryData: [],
      materiawarehouseName: null,
      materiaanotherwarehouseName: {},
      supplier: {
        supplier_id: '',
        supplier_name: ''
      },
      location: {},
      selectedIdList: [],
      addmateria: [],
      choiseFinishedData: [],
      FinishedData: [],
      workshopName: [],
      postName: [],
      options: [{ value: '1', label: '已报废' }, { value: '0', label: '正常' }],
      searchTime: [],
      visible: {
        addLoading: false,
        listLoading: false,
        editLoading: false,
        addForm: false,
        handleView: false,
        handleEdit: false,
        historyRecord: false
      },
      isAddForm: true
    }
  },
  computed: {},
  // components:{materialTransfer },
  mounted() {
    this.getList()
  },
  methods: {
    doPrint() {
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
      this.getList()
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
    handlePage(val) {
      this.axiosData.page = val
      this.getMaterialInventory()
    },
    // 新增出库每页数量改变
    handleSize(val) {
      this.axiosData.pageSize = val
      this.getMaterialInventory()
    },
    handleHistoryPageChange(val) {
      this.historyData.page = val
      this.getHistoryData()
    },
    //  历史记录每页数量改变
    handleHistorySizeChange(val) {
      this.historyData.pageSize = val
      this.getHistoryData()
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      )
    },
    getWarehouse() {
      this.$mesWareHouse
        .show('选择仓库', {
          reRender: false, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ''
          },
          selectedIds: this.filters.warehouseId // 选中的id数组
        })
        .then(res => {
          this.warehouseName = res.rows[0].warehouse_name
          let data = Object.assign(this.filters, {
            warehouseId: res.rows[0].warehouse_id
          })
          this.getList(data)
        })
    },
    // 重置
    reset() {
      this.filters = {
        type: 'info',
        reciptNumber: '',
        status: '0',
        keyword: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        pageSize: 10,
        page: 1,
        total: 0
      }
      ;(this.searchTime = ''), this.getList()
    },
    //  获取用户列表
    getList() {
      this.visible.listLoading = true
      queryMaterialAllocate(this.filters).then(res => {
        console.log(res)
        if (res.status === 0) {
          this.filters.total = res.map.line
          this.AllocationList = res.map.materialAllocateInfoList
          this.AllocationList.forEach(item => {
            item.recipt_date = utils.formatDate.format(
              new Date(item.recipt_date),
              'yyyy-MM-dd'
            )
          })
        } else if (res.status === 2) {
          this.filters.total = 0
          this.AllocationList = []
        } else {
          this.$message.error(res.msg)
        }
        this.visible.listLoading = false
      })
      // this.getMateriaOut()
    },
    //调拨登记
    handleAdd(row) {
      this.visible.addForm = true
      generateReciptNumber({ type: 'WLDB' }).then(res => {
        if (res.status === 0) {
          this.recipt = res.map
        } else {
          this.$message.error(res.msg)
        }
      })
      this.initAll()
      // this.getMaterialInventory();
    },
    getMaterialInventory() {
      if (this.axiosData.warehouseId === '') {
        this.$message.info('请先选择调出仓库')
        return false
      }
      queryMaterialInventory(this.axiosData).then(res => {
        console.log(res)
        if (res.status === 0) {
          this.axiosData.total = res.map.line
          this.MaterialInventoryData = res.map.materialInventoryDTOs
        } else if (res.status === 2) {
          this.axiosData.total = 0
          this.MaterialInventoryData = []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getRKWarehouse() {
      this.$mesWareHouse
        .show('选择仓库', {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ''
          },
          selectedIds: [this.axiosData.warehouseId] // 选中的id数组
        })
        .then(res => {
          if (
            this.axiosData.warehouseId !== res.rows[0].warehouse_id &&
            this.addmateria.length > 0 &&
            this.location
          ) {
            this.$confirm(
              '重新选择仓库会清空你选择的所有信息，是否继续？',
              '提示',
              { type: 'warning' }
            )
              .then(action => {
                if (action === 'confirm') {
                  this.materiawarehouseName = res.rows[0].warehouse_name
                  // 清空信息
                  this.addmateria = []
                  this.axiosData.warehouseId = res.rows[0].warehouse_id
                  this.getMaterialInventory()
                  // this.addmateria
                  //   .forEach(item => {
                  //     item.location_id = "";
                  //     item.location_name = "";
                  //     item.delivery_warehouse_id = this.materiawarehouseName.warehouse_id;
                  //   })
                }
              })
              .catch(() => {})
          } else {
            console.log(res)
            this.materiawarehouseName = res.rows[0].warehouse_name
            this.axiosData.warehouseId = res.rows[0].warehouse_id
            this.getMaterialInventory()
          }
        })
    },
    // 获取供应商
    getSupplier(row) {
      this.$mesSupplier
        .show('选择供应商', {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ''
          },
          selectedIds: [this.supplier.supplier_id] // 选中的id数组
        })
        .then(res => {
          console.log(res)
          this.supplier = res.rows[0]
          this.axiosData.supplierId = res.rows[0].supplier_id
          this.getMaterialInventory()
        })
    },
    resetMaterial() {
      this.supplier = {
        supplier_id: '',
        supplier_name: ''
      }
      this.axiosData = {
        materialName: '',
        warehouseId: this.axiosData.warehouseId,
        supplierId: '',
        keyword: '',
        page: 1,
        pageSize: 10,
        type: 'inventory',
        total: 0
      }
      this.getMaterialInventory()
    },
    getAnotherWarehouse(row) {
      this.$mesWareHouse
        .show('选择仓库', {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ''
          },
          selectedIds: [row.warehouse_id] // 选中的id数组
        })
        .then(res => {
          console.log(res)
          this.materiaanotherwarehouseName = res.rows[0]
          row.warehouse_id = res.rows[0].warehouse_id
          row.warehouse_name = res.rows[0].warehouse_name
          this.getMaterialInventory()
        })
    },
    getLocation(row) {
      if (!this.materiaanotherwarehouseName.warehouse_id) {
        this.$message.info('请先选择仓库')
      } else {
        this.$mesWareHouseLocation
          .show('选择库位', {
            reRender: true, // 是否重新渲染
            multiple: false, // 是否多选
            params: {
              // 额外的参数
              keyword: '',
              warehouseId: '6e2a2b42916640c19560edd959560ed4' // 仓库id
            },
            selectedIds: [row.location_id] // 选中的id数组
          })
          .then(res => {
            console.log(res)
            this.location = res.rows[0]
            row.location_id = res.rows[0].location_id
            row.location_name = res.rows[0].location_name
          })
      }
    },
    addData(row) {
      console.log(row)
      let data = {
        delivery_warehouse_id: row.warehouse_id, //转出仓库
        location_id: '', //转入库位id
        location_name: '', //转入库位
        material_allocate_quantity: '', //调拨数量
        material_batch_number: row.material_batch_number,
        inventory_quantity: row.inventory_quantity,
        material_number: row.material_number,
        material_name: row.material_name,
        material_model: row.material_model,
        material_unit: row.material_unit,
        material_id: row.material_id,
        recorder_id: 'test_recorder_id', // test
        recorder_name: 'test_recorder_name', // test
        supplier_id: row.supplier_id,
        supplier_name: row.supplier_name,
        warehouse_id: '', //转入仓库id
        warehouse_name: '', //转入仓库
        recipt_date: this.recipt.reciptDate,
        recipt_number: this.recipt.reciptNumber
      }
      this.addmateria.push(data)
      // console.log(this.addmateria);
      this.selectedIdList.push(
        row.material_id +
          row.warehouse_id +
          row.material_batch_number +
          row.supplier_id
      )
    },
    handleRemove(scope) {
      this.selectedIdList.splice(scope.$index, 1)
      this.addmateria.splice(scope.$index, 1)
    },
    submitData() {
      this.addmateria.forEach(item => {
        item.material_allocate_quantity = item.material_allocate_quantity
      })
      console.log(this.addmateria)
      let para = {
        materialAllocates: JSON.stringify(this.addmateria)
      }
      if (this.checkSelectedList()) {
        this.$confirm('确定提交吗？', '提示', { type: 'warning' }).then(
          action => {
            if (action === 'confirm') {
              saveMaterialAllocate(para)
                .then(res => {
                  console.log(res)
                  if (res.status === 0) {
                    this.$message({
                      message: '出库成功',
                      type: 'success'
                    })
                    this.materiawarehouseName = ''
                    this.addmateria = []
                    this.supplier = []
                    this.getList()
                  } else {
                    this.$message.error(res.msg)
                  }
                })
                .catch(() => {})
            }
            this.visible.addForm = false
          }
        )
      }
    },
    // 初始化数据
    initAll() {
      this.materiawarehouseName = ''
      this.addmateria = []
      this.supplier = []
      this.selectedIdList = []
      this.materiaanotherwarehouseName = {}
      this.axiosData.warehouseId = ''
      this.axiosData.total = 0
      this.MaterialInventoryData = []
    },
    // 查看详情
    handleView(row) {
      this.visible.handleView = true
      this.getMaterialAllocate(row)
    },
    // 查询详情信息
    getMaterialAllocate(value) {
      this.detail.reciptNumber = value.recipt_number
      queryMaterialAllocate(this.detail).then(res => {
        // console.log(res);
        if (res.status === 0) {
          this.detail.total = res.map.line
          this.detailList = res.map.materialAllocateDetailList
          this.detailList.forEach(item => {
            item.recipt_date = utils.formatDate.format(
              new Date(item.recipt_date),
              'yyyy-MM-dd'
            )
          })
          console.log(this.detailList)
        } else if (res.status === 2) {
          this.detail.total = 0
          this.detailList = []
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 修改
    handleEdit(row) {
      this.visible.handleEdit = true
      console.log(row)
      this.getMaterialAllocate(row)
    },
    //历史记录
    historyRecord(row) {
      this.visible.historyRecord = true
      this.getTimeList(row)
    },
    getTimeList(value) {
      this.historyData.reciptNumber = value.recipt_number
      queryHistoryTime({
        type: 'WLDB',
        reciptNumber: value.recipt_number
      }).then(res => {
        console.log(res)
        if (res.status == 0) {
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
          this.getHistoryData()
        }
      })
    },
    getHistoryData() {
      queryMaterialAllocateHistory(this.historyData).then(res => {
        console.log(res)
        if (res.status === 0) {
          this.choiseFinishedData = res.map.materialAllocateRecordDetailList
          this.historyData.total = res.map.count
          this.choiseFinishedData.forEach(item => {
            item.recipt_date = utils.formatDate.format(
              new Date(item.recipt_date),
              'yyyy-MM-dd'
            )
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    isHandle(row) {
      this.$confirm('修改盘点数会影响库存数量是否提交修改？', '提示', {
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.detailList.forEach(item => {
            item.material_allocate_quantity = item.material_allocate_quantity
          })
          let data = {
            afterMaterialAllocates: JSON.stringify(this.detailList)
          }
          modifyMaterialAllocate(data)
            .then(res => {
              console.log(res)
              if (res.status === 0) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.msg)
              }
              this.visible.handleEdit = false
            })
            .catch(() => {})
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要报废此条数据吗？报废后无法查询')
        .then(action => {
          if (action === 'confirm') {
            console.log(row)
            modifyMaterialAllocateScrap({
              reciptNumber: row.recipt_number
            }).then(res => {
              console.log(res)
              if (res.status === 0) {
                this.$message({ message: '报废成功', type: 'success' })
              } else {
                this.$message({ message: '报废失败', type: 'error' })
              }
              this.getList()
            })
          }
        })
        .catch()
    },
    clearData() {
      setTimeout(() => {
        this.$refs.addForm.resetFields()
      }, 300)
    },
    // 数据校验
    checkSelectedList() {
      for (let i = 0; i < this.addmateria.length; i++) {
        let orderInfo = `第${i + 1}行，`
        let item = this.addmateria[i]
        if (!item.material_allocate_quantity) {
          this.$message.info(orderInfo + `调拨数量不能为空`)
          return false
        }
        if (!item.warehouse_id) {
          this.$message.info(orderInfo + `转入仓库不能为空`)
          return false
        }
      }
      return true
    },
    // 打印
    print() {
      utils.print(document.querySelector('.print-area'))
    }
  },
  watch: {}
}
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
  line-height: '36px';
}
.material-search {
  padding-left: 3px;
  margin-top: 3px;
}
</style>
