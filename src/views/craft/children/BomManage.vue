<!--张叶青 2018/04/16 -->
<template>
  <el-row style="background-color: transparent">
    <el-col :span="24">
      <h3>{{ title }}</h3>
    </el-col>
  <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="8" class="text-left">
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">新增BOM</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleDetail" icon="el-icon-plus">物料详情</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16" class="text-right">
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
         <el-form-item :span="4">
            <el-input v-model.trim="filters.keyword" size="medium" placeholder="输入BOM名称" @keyup.native.enter="getList"></el-input>
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
    <el-table :data="bomlist" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="60"></el-table-column>
      <el-table-column prop="craft_bom_name" label="BOM名称" sortable></el-table-column>
      <el-table-column prop="craft_bom_version"  label="BOM版本" sortable></el-table-column>
      <el-table-column prop="craft_bom_recordtime"  label="创建时间" sortable>
        <template slot-scope="scope">
          {{getTime(scope.row.craft_bom_recordtime)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-view" @click="bomDetail(scope.row)">详情</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="abandon(scope.row)" v-if="scope.row.craft_bom_status == 0 ">弃用</el-button>
          <el-button type="success" size="small" icon="el-icon-success" @click="start(scope.row)" v-else>启用</el-button>
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

     <!--新增BOMstart -->
    <el-dialog :visible.sync="visible.addForm" title="新增BOM" :close-on-click-modal="false" width="70%">
          <el-form label-width="10%" :model="addForm"  :rules="addFormRules" ref="addForm">
             <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="font-size:16px">基础信息</span>
                </div>
                <div class="detail-table">
                  <div class="detail-table-row">
                    <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM名称</p>
                      <p class="td-value"><el-input v-model.trim="addForm.bomNmae" placeholder="请输入（必填）"></el-input></p>
                    </div>
                  <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM版本</p>
                      <p class="td-value"><el-input v-model.trim="addForm.bomversion" placeholder="请输入（必填）"></el-input></p>
                    </div>
                    <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM备注</p>
                      <p class="td-value"><el-input v-model.trim="addForm.bomRemake"  placeholder="请输入"></el-input></p>
                    </div>
                  </div>
                </div>
             </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="font-size:16px">补充物料供应商</span>
                </div>
                 <div class="detail-table">
                  <el-table :data="supplier" highlight-current-row
                      v-loading="visible.listLoading"
                      @selection-change="this.sels = sels">
                      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                      <el-table-column prop="material_name" label="物品名称" ></el-table-column>
                      <el-table-column prop="material_model"  label="物料型号" ></el-table-column>
                      <el-table-column prop="material_stantard" label="物料规格" ></el-table-column>
                      <el-table-column prop="material_use_value" label="值" ></el-table-column>
                      <el-table-column prop="material_unit" label="单位" ></el-table-column>
                      <el-table-column label="供应商" ><div><el-input v-model.trim="addForm.supplier" placeholder="请输入" auto-complete="off" size="medium" @focus="bomDetail()" clearable></el-input></div></el-table-column>
                  </el-table>
                 </div>
              </el-card>
              
               <div class="text-right" style="margin-top:15px">
                   <el-button type="primary" size="medium" @click="submit">确认</el-button>
               </div>
          </el-form>
    </el-dialog>
    <!--新增BOMend -->

    <!--start -->
    <!--物料详情start -->

    <!--物料详情start -->
      <el-dialog :visible.sync="visible.materialLoading" title="物料清单详情" :close-on-click-modal="false" width="70%">
        <div class="detail-table">
        <el-table :data="material" highlight-current-row
            v-loading="visible.listLoading"
            @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="material_name" label="物品名称" ></el-table-column>
            <el-table-column prop="material_model"  label="物料型号" ></el-table-column>
            <el-table-column prop="material_stantard" label="物料规格" ></el-table-column>
            <el-table-column prop="material_use_value" label="值" ></el-table-column>
            <el-table-column prop="material_unit" label="单位" ></el-table-column>
        </el-table>
        </div>    
      </el-dialog>
    <!--物料详情BOMend -->
    <!--BOM详情start -->
      <el-dialog :visible.sync="visible.bomDetailLoading" title="BOM详情" :close-on-click-modal="false" width="70%">
        <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="font-size:16px">基础信息</span>
                </div>
                <div class="detail-table">
                  <div class="detail-table-row">
                    <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM名称</p>
                      <p class="td-value">{{bomDeatilList.craft_bom_name}}</p>
                    </div>
                  <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM版本</p>
                      <p class="td-value">{{bomDeatilList.craft_bom_version}}</p>
                    </div>
                     <div class="w-33 detail-table-item">
                      <p class="th-name" > 创建人</p>
                      <p class="td-value">{{bomDeatilList.craft_bom_staff}}</p>
                    </div>
                  </div>
                    <div class="detail-table-row">
                     <div class="w-33 detail-table-item">
                      <p class="th-name" > 创建时间</p>
                      <p class="td-value">{{getTime(bomDeatilList.craft_bom_recordtime)}}</p>
                    </div>
                    <div class="w-33 detail-table-item">
                      <p class="th-name" > BOM备注</p>
                      <p class="td-value">{{bomDeatilList.craft_bom_note}}</p>
                    </div>
                  </div>
                </div>
             </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="font-size:16px">供应商信息</span>
                </div>
                 <div class="detail-table">
                  <el-table :data="supplierDateil" highlight-current-row
                      v-loading="visible.listLoading"
                      @selection-change="this.sels = sels">
                      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                      <el-table-column prop="material_name" label="物品名称" ></el-table-column>
                      <el-table-column prop="material_model"  label="物料型号" ></el-table-column>
                      <el-table-column prop="material_stantard" label="物料规格" ></el-table-column>
                      <el-table-column prop="material_use_value" label="值" ></el-table-column>
                      <el-table-column prop="material_unit" label="单位" ></el-table-column>
                      <el-table-column prop="supplier_name" label="供应商" ></el-table-column>
                  </el-table>
                 </div>
              </el-card>
      </el-dialog>
    <!--BOM详情end -->
  </section>
  </el-row>
</template>

<script>
  import utils from '../../../common/js/utils'
  import {queryCraftBOM, queryCraftUseMaterialMenu, queryCraftBOMParticulars, modifyCraftBOMStatus, saveCraftBOM
  } from '../../../api/api'

  export default {
    data () {
      return {
        filters: {
          type: '',
          pageSize: 10,
          page: 1,
          total: 0,
          keyword: ''
        },
        visible: {
          listLoading: false,
          addForm: false,
          addLoading: false,
          editLoading: false,
          materialLoading:false,
          bomDetailLoading:false,
        },
        querySearchPostTimeout: null,
        isAddForm: true,
        addForm: {
          bomName: '',
          bomversion: '',
          bomRemake: '',
          supplier: ''
        },
         options: [
          {value: '0', label: '启用'},
          {value: '1', label: '弃用'}
        ],
        bomlist: [],
        bomDeatilList: [],
        supplierDateil:[],
        status: [],
        supplier: [],
        material:[],
        craftVersionsId: '',
        title: '',
        addBOM: [],
        addFormRules: {
          bomName: { required: true, message: 'BOM名称不能为空', trigger: 'blur' },
          bomversion: { required: true, message: 'BOM版本称不能为空', trigger: 'blur' }
        }
      }
    },
    computed: {
    },
    mounted () {
      this.type = this.$route.query.type
      this.craftVersionsId = this.$route.query.id
      this.title = this.$route.query.title
      this.getList()
      // this.queryProductLinesList=queryProductLines()
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
          type: '',
          pageSize: 10,
          page: 1,
          total: 0
        }
        this.getList()
      },
      //  获取BOM列表
      getList () {
        // 注意后端分页用的字段是headNum, 所以要转换一下
        let para = Object.assign({
            headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
            keyword: this.filters.keyword
          }, this.filters)
        para[this.type] = this.craftVersionsId
        if(!this.status){
          para['status'] = '0'
        }else{
          para['status'] = this.status
        }
        queryCraftBOM(para).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.bomlist = res.map.bomlist
          } else {
            this.filters.total = 0
            this.bomlist = []
          }
        })
      },
      // 查看详情
      bomDetail (row) {
       queryCraftBOMParticulars({
          craftBOMId: row.craft_bom_id,
          headNum: '1'
       }).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.bomDeatilList = res.map.BomList[0]
            this.supplierDateil=res.map.bomDetails
            this.visible.bomDetailLoading = true
          } else {
            this.filters.total = 0
            this.bomDeatilList = []
            this.supplierDateil= []
          }
        })
      },
      // 新增BOM
      handleAdd () {
       queryCraftUseMaterialMenu({
           craftVersionsId:this.craftVersionsId ,
           headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
           tailNum: '10'
       }).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.supplier = res.map.bom
            this.visible.addForm = true
          } else {
            this.filters.total = 0
            this.supplier = []
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
        this.$confirm('确定移除吗？').then(action => {
          if (action === 'confirm') {
            let para = {
              staffIds: row.role_staff_class_id
            }
            para[this.type] = this.classId
            removeClassStaff(para).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '移除成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '移除失败', type: 'error' })
              }
              this.getList()
            })
          }
        }).catch()
      },
      // 物料详情
      handleDetail(){
       queryCraftUseMaterialMenu({
           craftVersionsId:this.craftVersionsId ,
           headNum: utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize),
           tailNum: '10'
       }).then((res) => {
          if (res.status === 0) {
            this.filters.total = res.map.lines
            this.material = res.map.bom
            this.visible.materialLoading = true
          } else {
            this.filters.total = 0
            this.material = []
          }
       })
      },
      // 弃用
      abandon (row){
        this.$confirm('确定弃用吗？').then(action => {
          if (action === 'confirm') {
            modifyCraftBOMStatus({
              type: 'deprecated',
              'craftBOMIds[]': row.craft_bom_id
           }).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '弃用成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '弃用失败', type: 'error' })
              }
              this.getList()
           })
          }
        })
      },
      // 启用
      start (row){
        this.$confirm('确定启用吗？').then(action => {
          if (action === 'confirm') {
            modifyCraftBOMStatus({
              type: 'recover',
              'craftBOMIds[]': row.craft_bom_id
           }).then((res) => {
              if (res.status === 0) {
                this.$message({ message: '启用成功', type: 'success' })
              } else {
                this.$message({ message: res.msg || '启用失败', type: 'error' })
              }
              this.getList()
           })
          }
        })
      },
      //  转换时间
      getTime (timestamp) {
        if (timestamp === null || timestamp === '') {
          return ''
        } else {
          return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
        }
      },
      // 提交
      submit(){
         this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.visible.addLoading = true
              if (this.isAddForm) {
                saveCraftBOM({
                  craftId: this.bomlist[0].craft_id,
                  craftBomName: this.addForm.bomName,
                  craftBomVersion: this.addForm.bomversion,
                  craftBomNote: this.addForm.bomRemake,
                  materialIdAndSupplierId: [{'craft_control_bom_id':this.supplier.craft_control_bom_id,'supplier_id':this.supplier.craft_control_bom_id,'supplier_name':this.addForm.supplier}]
                }).then((res) => {
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
              } 
            })
          }
        })
      }
    }
  }
</script>

<style >
.el-table th>.cell{
   color: #333;
 }
</style>
