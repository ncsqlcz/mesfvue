<!--刘川中 2018.4.8-->
<template>
  <el-row style="background-color: transparent">
    <!--右边列表-->
    <el-col :span="24">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <!--<el-col :span="4" class="text-left">-->
            <!--<el-form-item>-->
              <!--<el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增</el-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="24" class="text-right">
            <el-form-item :span="4">
              <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入名称或编号" @keyup.native.enter="getList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
              <el-button size="medium" @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <!--<el-table-column prop="role_workshop_code" label="车间代号" sortable></el-table-column>-->
        <el-table-column prop="workstage_number" label="工序编号" width="200" sortable></el-table-column>
        <el-table-column prop="workstage_name" label="工序名" sortable></el-table-column>
        <el-table-column prop="" label="职位配置" width="120">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="postConfig(scope.row)">职位配置</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="人员配置" width="120">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="staffConfig(scope.row)">人员配置</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="设备配置" width="120">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="deviceConfig(scope.row)">设备配置</el-button>
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
    </el-col>

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增产线</span>
      <span slot="title" class="el-dialog__title" v-else>编辑产线</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="24">
          <el-form-item label="产线代码" prop="productLineCode">
            <el-input v-model.trim="addForm.productLineCode" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="产线名称" prop="productLineName">
            <el-input v-model.trim="addForm.productLineName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="productLineDescribe">
            <el-input v-model.trim="addForm.productLineDescribe" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false">取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->

  </el-row>
</template>

<script>
  import utils from '../../common/js/utils'
  import { queryWorkstageBasics } from '../../api/api'

  export default {
    name: 'workshop',
    data () {
      return {
        filters: {
          keyword: '',
          type: 'vague',
          status: '0',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
          addForm: false
        },
        isAddForm: false,
        addForm: {
          productLineId: '',
          productLineCode: '',
          productLineName: '',
          productLineDescribe: ''
        },
        addFormRules: {
          // productLineCode: { required: true, message: '产线代码不能为空', trigger: 'blur' },
          productLineName: { required: true, message: '产线名称不能为空', trigger: 'blur' }
        }
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      // 页面改变
      handlePageChange (val) {
        this.filters.page = val
        this.getList()
      },
      // 每页数量改变
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
          keyword: '',
          type: 'vague',
          status: '0',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      // 获取列表
      getList () {
        
        let para = Object.assign({
          
        }, this.filters)
        this.visible.listLoading = true
        queryWorkstageBasics(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.count
            this.list = res.map.workstageBasicsList
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.visible.listLoading = false
        })
      },
      // 职位配置
      postConfig (row) {
        this.$router.push({
          path: '/system/organization/postConfig',
          query: {
            type: 'workstageId',
            id: row.workstage_basics_id,
            title: '车间工序：' + row.workstage_name
          }
        })
      },
      // 人员配置
      staffConfig (row) {
        this.$router.push({
          path: '/system/organization/staffConfig',
          query: {
            type: 'workstageId',
            id: row.workstage_basics_id,
            title: '车间工序：' + row.workstage_name
          }
        })
      },
      // 设备配置
      deviceConfig (row) {
        this.$router.push({
          path: '/system/organization/deviceConfig',
          query: {
            type: 'workstageId',
            id: row.workstage_basics_id,
            title: '车间工序：' + row.workstage_name
          }
        })
      },
      // 工序配置
      processConfig (row) {
        this.$router.push({
          path: '/system/organization/processConfig',
          query: {
            type: 'workstageId',
            id: row.workstage_basics_id,
            title: '车间工序：' + row.workstage_name
          }
        })
      },
      // 新增
      handleAdd () {
        if (this.addForm.productLineId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            productLineId: '',
            productLineCode: '',
            productLineName: '',
            productLineDescribe: ''
          }
          this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          productLineId: row.product_line_id,
          productLineCode: row.product_line_code,
          productLineName: row.product_line_name,
          productLineDescribe: row.product_line_describe
        }
        this.isAddForm = false
        this.visible.addForm = true
      }
    }
  }
</script>

<style scoped>

</style>
