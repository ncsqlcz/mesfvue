<template>
    <section>
        <el-col class="toolbar">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
                <el-col :span="24" class="text-right">
                    <el-form-item>
                      <el-input v-model.trim="warehouseName" size="medium" placeholder="选择仓库" class="pointer" readonly
                                @click.native="handleSelectWarehouse" style="width:140px"></el-input>
                    </el-form-item>
                     <el-form-item>
                        <el-input v-model.trim="filters.keyword" size="medium" clearable @clear="getList"
                                  placeholder="输入物料名或批次号" @keyup.native.enter="getList" style="width: auto;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
                        <el-button size="medium" @click="reset">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>
        <el-table :data="list" style="width: 100%" center>
            <el-table-column type="index" :index="getIndex" width="60px" label="序号"></el-table-column>
            <el-table-column prop="material_number" label="物料编号" sortable ></el-table-column>
            <el-table-column prop="material_name" label="物料名称" sortable ></el-table-column>
            <el-table-column prop="material_batch_number" label="物料批次号" sortable></el-table-column>
            <el-table-column prop="material_model" label="规格/型号" sortable></el-table-column>
            <el-table-column prop="supplier_name" label="供应商" sortable></el-table-column>
            <el-table-column prop="inventory_quantity" label="库存量" sortable></el-table-column>
            <el-table-column prop="material_unit" label="单位" sortable></el-table-column>
            <el-table-column prop="warehouse_name" label="入库仓库" sortable></el-table-column>
        </el-table> 
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                         :total="filters.total"
                         @current-change="handlePageChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
    </section>
    
</template>
<script>
import utils from "../../../common/js/utils";
import { queryMaterialInventory } from "../../../api/warehouse";
export default {
  data() {
    return {
      filters: {
        materialName: "",
        warehouseId: "",
        supplierId: "",
        keyword: "",
        page: 1,
        pageSize: 10,
        type: "inventory",
        total: 0
      },
      list: [],
      warehouseName: "",
      visible: {
        listLoading: false
      }
    };
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
        this.filters.warehouseId = res.rows[0].warehouse_id
        this.warehouseName = res.rows[0].warehouse_name
        this.getList()
      })
    },
    handlePageChange(val) {
      this.filters.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
     getWarehouse() {
      this.$mesWareHouse
        .show("选择仓库", {
          reRender: true, // 是否重新渲染
          multiple: false, // 是否多选
          params: {
            // 额外的参数
            keyword: ""
          },
          selectedIds: this.selectedIds // 选中的id数组
        })
        .then(res => {
          this.warehouseName = res.rows[0].warehouse_name;
          this.filters.warehouseId = res.rows[0].warehouse_id
          this.getList();
        });
    },
    getList() {
      this.visible.listLoading = true
      queryMaterialInventory(this.filters).then(res => {
        if (res.status === 0) {
          this.filters.total = res.map.line;
          this.list = res.map.materialInventoryDTOs;
        } else if (res.status === 2) {
          this.list = [];
          this.filters.total = 0;
        }
        this.visible.listLoading = false
      });
    },
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      );
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
    reset() {
      this.warehouseName = ''
      this.filters = {
        materialName: "",
        warehouseId: "",
        supplierId: "",
        keyword: "",
        page: 1,
        pageSize: 10,
        type: "inventory",
        total: 0
      };
      this.warehouseName= "";
      this.getList();
    }
  }
};
</script>
<style scope>
</style>

