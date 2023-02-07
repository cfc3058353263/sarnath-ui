<template>
    <div class="app-container">
        <!-- top -->
        <div v-loading="loading">
            <el-row :gutter="1">
                <el-col :span="4">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.runDays}}</span> 天</div>
                        <div>安全运行</div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.dayKwh}}</span> kWh</div>
                        <div>日发电量</div>
                    </div>
                </el-col>
                <!-- <el-col :span="3">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.dayKwh:0}}</span> Wh/m²</div>
                        <div>日辐照量</div>
                    </div>
                </el-col> -->
                <el-col :span="5">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.monthKwh}}</span> 万kWh</div>
                        <div>月发电量</div>
                        <!-- <div>日MW发电量</div> -->
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.yearKwh}}</span> 万kWh</div>
                        <div>年发电量</div>
                    </div>
                </el-col>
                <el-col :span="5">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{stationInfo&&stationInfo.totalKwh}}</span> 万kWh</div>
                        <div>总发电量</div>
                    </div>
                </el-col>
                <!-- <el-col :span="4">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">1.37</span> 亿</div>
                        <div>总收入</div>
                    </div>
                </el-col> -->
            </el-row>
            <!-- 统计图 -->
            <div class="changeDate">
                <div class="flex">
                    <div class="dateStyle" :class="{active:currentIndex==1}" @click="changeColor(1)">日</div>
                    <div class="dateStyle" :class="{active:currentIndex==2}" @click="changeColor(2)" style="margin:0 0.2rem">月</div>
                    <div class="dateStyle" :class="{active:currentIndex==3}" @click="changeColor(3)">年</div>
                </div>
            </div>
            <div class="echartsView">
                <div id="echarts" ref="charts" style="height:100%;width:100%"></div>
            </div>
            <!-- 统计图 -->
        </div>
    </div>
</template>
<script>
import { getPowerGeneration } from "@/api/runing/runDaily/runDaily";
import { getStationIndex } from "@/api/station/station";
import StationSearch from "@/views/components/stationSearch";
import resize from "../dashboard/mixins/resize";
var echarts = require("echarts");
const colors = ["#07e3b6", "#ddd83c", "#2495fe"];

