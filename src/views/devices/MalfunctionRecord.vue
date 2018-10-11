<!-- 魏彬祥 2018.4.12 -->
<template>
  <section>
     <!--头部-->
    <el-col :span=24 :gutter="20" class="toolbar">
      <el-form :inline="true" :model="axiosData">
        <el-col :span="4" class="text-left">
          <el-form-item>
            <el-button type="primary" size="medium" @click="addButton">新增记录</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="20" class="text-right">
          <el-form-item>
            <el-select placeholder="请选择" size="medium" v-model="axiosData.typeId" @change="getData('typeId')">
              <el-option value="" label="全部类型"></el-option>
              <el-option v-for="value in typeList" :value="value.devices_control_devices_type_id" :label="value.devices_control_devices_type_name" :key="value.devices_control_devices_type_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="axiosData.devicesName" size="medium" placeholder="输入关键字" @keyup.native.enter="getData('key')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="getData('key')">查询</el-button>
            <el-button size="medium" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
     <!--内容-->
    <el-table :data="dataList" highlight-current-row v-loading="listLoading">
      <el-table-column type="index" :index="getIndex" width="60" label="序号"></el-table-column>
      <el-table-column prop="devices.devices_control_devices_name" label="设备名称" sortable></el-table-column>
      <el-table-column prop="devices.devices_control_devices_number" label="设备编号" sortable></el-table-column>
      <el-table-column label="发生时间" sortable> <template slot-scope="scope">{{ scope.row.devices_malfunction_record_time | date }}</template></el-table-column>
      <el-table-column prop="devices_malfunction_record_part" label="故障部位" sortable></el-table-column>
      <el-table-column prop="devices_malfunction_record_status" label="处理情况" sortable></el-table-column>
      <el-table-column prop="devices_malfunction_people" label="处理人" sortable></el-table-column>
      <el-table-column prop="devices_malfunction_identify_people" label="确认人" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="moreButton(scope.row)">更多</el-button>
          <el-button size="medium" type="primary" @click="modify(scope.row)">修改</el-button>
          <el-button size="medium" type="danger" @click="remove(scope.row.devices_malfunction_record_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页码-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, sizes, prev, pager ,next" :page-size="pageSize" :total="total" @current-change="handlePageChange" @size-change="handleSizeChange"></el-pagination>
    </el-col>
    <!--新增修改记录-->
    <el-dialog  class="mes-dialog" :title="title" :visible.sync="show" width="40%" :close-on-click-modal="false">
      <section class="overflow_hidden">
        <el-form label-position="right" label-width="100px" :model="addRecord" ref="addRecord" :rules="addFormRules">
          <el-col :span="11">
            <el-form-item label="设备名称" prop="devicesName">
              <el-input placeholder="请选择" @focus="selectDevice" v-model="addRecord.devicesName" auto-complete="off" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="发生时间" prop="recordTime">
              <el-date-picker v-model="addRecord.recordTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH-mm-ss" style="width:100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="故障原因" prop="recordCause">
              <el-input v-model.trim="addRecord.recordCause" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="处理情况" prop="recordStatus">
              <el-select placeholder="请选择" v-model="addRecord.recordStatus" style="width:100%">
                <el-option value="未处理"></el-option>
                <el-option value="已处理"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="记录人" prop="malfunctionPeople">
              <el-input v-model.trim="malfunctionPeopleName" placeholder="请输入" @focus="selectStaff('malfunctionPeople')" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="故障描述" prop="recordDescribe">
              <el-input v-model.trim="addRecord.recordDescribe" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item label="设备编号" prop="devicesNumber">
              <el-input v-model.trim="devicesNumber" placeholder="请选择一个设备名称" auto-complete="off" size="medium" disabled></el-input>
            </el-form-item>
            <el-form-item label="故障部位" prop="recordPart">
              <el-input v-model.trim="addRecord.recordPart" placeholder="请输入" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="预计处理时间" prop="expectDisposeTime">
              <el-date-picker v-model="addRecord.expectDisposeTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH-mm-ss" style="width:100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="处理时间" prop="disposeTime">
              <el-date-picker v-model="addRecord.disposeTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH-mm-ss" style="width:100%">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="确认人" prop="identifyPeople">
              <el-input v-model.trim="identifyPeopleName" placeholder="请输入" @focus="selectStaff('identifyPeople')" auto-complete="off" size="medium" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span=23 class="text-right">
          <el-button type="primary" size="medium" @click="submit()">确认</el-button>
        </el-col>
      </section>
    </el-dialog>
    <!--更多-->
    <el-dialog  class="mes-dialog" title="" :visible.sync="moreShow" width="50%" :close-on-click-modal="false">
        <!--基础信息-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size:16px">基础信息</span>
          </div>
          <div class="detail-table">
            <div class="detail-table-row">
              <div class="w-50 detail-table-item">
                <p class="th-name">设备名称</p>
                <p class="td-value">{{moreData.devicesName}}</p>
              </div>
              <div class="w-50 detail-table-item">
                <p class="th-name">设备编号</p>
                <p class="td-value">{{moreData.devicesNumber}}</p>
              </div>
            </div>
             <div class="detail-table-row">
              <div class="w-50 detail-table-item">
                <p class="th-name">购买日期</p>
                <p class="td-value">{{moreData.buyTime}}</p>
              </div>
              <div class="w-50 detail-table-item">
                <p class="th-name">	使用日期</p>
                <p class="td-value">{{moreData.useTime}}</p>
              </div>
            </div>
          </div>
        </el-card>
        <!--历史记录-->
        <el-card class="box-card margin">
          <div slot="header" class="clearfix" style="line-height:36px">
            <span style="font-size:16px">异常记录</span>
          </div>
          <el-table :data="moreList" border>
            <el-table-column type="index" :index="getIndexMore" width="60"></el-table-column>
            <el-table-column label="故障时间"><template slot-scope="scope">{{ scope.row.devices_malfunction_record_time | date }}</template></el-table-column>
            <el-table-column prop="devices_malfunction_record_cause" label="故障部位"></el-table-column>
            <el-table-column prop="devices_malfunction_record_status" label="处理情况"></el-table-column>
            <el-table-column prop="devices_malfunction_people" label="记录人"></el-table-column>
            <el-table-column prop="devices_malfunction_identify_people" label="确认人"></el-table-column>
            <el-table-column prop="devices_malfunction_record_describe" label="故障描述"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button size="medium" type="danger" @click="moreRemove(scope.row.devices_malfunction_record_id)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="toolbar">
            <el-pagination layout="total, sizes, prev, pager ,next" :page-size="morePage.pageSize" :total="morePage.total" @current-change="handlePageChangeMore" @size-change="handleSizeChangeMore"></el-pagination>
          </div>
        </el-card>
    </el-dialog>
  </section>
