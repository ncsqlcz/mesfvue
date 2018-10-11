<!--刘川中 2018.3.29-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" style="line-height: 40px">
          当前在线人数：{{ sessionCount }}人
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
            <el-select v-model="filters.firstLetter" placeholder="按首字母搜索" @change="getList">
              <el-option
                v-for="item in letters"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="4">
            <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入姓名或工号关键字" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="staffList" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="role_staff_number" label="工号" sortable></el-table-column>
      <el-table-column prop="role_staff_name" label="姓名" sortable></el-table-column>
      <el-table-column prop="role_staff_number" label="工号" sortable></el-table-column>
      <el-table-column prop="role_staff_status" label="员工状态" sortable>
        <template slot-scope="scope">
          {{ scope.row.role_staff_status === '1' ? '被删除' : '正常' }}
        </template>
      </el-table-column>
      <el-table-column prop="isAssigned" label="是否配置mes账号" width="" sortable>
        <template slot-scope="scope">
          <el-select v-model="scope.row.isAssigned" placeholder="请选择"
                     @change="handleAssignedChanged(scope.row)" :disabled="scope.row.role_staff_status === '1'">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="resetPassword(scope.row)"
                     v-if="scope.row.role_staff_status !== '1' && scope.row.isAssigned === '1'">重置密码</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="undoDelete(scope.row)"
                     v-if="scope.row.role_staff_status === '1'">撤销删除</el-button>
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

  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryStaffInformation, saveUser, removeUser, modifyPasswordOrUndo } from '../../../api/api'

  export default {
    name: 'user-info',
    data () {
      return {
        filters: {
          keyword: '',
          firstLetter: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        letters: [],
        staffList: [],
        options: [
          {value: '1', label: '是'},
          {value: '0', label: '否'}
        ],
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          editLoading: false
        },
        sessionCount: 0
      }
    },
    computed: {},
    mounted () {
      this.getList()
      for (let i = 65; i < 65 + 26; i++) {
        this.letters.push({ key: String.fromCharCode(i), value: String.fromCharCode(i) })
      }
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
          keyword: '',
          firstLetter: '',
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
        queryStaffInformation(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.sessionCount = res.map.sessioncount
            this.filters.total = res.map.line
            // 是否分配用户
            res.map.staffList.forEach(item => {
              if (item.userDO && item.userDO.role_user_status === '0') {
                item.isAssigned = '1'
              } else {
                item.isAssigned = '0'
              }
            })
            this.staffList = res.map.staffList
          } else {
            this.filters.total = 0
            this.staffList = []
          }
          this.visible.listLoading = false
        })
      },
      // 是否分配用户
      handleAssignedChanged (row) {
        this.$confirm('<h2 style="font-size:20px">确认分配用户？</h2>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(action => {
          if (action === 'confirm') {
            if (row.isAssigned === '1') {
              saveUser({
                staffId: row.role_staff_id,
                userName: row.role_staff_name,
                password: '123.com'
              }).then(data => {
                if (data.status === 0) {
                  this.$alert('<h2 style="color:#000; font-size:18px">用户名为员工工号,</h2><h1 style="color:green; font-size:25px">密码: 123.com</h1>', '分配成功', {dangerouslyUseHTMLString: true})
                } else {
                  this.$message({message: '分配失败', type: 'error'})
                }
                this.getList()
              })
            } else {
              removeUser({
                userId: row.user.role_staff_id
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '已取消分配用户', type: 'success'})
                } else {
                  this.$message({message: '取消分配用户失败', type: 'error'})
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
      resetPassword (row) {
        this.$confirm('<h2 style="color:#da4f49; font-size:20px">确认重置此用户的密码吗？</h2>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          dangerouslyUseHTMLString: true
        }).then(action => {
          if (action === 'confirm') {
            let para = {
              type: 'reset',
              userId: row.userDO.role_user_id,
              password: '123.com'
            }
            modifyPasswordOrUndo(para).then(res => {
              if (res.status === 0) {
                this.$alert('<h2 style="color:#5bb75b; font-size:26px">重置后的密码: 123.com</h2>', '重置密码成功', {dangerouslyUseHTMLString: true})
                this.getList()
              } else {
                this.$message.error(res.msg || '重置失败')
              }
            })
          }
        }).catch(() => {})
      },
      undoDelete (row) {
        console.log(row);
        this.$confirm('确认撤销删除吗？', '提示').then(action => {
          if (action === 'confirm') {
            let para = {
              type: 'undo',
              staffId: row.role_staff_id
            }
            modifyPasswordOrUndo(para).then(res => {
              if (res.status === 0) {
                this.$message.success('撤销成功')
                this.getList()
              } else {
                this.$message.error(res.msg || '撤销失败')
              }
            })
          }
        }).catch(() => {})
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>
