<!--刘川中 2018.3.29-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增员工</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="filters.workshopId" @change="selectWorkshopName">
              <el-option value="" label="全部车间"></el-option>
              <el-option v-for="value in workshopName" :value="value.role_workshop_id" :label="value.role_workshop_name" :key="value.role_workshop_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="filters.postId" @change="selectPostName">
              <el-option value="" label="所有职位"></el-option>
              <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-input v-model.trim="filters.staffName" size="medium" placeholder="输入姓名或工号" @keyup.native.enter="getList"></el-input>
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
      <el-table-column prop="role_staff_name" label="姓名" sortable></el-table-column>
      <el-table-column prop="role_staff_number" label="工号" sortable></el-table-column>
      <el-table-column prop="role_workshop_name" label="车间" sortable></el-table-column>
      <el-table-column prop="post.role_post_name" label="职位" sortable></el-table-column>
      <el-table-column prop="role_staff_sex" label="性别" sortable></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="clearData()">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增员工</span>
      <span slot="title" class="el-dialog__title" v-else>编辑员工</span>
      <el-form :model="addForm" label-width="80px" label-position="left" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="11" :offset="1">
          <el-form-item label="工号" label-position="left" prop="staffNumber">
            <el-input v-model.trim="addForm.staffNumber" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-position="left" prop="staffName">
            <el-input v-model.trim="addForm.staffName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="出生年月" label-position="left" prop="staffBirth">
            <el-date-picker type="date" v-model="addForm.staffBirth" placeholder="选择日期"
                            format="yyyy-MM-dd" :default-value="new Date((new Date()).getFullYear() - 20 + '')"
                            :picker-options="pickerOptionsBirth"
                            size="medium"></el-date-picker>
          </el-form-item>
          <el-form-item label="电话" label-position="left" prop="staffTEL">
            <el-input v-model.trim="addForm.staffTEL" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="职位ID" label-position="left" prop="postId" hidden>
            <el-input v-model.trim="addForm.postId"></el-input>
          </el-form-item>
          <el-form-item label="职位" label-position="left" prop="postName">
            <el-autocomplete
              v-model="addForm.postName" placeholder="搜索职位"
              :fetch-suggestions="querySearchPostAsync" @select="handlePostSelect"
            ></el-autocomplete>
            <!--<el-input v-model.trim="addForm.postName" placeholder="请选择" size="medium" class="pointer" readonly clearable></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="1">
          <el-form-item label="入职日期" label-position="left" prop="employTime">
            <el-date-picker type="date" v-model.trim="addForm.employTime" placeholder="选择日期"
                            format="yyyy-MM-dd" :default-value="new Date()"
                            :picker-options="pickerOptionsBefore"
                            size="medium"></el-date-picker>
          </el-form-item>
          <el-form-item label="性别" label-position="left" prop="staffSex">
            <el-radio-group v-model="addForm.staffSex" size="medium">
              <el-radio class="radio" label="男">男</el-radio>
              <el-radio class="radio" label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="籍贯" label-position="left" prop="staffNative">
            <el-select v-model="addForm.staffNative" placeholder="请选择">
              <el-option
                v-for="item in provinceList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                size="medium">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" label-position="left" prop="email">
            <el-input v-model.trim="addForm.email" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="住址" label-position="left">
            <el-input type="textarea" v-model.trim="addForm.address" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="23" :offset="1">
          <el-form-item label="备注" label-position="left" prop="remark">
            <el-input type="textarea" v-model.trim="addForm.remark" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false" @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->

  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import {getStaffList, saveStaff, editStaff, removeStaff, getPostList, queryWorkShopInfos,
    saveUser, removeUser
  } from '../../api/api'

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
          workshopId: '',
          postId: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        staffs: [],
        workshopName: [],
        postName: [],
        axiosData: {
          type: 'info',
        },
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
        staffNumber: '', //修改时判断是否改变了工号
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
          staffBirth: { required: true, message: '请选择出生年月', trigger: 'blur' },
          employTime: { required: true, message: '请选择入职日期', trigger: 'blur' },
          staffNative: { required: true, message: '请选择籍贯', trigger: 'blur' },
          staffTEL: { required: true, validator: utils.checkTelAndTelPhone, trigger: 'blur' },
          email: { required: false, validator: utils.checkEmail, trigger: 'blur' }
        },
        provinceList: [
          {label: '河北省', value: '河北省'},
          {label: '广东省', value: '广东省'},
          {label: '山东省', value: '山东省'},
          {label: '辽宁省', value: '辽宁省'},
          {label: '吉林省', value: '吉林省'},
          {label: '甘肃省', value: '甘肃省'},
          {label: '青海省', value: '青海省'},
          {label: '河南省', value: '河南省'},
          {label: '江苏省', value: '江苏省'},
          {label: '湖北省', value: '湖北省'},
          {label: '湖南省', value: '湖南省'},
          {label: '江西省', value: '江西省'},
          {label: '浙江省', value: '浙江省'},
          {label: '云南省', value: '云南省'},
          {label: '福建省', value: '福建省'},
          {label: '台湾省', value: '台湾省'},
          {label: '海南省', value: '海南省'},
          {label: '山西省', value: '山西省'},
          {label: '四川省', value: '四川省'},
          {label: '陕西省', value: '陕西省'},
          {label: '贵州省', value: '贵州省'},
          {label: '安徽省', value: '安徽省'},
          {label: '黑龙江省', value: '黑龙江省'},
          {label: '北京市', value: '北京市'},
          {label: '天津市', value: '天津市'},
          {label: '上海市', value: '上海市'},
          {label: '重庆市', value: '重庆市'},
          {label: '广西壮族自治区', value: '广西壮族自治区'},
          {label: '内蒙古自治区', value: '内蒙古自治区'},
          {label: '西藏自治区', value: '西藏自治区'},
          {label: '宁夏回族自治区', value: '宁夏回族自治区'},
          {label: '新疆维吾尔自治区', value: '新疆维吾尔自治区'},
          {label: '香港', value: '香港'},
          {label: '澳门', value: '澳门'}
        ]
      }
    },
    computed: {},
    mounted () {
      this.getList()
      this.getWorkshopName()
      this.getPostName()
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
          workshopId: '',
          postId: '',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取用户列表
      getList () {
        let para = Object.assign({
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
              props: ['工号', '入职日期', '姓名', '性别', '出生年月', '籍贯', '电话', '邮箱', '车间', '职位', '住址', '备注'],
              values: [row.role_staff_number, row.role_staff_employ_time, row.role_staff_name, row.role_staff_sex,
                row.role_staff_birth, row.role_staff_native_place, row.role_staff_TEL,
                row.role_staff_email, row.role_workshop_name, row.post.role_post_name, row.role_staff_address, row.role_remark]
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
        console.log(row)
        this.addForm = {
          staffId: row.role_staff_id,
          staffPostId: row.role_staff_post_id,
          staffNumber: row.role_staff_number,
          staffName: row.role_staff_name,
          staffBirth: new Date(row.role_staff_birth),
          staffTEL: row.role_staff_TEL,
          postId: row.post && row.post.role_post_id,
          postName: row.post && row.post.role_post_name,
          remark: row.role_remark,
          employTime: new Date(row.role_staff_employ_time),
          staffSex: row.role_staff_sex,
          staffNative: row.role_staff_native_place,
          email: row.role_staff_email,
          address: row.role_staff_address
        }
        this.staffNumber = row.role_staff_number
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
                if (this.staffNumber === this.addForm.staffNumber) {
                  para.staffNumber = ''
                }
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
      // 获取设备类型
      getWorkshopName () {
        queryWorkShopInfos(this.axiosData).then((data) => {
          this.workshopName = data.map.workshopInfos
        })
      },
      // 获取设备类型
      getPostName () {
        getPostList(this.axiosData).then((data) => {
          this.postName = data.map.post
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
        console.log(item.role_post_id)
        this.addForm.postId = item.role_post_id
      },
      selectWorkshopName () {
        this.filters = {
          staffName: '',
          type: 'info',
          workshopId: this.filters.workshopId,
          postId: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        this.getList()
      },
      selectPostName () {
        this.filters = {
          staffName: '',
          type: 'info',
          workshopId: '',
          postId: this.filters.postId,
          pageSize: 10,
          page: this.filters.page,
          total: 0
        },
        this.getList()
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
