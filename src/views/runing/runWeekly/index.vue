<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" :inline="true">
            <!-- <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="form.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker size="small" value-format="yyyy-MM-dd" v-model="form.endTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="weekNum" label="周数">
                <el-select v-model="form.weekNum">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['runing:runWeekly:download']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getListWeek"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="周报时间" prop="weekTitle" :show-overflow-tooltip="true" width="400" />
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="220" />
            <el-table-column label="规划装机(M)" prop="designPower" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="实际装机(M)" prop="actualPower" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="年度运行天数" prop="days" :show-overflow-tooltip="true" width="150" />
            <el-table-column label="合同发电量(万kWh)" prop="contractkWh" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="并网容量预计发电量（截止日期）(万kWh)" prop="foreNetDayToDate" :show-overflow-tooltip="true" width="300">
                <template slot-scope="scope">
                    <span>{{ scope.row.foreNetDayToDate.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="年实际发电量(万kWh)" prop="yearkWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.yearkWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="截止日年发电量完成比(%)" prop="progressToDate" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.progressToDate.toFixed(2) + "%"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="年度损失发电量(万kWh)" prop="yearTotalLosskWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.yearTotalLosskWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="本周经评发电量(万kWh)" prop="weekForecastkWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekForecastkWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="本周实际发电量(万kWh)" prop="weekKWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekKWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="周完成比例(%)" prop="weekProgress" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekProgress.toFixed(2) + "%"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="周故障损失发电量(万kWh)" prop="weekLosskWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekLosskWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="周非故障损失发电量(万kWh)" prop="weekNotLosskWh" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekNotLosskWh.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="周完成比例（含损失）(%)" prop="weekProgressContainLoss" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekProgressContainLoss.toFixed(2) + "%"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="预计日均辐照量(Wh/㎡)" prop="weekSDayForeRadiation" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekSDayForeRadiation.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="日均实际辐照量(Wh/㎡)" prop="weekSDayRadiation" :show-overflow-tooltip="true" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.weekSDayRadiation.toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownLoad(scope.row)">下载</el-button>
<!--                    <el-button size="mini" type="text" icon="el-icon-message" @click="handlesave(scope.row)">发送邮件</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getListWeek" />
        <!-- 邮箱发送 -->
        <el-dialog style="margin-top:15vh" :close-on-press-escape="false" title="发送邮件" :visible.sync="emailOpen" width="500px" :close-on-click-modal="false" append-to-body :show-close="false">
            <el-form ref="formEmail" :model="formEmail" label-width="80px" :rules="emailRules" @submit.native.prevent>
                <el-form-item label="邮箱地址" prop="mailAddress">
                    <el-input v-model="formEmail.mailAddress" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">发 送</el-button>
                <el-button @click="emailClose">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 邮箱发送 -->
    </div>
</template>
<script>
import { getWeekDataList } from "@/api/runing/runWeekly/runWeekly";
import stationCheckbox from "@/views/components/stationCheckbox";
import { sendMail } from "@/api/runing/runWeekly/runWeekly";

export default {
    name: "runWeekly",
    components: {
        stationCheckbox,
    },
    data() {
        return {
            week: [
                { label: "1", value: 1 },
                { label: "2", value: 2 },
                { label: "3", value: 3 },
                { label: "4", value: 4 },
                { label: "5", value: 5 },
            ],
            // stations: [], //所属电站
            form: {
                endTime: this.moment().format("YYYY-MM-DD"),
                weekNum: 1,
                pageNum: 1,
                pageSize: 15,
                stationIdList: [],
            },
            query: {},
            list: [],
            showSearch: true,
            loading: false,
            // 总条数
            total: 0,
            // 发送邮件form表单
            formEmail: {},
            // 发送邮件弹窗显示
            emailOpen: false,
            // 发送邮件校验规则
            emailRules: {
                mailAddress: [
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
            rules: {
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                weekNum: [
                    {
                        required: true,
                        message: "周数不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.form.stationIdList = [this.$store.getters.currentStation];
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.form.stationIdList = res;
        },
        getList() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.query = JSON.parse(JSON.stringify(this.form));
                    this.getListWeek();
                }
            });
        },
        getListWeek() {
            this.loading = true;
            getWeekDataList(this.query)
                .then((res) => {
                    this.loading = false;
                    this.list = res.data.rows;
                    this.total = res.data.total;
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        /**下载 */
        handleDownLoad(row) {
            this.download(
                "system/operationPlanDay/exportWeek",
                {
                    ...this.form,
                    id: row.id,
                },
                `周报.xlsx`
            );
        },
        /**查看 */
        handleWeekSee(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/runing/runWeekly/info",
                query: {
                    stationId: row.stationId,
                    startTime: this.moment(row.weekStartTime).format("YYYY-MM-DD"),
                    endTime: this.moment(row.weekEndTime).format("YYYY-MM-DD"),
                },
            });
        },
        /**清空结束时间 */
        getStartTime() {
            this.form.endTime = null;
        },
        /**导出 */
        handleExport() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.download(
                        "system/operationReportData/exportWeek",
                        {
                            ...this.form,stationIds:this.form.stationIdList
                        },
                        `周报.xlsx`
                    );
                }
            });
        },
        /**发送邮件 */
        handlesave(row) {
            this.emailOpen = true;
            this.formEmail = {
                startTime: row.weekStartTime,
                endTime: row.weekEndTime,
                stationId: row.stationId,
            };
        },
        /**发送 */
        save() {
            this.$refs.formEmail.validate((valid) => {
                if (valid) {
                    sendMail(this.formEmail).then((res) => {
                        this.emailOpen = false;
                        this.msgSuccess("发送成功");
                    });
                }
            });
        },
        /**取消 */
        emailClose() {
            this.emailOpen = false;
            this.resetForm("formEmail");
        },
    },
};
</script>
<style scoped>
</style>

