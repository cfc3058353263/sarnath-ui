<template>
    <div class="app-container">
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">添加备品
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="submit">提交
                </el-button>
            </el-col>
        </el-row>

        <!--  已选择备品列表  -->

        <el-table v-loading="loading" :data="spareSelectList">
            <el-table-column label="备品类型" prop="spareTypeName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="备品编码" prop="spareCode" :show-overflow-tooltip="true" />
            <el-table-column label="备品名称" prop="spareName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" prop="spareSpecs" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="单位" prop="spareUnitName" :show-overflow-tooltip="true" width="80">
            </el-table-column>
            <el-table-column label="供应商" prop="spareSupplierName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="入库数量" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.number" onkeyup="value=value.replace(/[^\d]/g,'')" :min="0" oninput="if(value.length > 8) value=value.slice(0, 8)" @input="inputNumListner(scope.row.number,scope.row)" placeholder="" />
                </template>
            </el-table-column>
            <el-table-column label="单价" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.price" onkeyup="value=value.replace(/[^\d]/g,'')" oninput="if(value.length > 8) value=value.slice(0, 8)" @input="inputPriceListner(scope.row.price,scope.row)" placeholder="" :min="0" />
                </template>
            </el-table-column>
            <el-table-column label="总价" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.amount" placeholder="" :min="0" type="number" :disabled="true" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑对话框 -->
        <el-dialog :visible.sync="open" :close-on-click-modal="false" append-to-body title="选择备品" width="1500px">
            <!-- 查询条件 -->
            <el-row>
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                    <el-form-item label="备品类型" prop="spareType">
                        <el-select v-model="queryParams.spareType" placeholder="备品类型" clearable size="small" style="width: 240px">
                            <el-option v-for="dict in spareTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="备品编码" prop="spareCode">
                        <el-input v-model="queryParams.spareCode" placeholder="请输入备品编码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item label="备品名称" prop="spareName">
                        <el-input v-model="queryParams.spareName" placeholder="请输入备品名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- 按钮.... -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="confirm">确认
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
            </el-row>
            <!-- 表单数据 -->
            <el-table v-loading="loading" :data="spareDataList" @selection-change="handleSelectionChange" :row-key="(row) => row.id" ref="materialTable">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
                <el-table-column label="备品类型" prop="spareTypeName" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="备品编码" prop="spareCode" :show-overflow-tooltip="true" />
                <el-table-column label="备品名称" prop="spareName" :show-overflow-tooltip="true" />
                <el-table-column label="规格" prop="spareSpecs" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="单位" prop="spareUnitName" :show-overflow-tooltip="true" width="80">
                </el-table-column>
                <el-table-column label="供应商" prop="spareSupplierName" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="最低库存" prop="spareMinNum" :show-overflow-tooltip="true" />
                <el-table-column label="最高库存" prop="spareMaxNum" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{moment(scope.row.createTime).format("yyyy-MM-DD HH:mm:ss")}}</span>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页 -->
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[3, 30, 50, 100]" @pagination="getList" />
            <!-- 分页 -->
        </el-dialog>
    </div>

</template>

<script>
import { listData } from '@/api/assets/sparebase'
import { getSupplierSelect } from '@/api/assets/supplier'
import {
    addSpareOrdersIn,
    getDetailById,
    modifySpareOrdersIn,
} from '@/api/assets/spare/EntryAndOutStore'

