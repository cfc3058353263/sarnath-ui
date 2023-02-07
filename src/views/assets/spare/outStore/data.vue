<template>
    <div class="app-container">
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">添加出库品
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
            <el-table-column label="型号" prop="spareModel" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="单位" prop="spareUnitName" :show-overflow-tooltip="true" width="80">
            </el-table-column>
            <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true" width="200">
            </el-table-column>
            <el-table-column label="供应商" prop="spareSupplierName" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="单价" prop="price" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="出库数量" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input onkeyup="value=value.replace(/[^\d]/g,'')" oninput="if(value.length > 8) value=value.slice(0, 8)" :disabled="scope.row.isModify" :max="scope.row.currentNum" v-model.number="scope.row.number" :min="0" placeholder="" />
                </template>
            </el-table-column>
            <el-table-column label="出库原因" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.reason" placeholder="" maxlength="100"/>
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
                <el-table-column label="型号" prop="spareModel" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="单位" prop="spareUnitName" :show-overflow-tooltip="true" width="80">
                </el-table-column>
                <el-table-column label="供应商" prop="spareSupplierName" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="剩余数量" prop="currentNum" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true">
                </el-table-column>

            </el-table>
            <!-- 分页 -->
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
            <!-- 分页 -->
        </el-dialog>
    </div>
</template>

<script>
import {
    getALLOrderInDetailByPage,
    addSpareOrdersOut,
    getDetailById,
    modifySpareOrdersOut,
} from '@/api/assets/spare/EntryAndOutStore'

export default {
    name: 'spareOutStoreInfo',
    data() {
        return {
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
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
            // 总条数
            total: 0,
            // 弹出框表格数据
            spareDataList: [],
            // 已选择备品表格数据
            spareSelectList: [],
            //备品类型
            spareTypeOptions: [],
            //弹出框表单选择selection
            selectList: [],
        }
    },
    created() {
        if (this.$route.query.orderId) {
            this.getSpareDetailList(this.$route.query.orderId)
        }
        //备品类型
        this.getDicts('sys_spare_type').then((response) => {
            this.spareTypeOptions = response.data
        })
        //获取弹窗数据
        this.getList()
    },
    methods: {
        /**
         * 获取入库单详情列表
         */
        getSpareDetailList(orderId) {
            getDetailById(orderId).then((res) => {
                this.spareSelectList = res.SpareOrderDetails
                this.spareSelectList.forEach((item) => {
                    item.isModify = true //编辑不可输入
                })
            })
        },
        /**
         * 获取已入库订单列表
         */
        getList() {
            getALLOrderInDetailByPage(this.queryParams).then((res) => {
                this.spareDataList = res.rows
                this.total = res.total
            })
        },
        /**
         * 点击添加按钮操作
         */
        handleAdd() {
            this.open = true
            this.$refs.materialTable.clearSelection()
        },
        /**
         * 提交按钮
         */
        submit() {
            for (let item of this.spareSelectList) {
                if (!item.isModify) {
                    if (item.number > item.currentNum) {
                        this.msgError('超出剩余数量')
                        return
                    }
                }
            }
            let list = this.spareSelectList.map((item, index) => {
                let newItem = {
                    spareId: item.spareId,
                    batchCode: item.batchCode,
                    outNumber: item.number === undefined ? 0 : item.number,
                    reason: item.reason,
                    price: item.price,
                }
                return newItem
            })
            if (list.length < 1) {
                this.msgError('请添加一条出库信息')
                return
            }

            if (this.$route.query.orderId) {
                let orderId = this.$route.query.orderId
                modifySpareOrdersOut(orderId, list).then((res) => {
                    this.msgSuccess('编辑成功')
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.push({
                        path:
                            this.$store.getters.currentSystem == 1
                                ? '/light/assets/spare/outStore'
                                : '/wind/assets/spare/outStore',
                    })
                })
            } else {
                addSpareOrdersOut(list).then((res) => {
                    this.msgSuccess('添加成功')
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.push({
                        path:
                            this.$store.getters.currentSystem == 1
                                ? '/light/assets/spare/outStore'
                                : '/wind/assets/spare/outStore',
                    })
                })
            }
        },
        /**
         * 删除按钮操作
         */
        handleDelete(row) {
            for (let index in this.spareSelectList) {
                if (this.spareSelectList[index].id === row.id) {
                    this.spareSelectList.splice(index, 1)
                }
            }
        },
        /**
         * 点击弹窗确认按钮操作
         */
        confirm() {
            for (let item of this.spareSelectList) {
                for (let index in this.selectList) {
                    if (item.id === this.selectList[index].id) {
                        this.selectList.splice(index, 1)
                    }
                }
            }
            this.spareSelectList = this.spareSelectList.concat(this.selectList)
            this.open = false
        },
        /**
         * 点击查询按钮操作
         */
        handleQuery() {
            this.getList()
        },
        /**
         * 点击重置按钮操作
         */
        resetQuery() {
            // 查询参数
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
         * 多选框
         * @param selection
         */
        handleSelectionChange(selection) {
            this.selectList = selection
        },
    },
}
</script>

<style scoped>
</style>
