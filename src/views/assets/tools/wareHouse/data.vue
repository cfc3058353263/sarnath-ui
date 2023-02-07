<template>
    <div class="app-container">
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['assets:tools:wareHouse:add']">添加工器具</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="submit" v-hasPermi="['assets:tools:wareHouse:add']">提交</el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="ining" :data="list">
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
            <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" width="80" />
            <el-table-column label="单位" prop="toolsUnit" :show-overflow-tooltip="true" width="80">
                <template slot-scope="scope">
                    <span>{{ unit[scope.row.toolsUnit] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="有效期" prop="checkCycle" :show-overflow-tooltip="true" width="80">
                <template slot-scope="scope">
                    <span>{{ cycle[scope.row.checkCycle] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierId" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ supplierType[scope.row.supplierId] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="送检时间" prop="checkTime" :show-overflow-tooltip="true" width="250">
                <template slot-scope="scope">
                    <el-date-picker v-if="scope.row.toolsType == 2" v-model="scope.row.checkTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="checkTime" @change="checkTimeChange(scope.row)">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="下次送检时间" prop="nextCheckTime" :show-overflow-tooltip="true" width="250">
                <template slot-scope="scope">
                    <el-date-picker v-if="scope.row.toolsType == 2" v-model="scope.row.nextCheckTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="nextCheckTime">
                    </el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="入库数量" prop="number" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.number" oninput="if(value.length > 4) value=value.slice(0, 4)" onkeyup="value=value.replace(/[^\d]/g,'')" placeholder=""></el-input>
                </template>
            </el-table-column>
            <el-table-column label="工器具编码" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAddCode(scope.row,scope.$index)">添加编码</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" :close-on-click-modal="false" append-to-body title="选择工器具" width="1400px">
            <!-- 查询条件 -->
            <top-search :queryParams="queryParams" :timeShow="false" :inputItem="inputItem" :selectItem="selectItem" :getList="getList" :resetQuery="resetQuery"></top-search>
            <!-- 查询条件 -->
            <!-- 按钮.... -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="confirm">确认</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getInfoList"></right-toolbar>
            </el-row>
            <!-- 按钮.... -->
            <!-- table -->
            <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange" :row-key="(row) => row.toolsCode" ref="materialTable">
                <el-table-column type="selection" :reserve-selection="true" width="55" align="center" />
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
                <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="单位" prop="toolsUnit" :show-overflow-tooltip="true" width="80">
                    <template slot-scope="scope">
                        <span>{{ unit[scope.row.toolsUnit] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效期" prop="checkCycle" :show-overflow-tooltip="true" width="80">
                    <template slot-scope="scope">
                        <span>{{ cycle[scope.row.checkCycle] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" prop="supplierId" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ supplierType[scope.row.supplierId] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最低库存" prop="minNum" :show-overflow-tooltip="true" />
                <el-table-column label="最高库存" prop="maxNum" :show-overflow-tooltip="true" />
            </el-table>
            <!-- table -->
            <!-- 分页 -->
            <pagination v-show="total > 0" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getInfoList" />
            <!-- 分页 -->
        </el-dialog>
        <!-- 编辑对话框 -->
        <!-- 工器具编码 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="addCodeOpen" :close-on-click-modal="false" append-to-body title="添加工器具编码" width="600px" >
            <el-form>
                <el-form-item :required="true" :label="codeTitle+'编码：'" v-for="(item,index) of addCodeList" :key="index" label-width="260px">
                    <el-input v-model="addCodeList[index]" placeholder="请输入工器具编码" maxlength="50"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="AddConfirm">保 存</el-button>
                <el-button @click="addCodeOpen = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 工器具编码 -->
    </div>
</template>

<script>
import { infoList, getAllSupplier } from "@/api/assets/tools/info";
import {
    detailedList,
    getdictList,
    detailedAdd,
} from "@/api/assets/tools/wareHouse";
import { getIsEnableCode } from "@/api/utils";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
export default {
    name: "wareInfo",
    components: {
        topSearch,
    },
    data() {
        return {
            checkTime: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            nextCheckTime: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            //topSearch
            inputItem: [
                {
                    label: "工器具名称",
                    name: "name",
                    placeholder: "请输入工器具名称",
                },
            ],
            selectItem: [
                {
                    label: "工器具类型",
                    options: [],
                    name: "type",
                },
                {
                    label: "工器具分类",
                    options: [],
                    name: "classify",
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
                name: null,
                classify: null,
                type: null,
            },
            query: {},
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
            // 是否显示弹出层
            open: false,
            //编码名称
            codeTitle:"",
            // 添加工器具编码
            addCodeList: null,
            // 是否显示编码弹出层
            addCodeOpen: false,
            // 当前编码弹出窗口的下标
            codeIndex: null,
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
                name: null,
                classify: null,
                type: null,
            };
        },
        /** 信息查询 */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.getInfoList();
        },
        getInfoList() {
            this.loading = true;
            infoList(this.query).then((res) => {
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
                        return item.detailCode;
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
            this.open = false;
        },
        /** 提交按钮 */
        submit() {
            let reg = /^[0-9]*[1-9][0-9]*$/;
            if (this.list.length !== 0) {
                for (let item of this.list) {
                    if (!item.number) {
                        this.msgError("请填写入库数量");
                        return;
                    } else if (!reg.test(item.number)) {
                        this.msgError("入库数量请输入整数");
                        return;
                    } else if (this.moment().diff(this.moment(), "days") > 0) {
                        this.msgError("下次检验时间不能早于当前时间");
                        return;
                    } else if (item.number < item.minNum) {
                        this.msgError(
                            "入库数量不得少于最少库存,请检查重新填写"
                        );
                        return;
                    } else if (item.number > item.maxNum) {
                        this.msgError(
                            "入库数量不得大于最大库存,请检查重新填写"
                        );
                        return;
                    } else if (item.number && !item.codeList) {
                        this.msgError("请将安全工具编码填写完整");
                        return;
                    } else if (item.number != item.codeList.length) {
                        this.msgError("安全工具编码数与入库数不致");
                        return;
                    }
                    for (let number of item.codeList) {
                        if (!number) {
                            this.msgError("请将安全工具编码填写完整");
                            return;
                        }
                    }
                }
            }
            if (this.$route.query.orderId) {
                detailedAdd(this.list, this.$route.query.orderId).then(
                    (res) => {
                        if (res.data) {
                            this.msgSuccess("编辑成功");
                            this.$store.dispatch(
                                "tagsView/delView",
                                this.$route
                            );
                            this.$router.push({
                                path:
                                    this.$store.getters.currentSystem == 1
                                        ? "/light/assets/tools/wareHouse"
                                        : "/wind/assets/tools/wareHouse",
                            });
                        }
                    }
                );
            } else {
                if (this.list.length === 0) {
                    this.msgWarn("请添加附件");
                    return;
                }
                detailedAdd(this.list, "").then((res) => {
                    if (res.data) {
                        this.msgSuccess("添加成功");
                        this.$store.dispatch("tagsView/delView", this.$route);
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? "/light/assets/tools/wareHouse"
                                    : "/wind/assets/tools/wareHouse",
                        });
                    }
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            for (let index in this.list) {
                if (this.list[index].toolsId === row.toolsId) {
                    this.list.splice(index, 1);
                }
            }
        },
        /**最近一次检验时间选择 */
        checkTimeChange(row, date) {
            let checkTime = row.checkTime;
            let checkCycle = row.checkCycle;
            switch (checkCycle) {
                case "1":
                    row.nextCheckTime = this.moment(checkTime)
                        .add(1, "weeks")
                        .format("yyyy-MM-DD HH:mm:ss");
                    break;
                case "2":
                    row.nextCheckTime = this.moment(checkTime)
                        .add(1, "months")
                        .format("yyyy-MM-DD HH:mm:ss");
                    break;
                case "3":
                    row.nextCheckTime = this.moment(checkTime)
                        .add(3, "months")
                        .format("yyyy-MM-DD HH:mm:ss");
                    break;
                case "4":
                    row.nextCheckTime = this.moment(checkTime)
                        .add(6, "months")
                        .format("yyyy-MM-DD HH:mm:ss");
                    break;
                case "5":
                    row.nextCheckTime = this.moment(checkTime)
                        .add(1, "years")
                        .format("yyyy-MM-DD HH:mm:ss");
                    break;
            }
        },
        /**添加工器具编码 */
        handleAddCode(row, index) {
            this.codeIndex = index;
            this.addCodeList = row.codeList;
            this.codeTitle = row.toolsName;
            if (row.number) {
                if (!row.codeList || row.codeList.length === 0) {
                    // row.codeList = new Array(row.number);
                    this.addCodeList = row.codeList = new Array(row.number);
                } else {
                    if (row.number > row.codeList.length) {
                        row.codeList.push(
                            ...new Array(row.number - row.codeList.length)
                        );
                        this.addCodeList = row.codeList;
                    } else if (row.number < row.codeList.length) {
                        row.codeList.splice(row.number);
                        this.addCodeList = row.codeList;
                    }
                }
            } else {
                this.addCodeList = row.codeList = [];
            }
            // }
            this.addCodeOpen = true;
        },
        /**确认工器具编码 */
        AddConfirm() {
            for (let item of this.addCodeList) {
                if (!item) {
                    return this.msgError("请将工器具编码填写完整");
                }
            }
            for (let index in this.addCodeList) {
                if (
                    this.addCodeList.indexOf(this.addCodeList[index]) != index
                ) {
                    return this.msgError("编码不能重复添加");
                }
            }
            this.addCodeOpen = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>