<!-- 魏彬祥 2018.4.8 -->
<template>
  <section>
    <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData">
        <el-col :span="10" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="typeData.dialogTableVisible = true">设备类型管理</el-button>
            <el-button type="primary" size="medium" @click="addDeviceButton()">新增设备</el-button>
            <el-button type="primary" size="medium" @click="exportExcel">导出Excel</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="14" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="axiosData.typeId" @change="getData('typeId')">
              <el-option value="" label="全部类型"></el-option>
              <el-option v-for="value in typeList" :value="value.devices_control_devices_type_id" :label="value.devices_control_devices_type_name" :key="value.devices_control_devices_type_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="axiosData.keyWord" size="medium" placeholder="输入关键字" @keyup.native.enter="getData('key')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getData('key')">查询</el-button>
            <el-button size="medium">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--内容-->
    <el-table :data="dataList" highlight-current-row v-loading="listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="devices_control_devices_name" label="设备名称" sortable></el-table-column>
      <el-table-column prop="devices_control_devices_number" label="设备编号" sortable></el-table-column>
      <el-table-column prop="devices_control_devices_supplier" label="供应商" sortable></el-table-column>
      <el-table-column prop="dynamic_acquisition_time" label="购入时间" sortable></el-table-column>
      <el-table-column prop="devices_control_devices_use_date" label="使用时间" sortable></el-table-column>
      <el-table-column prop="devices_control_devices_status_name" label="点检状态" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="handleView(scope.row)">详情</el-button>
          <el-button size="medium" type="primary" @click="modify(scope.row)">修改</el-button>
          <el-button size="medium" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--设备类型-->
    <devicesType :typeData="typeData"></devicesType>
    <!--新增修改模态框-->
    <el-dialog  class="mes-dialog" :title="title" :visible.sync="dialogTableVisible" width="40%" :close-on-click-modal="false">
      <section class="overflow_hidden">
        <el-form label-position="right" label-width="80px" :model="addDevice" ref="addDevice" :rules="addFormRules">
          <el-col :span="11">
            <el-form-item label="设备名称" prop="devicesName">
              <el-input v-model.trim="addDevice.devicesName" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="设备编号" prop="devicesNumber">
              <el-input v-model.trim="addDevice.devicesNumber" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="devicesSupplier">
              <el-input v-model.trim="addDevice.devicesSupplier" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="购入时间" prop="devicesPurchaseDate">
              <el-date-picker type="date" v-model.trim="addDevice.devicesPurchaseDate" placeholder="选择日期" format="yyyy-MM-dd" :default-value="new Date()" :picker-options="pickerOptionsBefore" size="medium" style="width:100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="设备状态" prop="statusName">
              <el-select placeholder="请选择" v-model="addDevice.statusName" style="width:100%">
                <el-option value="正常"></el-option>
                <el-option value="保养"></el-option>
                <el-option value="维修"></el-option>
                <el-option value="停机"></el-option>
                <el-option value="封存"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工控机IP" prop="computerIP">
               <el-select placeholder="请选择" v-model="addDevice.computerIP" style="width:100%">
                <el-option v-for="value in computerIPList" :value="value" :label="value" :key="value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="责任人" prop="respible">
              <el-input v-model.trim="respibleName" placeholder="请输入" auto-complete="off" size="medium" @focus="selectStaff('respibleName')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="设备类型" prop="devicesTypeId">
              <el-select placeholder="请选择" size="medium" v-model="addDevice.devicesTypeId" style="width:100%">
                <el-option v-for="value in typeList" :value="value.devices_control_devices_type_id" :label="value.devices_control_devices_type_name" :key="value.devices_control_devices_type_id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备条码" prop="fdevicesCode">
              <el-input v-model.trim="addDevice.fdevicesCode" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="devicesBrand">
              <el-input v-model.trim="addDevice.devicesBrand" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="使用时间" prop="devicesUseDate">
              <el-date-picker type="date" v-model.trim="addDevice.devicesUseDate" placeholder="选择日期" format="yyyy-MM-dd" :default-value="new Date()" :picker-options="pickerOptionsBefore" size="medium" style="width:100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="设备IP" prop="devicesIP">
              <el-input v-model.trim="addDevice.devicesIP" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="管理人" prop="custodian">
              <el-input v-model.trim="custodianName" placeholder="请输入" auto-complete="off" size="medium" @focus="selectStaff('custodianName')" clearable></el-input>
            </el-form-item>
            <el-form-item label="设备描述" prop="devicesDescribe">
              <el-input v-model.trim="addDevice.devicesDescribe" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span=23 class="text-right">
          <el-button type="primary" size="medium" @click="submit()">确认</el-button>
        </el-col>
      </section>
    </el-dialog>
  </section>
