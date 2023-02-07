<template>
    <div class="flex flex-v wh100">
        <div class="title">
            <span class="ml5">工单统计</span>
        </div>
        <div class="flex-1">
            <div id="workorderStatistics" class="wh100"></div>
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
        issueOrderInfo: {
            // type: Object,
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
            let mapDiv = document.getElementById("workorderStatistics");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                color: ["#45ffb7", "#f3515e"],
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
                    data: ["已完成", "未完成"],
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
                            color: "#295b86",
                        },
                    },
                    data: ["5-2", "5-3", "5-4", "5-5"],
                },
                yAxis: {
                    // name: "(kWh)",
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
                        name: "已完成",
                        type: "line",
                        data: [],
                    },
                    {
                        name: "未完成",
                        type: "line",
                        data: [],
                    },
                ],
            };
            return option;
        },
        getIssueOrderInfo(list) {
            let date = [];
            let successNum = [];
            let noSuccessNum = [];
            for (let item of list) {
                for (let name in item) {
                    date.push(this.moment(name).format("MM-DD"));
                    successNum.push(item[name].successNum);
                    noSuccessNum.push(item[name].noSuccessNum);
                }
            }
            this.option.series[0].data = successNum;
            this.option.series[1].data = noSuccessNum;
            this.option.xAxis.data = date;
            this.setOptions();
        },
    },
    watch: {
        issueOrderInfo: {
            handler(newVal, oldVal) {
                this.getIssueOrderInfo(newVal);
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
