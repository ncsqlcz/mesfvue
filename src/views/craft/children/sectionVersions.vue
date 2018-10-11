<!-- 张叶青 2018.05.14 -->
<template>
  <el-dialog title="历史版本信息" :visible.sync="sectionVersion.show" class="mes-dialog" width="40%">
    <!--列表 start-->
    <el-table :data="list" v-loading="listLoading"
              row-class-name="el-mini-row pointer"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="toggleCurrentRow"
              :highlight-current-row="multiple">
      <el-table-column type="selection" width="55" v-if="multiple"></el-table-column>
      <el-table-column type="index" :index="getIndex" v-else></el-table-column>
      <el-table-column prop="craft_segment_versions" label="版本号" ></el-table-column>
      <el-table-column prop="product_model_type_name" label="产品类型" ></el-table-column>
      <el-table-column prop="product_model_genre" label="产品型号" ></el-table-column>
      <el-table-column prop="craft_segment_polarity" label="极性" ></el-table-column>
    </el-table>
    <!--列表 end-->

    <!--分页start -->
    <div class="clearfix">
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                       :total="filters.total"
                       @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </el-col>

      <!--确认选择 start-->
      <el-col :span="24" class="text-right mt-4" v-if="multiple">
        <el-button type="success" size="" @click="confirmSelected" >确认选择</el-button>
      </el-col>
      <!--确认选择 end-->
    </div>
    <!--分页end -->
  </el-dialog>
</template>
<script>
  import utils from '../../../common/js/utils'
  import { queryCraftSegmentVersions } from '../../../api/api'
  export default {
    name: 'section-version',
    props: ['sectionVersion'],
    data () {
      return {
        filters: {
          type: 'history',
          page: 1,
          pageSize: 10,
          total: 0,
        },
        action: '', // 动作
        cartLoading: false,
        selectedRows: null,
        list: [],
        listLoading: this.visible,
        callback: null,
        title: '',
        multiple: true,
        selectedIds: [],
        show: false,
        value: []
      }
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      handleSelectionChange (val) {
        this.selectedRows = val
      },
      // 确认选择
      confirmSelected (row) {
        this.cartLoading = false
        if (this.multiple) {
          this.selectedRows = this.$refs.multipleTable.selection
          this.value.push(this.selectedRows)
        }
        console.log(this.value)
      },
      // 多选情况
      toggleCurrentRow (row) {
        if (this.multiple) {
          this.$refs.multipleTable.toggleRowSelection(row)
        } else {
          this.confirmSelected(row)
        }
      },
      // 列表索引
      getIndex (index) {
        return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
      },
      // 获取数据列表
      getDataList () {
        this.listLoading = true
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          craftSegmentBasicsId: '93f269f69b33409994fc32b649aafe30'
        }, this.filters)
        queryCraftSegmentVersions(para).then((data) => {
          if (data.status === 0) {
            this.filters.total = data.map.line
            this.list = data.map.craftSegments
          } else {
            this.filters.total = 0
            this.list = []
          }
          this.listLoading = false
        })
      },
      // 页码改变
      handlePageChange (val) {
        this.filters.page = val
        this.getDataList()
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.filters.pageSize = val
        this.getDataList()
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">

</style>