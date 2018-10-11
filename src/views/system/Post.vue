<!--刘川中 2018.4.1-->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增职位</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item :span="4">
            <el-input v-model.trim="filters.postName" size="medium" placeholder="输入职位名称" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="posts" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="role_post_name" label="职位名称" sortable></el-table-column>
      <el-table-column prop="role_post_leader_name" label="上级" sortable></el-table-column>
      <el-table-column prop="role_post_detail" label="职位说明" sortable></el-table-column>
      <el-table-column label="权限配置" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="handlePermission(scope.row)">权限配置</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-if="scope.row.role_post_grade !== '1' "
          >删除</el-button>
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
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="clearData()" width="30%">
      <span slot="title" class="el-dialog__title" v-if="isAddForm">新增职位</span>
      <span slot="title" class="el-dialog__title" v-else>编辑职位</span>
      <el-form :model="addForm" label-width="80px" label-position="right" :rules="addFormRules" ref="addForm" class="clearfix">
        <el-col :span="22" :offset="1">
          <el-form-item label="上级id" prop="leaderId" hidden>
            <el-input v-model.trim="addForm.leaderId" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <!--<el-form-item label="上级" prop="leaderName">-->
            <!--<el-input v-model.trim="addForm.leaderName" auto-complete="off" size="medium" clearable></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="上级" prop="leaderName">
            <el-autocomplete
              v-model="addForm.leaderName" placeholder="请选择（必选项）"
              :fetch-suggestions="querySearchPostAsync" @blur="clearLeaderIdId" @select="handlePostSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="职位id" prop="postId" hidden>
            <el-input v-model.trim="addForm.postId" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="职位名称" prop="postName">
            <el-input v-model.trim="addForm.postName" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
          <el-form-item label="职位说明" prop="detail">
            <el-input v-model.trim="addForm.detail" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>

          <el-form-item label="grade" prop="grade" hidden>
            <el-input v-model.trim="addForm.grade" auto-complete="off" size="medium" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false" @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->

    <!--权限配置-->
    <permission-tree
      :visible.sync="visible.permission"
      :post-id="postId"
      :title="postName + '的权限设置'"
      :random="Math.random()"
    ></permission-tree>

  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import { getPostList, addPost, editPost, removePost } from '../../api/api'
  import PermissionTree from './components/PermissionTree'

  export default {
    name: 'post',
    data () {
      return {
        filters: {
          postName: '',
          type: 'info',
          post: 'portion', //不显示 root(虚拟最高职位)
          pageSize: 10,
          page: 1,
          total: 0
        },
        posts: [],
        querySearchPostTimeout: null,
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          permission: false
        },
        isAddForm: true,
        addForm: {
          postId: '',
          postName: '',
          detail: '',
          leaderId: '',
          leaderName: '',
          grade: ''
        },
        addFormRules: {
          leaderName: { required: true, message: '上级不能为空', trigger: 'change' },
          postName: { required: true, message: '职位名称不能为空', trigger: 'blur' }
        },
        postId: '-1',
        postName: '',
        beforeEditPostName: ''
      }
    },
    components: { PermissionTree },
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
          postName: '',
          type: 'info',
          post: 'portion', //不显示 root(虚拟最高职位)
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
        getPostList(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            this.posts = res.map.post
          } else {
            this.filters.total = 0
            this.posts = []
          }
          this.visible.listLoading = false
        })
      },
      // 权限
      handlePermission (row) {
        this.postId = row.role_post_id
        this.postName = row.role_post_name
        this.visible.permission = true
      },
      // 查看详情
      handleView (row) {
        this.$mesBasicInfoTable.show(
          '职位信息', {
            table: {
              props: ['上级', '职位名称', '职位说明'],
              values: [row.role_post_leader_name, row.role_post_name, row.role_post_detail]
            }
          })
      },
      // 新增
      handleAdd () {
        if (this.addForm.postId !== '') {
          // 如果用户先点击编辑，再点击新增可能会出现重置到第一次编辑的数据
          this.addForm = {
            postId: '',
            postName: '',
            detail: '',
            leaderId: '',
            leaderName: '',
            grade: ''
          }
          this.$refs.addForm.resetFields()
        }
        this.isAddForm = true
        this.visible.addForm = true
      },
      // 编辑
      handleEdit (row) {
        this.addForm = {
          postId: row.role_post_id,
          postName: row.role_post_name,
          detail: row.role_post_detail,
          leaderId: row.role_post_leader_id,
          leaderName: row.role_post_leader_name,
          grade: row.role_post_leader_name
        }
        this.beforeEditPostName = row.role_post_name
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？').then(action => {
          if (action === 'confirm') {
            removePost({postId: row.role_post_id}).then((res) => {
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
                addPost(para).then((res) => {
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
                  if (this.beforeEditPostName === this.addForm.postName) {
                    para.postName = ''
                  }
                  editPost(para).then((res) => {
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
        this.addForm.leaderId = item.role_post_id
      },
      // 输入职位
      clearLeaderIdId (item) {
        this.addForm.leaderId = ''
      },
      clearData () {
        setTimeout (() => {
          this.$refs.addForm.resetFields()
        },300)
      }
    },
  }
</script>

<style scoped lang="scss">

</style>
