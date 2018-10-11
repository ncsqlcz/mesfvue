<template>
    <section>
         <el-table :data="productList" style="width:100%">
            <el-table-column type="index" width="80" label="序号"></el-table-column>
            <el-table-column prop="" label="单据编号" ></el-table-column>
            <el-table-column prop="" label="存储位置" v-if=" headType === 'productin' " ></el-table-column>
            <el-table-column prop="" label="出库仓库" v-if=" headType === 'productout' " ></el-table-column>

            <el-table-column prop="" label="记录人" ></el-table-column>
            <el-table-column prop="" label="开单日期" ></el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
         </el-table>
    </section>
</template>
<script>
export default {
    data () {
        return {
            productList: [
                {}
            ]
        }
    },
    props: ['headType'],
    methods: {
        handleView (row) {
            this.$emit('view', row)
        },
        handleEdit (row) {
            this.$emit('edit', row)
        },
        handleDelete (row) {
            this.$emit('delete', row)
        },
        historyRecord (row) {
            this.$emit('record', row)
        }
    }
}
</script>
<style>

</style>
