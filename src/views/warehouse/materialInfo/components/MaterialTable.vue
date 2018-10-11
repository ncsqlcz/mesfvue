<!-- 刘宇2018/7/4-->
<template>
    <!-- 列表表格-->
    <el-table  style="width:100%" :data="meterialList">
        <el-table-column type="index"  width="60" label="序号" :index="getIndex" ></el-table-column>
        <el-table-column prop="recipt_number" label="单据编号" sortable></el-table-column>
        <el-table-column v-if=" headType === 'materialin' " prop="warehouse_name" label="入库仓库" sortable></el-table-column>
        <el-table-column v-if=" headType === 'materialout' " prop="warehouse_name" label="出库仓库" sortable></el-table-column>
        <el-table-column v-if=" headType === 'materialallocation' " prop="" label="调出仓库" sortable></el-table-column>
        <el-table-column v-if=" headType === 'warehousecheck' " prop="" label="盘点仓库" sortable></el-table-column>

        <el-table-column prop="recorder_name" label="记录人" sortable></el-table-column>
        <el-table-column prop="recipt_date" label="开单日期" sortable></el-table-column>
        <el-table-column label="操作" width="400">
            <template slot-scope="scope">
            <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)" v-if="scope.row.status==0">修改</el-button>
            <el-button type="primary" icon="el-icon-edit" size="small" disabled  v-if="scope.row.status==1">修改</el-button>
            <el-button type="danger" size="medium" @click="handleDelete(scope.row)" v-if="scope.row.status==0">报废</el-button>
            <el-button type="danger" size="medium" disabled  v-else="scope.row.status==1">报废</el-button>
            <el-button type="primary" size="small" @click="historyRecord(scope.row)">历史记录</el-button>
            </template>
        </el-table-column>
    </el-table>
    
</template>

<script>
    import utils from "../../../../common/js/utils";
export default {
  props: {
    meterialList: {
      type: Array,
      required: true
    },
    headType: String,
    filters:{
        type:Object,
    }
  },
  // props : ['headType'],
  methods: {
    handleView(row) {
      this.$emit("view", row);
    },
    handleEdit(row) {
      this.$emit("edit", row);
    },
    handleDelete(row) {
      this.$emit("delete", row);
    },
    historyRecord(row) {
      this.$emit("record", row);
    },
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      );
    }
  }
};
</script>
<style>
</style>
