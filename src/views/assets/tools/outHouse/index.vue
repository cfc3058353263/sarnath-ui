<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <top-search v-show="showSearch" :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" :timeShow="timeShow" :getList="getList" :resetQuery="resetQuery"></top-search>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['assets:tools:outHouse:add']" @click="handleAdd">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getOutHouseList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" @row-click="rowClick" @current-change="handleCurrentChange" :row-class-name="tableRowClassName" :row-style="rowClass">
            <el-table-column type="index" align="center" width="55" prop="prop" label="序号" />
            <el-table-column label="出库单号" prop="orderCode" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" prop="createTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{
            moment(scope.row.createTime).format("yyyy-MM-DD HH:mm:ss")
          }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" prop="createUserName" :show-overflow-tooltip="true" />
            <el-table-column label="出库时间" prop="updateTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{
                        scope.row.updateTime&&moment(scope.row.updateTime).format("yyyy-MM-DD HH:mm:ss")
          }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出库人" prop="optName" :show-overflow-tooltip="true" />
            <el-table-column label="出库状态" prop="status" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ orderStatus[scope.row.status] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status == 1" size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:tools:outHouse:edit']" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="scope.row.status == 1" size="mini" type="text" icon="el-icon-circle-check" v-hasPermi="['assets:tools:outHouse:confirm']" @click="confirm(scope.row)">确认</el-button>
                    <el-button v-if="scope.row.status == 1" size="mini" type="text" icon="el-icon-delete" v-hasPermi="['assets:tools:outHouse:remove']" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" @pagination="getOutHouseList" />
        <!-- 分页 -->
        <div>出库明细列表</div>
        <el-table v-loading="loading" :data="detailed" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" width="55" prop="prop" label="序号" />
            <el-table-column label="工器具类型" prop="toolsType" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ toolsType[scope.row.toolsType] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="工器具分类" prop="toolsClass" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ toolsClass[scope.row.toolsClass] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="工器具编码" prop="toolsCode" :show-overflow-tooltip="true" />
            <el-table-column label="工器具名称" prop="toolsName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" width="60" />
            <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" width="60" />
            <el-table-column label="单位" prop="toolsUnit" :show-overflow-tooltip="true" width="60">
                <template slot-scope="scope">
                    <span>{{ unit[scope.row.toolsUnit] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierId" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ supplierType[scope.row.supplierId] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检验周期" prop="checkCycle" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ cycle[scope.row.checkCycle] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出库原因" prop="reason" :show-overflow-tooltip="true" />
            <el-table-column label="出库数量" prop="number" :show-overflow-tooltip="true" />
            <el-table-column label="工器具编码" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-reading" @click="handleCode(scope.row)">查看编码</el-button>
                </template>
            </el-table-column>
            <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true" width="250" />
        </el-table>
        <el-dialog :close-on-press-escape="false" :visible.sync="openCode" :close-on-click-modal="false" append-to-body title="工器具编码" width="600px">
            <div v-for="item,index of this.codeTitleList" :key="index">
                <span>{{codeTitle + "编码：" + item.detailCode}}</span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    OutHouseList,
    detailedList,
    getdictList,
    OrdersIn,
    OrdersDelete,
} from "@/api/assets/tools/outHouse";
import { getAllSupplier } from "@/api/assets/tools/info";
import { getIsEnableCode } from "@/api/utils";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
export default {
    name: "outHouse",
    components: {
        topSearch,
    },
    data() {
        return {
            //topSearch
            inputItem: [
                {
                    label: "出库单号",
                    name: "odd",
                    placeholder: "请输出库单号",
                },
            ],
            selectItem: [
                {
                    label: "出库状态",
                    options: [],
                    name: "status",
                },
            ],
            timeShow: true,
            //topSearch
            // 出库单表格数据
            list: [],
            // 出库明细数据
            detailed: [],
            //tbIndex
            selectedIndex: null,
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                odd: null,
                startTime: this.moment().format("yyyy-MM-01"),
                stopTime: this.moment().format("yyyy-MM-DD"),
            },
            query: {},
            //出库状态
            orderStatus: { options: [] },
            // 供应商类型
            supplierType: { options: [] },
            //工器具类型
            toolsType: { options: [] },
            //工器具分类
            toolsClass: { options: [] },
            //工器具编码是否禁用
            disabled: null,
            //单位
            unit: { options: [] },
            //周期
            cycle: { options: [] },
            // 表单参数
            form: {},
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //openCode
            openCode: false,
            codeTitleList: [],
            codeTitle: "",
            // 表单校验
            rules: {
                toolsType: [
                    {
                        required: true,
                        message: "工器具类型不能为空",
                        trigger: "blur",
                    },
                ],
                toolsClass: [
                    {
                        required: true,
                        message: "工器具分类不能为空",
                        trigger: "blur",
                    },
                ],
                toolsCode: [
                    {
                        required: true,
                        message: "工器具编码不能为空",
                        trigger: "blur",
                    },
                ],
                toolsName: [
                    {
                        required: true,
                        message: "工器具名称不能为空",
                        trigger: "blur",
                    },
                ],
                toolsUnit: [
                    {
                        required: true,
                        message: "单位不能为空",
                        trigger: "blur",
                    },
                ],
                checkCycle: [
                    {
                        required: true,
                        message: "检验周期不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        axios
            .all([
                getdictList("sys_order_status"),
                getAllSupplier(),
                getdictList("sys_tools_type"),
                getdictList("sys_tools_class"),
                getdictList("sys_device_unit"),
                getdictList("sys_check_cycle"),
            ])
            .then(
                axios.spread(
                    (
                        orderStatus,
                        supplierType,
                        toolsType,
                        toolsClass,
                        unit,
                        cycle
                    ) => {
                        for (let item of this.selectItem) {
                            if (item.label === "出库状态") {
                                for (let list of orderStatus.data) {
                                    const obj = {
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    };
                                    item.options.push(obj);
                                    this.orderStatus[list.dictValue] =
                                        list.dictLabel;
                                    this.orderStatus.options.push({
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    });
                                }
                            }
                        }
                        for (let list of toolsClass.data) {
                            this.toolsClass[list.dictValue] = list.dictLabel;
                            this.toolsClass.options.push({
                                value: list.dictValue,
                                label: list.dictLabel,
                            });
                        }
                        for (let list of toolsType.data) {
                            this.toolsType[list.dictValue] = list.dictLabel;
                            this.toolsType.options.push({
                                value: list.dictValue,
                                label: list.dictLabel,
                            });
                        }
                        for (let item of supplierType.data) {
                            this.supplierType[item.supId] = item.supName;
                            this.supplierType.options.push({
                                value: item.supId,
                                label: item.supName,
                            });
                        }
                        for (let item of unit.data) {
                            this.unit[item.dictValue] = item.dictLabel;
                            this.unit.options.push({
                                value: item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        for (let item of cycle.data) {
                            this.cycle[item.dictValue] = item.dictLabel;
                            this.cycle.options.push({
                                value: item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        this.getList();
                    }
                )
            );
    },
    methods: {
        /**重置 */
        resetQuery() {
            this.queryParams = {
                currentPage: 1,
                size: 15,
                odd: null,
                startTime: this.moment().format("yyyy-MM-01"),
                stopTime: this.moment().format("yyyy-MM-DD"),
            };
        },
        /** 信息查询 */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.getOutHouseList();
        },
        /**分页 */
        getOutHouseList() {
            this.loading = true;
            OutHouseList(this.query).then((res) => {
                this.list = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /**明细获取 */
        detailedList(orderId) {
            detailedList(orderId).then((res) => {
                this.detailed = res.data;
            });
        },
        /**工器具编码获取 */
        getIsEnableCode() {
            getIsEnableCode(2).then((res) => {
                this.disabled = res.data;
            });
        },
        rowClick(row) {},
        // 表格多选框选中数据
        handleSelectionChange(selection) {},
        // 取消按钮
        cancel() {
            this.open = false;
            this.form = {};
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/assets/outHouse/data",
            });
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/assets/outHouse/data",
                query: { orderId: row.id },
            });
        },
        /** 提交按钮 */
        submitForm: function () {
            if (
                !this.form.toolsType ||
                !this.form.toolsClass ||
                !this.form.toolsCode ||
                !this.form.toolsName ||
                !this.form.toolsUnit ||
                !this.form.checkCycle
            ) {
                this.msgError("请将信息填写完整");
                return;
            }
            if (this.disabled && !this.form.toolsCode) {
                this.form["toolsCode"] = null;
            }
            if (this.title == "编辑") {
                infoAdd(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("新增成功");
                        this.open = false;
                        this.form = {};
                        this.getOutHouseList();
                    }
                });
            } else {
                infoUpdate(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("编辑成功");
                        this.open = false;
                        this.form = {};
                        this.getOutHouseList();
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除当前的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return OrdersDelete(row.id);
                })
                .then(() => {
                    this.getOutHouseList();
                    this.detailed = [];
                    this.msgSuccess("删除成功");
                });
        },
        /** 确认按钮操作 */
        confirm(row) {
            this.$confirm("是否确认出库?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return OrdersIn(row.id);
                })
                .then(() => {
                    this.getOutHouseList();
                    this.msgSuccess("修改成功");
                });
        },
        /**以下是点击tb变色接口 */
        handleCurrentChange(val) {
            this.selectedIndex = val.index;
            this.detailedList(val.id);
        },
        rowClass({ row, rowIndex }) {
            if (this.selectedIndex === rowIndex) {
                return {
                    border: "solid 1px #3dffef",
                    "background-color": "rgba(185, 221, 249, 0.75)",
                };
            }
        },
        tableRowClassName({ row, rowIndex }) {
            row.index = rowIndex;
        },
        /**查看编码 */
        handleCode(row) {
            this.openCode = true;
            this.codeTitleList = row.codeList;
            this.codeTitle = row.toolsName;
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.el-table ::v-deep tbody tr:hover > td {
    background-color: transparent;
}
</style>
