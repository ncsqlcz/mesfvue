/* * @Author:danqihao * @Date: 2018-04-08 17:44:13 * @Last Modified by: danqihao * @Last Modified time: 2018-04-11 10:10:38
*/

<template>
  <section>
    <el-row class="toolbar">
      <el-col :span="3" :offset="15">
        <el-select placeholder="请选择成品型号" size="medium" @change="getBasicInfo()" v-model="req.productModelId">
          <el-option value="" label="全部型号" size="medium"> </el-option>
          <el-option v-for="(val,index) in productModel" :value="val.warehouse_product_model_id" :key="index" :label="val.warehouse_product_model_name"
            size="medium">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select placeholder="请选择仓库" size="medium" @change="getBasicInfo()" v-model="req.warehouseId">
          <el-option value="" label="全部仓库" size="medium"> </el-option>
          <el-option v-for="(val,index) in warehouseName" :value="val.warehouse_id" :key="index" :label="val.warehouse_name" size="medium">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input placeholder="请输入内容" size="medium" @keyup.native.enter="searchs" v-model="req.productName">
          <el-button slot="append" icon="el-icon-search" @click="getBasicInfo()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="dataList" style="width: 100%" border v-loading="visible.loading">
      <el-table-column type="index"> </el-table-column>
      <el-table-column label="名称" prop="product.warehouse_product_name"> </el-table-column>
      <el-table-column label="型号" prop="product.productModel.warehouse_product_model_name"> </el-table-column>
      <el-table-column label="批次" prop="warehouse_product_batch"> </el-table-column>
      <el-table-column label="库存数量" prop="warehouse_product_batch_number"> </el-table-column>
      <el-table-column label="所在仓库" prop="warehouse.warehouse_name"> </el-table-column>
    </el-table>
    <el-row>
      <el-col class="text-right">
        <el-pagination @current-change="handleCurrentChange" background layout="total,prev,pager,next" :current-page="currenPage"
          :page-size="pagesize" :total=lines></el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import utils from '../../common/js/utils'
  import { queryProductInventorys } from '../../api/api'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        req: {
          productId: '',
          productName: '',
          productModelId: '',
          warehouseId: '',
          headNum: 1
        },
        dataList: [],
        lines: 0, // 条数
        currenPage: 1, // 当前页
        pagesize: 10,   // 页码
        visible: {
          loading: false,
        }
      }
    },
    computed: {
      ...mapGetters(['productModel', 'warehouseName'])
    },
    mounted () {
      this.getBasicInfo()
      this.initProductModel()
      this.initWarehouseName()
    },
    methods: {
      ...mapActions(['initProductModel', 'initWarehouseName']),
      getBasicInfo () {
        this.visible.loading = true
        queryProductInventorys (this.req).then((data) => {
          if (data.status === 0) {
            this.dataList = data.map.productInventorys
            this.lines = data.map.lines
            this.visible.loading = false
          } else {
            this.dataList = []
            this.lines = 0
          }
          this.visible.loading = false
        })
      },
      handleCurrentChange (val) {
        this.req.headNum = (val - 1) * 10 + 1;
        this.getBasicInfo()
      }
    },
    watch: {}
  }
</script>