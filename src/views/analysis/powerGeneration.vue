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
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" :type="dateType" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker v-model="queryParams.endTime" @change="changeEnd" :clearable="false" size="small" :picker-options="endTime" :type="dateType" style="width:150px">
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
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="220"/>
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="有效发电小时数" prop="hours" :show-overflow-tooltip="true" />
            <el-table-column label="目标值（%）" prop="target" :show-overflow-tooltip="true" />
            <el-table-column label="完成比（%）" prop="radio" :show-overflow-tooltip="true" />
            <el-table-column label="并网容量预计发电量/kWh" prop="netInstallCapacity" :show-overflow-tooltip="true" width="180"/>
            <el-table-column label="实际发电量/kWh" prop="powerKwh" :show-overflow-tooltip="true" />
            <el-table-column label="故障损失/kWh" prop="faultLoss" :show-overflow-tooltip="true" />
            <el-table-column label="非故障损失/kWh" prop="notFaultLoss" :show-overflow-tooltip="true" />
            <el-table-column label="包含损失完成比" prop="percentLoss" :show-overflow-tooltip="true" />
            <el-table-column label="欠发电量/kWh" prop="underpower" :show-overflow-tooltip="true" />
        </el-table>
        <!-- table -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import { getList } from "@/api/dataMaintain/powerGeneration";
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
            dateType: "date",
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            queryParams: {
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().subtract(1, 'day').format("YYYY-MM-DD"),
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
                    data: [
                        "利用小时数",
                        "目标值",
                        "天完成比",
                        "月完成比",
                        "年完成比",
                    ],
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                        axisLabel: {
                            rotate: 45,
                            padding: [44, 12, 0, 0],
                            color: function (value, index) {
                                return index < 1 ? "green" : "red";
                            },
                            formatter: function (val) {
                                return (
                                    val.substring(0, 10) +
                                    "\n" +
                                    val.substring(10)
                                );
                            },
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                    {
                        type: "value",
                    },
                ],
                series: [
                    {
                        name: "利用小时数",
                        type: "bar",
                        color: "#5B9BD5",
                        barMaxWidth: 30,
                        cursor: "default",
                        data: [],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: "bottom",
                                    backgroundColor: "green",
                                    padding: [3, 5, 3, 5],
                                    color: "black",
                                    formatter: function (v) {
                                        return v.data + "h";
                                    },
                                },
                            },
                        },
                    },

                    {
                        name: "天完成比",
                        type: "line",
                        cursor: "default",
                        data: [],
                        color: "black",
                        fontWeight: "600",
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    color: "black",
                                    formatter: function (v) {
                                        return v.data + "%";
                                    },
                                },
                            },
                        },

                        yAxisIndex: 1,
                        markLine: {
                            name: "目标值",

                            lineStyle: {
                                normal: {
                                    type: "dashed",
                                    color: "#ED7D31",
                                    width: 2,
                                },
                            },
                            label: {
                                fontWeight: 600,
                                formatter: function (v) {
                                    return "目标值：" + v.data.value + "%";
                                },
                            },
                            data: [
                                {
                                    yAxis: 100,
                                },
                            ],
                        },
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
        this.initChart();
        this.getDeviceDay();
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
            let dateType;
            switch (this.dateType) {
                case "date":
                    this.queryParams.searchType = "date";
                    this.option.series[1].name = "天完成比";
                    break;
                case "month":
                    this.queryParams.searchType = "month";
                    this.option.series[1].name = "月完成比";
                    break;
                case "year":
                    this.queryParams.searchType = "year";
                    this.option.series[1].name = "年完成比";
                    break;
            }
            getList(this.queryParams).then((res) => {
                this.dataList = res.rows;
                this.loading = false;
                this.option.xAxis[0].data = this.dataList.map((item, index) => {
                    return item.calendar;
                });
                // 折线图倒序
              this.option.xAxis[0].data= this.option.xAxis[0].data.reverse();
                this.option.series[0].data = this.dataList.map(
                    (item, index) => {
                        return item.hours;
                    }
                );
                this.option.series[1].data = this.dataList.map(
                    (item, index) => {
                        return item.radio;
                    }
                );
                this.setOptions();
            });
        },
        //查询
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    if (
                        this.moment(this.queryParams.endTime).diff(
                            this.moment(this.queryParams.startTime),
                            "day"
                        ) < 0
                    ) {
                        this.msgError("日期区间结束时间不得早于开始时间");
                    } else {
                        this.getDeviceDay();
                    }
                }
            });
        },
        /**时间选择 */
        changeStart(date) {
            this.queryParams.endTime = null;
            switch (this.dateType) {
                case "date":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-01");
                    break;
                case "year":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-01-01");
                    break;
            }
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
