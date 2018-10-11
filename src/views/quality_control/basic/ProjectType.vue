<!--朱缘辉 2018-04-08-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="4">
            <el-input v-model.trim="filters.projectTypeName" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" v-on:click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->

    <!--列表 start-->
    <el-table :data="projectLists" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="quality_project_type_name" label="类型名称" ></el-table-column>
      <el-table-column prop="quality_project_type_detail" label="说明" ></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页start -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页end -->

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="40%">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增项目类型</span>
      <span slot="title" class="el-dialog__title" v-else>编辑项目类型</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col >
          <el-form-item label="名称" label-width="120px" prop="projectTypeName">
            <el-input v-model.trim="addForm.projectTypeName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col >
        <el-col >
          <el-form-item label="说明" label-width="120px" prop="projectTypeDetail">
            <el-input v-model.trim="addForm.projectTypeDetail" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col >
        <el-col v-if="isAddForm">
          <el-form-item label="是否可修改删除" label-width="120px" prop="isModify">
            <el-radio-group v-model="addForm.isModify" size="medium">
              <el-radio class="radio" label="1">是</el-radio>
              <el-radio class="radio" label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col >
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->
  </section>
</template>

<script>
import utils from '../../../common/js/utils'
import {getProjectTypeList, addProjectTypeList, removeProjectTypeList, modifyProjectTypeList} from '../../../api/api'

export default {
  data () {
    return {
      filters: {
        projectTypeName: '',
        type: 'info',
        pageSize: 10,
        page: 1,
        total: 0
      },
      projectLists: [],
      options: [
        {value: '1', label: '是'},
        {value: '0', label: '否'}
      ],
      visible: {
        listLoading: false,
        addForm: false,
        addLoading: false,
        editLoading: false
      },
      isAddForm: true,
      addForm: {
        projectTypeId: '',
        projectTypeName: '',
        projectTypeDetail: '',
        isModify: '0'
      },
      addFormRules: {
        projectTypeName: { required: true, message: '名称不能为空', trigger: 'blur' }
      }
    }
  },
  computed: {},
  mounted () {
    this.getList()
  },
  methods: {
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
    // 列表索引
    getIndex (index) {
      return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
    },
    //  获取列表
    getList () {
      // 注意后端分页用的字段是headNum, 所以要转换一下
      let para = Object.assign({
        headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
      }, this.filters)
      this.visible.listLoading = true
      getProjectTypeList(para).then((res) => {
        if (res.status === 0) {
          // this.filters.page = data.currentPage
          this.filters.total = res.map.lines
          this.projectLists = res.map.projectInfo
        } else {
          this.filters.total = 0
          this.projectLists = []
        }
        this.visible.listLoading = false
      })
    },
    // 新增
    handleAdd () {
      if (this.addForm.projectTypeId !== '') {
        // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
        this.addForm = {
          projectTypeId: '',
          isModify: '0'
        }
        this.$refs['addForm'].resetFields()
      }
      this.isAddForm = true
      this.visible.addForm = true
    },
    // 编辑
    handleEdit (row) {
      this.addForm = {
        projectTypeId: row.quality_project_type_id,
        projectTypeName: row.quality_project_type_name,
        projectTypeDetail: row.quality_project_type_detail
      }
      this.isAddForm = false
      this.visible.addForm = true
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
        if (action === 'confirm') {
          removeProjectTypeList({projectTypeId: row.quality_project_type_id, status: '1'}).then((res) => {
            if (res.status === 0) {
              this.$message({ message: '删除成功', type: 'success' })
            } else {
              this.$message({ message: '删除失败', type: 'error' })
            }
            this.visible.addLoading = false
            this.getList()
          })
        }
      }).catch()
    },
    // 重置
    reset () {
      this.filters = {
        projectTypeName: '',
        type: 'info',
        pageSize: 10,
        page: 1,
        total: 0
      }
      this.getList()
    },
    // 提交 - 包含新增和编辑
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.visible.addLoading = true
            let para = Object.assign({}, this.addForm)
            if (this.isAddForm) {
              addProjectTypeList(para).then((res) => {
                this.visible.addLoading = false
                if (res.status === 0) {
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['addForm'].resetFields()
                  this.visible.addForm = false
                  this.getList()
                } else {
                  this.$message({ message: res.msg, type: 'warning' })
                }
              })
            } else {
              modifyProjectTypeList(para).then((res) => {
                this.visible.addLoading = false
                if (res.status === 0) {
                  this.$message({ message: '提交成功', type: 'success' })
                  this.$refs['addForm'].resetFields()
                  this.visible.addForm = false
                  this.getList()
                } else {
                  this.$message({ message: res.msg, type: 'warning' })
                }
              })
            }
          })
        }
      })
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">

</style>


