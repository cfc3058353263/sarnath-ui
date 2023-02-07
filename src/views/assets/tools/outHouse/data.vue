<template>
    <div class="app-container">
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['assets:tools:outHouse:add']" @click="handleAdd">添加工器具</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['assets:tools:outHouse:add']" @click="submit">提交</el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="ining" :data="list">
            <el-table-column align="center" type="index" label="序号">
            </el-table-column>
            <el-table-column label="工器具类型" prop="toolsType" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ toolsType[scope.row.toolsType] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="工器具编码" prop="toolsCode" :show-overflow-tooltip="true" />
            <el-table-column label="工器具名称" prop="toolsName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="单位" prop="toolsUnit" :show-overflow-tooltip="true" width="80">
                <template slot-scope="scope">
                    <span>{{ unit[scope.row.toolsUnit] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierId" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ supplierType[scope.row.supplierId] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="库存数量" prop="numberRepertory" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="出库原因" prop="reason" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.reason" placeholder="" maxlength="100"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="出库数量" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.number" placeholder="" disabled></el-input>
                </template>
            </el-table-column>
            <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="选择工器具" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-reading" @click="handOpenCheck(scope.row,scope.column, scope.$index )">选择工器具</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" :close-on-click-modal="false" append-to-body title="选择工器具" width="1500px">
            <!-- 查询条件 -->
            <top-search :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" :getList="getList" :resetQuery="resetQuery" :timeShow="false"></top-search>
            <!-- 查询条件 -->
            <!-- 按钮.... -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="confirm">确认</el-button>
                </el-col>
            </el-row>
            <!-- 按钮.... -->
            <!-- table -->
            <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange" :row-key="(row) => row.batchCode" ref="materialTable">
                <el-table-column z type="selection" :reserve-selection="true" width="55" align="center" />
                <el-table-column align="center" type="index" label="序号">
                </el-table-column>
                <el-table-column label="工器具类型" prop="toolsType" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ toolsType[scope.row.toolsType] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工器具编码" prop="toolsCode" :show-overflow-tooltip="true" />
                <el-table-column label="工器具名称" prop="toolsName" :show-overflow-tooltip="true" />
                <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" />
                <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="toolsUnit" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ unit[scope.row.toolsUnit] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="检验周期" prop="checkCycle" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ cycle[scope.row.checkCycle] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" prop="supplierId" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ supplierType[scope.row.supplierId] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存数量" prop="numberRepertory" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true" />
            </el-table>
            <!-- table -->
            <!-- 分页 -->
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
            <!-- 分页 -->
        </el-dialog>
        <!-- 编辑对话框 -->
        <!-- 多选编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="openCheck" :close-on-click-modal="false" append-to-body title="选择工器具" width="800px">
            <el-checkbox-group v-model="codeList" @change="onChange">
                <el-checkbox v-for="item,index in codeListAll" :label="item.id" :key="index">{{codeTitle + '编码：' + item.detailCode}}</el-checkbox>
            </el-checkbox-group>
            <div class="formFoot">
                <el-button type="primary" @click="confirmCode">确定</el-button>
                <el-button type="primary" @click="openCheck = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- 多选编辑对话框 -->
    </div>
</template>

<script>
import {
    detailedList,
    getdictList,
    detailedAdd,
    likeBatch,
    getCodeList,
} from "@/api/assets/tools/outHouse";
import { getAllSupplier } from "@/api/assets/tools/info";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
export default {
    name: "toolsInfo",
    components: {
        topSearch,
    },
    data() {
        return {
            openCheck: false,
            //选中的编码
            codeList: [],
            rowIndex: null,
            //全部编码
            codeListAll: [],
            isIndeterminate: true,
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            //topSearch
            inputItem: [
                {
                    label: "工器具名称",
                    name: "toolsName",
                    placeholder: "请输入工器具名称",
                },
            ],
            selectItem: [
                {
                    label: "工器具类型",
                    options: [],
                    name: "toolsType",
                },
                {
                    label: "工器具分类",
                    options: [],
                    name: "toolsClass",
                },
            ],
            //表格数据
            list: [],
            // 弹出框的表格数据
            infoList: [],
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
            },
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
            //明细表单选择selection
            selectList: [],
            // 表单参数
            form: {},
            // 遮罩层
            loading: false,
            ining: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "",
            //编码名称
            codeTitle:"",
            // 是否显示弹出层
            open: false,
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
                getAllSupplier(),
                getdictList("sys_tools_type"),
                getdictList("sys_tools_class"),
                getdictList("sys_device_unit"),
                getdictList("sys_check_cycle"),
            ])
            .then(
                axios.spread(
                    (supplierType, toolsType, toolsClass, unit, cycle) => {
                        for (let item of this.selectItem) {
                            if (item.label === "工器具分类") {
                                for (let list of toolsClass.data) {
                                    const obj = {
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    };
                                    item.options.push(obj);
                                    this.toolsClass[list.dictValue] =
                                        list.dictLabel;
                                    this.toolsClass.options.push({
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    });
                                }
                            } else if (item.label === "工器具类型") {
                                for (let list of toolsType.data) {
                                    const obj = {
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    };
                                    item.options.push(obj);
                                    this.toolsType[list.dictValue] =
                                        list.dictLabel;
                                    this.toolsType.options.push({
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    });
                                }
                            }
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
                        if (this.$route.query.orderId) {
                            this.detailedList(this.$route.query.orderId);
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
            };
        },
        /** 信息查询 */
        getList() {
            this.loading = true;
            likeBatch(this.queryParams).then((res) => {
                this.infoList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 已有明细信息查询 */
        detailedList(orderId) {
            this.ining = true;
            detailedList(orderId).then((res) => {
                this.ining = false;
                this.list = res.data;
                for (let item of this.list) {
                    item.codeList = item.codeList.map((item) => {
                        return  item.inId;
                    });
                }
            });
        },
        // 表格多选框选中数据
        handleSelectionChange(selection) {
            // selection
            this.selectList = selection;
        },
        /** 添加附件按钮操作 */
        handleAdd() {
            this.open = true;
            this.$nextTick(() => {
                this.$refs.materialTable.clearSelection();
            });
        },
        /**确认 */
        confirm() {
            for (let item of this.list) {
                for (let index in this.selectList) {
                    if (item.toolsId === this.selectList[index].toolsId) {
                        this.selectList.splice(index, 1);
                    }
                }
            }
            this.list = this.list.concat(this.selectList);
            for (let item of this.list) {
                item.codeList = [];
                item.number = null;
            }
            this.open = false;
        },
        /** 提交按钮 */
        submit() {
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (this.list.length !== 0) {
                for (let item of this.list) {
                    if (!item.number) {
                        this.msgError("请填写出库数量");
                        return;
                    } else if (!reg.test(item.number)) {
                        this.msgError("出库数量请输入整数");
                        return;
                    } else if (item.number > item.maxNum) {
                        this.msgError("出库数量多于库存数量，请重新填写");
                        return;
                    }
                }
            }
            if (this.$route.query.orderId) {
                let list = JSON.parse(JSON.stringify(this.list));
                detailedAdd(list, this.$route.query.orderId).then((res) => {
                    if (res.data) {
                        this.msgSuccess("编辑成功");
                        this.$store.dispatch("tagsView/delView", this.$route);
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? "/light/assets/tools/outHouse"
                                    : "/wind/assets/tools/outHouse",
                        });
                    }
                });
            } else {
                if (this.list.length === 0) {
                    this.msgWarn("请添加附件");
                    return;
                }
                let list = JSON.parse(JSON.stringify(this.list));
                detailedAdd(list, "").then((res) => {
                    if (res.data) {
                        this.msgSuccess("添加成功");
                        this.$store.dispatch("tagsView/delView", this.$route);
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? "/light/assets/tools/outHouse"
                                    : "/wind/assets/tools/outHouse",
                        });
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            for (let index in this.list) {
                if (this.list[index].batchCode === row.batchCode) {
                    this.list.splice(index, 1);
                }
            }
        },
        //选中工器具
        handOpenCheck(row, column, index) {
            //之前已选中的
            this.rowIndex = index;
            this.codeList = row.codeList;
            this.codeTitle = row.toolsName
            getCodeList({ detailId: row.detailId }).then((res) => {
                if (res.data.length) {
                    let list = [];
                    res.data.map((item) => {
                        //该条信息下的编码表
                        list.push({ id: item.id, detailCode: item.detailCode });
                    });
                    this.codeListAll = list;
                } else {
                    this.codeListAll = [];
                }
                this.openCheck = true;
            });
        },
        /**确认选中 */
        confirmCode() {
            this.list[this.rowIndex].number = this.codeList.length;
            this.$set(this.list, this.rowIndex, this.list[this.rowIndex]);
            this.openCheck = false;
        },
        onChange(value) {
            this.list[this.rowIndex].codeList = value;
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.formFoot {
    padding: 10px;
    display: flex;
    justify-content: center;
}
</style>
