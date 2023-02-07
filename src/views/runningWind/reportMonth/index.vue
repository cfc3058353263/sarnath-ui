<template>
    <div class="app-container">
        <el-form ref="form" :model="queryParams" :inline="true" :rules="rules" v-if="showSearch">
            <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="queryParams.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" type="month" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" type="month" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" v-hasPermi="['runningWind:reportMonth:export']" @click="handleExport">导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="250">
            </el-table-column>
            <el-table-column label="月份" prop="monthTitle" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="月发电量(kWh)" prop="monthKwh" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="平均风速" prop="avgWind" :show-overflow-tooltip="true" />
            <el-table-column label="下网电量" prop="buykWh" :show-overflow-tooltip="true" />
            <el-table-column label="厂用电量" prop="wMonthFactoryUseKwh" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownLoad(scope.row)" v-hasPermi="['runningWind:reportMonth:export']">下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->

    </div>
</template>

<script>
import { getMonthWindDataList } from "@/api/runing/runMonthly/runMonthlyWind";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "runReportMonthWind",
    components: {
        stationCheckbox,
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
            //遮罩层
            loading: false,
            showSearch: true,
            total: 0,
            //分页查询
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-12-31"),
                stationIdList: [],
            },
            dataList: [],
            // form: {
            //     time: [
            //         this.moment().format("YYYY-MM-01"),
            //         this.moment().format("YYYY-12-31"),
            //     ],
            // },
            rules: {
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
                time: [
                    {
                        type: "array",
                        required: true,
                        message: "请选择日期区间",
                        fields: {
                            0: {
                                type: "string",
                                required: true,
                                message: "请选择开始日期",
                            },
                            1: {
                                type: "string",
                                required: true,
                                message: "请选择结束日期",
                            },
                        },
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
        };
    },
    created() {
        this.queryParams.stationIdList = [this.$store.getters.currentStation];

        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        getList() {
            this.queryParams.endTime = this.moment(this.queryParams.endTime)
                .endOf("month")
                .format("YYYY-MM-DD");
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    getMonthWindDataList(this.queryParams).then((res) => {
                        this.loading = false;
                        this.dataList = res.rows;
                        this.total = res.total;
                    });
                }
            });
        },
        resetQuery() {
            // this.form = {
            //     time: [
            //         this.moment().format("YYYY-MM-01"),
            //         this.moment().format("YYYY-12-31"),
            //     ],
            // };
            this.queryParams = {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-12-31"),
            };
        },
        /**
         * 点击查看按钮操作
         */
        handleWeekSee(row) {
            this.$router.push({
                name: "windMonthReportInfo",
                query: {
                    row: JSON.stringify(row),
                },
            });
        },
        /**
         * 点击下载按钮操作
         */
        handleDownLoad(row) {
            this.download(
                "system/operationDataMonthWind/exportMonthReport",
                {
                    ...this.queryParams,
                    id: row.id,
                },
                `月报.xlsx`
            );
        },
        /**
         * 点击导出按钮操作
         */
        handleExport() {
            this.download(
                "system/operationDataMonthWind/exportMonthReport",
                {
                    ...this.queryParams,
                },
                `月报.xlsx`
            );
        },
        /**时间选择 */
        changeDate(date) {
            this.queryParams.startTime = date[0];
            this.queryParams.endTime = this.moment(date[1])
                .endOf("month")
                .format("YYYY-MM-DD");
        },
        changeStart(date) {
            this.queryParams.endTime = null;
        },
    },
};
</script>

<style scoped>
</style>
