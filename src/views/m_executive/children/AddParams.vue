<!--刘川中 2018.4.14-->
<template>
  <el-dialog :visible.sync="visible" title="添加物料">
    添加物料
  </el-dialog>
</template>

<script>
  export default {
    name: 'add-params',
    data () {
      return {
        visible: false,
        list: []
      }
    },
    props: {
    },
    mounted () {

    },
    methods: {
      handleAdd () {
        this.list.push({

        })
      },
      handleUp (row) {

      },
      handleDown (row) {

      },
      handleDel (row) {

      },
      handleCommit () {

      }
    }
  }
</script>

<style scoped>

</style>
