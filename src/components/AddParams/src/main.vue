<!-- 刘川中 2018.4.14 -->
<template>
  <el-dialog :title="title || '添加参数' " :visible.sync="visible" class="mes-dialog" width="70%" :close-on-click-modal="false">
    <el-col class="toolbar">
      <el-form :inline="true" @submit.native.prevent>
        <el-col :span="24" class="text-right">
          <el-form-item>
            <el-button type="primary" size="small" @click="handleAdd" icon="el-icon-plus">新增</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
    <!--列表 start-->
    <el-table :data="list"
              row-class-name="el-mini-row "
              ref="table"
              class="w-100"
              highlight-current-row v-if="visible">
      <el-table-column type="index" :index="getIndex"></el-table-column>
      <el-table-column prop="use_material_time" :label="getRequired('投料时间') + '投料时间'" v-if="isShow('投料时间')" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model.trim="scope.row.use_material_time"
            type="datetime"
            placeholder="选择投料时间"
            align="right"
            size="small"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column prop="param_value" :label="getRequired('参数值') + '参数值'" v-if="isShow('参数值')">
        <template slot-scope="scope">
          <el-input placeholder="输入参数" v-model.trim="scope.row.param_value" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="record_time" :label="getRequired('记录时间') + '记录时间'" v-if="isShow('记录时间')" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model.trim="scope.row.record_time"
            type="datetime"
            placeholder="选择记录时间"
            align="right"
            size="small"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="record_user" :label="getRequired('记录人') + '记录人'" v-if="isShow('记录人')">
        <template slot-scope="scope">
          <el-input placeholder="点击选择人员" v-model.trim="scope.row.record_user"
                    size="small" clearable readonly class="pointer"
                    @click.native="handleSelectUser('record', scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="use_material_amount" :label="getRequired('使用数量') + '使用数量'" v-if="isShow('使用数量')" width="140">
        <template slot-scope="scope">
          <el-input-number v-model.trim="scope.row.use_material_amount" :min="1" label="数量" size="small" controls-position="right"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column prop="use_material_number" :label="getRequired('物料编号') + '物料编号'" v-if="isShow('物料编号')">
        <template slot-scope="scope">
          <el-input placeholder="输入物料编号" v-model.trim="scope.row.use_material_number" size="small" clearable></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="device_number" :label="getRequired('设备编号') + '设备编号'" v-if="isShow('设备编号')">
        <template slot-scope="scope">
          <el-input placeholder="点击选择设备" v-model.trim="scope.row.device_number"
                    size="small" readonly class="pointer"
                    @click.native="handleSelectDevice(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="start_time" :label="getRequired('开始时间') + '开始时间'" v-if="isShow('开始时间')" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model.trim="scope.row.start_time"
            type="datetime"
            placeholder="选择开始时间"
            align="right"
            size="small"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="end_time" :label="getRequired('结束时间') + '结束时间'" v-if="isShow('结束时间')" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model.trim="scope.row.end_time"
            type="datetime"
            placeholder="选择结束时间"
            align="right"
            size="small"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </template>
      </el-table-column>

      <el-table-column prop="device_status" :label="getRequired('设备状态') + '设备状态'" v-if="isShow('设备状态')" width="250">
        <template slot-scope="scope">
          <el-select v-model="scope.row.device_status" placeholder="选择设备状态">
            <el-option
              v-for="item in deviceStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="operator" :label="getRequired('操作人') + '操作人'" v-if="isShow('操作人')">
        <template slot-scope="scope">
          <el-input placeholder="点击选择操作人员" v-model.trim="scope.row.operator"
                    size="small" readonly class="pointer"
                    @click.native="handleSelectUser('operator', scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="use_material_user" :label="getRequired('投料人') + '投料人'" v-if="isShow('投料人')">
        <template slot-scope="scope">
          <el-input placeholder="点击选择投料人" v-model.trim="scope.row.use_material_user"
                    size="small" readonly class="pointer"
                    @click.native="handleSelectUser('material', scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="remark" :label="getRequired('备注') + '备注'" v-if="isShow('备注')">
        <template slot-scope="scope">
          <el-input placeholder="备注" v-model.trim="scope.row.remark" size="small" clearable></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="" class="circle" size="small" round circle icon="el-icon-arrow-up" @click="handleUp(scope.$index)"></el-button>
          <el-button type="" class="circle" size="small" round circle icon="el-icon-arrow-down" @click="handleDown(scope.$index)"></el-button>
          <el-button type="danger" class="circle" size="small" round circle icon="el-icon-delete" @click="handleDel(scope)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--列表 end-->

    <div class="clearfix">
      <!--确认 start-->
      <el-col :span="24" class="text-right mt-4">
        <el-button type="success" size="" @click="confirmSelected" :disabled="list.length === 0">确认添加</el-button>
      </el-col>
      <!--确认 end-->
    </div>
  </el-dialog>
