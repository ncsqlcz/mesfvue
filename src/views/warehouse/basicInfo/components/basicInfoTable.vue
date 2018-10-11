<template>
    <section>
        <el-table :data="dataList" style="width: 100%">
            <el-table-column type="index" label="序号" width="60"> </el-table-column>
            <!-- 供应商 -->
            <el-table-column v-if="headType === 'suppliers'" label="供应商代号" prop="" width="120"> </el-table-column>
            <el-table-column v-if="headType === 'suppliers'" label="供应商单位名称" prop="" width="200"> </el-table-column>
            <el-table-column v-if="headType === 'suppliers'" label="联系人" prop="" width="100"> </el-table-column>
            <el-table-column v-if="headType === 'suppliers'" label="电话" prop="" width="160"> </el-table-column>
            <el-table-column v-if="headType === 'suppliers'" label="邮箱" prop="" width="160"> </el-table-column>
            <el-table-column v-if="headType === 'suppliers'" label="地址" prop="" width="160"> </el-table-column>
            <!-- 仓库管理 -->
            <el-table-column v-if="headType === 'warehouse'" label="仓库编号" prop="" width="350"> </el-table-column>
            <el-table-column v-if="headType === 'warehouse'" label="仓库名称" prop="" width="320"> </el-table-column>
            <!--物料信息-->
            <el-table-column v-if="headType === 'materialbaseinfo'" label="名称" prop=""> </el-table-column>
            <el-table-column v-if="headType === 'materialbaseinfo'" label="规格/型号" prop=""> </el-table-column>
            <el-table-column v-if="headType === 'materialbaseinfo'" label="单位" prop=""> </el-table-column>
            <!--成品信息-->
            <el-table-column v-if="headType === 'productbaseinfo'" label="成品编号"  prop=""></el-table-column>
            <el-table-column v-if="headType === 'productbaseinfo'" label="成品种类"  prop=""></el-table-column>
            <el-table-column v-if="headType === 'productbaseinfo'" label="成品类型"  prop=""></el-table-column>
            <el-table-column v-if="headType === 'productbaseinfo'" label="型号"  prop=""></el-table-column>
            <el-table-column v-if="headType === 'productbaseinfo'" label="成品参数"  prop=""></el-table-column>
             <!-- 入库管理 -->
            <el-table-column v-if="headType === 'productin'"  prop="" label="单据编号" ></el-table-column>
            <el-table-column v-if="headType === 'productin'" prop="" label="存储位置" ></el-table-column>
            <el-table-column v-if="headType === 'productin'" prop="" label="记录人" ></el-table-column>
            <el-table-column v-if="headType === 'productin'" prop="" label="开单日期" ></el-table-column>
            <!-- 出库管理 -->
            <el-table-column v-if="headType === 'productout'" prop="" label="单据编号" ></el-table-column>
            <el-table-column v-if="headType === 'productout'" prop="" label="出库仓库" ></el-table-column>
            <el-table-column v-if="headType === 'productout'" prop="" label="记录人" ></el-table-column>
            <el-table-column v-if="headType === 'productout'" prop="" label="开单日期" ></el-table-column>

            <el-table-column label="操作" prop="" width="200">
                <template slot-scope="scope">
                <el-button size="small" icon="el-icon-edit" @click="editMaterial(scope.row)" type="primary">修改</el-button>
                <el-button size="small" icon="el-icon-delete" @click="remove(scope.row.warehouse_material_id)" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
export default {
    name: 'basicInfoTable',
    data () {
        return {
           
            dataList: [
                {}
            ]
        }
    },
    props: ['headType']
}
</script>

<style>

</style>
