<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form ref="queryParams" :model="queryParams" :inline="true" :rules="searchRules">
            <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="queryParams.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small"
                                style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small" :picker-options="endTime"
                                style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['runningWind:reportDay:add']">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete"
                           :disabled="multiple"
                           v-if="false" v-hasPermi="['runningWind:reportDay:delete']">删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini"
                           v-hasPermi="['runningWind:reportDay:export']" @click="handleExport">导出
                </el-button>
            </el-col>
        </el-row>

        <!--  新增和编辑弹窗  -->
        <AddWindRunningDayDialog ref="AddWindRunningDayDialog"/>

        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="200"/>
            <el-table-column label="日报日期" prop="calendar" :show-overflow-tooltip="true" width="120"/>
            <el-table-column label="并网容量" prop="netInstallCapacity" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="天气情况" prop="actualWeather" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="上网电量(kWh)" prop="dayKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="单台风机平均发电量(kWh)" prop="wKwhPerFan" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="最小风速(m/s)" prop="wMinWind" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="最大风速(m/s)" prop="wMaxWind" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="平均风速(m/s)" prop="wAvgWind" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="最高负荷(MW)" prop="wMaxLoad" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日风机总发电量" prop="wFanTotalKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日集电线总发电量" prop="wLineTotalKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日下网电量" prop="wBuyNetKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日厂用电量" prop="wDayFactoryUseKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日厂用电率" prop="wFactoryUsePercent" :show-overflow-tooltip="true" width="100"/>

            <el-table-column label="月下网电量" prop="wBuyNetMonthKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="月厂用电量" prop="wMonthFactoryUseKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="月厂用电率" prop="wMonthFactoryUsePercent" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="月上网电量" prop="monthKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="月完成比" prop="monthCompletePercent" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="本年计划完成比" prop="contractCompletePercent" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="合同发电量" prop="contractKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="累计发电量" prop="totalKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="故障损失" prop="faultLoss" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="非故障损失" prop="notFaultLoss" :show-overflow-tooltip="true" width="100"/>


            <el-table-column label="运行状态" prop="submitStatusName" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.submitStatus === '1'" size="mini" type="text" icon="el-icon-edit"
                               @click="handleEdit(scope.row)" v-hasPermi="['runningWind:reportDay:edit']">编辑
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '2'" size="mini" type="text" icon="el-icon-message"
                               @click="handleSendMail(scope.row)" v-hasPermi="['runningWind:reportDay:send']">发送邮件
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleCheck(scope.row)"
                               v-hasPermi="['runningWind:reportDay:search']">查看
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '1'" size="mini" type="text" icon="el-icon-delete"
                               @click="handleDelete(scope.row)" v-hasPermi="['runningWind:reportDay:delete']">删除
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '1'" size="mini" type="text" icon="el-icon-plus"
                               @click="handleSubmit(scope.row)" v-hasPermi="['runningWind:reportDay:submit']">提交
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '2'" size="mini" type="text" icon="el-icon-message"
                               @click="handleDownload(scope.row)" v-hasPermi="['runningWind:reportDay:export']">下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

        <!-- 邮箱发送 -->
        <el-dialog style="margin-top:15vh" :close-on-press-escape="false" title="发送邮件" :visible.sync="emailOpen"
                   width="500px" :close-on-click-modal="false" append-to-body :show-close="false">
            <el-form ref="emailForm" :model="emailForm" label-width="80px" :rules="emailRules" @submit.native.prevent>
                <el-form-item label="邮箱地址" prop="mailTo">
                    <el-input v-model="emailForm.mailTo" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sendMail">发 送</el-button>
                <el-button @click="emailClose">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 邮箱发送 -->

    </div>
</template>

<script>
import AddWindRunningDayDialog from "@/views/components/OperationManagement/Wind/AddWindDayDataDialog";
import { sendDayDetail, sendMail } from "@/api/runing/runDaily/runDailyWind";
import stationCheckbox from "@/views/components/stationCheckbox";
import {getDayDataList, deleteDayData, submitDayData} from "@/api/runing/OperationDayData";

