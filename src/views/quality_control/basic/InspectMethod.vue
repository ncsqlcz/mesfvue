<!--朱缘辉 2018.4.27-->
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
            <el-input v-model.trim="filters.checkMethodName" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="inspectMethodInfo" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="quality_check_method_name" label="类型名称	" sortable></el-table-column>
      <el-table-column prop="quality_check_method_detail" label="说明" ></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增检验方式</span>
      <span slot="title" class="el-dialog__title" v-else>编辑检验方式</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="24">
          <el-form-item label="名称" prop="checkMethodName">
            <el-input v-model.trim="addForm.checkMethodName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="说明" >
            <el-input v-model.trim="addForm.checkMethodDetail" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
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
  import { getInspectProjectType, addInspectProjectType, removeInspectProjectType, modifyInspectProjectType } from '../../../api/api'

  export default {
    name: 'post',
    data () {
      return {
        filters: {
          checkMethodName: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        },
        inspectMethodInfo: [],
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          permission: false
        },
        isAddForm: true,
        addForm: {
          checkMethodId: '',
          checkMethodName: '',
          checkMethodDetail: ''
        },
        addFormRules: {
          checkMethodName: { required: true, message: '名称不能为空', trigger: 'blur' },
        },
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
        return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
      },
      // 重置
      reset () {
        this.filters = {
          checkMethodName: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取列表
      getList () {
        // 注意后端分页用的字段是headNum, 所以要转换一下
        let para = Object.assign(this.filters, {
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        })
        this.visible.listLoading = true
        getInspectProjectType(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            this.inspectMethodInfo = res.map.qualityCheckMethodDO
          } else {
            this.filters.total = 0
            this.inspectMethodInfo = []
          }
          this.visible.listLoading = false
        })
      },
      // 新增
      handleAdd () {
        if (this.addForm.checkMethodId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            checkMethodId: '',
            checkMethodName: '',
            checkMethodDetail: ''
          }
          //this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          checkMethodId: row.quality_check_method_id,
          checkMethodName: row.quality_check_method_name,
          checkMethodDetail: row.quality_check_method_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？').then(action => {
          if (action === 'confirm') {
            removeInspectProjectType({checkMethodId: row.quality_check_method_id}).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '删除成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '删除失败', type: 'error' })
              }
              this.visible.addLoading = false
              this.getList()
            })
          }
        }).catch()
      },
      // 提交 - 包含新增和编辑
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.visible.addLoading = true
              let para = Object.assign({}, this.addForm)
              if (this.isAddForm) {
                addInspectProjectType(para).then((res) => {
                  this.visible.addLoading = false
                  if (res.status === 0) {
                    this.$message({ message: '新增成功', type: 'success' })
                    this.$refs['addForm'].resetFields()
                    this.visible.addForm = false
                    this.getList()
                  } else {
                    this.$message({ message: res.msg || '新增失败', type: 'warning' })
                  }
                })
              } else {
                modifyInspectProjectType(para).then((res) => {
                  this.visible.addLoading = false
                  if (res.status === 0) {
                    this.$message({ message: '修改成功', type: 'success' })
                    this.$refs['addForm'].resetFields()
                    this.visible.addForm = false
                    this.getList()
                  } else {
                    this.$message({ message: res.msg || '修改失败', type: 'warning' })
                  }
                })
              }
            })
          }
        })
      },
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
