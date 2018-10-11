<!--张叶青 2018/05/02 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="24" class="text-right">
          <el-form-item :span="4">
            <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入名称或编号" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="craftBasicsList" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"  label="序号"></el-table-column>
      <el-table-column prop="craft_workstep_basics_name" label="工步名称" sortable></el-table-column>
      <el-table-column prop="craft_workstep_basics_num"  label="工步编号" sortable></el-table-column>
      <el-table-column prop="craft_workstep_basics_describle" label="工步描述" ></el-table-column>
      <el-table-column  label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-view" @click="parameterDetail(scope.row,'detail')">参数详情</el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="parameterEdit(scope.row,'edit')">修改参数</el-button>
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
     <!--参数详情 start-->
    <el-dialog :visible.sync="visible.detailForm" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" >参数详情</span>
      <el-table :data="parameterList" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="standard_parameter_name" label="参数名称" sortable></el-table-column>
      <el-table-column prop="standard_parameter_describle"  label="参数描述"></el-table-column>
      <el-table-column prop="standard_parameter_specifications" label="参数规格" ></el-table-column>
      <el-table-column prop="workstepParameterRelation.devices_control_devices_type_id" label="设备类型" ></el-table-column>
      <el-table-column  label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="unitDetail(scope.row)">查看单位</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    </el-dialog>
    <!--参数详情 end-->

     <!--单位详情 start-->
    <el-dialog :visible.sync="visible.unitLoading" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" >参数详情</span>
      <el-table :data="units" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="parameter_unit_name" label="单位名称" sortable></el-table-column>
      <el-table-column prop="parameter_unit"  label="单位符号"></el-table-column>
      <el-table-column prop="parameter_unit_type" label="单位类型" ></el-table-column>
    </el-table>
     <div class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </div>
    </el-dialog>
    <!--单位详情 end-->

     <!--修改参数 start-->
    <el-dialog :visible.sync="visible.editLoading" :close-on-click-modal="false">
      <span slot="title" class="el-dialog__title" >修改参数</span>
      <el-card class="box-card"  style="margin-top: -25px;">
        <div slot="header" class="clearfix">
          <el-button  style="float: right;" type="primary" size="small" @click="addUnit">选择参数</el-button>
        </div>
        <el-table :data="parameterList" highlight-current-row
                v-loading="visible.listLoading"
                @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
        <el-table-column prop="standard_parameter_name" label="参数名称" sortable></el-table-column>
        <el-table-column label="设备类型" >
          <template slot-scope="scope">
           <el-select   
                     v-model="scope.row.workstepParameterRelation.devices_control_devices_type_id"
                     size="medium"
                     @change="getList"
                     style="width:150px">
             <el-option
              v-for="item in typeList"
              :key="item.devices_control_devices_type_id"
              :label="item.devices_control_devices_type_name"
              :value="item.devices_control_devices_type_id">
            </el-option>
            </el-select>
            </template>
        </el-table-column>
        <el-table-column  label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="delete" size="small" icon="el-icon-view" @click="unitDetail(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <div class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                      :total="filters.total"
                      @current-change="handlePageChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>
      </el-card>
      <div style="height: 30px;">
      <el-button type="primary" style="float: right; margin-top: 10px;" size="small" @click="parameterEdit(scope.row,'edit')">提交</el-button>
      </div>
    </el-dialog>
    <!--修改参数 end-->
    <params :paramsAdd="paramsAdd" ref="method"></params>
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {queryStepBasics, modifyStepBasicsStatus, queryStepBasicsAboutParameter, queryDeviceTypes, queryParameterUnits
  } from '../../../api/api'
  import {mapGetters} from 'vuex'
  import params from '../children/Params'  
  export default {
      name: 'MaintainRecord',
      components: {
        'params': params,
      },
    data () {
     return {
        filters: {
            pageSize: 10,
            page: 1,
            total: 0,
            keyword:'',
            type: 'vague'
        },
         paramsAdd: {
          show: false,
          deviceId: ''
        },
        craftBasicsList: [],
        craftsDetail: [],
        typeList:[],
        processDescribles: [],
        craftSegments: [],
        status: '0',
        units: [],
        parameterList: [],
        type: [],
        typename: '',
        visible: {
            listLoading: false,
            detailForm: false,
            editLoading: false,
            addForm: false,
            unitLoading: false,
            paramLoading: false
        },
        querySearchPostTimeout: null,
        }
    },
    computed: {
        ...mapGetters(['getUser'])
    },
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
        return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
      },
      // 重置
      reset () {
        this.filters = {
          type: 'vague',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取工步参数管理信息列表
      getList () { 
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
        }, this.filters)
        queryStepBasics(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.craftBasicsList = res.map.resultList
          } else {
            this.filters.total = 0
            this.craftBasicsList = []
          }
        })
        this.getTypeList()
      },
      // 设备类型
      getTypeList () {
        queryDeviceTypes({}).then((res) => {
          if (res.status === 0) {
             this.typeList = res.map.devices_control_devices_type
          }
        })
      },
      // 获取设备类型名称
      getTypeName (id) {
        let name = ''
        this.typeList.forEach(element => {
          if (element.devices_control_devices_type_id === id){
            name = element.devices_control_devices_type_name
          }
        });
        return name
      },
      // 参数详情
      parameterDetail (row , temp) {
        if (temp === 'detail') {
          this.visible.detailForm = true
        }else {
         this.visible.editLoading = true
        }
        queryStepBasicsAboutParameter ({
          workstepBasicsId: row.craft_workstep_basics_id,
          headNum: 1
        }).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.counts
            this.parameterList = res.map.resultList
            this.parameterList.forEach(element => {
              element.workstepParameterRelation.devices_control_devices_type_id=this.getTypeName(element.workstepParameterRelation.devices_control_devices_type_id)
            });
          } else {
            this.filters.total = 0
            this.parameterList = []
          }
        })
      },
      // 查看单位
      unitDetail (row) {
       queryParameterUnits ({
         realationParameterId: row.standard_parameter_id,
         headNum: 1
       }).then ( (res) =>{
          if (res.status === 0){
            this.filters.total = res.map.lines
            this.units = res.map.list
          }else {
            this.units = []
          }
       })
       this.visible.unitLoading = true
      },
       // 参数修改
      parameterEdit (row , temp) {
        this.parameterDetail(row , temp)
      },
      addUnit () {
        this.paramsAdd.show = true
      },
      // 转换时间格式
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
            return ''
        } else {
            return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
     }
    },
    watch: {
    }
  }
</script>

<style>
 .detail-table .detail-table-row .detail-table-item .th-name{
   width: 33%;
 }
 .el-table th>.cell{
   color: #333;
 }
</style>