export default {
    mixins: [resize],
    components: {
        StationSearch,
    },
    name: "runDaily",
    data() {
        return {
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
                startTime: this.moment().format("YYYY-01-01"),
                endTime: this.moment().format("YYYY-12-31"),
                stationIds: [],
                systemId: null,
                searchType: "month",
            },
            option: {
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                    textStyle: {},
                },
                grid: {
                    left: "8%",
                    right: "6%",
                },
                legend: {
                    top: "10px",
                    textStyle: {
                        fontSize: 14,
                    },
                    data: ["发电量(kWh)", "辐照量(Wh/m²)"],
                },
                xAxis: [
                    {
                        type: "category",
                        axisTick: {
                            alignWithLabel: true,
                        },
                        data: [],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 14,
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#0c71b7",
                            },
                        },
                        axisTick: {
                            alignWithLabel: true,
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        // name: "发电量",
                        min: 0,
                        // max: 400,
                        nameTextStyle: {
                            padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
                        },
                        position: "left",
                        show: true,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(26,179,149,0.2)",
                            },
                        }, //去除网格线
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: colors[0],
                            },
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                        axisLabel: {
                            textStyle: {
                                fontSize: 14,
                            },
                            formatter: "{value} ",
                        },
                    },
                    {
                        type: "value",
                        // name: "辐照量",
                        min: 0,
                        // max: 800,
                        nameTextStyle: {
                            padding: [0, 0, 0, 20], // 四个数字分别为上右下左与原位置距离
                        },
                        position: "right",
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "rgba(26,179,149,0.2)",
                            },
                        }, //去除网格线
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: colors[1],
                            },
                        },
                        axisTick: {
                            //y轴刻度线
                            show: false,
                        },
                        axisLabel: {
                            formatter: "{value} ",
                            textStyle: {
                                fontSize: 14,
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: "发电量(kWh)",
                        type: "bar",
                        data: [],
                        itemStyle: {},
                    },
                    {
                        name: "辐照量(Wh/m²)",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                    },
                ],
            },
            topData: {},
            stationInfo: null,
            loading: true,
            currentIndex: 1,
        };
    },
    created() {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
        this.queryParams.systemId = this.$store.getters.currentSystem;
        // this.getList({
        //     ...this.queryParams,
        // });
        // getPowerGeneration({
        //     ...this.queryParams,
        //     searchType: "date",
        //     startTime: this.moment().format("YYYY-MM-DD"),
        //     endTime: this.moment().format("YYYY-MM-DD"),
        // }).then((res) => {
        //     this.topData = res.data.rows[0];
        // });
        getStationIndex({ stationId: this.$store.getters.currentStation }).then(
            (res) => {
                this.loading = false;
                this.stationInfo = res.data;
                let hourList = [];
                let data = [];
                let dataPlan = [];
                res.data.dayKwhAnalysisList.map((item) => {
                    item.date &&
                        hourList.push(
                            this.moment(item.date).format("H") + "时"
                        );
                    data.push(item.kwh);
                    dataPlan.push(item.irradiation);
                });
                this.option.xAxis[0].data = hourList;
                this.option.series[0].data = data;
                this.option.series[1].data = dataPlan;
                this.setOptions();
            }
        );
    },
    mounted() {
        this.initChart();
    },
    methods: {
        changeColor(index) {
            this.currentIndex = index;
            switch (index) {
                case 1:
                    let hourList = [];
                    let data = [];
                    let dataPlan = [];
                    this.stationInfo.dayKwhAnalysisList.map((item) => {
                        item.date &&
                            hourList.push(
                                this.moment(item.date).format("H") + "时"
                            );
                        data.push(item.kwh);
                        dataPlan.push(item.irradiation);
                    });
                    this.option.xAxis[0].data = hourList;
                    this.option.series[0].data = data;
                    this.option.series[1].data = dataPlan;
                    this.setOptions();
                    break;
                case 2:
                    hourList = [];
                    data = [];
                    dataPlan = [];
                    this.stationInfo.monthKwhAnalysisList.map((item) => {
                        item.date &&
                            hourList.push(this.moment(item.date).format("M-D"));
                        data.push(item.kwh);
                        dataPlan.push(item.irradiation);
                    });
                    this.option.xAxis[0].data = hourList;
                    this.option.series[0].data = data;
                    this.option.series[1].data = dataPlan;
                    this.setOptions();
                    break;

                default:
                    hourList = [];
                    data = [];
                    dataPlan = [];
                    this.stationInfo.yearKwhAnalysisList.map((item) => {
                        item.date &&
                            hourList.push(
                                this.moment(item.date).format("M") + "月"
                            );
                        data.push(item.kwh);
                        dataPlan.push(item.irradiation);
                    });
                    this.option.xAxis[0].data = hourList;
                    this.option.series[0].data = data;
                    this.option.series[1].data = dataPlan;
                    this.setOptions();
                    break;
            }
        },
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
        getList(queryParams) {
            getPowerGeneration(queryParams).then((res) => {
                this.list = res.data.rows;
                if (this.list.length === 0) {
                    this.option.title = {
                        text: "暂无数据",
                        x: "center",
                        y: "center",
                        textStyle: {
                            color: "#909399",
                            fontWeight: "normal",
                            fontSize: 16,
                        },
                    };
                    this.setOptions();
                    return;
                }
                this.option.xAxis.data = this.list.map((item, index) => {
                    return item.calendar;
                });
                this.option.series[0].data = this.list.map((item, index) => {
                    return item.totalKwh;
                });
                this.setOptions();
            });
        },
    },
};
</script>
<style scoped lang="scss">
.echartsView {
    margin-top: 30px;
    height: 500px;
    text-align: center;
}
.topItem {
    background-color: #283847;
    height: 87px;
    color: #fff;
    font-size: 13px;
    /* text-align: center; */
    /* line-height: 87px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.changeDate {
    // position: absolute;
    // right: 1rem;
    // top: 0;
    // z-index: 999;
    float: right;
    margin-top: 10px;
    cursor: pointer;
    .dateStyle {
        padding: 0 10px;
        background-color: #d4d4d4;
        cursor: pointer;
    }
    .active {
        background-color: #084d72;
    }
}
</style>
