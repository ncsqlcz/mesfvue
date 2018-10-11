<!-- 张叶青 2018.05.02 -->
<template>
  <el-dialog title="选择参数" :visible.sync="paramsAdd.show" class="mes-dialog" width="40%">
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent class="text-right">
         <el-form-item :span="3">
            <el-select  placeholder="参数类型"  v-model="paramsTypeId" size="medium" @change="getDataList">
              <el-option v-for="item in paramsType" :key="item.standard_parameter_type_name" :label="item.standard_parameter_type_name" :value="item.standard_parameter_type_id">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item>
          <el-input v-model="filters.postName" placeholder="输入关键字" @keyup.native.enter="getDataList" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="getDataList" icon="el-icon-search" size="small">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表 start-->
    <el-table :data="list" v-loading="listLoading"
              row-class-name="el-mini-row pointer"
              ref="multipleTable"
              @selection-change="handleSelectionChange"
              @row-click="toggleCurrentRow"
              :highlight-current-row="multiple">
      <el-table-column type="selection" width="55" v-if="multiple"></el-table-column>
      <el-table-column type="index" :index="getIndex" v-else></el-table-column>
      <el-table-column prop="standardParameterList[0].standard_parameter_name" label="参数名称" ></el-table-column>
      <el-table-column prop="standardParameterList[0].standard_parameter_describle" label="参数描述" ></el-table-column>
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
  import { queryNormParameter, queryParameterType } from '../../../api/api'
  export default {
    name: 'params-add',
    props: ['paramsAdd'],
    data () {
      return {
        filters: {
          type: 'parameterTypeQuery',
          status: 0,
          page: 1,
          pageSize: 10,
          total: 0,
          postName: ''
        },
        action: '', // 动作
        paramLoading: false,
        selectedRows: null,
        list: [],
        paramsType: [],
        paramsTypeId: '',
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
      selectParams (){
        queryParameterType ({
          type: 'vague',
          normParameterId: '',
          keyword: '',
          status: 0
        }).then(data => {
          this.paramsType = data.map.resultList
        })
      },
      // 确认选择
      confirmSelected (row) {
        this.paramsAdd.show = false
        if (this.multiple) {
          this.selectedRows = this.$refs.multipleTable.selection
          this.value.push(this.selectedRows)
        }
        this.$emit('selectValue',this.value)
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
        this.selectParams()
        this.listLoading = true
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          parameterTypeId: this.paramsTypeId
        }, this.filters)
        queryNormParameter(para).then((data) => {
          if (data.status === 0) {
            this.filters.total = data.map.counts
            this.list = data.map.resultListTree
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