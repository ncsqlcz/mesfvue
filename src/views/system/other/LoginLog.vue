<template>
  <el-row>
    <el-col :span="24">
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading"
                @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="登录时间" width="200" sortable>
          <template slot-scope="scope">
            {{ scope.row.role_user_loginRecord_time }}
          </template>
        </el-table-column>
        <el-table-column prop="role_user_loginRecord_IP" label="登录IP" sortable></el-table-column>
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
  </el-row>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryUserLoginRecord } from '../../../api/api'
  import {mapGetters} from 'vuex'
  export default {
    name: 'login-log',
    data () {
      return {
        filters: {
          userId: '',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
          listLoading: false
        },
        selectIds: []
      }
    },
    computed: {
      ...mapGetters(['getUser'])
    },
    mounted () {
      if (!this.getUser.userId) {
        this.$message.error('没有找到你的ID')
      } else {
        this.filters.userId = this.getUser.userId
        this.getList()
      }
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
          userId: this.getUser.userId,
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取列表
      getList () {
        
        let para = Object.assign(this.filters, {
          
        })
        this.visible.listLoading = true
        queryUserLoginRecord(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.recordsLine
            this.list = res.map.records
            this.list.map(v => {
              v.role_user_loginRecord_time = utils.formatDate.format(new Date(v.role_user_loginRecord_time), 'yyyy-MM-dd hh:mm:ss')
            })
          } else {
            this.filters.total = 0
            this.posts = []
          }
          this.visible.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
