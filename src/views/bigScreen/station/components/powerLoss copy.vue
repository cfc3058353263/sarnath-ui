<template>
    <div class="flex flex-v wh100">
        <div class="title">
            <span class="ml5">损失电量分析</span>
        </div>
        <div class="flex-1">
            <div id="powerLoss" class="wh100"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
const colors = ["#07e3b6", "#00fcff", "#2495fe"];

export default {
    mixins: [resize],
    props: {
        monthLossKwhList: {
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
            option: null,
        };
    },
    mounted() {},
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("powerLoss");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                color: ["#016e86"],
                tooltip: {
                    trigger: "axis",
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                legend: {
                    top: "25px",
                    color: "#016e86",
                    textStyle: {
                        color: "#016e86",
                        fontSize: fontSize * 0.35,
                    },
                    data: ["损失电量"],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#295b86",
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: fontSize * 0.35,
                        },
                    },
                    data: [],
                },
                yAxis: {
                    name: "(kWh)",
                    type: "value",
                    min: 0,
                    nameTextStyle: {
                        padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
                        color: "#295b86",
                        fontSize: fontSize * 0.35,
                    },
                    scale: true,
                    show: true,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "solid",
                            color: "#123464",
                        },
                    }, //去除网格线
                    axisLine: { show: false }, //隐藏y轴刻度线
                    axisTick: {
                        //y轴刻度线
                        show: false,
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#295b86",
                            fontSize: fontSize * 0.35,
                        },
                    },
                },
                series: [
                    {
                        name: "损失电量",
                        type: "line",
                        stack: "Total",
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0,
                                0,
                                0,
                                1,
                                [
                                    {
                                        offset: 0,
                                        color: "#20479a",
                                    },
                                    {
                                        offset: 1,
                                        color: "#2bfaff",
                                    },
                                ]
                            ),
                        },
                        data: [],
                    },
                ],
            };
            return option;
        },
        getMonthLossKwhList(list) {
            let date = [];
            let data = [];
            list.map((item) => {
                date.push(this.moment(item.date).format("DD"));
                data.push(item.value);
            });
            this.option.xAxis.data = date;
            this.option.series[0].data = data;
            this.setOptions();
        },
    },
    watch: {
        monthLossKwhList: {
            handler(newVal, oldVal) {
                this.getMonthLossKwhList(newVal)
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
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
}
</style>
