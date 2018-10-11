<!-- 张叶青 2018.4.172 -->
<template>
  <section :loading="loading">
    <el-form :inline="true"  label-width="100px" style="margin-top:10px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="line-height:36px">
            <span style="font-size:16px">工艺基础</span>
            <el-button style="float: right;" type="primary" size="medium" @click="craftVersions()">查看历史版本信息</el-button>
        </div>
        <el-col :span=24>
          <el-form-item label="工艺名称">
            <el-input  placeholder="请选择（必选）" @focus="selectCarft()"  v-model="craftBasics.craftName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工艺编号">
            <el-input  v-model="craftBasics.craftNumber" readonly></el-input>
          </el-form-item>
           <el-form-item label="工艺版本" >
            <el-input  placeholder="请选择（必选）"  v-model="creatorName" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="所属产品类型" prop="productTypeName" >
               <el-autocomplete
              v-model="addForm.productTypeName" 
              :fetch-suggestions="queryProductTypeNameList" @select="productTypeSelect" placeholder="请选择（必选）">
              </el-autocomplete>
    
          </el-form-item>
          <el-form-item label="产品型号" >
            <el-input  readonly v-show="!addForm.productTypeName"></el-input>
            <el-autocomplete
              v-model="addForm.productModelName" 
              :fetch-suggestions="queryProductModelNameList" @select="productModelSelect" placeholder="请选择（必选）" v-show="addForm.productTypeName">
              </el-autocomplete>
          </el-form-item>
          <el-form-item label="是否为公版">
            <el-select  v-model="craftBasics.planType">
              <el-option value="公版"></el-option>
              <el-option value="私版"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="备注" >
            <el-input  placeholder="请输入"  v-model="describe" clearable></el-input>
          </el-form-item>
        </el-col>
         </el-card>
         <el-card class="box-card">
            <div slot="header" class="clearfix" style="line-height:36px">
                <span style="font-size:16px">工艺段</span>
                <el-button style="float: right;" type="primary" size="medium" @click="selectCraftSegment">添加工艺段</el-button>
            </div>
            <div class="detail-table">
                <el-table highlight-current-row
                    :data="craftSegmenBasics"
                    @selection-change="this.sels = sels">
                    <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                    <el-table-column prop="craft_segment_name" label="工艺段名称" ></el-table-column>
                    <el-table-column prop="craft_segment_number"  label="工艺段编号" ></el-table-column>
                    <el-table-column prop="craft_segment_polarity" label="极性" ></el-table-column>
                    <el-table-column prop="craft_segment_versions" label="工艺段版本" ></el-table-column>
                    <el-table-column prop="product_model_type_name" label="所属产品类型" ></el-table-column>
                    <el-table-column prop="product_model_genre" label="产品型号" ></el-table-column>
                    <el-table-column label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button  type="text" size="small" icon="el-icon-arrow-up" @click="craftSegmenUp(scope.$index)">上移</el-button>
                        <el-button  type="text" size="medium" icon="el-icon-arrow-down" @click="craftSegmenDown(scope.$index)">下移</el-button>
                        <el-button  type="text" size="medium" icon="el-icon-delete" @click="deleteCraftSegmen(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                </el-table>
              </div>
         </el-card>
         <el-card class="box-card">
            <div slot="header" class="clearfix" style="line-height:36px">
                <span style="font-size:16px">事项说明</span>
                <el-button style="float: right;" type="primary" size="medium" @click="addTempData()">添加事项</el-button>
            </div>
            <div class="detail-table" id="processDescrible">
                <el-table :data="tempData" highlight-current-row
                    @selection-change="this.sels = sels">
                    <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
                    <el-table-column label="事项" width="200">
                       <template slot-scope="scope">
                        <el-input  placeholder="请输入" v-model="scope.row.proceeding"></el-input>
                       </template>
                    </el-table-column>
                    <el-table-column label="说明" >
                    <template slot-scope="scope">
                        <el-input  placeholder="请输入" v-model="scope.row.explain"></el-input>
                       </template>
                       </el-table-column>
                    <el-table-column label="操作" width="90">
                      <template slot-scope="scope">
                         <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTempData(scope.$index)">删除</el-button>
                       </template>
                    </el-table-column>
                    
                </el-table>
              </div>
         </el-card>
         <!-- <div style="float: right; margin:20px">
           <el-button  type="primary" size="medium" @click="submit()">确定 </el-button>
         </div> -->
         <el-card class="box-card">
            <!-- <div slot="header" class="clearfix" style="line-height:36px"> -->
               <div style="height: 30px;"> <el-button style="float: right;" type="primary" size="medium" @click="submit">确定</el-button> </div>
            <!-- </div> -->
         </el-card>
      </el-form>

    <!-- 选择工艺 start -->
     <el-dialog :visible.sync="visible.craftVersionsLoading" title="历史版本信息" :close-on-click-modal="false" width="70%">
        <div class="detail-table">
        <el-table :data="craftVersionsList" highlight-current-row
            @selection-change="this.sels = sels">
            <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
            <el-table-column prop="craft_name" label="工艺段名称" ></el-table-column>
            <el-table-column prop="craft_versions"  label="版本号" ></el-table-column>
            <el-table-column prop="craft_status" label="使用状态" >
              <template slot-scope="scope">
                 {{ scope.row.craft_status === '1' ? '弃用' : '启用' }}
              </template>
            </el-table-column>
            <el-table-column prop="craft_creation_time" label="创建时间" > 
              <template slot-scope="scope">
               {{ getTime(scope.row.craft_creation_time) }}
              </template>
            </el-table-column>
        </el-table>
        </div>    
      </el-dialog>

    <!-- 选择工艺 end -->
  </section>
