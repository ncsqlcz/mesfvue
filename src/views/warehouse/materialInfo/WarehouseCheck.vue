/*
 * @Author: liucz 
 * @Date: 2018-09-17 17:10:36 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-21 16:35:00
 */
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="3" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd()" icon="el-icon-plus">盘点</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" @change="getList"
                        v-model="filters.status" style="width:120px">
              <el-option value="0" label="正常"></el-option>
              <el-option value="1" label="已报废"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="warehouseName" size="medium" placeholder="选择盘点仓库" class="pointer" readonly
                      @click.native="handleSelectWarehouse" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="orderDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="orderDateChange"
              size="medium"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="filters.keyword" size="medium" clearable @clear="getList"
                      placeholder="输入记录人姓名" @keyup.native.enter="getList" style="width:150px"></el-input>
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
    <el-table :data="list" style="width:100%" v-loading="visible.listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="recipt_number" label="单据编号" sortable></el-table-column>
      <el-table-column prop="warehouse_name" label="盘点仓库" sortable></el-table-column>
      <el-table-column prop="recorder_name" label="记录人" sortable></el-table-column>
      <el-table-column prop="recipt_date" label="开单日期" sortable>
        <template slot-scope="scope">
          {{ formatDate(scope.row.recipt_date, 'yyyy-MM-dd') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="380">
          <template slot-scope="scope">
              <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit"
                          :disabled="filters.status === '1'" @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete"
                          :disabled="filters.status === '1'" @click="handleDelete(scope.row)">报废</el-button>
              <el-button type="" size="small" icon="" @click="handleViewHistory(scope.row)">历史记录</el-button>
          </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页 start -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" 
                     :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页 end -->

    <!--新增 start-->
    <WarehouseCheckAdd
      :visible.sync="visible.addDialog"
      @save="getList"
    ></WarehouseCheckAdd>
    <!--新增 end-->

    <!--详情/编辑 start-->
    <WarehouseCheckDetails
      :visible.sync="visible.detailDialog"
      :data="currentRow || {}"
      :recipt-number="currentRow ? currentRow.recipt_number : ''"
      :type="detailsType"
      @save="getList"
    ></WarehouseCheckDetails>
    <!--详情/编辑 end-->
    
    <!--历史记录-->
    <WarehouseCheckHistory
      :visible.sync="visible.historyRecord"
      type="in"
      :data="currentRow || {}"
      :recipt-number="currentRow ? currentRow.recipt_number : ''"
    ></WarehouseCheckHistory>



  </section>
</template>

<script>
import utils from "../../../common/js/utils";
import {
  queryQuantityInventory,
  modifyQuantityInventoryScrap
} from "../../../api/warehouse";
import WarehouseCheckDetails from "./components/WarehouseCheckDetails.vue";
import WarehouseCheckHistory from "./components/WarehouseCheckHistory.vue";
import WarehouseCheckAdd from "./components/WarehouseCheckAdd.vue";

export default {
  name: "product-in",
  data() {
    return {
      filters: {
        type: 'info',
        reciptNumber: '',
        status: '0', // 是否报废（默认为0：未报废  1：已报废）
        keyword: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
        total: 0,
      },
      list: [],
      warehouseName: '', // 选中的仓库名称
      orderDate: null,
      currentRow: null, // 当前行数据
      detailsType: 'details', // 是否是详情

      options: [{ value: "1", label: "是" }, { value: "0", label: "否" }],
      // dataPicker 选择今天之前的时间
      pickerOptions: utils.pickerOptionsBefore2,
      visible: {
        addLoading: false,
        listLoading: false,
        editLoading: false,
        addDialog: false,
        handleView: false,
        editDialog: false,
        historyRecord: false,
        detailDialog: false
      }
    };
  },
  computed: {},
  components: {
    WarehouseCheckDetails,
    WarehouseCheckHistory,
    WarehouseCheckAdd
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 选择仓库
    handleSelectWarehouse () {
      this.$mesWareHouse.show('选择仓库', {
        reRender: false,
        multiple: false,
        params: {
          keyword: ''
        },
        selectedIds: [this.filters.warehouseId]
      }).then(res => {
        console.log(res)
        this.filters.warehouseId = res.rows[0].warehouse_id
        this.warehouseName = res.rows[0].warehouse_name
        this.getList()
      })
    },
    // 日期改变
    orderDateChange (val) {
      if (val) {
        this.filters.startTime = this.$root.formatDate(val[0])
        this.filters.endTime = this.$root.formatDate(val[1])
      } else {
        this.filters.startTime = ''
        this.filters.endTime = ''
      }
      this.getList()
    },
    // 页面改变
    handlePageChange(val) {
      this.filters.page = val;
      this.getList();
    },
    // 每页数量改变
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
    // 重置
    reset() {
      this.warehouseName = ''
      this.orderDate = null
      this.filters = {
        type: 'info',
        reciptNumber: '',
        status: '0', // 是否报废（默认为0：未报废  1：已报废）
        keyword: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
        total: 0,
      };
      this.getList();
    },
    //  获取列表
    getList() {
      this.visible.listLoading = true;
      queryQuantityInventory(this.filters).then(res => {
        if (res.status === 0) {
          this.filters.total = res.map.line
          this.list = res.map.quantityInventoryInfoDTOs
        } else {
          this.filters.total = 0;
          this.list = [];
        }
        this.visible.listLoading = false;
      });
    },
    //新增
    handleAdd(row) {
      this.visible.addDialog = true;
    },
    // 查看详情
    handleView(row) {
      this.detailsType = 'details'
      this.currentRow = row
      this.visible.detailDialog = true
    },
    // 编辑
    handleEdit(row) {
      this.detailsType = 'edit'
      this.currentRow = row
      this.visible.detailDialog = true;
    },
    //历史记录
    handleViewHistory(row) {
      this.currentRow = row
      this.visible.historyRecord = true;
    },
    // 报废
    handleDelete(row) {
      this.$confirm('确定要报废此单据吗？', '提示', { type: 'warning'}).then(action => {
        if (action === 'confirm') {
          modifyQuantityInventoryScrap({ reciptNumber: row.recipt_number }).then(
            res => {
              if (res.status === 0) {
                this.$message.success('报废成功')
                this.getList()
              } else {
                this.$message.success(res.msg)
              }
            }
          )
        }
      }).catch(() => {})
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
</style>
