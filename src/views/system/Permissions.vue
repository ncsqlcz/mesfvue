<!--刘川中 2018.4.8-->
<template>
  <el-row :gutter="20" style="background-color: transparent">
    <!--tree start-->
    <el-col :span="12">
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <p class="tree-title">权限树状图</p>
        </el-col>
      </div>

      <div class="clearfix tree-wrap">
        <el-tree
          :data="tree"
          ref="tree"
          :show-checkbox="false"
          node-key="role_function_id"
          :default-expanded-keys="[]"
          :default-checked-keys="[]"
          :props="defaultProps"
          v-loading="treeLoading">
        </el-tree>
      </div>
    </el-col>
    <!--tree end-->

    <!--右边列表-->
    <el-col :span="12">
      <el-col class="toolbar">
        <el-form :inline="true" :model="filters" @submit.native.prevent>
          <el-col :span="24" class="text-right">
            <el-form-item :span="4">
              <el-input v-model.trim="filters.functionName" size="medium" placeholder="输入权限名称" @keyup.native.enter="getList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
              <el-button size="medium" v-on:click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading">
        <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
        <el-table-column prop="name" label="权限名称" sortable></el-table-column>
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
  import utils from '../../common/js/utils'
  import { queryFunction } from '../../api/api'

  export default {
    name: 'permissions',
    data () {
      return {
        filters: {
          functionName: '',
          type: 'function',
          pageSize: 10,
          page: 1,
          total: 0
        },
        list: [],
        visible: {
        },
        tree: [],
        checkedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeLoading: false
      }
    },
    mounted () {
      this.getTree()
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
          functionName: '',
          type: 'function',
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
        queryFunction(para).then((res) => {
          if (res.status === 0) {
            // this.filters.page = data.currentPage
            this.filters.total = res.map.line
            this.list = res.map.functions
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.visible.listLoading = false
        })
      },
      // 获取权限列表并生成树
      getTree () {
        this.treeLoading = true
        let para = {
          type: 'function'
        }
        queryFunction(para).then((res) => {
          if (res.status === 0) {
            this.tree = utils.getTree('0', res.map.functions)
          } else {
            this.tree = []
          }
          this.treeLoading = false
        })
      }
    }
  }
</script>

<style scoped>
  .tree-title{
    height: 40px;
    line-height: 40px;
    margin: 0 0;
    padding-left: 6px;
    font-size: 110%;
  }
  .tree-wrap{
    min-height: 590px;
    background-color: #fff;
  }
</style>
