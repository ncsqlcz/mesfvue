<!--朱缘辉 2018.05.03-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="6" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增成品莫模型</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">成品模型管理</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="18" class="text-right">
          <el-form-item :span="4">
            <el-select v-model="filters.workshopId" placeholder="选择车间" size="medium" @change="getList">
              <el-option
                v-for="item in workshopList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-select v-model="filters.workshopId" placeholder="选择车间" size="medium" @change="getList">
              <el-option
                v-for="item in workshopList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-input v-model.trim="filters.staffName" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->

    <!--列表 start-->
    <el-table :data="staffs" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="role_staff_name" label="成品名称" sortable></el-table-column>
      <el-table-column prop="role_staff_number" label="成品型号" sortable></el-table-column>
      <el-table-column prop="post.role_post_name" label="成品编号" sortable></el-table-column>
      <el-table-column prop="post.role_post_name" label="成品类型" sortable></el-table-column>
      <el-table-column prop="post.role_post_name" label="状态" sortable></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
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

    <!--新增成品模型 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title">新增成品模型</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="12">
          <el-form-item label="成品名称" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品类型" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品型号" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品编号" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品单位" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额定电压" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开路电压" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电池内阻" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电池阻抗" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品外形" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品尺寸" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品重量" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额定容量" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="充电特性" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="充电速率" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="自放电率" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用温度" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全性能" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环保性能" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储寿命" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特点" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用范围" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注意事项" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成品备注" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">确认提交</el-button>
      </div>
    </el-dialog>
    <!--新增成品 模型 end-->
    <!--成品类型管理 start-->

    <!--成品类型管理 end-->

  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {getStaffList, saveStaff, editStaff, removeStaff, getPostList,
    saveUser, removeUser
  } from '../../../api/api'

  export default {
    name: 'staff',
    data () {
      // 性别不能为空
      const checkSex = (rule, value, callback) => {
        if (value === '-1') {
          return callback(new Error('请选择性别'))
        } else {
          callback()
        }
      }
      return {
        filters: {
          staffName: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        },
        staffs: [],
        options: [
          {value: '1', label: '是'},
          {value: '0', label: '否'}
        ],
        // dataPicker 选择今天之前的时间
        pickerOptionsBefore: utils.pickerOptionsBefore,
        pickerOptionsBirth: {
          disabledDate (time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        querySearchPostTimeout: null,
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          editLoading: false
        },
        isAddForm: true,
        addForm: {
          staffId: '',
          staffNumber: '',
          staffName: '',
          staffBirth: '',
          staffTEL: '',
          postId: '',
          postName: '',
          remark: '',
          employTime: '',
          staffSex: '-1',
          staffNative: '',
          email: '',
          address: ''
        },
        addFormRules: {
          staffNumber: { required: true, message: '工号不能为空', trigger: 'blur' },
          staffName: { required: true, message: '姓名不能为空', trigger: 'blur' },
          staffSex: { required: true, validator: checkSex, message: '请选择性别', trigger: '' },
          staffBirth: { required: true, message: '请选择生日', trigger: 'blur' },
          employTime: { required: true, message: '请选择入职日期', trigger: 'blur' },
          staffNative: { required: true, message: '请选择籍贯', trigger: 'blur' },
          staffTEL: { required: true, validator: utils.checkTel, trigger: 'blur' },
          email: { required: false, validator: utils.checkEmail, trigger: 'blur' }
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
          staffName: '',
          type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取用户列表
      getList () {
        // 注意后端分页用的字段是headNum, 所以要转换一下
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize)
        }, this.filters)
        this.visible.listLoading = true
        getStaffList(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            // 是否分配用户
            res.map.staffs.forEach(item => {
              if (item.user === null) {
                item.isAssigned = '0'
              } else {
                item.isAssigned = '1'
              }
            })
            this.staffs = res.map.staffs
          } else {
            this.filters.total = 0
            this.staffs = []
          }
          this.visible.listLoading = false
        })
      },
      // 查看详情
      handleView (row) {
        this.$mesBasicInfoTable.show(
          '员工信息', {
            table: {
              props: ['工号', '入职日期', '姓名', '性别', '出生年月', '籍贯', '手机', '邮箱', '住址', '备注'],
              values: [row.role_staff_number, row.role_staff_employ_time, row.role_staff_name, row.role_staff_sex,
                row.role_staff_birth, row.role_staff_native_place, row.role_staff_TEL,
                row.role_staff_email, row.role_staff_address, row.role_remark]
            }
          })
      },
      // 新增
      handleAdd () {
        if (this.addForm.staffId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            staffId: '',
            staffNumber: '',
            staffName: '',
            staffBirth: '',
            staffTEL: '',
            postId: '',
            postName: '',
            remark: '',
            employTime: '',
            staffSex: '-1',
            staffNative: '',
            email: '',
            address: ''
          }
          this.$refs['addForm'].resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          staffId: row.role_staff_id,
          staffNumber: row.role_staff_number,
          staffName: row.role_staff_name,
          staffBirth: row.role_staff_birth,
          staffTEL: row.role_staff_TEL,
          postId: row.post && row.post.role_post_id,
          postName: row.post && row.post.role_post_name,
          remark: row.role_remark,
          employTime: row.role_staff_employ_time,
          staffSex: row.role_staff_sex,
          staffNative: row.role_staff_native_place,
          email: row.role_staff_email,
          address: row.role_staff_address
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
          if (action === 'confirm') {
            removeStaff({staffId: row.role_staff_id, status: '1'}).then((res) => {
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
              para.staffBirth = (!para.staffBirth || para.staffBirth === '') ? '' : utils.formatDate.format(new Date(para.staffBirth), 'yyyy-MM-dd')
              para.employTime = (!para.employTime || para.employTime === '') ? '' : utils.formatDate.format(new Date(para.employTime), 'yyyy-MM-dd')
              if (this.isAddForm) {
                saveStaff(para).then((res) => {
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
                editStaff(para).then((res) => {
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
      // 搜索职位
      querySearchPostAsync (queryString, cb) {
        clearTimeout(this.querySearchPostTimeout);
        this.querySearchPostTimeout = setTimeout(() => {
          getPostList({
            type: 'info',
            headNum: 1,
            postName: queryString
          }).then(data => {
            if (data.status === 0) {
              cb(data.map.post.map(v => {
                return {
                  value: v.role_post_name,
                  role_post_id: v.role_post_id
                }
              }))
            } else {
              let arr = []
              cb(arr)
            }
          })
        }, 300)
      },
      // 选中职位
      handlePostSelect (item) {
        this.addForm.postId = item.role_post_id
      },
      // 是否分配用户
      handleAssignedChanged (row) {
        this.$confirm('确认分配用户?').then(action => {
          if (action === 'confirm') {
            if (row.isAssigned === '1') {
              saveUser({
                staffId: row.role_staff_id,
                userName: row.role_staff_name,
                password: '123.com'
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '分配成功', type: 'success'})
                } else {
                  this.$message({message: '分配失败', type: 'error'})
                }
                this.getDataList()
              })
            } else {
              removeUser({
                userId: row.user.role_user_id
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '已取消分配用户', type: 'success'})
                } else {
                  this.$message({message: '取消分配用户失败', type: 'error'})
                }
                this.getDataList()
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
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
