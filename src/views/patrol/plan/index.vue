<template>
    <div class="app-container">
        <!--计划数据-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item label="计划名称" prop="planName">
                <el-input v-model="queryParams.planName" placeholder="请输入计划名称" clearable size="small" @keyup.enter.native="handleQuery" maxlength="50" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small">
                    <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="dateRange[0]" size="small" @change="changeStart" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="dateRange[1]" size="small" :picker-options="endTime" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            <!-- </el-row> -->
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['patrol:plan:add']">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="handleEnable" :disabled="multiple" v-hasPermi="['patrol:plan:submit']">提交
                </el-button>
            </el-col>

            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <!-- <el-table-column label="序号" type="index" width="50" align="center"></el-table-column> -->
            <el-table-column label="巡检计划编号" key="planCode" prop="planCode" :show-overflow-tooltip="true" />
            <el-table-column label="计划名称" key="planName" prop="planName" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span style="padding-right:5px">{{ scope.row.planName }}</span>
                    <el-tag type="primary" v-if="scope.row.templateId!=null" disable-transitions>案</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="设备类型" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
            <el-table-column label="计划开始时间" key="startDate" prop="startDate" :show-overflow-tooltip="true" />
            <el-table-column label="计划结束时间" key="endDate" prop="endDate" :show-overflow-tooltip="true" />

            <el-table-column label="巡检周期" key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />

            <el-table-column label="状态" key="statusName" prop="statusName" />

            <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="scope.row.status==1" v-hasPermi="['patrol:plan:edit']">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDesigner(scope.row)" v-if="scope.row.templateId==null" v-hasPermi="['patrol:plan:editform']">表单设计
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['patrol:plan:info']">查看
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status==1" @click="handleDelete(scope.row)" v-hasPermi="['patrol:plan:remove']">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        <!-- 选择对话框 -->
        <el-dialog class="selectD" :visible.sync="dialogVisible" width="400px" :show-close="false" style="text-algin:center" custom-class="centerClass" append-to-body>
            <el-button type="success" @click="selectPlan(1)" style="margin:-20px 10px 10px 10px">选择模板</el-button>
            <el-button type="primary" @click="selectPlan(2)" style="margin:-20px 10px 10px 10px">新建计划</el-button>
        </el-dialog>

        <!-- 选择方案弹窗 -->
        <searchTemp @cancelTemp="cancelTemp" @selectTemp="selectTemp" :open="openTemp"></searchTemp>
        <!-- 查看详情弹窗 -->
        <!-- <planinfo @cancelInfo="cancelInfo" :planId="planId" @selectTemp="selectTemp" :open="openInfo"></planinfo> -->

        <el-dialog title="计划详情" :visible.sync="openInfo" center width="70%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <div style="width:100%">
                <el-tabs type="border-card" v-model="activeTab">
                    <el-tab-pane label="计划内容" name="1">
                        <div class="step1">
                            <el-form ref="forminfo" :model="forminfo" :rules="rules" label-width="150px">
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="编号" prop="planCode">
                                            <el-input v-model="forminfo.planCode" placeholder="编号" :disabled="true" maxlength="50" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="巡检计划名称" prop="planName">
                                            <el-input v-model="forminfo.planName" placeholder="巡检计划名称" maxlength="30" :disabled="true" />
                                        </el-form-item>
                                    </el-col>

                                </el-row>

                                <el-row>
                                    <el-col :span="12">

                                        <el-form-item label="计划开始时间" prop="startDate">
                                            <el-date-picker style="width:100%" :disabled="true" v-model="forminfo.startDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择开始时间"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="计划结束时间" prop="endDate">
                                            <el-date-picker style="width:100%" :disabled="true" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="forminfo.endDate" type="date" placeholder="选择结束时间"></el-date-picker>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                                <el-row>
                                    <el-col :span="12">

                                        <el-form-item label="巡检周期" prop="startDate">
                                            <el-input v-model="forminfo.cycleName" placeholder="巡检周期" maxlength="30" :disabled="true" />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="周期巡检次数" prop="endDate">
                                            <el-input v-model="forminfo.number" placeholder="周期巡检次数" maxlength="30" :disabled="true" />
                                        </el-form-item>
                                    </el-col>

                                </el-row>

                            </el-form>
                        </div>

                        <div class="step2">
                            <div class="tag-group" style="padding:10px">
                                <span class="tag-group__title">设备类型：</span>
                                <el-tag :key="forminfo.deviceTypeName" effect="dark">
                                    {{ forminfo.deviceTypeName }}
                                </el-tag>
                            </div>

                            <div style="margin-top:20px;margin-left:0px">
                                <el-table v-loading="loadinginfo" :data="deviceList">
                                    <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                                    <el-table-column width="150" label="设备编码" key="deviceCode" prop="deviceCode" />
                                    <el-table-column label="设备名称" key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
                                    <el-table-column label="规格" key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
                                    <el-table-column label="型号" key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
                                    <el-table-column label="供应商" key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
                                    <el-table-column label="所属电站" key="stationName" prop="stationName" width="160">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="巡检表单" name="2">
                        <form-create v-model="formModel" :rule="formRule" :option="formOption"></form-create>
                    </el-tab-pane>

                </el-tabs>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInfo">关 闭</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="150px">

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="巡检计划名称" prop="planName">
                            <el-input v-model="form.planName" placeholder="巡检计划名称" maxlength="30" style="width:100%" :disabled="form.disable" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类型" prop="deviceType">
                            <el-select style="width:100%" :disabled="form.disable" filterable v-model="form.deviceType" placeholder="设备类型" clearable size="small">
                                <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="周期最短时间(天)" prop="minNumber">
                            <el-input-number v-model="form.minNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="周期最长时间(天)" prop="maxNumber">
                            <el-input-number v-model="form.maxNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 表单弹窗 -->
        <designer ref="refdes" @cancel="cancelDesigner" :title="title" :currentObj="currentObj" @save="saveDesigner" :open="openDesigner"></designer>
    </div>