</template>
<script>
import {queryCraftVersions, getProductTypeList, queryProductTypeAboutModel, saveCraft} from '../../../api/api'
import utils from '../../../common/js/utils'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      filters: {
        type: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
       craftVersion: {
          show: false,
          deviceId: ''
        },
      tempData: [],
      craftBasics: {
        craftName: '',
        craftNumber: '',
        CraftId:''
      },
      craftSegmenBasics: [],
      addForm: {
        productTypeName: '',
        productTypeId: '',
        productModelId: '',
        productModelName: ''
      },
      visible :{
        craftVersionsLoading: false
      },
      i: 0,
      querySearchCraftTimeout: false,
      craftVersionsList: [],
      craftList: [],
      creatorName: '',
      describe: '',
      devices: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['getUser'])
  },
  methods: {
     // 列表索引
      getIndex (index) {
        return parseInt(this.filters.pageSize) * parseInt(this.filters.page - 1) + index + 1
      },
    //  历史版本信息
    craftVersions () {
       queryCraftVersions({
          type: 'history',
          craftBasicsId: '93f269f69b33409994fc32b649aafe30',
          headNum: 1
       }).then((res) => {
         if ( status === 0 ) {
           this.filters.total = res.map.lines
           this.craftVersionsList = res.map.craftList
           this.visible.craftVersionsLoading = true
         } else {
           this.filters.total = 0
            this.craftVersionsList = []
         }
       })
    },
    // 选择工艺
    selectCarft () {
       this.$mesCraft.show({
        type: 'vague'
         }).then( (res) => {
           console.log(res)
           this.craftBasics.CraftId = res.rows[0].craft_basics_id
           this.craftBasics.craftName = res.rows[0].craft_name
           this.craftBasics.craftNumber= res.rows[0].craft_number
         })
    },
    // 产品类型列表
    queryProductTypeNameList (queryString, cb) {
      getProductTypeList({
        type: 'vague',
        status: 0,
        productTypeName: queryString
      }).then(data => {
        if (data.status === 0) {
          cb(data.map.productTypes.map(v => {
            return {
              value: v.product_type_name,
              product_model_type_id: v.product_model_type_id
            }
          }))
        } else {
          let arr = []
          cb(arr)
        }
      })
    },
    // 选择产品类型
    productTypeSelect (item) {
      this.addForm.productTypeId = item.product_model_type_id
    },
    // 产品型号
    queryProductModelNameList (queryString, cb) {
      queryProductTypeAboutModel({
        type: 'precise',
        status: 0,
        productTypeId: this.addForm.productTypeId
      }).then(data => {
        if (data.status === 0) {
          cb(data.map.productType.map(v => {
            return {
              value: v.product_model_genre,
              product_model_id: v.product_model_id
            }
          }))
        } else {
          let arr = []
          cb(arr)
        }
      })
    },
    // 选择产品型号
    productModelSelect (item) {
      this.addForm.productModelId = item.product_model_id
    },
    // 添加工艺段
    selectCraftSegment(){
        this.$mesCraftSegment.show({
          type: 'vague'
         }).then( (res) => {
          let data = res.rows[0]
          this.craftSegmenBasics.push(res.rows[0])
         })
    },
    // 上移工艺段
    craftSegmenUp (row) {
      if (row > 0) {
        let arr = this.craftSegmenBasics.slice(row-1)
        this.craftSegmenBasics=this.craftSegmenBasics.slice(0,row-1)
        let temp = arr[0]
        arr[0] = arr[1]
        arr[1] = temp
        for (let i = 0; i < arr.length; i++) {
          this.craftSegmenBasics.push(arr[i])
        }
      }
    },
     // 下移工艺段
    craftSegmenDown (row) {
      if (row < this.craftSegmenBasics.length-1) {
        let arr = this.craftSegmenBasics.slice(row)
        this.craftSegmenBasics=this.craftSegmenBasics.slice(0,row)
        let temp = arr[0]
        arr[0] = arr[1]
        arr[1] = temp
        for (let i = 0; i < arr.length; i++) {
          this.craftSegmenBasics.push(arr[i])
        }
      }
    },
    // 删除工艺段
    deleteCraftSegmen (row) {
      this.craftSegmenBasics.splice(row,1)
    },
    // 添加事项
    addTempData () {
      this.tempData.push({
       proceeding:'',
       explain:''
      })
      this.i++
    },
    // 删除事项
    deleteTempData (row) {
     this.tempData.splice(row,1)
    },
    // 转换时间格式
    getTime (timestamp) {
      if (timestamp === null || timestamp === '') {
        return ''
      } else {
        return utils.formatDate.format(new Date(timestamp), 'yyyy-MM-dd')
      }
    },
    // 确认
    submit () {
      let processDescrible=[]
      let i=1
      let craftSegmentIds=[]
      this.tempData.forEach((val, key) => {
        processDescrible.push({
          order: i,
          proceeding :val.proceeding,
          explain :val.explain
        })
        i++
      })
       this.craftSegmenBasics.forEach((val, key) => {
         craftSegmentIds.push(val.craft_segment_id)
      });
      let data = {
        craftBasicsId: this.craftBasics.CraftId,
        modelId: this.addForm.productModelId,
        modelTypeId: this.addForm.productTypeId,
        lineId:'', 
        craftName: this.craftBasics.craftName,
        craftNumber: this.craftBasics.craftNumber,
        craftVersions: this.creatorName,
        modelTypeName: this.addForm.productTypeName,
        modelGenre: this.addForm.productModelName,
        qualityRate: '',
        craftOpen: this.craftBasics.planType,
        lineName: '',
        creationStaff:  this.getUser.staffNumber ,
        creationStaffId:  this.getUser.userId,
        describe: this.describe,
        'craftSegmentIds[]': craftSegmentIds.toString(),
        processDescribleStrs: JSON.stringify(processDescrible)
      }
      saveCraft(data).then((data) => {
        if (data.status === 0) {
          this.$message({
            message: '新建成功',
            type: 'success'
          })
          this.loading = false
          this.basicInformation = {
            planName: '',
            planType: '',
            creator: '',
            planPrincipal: ''
          }
          this.creatorName = ''
          this.planPrincipalName = ''
          this.devices = []
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style>

.el-table th>.cell{
   color: #333;
 }

</style>
