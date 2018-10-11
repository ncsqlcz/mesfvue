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
          lazy
          highlight-current
          :load="loadNode"
          @node-click="nodeClick"
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
      <div class="clearfix">
        <el-col :span="24" class="toolbar">
          <p class="tree-title">人员结构详细</p>
        </el-col>
      </div>
      <!--列表 start-->
      <el-table :data="list" highlight-current-row
                v-loading="visible.listLoading">
        <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
        <el-table-column prop="" label="人员" sortable>
          <template slot-scope="scope">
            {{ scope.row.staff.role_staff_name }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="职位" sortable>
          <template slot-scope="scope">
            {{ scope.row.post.role_post_name }}
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
  import utils from '../../common/js/utils'
  import { queryProductLines, queryTeamStaff, queryWorkShopInfos } from '../../api/api'

  export default {
    name: 'structure',
    data () {
      return {
        filters: {
          type: 'info',
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
          children: 'workshops',
          label: 'name',
          isLeaf: 'leaf'
        },
        treeLoading: false,
        productLineId: '',
        workshopId: ''
      }
    },
    mounted () {
      this.getLines()
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
          type: 'info',
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
        queryProductLines(para).then((res) => {
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
      // 获取产线列表并生成树
      getLines () {
        this.treeLoading = true
        let para = {
          type: 'info'
        }
        queryProductLines(para).then((res) => {
          if (res.status === 0) {
            res.map.productLines.forEach(item => {
              item.name = item.product_line_name
            })
            this.tree = res.map.productLines
          } else {
            this.tree = []
          }
          this.treeLoading = false
        })
      },
      getStaffs (para) {
        this.list = []
        this.visible.listLoading = false
        para = Object.assign({
          
        }, para)
        return new Promise(resolve => {
          queryTeamStaff(para).then(res => {
            if (res.status === 0) {
              // this.filters.page = data.currentPage
              this.filters.total = res.map.lines
              this.list = res.map.postStaff
            } else {
              this.filters.total = 0
              this.list = []
            }
            this.visible.listLoading = false
            resolve(this.list)
          })
        })
      },
      loadNode (node, resolve, reject) {
        if (node.level === 0) {
          return resolve([{ name: '' }]);
        }
        // 一级子节点
        if (node.level === 1) {
          let para = {
            type: 'workshop',
            productLineId: node.data.product_line_id
          }
          queryWorkShopInfos(para).then(res => {
            if (res.status === 0) {
              res.map.workshops.forEach(item => {
                item.name = item.role_workshop_name
              })
              resolve(res.map.workshops)
            } else {
              resolve([])
            }
          })
        }
        // 二级子节点
        if (node.level === 2) {
          let para = {
            type: 'workstage',
            workshopId: node.data.role_workshop_id
          }
          queryWorkShopInfos(para).then(res => {
            if (res.status === 0) {
              res.map.workstages.forEach(item => {
                item.name = item.workstage_name
                item.leaf = true
              })
              resolve(res.map.workstages)
            } else {
              resolve([])
            }
          })
        }
        // 三级子节点
        if (node.level === 3) {
          return resolve([]);
        }
      },
      nodeClick (e, node, self) {
        // 一级子节点
        if (node.level === 1) {
          this.getStaffs({ productLineId: node.data.product_line_id })
        }
        // 二级子节点
        if (node.level === 2) {
          this.getStaffs({ workshopId: node.data.role_workshop_id })
        }
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