</template>

<script>
import Vue from "vue";
import {
    listData,
    add,
    update,
    updateForm,
    removeData,
    getInfo,
    updateStatus,
    getTmpInfo,
} from "@/api/patrol/plan";
import searchTemp from "./searchTemp";
import planinfo from "./info";
import designer from "@/views/components/FormDesigner/designer";
import formCreate from "@form-create/element-ui";
import stationCheckbox from "@/views/components/stationCheckbox";

Vue.use(formCreate);
export default {
    name: "plan1",
    components: { searchTemp, planinfo, designer, stationCheckbox },
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(self.moment(self.dateRange[0]), "day") < 0
                    );
                },
            },
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 选中的巡检计划的状态
            selectStatuss: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            openDesigner: false,
            // 总条数
            total: 0,
            // 用户表格数据
            dataList: null,
            detailList: [],
            // 日期范围
            dateRange: [],
            dateTime: [],
            // 弹出层标题
            title: "",
            deviceTypeOptions: [], //设备类型
            statusOptions: [], //状态枚举
            // 是否显示弹出层
            open: false,
            openTemp: false, //选择方案弹窗
            openInfo: false,
            dialogVisible: false,
            // 表单参数
            form: {},
            currentObj: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                planName: undefined,
                deviceType: undefined,
                status: undefined,
                stationIds: [],
            },
            query: {},
            inputVisible: false,
            inputValue: "",
            planId: undefined,
            forminfo: {},
            loadinginfo: true,
            deviceList: [],
            tmpInfo: {},
            activeTab: "1",
            formModel: {},
            formRule: [],
            formOption: {},
            // 表单校验
            rules: {
                // planName: [
                //     {
                //         required: true,
                //         message: "计划名称不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // deviceType: [
                //     {
                //         required: true,
                //         message: "设备类型不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // cycle: [
                //     {
                //         required: true,
                //         message: "巡检周期不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // number: [
                //     {
                //         required: true,
                //         message: "巡检周期次数不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // minNumber: [
                //     {
                //         required: true,
                //         message: "周期最短时间(天)不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // maxNumber: [
                //     {
                //         required: true,
                //         message: "周期最长时间(天)不能为空",
                //         trigger: "blur",
                //     },
                // ],
                stationIds: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
        this.$nextTick(() => {
            this.handleQuery();
        });
        // this.handleQuery()
        // 根据systemId获取对应的字典列表
        if (this.$store.getters.currentSystem == 1) {
            //设备类型
            this.getDicts("sys_device_type").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        } else {
            //设备类型
            this.getDicts("sys_device_type_wind").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        }
        //状态枚举
        this.getDicts("sys_plan_status").then((response) => {
            this.statusOptions = response.data;
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            if (this.dateTime[0] == null || this.dateTime[1] == null) {
                this.dateTime = [];
            }
            listData(this.addDateRange(this.query, this.dateTime)).then(
                (response) => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        cancelDesigner() {
            this.openDesigner = false;
            this.currentObj = {};
        },

        // 表单重置
        reset() {
            this.form = {};
            this.resetForm("form");
            this.detailList = [];
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.query = Object.assign({}, this.queryParams);
            this.dateTime = JSON.parse(JSON.stringify(this.dateRange));
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
            // this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.dateRange = [];
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.selectStatuss = selection.map((item) => item.status);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            // var self = this;
            // this.reset();
            this.dialogVisible = true;
            // this.title = "添加计划";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            var self = this;
            if (row.templateId) {
                this.$router.push({
                    path:
                        this.$store.getters.routerPrefix +
                        "/patrol/plan/selectTemp",
                    query: { tmpid: row.templateId, id: row.id },
                });
            } else {
                this.$router.push({
                    path:
                        this.$store.getters.routerPrefix +
                        "/patrol/plan/selectNew",
                    query: { id: row.id },
                });
            }
        },
        handleInfo(row) {
            var self = this;
            self.planId = row.id;
            self.openInfo = true;
            self.title = "查看计划";
            self.getInfoData(row.id);
        },

        /**启用计划 */
        handleEnable(row) {
            const selectIds = row.id || this.ids;
            const selectStatusList = row.status || this.selectStatuss;
            for (let i in selectStatusList) {
                if (selectStatusList[i] != 1) {
                    this.msgWarn("请选择新建状态的巡检计划！");
                    return;
                }
            }
            var params = new URLSearchParams();
            params.append("ids", selectIds);
            params.append("type", 2);
            updateStatus(params).then(() => {
                this.getList();
                this.msgSuccess("提交成功");
            });
        },

        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.form.methods = this.detailList;
                    if (this.form.id != undefined) {
                        update(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        add(this.form).then((response) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        selectPlan(type) {
            //1 模板，2计划
            if (type == 1) {
                this.dialogVisible = false;
                this.openTemp = true;
            } else {
                //跳转新建
                this.$router.push({
                    path:
                        this.$store.getters.routerPrefix +
                        "/patrol/plan/selectNew",
                });
            }
        },
        selectTemp(obj) {
            this.openTemp = false;
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/patrol/plan/selectTemp",
                query: { tmpid: obj.id },
            });
        },
        cancelTemp() {
            this.openTemp = false;
        },
        cancelInfo() {
            this.openInfo = false;
            this.formModel = {};
            this.formRule = [];
            this.formOption = {};
        },

        /** 删除按钮操作 */
        handleDelete(row) {
            const id = row.id || this.ids;
            this.$confirm(
                '是否确认删除计划名称为"' + row.planName + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return removeData(id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
        handleClose(tag) {
            this.detailList.splice(this.detailList.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            var self = this;
            let inputValue = this.inputValue;
            if (inputValue) {
                this.detailList.push({
                    mNo: (self.detailList.length || 0) + 1,
                    mName: inputValue,
                });
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        /** 保存表单*/
        saveDesigner(obj) {
            updateForm(obj).then((response) => {
                this.msgSuccess("修改成功");
                this.openDesigner = false;
                this.currentObj = {};
            });
        },
        handleDesigner(row) {
            var self = this;
            self.currentObj = row;
            if (self.currentObj.status == 1) {
                self.currentObj.isSave = true;
            } else {
                self.currentObj.isSave = false;
            }

            self.openDesigner = true;

            self.title = "【" + row.planName + "】 表单设计";
            //调用子页面
            self.$refs.refdes.getInfoData(row.id, 1);
        },

        /** 查询计划详情 */
        getInfoData(id) {
            var self = this;
            self.loadinginfo = true;
            getInfo(id).then((response) => {
                self.forminfo = response.data;
                self.deviceList = response.deviceList;
                self.formRule =
                    formCreate.parseJson(self.forminfo.formRule) || [];
                self.formOption =
                    formCreate.parseJson(self.forminfo.formOption) || {};

                if (self.formOption) {
                    self.formOption.submitBtn = false;
                }

                if (self.forminfo.templateId) {
                    //查询方案信息
                    self.getTmpInfoData(self.forminfo.templateId);
                }
                self.loadinginfo = false;
            });
        },
        /** 查询方案详情 */
        getTmpInfoData(id) {
            var self = this;
            self.loadinginfo = true;
            getTmpInfo(id).then((response) => {
                self.tmpInfo = response.data;
                // if(self.tmpInfo.formRule){
                //   self.formRule=formCreate.parseJson(self.tmpInfo.formRule);
                // }
                // if(self.tmpInfo.formOption){
                //   self.formOption=formCreate.parseJson(self.tmpInfo.formOption);
                // }
                self.form.cycle = self.tmpInfo.cycle;
                self.form.cycleName = self.tmpInfo.cycleName;
                self.form.number = self.tmpInfo.number;
                self.loadinginfo = false;
            });
        },
        changeStart(date) {
            this.$set(this.dateRange, 1, null);
        },
    },
};
</script>
<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.box-card {
    width: 100%;
    background-color: #f2f6fc;
}

.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.selectD {
    text-align: center;
}

.step1 {
    text-align: center;
    width: 600px;
    margin: 0 auto;
}

.step2 {
    width: 80%;
    margin: 0 auto;
}

.box-card {
    width: 100%;
    background-color: #f2f6fc;
}
</style>