</template>
<script>
import {queryDevicesMalfunction, queryDeviceTypes, saveMalfunctionRecordInfo, modifyMalfunctionRecordInfo, removeMalfunctionRecordInfo} from '../../api/api'
import utils from '../../common/js/utils'
export default {
  name: 'MalfunctionRecord',
  data () {
    return {
      dataList: [],
      typeList: [],
      moreList: [],
      title: '新增故障记录',
      show: false,
      moreShow: false,
      listLoading: false,
      moreListLoading: false,
      pageSize: 10,
      page: 1,
      total: 0,
      devicesNumber: '',
      identifyPeopleName: '',
      malfunctionPeopleName: '',
      axiosData: {
        type: 'all',
        headNum: 1,
        devicesName: '',
        typeId: ''
      },
      moreAxiosData: {
        type: 'id',
        devicesId: '',
        headNum: 1,
      },
      morePage: {
        pageSize: 10,
        page: 1,
        total: 0,
      },
      addRecord: {
        devicesId: '',
        devicesName: '',
        recordTime: '',
        recordPart: '',
        malfunctionPeople: '',
        disposeTime: '',
        recordStatus: '',
        recordCause: '',
        recordDescribe: '',
        identifyPeople: '',
        expectDisposeTime: ''
      },
      moreData: {
        devicesName: '',
        devicesNumber: '',
        buyTime: '',
        useTime: ''
      },
      addFormRules: {
        devicesName: {required: true, message: '设备名称不能为空', trigger: 'change'}
      }
    }
  },
  methods: {
    // 获取基础数据
    getData (type) {
      let data = Object.assign(this.axiosData, {
        type: type,
        headNum: utils.getHeadNumAdapter(this.page, this.pageSize)
      })
      this.listLoading = true
      queryDevicesMalfunction(data).then((data) => {
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
    // 获取设备类型
    getType () {
      queryDeviceTypes(this.axiosData).then((data) => {
        this.typeList = data.map.devices_control_devices_type
      })
    },
    // 获取历史记录
    getMore () {
      let data = Object.assign(this.moreAxiosData,{})
      queryDevicesMalfunction(data).then((data) => {
        this.moreListLoading = false
        if (data.status === 0) {
          this.moreList = data.map.devices
          this.morePage.total = data.map.lines
        } else if (data.status === 2) {
          this.moreList = []
          this.$message.error('暂无数据');
        } else {
          this.$message.error('数据有误');
        }
      })
    },
    // 重置
    reset () {
      this.axiosData = {
        type: 'all',
        headNum: 1,
        devicesName: '',
        typeId: ''
      }
      this.getData('all')
    },
    // 列表索引
    getIndex (index) {
      return parseInt(this.pageSize) * parseInt(this.page - 1) + index + 1
    },
    getIndexMore (index) {
      return parseInt(this.morePage.pageSize) * parseInt(this.morePage.page - 1) + index + 1
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
    // 页面改变
    handlePageChangeMore (val) {
      this.morePage.page = val
      this.getMore()
    },
    // 每页数量改变
    handleSizeChangeMore (val) {
      this.morePage.pageSize = val
      this.getMore()
    },
    // 新增记录
    addButton () {
      this.addRecord = {
        devicesId: '',
        devicesName: '',
        recordTime: '',
        recordPart: '',
        malfunctionPeople: '',
        disposeTime: '',
        recordStatus: '',
        recordCause: '',
        recordDescribe: '',
        identifyPeople: '',
        expectDisposeTime: ''
      }
      this.devicesNumber = ''
      this.identifyPeopleName = ''
      this.malfunctionPeopleName = ''
      if (!this.$refs['addRecord'] === undefined) {
        this.$refs['addRecord'].resetFields()
      }
      this.title = '新增故障记录'
      this.show = true
    },
    modify (value) {
      this.addRecord = {
        recordId: value.devices_malfunction_record_id,
        devicesName: value.devices.devices_control_devices_name,
        recordTime: utils.formatDate.format(new Date(value.devices_malfunction_record_time), 'yyyy-MM-dd hh-mm-ss'),
        recordPart: value.devices_malfunction_record_part,
        malfunctionPeople: '',
        disposeTime: utils.formatDate.format(new Date(value.devices_malfunction_dispose_time), 'yyyy-MM-dd hh-mm-ss'),
        recordStatus: value.devices_malfunction_record_status,
        recordCause: value.devices_malfunction_record_cause,
        recordDescribe: value.devices_malfunction_record_describe,
        identifyPeople: '',
        expectDisposeTime: utils.formatDate.format(new Date(value.devices_malfunction_expectdispose_time), 'yyyy-MM-dd hh-mm-ss')
      }
      this.devicesNumber = value.devices.devices_control_devices_number
      this.identifyPeopleName = value.devices_malfunction_identify_people
      this.malfunctionPeopleName = value.devices_malfunction_people
      if (!this.$refs['addRecord'] === undefined) {
        this.$refs['addRecord'].resetFields()
      }
      this.title = '修改故障记录'
      this.show = true
    },
    moreButton (value) {
      this.moreData = {
        devicesName: value.devices.devices_control_devices_name,
        devicesNumber: value.devices.devices_control_devices_number,
        buyTime: value.devices.devices_control_devices_purchase_date,
        useTime: value.devices.devices_control_devices_use_date
      }
      this.moreAxiosData.devicesId = value.devices.devices_control_devices_id
      this.getMore()
      this.moreShow = true
    },
    // 选择设备
    selectDevice () {
      this.$mesDevice({}).then((data) => {
        this.addRecord.devicesId = data.rows[0].devices_control_devices_id
        this.addRecord.devicesName = data.rows[0].devices_control_devices_name
        this.devicesNumber = data.rows[0].devices_control_devices_number
      })
    },
    // 选择人员
    selectStaff (type) {
      this.$mesStaff.show({
        type: 'all',
        reRender: true,
        selectedIds: []
      }).then((data) => {
        if (type === 'identifyPeople') {
          this.addRecord.identifyPeople = data.rows[0].role_staff_id
          this.identifyPeopleName = data.rows[0].role_staff_name
        } else {
          this.addRecord.malfunctionPeople = data.rows[0].role_staff_id
          this.malfunctionPeopleName = data.rows[0].role_staff_name
        }
      })
    },
    // 提交
    submit () {
      this.$refs.addRecord.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            if (this.title === '新增故障记录') {
              let data = Object.assign(this.addRecord, {})
              saveMalfunctionRecordInfo(data).then((data) => {
                if (data.status === 0) {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.show = false
                  this.getData('all')
                } else {
                  this.$message.error(data.msg)
                }
              })
            } else {
              let data = Object.assign(this.addRecord, {})
              modifyMalfunctionRecordInfo(data).then((data) => {
                 if (data.status === 0) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.show = false
                  this.getData('all')
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          })
        }
      })
    },
    // 删除
    remove (id) {
      this.$confirm('您确认删除此吗？删除后将无法查询此数据', '提示', {}).then(() => {
        removeMalfunctionRecordInfo({recordId: id}).then((data) => {
          if (data.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData('all')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    moreRemove (id) {
      this.$confirm('您确认删除此吗？删除后将无法查询此数据', '提示', {}).then(() => {
        removeMalfunctionRecordInfo({recordId: id}).then((data) => {
          if (data.status === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getMore()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  },
  filters: {
    date (value) {
      return utils.formatDate.format(new Date(value), 'yyyy-MM-dd')
    }
  },
  mounted () {
    this.getData('all')
    this.getType()
  }
}
</script>
<style  scoped lang="scss">
.margin {
  margin-top: 10px
}
</style>