</template>

<script>
  import utils from '../../../common/js/utils'
  import { queryWorkOrderOperatorType } from '../../../api/api'
  export default {
    name: 'add-params',
    data () {
      return {
        title: '',
        action: '', // 动作
        visible: false,
        list: [],
        callback: null,
        selectedRows: [],
        // 所支持的参数名称
        allParamNames: [
          '参数值', '记录时间', '记录人', '备注', '投料时间',
          '使用数量', '物料编号', '投料人', '设备编号', '设备名称',
          '开始时间', '结束时间', '设备状态', '操作人'
        ],
        // 默认显示的参数
        paramNames: ['参数值', '记录人', '记录时间', '备注'],
        dict: {
          '参数值': { name: 'param_value', value: '', required: true },
          '记录人ID': { name: 'record_user_id', value: '' },
          '记录时间': { name: 'record_time', value: new Date(), required: true },
          '记录人': { name: 'record_user', value: '', required: true },
          '备注': { name: 'remark', value: '' },
          '投料时间': { name: 'use_material_time', value: new Date(), required: true },
          '使用数量': { name: 'use_material_amount', value: 0, required: true },
          '物料编号': { name: 'use_material_number', value: '', required: true },
          '投料人ID': { name: 'use_material_user_id', value: '' },
          '投料人': { name: 'use_material_user', value: '', required: true },
          '设备编号': { name: 'device_number', value: '', required: true },
          '设备名称': { name: 'device_name', value: '' },
          '设备ID': { name: 'device_id', value: '' },
          '开始时间': { name: 'start_time', value: new Date(), required: true },
          '结束时间': { name: 'end_time', value: new Date(), required: true },
          '设备状态': { name: 'device_status', value: '正常工作', required: true },
          '操作人': { name: 'operator', value: '', required: true },
          '操作人ID': { name: 'operator_id', value: '' }
        },
        pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '明天',
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }]
        },
        deviceStatusList: []
      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      initList () {
        // console.log(this.paramNames);
        if (this.isShow('设备状态') && this.deviceStatusList.length === 0) {
          this.initDeviceStatusList()
        }
        this.list = []
        this.handleAdd()
      },
      isShow (name) {
        let has = false
        this.paramNames.forEach(item => {
          if (item === name) {
            has = true
          }
        })
        return has && this.dict[name] !== undefined
      },
      getProp (name) {
        return this.dict[name]
      },
      getRequired (name) {
        return this.dict[name].required === true ? '*' : ''
      },
      // 确认选择
      confirmSelected (row) {
        if (this.list.length > 0 && this.checkList()) {
          this.visible = false
          this.handleAction('selected')
        }
      },
      handleAction (action) {
        this.action = action
        // 手动触发instance的回调，用以resolve
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
        }, 0)
      },
      getIndex (index) {
        return index + 1
      },
      handleSelectUser (type, row) {
        switch (type) {
        case 'material':
          this.$mesStaff.show({
            type: 'all',
            reRender: true,
            selectedIds: [row.use_material_user_id]
          }).then(res => {
            row.use_material_user_id = res.rows[0].role_staff_id
            row.use_material_user = res.rows[0].role_staff_name
          })
          break;
        case 'record':
          this.$mesStaff.show({
            type: 'all',
            reRender: true,
            selectedIds: [row.record_user_id]
          }).then(res => {
            row.record_user_id = res.rows[0].role_staff_id
            row.record_user = res.rows[0].role_staff_name
          })
          break;
        case 'operator':
          this.$mesStaff.show({
            type: 'all',
            reRender: true,
            selectedIds: [row.operator]
          }).then(res => {
            row.operator_id = res.rows[0].role_staff_id
            row.operator = res.rows[0].role_staff_name
          })
          break;
        }
      },
      handleSelectDevice (row) {
        this.$mesDevice.show({
          selectedIds: [row.device_id]
        }).then(res => {
          row.device_number = res.rows[0].devices_control_devices_number
          row.device_name = res.rows[0].devices_control_devices_name
          row.device_id = res.rows[0].devices_control_devices_id
        })
      },
      handleAdd () {
        let item = {}
        this.paramNames.forEach(key => {
          if (this.dict[key] !== undefined) {
            item[this.dict[key].name] = this.dict[key].value
          }
        })
        this.list.push(item)
      },
      handleUp (index) {
        if (index > 0) {
          let tmp = this.list.splice(index, 1)
          this.list.splice(index - 1, 0, tmp[0])
        }
      },
      handleDown (index) {
        if (index < this.list.length) {
          let tmp = this.list.splice(index, 1)
          this.list.splice(index + 1, 0, tmp[0])
        }
      },
      // 数据检验
      checkList () {
        for (let i = 0, len = this.list.length; i < len; i++) {
          let item = this.list[i]
          for (const m in this.paramNames) {
            let key = this.paramNames[m]
            let name = this.dict[key].name
            let defaultValue = this.dict[key].value
            // 时间因为有默认值，要排除
            if (
              this.dict[key].required &&
              item[name] === defaultValue &&
              name !== 'record_time' &&
              name !== 'use_material_time' &&
              name !== 'start_time' &&
              name !== 'end_time' &&
              name !== 'device_status'
            ) {
              this.$message.warning(key + '不能为空')
              return false
            }
          }
          if (item.record_time !== undefined && item.record_time !== '') {
            item.record_time = utils.formatDate.format(new Date(item.record_time), 'yyyy-MM-dd hh:mm:ss')
          }
          if (item.use_material_time !== undefined && item.use_material_time !== '') {
            item.use_material_time = utils.formatDate.format(new Date(item.use_material_time), 'yyyy-MM-dd hh:mm:ss')
          }
        }
        return true
      },
      handleDel (scope) {
        this.list.splice(scope.$index, 1)
        // for (const key in scope.row) {
        //   if (scope.row[key] !== this.dict[key].value) {
        //     this.$confirm('确认删除此行数据吗？', '提示', action => {
        //       if (action === 'confirm') {
        //         this.list.splice(scope.$index, 1)
        //       }
        //     }).catch(() => {})
        //   } else {
        //     this.list.splice(scope.$index, 1)
        //   }
        // }
      },
      handleCommit () {

      },
      // 初始化设备状态列表
      initDeviceStatusList () {
        queryWorkOrderOperatorType().then(res => {
          if (res.status === 0 || res.map.operatorTypes.length > 0) {
            res.map.operatorTypes.forEach((item, index) => {
              this.deviceStatusList.push({
                label: item,
                value: item
              })
            })
          }
        })
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">
  .circle.el-button{
    width: 40px;
    height: 40px;
    text-align: center;
    padding: 0 0;
  }
  .circle{
    border-radius: 50%;
  }
</style>
