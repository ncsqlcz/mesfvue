<!--刘川中 2018.4.8-->
<template>
  <el-row style="background-color: transparent">
    <!--右边列表-->
    <el-col :span="24">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="4" class="text-left">
            <el-form-item>
              <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增车间</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="20" class="text-right">
            <el-form-item :span="4">
              <el-input v-model.trim="filters.workshopName" size="medium" placeholder="输入车间名称" @keyup.native.enter="getList"></el-input>
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
        <el-table-column prop="role_workshop_name" label="车间名" sortable></el-table-column>
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
        <el-table-column prop="" label="操作" width="280">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="processConfig(scope.row)">增加工序</el-button>
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
    </el-col>

    <!--新增 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增车间</span>
      <span slot="title" class="el-dialog__title" v-else>编辑车间</span>
      <el-form :model="addForm" label-width="100px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-form-item label="车间id" prop="workshopId" hidden>
          <el-input v-model.trim="addForm.workshopId" auto-complete="off" size="medium" clearable></el-input>
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="车间名称" prop="workshopName">
            <el-input v-model.trim="addForm.workshopName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input v-model.trim="addForm.principal" auto-complete="off" size="medium" clearable placeholder="点击选择" class="pointer" readonly
                      @click.native="handleSelectStaff"></el-input>
          </el-form-item>
          <el-form-item label="温度上限(℃)" prop="maxtemperature">
            <el-input-number v-model.trim="addForm.maxtemperature" size="medium" :step="1" :max="100" :min="-100"></el-input-number>
          </el-form-item>
          <el-form-item label="温度下限(℃)" prop="mintemperature">
            <el-input-number v-model.trim="addForm.mintemperature" size="medium" :step="1" :max="100" :min="-100"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="湿度上限(%)" prop="maxhumidity">
            <el-input-number v-model.trim="addForm.maxhumidity" size="medium" :step="1" :max="100" :min="-100"></el-input-number>
          </el-form-item>
          <el-form-item label="湿度上限(%)" prop="minhumidity">
            <el-input-number v-model.trim="addForm.minhumidity" size="medium" :step="1" :max="100" :min="-100"></el-input-number>
          </el-form-item>
          <el-form-item label="车间地址" prop="site">
            <el-input v-model.trim="addForm.site" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="describe">
            <el-input v-model.trim="addForm.describe" auto-complete="off" size="medium" clearable></el-input>
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
  import { queryWorkShopInfos, modifyWorkshop, saveWorkshops, removeWorkshop } from '../../api/api'

  export default {
    name: 'workshop',
    data () {
      return {
        filters: {
          workshopName: '',
          type: 'info',
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
          workshopId: '',
          workshopName: '',
          site: '',
          principal: '',
          maxtemperature: '',
          mintemperature: '',
          maxhumidity: 0,
          minhumidity: 0,
          describe: ''
        },
        addFormRules: {
          workshopName: { required: true, message: '车间名称不能为空', trigger: 'blur' },
          principal: { required: true, message: '负责人不能为空', trigger: 'submit' }
        },
        selectedStaffIds: [],
        workshopName: '' // 车间名称
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
          workshopName: '',
          type: 'info',
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
        queryWorkShopInfos(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            this.list = res.map.workshopInfos
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
            type: 'workshopId',
            id: row.role_workshop_id,
            title: '车间：' + row.role_workshop_name
          }
        })
      },
      // 人员配置
      staffConfig (row) {
        this.$router.push({
          path: '/system/organization/staffConfig',
          query: {
            type: 'workshopId',
            id: row.role_workshop_id,
            title: '车间：' + row.role_workshop_name
          }
        })
      },
      // 设备配置
      deviceConfig (row) {
        this.$router.push({
          path: '/system/organization/deviceConfig',
          query: {
            type: 'workshopId',
            id: row.role_workshop_id,
            title: '车间：' + row.role_workshop_name
          }
        })
      },
      // 工序配置
      processConfig (row) {
        this.$router.push({
          path: '/system/organization/processConfig',
          query: {
            type: 'workshopId',
            id: row.role_workshop_id,
            title: '车间：' + row.role_workshop_name
          }
        })
        // console.log(row);
      },
      // 新增
      handleAdd () {
        if (this.addForm.workshopId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            workshopId: '',
            workshopName: '',
            site: '',
            principal: '',
            maxtemperature: 0,
            mintemperature: 0,
            maxhumidity: 0,
            minhumidity: 0,
            describe: ''
          }
          this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          workshopId: row.role_workshop_id,
          workshopName: row.role_workshop_name,
          site: row.role_workshop_site,
          principal: row.role_workshop_principal,
          maxtemperature: Number.parseFloat(row.role_workshop_maxtemperature).toFixed(1),
          mintemperature: Number.parseFloat(row.role_workshop_mintemperature).toFixed(1),
          maxhumidity: Number.parseFloat(row.role_workshop_maxhumidity).toFixed(1),
          minhumidity: Number.parseFloat(row.role_workshop_minhumidity).toFixed(1),
          describe: row.role_workshop_describe
        }
        this.workshopName = row.role_workshop_name
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？').then(action => {
          if (action === 'confirm') {
            removeWorkshop({workshopId: row.role_workshop_id, type: 'delete'}).then((res) => {
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
      // 选择负责人
      handleSelectStaff () {
        this.$mesStaff.show({
          type: 'all',
          reRender: true,
          selectedIds: this.selectedStaffIds
        }).then(res => {
          this.selectedIds = res.rows.map(v => v.role_staff_id)
          this.addForm.principal = res.rows[0].role_staff_name
        })
      },
      addSubmit () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.visible.addLoading = true
              let para = Object.assign({}, this.addForm)
              if (this.isAddForm) {
                saveWorkshops(para).then((res) => {
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
                if (this.workshopName === this.addForm.workshopName) {
                  para.workshopName = ''
                }
                modifyWorkshop(para).then((res) => {
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
      }
    }
  }
</script>

<style scoped>

</style>
