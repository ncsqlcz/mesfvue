<!--张叶青 2018/04/027 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
         <el-col :span="4" class="text-right">
          <el-button type="primary" size="medium" @click="AddCarftBasic">新增工序基础信息</el-button>
        </el-col>
        <el-col :span="20" class="text-right">
            <el-form-item :span="3">
            <el-select  placeholder="启用"  
                     v-model="status"
                     size="medium"
                     @change="getList"
                     style="width:90px">
             <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入名称或编号" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="workstageBasicsList" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="workstage_name" label="工序名称" sortable></el-table-column>
      <el-table-column prop="workstage_number"  label="工序编号" sortable></el-table-column>
      <el-table-column prop="workstage_basics_describe" label="工序备注" ></el-table-column>
      <el-table-column prop="useStatus" label="使用状态" sortable>
          <template slot-scope="scope">
          <el-select v-model="scope.row.useStatus" size="medium"  @change="statusChanged(scope.row)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column> 

      <el-table-column prop="craft_number" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="craftDetail(scope.row)">详情</el-button>
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
      <span slot="title" class="el-dialog__title" >新增工序基础信息</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="24">
          <el-form-item label="工序名称" prop="workstageName">
            <el-input v-model.trim="addForm.workstageName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        
        </el-col>
        <el-col :span="24">
           <el-form-item label="工序编号" prop="workstageNumber">
            <el-input v-model.trim="addForm.workstageNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="24">
           <el-form-item label="工序备注" prop="workstageBasicsDescribe">
            <el-input v-model.trim="addForm.workstageBasicsDescribe" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="24">
           <el-form-item label="使用状态" prop="workstageBasicsStatus">
             <el-select v-model="addForm.workstageBasicsStatus" size="medium" >
            <el-option label="启用" value="0"></el-option>
            <el-option label="弃用" value="1"></el-option>
          </el-select>
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
  import {queryWorkstageBasics, modifyWorkstageBasicsStatus, saveWorkstageBasics
  } from '../../../api/api'
  import {mapGetters} from 'vuex'
  export default {
    data () {
     return {
        filters: {
            pageSize: 10,
            page: 1,
            total: 0,
            keyword:'',
            type: 'vague'
        },
        workstageBasicsList: [],
        craftsDetail: [],
        processDescribles: [],
        craftSegments: [],
        status: '0',
        type: [],
        title: '工艺详情',
        versions: 'public',
        visible: {
            listLoading: false,
            detailForm: false,
            addLoading: false,
            addForm: false
        },
        addForm: {
            workstageName: '',
            workstageNumber: '',
            workstageBasicsDescribe: '',
            workstageBasicsStatus: ''
        },
        addFormRules: {
           workstageName: { required: true, message: '工序名称不能为空', trigger: 'blur' },
            workstageNumber: { required: true, message: '工序编号不能为空', trigger: 'blur' }
        },
        options: [
            {value: '0', label: '启用'},
            {value: '1', label: '弃用'}
        ],
        useStatus: '',
        querySearchPostTimeout: null,
        }
    },
    computed: {
        ...mapGetters(['getUser'])
    },
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
          type: 'public',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取工序基础信息列表
      getList () { 
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
        }, this.filters)
        queryWorkstageBasics(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
             res.map.workstageBasicsList.forEach(item => {
              if (item.workstage_basics_status === '0') {
                item.useStatus = '0'
              } else {
                item.useStatus = '1'
              }
            })
            this.workstageBasicsList = res.map.workstageBasicsList
          } else {
            this.filters.total = 0
            this.crafts = []
          }
        })
      },
        // 详情
      craftDetail (row) {
        if (row.workstage_basics_status == 0) {
            row.workstage_basics_status = '启用'
        }else {
             row.workstage_basics_status = '弃用'
        }
        row.workstage_basics_creation_time = this.getTime(row.workstage_basics_creation_time)
        this.$mesBasicInfoTable.show(
          '工序基础信息详情', {
            table: {
              props: ['工序名称', '工序编号', '工序备注', '使用状态', '创建时间', '创建人员'],
              values: [row.workstage_name, row.workstage_number, row.workstage_basics_describe, row.workstage_basics_status,
                row.workstage_basics_creation_time, row.workstage_basics_creation_staff_name]
            }
          })
      },
      // 修改状态
      statusChanged (row) {
        this.$confirm('确认修改状态?').then(action => {
          if (action === 'confirm') {
             let craftBasicsIds = row.workstage_basics_id
            if (row.useStatus === '1') {
              modifyWorkstageBasicsStatus({
                type: 'deprecated',
                'workstageBasicsIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '弃用成功', type: 'success'})
                } else {
                  this.$message({message: '弃用失败', type: 'error'})
                }
                this.getList()
              })
            } else {
              modifyWorkstageBasicsStatus({
                type: 'recover',
                'workstageBasicsIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '启用成功', type: 'success'})
                } else {
                  this.$message({message: '启用失败', type: 'error'})
                }
                this.getList()
              })
            }
          }
        }).catch(action => {
          if (action === 'cancel') {
            if (row.isAssigned === '1') {
              row.isAssigned = '0'
            } else {
              row.isAssigned = '1'
            }
          }
        })
      },
      // 新增
      AddCarftBasic () {
        this.visible.addForm = true
      },
      addSubmit () {
        saveWorkstageBasics({
         workstage_name: this.addForm.workstageName,
         workstage_number: this.addForm.workstageNumber,
         workstage_basics_describe: this.addForm.workstageBasicsDescribe, 
         workstage_basics_status: this.addForm.workstageBasicsStatus,
         workstage_basics_creation_staff: this.getUser.staffNumber,
         workstage_basics_creation_staff_id:  this.getUser.userId
        }).then(data => {
          if (data.status === 0) {
            this.$message({message: '新增成功', type: 'success'})
          } else {
            this.$message({message: '新增失败', type: 'error'})
          }
          this.visible.addForm = false
          this.getList()
        })
      },
      // 转换时间格式
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
            return ''
        } else {
            return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
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
      }
    },
    watch: {
    }
  }
</script>

<style>
 .detail-table .detail-table-row .detail-table-item .th-name{
   width: 33%;
 }
 .el-table th>.cell{
   color: #333;
 }
</style>
