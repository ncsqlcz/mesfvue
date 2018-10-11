<!--张叶青 2018/04/08 -->
<template>
  <el-row style="background-color: transparent">
    <el-col :span="24">
      <h3>{{ title }}</h3>
    </el-col>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">增加人员</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="4">
            <el-select v-model="ProductLineId" placeholder="请选择产线" clearable 
                     size="medium"
                     @change="getProductLineList">
              <el-option
                v-for="item in ProductLineList"
                :key="item.product_line_id"
                :label="item.product_line_name"
                :value="item.product_line_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-select v-model="workshopId" placeholder="请选择车间" clearable
                     size="medium"
                     @change="getWorkshopList">
              <el-option
                v-for="item in woreshopList"
                :key="item.role_workshop_id"
                :label="item.role_workshop_name"
                :value="item.role_workshop_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-select v-model="workstageBasicsId" placeholder="请选择工序" clearable
                     size="medium"
                     @change="getWorkstageBasicsList">
              <el-option
                v-for="item in workstageBasicsList"
                :key="item.workstage_basics_id"
                :label="item.workstage_name"
                :value="item.workstage_basics_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" v-on:click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->

    <!--列表 start-->
    <el-table :data="classStaffs" 
              v-loading="visible.listLoading"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="toggleCurrentRow"
              :highlight-current-row="multiple">
       <el-table-column type="selection" width="55" v-if="multiple"></el-table-column>
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="staff.role_staff_name" label="人员名称" sortable></el-table-column>
      <el-table-column prop="staff_class_time"  label="换班时间" sortable>
        <template slot-scope="scope">
          {{getTime(scope.row.staff_class_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页start -->
    <el-col :span="24" class="toolbar">
      <el-col :span="6">
            <el-button type="danger" size="small" @click="handleDelede" icon="el-icon-delete" :disabled="!selectedRows || selectedRows.length === 0">批量移除</el-button>
            <el-button type="primary" size="small" @click="handleChange" icon="el-icon-edit" :disabled="!selectedRows || selectedRows.length === 0">更换班次</el-button>
      </el-col>
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页end -->


  </section>
  </el-row>
</template>

<script>
  import utils from '../../common/js/utils'
  import {getShiftList, removeClassStaff, queryProductLines, addClassStaff, queryWorkShopInfos, queryWorkstageBasics, changeClassStaff
  } from '../../api/api'

  export default {
    data () {
      return {
        filters: {
          type: 'classStaff',
          pageSize: 10,
          page: 1,
          total: 0
        },
        classStaffs: [],
        addStaffStage: true,
        selectedStaffIds: [],
        ProductLineList: [],
        workstageBasicsList: [],
        woreshopList: [],
        ProductLineId: '',
        workshopId: '',
        workstageBasicsId: '',
        title: '',
        selectedRows: null,
        multiple: true,
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
        selectedIds: [],
        selectShiftIds: '',
        addFormRules: {
          className: { required: true, message: '班次名称不能为空', trigger: 'blur' }
        }
      }
    },
    computed: {
    },
    mounted () {
      this.type = this.$route.query.type
      this.classId = this.$route.query.id
      this.title = this.$route.query.title
      this.getList()
      // this.queryProductLinesList=queryProductLines()
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
         type: 'classStaff',
          pageSize: 10,
          page: 1,
          total: 0,
        }
        this.ProductLineId= '',
        this.workshopId= '',
        this.workstageBasicsId= ''
        this.getList()
      },
      // 获取产线  获取车间 获取工序
      getProductLines () {
        queryProductLines({
          type: 'info',
          headNum: 1
        }).then(data => {
          this.ProductLineList = data.map.productLines
        })
        queryWorkShopInfos({
          type: 'info',
          headNum: 1
        }).then(data => {
          this.woreshopList = data.map.workshopInfos
        })
        queryWorkstageBasics({
          type: 'vague',
          status: 0,
          headNum: 1
        }).then(data => {
          this.workstageBasicsList = data.map.workstageBasicsList
        })
      },
      getProductLineList(){
        this.workshopId= '',
        this.workstageBasicsId= ''
        this.getList()
      },
      getWorkshopList(){
        this.ProductLineId= '',
        this.workstageBasicsId= ''
        this.getList()
      },
      getWorkstageBasicsList(){
        this.ProductLineId= '',
        this.workshopId= ''
        this.getList()
      },
      //  获取班次人员列表
      getList () {
        
        this.getProductLines()
        let para
        if (this.ProductLineId) {
          para = {
            productlineId: this.ProductLineId,
            type: 'classStaff'
          }
        } else if (this.workstageBasicsId) {
          para = {
            workstageId: this.workstageBasicsId,
            type: 'classStaff'
          }
        } else if (this.workshopId) {
          para = {
            workshopId: this.workshopId,
            type: 'classStaff'
          } 
        } else {
          para = Object.assign({
            
          }, this.filters)
        }
        para[this.type] = this.classId
        getShiftList(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.classStaffs = res.map.classStaffs
            this.selectedIds = this.classStaffs.map(v => v.staff.role_staff_id)
          } else {
            this.filters.total = 0
            this.classStaffs = []
          }
        })
      },
    //  选中
      handleSelectionChange (val) {
        this.selectedRows = val
      },
       // 多选情况
      toggleCurrentRow (row) {
        if (this.multiple) {
          this.$refs.multipleTable.toggleRowSelection(row)
        } else {
          this.confirmSelected(row)
          this.handleDelede(row)
          this.handleChange(row)
        }
      },
       // 确认选择
      confirmSelected (row) {
        this.visible = false
        if (this.multiple) {
          // 选择多行
          this.selectedRows = this.$refs.multipleTable.selection
        } else {
          // 选择单行
          this.selectedRows = [row]
        }
        this.handleAction('selected')
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
      // 新增人员
      handleAdd () {
        let tage = true
        this.$mesStaff.show({
          type: 'all',
          reRender: true,
          selectedIds: this.selectedIds
        }).then(res => {
          this.selectedIds = res.rows.map(v => v.role_staff_id)
          let para = {
            staffIds: res.rows[0].role_staff_id,
            classId: this.classId
          }
          this.classStaffs.forEach(element => {
            if (res.rows[0].role_staff_id === element.staff.role_staff_id) {
              this.$message({message: '该人员已经存在请勿重新选择', type: 'error'})
              tage = false
            }
          });
          if (tage) {
            addClassStaff(para).then(res => {
              if (res.status === 0) {
                this.$message({message: '新增成功', type: 'success'})
                this.getList()
              } else {
                this.$message({message: res.msg || '新增失败', type: 'error'})
              }
            })
          }
        })
      },
      // 批量删除
      handleDelede () {
        this.visible = false
        this.selectedRows = this.$refs.multipleTable.selection
        let staffId = ''
        this.selectedRows.forEach(element => {
          staffId = element.role_staff_class_id + ',' + staffId
        })
        staffId = staffId.substring(0, staffId.length - 1)
        this.$confirm('确定全部移除吗？').then(action => {
          if (action === 'confirm') {
            let para = {
              staffIds: staffId
            }
            para[this.type] = this.classId
            removeClassStaff(para).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '移除成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '移除失败', type: 'error' })
              }
              this.getList()
            })
          }
        }).catch()
      },
      // 更换班次
      handleChange () {
        this.selectedRows = this.$refs.multipleTable.selection
        let staffId = ''
        let selectedStaffClassIds = ''
        this.selectedRows.forEach(element => {
          selectedStaffClassIds = element.role_staff_class_id + ',' + selectedStaffClassIds
          staffId = element.staff.role_staff_id + ',' + staffId
        })
        selectedStaffClassIds = selectedStaffClassIds.substring(0, selectedStaffClassIds.length - 1)
        staffId = staffId.substring(0, staffId.length - 1)
        this.$mesShift.show({
          selectedIds: this.selectShiftIds
        }).then(res => {
          this.selectShiftIds = res.rows.map(v => v.role_class_id)
          let para = {
            classId: res.rows[0].role_class_id,
            staffIds: staffId,
            staffClassIds: selectedStaffClassIds
          }
          changeClassStaff(para).then(res => {
            if (res.status === 0) {
              this.$message({message: '更换成功', type: 'success'})
              this.getList()
            } else {
              this.$message({message: res.msg || '更换失败', type: 'error'})
            }
          })
        })
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
        this.$confirm('确定移除吗？').then(action => {
          if (action === 'confirm') {
            let para = {
              staffIds: row.role_staff_class_id
            }
            para[this.type] = this.classId
            removeClassStaff(para).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '移除成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '移除失败', type: 'error' })
              }
              this.getList()
            })
          }
        }).catch()
      },
      // 转换时间
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
