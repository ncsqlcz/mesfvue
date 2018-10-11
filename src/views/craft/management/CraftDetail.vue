<!--张叶青 2018/04/012 -->
<template>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="4" class="text-left">
          <el-button type="primary" size="medium" @click="AddCraft" >新增工艺</el-button>
        </el-col>
        <el-col :span="20" class="text-right">
            <el-form-item :span="3">
            <el-select  placeholder="启用"  
                     v-model="status"
                     size="medium"
                     @change="getList"
                     style="width:90px">
             <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :span="3">
            <el-select placeholder="公版" 
                     v-model="versions"
                     size="medium"
                     @change="getList"
                     style="width:90px">
              <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
           <el-form-item :span="3">
            <el-select  placeholder="全部类型" 
                     v-model="type"
                     size="medium"
                     @change="getList">
              <el-option :value="0"> </el-option>
            </el-select>
          </el-form-item>
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
    <el-table :data="crafts" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="craft_name" label="工艺名称" sortable></el-table-column>
      <el-table-column prop="craft_number"  label="工艺编号" sortable></el-table-column>
      <el-table-column prop="craft_versions" label="工艺版本" ></el-table-column>
      <el-table-column prop="product_model_type_name" label="产品类型" ></el-table-column>
      <el-table-column prop="product_line_name" label="所属产线" ></el-table-column>
      <el-table-column prop="craft_quality_rate" label="优率" ></el-table-column>
      <el-table-column prop="useStatus" label="使用状态" sortable>
          <template slot-scope="scope">
          <el-select v-model="scope.row.useStatus" size="medium"  @change="statusChanged(scope.row)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column> 

      <el-table-column prop="craft_number" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="craftDetail(scope.row)">详情</el-button>
          <el-button type="success" size="small" @click="bomManage(scope.row)">BOM管理</el-button>
          <el-button type="danger" size="small" icon="el-icon-plus" @click="handleDelete(scope.row)">添加到模板</el-button>
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
    <!--详情 start-->
    <el-dialog :visible.sync="visible.detailForm" :title="title" :close-on-click-modal="false" width="70%">
       <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size:16px">基础信息</span>
            <el-button style="float: right; padding: 5px 5px" type="primary" >导出工艺指导书</el-button>
          </div>
          <div class="detail-table">
            <div class="detail-table-row">
              <div class="w-33 detail-table-item">
                <p class="th-name" >工艺名称</p>
                <p class="td-value">{{craftsDetail.craft_name}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">工艺编号</p>
                <p class="td-value">{{craftsDetail.craft_number}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">工艺版本</p>
                <p class="td-value">{{craftsDetail.craft_versions}}</p>
              </div>
            </div>
            <div class="detail-table-row">
              <div class="w-33 detail-table-item">
                <p class="th-name">所属产品类型</p>
                <p class="td-value">{{craftsDetail.product_model_type_name}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">产品型号</p>
                <p class="td-value">{{craftsDetail.product_model_genre}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">优率</p>
                <p class="td-value">{{craftsDetail.craft_quality_rate}}</p>
              </div>
            </div>
            <div class="detail-table-row">
              <div class="w-33 detail-table-item">
                <p class="th-name">是否为公版</p>
                <p class="td-value">{{craftsDetail.craft_open}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">工艺所属线</p>
                <p class="td-value">{{craftsDetail.product_line_name}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">录入时间</p>
                <p class="td-value">{{craftsDetail.craft_creation_time}}</p>
              </div>
            </div>
            <div class="detail-table-row">
              <div class="w-33 detail-table-item">
                <p class="th-name">录入人员</p>
                <p class="td-value">{{craftsDetail.craft_number}}</p>
              </div>
              <div class="w-33 detail-table-item">
                <p class="th-name">备注</p>
                <p class="td-value">{{craftsDetail.craft_number}}</p>
              </div>
            </div>
           </div>
       </el-card>
         <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size:16px">工艺段</span>
          </div>
          <div class="detail-table">
          <el-table :data="craftSegments" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
          <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
          <el-table-column prop="craft_segment_name" label="工艺段名称" ></el-table-column>
          <el-table-column prop="craft_segment_number"  label="工艺段编号" ></el-table-column>
          <el-table-column prop="craft_segment_polarity" label="极性" ></el-table-column>
          <el-table-column prop="craft_segment_versions" label="工艺段版本" ></el-table-column>
          <el-table-column prop="product_model_type_name" label="所属产品类型" ></el-table-column>
          <el-table-column prop="product_model_genre" label="产品型号" ></el-table-column>
          <el-table-column prop="craft_segment_quality_rate" label="优率" ></el-table-column> 
          </el-table>
          </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
            <span style="font-size:16px">事项说明</span>
          </div>
          <div class="detail-table">
            <el-table :data="processDescribles" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
          <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
          <el-table-column prop="proceeding" label="事项" ></el-table-column>
          <el-table-column prop="explain"  label="说明" ></el-table-column>
          </el-table>
          </div>
      </el-card>
    </el-dialog>
    
  </section>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {queryCraftOutline, addShift, editShift, removeShift, modifyCraftVersionsStatus, queryCraftParticulars
  } from '../../../api/api'
  export default {
    data () {
      return {
        filters: {
          pageSize: 10,
          page: 1,
          total: 0,
          keyword:''
        },
        crafts: [],
        craftsDetail: [],
        processDescribles: [],
        craftSegments: [],
        status: '0',
        type: [],
        title: '工艺详情',
        versions: 'public',
        visible: {
          listLoading: false,
          detailForm: false,
          addLoading: false,
          editLoading: false
        },
        options: [
          {value: '0', label: '启用'},
          {value: '1', label: '弃用'}
        ],
        options2: [
          {value: 'public', label: '公版'},
          {value: 'private', label: '私版'}
        ],
        useStatus: '',
        querySearchPostTimeout: null,
      }
    },
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
        return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
      },
      // 重置
      reset () {
        this.filters = {
          type: 'public',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取工艺列表
      getList () { 
        let para = Object.assign({
          headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
          status: this.status,
          versionType: this.versions,
        }, this.filters)
        queryCraftOutline(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
             res.map.craftList.forEach(item => {
              if (item.craft_status === '0') {
                item.useStatus = '0'
              } else {
                item.useStatus = '1'
              }
            })
            this.crafts = res.map.craftList
          } else {
            this.filters.total = 0
            this.crafts = []
          }
        })
      },
        // 工艺详情
      craftDetail (row) {
        queryCraftParticulars({
             versionType: 'public',
             'craftIds[]': row.craft_id,
             headNum: 1
        }).then((res)=> {
            if (res.status === 0) {
              this.craftsDetail = res.map.resultCraftList[0]
              this.craftSegments = this.craftsDetail.craftSegments
              this.processDescribles = res.map.resultCraftList[0].processDescribles
              this.visible.detailForm= true
            } else {     
            }
       })
      },
      // BOM管理
      bomManage (row) {
         this.$router.push({
          path: '/craft/bomManage',
          query: {
            type: 'craftVersionsId',
            id: row.craft_id,
            title: '工艺：' + row.craft_name
          }
        })
      },
      //新增工艺
      AddCraft (){
        this.$router.push({
          path: '/craft/add',
        })
      },
      // 修改状态
      statusChanged(row){
        this.$confirm('确认修改状态?').then(action => {
          if (action === 'confirm') {
             let craftBasicsIds = row.craft_id
            if (row.useStatus === '1') {
              modifyCraftVersionsStatus({
                type: 'deprecated',
                'craftIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '弃用成功', type: 'success'})
                } else {
                  this.$message({message: '弃用失败', type: 'error'})
                }
                this.getList()
              })
            } else {
              modifyCraftVersionsStatus({
                type: 'recover',
                'craftIds[]': craftBasicsIds
              }).then(data => {
                if (data.status === 0) {
                  this.$message({message: '启用成功', type: 'success'})
                } else {
                  this.$message({message: '启用失败', type: 'error'})
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
      // 编辑
      handleEdit (row) {
        this.addForm = {
          classId: row.role_class_id,
          className: row.role_class_name,
          classDetail: row.role_class_detail
        }
        this.isAddForm = false
        this.visible.addForm = true
      },
      // 删除
      handleDelete (row) {
        this.$confirm('确定要删除此条数据吗？删除后无法查询').then(action => {
          if (action === 'confirm') {
            removeShift({classId: row.role_class_id, status: '1'}).then((res) => {
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
