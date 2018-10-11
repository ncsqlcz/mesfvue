<!--刘川中 2018.4.8-->
<template>
  <el-row style="background-color: transparent">
    <el-col :span="24">
      <h3>{{ title }}</h3>
    </el-col>
    <!--右边列表-->
    <el-col :span="24">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="4" class="text-left">
            <el-form-item>
              <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">新增</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="20" class="text-right" hidden>
            <el-form-item :span="4">
              <el-input v-model.trim="filters.productLineName" size="medium" placeholder="输入关键字" @keyup.native.enter="getList"></el-input>
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
        <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
        <el-table-column prop="staff.role_staff_name" label="员工名称" sortable></el-table-column>
        <el-table-column prop="post.role_post_name" label="职位" sortable></el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">移除</el-button>
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

  </el-row>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryTeamStaff, addStaff, removeTeamStaff, queryTeamPost } from '../../../api/api'

  export default {
    name: 'product-lines',
    data () {
      return {
        type: '',
        typeId: '',
        title: '',
        filters: {
          // productLineName: '',
          // type: 'info',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
        },
        selectedIds: [],
        postList: []
      }
    },
    mounted () {
      this.type = this.$route.query.type
      this.typeId = this.$route.query.id
      this.title = this.$route.query.title
      if (this.type === '' || this.typeId === '') {
        this.$message({ message: '非法访问', type: 'warning' })
        this.$router.back()
      } else {
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
          // productLineName: '',
          // type: 'info',
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
        para[this.type] = this.typeId
        this.visible.listLoading = true
        queryTeamStaff(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.lines
            this.list = res.map.postStaff
            this.selectedIds = this.list.map(v => v.staff.role_staff_id)
          } else {
            this.filters.total = 0
            this.list = []
            this.selectedIds = []
          }
          this.visible.listLoading = false
        })
      },
      // 获取职位列表
      getPostList () {
        let para = {
          headNum: 1
        }
        para[this.type] = this.typeId
        return new Promise(resolve => {
          queryTeamPost(para).then(res => {
            if (res.status === 0 && res.map && res.map.postStaff.length > 0) {
              this.postList = res.map.postStaff
              resolve()
            } else {
              this.$message({message: res.msg || '职位数据为空，请先配置职位', type: 'warning'})
            }
          })
        })
      },
      // 新增
      handleAdd () {
        this.getPostList().then(() => {
          let para = {
            type: 'post',
            multiple: true,
            selectedIds: this.selectedIds,
            reRender: true
          }
          para[this.type] = para[this.typeId]
          para.postList = this.postList.map(v => v.post)
          this.$mesStaff.show(para).then(res => {
            let ids = []
            res.rows.forEach(v => {
              let exist = false
              for (let i = 0, len = this.selectedIds.length; i < len; i++) {
                if (this.selectedIds[i] === v.role_staff_id) {
                  exist = true
                  break
                }
              }
              if (!exist) {
                ids.push(v.role_staff_id)
              }
            })
            let para = {
              type: this.type.split('Id')[0],
              staffIds: ids.join(','),
              postId: res.postId
            }
            switch (this.type) {
            case 'productLineId':
              para['productId'] = this.typeId
              break;
            case 'workstageId':
              para[this.type] = this.typeId
              break;
            case 'workshopId':
              para[this.type] = this.typeId
              break;
            }
            if (para.staffIds !== '') {
              addStaff(para).then(res => {
                if (res.status === 0) {
                  this.$message({message: '新增成功', type: 'success'})
                  this.getList()
                } else {
                  this.$message({message: res.msg || '新增失败', type: 'error'})
                }
              })
            }
          })
        })
      },
      // 删除
      handleDelete (row) {
        console.log(row)
        this.$confirm('确定移除吗？').then(action => {
          if (action === 'confirm') {
            let para = {
              staffId: row.staff.role_staff_id,
              relationId : row.staff_team_relation_id
            }
            para[this.type] = this.typeId
            removeTeamStaff(para).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '移除成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '移除失败', type: 'error' })
              }
              this.visible.addLoading = false
              this.getList()
            })
          }
        }).catch()
      }
    }
  }
</script>

<style scoped>

</style>
