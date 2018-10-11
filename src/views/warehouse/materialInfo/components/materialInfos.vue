<!--  刘宇2018/7/3-->
<template>
      <section>
    <!--搜索 start-->
    <el-col class="toolbar">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-col :span="3" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleAdd" icon="el-icon-plus">盘点</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="21" class="text-left">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="filters.workshopId"  style="width:120px">
              <el-option value="" label="是否报废"></el-option>
              <el-option v-for="value in workshopName" :value="value.role_workshop_id" :label="value.role_workshop_name" :key="value.role_workshop_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
           <el-input v-model.trim="filters.staffName" size="medium" placeholder="输入记录人姓名" @keyup.native.enter="getList" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="filters.postId"  style="width:120px">
              <el-option value="" label="盘点仓库"></el-option>
              <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
             <el-date-picker  type="date" placeholder="选择开单开始日期"  style="width:180px"></el-date-picker>
             <el-date-picker  type="date" placeholder="选择开单结束日期"  style="width:180px"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--搜索 end-->
    <!--列表 start-->
    <el-col class="toolbar"></el-col>
    <el-table :data="staffs" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
      <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
      <el-table-column prop="" label="单据编号" ></el-table-column>
      <el-table-column prop="" label="盘点仓库" ></el-table-column>
      <el-table-column prop="" label="记录人" ></el-table-column>
      <el-table-column prop="" label="开单日期" ></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
          <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" size="medium"  @click="handleDelete(scope.row)">报废</el-button>
          <el-button type="primary" size="small" @click="historyRecord(scope.row)">历史记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->
    <!--分页 start -->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
    </el-col>
    <!--分页 end -->
    <!--盘点登记 start-->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">盘点登记</span></el-col>
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
          <span style="font-size：15px;">盘点仓库:</span>
          <el-select  size="medium" v-model="filters.postId"  style="width:120px">
          <el-option value="" placeholder="请选择"></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
        </el-form-item>
         </el-col>
         <el-col class="toolbar" :span="24" >
          <span style="font-size：15px;">已选择物料</span>
         </el-col>
        <el-table :data="choiseFinishedData" highlight-current-row
           v-loading="visible.addLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column>
        <el-table-column prop="" label="账面数" ></el-table-column>
        <el-table-column prop="" label="盘点数" ></el-table-column>
        <el-table-column prop="" label="盘亏数量" ></el-table-column>
         <el-table-column prop="" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" ></el-table-column>

        </el-table>
        <el-row class="toolbar">
        <el-col :span="18" class="text-left" >
          <p style="font-size：20px;">选择物料</p>
        </el-col>
        <el-col :span="5" class="text-right">
          <el-input placeholder="输入名称或型号"></el-input>
        </el-col>
        </el-row>
        <el-table :data="choiseFinishedData" highlight-current-row
           v-loading="visible.addLoading"
           @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column>
        <el-table-column prop="" label="账面数" ></el-table-column>
        <el-table-column prop="" label="盘点数" ></el-table-column>
        <el-table-column prop="" label="盘亏数量" ></el-table-column>
        <el-table-column prop="" label="单位" ></el-table-column>
        <el-table-column prop="" label="操作" ></el-table-column>
        </el-table>
      </el-form>
      </el-col>
      <!--分页-->
      <el-col :span="24" class="toolbar text-right">
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
    <!--盘点登记 end -->

    <!--详情 start-->
    <el-dialog :visible.sync="visible.handleView" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <span slot="title" class="el-dialog__title">盘点详情</span>
      <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
        <el-row class="toolbar recording">
          <el-col class="headedit" :span="4"><p>记录人：aaaa</p></el-col>
          <el-col :span="5">
              <p>入库名称：</p>
          </el-col>
          <el-col :span="5"  class="headedit">
            <p>开单日期:</p>
          </el-col>
          <el-col :span="5"  class="headedit">
            <p>单据编号:</p>
          </el-col>
          <el-col  :span="3">
            <el-button type="primary" size="medium">打印</el-button>
          </el-col>
        </el-row>
      </el-col>    
      <el-table :data="choiseFinishedData" highlight-current-row
              v-loading="visible.listLoading"
              @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column>
        <el-table-column prop="" label="账面数" ></el-table-column>
        <el-table-column prop="" label="盘点数" ></el-table-column>
        <el-table-column prop="" label="盘亏数量" ></el-table-column>
           <el-table-column prop="" label="单位" ></el-table-column>
      </el-table>
      <!--分页-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total, sizes, prev, pager ,next" 
          :page-size="filters.pageSize"
          :total="filters.total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange">
        </el-pagination>
      </el-col>
      <div slot="footer" class="dialog-footer">
        
      </div>
    </el-dialog>
    <!--详情 end-->

     <!--修改 start-->
    <el-dialog :visible.sync="visible.handleEdit" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <span slot="title" class="el-dialog__title">修改盘点信息</span>
      <el-form :inline="true" :model="filters" @submit.native.prevent>
       <el-col :span="24" class="toolbar" style="border：1px solid #ccc"> 
          <el-row class="toolbar recording">
            <el-col class="headedit" :span="6">
                <p>记录人：aaaa</p>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库:" label-position="left">
                <el-input v-model.trim="filters.staffName" size="medium" placeholder="A仓库" @keyup.native.enter="getList" style="width:140px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"  class="headedit">
              <p>开单日期:</p>
            </el-col>
            <el-col :span="6"  class="headedit">
              <p>单据编号:</p>
            </el-col>
          </el-row>
       </el-col>    
        <el-table :data="choiseFinishedData" highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels">
        <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column>
        <el-table-column prop="" label="账面数" ></el-table-column>
        <el-table-column prop="" label="盘点数" ></el-table-column>
        <el-table-column prop="" label="盘亏数量" ></el-table-column>
        <el-table-column prop="" label="单位" ></el-table-column>
        </el-table>
      <!--分页-->
        <el-col :span="24" class="toolbar">
           <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                          :total="filters.total"
                           @current-change="handlePageChange" @size-change="handleSizeChange">
           </el-pagination>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click.native="visible.handleEdit = false"   @close="clearData()">取消</el-button>
        <el-button type="primary" size="medium" @click="isHandle()">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑 end-->

    <!--历史记录-->
    <el-dialog :visible.sync="visible.historyRecord" :close-on-click-modal="false" @close="" width="75%" height="80%">
      <el-row class="add-title mb-3">
        <el-col :span="6"><span class="el-dialog__title">历史记录</span></el-col>
        <el-col :span="18" class="text-right">
          <span class="el-dialog__title mr-5">开单日期：</span>
          <span class="el-dialog__title">单据编号：</span>
        </el-col>
      </el-row>
      <el-row class="toolbar" :span="24">
        <el-col class="text-right">
          <el-select placeholder="选择修改时间" size="medium" v-model="filters.postId" style="width:200px">
          <el-option value=""></el-option>
          <el-option v-for="value in postName" :value="value.role_post_id" :label="value.role_post_name" :key="value.role_post_id"></el-option>
          </el-select>
          <el-button type="primary" size="medium" @click="getList" icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=12 class="pt-2"><span style="font-size:18px">记录人：aaa</span></el-col>
        <el-col :span=12><span style="font-size:18px">入库仓库：A仓库</span></el-col>
      </el-row>
       <el-table :data="choiseFinishedData" highlight-current-row
                v-loading="visible.editLoading"
                @selection-change="this.sels = sels" border>
        <el-table-column type="index" :index="getIndex" width="80" label="序号"></el-table-column>
        <el-table-column prop="" label="物料名称" ></el-table-column>
        <el-table-column prop="" label="规格/型号" ></el-table-column> 
        <el-table-column prop="" label="账面数" ></el-table-column>
        <el-table-column prop="" label="盘点数" ></el-table-column>
        <el-table-column prop="" label="盘亏数量" ></el-table-column>
        <el-table-column prop="" label="单位" ></el-table-column>
        </el-table>
         <!--分页-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                          :total="filters.total"
                           @current-change="handlePageChange" @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
        <div slot="footer" class="dialog-footer">

        </div>
    </el-dialog>

  </section>

</template>
<script>
export default {
    data () {
        return {

        }

    }
}
</script>
<style>

</style>
