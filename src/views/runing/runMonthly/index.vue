<template>
    <div class="app-container">
        <el-form ref="queryParams" :model="queryParams" :inline="true" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="queryParams.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" type="month" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" type="month" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport()" v-hasPermi="['runing:runMonthly:download']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="250">
            </el-table-column>
            <el-table-column label="月份" prop="monthTitle" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="月发电量(kWh)" prop="monthKwh" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="月均实际辐照量Wh/㎡" prop="sMonthAvgRadiation" :show-overflow-tooltip="true" />
            <el-table-column label="月利用小时数(h)" prop="hours" :show-overflow-tooltip="true" />

            <el-table-column label="月损失电量(kWh)" prop="losskWh" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownLoad(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->
    </div>
</template>
<script>
import { getList } from "@/api/runing/runMonthly/runMonthly";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "runMonthly",
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
            //分页查询
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-12-31"),
                stationIdList: [],
            },
            query: {},
            list: [],
            // form: {
            //     time: [
            //         this.moment().format("YYYY-MM-01"),
            //         this.moment().format("YYYY-12-31"),
            //     ],
            // },
            showSearch: true,
            loading: false,
            // 总条数
            total: 0,
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
            this.search();
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        /**查询 */
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    this.query = JSON.parse(JSON.stringify(this.queryParams));
                    this.getList();
                }
            });
        },
        /**分页 */
        getList() {
            this.loading = true;
            getList(this.query).then((res) => {
                this.loading = false;
                this.list = res.rows;
                this.total = res.total;
            });
        },
        /**导出 */
        handleExport() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    this.download(
                        "system/operationReportData/exportMonth",
                        {
                            ...this.queryParams,
                        },
                        `月报.xlsx`
                    );
                }
            });
        },
        /**查看 */
        handleWeekSee(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/runing/runMonthly/info",
                query: {
                    row: JSON.stringify(row),
                },
            });
        },
        /**下载 */
        handleDownLoad(row) {
            this.download(
                "system/operationPlanDay/exportMonth",
                {
                    ...this.queryParams,
                    id: row.id,
                },
                `月报.xlsx`
            );
        },
        /**重置 */
        resetQuery() {
            this.queryParams.startTime = this.moment().format("yyyy-MM-01");
            this.queryParams.endTime = this.moment().format("yyyy-MM-DD");
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