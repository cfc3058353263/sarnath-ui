<template>
    <div class="flex flex-v wh100 bg">
        <div class="title">
            <span class="ml5">电量分析</span>
        </div>
        <div class="echartTitle">
            <el-button type="primary" style="cursor: pointer;" @click="link">
                查看设备
            </el-button>
            <!-- <span style="cursor: pointer;" @click="link">查看设备</span> -->
        </div>
        <div class="flex-1" style="position:relative">
            <div class="changeDate">
                <div class="flex">
                    <div class="dateStyle" :class="{active:currentIndex==1}" @click="changeColor(1)">日</div>
                    <div class="dateStyle" :class="{active:currentIndex==2}" @click="changeColor(2)" style="margin:0 0.2rem">月</div>
                    <div class="dateStyle" :class="{active:currentIndex==3}" @click="changeColor(3)">年</div>
                </div>
            </div>
            <div id="device" class="wh100"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
const colors = ["#07e3b6", "#ddd83c", "#2495fe"];

export default {
    mixins: [resize],
    props: {
        dayKwhAnalysisList: {
            type: Array,
            default: null,
        },
        monthKwhAnalysisList: {
            type: Array,
            default: null,
        },
        yearKwhAnalysisList: {
            type: Array,
            default: null,
        },
        fontSize: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            currentIndex: 1,
            option: null,
        };
    },
    mounted() {},
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("device");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
            window.addEventListener("resize", () => {
                this.chart.resize();
            });
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                // color: colors,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                grid: {
                    left: "8%",
                    right: "6%",
                },
                legend: {
                    top: "10px",
                    color: "#fff",
                    textStyle: {
                        color: "#fff",
                        fontSize: fontSize * 0.35,
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
                                color: "#fff",
                                fontSize: fontSize * 0.35,
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
                                fontSize: fontSize * 0.35,
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
                                fontSize: fontSize * 0.35,
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
                                fontSize: fontSize * 0.35,
                            },
                        },
                    },
                ],
                series: [
                    {
                        name: "发电量(kWh)",
                        type: "bar",
                        data: [],
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#0156fa",
                                        },
                                        {
                                            offset: 1,
                                            color: "#13fa96",
                                        },
                                    ]
                                ),
                            },
                        },
                    },
                    {
                        name: "辐照量(Wh/m²)",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                    },
                ],
            };
            return option;
        },
        changeColor(index) {
            this.currentIndex = index;
            switch (index) {
                case 1:
                    this.getDayKwhAnalysisList(this.dayKwhAnalysisList);
                    break;
                case 2:
                    this.getMonthKwhAnalysisList(this.monthKwhAnalysisList);
                    break;

                default:
                    this.getYearKwhAnalysisList(this.yearKwhAnalysisList);
                    break;
            }
        },
        link() {
            this.$router.push({
                path: "matrix",
                query: {
                    stationId: this.$route.query.stationId,
                    stationName: this.$route.query.stationName,
                },
            });
        },
        getDayKwhAnalysisList(list) {
            let hourList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                item.date && hourList.push(this.moment(item.date).format("H") + "时");
                data.push(item.kwh);
                dataPlan.push(item.irradiation);
            });
            this.option.xAxis[0].data = hourList;
            this.option.series[0].data = data;
            this.option.series[1].data = dataPlan;
            this.setOptions();
        },
        getMonthKwhAnalysisList(list) {
            let hourList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                item.date && hourList.push(this.moment(item.date).format("M-D"));
                data.push(item.kwh);
                dataPlan.push(item.irradiation);
            });
            this.option.xAxis[0].data = hourList;
            this.option.series[0].data = data;
            this.option.series[1].data = dataPlan;
            this.setOptions();
        },
        getYearKwhAnalysisList(list) {
            let hourList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                item.date && hourList.push(this.moment(item.date).format("M") + "月");
                data.push(item.kwh);
                dataPlan.push(item.irradiation);
            });
            this.option.xAxis[0].data = hourList;
            this.option.series[0].data = data;
            this.option.series[1].data = dataPlan;
            this.setOptions();
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", () => {
            this.chart.resize();
        });
    },
    watch: {
        dayKwhAnalysisList: {
            handler(newVal, oldVal) {
                this.currentIndex == 1 && this.getDayKwhAnalysisList(newVal);
            },
        },
        monthKwhAnalysisList: {
            handler(newVal, oldVal) {
                this.currentIndex == 2 && this.getMonthKwhAnalysisList(newVal);
            },
        },
        yearKwhAnalysisList: {
            handler(newVal, oldVal) {
                this.currentIndex == 3 && this.getYearKwhAnalysisList(newVal);
            },
        },
        fontSize: {
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    this.option = this.setOption(newVal);
                    this.initChart();
                });
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.title {
    padding: 10px;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
    float: flex;
}
.bg {
    background-image: url("../../../../assets/images/bigScreen/station/map.png");
    background-size: 100% 100%;
    margin: 0 20px;
    .echartTitle {
        color: #fff;
        text-align: center;
        font-size: 0.4rem;
        font-weight: 800;
    }
    .changeDate {
        position: absolute;
        right: 1rem;
        top: 0;
        z-index: 999;
        .dateStyle {
            font-size: 0.4rem;
            padding: 0 0.1rem;
            background-color: #084d72;
            cursor: pointer;
        }
        .active {
            background-color: #1ae0fe;
        }
    }
}
</style>
