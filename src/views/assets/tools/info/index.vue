<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <top-search v-show="showSearch" :timeShow="false" :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" :getList="getList" :resetQuery="resetQuery"></top-search>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['assets:tools:info:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDeleteAll" :disabled="multiple" v-hasPermi="['assets:tools:info:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['assets:tools:info:import']">导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['assets:tools:info:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getInfoList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
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
            <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" />
            <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" width="80" />
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
            <el-table-column label="最低库存" prop="minNum" :show-overflow-tooltip="true" />
            <el-table-column label="最高库存" prop="maxNum" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:tools:info:edit']" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['assets:tools:info:remove']" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getInfoList" />
        <!-- 分页 -->

        <!-- 编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" width="700px" :close-on-click-modal="false" append-to-body :show-close="false" :title="title">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="工器具类型" prop="toolsType">
                            <el-select filterable v-model="form.toolsType" style="width: 100%">
                                <el-option v-for="item in toolsType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工器具分类" prop="toolsClass">
                            <el-select filterable v-model="form.toolsClass" style="width: 100%">
                                <el-option v-for="item in toolsClass.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="工器具编码" prop="toolsCode">
                            <el-input :disabled="title==='编辑'|| disabled" v-model="form.toolsCode" :placeholder="disabled?'工器具编码':'请输入工器具编码'" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工器具名称" prop="toolsName">
                            <el-input v-model="form.toolsName" placeholder="请输入工器具名称" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规格" prop="toolsSpecs">
                            <el-input v-model="form.toolsSpecs" placeholder="请输入规格" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号" prop="toolsModel">
                            <el-input v-model="form.toolsModel" placeholder="请输入型号" maxlength="20"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="toolsUnit">
                            <el-select filterable v-model="form.toolsUnit" style="width: 100%">
                                <el-option v-for="item in unit.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验周期" :prop="form.toolsType == 2 || !form.toolsType ? 'checkCycle':''">
                            <el-select filterable v-model="form.checkCycle" style="width: 100%" :disabled="form.toolsType==1">
                                <el-option v-for="item in cycle.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商" prop="supplierId">
                            <el-select filterable v-model="form.supplierId" style="width: 100%">
                                <el-option v-for="item in supplierType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最低库存" prop="minNum">
                            <el-input v-model.number="form.minNum" maxlength="15" placeholder="请输入最低库存" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="最高库存" prop="maxNum">
                            <el-input v-model.number="form.maxNum" maxlength="15" placeholder="请输入最高库存" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入内容" v-model="form.remark" show-word-limit maxlength="200">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑对话框 -->
        <!-- 导入组件 -->
        <excel-import prefix="工器具导入模板" dataName="工器具数据" uploadUrl="system/assetsTools/importData" templateUrl="system/assetsTools/importTemplate" ref="import" title="工器具导入" :getList="getList" />
        <!-- 导入组件 -->
    </div>
</template>

<script>
import {
    infoList,
    getdictList,
    infoAdd,
    infoDelete,
    infoUpdate,
    getAllSupplier,
} from "@/api/assets/tools/info";
import { getIsEnableCode } from "@/api/utils";
import topSearch from "@/views/components/TopSearch";
import excelImport from "@/views/components/ExcelImport";
import axios from "axios";
export default {
    name: "info",
    components: {
        topSearch,
        excelImport,
    },
    data() {
        return {
            pickerOptions: {
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
            //excelImport
            openImport: false,
            // 非多个禁用
            multiple: true,
            //删除列表
            listId: [],
            // table表格数据
            infoList: [],
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                name: null,
                classify: null,
                type: null,
                startTime: null,
                stopTime: null,
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
                minNum: [{ type: "number", message: "最低库存必须为数字" }],
                maxNum: [{ type: "number", message: "最高库存必须为数字" }],
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
        /**分页 */
        getInfoList() {
            this.loading = true;
            infoList(this.query).then((res) => {
                this.infoList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /**工器具编码获取 */
        getIsEnableCode() {
            getIsEnableCode(2).then((res) => {
                if (res.data) {
                    this.disabled = res.data;
                    this.rules.toolsCode[0].required = false;
                }
            });
        },
        // 表格多选框选中数据
        handleSelectionChange(selection) {
            selection.length === 0
                ? (this.multiple = true)
                : (this.multiple = false);
            this.listId = selection;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.form = {};
            this.resetForm("form");
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open = true;
            this.getIsEnableCode();
            this.title = "新增";
            this.form = {};
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.open = true;
            this.form = JSON.parse(JSON.stringify(row));
            this.title = "编辑";
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.disabled && !this.form.toolsCode) {
                        this.form["toolsCode"] = null;
                    } else {
                        if (!this.form.toolsCode) {
                            this.msgError("请将信息填写完整");
                            return;
                        }
                    }
                    if (this.form.minNum >= this.form.maxNum) {
                        return this.msgError("最低库存不得大于或等于最高库存");
                    }
                    if (this.title == "新增") {
                        infoAdd(this.form).then((res) => {
                            if (res.data) {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.form = {};
                                this.getInfoList();
                            }
                        });
                    } else {
                        infoUpdate(this.form, this.form.toolsId).then((res) => {
                            if (res.data) {
                                this.msgSuccess("编辑成功");
                                this.open = false;
                                this.form = {};
                                this.getInfoList();
                            }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除当前的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return infoDelete(row.toolsId);
                })
                .then(() => {
                    this.getInfoList();
                    this.msgSuccess("删除成功");
                });
        },
        /**批量删除 */
        handleDeleteAll() {
            let list = [];
            for (let item of this.listId) {
                list.push(item.toolsId);
            }
            this.$confirm("是否确认删除当前的所选的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return infoDelete(list);
                })
                .then(() => {
                    this.getInfoList();
                    this.msgSuccess("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/assetsTools/export",
                {
                    ...this.queryParams,
                },
                `工器具基本信息.xlsx`
            );
        },

        /**导入按钮操作 */
        handleImport() {
            this.$refs.import.open = true;
        },
    },
};
</script>
<style lang="scss" scoped>
</style>
