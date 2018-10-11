<!-- 魏彬祥 2018.4.12 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData" onsubmit="return false">
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="addProjectButton()">新增项目</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
            <el-input v-model.trim="axiosData.projectName" size="medium" placeholder="输入关键字" @keyup.native.enter="getData()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getData()">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--内容-->
    <el-table :data="dataList" highlight-current-row v-loading="listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="devices_upkeep_project_name" label="检修保养项目" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_project_standard" label="检修保养基准" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_project_point" label="检修保养要点" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_project_period" label="周期" sortable></el-table-column>
      <el-table-column prop="devices_upkeep_project_rank" label="级别" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="modify(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--新增修改模态框-->
    <el-dialog  class="mes-dialog" :title="title" :visible.sync="show" width="40%" :close-on-click-modal="false">
      <section class="overflow_hidden">
        <el-form label-position="right" label-width="120px" :model="addProject" ref="addProject" :rules="addFormRules">
          <el-col :span="11">
            <el-form-item label="检修保养项目" prop="projectName">
              <el-input v-model.trim="addProject.projectName" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="检修保养要点" prop="projectPoint">
              <el-input v-model.trim="addProject.projectPoint" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="级别" prop="projectRank">
              <el-select placeholder="请选择" v-model="addProject.projectRank" style="width:100%">
                <el-option value="1次/天"></el-option>
                <el-option value="1次/周"></el-option>
                <el-option value="1次/2周"></el-option>
                <el-option value="1次/月"></el-option>
                <el-option value="1次/季"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="检修保养基准" prop="projectStandard">
              <el-input v-model.trim="addProject.projectStandard" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="周期" prop="projectPeriod">
              <el-select placeholder="请选择" v-model="addProject.projectPeriod" style="width:100%">
                <el-option value="一级"></el-option>
                <el-option value="两级"></el-option>
                <el-option value="三级"></el-option>
                <el-option value="四级"></el-option>
                <el-option value="五级"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span=23 class="text-right">
          <el-button type="primary" size="medium" @click="submit">确认</el-button>
        </el-col>
      </section>
    </el-dialog>
  </section>
</template>
<script>
import {queryUpkeepPlans, saveUpkeepProject, modifyUpkeepProject} from '../../../api/api'
import utils from '../../../common/js/utils'
export default {
  name: 'MaintainBook',
  data () {
    return {
      dataList: [],
      listLoading: false,
      show: false,
      title: '',
      pageSize: 10,
      page: 1,
      total: 0,
      axiosData: {
        type: 'projectInfo',
        headNum: 1,
        projectName: ''
      },
      addProject: {
        projectName: '',
        projectStandard: '',
        projectPoint: '',
        projectPeriod: '',
        projectRank: ''
      },
      addFormRules: {
        projectName: {required: true, message: '内容不能为空', trigger: 'blur'},
        projectStandard: {required: true, message: '内容不能为空', trigger: 'blur'},
        projectPoint: {required: true, message: '内容不能为空', trigger: 'blur'},
        projectPeriod: {required: true, message: '选项不能为空', trigger: 'change'},
        projectRank: {required: true, message: '选项不能为空', trigger: 'change'}
      }
    }
  },
  methods: {
    // 获取基础数据
    getData () {
      let data = Object.assign(this.axiosData, {
        headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
      })
      this.listLoading = true
      queryUpkeepPlans(data).then((data) => {
        this.listLoading = false
        if (data.status === 0) {
          this.dataList = data.map.upkeepProjects
          this.total = data.map.lines
        } else if (data.status === 2) {
          this.dataList = []
          this.total = 0
          this.$message.error('暂无数据');
        } else {
          this.$message.error('数据有误');
        }
      })
    },
    // 重置
    reset () {
      this.axiosData = {
        type: 'projectInfo',
        headNum: 1,
        projectName: ''
      }
      this.getData()
    },
    // 列表索引
    getIndex (index) {
      return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
    },
     // 页面改变
    handlePageChange (val) {
      this.page = val
      this.getData()
    },
    // 每页数量改变
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    addProjectButton () {
      this.addProject = {
        projectName: '',
        projectStandard: '',
        projectPoint: '',
        projectPeriod: '',
        projectRank: ''
      }
      if (!this.$refs['addProject'] === undefined) {
        this.$refs['addProject'].resetFields()
      }
      this.title = '新增项目'
      this.show = true
    },
    modify (value) {
      this.addProject = {
        projectName: value.devices_upkeep_project_name,
        projectStandard: value.devices_upkeep_project_standard,
        projectPoint: value.devices_upkeep_project_point,
        projectPeriod: value.devices_upkeep_project_period,
        projectRank: value.devices_upkeep_project_rank,
        projectId: value.devices_upkeep_project_id
      }
      if (!this.$refs['addProject'] === undefined) {
        this.$refs['addProject'].resetFields()
      }
      this.title = '修改项目'
      this.show = true
    },
    submit () {
      this.$refs.addProject.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            if (this.title === '新增项目') {
              let data = JSON.stringify([this.addProject])
              saveUpkeepProject({projects: data}).then((data) => {
                if (data.status === 0) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.show = false
                  this.getData()
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              let data = Object.assign(this.addProject, {
                standard: this.addProject.projectStandard,
                point: this.addProject.projectPoint,
                period: this.addProject.projectPeriod,
                rank: this.addProject.projectRank
              })
              modifyUpkeepProject(data).then((data) => {
                if (data.status === 0) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.show = false
                  this.getData()
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style>

</style>

