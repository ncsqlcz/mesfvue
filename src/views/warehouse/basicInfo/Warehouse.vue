<!--刘宇 2018/6/29-->
<template>
  <section>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="6">
        <el-button type="primary" size="medium" icon="el-icon-circle-plus" @click="addWarehouse">新增仓库</el-button>
      </el-col>
      <el-col class="text-right" :span="18">
        <el-input type="text" placeholder="请输入编号或名称" size="medium" clearable @clear="getList"
                  v-model="filters.keyword" @keyup.native.enter="getList" style="width: 200px;"></el-input>
        <el-button type="primary" size="medium" icon="el-icon-search" @click="getList">查询</el-button>
      </el-col>
    </el-row>
    <!-- 列表-->
     <el-table :data="dataList" style="width: 100%" 
                @expand-change="handleExpandChange"
                ref="expandTable"
                :row-key="getRowKey"
                :expand-row-keys="expandRowKeys">
       <!-- 库位信息 -->
       <el-table-column type="expand" sortable>
         <template slot-scope="pScope">
           <el-table :data="locationData[pScope.row.$index]" style="width: 100%">
              <el-table-column type="index" label="序号" width="60px"></el-table-column>
              <el-table-column  label="库位编号" prop="location_number" sortable> </el-table-column>
              <el-table-column  label="库位名称" prop="location_name" sortable> </el-table-column>
              <el-table-column label="操作" prop="" width="180px">
                <template slot-scope="scope">
                  <el-button size="small" icon="el-icon-edit" @click="handleEditLocation(scope.row)" type="primary">修改</el-button>
                  <el-button size="small" icon="el-icon-delete" @click="handleRemoveLocation(scope.row)" type="danger">弃用</el-button>
                </template>
              </el-table-column>
           </el-table>
         </template>
       </el-table-column>
       
        <el-table-column type="index" :index="getIndex" label="序号" width="60px"></el-table-column>
        <el-table-column label="仓库编号" prop="warehouse_number" sortable> </el-table-column>
        <el-table-column label="仓库名称" prop="warehouse_name" sortable> </el-table-column>
        <el-table-column label="是否设置库位" prop="location" sortable>
          <template slot-scope="scope">
            {{ scope.row.location === '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" width="310px">
          <template slot-scope="scope">
            <el-button size="small" icon="el-icon-edit" @click="editWarehouse(scope.row)" type="primary">修改</el-button>
            <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_id)" type="danger">弃用</el-button>
            <el-button size="small" icon="el-icon-plus" v-if="scope.row.location === '1'" @click="handleAddLocation(scope.row)" type="primary">新增库位</el-button>
          </template>
        </el-table-column>
     </el-table>
    <el-row>
      <el-col class="text-left">
        <el-pagination layout="total, sizes, prev, pager ,next" :page-size="filters.pageSize"
                     :total="filters.total"
                     @current-change="handlePageChange" @size-change="handleSizeChange">
      </el-pagination>
      </el-col>
    </el-row>

    <!-- 新增仓库信息 -->
    <el-dialog :visible.sync="visible.addForm" :close-on-click-modal="false" width="60%">
      <span slot="title" class="el-dialog__title" v-if="locationEditType=='新增'">新增仓库信息</span>
      <span slot="title" class="el-dialog__title" v-else>新增仓库</span>
      <el-form :model="form" label-width="150px" :inline="true" :rules="rules" ref="form" class="clearfix" size="small">
        <el-form-item label="仓库编号:" prop="warehouse_number">
          <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.warehouse_number"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称:" prop="warehouse_name">
          <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="form.warehouse_name"></el-input>
        </el-form-item>
        <el-form-item label="是否设置库位:" prop="location">
          <el-radio v-model="form.location" label="1">是</el-radio>
          <el-radio v-model="form.location" label="0">否</el-radio>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="visible.addForm = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="visible.addLoading">提交</el-button>
        </div>
    </el-dialog>

    <!-- 新增库位信息 -->
    <el-dialog :visible.sync="visible.locationDialog" :close-on-click-modal="false" width="60%">
      <span slot="title" class="el-dialog__title" v-if="editType=='新增'">新增库位信息</span>
      <span slot="title" class="el-dialog__title" v-else>编辑库位信息</span>
      <el-form :model="locationForm" label-width="150px" :inline="true" :rules="locationRules" ref="locationForm" class="clearfix" size="small">
        <el-form-item label="库位编号:" prop="location_number">
          <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="locationForm.location_number"></el-input>
        </el-form-item>
        <el-form-item label="库位名称:" prop="location_name">
          <el-input auto-complete="off" size="medium" clearable placeholder="(必填)" v-model="locationForm.location_name"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="visible.locationDialog = false">取消</el-button>
            <el-button type="primary" @click.native="addLocationSubmit" :loading="visible.addLocationLoading">提交</el-button>
        </div>
    </el-dialog>
  </section>
</template>

<script>
import utils from "../../../common/js/utils";
import {
  saveWarehouse,
  modifyWarehouse,
  queryWarehouse,
  removeWarehouse,
  saveLocation,
  queryLocation,
  removeLocation,
  modifyLocation
}
from "../../../api/warehouse";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      filters: {
        keyword: '',
        pageSize: 10,
        page: 1,
        total: 0
      },
      dataList: [],
      warehouseId: '',
      form: {
        location: '1',
        warehouse_number: '',
        warehouse_name: ''
      },
      visible: {
        listLoading: false,
        addForm: false,
        editForm: false,
        addLoading: false,
        editLoading: false,
        locationDialog: false,
        addLocationLoading: false
      },
      rules: {
        warehouse_number: [
          { required: true, message: "请输入仓库编号", trigger: "blur" }
        ],
        warehouse_name: [
          { required: true, message: "请输入仓库名称", trigger: "blur" }
        ]
      },
      editType: '',
      locationEditType: '',
      locationForm: {
        warehouse_id: '',
        location_name: '',
        location_number: ''
      },
      locationRules: {
        location_name: [
          { required: true, message: "请输入库位编号", trigger: "blur" }
        ],
        location_number: [
          { required: true, message: "请输入库位名称", trigger: "blur" }
        ]
      },
      warehouseRow: null, // 当前要添加库位的行
      locationData: [], // 库位数据
      location_id: '', // 当前编辑的库位id
      expandRowKeys: ['6e2a2b42916640c19560edd959560ed4'] //展开行的key
    };
  },
  computed: {
    ...mapGetters(["getDeviceTypes"])
  },
  mounted() {
    // this.initDevicesTypes();
    this.getList();
  },
  methods: {
    ...mapActions(["initDevicesTypes"]),
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
    getIndex(index) {
      return utils.getHeadNumAdapter(this.filters.page, this.filters.pageSize, index)
    },
    // 获取列表
    async getList () {
      let data = await queryWarehouse(this.filters)
      if (data.status === 0) {
        this.dataList = data.map.wareHouseInfoDTOs;
        this.dataList.forEach((item, index) => {
          item.$index = index
          this.locationData[index] = []
        })
        this.filters.total = data.map.line;
      } else {
        this.dataList = [];
        this.filters.total = 0;
      }
    },
    remove(val) {
      this.$confirm("确定删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeWarehouse({
          warehouseId: val
        }).then(data => {
          if (data.status === 0) {
            this.$message.success('删除成功')
            this.getList();
          } else {
            this.$message.error('删除失败')
          }
        });
      });
    },
    addWarehouse() {
      this.editType = "新增";
      this.visible.addForm = true;
      setTimeout(() => {
        this.resetForm()
        this.$refs['form'].resetFields()
      })
    },
    // 提交新增或修改仓库信息
    addSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm("确定添加此仓库信息?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.editType === "新增") {
              saveWarehouse({ warehouses: JSON.stringify(this.form) }).then(data => {
                if (data.status === 0) {
                  this.$message({
                    type: "success",
                    message: "添加成功"
                  });
                  this.visible.addForm = false;
                  this.getList();
                } else {
                  this.$message({
                    type: "danger",
                    message: data.msg
                  });
                }
              });
            } else if (this.editType === "编辑") {
              let params = {
                warehouseId: this.warehouseId,
                warehouseNumber: this.form.warehouse_number,
                warehouseName: this.form.warehouse_name,
                location: this.form.location
              }
              modifyWarehouse(params).then(data => {
                if (data.status === 0) {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.visible.addForm = false;
                  this.getList();
                } else {
                  this.$message.error(data.msg)
                }
              });
            }
          });
        } else {
          this.$message({
            type: "danger",
            message: "添加失败"
          });
        }
      });
    },
    editWarehouse(row) {
      this.editType = "编辑";
      this.visible.addForm = true;
      this.warehouseId = row.warehouse_id
      Object.keys(this.form).forEach(key => {
        this.form[key] = row[key]
      })
    },
    resetForm() {
      this.form = {
        location: '1',
        warehouse_number: '',
        warehouse_name: ''
      }
    },
    resetLocationForm() {
      this.locationForm = {
        warehouse_id: '',
        location_name: '',
        location_number: ''
      }
    },
    // 每一行的key
    getRowKey (row) {
      return row.warehouse_id
    },
    // 处理新增库位
    handleAddLocation (row) {
      this.locationEditType = '新增'
      this.warehouseRow = row
      this.locationForm.warehouse_id = row.warehouse_id
      // 默认展开新增行的库位信息
      this.expandRowKeys = [row.warehouse_id]
      this.setLocations(row)
      this.visible.locationDialog = true
      setTimeout(() => {
        this.resetLocationForm()
        this.$refs.locationForm.resetFields()
      })
    },
    // 处理编辑库位信息
    handleEditLocation (row) {
      this.locationEditType = '编辑'
      // 找到父级的row
      this.warehouseRow = this.dataList[this.dataList.map(v => v.warehouse_id).indexOf(row.warehouse_id)]
      this.locationForm.warehouse_id = row.warehouse_id
      this.locationForm.location_name = row.location_name
      this.locationForm.location_number = row.location_number
      this.location_id = row.location_id
      this.visible.locationDialog = true
    },
    // 删除库位信息
    handleRemoveLocation (row) {
      this.warehouseRow = this.dataList[this.dataList.map(v => v.warehouse_id).indexOf(row.warehouse_id)]
      this.$confirm("确定删除此条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        removeLocation({
          locationId: row.location_id
        }).then(data => {
          console.log(data)
          if (data.status === 0) {
            this.$message.success('删除成功')
            this.setLocations(this.warehouseRow)
          } else {
            this.$message.error(data.msg || '删除失败')
          }
        });
      });
    },
    // 提交添加库位
    addLocationSubmit () {
      this.visible.addLocationLoading = true
      this.locationForm.warehouse_id = this.warehouseRow.warehouse_id
      this.$refs.locationForm.validate(valid => {
        if (valid) {
          this.$confirm("确定提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            if (this.locationEditType === "新增") {
              saveLocation({ locations: JSON.stringify(this.locationForm) }).then(data => {
                if (data.status === 0) {
                  this.$message.success('添加成功')
                  this.visible.locationDialog = false;
                  this.setLocations(this.warehouseRow)
                } else {
                  this.$message.error(data.msg)
                }
                this.visible.addLocationLoading = false
              });
            } else if (this.locationEditType === "编辑") {
              console.log(this.warehouseRow)
              let params = {
                locationId: this.location_id,
                locationNumber: this.locationForm.location_number,
                locationName: this.locationForm.location_name,
              }
              modifyLocation(params).then(data => {
                if (data.status === 0) {
                  this.$message.success('修改成功')
                  this.visible.locationDialog = false;
                  this.setLocations(this.warehouseRow)
                } else {
                  this.$message.error(data.msg)
                }
                this.visible.addLocationLoading = false
              });
            }
          }).catch(() => { this.visible.addLocationLoading = false });
        }
      });
    },
    // 展开仓库显示库位信息
    handleExpandChange (row, expandedRows) {
      if (row.location !== '1') {
        this.$refs.expandTable.toggleRowExpansion(row, false)
        this.$message.info('此仓库没有配置库位')
      } else {
        // 如果没有库位信息才请求
        if (this.locationData[row.$index].length === 0) {
          this.setLocations(row)
        }
      }
    },
    // 设置库位信息
    setLocations (row) {
      return new Promise((resolve, reject) => {
        queryLocation({
          warehouseId: row.warehouse_id
        }).then(res => {
          if (res.status === 0) {
            this.$set(this.locationData, row.$index, res.map.locations)
          } else {
            this.$set(this.locationData, row.$index, [])
          }
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
  },
  watch: {
  }
};
</script>

<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 33%;
}

td.el-table__expanded-cell[class*="cell"] {
  padding: 20px 105px !important;
}

th {
  padding: 5px 0 !important;
}
</style>