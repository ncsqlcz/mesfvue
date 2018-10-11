<!--刘宇 2018/7/5-->
<template>
    <section>
     <!--入库登记 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="" width="75%" height="80%"> 
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title" v-if=" headType === productin ">入库登记</span></el-col>
        <el-col :span="6"><span class="el-dialog__title" v-if=" headType === productout ">出库登记</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：</span>
          <span class="el-dialog__title">单据编号：</span>
        </el-col>
      </el-row>
      <el-row class="toolbar">
        <el-col :span="12">
          <span style="font-size:24px;">基础信息</span>
        </el-col>
        <el-col class="text-right" :span="12">
          <el-button type="primary" size="medium"  @click="historyRecord">历史记录</el-button>
        </el-col>
      </el-row>
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col class="p-2" :span="12">
        <el-form-item> 
          <span >记录人:</span>
        </el-form-item>
        </el-col>
        <el-col class="p-2" :span="12">
        <el-form-item  class="text-right">
          <span style="font-size：15px;">仓库:</span>
          <el-select  size="medium" v-model="filters.postId"  style="width:120px">
          <el-option value="" placeholder="请选择"></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
        </el-form-item>
         </el-col>
         <el-col class="toolbar" :span="24" >
          <span style="font-size：15px;">已选择成品</span>
         </el-col>
        <el-table :data="choiseFinishedData" highlight-current-row
           v-loading="visible.addLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="成品编号" ></el-table-column>
        <el-table-column prop="" label="成品名称" ></el-table-column>
        <el-table-column prop="" label="成品批次号" ></el-table-column>
        <el-table-column prop="" label="成品种类" ></el-table-column>
        <el-table-column prop="" label="成品类型" ></el-table-column>
        <el-table-column prop="" label="型号" ></el-table-column>
        <el-table-column prop="" label="成品参数" ></el-table-column>
        <el-table-column prop="" label="入库数量" ></el-table-column>
        <el-table-column prop="" label="库位" ></el-table-column>
        </el-table>
        <el-row class="toolbar">
        <el-col :span="4" >
          <p style="font-size：20px;">选择成品</p>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
          <el-select placeholder="所有种类" size="medium" v-model="filters.postId" style="width:120px">
          <el-option value=""></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
         </el-form-item>
         <el-form-item>
          <el-select placeholder="所有类型" size="medium" v-model="filters.postId" style="width:120px">
          <el-option value=""></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
         </el-form-item>
         <el-form-item>
          <el-select placeholder="型号" size="medium" v-model="filters.postId" style="width:120px">
          <el-option value=""></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
         </el-form-item>
         <el-form-item>
          <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
           <el-button size="medium" @click="reset">重置</el-button>
         </el-form-item>
        </el-col>
        </el-row>
        <el-table :data="choiseFinishedData" highlight-current-row
           v-loading="visible.addLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="成品种类" ></el-table-column>
        <el-table-column prop="" label="成品类型" ></el-table-column>
        <el-table-column prop="" label="型号" ></el-table-column>
        <el-table-column prop="" label="成品批次号" ></el-table-column>
        <el-table-column prop="" label="成品参数" ></el-table-column>
        <el-table-column prop="" label="入库数量" ></el-table-column>
        <el-table-column prop="" label="操作" ></el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                :total="filters.total"
                @current-change="handlePageChange" @size-change="handleSizeChange">
          </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.addForm = false"   @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium">提交</el-button>
       </div>
    </el-dialog>
    <!--入库登记 end -->
    </section>
</template>
<script>

import { queryFinishProductStorage } from "../../../api/warehouse";
export default {
    name: 'productInfoTable',
    data () {
        return {
            product: [
                {}
            ]
        }
    },
    props: ['headType'],
    methods: {
    }
}
</script>
<style>

</style>
