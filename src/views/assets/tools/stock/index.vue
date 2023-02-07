<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <top-search v-show="showSearch" :timeShow="false" :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" :getList="getList" :resetQuery="resetQuery"></top-search>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
         <el-row :gutter="10" class="mb8">
               <!-- 按钮.... -->
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" pageSize="mini" @click="handleExport" v-hasPermi="['assets:tools:stock:export']">导出</el-button>
          </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getStockList"></right-toolbar>
        </el-row> 
      
        <!-- table -->
        <el-table v-loading="loading" :data="infoList">
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
            <el-table-column label="库存数量" prop="repertory" :show-overflow-tooltip="true" />
            <el-table-column label="最低库存" prop="minNum" :show-overflow-tooltip="true" />
            <el-table-column label="最高库存" prop="maxNum" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button pageSize="mini" type="text" icon="el-icon-search" v-hasPermi="['assets:tools:stock:check']" @click="handleDetails(scope.row)">查看</el-button>
                    <!-- <el-button pageSize="mini" type="text" icon="el-icon-edit-outline" v-hasPermi="['assets:tools:stock:edit']" @click="handleTest(scope.row)">检测登记</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getStockList" />
        <!-- 分页 -->

        <!-- 编辑对话框 -->
        <el-dialog :visible.sync="open" :close-on-click-modal="false" append-to-body :title="title">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="工器具类型" prop="toolsType">
                            <el-select v-model="form.toolsType" style="width: 100%">
                                <el-option v-for="item in toolsType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工器具分类" prop="toolsClass">
                            <el-select v-model="form.toolsClass" style="width: 100%">
                                <el-option v-for="item in toolsClass.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工器具编码" prop="toolsCode">
                            <el-input :disabled="disabled" v-model="form.toolsCode" placeholder="请输入工器具编码" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="工器具名称" prop="toolsName">
                            <el-input v-model="form.toolsName" placeholder="请输入工器具名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格" prop="toolsSpecs">
                            <el-input v-model="form.toolsSpecs" placeholder="请输入规格" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号" prop="toolsModel">
                            <el-input v-model="form.toolsModel" placeholder="请输入型号" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="toolsUnit">
                            <el-select v-model="form.toolsUnit" style="width: 100%">
                                <el-option v-for="item in unit.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="检验周期" prop="checkCycle">
                            <el-select v-model="form.checkCycle" style="width: 100%">
                                <el-option v-for="item in cycle.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商" prop="supplierId">
                            <el-select v-model="form.supplierId" style="width: 100%">
                                <el-option v-for="item in supplierType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最低库存" prop="minNum">
                            <el-input v-model="form.minNum" placeholder="请输入最低库存" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最高库存" prop="maxNum">
                            <el-input v-model="form.maxNum" placeholder="请输入最高库存" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入内容" v-model="form.remark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="dialog-footer">
                            <el-button type="primary" @click="submitForm">保 存</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 编辑对话框 -->
    </div>
</template>

<script>
import {
    stockList,
    getdictList,
    infoAdd,
    infoDelete,
    infoUpdate,
} from "@/api/assets/tools/stock";
import { getAllSupplier } from "@/api/assets/tools/info";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
export default {
    name: "info",
    components: {
        topSearch,
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
            // table表格数据
            infoList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                name: null,
                classify: null,
                type: null,
                startTime:null,
                stopTime:null
            },
            query:{},
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
                pageNum: 1,
                pageSize: 15,
                name: null,
                classify: null,
                type: null,
            };
        },
        /** 信息查询 */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams))
            this.getStockList()
        },
        /**分页 */
        getStockList(){
            this.loading = true;
            stockList(this.query).then((res) => {
                this.infoList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.form = {};
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open = true;
            this.title = "新增";
        },
        /** 详情按钮操作 */
        handleDetails(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/assets/stock/data",
                query: {
                    row: JSON.stringify(row),
                    // 供应商类型
                    supplierType: JSON.stringify(this.supplierType),
                    //工器具类型
                    toolsType: JSON.stringify(this.toolsType),
                    //工器具分类
                    toolsClass: JSON.stringify(this.toolsClass),
                    //单位
                    unit: JSON.stringify(this.unit),
                    //周期
                    cycle: JSON.stringify(this.cycle),
                },
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
                        this.getStockList();
                    }
                });
            } else {
                infoUpdate(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("编辑成功");
                        this.open = false;
                        this.form = {};
                        this.getStockList();
                    }
                });
            }
        },
        /** 登记按钮操作 */
        handleTest(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + '/assets/stock/test',
                query: {
                    toolsId: row.toolsId,
                },
            });
        },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/assetsTools/exportLedger',
        {
          ...this.queryParams,
        },
        `工器具盘点_${new Date().getTime()}.xlsx`
      )
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
