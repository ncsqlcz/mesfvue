/*
 * @Author: liucz 
 * @Date: 2018-09-21 16:07:59 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-09-21 18:40:46
 */
<template>
  <section>
    <!-- <input type="text" v-model="inputValue" v-scanCode> -->
    <el-select
      v-scanCode
      v-model="values"
      multiple
      filterable
      allow-create
      default-first-option
      size="medium"
      @change="handleValueChange"
      @scanChange="handleScanInputChange"
      placeholder="test: 仅支持扫码枪输入">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </section>
</template>

<script>
import utils from "@/common/js/utils";
export default {
  name: "ScanGunInput",
  data() {
    return {
      inputValue: '',
      values: [],
      options: []
    };
  },
  mounted() {},
  methods: {
    handleValueChange (val) {
      // console.log('handleValueChange:', val)
    },
    // 扫码枪输入
    handleScanInputChange (val) {
      console.log('handleScanInputChange:', val)
    },
  }
};
</script>


<style scoped>
</style>
