<template>
    <div class="flex flex-v wh100">
        <div class="title">
            <span class="ml5">巡检计划</span>
        </div>
        <div class="flex-1">
            <div id="patrolplan" class="wh100"></div>
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
        patrolPlanList: {
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
            let mapDiv = document.getElementById("patrolplan");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                grid: {
                    left: "10%",
                    right: "3%",
                    bottom: "20%",
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                legend: {
                    top: "10px",
                    right: "10px",
                    itemHeight: 10,
                    itemWidth: 16,
                    data: [
                        {
                            name: "计划",
                            textStyle: {
                                color: "#14ff93",
                                fontSize: fontSize * 0.35,
                                fontWeight: 600,
                            },
                        },
                        {
                            name: "已完成",
                            textStyle: {
                                color: "#00deff",
                                fontSize: fontSize * 0.35,
                                fontWeight: 600,
                            },
                        },
                    ],
                },
                xAxis: [
                    {
                        type: "category",
                        axisTick: { show: false },
                        data: [],
                        axisLine: {
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
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "",
                        nameTextStyle: {
                            padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
                            color: "#295b86",
                        },
                        scale: true,
                        show: true,
                        splitLine: {
                            show: false,
                        }, //去除网格线
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#295b86",
                            },
                        }, //隐藏y轴刻度线
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
                ],
                series: [
                    {
                        name: "计划",
                        type: "bar",
                        emphasis: {
                            focus: "series",
                        },
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
                                            color: "#008e26",
                                        },
                                        {
                                            offset: 1,
                                            color: "#14ff93",
                                        },
                                    ]
                                ),
                            },
                        },
                    },
                    {
                        name: "已完成",
                        type: "bar",
                        barGap: 0,
                        emphasis: {
                            focus: "series",
                        },
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
                                            color: "#0053ff",
                                        },
                                        {
                                            offset: 1,
                                            color: "#00deff",
                                        },
                                    ]
                                ),
                            },
                        },
                    },
                ],
            };
            return option;
        },
        getPatrolPlanList(list) {
            let date = [];
            let planNum = [];
            let successNum = [];
            list.map((item) => {
                date.push(this.moment(item.date).format("MM-DD"));
                planNum.push(item.planNum);
                successNum.push(item.successNum);
            });
            this.option.xAxis[0].data = date;
            this.option.series[0].data = planNum;
            this.option.series[1].data = successNum;
            this.setOptions();
        },
    },
    watch: {
        patrolPlanList: {
            handler(newVal, oldVal) {
                this.getPatrolPlanList(newVal)
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
