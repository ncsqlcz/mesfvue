  <!--刘宇  2018/6/28-->
<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="4">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addSupplier">新增供应商</el-button>
      </el-col>
      <!-- 位置偏移 -->
      <el-col class="text-right" :span="20">
        <el-input type="text" placeholder="请输入名称或联系人" size="medium" clearable @clear="getData"
                  v-model="filters.keyword" @keyup.native.enter="getData" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="getData">查询</el-button>
      </el-col>
    </el-row>
    <!-- 列表-->
     <el-table :data="dataList" highlight-current-row v-loading="listLoading">
        <el-table-column type="index" label="序号" :index="getIndex" width="60px"> </el-table-column>
            <el-table-column  label="供应商代号" prop="supplier_code" sortable></el-table-column>
            <el-table-column  label="供应商单位名称" prop="supplier_name" sortable> </el-table-column>
            <el-table-column  label="联系人" prop="supplier_contact" sortable ></el-table-column>
            <el-table-column  label="电话" prop="supplier_phone" sortable ></el-table-column>
            <el-table-column  label="邮箱" prop="supplier_email" sortable ></el-table-column>
            <el-table-column  label="地址" prop="supplier_address" sortable></el-table-column>
            <el-table-column label="操作" width="280">
                <template slot-scope="scope">
                <el-button size="small" icon="el-icon-edit" @click="editSupplier(scope.row)" type="primary">修改</el-button>
                <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.supplier_id)" type="danger">弃用</el-button>
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

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="60%">
      <span slot="title" class="el-dialog__title" v-if="editType=='新增'">新增供应商</span>
      <span slot="title" class="el-dialog__title" v-else>编辑供应商信息</span>
      <el-form :model="supplier" label-width="150px" :rules="rules" ref="addForm" class="clearfix" size="small">
        <el-col :span="10">
          <el-form-item label="供应商代号:" prop="supplierCode">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="supplier.supplierCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="供应商单位名称:" prop="supplierName">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="supplier.supplierName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系人:" prop="supplierContact">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="supplier.supplierContact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="电话:" prop="supplierPhone">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="supplier.supplierPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="邮箱:" prop="supplierEmail">
            <el-input auto-complete="off" size="medium" clearable  v-model="supplier.supplierEmail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="地址：" prop="supplierAddress">
            <el-input auto-complete="off" size="medium" clearable v-model="supplier.supplierAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import utils from "../../../common/js/utils";
import {
  querySupplier,
  saveSupplier,
  modifySupplier,
  removeSupplier
} from "../../../api/warehouse";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      listLoading: false,
      filters: {
        keyword: '',
        page: 1,
        pageSize: 10,
        total: 0
      },
      dataList: [{}],
      supplier: {
        supplierCode: "",
        supplierName: "",
        supplierContact: "",
        supplierPhone: "",
        supplierEmail: "",
        supplierAddress: ""
      },
      visible: {
        listLoading: false,
        addForm: false
      },
      rules: {
        supplierCode: [
          { required: true, message: "请输入供应商代号", trigger: "blur" }
        ],
        supplierName: [
          { required: true, message: "请输入单位名称", trigger: "blur" }
        ],
        supplierContact: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        supplierPhone: [
          { required: true, message: "请输入电话", trigger: "blur" }
        ],
        // supplierEmail: [
        //   { required: true, message: "请输入邮箱", trigger: "blur" }
        // ],
        // supplierAddress: [
        //   { required: true, message: "请输入地址", trigger: "blur" }
        // ]
      },
      editType: ""
    };
  },
  computed: {
    ...mapGetters(["getDeviceTypes"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 数据序号
    getIndex(index) {
      return utils.getHeadNumAdapter(
        this.filters.page,
        this.filters.pageSize,
        index
      );
    },
    //  页面改变
    handlePageChange(val) {
      this.filters.page = val;
      this.getData();
    },
    //  每页数量改变
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getData();
    },
    // 列表索引
    getIndex(index) {
      return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
    },
    // 搜索框
    async getData() {
      this.listLoading = true;
      let data = await querySupplier(this.filters);
      if (data.status === 0) {
        this.dataList = data.map.supplierInfoDTOs;
        this.filters.total = data.map.line;
      } else if (data.status === 2) {
        this.dataList = [];
        this.filters.total = 0;
        if (this.filters.page > 1) {
          this.filters.page--
          this.getData()
        }
      }
      this.listLoading = false;
    },
    remove(val) {
      this.$confirm("确定删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeSupplier({
          supplierId: val
        }).then(data => {
          if (data.status === 0) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getData();
          } else {
            this.$message({
              type: "danger",
              message: "删除失败"
            });
          }
        });
      });
    },
    addSupplier() {
      this.editType = "新增";
      this.visible.addForm = true;
      setTimeout(() => {
        this.resetForm()
        this.$refs['addForm'].resetFields()
      })
    },
    editSupplier(val) {
      this.editType = "编辑";
      this.visible.addForm = true;
      this.supplier = {
        supplierId: val.supplier_id,
        supplierCode: val.supplier_code,
        supplierName: val.supplier_name,
        supplierContact: val.supplier_contact,
        supplierPhone: val.supplier_phone,
        supplierEmail: val.supplier_email,
        supplierAddress: val.supplier_address
      };
    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确定添加此条供应商信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.editType == "新增") {
               let suppliers = {
                suppliers: JSON.stringify(this.supplier)
              }
              saveSupplier(suppliers).then(data => {
                // console.log(data);
                if (data.status === 0) {
                  this.$message({
                    type: "success",
                    message: "添加成功"
                  });
                  this.visible.addForm = false;
                  this.getData();
                } else {
                  this.$message.error(data.msg);
                }
              });
            } else if (this.editType == "编辑") {
              modifySupplier(this.supplier).then(data => {
                if (data.status === 0) {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.visible.addForm = false;
                  this.getData();
                  this.resetForm();
                } else {
                  this.$message({
                    type: "danger",
                    message: data.msg
                  });
                }
              });
            }
          });
        } else {
          this.$message({
            type: "danger",
            message: "添加失败"
          });
        }
      });
    },
    resetForm() {
      this.supplier = {
        supplierCode: "",
        supplierName: "",
        supplierContact: "",
        supplierPhone: "",
        supplierEmail: "",
        supplierAddress: ""
      };
    }
  },
  watch: {}
};
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