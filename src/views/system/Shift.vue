<!--张叶青 2018/04/08 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增班次</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="4">
            <el-input v-model.trim="filters.className" size="medium" placeholder="请输入班次名称" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="shifts" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="role_class_name" label="班次名称" sortable></el-table-column>
      <el-table-column prop="role_class_detail"  label="班次说明" sortable></el-table-column>
      <el-table-column label="班次人员" >
         <template slot-scope="scope">
            <el-button size="small" icon="el-icon-view" @click="classStaff(scope.row)">查看</el-button>
            <!-- <router-link to="{path: 'ShiftDetail', query:{classId:scope.role_class_id}}"><el-button size="small" icon="el-icon-view">查看</el-button></router-link> -->
            <!-- <router-link to='ShiftDetail'><el-button size="small" icon="el-icon-view">查看</el-button></router-link> -->
         </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="clearData()"  width="30%">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增班次</span>
      <span slot="title" class="el-dialog__title" v-else>编辑班次</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="22" :offset="1">
          <el-form-item label="班次名称" prop="className">
            <el-input v-model.trim="addForm.className" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        
        </el-col>
        <el-col :span="22" :offset="1">
           <el-form-item label="班次说明" prop="classDetail">
            <el-input v-model.trim="addForm.classDetail" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false" @close="clearData()" >取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->

  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import {getShiftList, addShift, editShift, removeShift
  } from '../../api/api'

  export default {
    data () {
      return {
        filters: {
          className: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        },
        shifts: [],
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          editLoading: false
        },
        querySearchPostTimeout: null,
        isAddForm: true,
        addForm: {
          classId: '',
          className: '',
          classDetail: ''
        },
        addFormRules: {
          className: { required: true, message: '班次名称不能为空', trigger: 'blur' }
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
      // 重置
      reset () {
        this.filters = {
          className: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取班次列表
      getList () {
        
        let para = Object.assign({
          
        }, this.filters)
        this.visible.listLoading = true
        getShiftList(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.shifts = res.map.classes
          } else {
            this.filters.total = 0
            this.shifts = []
          }
          this.visible.listLoading = false
        })
      },
        // 查看人员
      classStaff (row) {
        this.$router.push({
          path: '/system/shiftDetail',
          query: {
            type: 'classId',
            id: row.role_class_id,
            title: '班次：' + row.role_class_name
          }
        })
      },
      // 查看详情
      handleView (row) {
        this.$mesBasicInfoTable.show(
          '班次详情', {
            table: {
              props: ['班次名称', '班次说明'],
              values: [row.role_class_detail, row.role_class_name]
            }
          })
      },
      // 新增
      handleAdd () {
        if (this.addForm.classId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            classId: '',
            className: '',
            classDetail: ''
          }
          this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          classId: row.role_class_id,
          className: row.role_class_name,
          classDetail: row.role_class_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
          if (action === 'confirm') {
            removeShift({classId: row.role_class_id, status: '1'}).then((res) => {
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
      // 提交 - 包含新增和编辑
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.visible.addLoading = true
              let para = Object.assign({}, this.addForm)
              if (this.isAddForm) {
                addShift(para).then((res) => {
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
                editShift(para).then((res) => {
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
      clearData () {
        setTimeout (() => {
          this.$refs.addForm.resetFields()
        },300)
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
