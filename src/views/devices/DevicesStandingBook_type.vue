<!-- 魏彬祥 2018.4.9 -->
<template>
   <el-dialog  class="mes-dialog" title="设备类型管理" :visible.sync="typeData.dialogTableVisible" width="50%" :close-on-click-modal="false">
      <!--头部-->
      <el-col :span=24 :gutter="20" class="toolbar">
        <el-form :inline="true" :model="axiosData">
          <el-col :span="24" class="text-left">
            <el-form-item>
              <el-button type="primary" size="medium" @click="addButton">新增</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!--内容-->
      <el-table :data="dataList" highlight-current-row v-loading="listLoading">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="devices_control_devices_type_name" label="类型名称" sortable></el-table-column>
        <el-table-column prop="devices_control_devices_type_describe" label="类型描述" sortable></el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="medium" type="primary" v-show="scope.row.devices_control_devices_type_status == '1'" @click="modify(scope.row)">修改</el-button>
            <el-button size="medium" type="danger" v-show="scope.row.devices_control_devices_type_status == '1'" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--新增模态框-->
      <el-dialog width="30%"  class="mes-dialog" :title="title" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
        <section class="overflow_hidden">
          <el-form label-position="left" label-width="150px" :model="addDeviceType" style="width:80%" :rules="addFormRules" ref="addDeviceType">
            <el-form-item label="类型名称" prop="typeName">
              <el-input v-model.trim="addDeviceType.typeName" placeholder="请输入（必填）" clearable></el-input>
            </el-form-item>
            <el-form-item label="所属工艺段">
              <el-input v-model.trim="addDeviceType.craftRange" placeholder="请输入（选填）" clearable></el-input>
            </el-form-item>
            <el-form-item label="工艺顺序" prop="craftOrder">
              <el-input v-model.number="addDeviceType.craftOrder" placeholder="请输入（选填）" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型描述">
              <el-input v-model.trim="addDeviceType.typeDescribe" placeholder="请输入（选填）" clearable></el-input>
            </el-form-item>
            <el-form-item label="是否可修改删除">
               <el-select v-model="addDeviceType.typeStatus" style="width:100%">
                <el-option value="1" label="是"></el-option>
                <el-option value="0" label="否"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-col :span=23 class="text-right">
            <el-button type="primary" size="medium" @click="submit">确认</el-button>
          </el-col>
        </section>
      </el-dialog>
   </el-dialog>
</template>
<script>
  import {queryDeviceTypes, saveDevicesTypeInfo, modifyDevicesInfo, removeDevicesInfo} from '../../api/api'
  import utils from '../../common/js/utils'
  export default {
    name: 'DevicesStandingBook_type',
    props: [ 'typeData' ],
    data () {
      return {
        dataList: [],
        listLoading: false,
        innerVisible: false,
        title: '',
        axiosData: {
          headNum: 1,
          type: 'all'
        },
        addDeviceType: {
          typeName: '',
          craftRange: '',
          craftOrder: '',
          typeDescribe: '',
          typeStatus: '1'
        },
        addFormRules: {
          typeName: {required: true, message: '类型名称不能为空', trigger: 'blur'},
          craftOrder: {required: false, validator: utils.checkNumber, type: 'number', message: '工艺顺序必须为数字'}
        }
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      getData () {
        this.listLoading = true
        queryDeviceTypes(this.axiosData).then((data) => {
          this.listLoading = false
          this.dataList = data.map.devices_control_devices_type
        })
      },
      addButton () {
        this.addDeviceType = {
          typeName: '',
          craftRange: '',
          craftOrder: '',
          typeDescribe: '',
          typeStatus: '1'
        }
        if (!this.$refs['addDeviceType'] === undefined) {
          this.$refs['addDeviceType'].resetFields()
        }
        this.innerVisible = true
        this.title = '新增设备类型'
      },
      // 新增设备类型
      submit () {
        this.$refs.addDeviceType.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (this.title === '新增设备类型') {
                let data = Object.assign(this.addDeviceType, {
                  craftOrder: this.addDeviceType.craftOrder === '' ? '0' : this.addDeviceType.craftOrder
                })
                saveDevicesTypeInfo(data).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.innerVisible = false
                    this.getData()
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              } else if (this.title === '设备类型修改') {
                modifyDevicesInfo(this.addDeviceType).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.getData()
                    this.innerVisible = false
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            })
          }
        })
      },
      // 修改设备类型
      modify (value) {
        this.addDeviceType = {
          typeName: value.devices_control_devices_type_name,
          craftRange: value.devices_control_devices_craft_range,
          craftOrder: value.devices_control_devices_craft_order,
          typeDescribe: value.devices_control_devices_type_describe,
          typeStatus: value.devices_control_devices_type_status,
          typeId: value.devices_control_devices_type_id
        }
        this.title = '设备类型修改'
        if (!this.$refs['addDevice'] === undefined) {
          this.$refs['addDevice'].resetFields()
        }
        this.innerVisible = true
      },
      remove (value) {
        this.$confirm('您确认删除此吗？删除后将无法查询此数据', '提示', {}).then(() => {
          removeDevicesInfo({devicesTypeId: value.devices_control_devices_type_id}).then((data) => {
            if (data.status === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.innerVisible = false
              this.getData()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
<style scoped lang="scss">

</style>