export default {
    name: "reportDayWind",
    components: {
        stationCheckbox,
        AddWindRunningDayDialog},
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
            //遮罩层
            loading: false,

            //邮件发送弹窗
            emailOpen: false,
            multiple: true,
            //展示数据列表
            dataList: [],
            // 邮件发送表单
            emailForm: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("yyyy-MM-01"),
                endTime: this.moment().format("yyyy-MM-DD"),
            },
            query:{},
            total:0,
            //搜索参数规则
            searchRules: {
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
            emailRules: {
                mailTo: [
                    {
                        required: true,
                        message: "邮箱地址不能为空",
                        trigger: "blur",
                    },
                    {
                        pattern:
                            /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/i,
                        message: "请输入正确的邮箱地址",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.stationIdList = [this.$store.getters.currentStation];
        //获取列表
        this.getList();
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        /**
         * 获取日报列表
         */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.loading = true;
            getDayDataList(this.query).then((res) => {
                this.loading = false;
                this.dataList = res.rows;
                this.total = res.total;
            });
        },
        /**
         * 点击搜索按钮操作
         */
        handleSearch() {
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
        /**
         * 点击重置按钮操作
         */
        resetQuery() {
            this.queryParams.startTime = this.moment().format("yyyy-MM-01");
            this.queryParams.endTime = this.moment().format("yyyy-MM-DD");
            this.getList();
        },
        /**时间选择 */
        changeDateListener(date) {
            this.queryParams.startTime = date[0];
            this.queryParams.endTime = date[1];
        },
        changeStart(date) {
            this.queryParams.endTime = null;
        },

        /**
         * 点击查看按钮操作
         */
        handleCheck(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + '/runningWind/reportDay/info',
                query: {
                    id: row.id,
                    contractId: row.contractId,
                    dateTime: row.calendar,
                },
            });
        },
        /**
         * 点击新增按钮操作
         */
        handleAdd() {
            this.$refs.AddWindRunningDayDialog.addDayReport("新增日报");
        },
        /**
         * 点击编辑
         */
        handleEdit(row) {
            this.$refs.AddWindRunningDayDialog.editDayReport("编辑日报", row);
        },

        /**
         * 点击删除按钮操作
         */
        handleDelete(row) {
            this.$confirm(
                "是否确认删除 " + row.calendar + " 日报数据?",
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return deleteDayData(row.id);
                })
                .then(() => {
                    this.msgSuccess("删除成功");
                    this.getList();
                })
                .catch((res) => {
                });
        },
        /**
         * 提交按钮操作
         */
        handleSubmit(row) {
            this.$confirm("是否确认提交?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return submitDayData(row.id);
                })
                .then(() => {
                    this.msgSuccess("提交成功");
                    this.getList();
                })
                .catch((res) => {
                });
        },
        /**
         * 点击导出按钮操作
         */
        handleExport() {
            this.download(
                "system/operationDayData/exportDayDataList",
                {
                    ...this.queryParams,
                },
                `日报.xlsx`
            );
        },
        /**
         *
         */
        handleDownload(row) {
            this.download(
                "system/operationPlanDayWind/exportDayReport",
                {
                    ...this.queryParams,
                    id: row.id,
                },
                `日报.xlsx`
            );
        },
        /**
         * 点击发送邮件按钮操作
         */
        handleSendMail(data) {
            this.emailOpen = true;
            this.emailForm = {};
            this.emailForm.id = data.id;
            this.emailForm.contractId = data.contractId;
            this.emailForm.dateTime = data.calendar;
        },
        /**
         * 点击邮件dialog 发送按钮操作
         */
        sendMail() {
            this.$refs.emailForm.validate((valid) => {
                if (valid) {
                    sendMail(this.emailForm.mailTo, this.emailForm.id).then(
                        (res) => {
                            this.emailOpen = false;
                            this.msgSuccess("发送成功");
                        }
                    );
                }
            });
        },
        /**
         * 点击邮件dialog 取消按钮操作
         */
        emailClose() {
            this.emailOpen = false;
        },
    },
};
</script>

<style scoped>
</style>
