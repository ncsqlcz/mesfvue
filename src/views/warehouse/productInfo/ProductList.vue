<template>
  <section>
    <!--搜索 start-->
    <el-row class="toolbar">
      <el-col :span="24" class="text-right">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <!-- <el-form-item>
            <el-select placeholder="请选择" size="medium" @change="getList"
                        v-model="filters.status" style="width:120px">
              <el-option value="0" label="未报废"></el-option>
              <el-option value="1" label="已报废"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <!-- 仅支持扫码枪的input -->
            <!-- <ScanGunInput></ScanGunInput> -->
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="warehouseName" size="medium" placeholder="选择入库仓库" class="pointer" readonly
                      @click.native="handleSelectWarehouse" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="filters.keyword" size="medium" clearable @clear="getList"
                      placeholder="输入成品编号/批次号/名称" @keyup.native.enter="getList" style="width:210px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--搜索 end-->

    <!--列表 start-->
    <el-table :data="list" style="width:100%" v-loading="visible.listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="finish_product_name" label="成品编号" sortable></el-table-column>
      <el-table-column prop="finish_product_name" label="成品名称" sortable></el-table-column>
      <el-table-column prop="finish_product_batch_number" label="成品批次号" sortable></el-table-column>
      <el-table-column prop="finish_product_model" label="型号" sortable></el-table-column>
      <el-table-column prop="inventory_quantity" label="库存量" sortable></el-table-column>
      <el-table-column prop="material_unit" label="单位" sortable></el-table-column>
      <el-table-column prop="warehosue_name" label="入库仓库" sortable></el-table-column>
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

  </section>
</template>

<script>
import utils from "../../../common/js/utils";
import { queryFinishInventory } from "../../../api/warehouse";
import ScanGunInput from '@/components/ScanGunInput.vue'
	export default {
    name: 'ProductList',
    data () {
      return {
        filters: {
          category: '',
          type: '',
          warehouseId: '',
          model: '',
          keyword: '',
          page: 1,
          pageSize: 10,
          onekey:'detail',
          total: 0,
        },
        list: [],
        warehouseName: '',
        visible: {
          listLoading: false,
        }
      }
    },
    components: { ScanGunInput },
    mounted () {
      this.getList()
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
      // 获取列表
      getList() {
        this.visible.listLoading = true;
        queryFinishInventory(this.filters).then(res => {
          console.log(res)
          if (res.status === 0) {
            this.filters.total = res.map.line
            this.list = res.map.finishInventoryDTOs
          } else {
            this.filters.total = 0;
            this.list = [];
          }
          this.visible.listLoading = false;
        });
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
        this.filters = {
          category: '',
          type: '',
          warehouseId: '',
          model: '',
          keyword: '',
          page: 1,
          pageSize: 10,
          total: 0,
        };
        this.getList();
      },
    }
	}
</script>


<style scoped>

</style>
