<template>
    <div class="flex flex-v wh100">
        <div class="echartTitle">电表分析</div>
        <div class="flex-1">
            <div id="powerCharts" class="wh100"></div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "@/utils/resize.js";
export default {
    mixins: [resize],
    props: {
        data: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            option: {
                color: [
                    "#c12e34",
                    "#e6b600",
                    "#58b5dd",
                    "#07e3b6",
                    "#005eaa",
                    "#339ca8",
                    "#cda819",
                    "#32a487",
                ],
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    left: "8%",
                    top: "3%",
                    color: "#fff",
                    textStyle: {
                        color: "#02124d",
                        fontWeight: 700,
                    },
                    data: [],
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
                    axisLabel: {
                        formatter: (value, index) => {
                            return value + "\n" + this.moment().format("MM-DD");
                        },
                        show: true,
                        textStyle: {
                            color: "#fff",
                            fontSize: 10,
                        },
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#fff",
                        },
                    },
                    data: [
                        "00:00",
                        "02:00",
                        "04:00",
                        "06:00",
                        "08:00",
                        "10:00",
                        "12:00",
                        "14:00",
                        "16:00",
                        "18:00",
                        "20:00",
                        "22:00",
                        "23:50",
                    ],
                },
                yAxis: {
                    name: "kWh",
                    type: "value",
                    nameTextStyle: {
                        padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
                        color: "#fff",
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
                            color: "#fff",
                            fontSize: 10,
                        },
                    },
                    // boundaryGap: [0, "100%"],
                },
                series: [],
            },
            dataList: {},
        };
    },
    mounted() {
        this.initChart();
    },
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("powerCharts");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        //获取数据后处理
        getDataList() {
            let dataList = this.data[0].map((item) => {
                return { data: [], name: item.name };
            });
            for (let item of dataList) {
                for (let list of this.data) {
                    for (let data of list) {
                        if (item.name == data.name) {
                            item.data.push(data.forwardActive);
                        }
                    }
                }
            }

            this.option.yAxis.nameTextStyle.padding = [0, 0, 0, -40];
            this.option.series = dataList.map((item, index) => {
                if (item.name == "1号柜电表数" || item.name == "2号柜电表数") {
                    return {
                        name: item.name,
                        type: "line",
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                },
                            },
                        },
                        data: item.data.map(item=>{return (item * (800/5)).toFixed(2)}),
                    };
                }else if (item.name == "3号柜电表数") {
                    return {
                        name: item.name,
                        type: "line",
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                },
                            },
                        },
                        data: item.data.map(item=>{return (item * (500/5)).toFixed(2)}),
                    };
                }else if (item.name == "4号柜电表数"){
                     return {
                        name: item.name,
                        type: "line",
                        smooth: true,
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2,
                                },
                            },
                        },
                        data: item.data.map(item=>{return (item * (600/5)).toFixed(2)}),
                    };
                }
            });
            this.option.legend.data = dataList.map((item, index) => {
                return item.name;
            });
            this.option.xAxis.data = this.data.map((item, index) => {
                return this.moment(item[0].recordDate).format("HH:00");
            });
            this.setOptions();
        },
    },
    watch: {
        data(newValue, oldValue) {
            this.getDataList();
        },
        deep: true,
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