export default {
    name: 'spareEntryStoreInfo',
    data() {
        return {
            // 备品信息查询条件
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 3,
                spareType: undefined,
                spareName: undefined,
                spareCode: undefined,
            },
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 是否显示弹出层
            open: false,
            // 弹出窗标题
            title: '',
            // 弹出框表格数据
            spareDataList: [],
            // 已选择备品表格数据
            spareSelectList: [],
            // 总条数
            total: 0,
            //备品类型
            spareTypeOptions: [],
            //备品供应商
            supplierOptions: [],
            //弹出框表单选择selection
            selectList: [],
        }
    },
    created() {
        if (this.$route.query.orderId) {
            this.getSpareDetailList(this.$route.query.orderId)
        }
        //获取列表
        this.getList()
        //备品类型
        this.getDicts('sys_spare_type').then((response) => {
            this.spareTypeOptions = response.data
        })
        //获取供应商下拉框
        getSupplierSelect().then((response) => {
            this.supplierOptions = response.data
        })
    },
    methods: {
        /**
         * 获取入库单详情列表
         */
        getSpareDetailList(orderId) {
            getDetailById(orderId).then((res) => {
                this.spareSelectList = res.SpareOrderDetails
                this.spareSelectList.forEach((item) => {
                    item.id = item.spareId
                })
            })
        },
        /**
         * 获取备品列表
         */
        getList() {
            this.loading = true
            listData(this.queryParams).then((response) => {
                this.spareDataList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        /**
         * 新增按钮操作
         */
        handleAdd() {
            this.open = true
            this.$nextTick(() => {
                this.$refs.materialTable.clearSelection()
            })
        },
        /**
         * 提交按钮
         */
        submit() {
            let ids
            let list = this.spareSelectList.map((item, index) => {
                if (item.spareMinNum > Number(item.number)) {
                    ids = 1
                    return this.msgError('入库数量不得少于最少库存,请检查重新填写')
                }
                if (item.spareMaxNum < Number(item.number)) {
                    ids = 1
                    return this.msgError('入库数量不得大于最大库存,请检查重新填写')
                }
                let newItem = {
                    spareId: item.id,
                    inNumber: item.number === undefined ? 0 : item.number,
                    price: item.price === undefined ? 0 : item.price,
                    amount: item.amount === undefined ? 0 : item.amount,
                }
                return newItem
            })
            if (ids) {
                return
            }
            if (list.length < 1) {
                this.msgError('请添加一条入库信息')
                return
            }
            if (this.$route.query.orderId) {
                let orderId = this.$route.query.orderId
                modifySpareOrdersIn(orderId, list).then((res) => {
                    if (res.code == 200) {
                        this.msgSuccess('编辑成功')
                        this.$store.dispatch('tagsView/delView', this.$route)
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? '/light/assets/spare/entryStore'
                                    : '/wind/assets/spare/entryStore',
                        })
                    } else {
                        this.msgSuccess(res.msg)
                    }
                })
            } else {
                addSpareOrdersIn(list).then((res) => {
                    if (res.code == 200) {
                        this.msgSuccess('添加成功')
                        this.$store.dispatch('tagsView/delView', this.$route)
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? '/light/assets/spare/entryStore'
                                    : '/wind/assets/spare/entryStore',
                        })
                    } else {
                        this.msgSuccess(res.msg)
                    }
                })
            }
        },
        /**
         * 删除按钮操作
         */
        handleDelete(row) {
            for (let index in this.spareSelectList) {
                if (this.spareSelectList[index].spareCode === row.spareCode) {
                    this.spareSelectList.splice(index, 1)
                }
            }
        },
        /**
         * 搜索按钮操作
         */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        /**
         * 重置按钮操作
         */
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 15,
                spareType: undefined,
                spareName: undefined,
                spareCode: undefined,
            }
            this.getList()
        },
        /**
         * 弹出框确认按钮操作
         */
        confirm() {
            for (let item of this.spareSelectList) {
                for (let index in this.selectList) {
                    if (item.supplierId === this.selectList[index].supplierId) {
                        this.selectList.splice(index, 1)
                    }
                }
            }
            this.spareSelectList = this.spareSelectList.concat(this.selectList)
            this.open = false
        },
        /**
         * 多选框
         * @param selection
         */
        handleSelectionChange(selection) {
            this.selectList = selection
        },
        inputNumListner(data, row) {
            if (row.price != undefined) {
                row.amount = row.price * data
            } else {
                row.amount = 0
            }
        },
        inputPriceListner(data, row) {
            if (row.number != undefined) {
                row.amount = row.number * data
            } else {
                row.amount = 0
            }
        },
    },
}
</script>

<style scoped>
</style>
