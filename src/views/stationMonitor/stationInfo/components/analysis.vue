<template>
    <div class="flex flex-v wh100">
        <div class="echartTitle">电量分析</div>
        <div class="flex-1">
            <div id="capacityCharts" class="wh100"></div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "@/utils/resize.js";
const colors = ["#07e3b6", "#00fcff", "#2495fe"];

export default {
    mixins: [resize],
    props: {
        data: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            url: "ws://192.168.9.210:8080/websocket/solarStation",
            message: "",
            text_content: "",
            ws: null,
            option: {
                color: colors,
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                    },
                },
                grid: {
                    left: "6%",
                    right: "12%",
                },
                legend: {
                    top: "25px",
                    color: "#fff",
                    textStyle: {
                        color: "#fff",
                    },
                    // data: ["发电量(kWh)", "辐照量(W/m²)", "小时功率(kW)"],
                    data: ["发电量(kWh)", "平面辐照量(MJ/m²)"],
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
                                fontSize: 10,
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
                        name: "发电量",
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
                            formatter: "{value} ",
                        },
                    },
                    {
                        type: "value",
                        name: "辐照量",
                        nameTextStyle: {
                            // padding: [0, 0, 0, 20], // 四个数字分别为上右下左与原位置距离
                            padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
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
                        },
                    },
                    // {
                    //     type: "value",
                    //     name: "小时功率",
                    //     nameTextStyle: {
                    //         padding: [0, 0, 0, 40], // 四个数字分别为上右下左与原位置距离
                    //     },
                    //     position: "right",
                    //     offset: 40,
                    //     splitLine: {
                    //         show: true,
                    //         lineStyle: {
                    //             type: "dashed",
                    //             color: "rgba(26,179,149,0.2)",
                    //         },
                    //     }, //去除网格线
                    //     axisLine: {
                    //         show: false,
                    //         lineStyle: {
                    //             color: colors[2],
                    //         },
                    //     },
                    //     axisLabel: {
                    //         formatter: "{value} ",
                    //     },
                    //     axisTick: {
                    //         //y轴刻度线
                    //         show: false,
                    //     },
                    // },
                ],
                series: [
                    {
                        name: "发电量(kWh)",
                        type: "bar",
                        data: [],
                    },
                    {
                        name: "平面辐照量(MJ/m²)",
                        type: "line",
                        yAxisIndex: 1,
                        data: [],
                    },
                    // {
                    //     name: "小时功率(kW)",
                    //     type: "line",
                    //     yAxisIndex: 2,
                    //     data: [],
                    // },
                ],
            },
        };
    },
    mounted() {
        this.initChart();
    },
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("capacityCharts");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        getDataList() {
            //发电量
            this.option.series[0].data = this.data.hourDataList.map((item) => {
                return item.hourKwh;
            });
            //辐照量
            this.option.series[1].data = this.data.hourDataList.map((item) => {
                return item.irradiation;
            });
            // //小时功率
            // this.option.series[2].data = this.data.hourDataList.map((item) => {
            //     return item.activePower;
            // });
            //x轴坐标
            this.option.xAxis[0].data = this.data.hourDataList.map((item) => {
                return this.moment(item.recordTime).format("HH") + "时";
            });
            this.option.yAxis[0].nameTextStyle.padding = [0, 0, 0, -40];
            this.setOptions();
        },
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                this.getDataList();
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.echartTitle {
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: 800;
}
</style>
