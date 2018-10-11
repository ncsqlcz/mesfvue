<!--刘宇 2018/6/29-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增成品信息</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <!-- <el-form-item>
            <el-select placeholder="成品种类" size="medium" v-model="filters.category" @change="getList"  style="width:150px">
              <el-option value="" label="所有种类" ></el-option>
              <el-option v-for="(value, idx) in listAll" :value="value.finish_product_category" :label="value.finish_product_category" :key="idx"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item>
            <el-select placeholder="成品类型" size="medium" v-model="filters.type" @change="getList" style="width:150px">
              <el-option value="" label="所有类型"></el-option>
              <el-option v-for="(value, idx) in listAll" :value="value.finish_product_type" :label="value.finish_product_type" :key="idx"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-select placeholder="成品型号" size="medium" v-model="filters.model" @change="getList"  style="width:150px">
              <el-option value="" label="所有型号"></el-option>
              <el-option v-for="(value, idx) in listAll" :value="value.finish_product_model" :label="value.finish_product_model" :key="idx"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="filters.keyword" size="medium" clearable @clear="getList"
                      placeholder="输入成品编号或名称" @keyup.native.enter="getList"></el-input>            
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!-- 列表-->
     <el-table :data="list" style="width: 100%" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
        <el-table-column type="index" label="序号" width="60"> </el-table-column>
        <el-table-column   label="成品编号"  prop="finish_product_number" sortable></el-table-column>
        <el-table-column   label="成品名称"  prop="finish_product_name" sortable></el-table-column>
        <!-- <el-table-column  label="成品种类"  prop="finish_product_category" sortable></el-table-column>
        <el-table-column  label="成品类型"  prop="finish_product_type" sortable></el-table-column> -->
        <el-table-column  label="型号"  prop="finish_product_model" sortable></el-table-column>
        <!-- <el-table-column  label="成品参数"  prop="finish_product_param" sortable></el-table-column> -->
        <el-table-column  label="单位"  prop="finish_product_unit" sortable></el-table-column>
        <el-table-column  label="操作" prop="" width="200">
          <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" type="primary">修改</el-button>
          <el-button size="small" icon="el-icon-delete" @click="handleRemove(scope.row)" type="danger">弃用</el-button>
          </template>
        </el-table-column>
     </el-table>
    <!--分页 -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页-->

    <!--新增-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" v-if="editType === '新增'">新增成品</span>
      <span slot="title" class="el-dialog__title" v-else>编辑成品</span>
      <el-form :model="form" :inline="true" label-width="80px" label-position="left"
              :rules="rules" ref="form" class="clearfix">
          <el-form-item label="成品编号" label-position="left" prop="finish_product_number">
            <el-input v-model.trim="form.finish_product_number" placeholder="必填" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="成品名称" label-position="left" prop="finish_product_name">
            <el-input v-model.trim="form.finish_product_name" placeholder="必填" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="成品种类" label-position="left" prop="finish_product_category">
            <el-select
              v-model="form.finish_product_category"
              filterable
              remote
              placeholder="必填"
              :remote-method="asyncSearchCategory"
              size="medium"
              :loading="selectLoading">
              <el-option
                v-for="item in categoryList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-model.trim="form.finish_product_category" placeholder="必填" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="成品类型" label-position="left" prop="finish_product_type">
            <el-input v-model.trim="form.finish_product_type" placeholder="必填" size="medium" clearable></el-input>
          </el-form-item> -->
          <el-form-item label="型号" label-position="left" prop="finish_product_model">
            <el-input size="medium" v-model.trim="form.finish_product_model" placeholder="必填" clearable></el-input>
          </el-form-item>
          <el-form-item label="单位" label-position="left" prop="finish_product_unit">
            <el-input size="medium" v-model.trim="form.finish_product_unit" placeholder="必填" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="成品参数" label-position="left" prop="finish_product_param">
            <el-select
              v-model="form.finish_product_param"
              filterable
              remote
              placeholder="必填"
              :remote-method="asyncSearchParam"
              size="medium"
              :loading="selectLoading">
              <el-option
                v-for="item in paramList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input  v-model.trim="form.finish_product_param" size="medium" clearable placeholder="必填"></el-input>
          </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false" @close="resetForm()">取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->

  </section>
</template>

<script>
import utils from "../../../common/js/utils";
import {
  saveFinishProduct,
  modifyFinishProduct,
  queryFinishProduct,
  removeFinishProduct,
  queryProductCategoryOrParam
} from "../../../api/warehouse";

