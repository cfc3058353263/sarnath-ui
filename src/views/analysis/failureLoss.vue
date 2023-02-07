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
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker size="small" @change="changeStrat" :clearable="false" v-model="queryParams.startTime" :type="dateType" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker size="small" @change="changeEnd" :picker-options="dateType =='date'? endWeek : endTime" :clearable="false" v-model="queryParams.endTime" :type="dateType" style="width:150px">
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
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="装机" prop="netInstallCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="发电量" prop="dayKwh" :show-overflow-tooltip="true" />
            <el-table-column label="故障损失" prop="faultLoss" :show-overflow-tooltip="true" />
            <el-table-column label="非故障损失" prop="notFaultLoss" :show-overflow-tooltip="true" />
            <el-table-column label="损失占比（%）" prop="lossRatio" :show-overflow-tooltip="true" />
            <el-table-column label="故障损失占比（%）" prop="faultLossRatio" :show-overflow-tooltip="true" />
            <el-table-column label="非故障损失占比（%）" prop="notFaultLossRatio" :show-overflow-tooltip="true" />
        </el-table>
        <!-- table -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import { getList } from "@/api/dataMaintain/failureLoss.js";
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
            endWeek: {
                disabledDate(time) {
                    let t = self.moment(time.getTime()).format("yyyy-MM-DD"); //所有
                    let s = self
                        .moment(self.queryParams.startTime)
                        .format("yyyy-MM-DD"); //开始
                    let nextE = self
                        .moment(s)
                        .add(6, "days")
                        .format("yyyy-MM-DD"); //第一个7天时间
                    if (nextE === t) {
                        return false;
                    }
                    return (
                        self.moment(t).diff(self.moment(nextE), "days") < 0 ||
                        self.moment(t).diff(self.moment(nextE), "days") % 7 !==
                            0
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
            dateType: "month",
            dateTypeList: [
                // { value: "date", label: "周" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            queryParams: {
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().endOf('month').format("YYYY-MM-DD"),
                stationIds: null,
                systemId: null,
            },
            query: {},
            dataList: [],
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
            option: {
                //echarts 配置
                title: { text: "故障&非故障损失率" },
                tooltip: { trigger: "axis" },
                legend: { data: ["故障损失", "非故障损失"] },
                xAxis: {
                    type: "category",
                    data: [],
                    axisLine: { lineStyle: { color: "#2898e5" } },
                },
                yAxis: {
                    type: "value",
                    data: ["0", "0.2", "0.4", "0.6", "0.8", "1"],
                    axisLine: {
                        lineStyle: {
                            color: "#2898e5",
                        },
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ["rgb(1,155,246,0.3)"], //网格线
                            width: 1,
                        },
                    },
                },
                series: [
                    {
                        name: "故障损失",
                        type: "line",
                        data: [],
                        itemStyle: {
                            normal: {
                                color: "#6b7a85",
                                lineStyle: {
                                    color: "#6b7a85",
                                },
                            },
                        },
                    },
                    {
                        name: "非故障损失",
                        type: "line",
                        data: [],
                        itemStyle: {
                            normal: {
                                color: "#c23531",
                                lineStyle: {
                                    color: "#c23531",
                                },
                            },
                        },
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
        this.initChart();
        this.getList();
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
        getList() {
            this.loading = true;
            switch (this.dateType) {
                case "date":
                    this.queryParams.searchType = this.dateType;
                    break;
                case "month":
                    this.queryParams.searchType = this.dateType;
                    break;
                case "year":
                    this.queryParams.searchType = this.dateType;
                    break;
            }
            getList(this.queryParams).then((res) => {
                this.dataList = res.rows;
                this.option.xAxis.data = this.dataList.map((item, index) => {
                    return item.calendar;
                });
                this.option.series[0].data = this.dataList.map(
                    (item, index) => {
                        return item.faultLossRatio;
                    }
                );
                this.option.series[1].data = this.dataList.map(
                    (item, index) => {
                        return item.notFaultLossRatio;
                    }
                );
                this.setOptions();
                this.loading = false;
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
                        this.getList();
                    }
                }
            });
        },
        /**时间月开始选择 */
        changeStrat(date) {
            switch (this.dateType) {
                case "date":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-DD");
                    this.queryParams.endTime = null;
                    break;
                default:
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-01");
                    break;
            }
        },
        /**时间月结束选择 */
        changeEnd(date) {
            switch (this.dateType) {
                case "date":
                    this.queryParams.endTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                default:
                    this.queryParams.endTime = this.moment(date)
                        .endOf("month")
                        .format("YYYY-MM-DD");
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
    height: 400px;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.selectD {
    text-align: center;
}
</style>
