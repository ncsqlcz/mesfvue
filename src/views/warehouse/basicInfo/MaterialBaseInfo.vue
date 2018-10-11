<!--刘宇 2018/6/29-->
<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="4">
        <el-button type="primary" size="medium" icon="el-icon-plus" @click="addMaterial">新增物料</el-button>
      </el-col>
       <el-col class="text-right" :span="20">
        <el-input type="text" placeholder="请输入编号或名称" size="medium" clearable @clear="getList"
                  v-model="filters.keyword" @keyup.native.enter="getList" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="60"> </el-table-column>
      <el-table-column  label="物料编号" prop="material_number" sortable> </el-table-column>
      <el-table-column  label="物料名称" prop="material_name" sortable> </el-table-column>
      <el-table-column  label="规格/型号" prop="material_model" sortable> </el-table-column>
      <el-table-column  label="单位" prop="material_unit" sortable> </el-table-column>
      <el-table-column label="操作" prop="" width="200">
          <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="editMaterial(scope.row)" type="primary">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="remove(scope.row)" type="danger">弃用</el-button>
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
      <span slot="title" class="el-dialog__title" v-if="editType === '新增'">新增物料</span>
      <span slot="title" class="el-dialog__title" v-else>编辑物料</span>
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" class="clearfix" size="small">
        <el-col :span="10">
          <el-form-item label="物料编号:" prop="materialNumber">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.materialNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="物料名称:" prop="materialName">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.materialName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="规格/型号:" prop="materialModel">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.materialModel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="单位:" prop="materialUnit">
            <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.materialUnit"></el-input>
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
  queryMaterial,
  modifyMaterial,
  saveMaterial,
  removeMaterial
} from "../../../api/warehouse";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      filters: {
        keyword: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      req: {
        type: "inventory",
        headNum: 1,
        value: "",
        key: "keyWord"
      },
      list: [],

      materialId: '', // 当前编辑的物料id
      form: {
        materialNumber: '',
        materialName: '',
        materialModel: '',
        materialUnit: ''
      },
      visible: {
        listLoading: false,
        addForm: false,
        editForm: false,
        addLoading: false,
        editLoading: false
      },
      rules: {
        materialNumber: [
          { required: true, message: "请输入物料编号", trigger: "blur" }
        ],
        materialName: [
          { required: true, message: "请输入物料名称", trigger: "blur" }
        ],
        materialModel: [
          { required: true, message: "请输入规格/型号", trigger: "change" }
        ],
        materialUnit: [
          { required: true, message: "请输入物料单位", trigger: "blur" }
        ]
      },
      editType: ""
    };
  },
  computed: {
    ...mapGetters(["getDeviceTypes"])
  },
  mounted() {
    // this.initDevicesTypes();
    this.getList();
  },
  methods: {
    ...mapActions(["initDevicesTypes"]),
    //  获取列表
    async getList() {
      let data = await queryMaterial(this.filters)
      if (data.status === 0) {
        this.list = data.map.materialInfoDTOs;
        this.filters.total = data.map.line;
      } else {
        this.list = [];
        this.filters.total = 0;
      }
    },
    //  页面改变
    handlePageChange (val) {
      this.filters.page = val
      this.getList()
    },
    //  每页数量改变
    handleSizeChange (val) {
      this.filters.pageSize = val
      this.getList()
    },
    remove(row) {
      this.$confirm("确定删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeMaterial({
          materialId: row.material_id
        }).then(data => {
          if (data.status === 0) {
            this.$message.success('删除成功')
            this.getList();
          } else {
            this.$message.error(data.msg)
          }
        });
      });
    },
    addMaterial() {
      this.editType = "新增";
      this.visible.addForm = true;
      setTimeout(() => {
        this.resetForm()
        this.$refs['form'].resetFields()
      })
    },
    addSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm("确定添加此条物料信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.editType === "新增") {
              let params = {
                materials: JSON.stringify({
                    "material_model": this.form.materialModel,
                    "material_name": this.form.materialName,
                    "material_number": this.form.materialNumber,
                    "material_unit": this.form.materialUnit
                })
              }
              saveMaterial(params).then(data => {
                if (data.status === 0) {
                  this.$message.success('添加成功')
                  this.visible.addForm = false;
                  this.getList();
                } else {
                  this.$message.error(data.msg)
                }
              });
            } else if (this.editType === "编辑") {
              let params = Object.assign({}, {
                materialId: this.materialId
              }, this.form)
              modifyMaterial(params).then(data => {
                if (data.status === 0) {
                  this.$message.success('修改成功')
                  this.visible.addForm = false;
                  this.getList();
                } else {
                  this.$message.error(data.msg)
                }
              });
            }
          });
        }
      });
    },
    editMaterial(row) {
      this.editType = "编辑";
      this.visible.addForm = true;
      this.materialId = row.material_id;
      this.form.materialNumber = row.material_number;
      this.form.materialName = row.material_name;
      this.form.materialModel = row.material_model;
      this.form.materialUnit = row.material_unit;
    },
    // 表单数据清空
    resetForm () {
      this.form = {
        materialNumber: '',
        materialName: '',
        materialModel: '',
        materialUnit: ''
      }
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