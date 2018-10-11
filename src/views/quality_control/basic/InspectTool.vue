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
            <el-input v-model.trim="filters.applianceNumber" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="inspectToolInfo" highlight-current-row v-loading="visible.listLoading" @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="quality_appliance_number" label="测试量具代号	" sortable></el-table-column>
      <el-table-column prop="quality_appliance_name" label="测试量具名称	" sortable></el-table-column>
      <el-table-column prop="quality_appliance_detail" label="测试量具说明	" sortable></el-table-column>
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
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增器具</span>
      <span slot="title" class="el-dialog__title" v-else>修改器具</span>
      <el-form :model="addForm" label-width="120px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="24">
          <el-form-item label="测试量具代号"  prop="applianceNumber">
            <el-input v-model.trim="addForm.applianceNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="测试量具名称" prop="applianceName">
            <el-input v-model.trim="addForm.applianceName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="测试量具说明" >
            <el-input v-model.trim="addForm.applianceDetail" auto-complete="off" size="medium" clearable></el-input>
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
  import { getAppliance, addAppliance, removeAppliance, modifyAppliance } from '../../../api/api'

  export default {
    data () {
      return {
        filters: {
          applianceName: '',
          applianceNumber: '',
          applianceId: '',
          applianceDetail: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        inspectToolInfo: [],
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          permission: false
        },
        isAddForm: true,
        addForm: {
          qualityApplianceNumber: '',
          qualityApplianceName: '',
          qualityApplianceId: '',
          qualityApplianceDetail: ''
        },
        addFormRules: {
          applianceNumber: { required: true, message: '测试量具代号不能为空', trigger: 'blur' },
          applianceName: { required: true, message: '测试量具名称不能为空', trigger: 'blur' },
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
          applianceName: '',
          applianceNumber: '',
          applianceId: '',
          applianceDetail: '',
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
        getAppliance(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            this.inspectToolInfo = res.map.qualityIqcApplianceDO
          } else {
            this.filters.total = 0
            this.inspectToolInfo = []
          }
          this.visible.listLoading = false
        })
      },
      // 新增
      handleAdd () {
        if (this.addForm.checkMethodId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            applianceName: '',
            applianceDetail: '',
            applianceNumber: ''
          }
          //this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          applianceName: row.quality_appliance_name,
          applianceNumber: row.quality_appliance_number,
          applianceId: row.quality_appliance_id,
          applianceDetail: row.quality_appliance_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？').then(action => {
          if (action === 'confirm') {
            removeAppliance({applianceId: row.quality_appliance_id}).then((res) => {
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
                addAppliance(para).then((res) => {
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
                modifyAppliance(para).then((res) => {
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