</template>
<script>



  import {queryDevices, queryDeviceTypes, exportExcelDevicesInfo, queryIPCAll, saveDevicesLedgerInfo,
    removeDevicesLedgerInfo, modifyDevicesLedgerInfo} from '../../api/api'
  import utils from '../../common/js/utils'
  import devicesType from './DevicesStandingBook_type.vue'
  export default {
    name: 'devicesSpotCheck',
    components: {
      'devicesType': devicesType
    },
    data () {
      return {
        dataList: [],
        typeList: [],
        computerIPList: [],
        listLoading: false,
        pageSize: 10,
        page: 1,
        total: 0,
        dialogTableVisible: false,
        title: '',
        axiosData: {
          headNum: 1,
          type: 'all',
          typeId: '',
          keyWord: ''
        },
        typeData: { // 设备类型判断条件
          dialogTableVisible: false
        },
        pickerOptionsBefore: utils.pickerOptionsBefore,
        addDevice: { // 新增设备
          devicesName: '',  // 设备名称
          devicesTypeId: '', // 设备类型
          devicesNumber: '', // 设备编号
          fdevicesCode: '', // 设备条码
          devicesSupplier: '', // 供应商
          devicesBrand: '', // 品牌
          devicesPurchaseDate: '', // 购买日期
          devicesUseDate: '', // 使用日期
          devicesIP: '', // 设备IP地址
          devicesDescribe: '', // 设备描述
          custodian: '', // 管理人
          respible: '', // 责任人
          statusName: '', // 设备运行状态
          computerIP: '' // 工控机IP
        },
        respibleName: '',
        custodianName: '',
        addFormRules: {
          devicesName: {required: true, message: '设备名称不能为空', trigger: 'blur'},
          devicesNumber: {required: true, message: '设备编号不能为空', trigger: 'blur'},
          devicesPurchaseDate: {required: true, message: '购买时间不能为空', trigger: 'blur'},
          devicesTypeId: {required: true, message: '设备类型不能为空', trigger: 'change'},
          devicesIP: {required: false, validator: utils.checkIP, message: 'IP格式应为：xxx.xxx.xxx.xxx', trigger: 'blur'}
        }
      }
    },
    mounted () {
      this.getData('all')
      this.getType()
      this.getIP()
    },
    methods: {
      // 获取基础数据
      getData (type) {
        let data = Object.assign(this.axiosData, {
          type: type,
          headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
        })
        this.listLoading = true
        queryDevices(data).then((data) => {
          this.listLoading = false
          if (data.status === 0) {
            this.dataList = data.map.devices
            this.total = data.map.lines
          } else if (data.status === 2) {
            this.dataList = []
            this.total = 0
            this.$message.error('暂无数据');
          } else {
            this.$message.error('数据有误');
          }
        })
      },
      // 获取新增时的工控机ip
      getIP () {
        queryIPCAll().then((data) => {
          this.computerIPList = data
        })
      },
      // 获取设备类型
      getType () {
        queryDeviceTypes(this.axiosData).then((data) => {
          this.typeList = data.map.devices_control_devices_type
        })
      },
      // 重置
      reset () {
        this.axiosData = {
          headNum: 1,
          type: 'all',
          typeId: '',
          keyWord: ''
        }
        this.getData('all')
      },
      // 页面改变
      handlePageChange (val) {
        this.page = val
        this.getData('all')
      },
      // 每页数量改变
      handleSizeChange (val) {
        this.pageSize = val
        this.getData('all')
      },
      // 列表索引
      getIndex (index) {
        return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
      },
      // 导出excel
      exportExcel () {
        location.href = exportExcelDevicesInfo
      },
      // 新增设备
      addDeviceButton () {
        this.addDevice = { // 新增设备
          devicesName: '',  // 设备名称
          devicesTypeId: '', // 设备类型
          devicesNumber: '', // 设备编号
          fdevicesCode: '', // 设备条码
          devicesSupplier: '', // 供应商
          devicesBrand: '', // 品牌
          devicesPurchaseDate: '', // 购买日期
          devicesUseDate: '', // 使用日期
          devicesIP: '', // 设备IP地址
          devicesDescribe: '', // 设备描述
          custodian: '', // 管理人
          respible: '', // 责任人
          statusName: '', // 设备运行状态
          computerIP: '' // 工控机IP
        }
        if (!this.$refs['addDevice'] === undefined) {
          this.$refs['addDevice'].resetFields()
        }
        this.title = '新增设备'
        this.dialogTableVisible = true
      },
      // 修改
      modify (value) {
        this.addDevice = { // 新增设备
          devicesId: value.devices_control_devices_id,
          devicesName: value.devices_control_devices_name,  // 设备名称
          devicesTypeId: value.devicesType.devices_control_devices_type_name, // 设备类型
          devicesNumber: value.devices_control_devices_number, // 设备编号
          fdevicesCode: value.devices_control_fdevices_code, // 设备条码
          devicesSupplier: value.devices_control_devices_supplier, // 供应商
          devicesBrand: value.devices_control_devices_brand, // 品牌
          devicesPurchaseDate: value.devices_control_devices_purchase_date, // 购买日期
          devicesUseDate: value.devices_control_devices_use_date, // 使用日期
          devicesIP: value.devices_control_devices_IP, // 设备IP地址
          devicesDescribe: value.devices_control_devices_describe, // 设备描述
          custodian: value.devices_control_devices_status_custodian, // 管理人
          respible: value.devices_control_devices_status_respible, // 责任人
          statusName: value.devices_control_devices_status_name, // 设备运行状态
          computerIP: value.industrial_personal_computer_IP // 工控机IP
        }
        this.custodianName = value.devices_control_devices_status_custodian
        this.respibleName = value.devices_control_devices_status_respible
        if (!this.$refs['addDevice'] === undefined) {
          this.$refs['addDevice'].resetFields()
        }
        this.dialogTableVisible = true
        this.title = '设备修改'
      },
      // 新增修改设备模态框
      submit () {
        this.$refs.addDevice.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              if (this.title === '新增设备') {
                let data = Object.assign(this.addDevice, {
                  devicesPurchaseDate: utils.formatDate.format(new Date(this.addDevice.devicesPurchaseDate), 'yyyy-MM-dd'),
                  devicesUseDate: (!this.addDevice.devicesUseDate && this.addDevice.devicesUseDate === '') ? '' : utils.formatDate.format(new Date(this.addDevice.devicesUseDate), 'yyyy-MM-dd')
                })
                saveDevicesLedgerInfo(data).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.dialogTableVisible = false
                    this.getData('all')
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              } else {
                let data = Object.assign(this.addDevice, {})
                modifyDevicesLedgerInfo(data).then((data) => {
                  if (data.status === 0) {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    this.getData('all')
                    this.dialogTableVisible = false
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            })
          }
        })
      },
      // 详情
      handleView (value) {
        this.$mesBasicInfoTable.show(
          '设备详情', {
            table: {
              props: ['设备名称', '设备类型', '设备编号', '设备条码', '供应商', '品牌', '购入时间', '使用时间', '设备状态', '设备IP', '工控机IP', '管理人', '责任人', '设备描述'],
              values: [value.devices_control_devices_name, value.devicesType.devices_control_devices_type_name, value.devices_control_devices_number,
                value.devices_control_fdevices_code, value.devices_control_devices_supplier, value.devices_control_devices_brand,
                value.devices_control_devices_purchase_date, value.devices_control_devices_use_date, value.devices_control_devices_status_name,
                value.devices_control_devices_IP, value.industrial_personal_computer_IP ? value.industrial_personal_computer_IP : '无对应IP,不会执行同步操作', value.devices_control_devices_status_custodian,
                value.devices_control_devices_status_respible, value.devices_control_devices_describe
              ]
            }
          }
         )
      },
      // 选择人员
      selectStaff (type) {
        this.$mesStaff.show({
          type: 'all',
          reRender: true,
          selectedIds: [this.addDevice.respible]
        }).then((data) => {
          if (type === 'respibleName') {
            this.addDevice.respible = data.rows[0].role_staff_id
            this.respibleName = data.rows[0].role_staff_name
          } else {
            this.addDevice.custodian = data.rows[0].role_staff_id
            this.custodianName = data.rows[0].role_staff_name
          }
        })
      },
      remove (value) {
        this.$confirm('您确认删除此吗？删除后将无法查询此数据', '提示', {}).then(() => {
          removeDevicesLedgerInfo({devicesId: value.devices_control_devices_id, computerIP: value.devices_control_devices_IP}).then((data) => {
            if (data.status === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
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
