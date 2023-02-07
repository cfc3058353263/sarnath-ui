<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form ref="queryParams" :model="queryParams" :inline="true" :rules="rules">
            <el-form-item label="电站名称">
                <station-search ref="station" :queryParams="queryParams" stationId="stationId" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item label="编码名称">
                <el-input placeholder="请输入编码名称" clearable size="small" v-model="queryParams.name"  maxlength="50"/>
            </el-form-item>
            <el-form-item label="编码状态">
                <el-select placeholder="请输入编码状态" clearable size="small" v-model="queryParams.status">
                    <el-option v-for="(list, index) in codeStatus.options" :key="index" :label="list.label" :value="list.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="queryParams.stopTime" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:code:add']">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getCodeList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="codeList" @selection-change="handleSelectionChange">
            <el-table-column label="序号" prop="number" :show-overflow-tooltip="true" />
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="编码名称" prop="codeName" :show-overflow-tooltip="true" />
            <el-table-column label="编码规则" prop="preview" :show-overflow-tooltip="true" />
            <el-table-column label="状态" prop="codeStatus" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ codeStatus[scope.row.status] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="编码类型" prop="codeType" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ codeType[scope.row.codeType] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.createTime).format("YYYY-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="执行时间" prop="startTime">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.startTime).format("YYYY-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="停用时间" prop="stopTime">
                <template slot-scope="scope">
                    <span>{{
            scope.row.stopTime
              ? moment(scope.row.stopTime).format("YYYY-MM-DD")
              : null
          }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status === 2" size="mini" type="text" icon="el-icon-circle-close" @click="handleStop(scope.row)">停用</el-button>
                    <el-button v-if="scope.row.status === 3" size="mini" type="text" icon="el-icon-circle-check" @click="handlecheck(scope.row)">启用</el-button>
                    <el-button v-if="scope.row.status === 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" @pagination="getCodeList" />
        <!-- 分页 -->

        <!-- 编辑/新增对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" :close-on-click-modal="false" append-to-body :show-close="false" title="新增编码规范">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属电站" prop="stationId">
                            <station-search ref="station" :queryParams="form" stationId="stationId" systemId="systemId" style="width:100%"></station-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编码名称" prop="codeName">
                            <el-input v-model="form.codeName" placeholder="请输入编码名称" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编码类型" prop="codeType">
                            <el-select v-model="form.codeType" style="width: 100%">
                                <el-option v-for="item in codeType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="启用时间" prop="startTime">
                            <el-date-picker style="width: 100%" type="date" placeholder="选择日期时间" v-model="form.startTime" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- 编码信息 -->
                    <el-col v-for="(item, index) of form.ruleList" :key="index" :span="24">
                        <el-col :span="6">
                            <el-form-item :label="`组成${index + 1}`" prop="rule">
                                <el-select v-model="item.ruleType" style="width: 100%">
                                    <el-option v-for="item in groupType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="规则">
                                <el-input v-if="item.ruleType === 1" v-model="item.letter" maxlength="10" />
                                <!-- 字母规则 -->
                                <el-select v-if="item.ruleType === 2" v-model="item.numberType" style="width: 100%">
                                    <!-- 数字格式/时间格式选择  -->
                                    <el-option v-for="item in numberType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-if="item.ruleType === 3" v-model="item.special" style="width: 100%">
                                    <!--特殊字符 -->
                                    <el-option v-for="item in special.options" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item v-if="item.ruleType === 2 && item.numberType" :label="item.numberType === 1 ? '数字格式' : '时间格式'">
                                <el-input v-if="item.numberType === 1" v-model="item.number" type="number" oninput="if(value.length > 12) value=value.slice(0, 12)"></el-input>
                                <!-- 输入数字 -->
                                <el-select v-if="item.numberType === 2" v-model="item.date" style="width: 100%" disabled>
                                    <!-- 选择时间格式  -->
                                    <el-option v-for="item in dataType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item v-if="item.numberType === 1 && item.ruleType === 2" label="是否自增">
                                <el-select v-model="item.isAdd" style="width: 100%">
                                    <!-- 是否自增  -->
                                    <el-option v-for="item in addType" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="24">
                        <el-button type="success" @click="ruleAdd">+</el-button>
                        <el-button type="success" @click="ruledDelete">-</el-button>
                    </el-col>
                    <el-col :span="24">
                        <span>预览效果：{{ preview }}</span>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handPreview">预 览</el-button>
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑/新增对话框 -->
        <!-- 启用 -->
        <el-dialog width="500px" :visible.sync="openUpdate" :close-on-click-modal="false" append-to-body title="启用时间">
            <el-form ref="formUpdate" :rules="rules" :model="formUpdate" label-width="80px">
                <el-form-item label="启用时间" prop="startTime">
                    <el-date-picker style="width: 100%" type="date" placeholder="选择日期时间" v-model="formUpdate.startTime" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="codeStart">启 用</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 启用 -->
        <!-- 停用 -->
        <el-dialog width="500px" :visible.sync="openStop" :close-on-click-modal="false" append-to-body title="停用时间">
            <el-form ref="formStop" :rules="rules" :model="formStop" label-width="80px">
                <el-form-item label="停用时间" prop="stopTime">
                    <el-date-picker style="width: 100%" type="date" placeholder="选择日期时间" v-model="formStop.stopTime" :picker-options="pickerOptions" default-time="00:00:00">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="codeStop">停 用</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 停用 -->
    </div>
</template>

<script>
import {
    codeList,
    getdictList,
    codeAdd,
    codeStart,
    codeStop,
    codeDelete,
} from "@/api/system/code";
import topSearch from "@/views/components/TopSearch";
import StationSearch from "@/views/components/stationSearch";
import axios from "axios";
export default {
    name: "code",
    components: {
        topSearch,
        StationSearch,
    },
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.startTime),
                                "day"
                            ) < 0
                    );
                },
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            //topSearch
            inputItem: [
                { label: "编码名称", name: "name", placeholder: "请输入编码" },
            ],
            selectItem: [
                {
                    label: "编码状态",
                    options: [],
                    name: "status",
                },
            ],
            // table表格数据
            codeList: [],
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                name: null,
                status: null,
                stationId: null,
                startTime: null,
                stopTime: null,
            },
            query: {},
            // 编码状态
            codeStatus: { options: [] },
            // 编码类型
            codeType: { options: [] },
            // 组成类型
            groupType: [
                { value: 1, label: "字母" },
                { value: 2, label: "数字" },
                { value: 3, label: "特殊字符" },
            ],
            // 特殊字符
            special: { options: [] },
            // 数字格式
            numberType: [
                { value: 1, label: "数字序列" },
                { value: 2, label: "时间序列" },
            ],
            // 时间格式
            dataType: [{ value: "yyyyMMDD", label: "yyyyMMDD" }],
            // 是否自增
            addType: [
                { value: true, label: "自增" },
                { value: false, label: "非自增" },
            ],
            // 预览
            preview: null,
            // 表单参数
            form: {
                stationId: null,
                systemId: null,
            },
            // 启用参数
            formUpdate: {},
            // 停用参数
            formStop: {},
            // 编辑还是新增
            operaType: "",
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
            openUpdate: false,
            openStop: false,
            //查询校验
            searchRules: {
                stationId: [
                    {
                        type: "array",
                        required: true,
                        message: "请选择一个电站",
                        trigger: "change",
                    },
                ],
            },
            // 表单校验
            rules: {
                stationId: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                codeName: [
                    {
                        required: true,
                        message: "编码名称不能为空",
                        trigger: "blur",
                    },
                ],
                codeType: [
                    {
                        required: true,
                        message: "编码类型不能为空",
                        trigger: "blur",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "启动时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        axios
            .all([
                getdictList("sys_code_status"),
                getdictList("sys_char_special"),
                getdictList("sys_code_type"),
            ])
            .then(
                axios.spread((codeStatus, special, codeType) => {
                    for (let item of this.selectItem) {
                        if (item.label === "编码状态") {
                            for (let list of codeStatus.data) {
                                const obj = {
                                    value: list.dictValue,
                                    label: list.dictLabel,
                                };
                                item.options.push(obj);
                                this.codeStatus[list.dictValue] =
                                    list.dictLabel;
                                this.codeStatus.options.push({
                                    value: +list.dictValue,
                                    label: list.dictLabel,
                                });
                            }
                        }
                    }
                    for (let item of special.data) {
                        this.special[item.dictValue] = item.dictLabel;
                        this.special.options.push({
                            value: item.dictValue,
                            label: item.dictLabel,
                        });
                    }
                    for (let item of codeType.data) {
                        this.codeType[item.dictValue] = item.dictLabel;
                        this.codeType.options.push({
                            value: item.dictValue,
                            label: item.dictLabel,
                        });
                    }
                })
            );
    },
    methods: {
        /**重置 */
        resetQuery() {
            this.queryParams = {
                currentPage: 1,
                size: 15,
                name: null,
                status: null,
            };
        },
        /** 编码查询 */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.getCodeList();
                }
            });
        },
        getCodeList() {
            this.loading = true;
            codeList(this.query).then((res) => {
                this.codeList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        // 表格多选框选中数据
        handleSelectionChange(selection) {},
        // 取消按钮
        cancel() {
            this.open = false;
            this.openUpdate = false;
            this.openStop = false;
            this.resetForm("form");
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.open = true;
            this.preview = null;
            this.$nextTick(() => {
                this.form = {
                    stationId: null,
                    systemId: null,
                    ruleList: [
                        {
                            ruleType: null, // 组成类型
                            numberType: null, //  数字类型
                            letter: null, //  字母值
                            special: null, //特殊符号值
                            number: null, // 数字值
                            date: "yyyyMMDD", //时间值
                            isAdd: false, //是否自增
                        },
                    ],
                };
            });
        },
        /**添加组成部分 */
        ruleAdd() {
            this.form.ruleList.push({
                ruleType: null,
                numberType: null,
                letter: null,
                special: null,
                number: null,
                date: "yyyyMMDD",
                isAdd: false,
            });
        },
        /**删除组成部分 */
        ruledDelete() {
            this.form.ruleList.pop();
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.open = true;
            this.form = JSON.parse(JSON.stringify(row));
            this.operaType = "updata";
        },
        /**停用 */
        handleStop(row) {
            this.openStop = true;
            this.formStop = JSON.parse(JSON.stringify(row));
        },
        /**停用 */
        codeStop() {
            if (this.formStop.stopTime === "") {
                this.msgError("请输入停用日期");
                return;
            }
            codeStop(
                this.formStop.codeId,
                this.moment(this.formStop.stopTime).format("YYYY-MM-DD")
            ).then((res) => {
                if (res.data) {
                    this.getCodeList();
                    this.openStop = false;
                    this.msgSuccess("停用成功");
                } else {
                    this.msgError("停用失败");
                }
            });
        },
        /**启用 */
        handlecheck(row) {
            this.openUpdate = true;
            this.formUpdate = JSON.parse(JSON.stringify(row));
        },
        /**启用 */
        codeStart() {
            if (this.formUpdate.startTime === "") {
                this.msgError("请输入启用日期");
                return;
            }
            codeStart(
                this.formUpdate.codeId,
                this.moment(this.formUpdate.startTime).format("YYYY-MM-DD")
            ).then((res) => {
                if (res.data) {
                    this.getCodeList();
                    this.openUpdate = false;
                    this.msgSuccess("启用成功");
                } else {
                    this.msgError("启用失败");
                }
            });
        },
        /**预览 */
        handPreview() {
            const data = this.codeExamination();
            if (data) {
                this.preview = data.preview;
            }
        },
        /**保存 */
        submitForm: function () {
            let data = this.codeExamination();
            if (!data) {
                return;
            }
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    codeAdd(data).then((res) => {
                        if (res.data) {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        }
                    });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm(
                '是否确认删除电站编号为"' + row.codeId + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return codeDelete(row.codeId);
                })
                .then(() => {
                    this.getCodeList();
                    this.msgSuccess("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {},
        /** 编码审查方法 */
        codeExamination() {
            let data = {};
            let ruleList = this.form.ruleList;
            let codePrefix = ""; //前缀
            let codeSuffix = ""; //后缀
            let currentNo = ""; //自增
            let codeTime = ""; //时间
            let suffixTime = ""; //前缀加时间
            let currentIndex = null;
            let dataIndex = null;

            let isAdd = ruleList.filter((item) => {
                return (
                    item.isAdd && item.ruleType === 2 && item.numberType === 1
                );
            });
            if (isAdd.length > 1) {
                this.msgError("只能有一个自增");
                return;
            }
            for (let item of ruleList) {
                if (
                    item.isAdd &&
                    item.ruleType === 2 &&
                    item.numberType === 1
                ) {
                    currentNo = item.number;
                    break;
                } else if (item.ruleType === 1) {
                    if (!item.letter) {
                        this.msgError("请将内容填写完整");
                        return;
                    } else {
                        let reg = /^[A-Za-z]+$/gi;
                        if (!reg.test(item.letter)) {
                            this.msgError("字母规则只能输入字母");
                            return;
                        }
                    }
                    codePrefix = codePrefix + item.letter;
                    suffixTime = suffixTime + item.letter;
                } else if (item.ruleType === 2) {
                    if (item.numberType === 2) {
                        dataIndex++;
                        if (dataIndex > 1) {
                            this.msgError("只能有一个时间序列");
                            return;
                        }
                        codeTime = this.moment().format("YYYYMMDD");
                        suffixTime = suffixTime + codeTime;
                    } else {
                        if (!item.number) {
                            this.msgError("请将内容填写完整");
                            return;
                        } else {
                            let reg = /^[0-9]+$/gi;
                            if (!reg.test(item.number)) {
                                this.msgError("数字序列只能输入数字");
                                return;
                            }
                        }
                        codePrefix = codePrefix + item.number;
                        suffixTime = suffixTime + item.number;
                    }
                } else if (item.ruleType === 3) {
                    if (!item.special) {
                        this.msgError("请将内容填写完整");
                        return;
                    }
                    codePrefix = codePrefix + this.special[item.special];
                    suffixTime = suffixTime + this.special[item.special];
                }
            }
            for (let index in ruleList) {
                if (ruleList[index].isAdd) {
                    currentIndex = index;
                } else if (
                    currentIndex !== null &&
                    currentIndex < index &&
                    currentIndex !== ruleList.length - 1
                ) {
                    if (ruleList[index].ruleType === 1) {
                        if (!ruleList[index].letter) {
                            this.msgError("请将内容填写完整");
                            return;
                        } else {
                            let reg = /^[A-Za-z]+$/gi;
                            if (!reg.test(ruleList[index].letter)) {
                                this.msgError("字母规则只能输入字母");
                                return;
                            }
                        }
                        codeSuffix = codeSuffix + ruleList[index].letter;
                    } else if (ruleList[index].ruleType === 2) {
                        if (ruleList[index].numberType === 2) {
                            if (!ruleList[index].date) {
                                this.msgError("请将内容填写完整");
                                return;
                            }
                            codeSuffix = codeSuffix + ruleList[index].date;
                            this.msgError("自增之后不能添加时间序列");
                            return;
                        } else {
                            if (!ruleList[index].number) {
                                this.msgError("请将内容填写完整");
                                return;
                            } else {
                                let reg = /^[0-9]+$/gi;
                                if (!reg.test(ruleList[index].number)) {
                                    this.msgError("数字序列只能输入数字");
                                    return;
                                }
                            }
                            codeSuffix = codeSuffix + ruleList[index].number;
                        }
                    } else if (ruleList[index].ruleType === 3) {
                        if (!ruleList[index].special) {
                            this.msgError("请将内容填写完整");
                            return;
                        }
                        codeSuffix =
                            codeSuffix + this.special[ruleList[index].special];
                    }
                }
            }
            data = {
                stationId: this.form.stationId,
                systemId: this.form.systemId,
                codeId: null,
                codeName: this.form.codeName,
                codeType: this.form.codeType,
                codePrefix,
                codeSuffix,
                codeTime,
                codeStatus: null, //编码类型
                createTime: "",
                currentNo, //自增
                number: 0,
                remark: null,
                ruleText: null,
                seqFormat: null,
                seqStatus: 0,
                startTime: this.moment(this.form.startTime).format(
                    "YYYY-MM-DD"
                ), //启用时间
                status: 0,
                stopTime: null,
                updateTime: null,
                preview: suffixTime + currentNo + codeSuffix,
            };
            if (!currentNo) {
                this.msgError("请填写一个数字自增");
                return;
            }
            return data;
        },
        changeStart(date) {
            this.queryParams.stopTime = null;
        },
        reset() {
            this.queryParams = {
                currentPage: 1,
                size: 15,
                name: null,
                status: null,
                startTime: null,
                stopTime: null,
            };
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep input[type="number"] {
    -moz-appearance: textfield;
}
::v-deep input[type="number"]::-webkit-inner-spin-button,
::v-deep input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>