export default {
  name: 'ProductBaseInfo',
  data() {
    return {
      filters: {
        number: '', // 编号
        category: '', // 种类
        type: '', // 类型
        model: '', // 型号
        keyword: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      list: [],
      listAll: [],
      materialId: '', // 当前编辑的成品id
      finishProductId: '', // 当前编辑的成品id
      form: {
        finish_product_category: '',
        finish_product_model: '',
        finish_product_name: '',
        finish_product_number: '',
        finish_product_param: '',
        finish_product_type: '',
        finish_product_unit: ''
      },
      visible: {
        listLoading: false,
        addForm: false,
        editForm: false,
        addLoading: false,
        editLoading: false,
        selectLoading: false
      },
      selectLoading: false,
      rules: {
        finish_product_number: [
          { required: true, message: "请输入成品编号", trigger: "blur" }
        ],
        finish_product_name: [
          { required: true, message: "请输入成品名称", trigger: "blur" }
        ],
        // finish_product_category: [
        //   { required: true, message: "请输入成品种类", trigger: "blur" }
        // ],
        // finish_product_type: [
        //   { required: true, message: "请输入成品类型", trigger: "blur" }
        // ],
        finish_product_model: [
          { required: true, message: "请输入成品型号", trigger: "blur" }
        ],
        finish_product_param: [
          { required: true, message: "请输入成品参数", trigger: "blur" }
        ],
        finish_product_unit: [
          { required: true, message: "请输入成品单位", trigger: "blur" }
        ]
      },
      editType: "",
      categoryList: [], // 异步搜索结果列表
      paramList: [] // 异步搜索结果列表
    };
  },
  computed: {
  },
  mounted() {
    this.getList();
    this.getListAll();
  },
  methods: {
    //  获取列表
    async getList() {
      let data = await queryFinishProduct(this.filters)
      if (data.status === 0) {
        this.list = data.map.finishProductInfoDTOs;
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
    reset () {
      this.filters = {
        number: '', // 编号
        category: '', // 种类
        type: '', // 类型
        model: '', // 型号
        keyword: '',
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.getList()
    },
    // 获取所有列表信息
    async getListAll () {
      let params = Object.assign({}, this.filters, {
        pageSize: 99999
      })
      let data = await queryFinishProduct(params)
      if (data.status === 0) {
        this.listAll = data.map.finishProductInfoDTOs;
      } else {
        this.listAll = [];
      }
    },
    // 处理移除
    handleRemove(row) {
      this.$confirm("确定删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeFinishProduct({
          finishProductId: row.finish_product_id
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
    handleAdd() {
      this.editType = "新增";
      this.visible.addForm = true;
      setTimeout(() => {
        this.resetForm()
        this.$refs['form'].resetFields()
      })
    },
    // 提交新增/编辑数据
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
                finishProducts: JSON.stringify(this.form)
              }
              saveFinishProduct(params).then(data => {
                if (data.status === 0) {
                  this.$message.success('添加成功')
                  this.visible.addForm = false;
                  this.getList();
                } else {
                  this.$message.error(data.msg)
                }
              });
            } else if (this.editType === "编辑") {
              let params = {
                finishProductId: this.finishProductId,
                finishProductNumber: this.form.finish_product_number,
                finishProductName: this.form.finish_product_name,
                // finishProductCategory: this.form.finish_product_category,
                // finishProductType: this.form.finish_product_type,
                finishProductModel: this.form.finish_product_model,
                // finishProductParam: this.form.finish_product_param,
                finishProductUnit: this.form.finish_product_unit,
              }
              modifyFinishProduct(params).then(data => {
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
    // 处理编辑
    handleEdit(row) {
      this.editType = "编辑";
      this.visible.addForm = true;
      this.finishProductId = row.finish_product_id;
      Object.keys(this.form).forEach(key => {
        this.form[key] = row[key]
      })
    },
    // 表单数据清空
    resetForm () {
      this.finishProductId = ''
      this.form = {
        finish_product_category: '',
        finish_product_model: '',
        finish_product_name: '',
        finish_product_number: '',
        finish_product_param: '',
        finish_product_type: ''
      }
    },
    // 搜索建议
    async asyncSearchAdvice (query, type = 'category') {
      let searchList = []
      if (query !== '') {
        this.selectLoading = true
        let res = await queryProductCategoryOrParam({
          type: type,
          keyword: query
        })
        if (res.status === 0) {
          switch (type) {
            case 'category': 
              searchList = this.categoryList = res.map.categorys
            break;
            case 'param': 
              searchList = this.paramList = res.map.params
            break;
          }
        } else {
          searchList = []
        }
        if (!searchList.includes(query)) {
          // 支持用户自定义输入的内容
          searchList.unshift(query)
        }
        this.selectLoading = false
      } else {
        // this.categoryList = []
        // this.paramList = []
      }
    },
    // 种类搜索建议
    asyncSearchCategory (query) {
      this.asyncSearchAdvice(query, 'category')
    },
    // 参数搜索建议
    asyncSearchParam (query) {
      this.asyncSearchAdvice(query, 'param')
    }
  },
  watch: {}
};
</script>

<style scoped lang="scss">
</style>
