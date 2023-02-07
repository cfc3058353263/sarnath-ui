<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" :rules="rules" label-width="90px" v-show="showSearch">
            <el-form-item label="所属电站" prop="stationIds">
                <station-search ref="station" :queryParams="queryParams" stationId="stationIds" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item label="查询类型">
                <el-select v-model="dateType" placeholder="请选择查询类型" @change="dateTypeChange">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in dateTypeList" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStartYear" size="small" unlink-panels :type="dateType">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :picker-options="endTime" @change="changeEndYear" size="small" unlink-panels :type="dateType">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 统计图 -->
        <div class="echartsView">
            <div ref="charts" style="height:100%;width:100%"></div>
        </div>
        <!-- 统计图 -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="所属电站" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="时间" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="发电量(kWh)" prop="totalKwh" :show-overflow-tooltip="true" />
            <el-table-column label="MW发电量(kWh)" prop="mwKwh" :show-overflow-tooltip="true" />
            <el-table-column label="辐照量(Wh/㎡)" prop="radiation" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="发电效率(%)" prop="powerIrradiationDay" :show-overflow-tooltip="true" /> -->
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->
    </div>
</template>
<script>
import { getPowerGeneration } from "@/api/runing/runDaily/runDaily";
import StationSearch from "@/views/components/stationSearch";
import * as echarts from "echarts";

export default {
    components: {
        StationSearch,
    },
    name: "runDaily",
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
            //table数据
            list: [],
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            dateType: "date",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-MM-DD"),
                stationIds: [],
                systemId: null,
                searchType: null,
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
                    right: "5%",
                    bottom: "3%",
                    containLabel: true,
                },
                legend: {
                    data: ["发电量", "辐照量", "MW发电量(kWh)"],
                },
                xAxis: [
                    {
                        type: "category",
                        data: [],
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                    {
                        type: "value",
                        name: "辐照量",
                        nameTextStyle: {
                            padding: [0, 0, 0, 40], // 四个数字分别为上右下左与原位置距离
                        },
                        position: "right",
                        // offset:,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(26,179,149,0.2)",
                            },
                        }, //去除网格线
                        axisLine: {
                            show: false,
                            onZero:false
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                        axisLabel: {
                            formatter: "{value} ",
                        },
                    },
                    {
                        type: "value",
                        name: "MW发电量",
                        nameTextStyle: {
                            padding: [0, 0, 0, 60], // 四个数字分别为上右下左与原位置距离
                        },
                        position: "right",
                        offset: 60,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(26,179,149,0.2)",
                            },
                        }, //去除网格线
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            formatter: "{value} ",
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                    },
                ],
                series: [
                    {
                        name: "发电量",
                        type: "bar",
                        barMaxWidth: 30,
                        data: [],
                    },
                    {
                        name: "辐照量",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                    },
                    {
                        name: "MW发电量(kWh)",
                        type: "line",
                        yAxisIndex: 2,
                        data: [],
                    },
                ],
            },
            rules: {
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
        };
    },
    created() {
        this.getList();
    },
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
        //列表获取
        getList() {
            var self = this;
            self.loading = true;
            self.queryParams.searchType = self.dateType;
            getPowerGeneration(self.queryParams).then((res) => {
                self.loading = false;
                self.list = res.data.rows;
                self.total = res.data.total;
                let totalKwhList = [];
                let date = [];
                let radiationList = [];
                let mwKwhList = [];
                for (let item of res.data.rows) {
                    totalKwhList.push(item.totalKwh);
                    date.push(item.calendar);
                    radiationList.push(item.radiation);
                    mwKwhList.push(item.mwKwh);
                }
                console.log(res.data.rows);
                self.option.series[0].data = totalKwhList;
                self.option.series[1].data = radiationList;
                self.option.series[2].data = mwKwhList;
                self.option.xAxis[0].data = date;
                self.setOptions();
                // console.log(self.list)
            });
        },
        /**查询 */
        handleSearch() {
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
                        // this.queryParams.stationIds = [this.queryParams.stationIds]
                        this.getList();
                    }
                }
            });
        },
        dateTypeChange(value) {
            this.queryParams.startTime = null;
            this.queryParams.endTime = null;
        },

        changeStartYear(date) {
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
        changeEndYear(date) {
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
    },
};
</script>
<style scoped>
.echartsView {
    height: 500px;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>
