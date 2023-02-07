<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" :rules="rules" label-width="90px" v-show="showSearch">
            <el-form-item label="所属电站" prop="stationIds">
                <station-search ref="station" :queryParams="queryParams" stationId="stationIds" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item label="查询类型">
                <el-select v-model="dateType" placeholder="请选择查询类型" @change="changeSelect">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in dateTypeList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <!-- 
            <el-form-item label="同比年份" prop="lastYear">
                <el-date-picker v-model="queryParams.lastYear" @change="changeLastYear" :clearable="false" size="small" type="year" style="width:150px" value-format="yyyy">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="nextYear">
                <el-date-picker v-model="queryParams.nextYear" :clearable="false" size="small" :picker-options="nextYear"  type="year" style="margin-right:10px;width:150px" value-format="yyyy">
                </el-date-picker>
            </el-form-item> -->

            <!-- <br /> -->
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" :type="dateType" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small" :picker-options="endTime" :type="dateType" style="width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 统计图 -->
        <div class="echartsView">
            <div ref="charts" style="height:100%;width:100%"></div>
        </div>
        <!-- 统计图 -->
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
            <el-table-column :label="lastName" prop="lastYeatData" :show-overflow-tooltip="true" />
            <el-table-column :label="nextName" prop="nextYeatData" :show-overflow-tooltip="true" />
            <el-table-column label="完成比（%）" prop="grew" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                 <span>{{scope.row.grew + "%"}}</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import { getList } from "@/api/dataMaintain/weather";
var echarts = require("echarts");
import resize from "../dashboard/mixins/resize";

export default {
    name: "dpgStatistics",
    mixins: [resize],
    components: {
        StationSearch,
        excelImport,
    },
    data() {
        let self = this;
        return {
            nextYear: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.lastYear),
                                "year"
                            ) < 1
                    );
                },
            },
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
            showSearch: true,
            loading: false,
            total: 0,
            nextName: null,
            lastName: null,
            dateType: "date",
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            queryParams: {
                // nextYear:null,
                // lastYear:null,
                startTime: null,
                endTime: null,
                stationIds: null,
                systemId: null,
            },
            query: {},
            dataList: [],
            rules: {
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
                stationIds: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
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
                nextYear: [
                    {
                        required: true,
                        message: "同比年份不能为空",
                        trigger: "blur",
                    },
                ],
                lastYear: [
                    {
                        required: true,
                        message: "同比年份不能为空",
                        trigger: "blur",
                    },
                ],
            },
            option: {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "line", // 默认为直线，可选为：'line' | 'shadow'
                    },
                    show: true,
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "20",
                    containLabel: true,
                },
                legend: {
                    data: ["同比升高%"],
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisLabel: {
                            interval: 0,
                            rotate: 45,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
                series: [
                    {
                        name: "同比升高%",
                        type: "line",
                        data: [],
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
        this.initChart();
    },
    methods: {
        /**echarts 初始化 */
        initChart() {
            this.chart = echarts.init(this.$refs.charts);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },

        /**获取设备发电量 日 */
        getDeviceDay() {
            this.loading = true;
            switch (this.dateType) {
                case "date":
                    this.queryParams.searchType = this.dateType;
                    this.queryParams.startTime = this.moment(
                        this.queryParams.startTime
                    ).format("YYYY-MM-DD");
                    this.queryParams.endTime = this.moment(
                        this.queryParams.endTime
                    ).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.searchType = this.dateType;
                    this.queryParams.startTime = this.moment(
                        this.queryParams.startTime
                    ).format("YYYY-MM-DD");
                    this.queryParams.endTime = this.moment(
                        this.queryParams.endTime
                    )
                        .endOf("month")
                        .format("YYYY-MM-DD");
                    break;
                case "year":
                    this.queryParams.searchType = this.dateType;
                    this.queryParams.startTime = this.moment(
                        this.queryParams.startTime
                    ).format("YYYY-MM-DD");
                    this.queryParams.endTime = this.moment(
                        this.queryParams.endTime
                    )
                        .endOf("year")
                        .format("YYYY-MM-DD");
                    break;
            }
            getList(this.queryParams).then((res) => {
                this.dataList = res.data;
                this.lastName = res.data[0].lastTime;
                this.nextName = res.data[0].nextTime;
                this.loading = false;
                this.option.xAxis[0].data = this.dataList.map((item, index) => {
                    return item.name;
                });
                this.option.series[0].data = this.dataList.map(
                    (item, index) => {
                        return item.grew;
                    }
                );
                this.setOptions();
            });
        },
        //查询
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    this.getDeviceDay();
                }
            });
        },
        /**同比年份选择 */
        changeLastYear() {
            this.queryParams.nextYear = null;
        },

        /**时间选择 */
        changeStart(date) {
            this.queryParams.endTime = null;
        },
        changeEnd(date) {
            switch (this.dateType) {
                case "date":
                    this.queryParams.endTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.endTime = this.moment(date)
                        .endOf("month")
                        .format("YYYY-MM-DD");
                    break;
                case "year":
                    this.queryParams.endTime =
                        this.moment(date).format("YYYY-12-31");
                    break;
            }
        },
        /**日期类型选 */
        changeSelect(value) {
            this.queryParams.startTime = null;
            this.queryParams.endTime = null;
        },
    },
};
</script>
<style lang="scss" scoped>
.echartsView {
    height: 500px;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.selectD {
    text-align: center;
}
</style>
