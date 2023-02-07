<template>
    <div class="flex flex-1 flex-v">
        <div class="topTitle flex">
            <div class="flex flex-1 flex-pack-justify">
                <span class="titleName">发电量统计</span>
                <div class="flex flex-1 flex-pack-end">
                    <div class="primary" :class="{active:currentIndex==1}" @click="changeColor(1)">日发电量</div>
                    <div class="primary" style="border-left:2px solid #65c6e7;border-right:2px solid #65c6e7;padding:0 0.2rem;margin:0 0.2rem" :class="{active:currentIndex==2}" @click="changeColor(2)">月发电量</div>
                    <div class="primary" :class="{active:currentIndex==3}" @click="changeColor(3)">年发电量</div>
                </div>
            </div>
        </div>
        <div class="flex-1">
            <div id="echart" class="wh100" style="margin-top:-10px"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
export default {
    mixins: [resize],
    props: {
        fontSize: {
            type: Number,
            default: null,
        },
        dayKwhList: {
            type: Array,
            default: null,
        },
        monthKwhList: {
            type: Array,
            default: null,
        },
        yearKwhList: {
            type: Array,
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
        changeColor(index) {
            this.currentIndex = index;
            switch (index) {
                case 1:
                    this.getDayKwhList(this.dayKwhList);
                    break;
                case 2:
                    this.getMonthKwhList(this.monthKwhList)
                    break;

                default:
                    this.getYearKwhList(this.yearKwhList)
                    break;
            }
        },
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("echart");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
            window.addEventListener("resize", () => {
                this.chart.resize();
            });
        },
        setOption: (fontSize) => {
            let option = {
                color: ["#04ba19", "#2bfaff"],
                tooltip: {
                    trigger: "axis",
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                legend: {
                    top: "25px",
                    color: "#fff",
                    textStyle: {
                        color: "#fff",
                        fontSize: fontSize * 0.35,
                    },
                    data: ["实际发电量"],
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
                            type: "dashed",
                            color: "#0a6a9a",
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
                        name: "实际发电量",
                        type: "line",
                        // stack: "Total",
                        data: [],
                    },
                    {
                        name: "计划发电量",
                        type: "line",
                        // stack: "Total",
                        data: [],
                    },
                ],
            };
            return option;
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        getDayKwhList(list) {
            let hourList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                hourList.push(this.moment(item.date).format("H") + "时");
                data.push(item.kwh);
                dataPlan.push(item.planKwh);
            });
            this.option.legend.data = ["实际发电量"];
            this.option.xAxis.data = hourList;
            this.option.series[0].data = data;
            this.option.series[1].data = [];
            this.setOptions();
        },
        getMonthKwhList(list) {
            let dayList = [];
            let data = [];
            let dayPlan = [];
            list.map((item) => {
                dayList.push(this.moment(item.date).format("M-D"));
                data.push(item.kwh);
                dayPlan.push(item.planKwh);
            });
            this.option.legend.data = ["实际发电量","计划发电量"];
            this.option.xAxis.data = dayList;
            this.option.series[0].data = data;
            this.option.series[1].data = dayPlan;
            this.setOptions();
        },
        getYearKwhList(list) {
            let monthList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                monthList.push(this.moment(item.date).format("M")+"月");
                data.push(item.kwh);
                dataPlan.push(item.planKwh);
            });
            this.option.legend.data = ["实际发电量","计划发电量"];
            this.option.xAxis.data = monthList;
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
        dayKwhList: {
            handler(newVal, oldVal) {
               this.currentIndex == 1 && this.getDayKwhList(newVal);
            },
        },
        monthKwhList: {
            handler(newVal, oldVal) {
               this.currentIndex == 2 && this.getMonthKwhList(newVal);
            },
        },
        yearKwhList: {
            handler(newVal, oldVal) {
               this.currentIndex == 3 && this.getYearKwhList(newVal);
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
.topTitle {
    padding: 10px;
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    .titleName {
        font-size: 0.4rem;
        color: #65c6e7;
        font-weight: 400;
    }
    .primary {
        font-size: 0.3rem;
        color: #285678;
        cursor: pointer;
    }
    .active {
        color: #65c6e7;
    }
}
</style>
