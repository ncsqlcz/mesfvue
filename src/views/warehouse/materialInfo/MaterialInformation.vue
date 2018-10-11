  <!--刘宇  2018/6/28-->
<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="4">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addMaterial">新增供应商</el-button>
      </el-col>
      <!-- 位置偏移 -->
      <el-col class="text-right" :span="20">
        <el-input type="text" placeholder="请输入名称或联系人" size="medium" v-model="req.value" @keyup.native.enter="searchs" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search">查询</el-button>
      </el-col>
    </el-row>
    <!-- 列表-->
     <el-table :data="basicList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80px"> </el-table-column>
            <el-table-column  label="物料名称" prop=""></el-table-column>
            <el-table-column  label="规格/型号" prop=""> </el-table-column>
            <el-table-column  label="单位" prop="" ></el-table-column>
            <el-table-column  label="单位" prop="" ></el-table-column>
            <el-table-column  label="库存量" prop="" ></el-table-column>
            <el-table-column  label="入库仓库" prop=""></el-table-column>
            <el-table-column  label="入库时间" prop=""></el-table-column>

            <el-table-column label="操作" prop="" >
                <template slot-scope="scope">
                <el-button size="small" icon="el-icon-edit" @click="editMaterial(scope.row)" type="primary">修改</el-button>
                <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_material_id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
     </el-table>
     <el-row>
      <el-col class="text-left">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                        :total="filters.total"
                        @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
     </el-row>
  </section>
</template>
<script>
   import utils from "../../../common/js/utils";
    import {
   
    }
    from "../../../api/api";
    import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
    };
  },
  computed: {
    
  },
  mounted() {
  
  },
}
</script>

  <style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}

td.el-table__expanded-cell[class*="cell"] {
  padding: 20px 105px !important;
}

th {
  padding: 5px 0 !important;
}
</style>