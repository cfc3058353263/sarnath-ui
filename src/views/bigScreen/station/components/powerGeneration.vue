<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="title">
            <span class="ml5">发电情况</span>
        </div>
        <div class="flex-1 flex flex-v wh100 cander">
            <div class="canderTop">
                <span class="leftButton" @click="leftButton">
                    < </span>
                        <span>{{dateTime}}</span>
                        <span class="rightButton" @click="rightButton"> ></span>
            </div>
            <div class="flex-1">
                <div id="canderCharts" class="wh100"></div>
            </div>
            <div class="canderExplain">
                <img :src="require('../../../../assets/images/bigScreen/station/5.png')" :width="fontSize*0.4" :height="fontSize*0.2" style="margin-left: 10px;" /> <span>无数据</span>
                <img :src="require('../../../../assets/images/bigScreen/station/8.png')" :width="fontSize*0.4" :height="fontSize*0.2" style="margin-left: 10px;" /> <span>低于上月均值的90%</span>
                <br/>
                <img :src="require('../../../../assets/images/bigScreen/station/7.png')" :width="fontSize*0.4" :height="fontSize*0.2" style="margin-left: 10px;" /> <span>处在上月均值的90%~110%范围内</span>
                <img :src="require('../../../../assets/images/bigScreen/station/6.png')" :width="fontSize*0.4" :height="fontSize*0.2" style="margin-left: 10px;" /> <span>高于上月均值的110%</span>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/views/dashboard/mixins/resize";

export default {
    mixins: [resize],
    props: {
        data: {
            type: Array,
            default: {},
        },
        stationInfoWs: {
            default: null,
        },
        fontSize: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            chart: null,
            dateTime: this.moment().format("YYYY-MM"),
            option:null,
        };
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.initChart();
        // });
    },
    methods: {
        initChart() {
            let mapDiv = document.getElementById("canderCharts");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                tooltip: {
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                    formatter: function (params) {
                        if (params.value[1] <= 0) {
                            return "无数据";
                        } else {
                            return (
                                "发电量: " +
                                (params.value[1] / 10000).toFixed(2) +
                                "万kWh"
                            );
                        }
                    },
                },
                grid: {
                    top: 50,
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 3,
                    calculable: true,
                    seriesIndex: [1],
                    orient: "horizontal",
                    left: "center",
                    bottom: 20,
                    inRange: {
                        color: ["#848fac", "red", "#fe9900","#009900"],
                        opacity: 1,
                    },
                    controller: {
                        inRange: {
                            opacity: 1,
                        },
                    },
                },

                calendar: [
                    {
                        left: "center",
                        top: "20%",
                        cellSize: "auto",
                        yearLabel: { show: false },
                        orient: "vertical",
                        dayLabel: {
                            firstDay: 1,
                            nameMap: "cn",
                            color: "#fff",
                        },
                        monthLabel: {
                            show: false,
                        },
                        range: "2022-02",
                    },
                ],

                series: [
                    {
                        type: "scatter",
                        coordinateSystem: "calendar",
                        symbolSize: 1,
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    var d = echarts.number.parseDate(
                                        params.value[0]
                                    );
                                    return d.getDate();
                                },
                                textStyle: {
                                    color: "#ffffff",
                                    fontSize: fontSize * 0.35,
                                },
                            },
                        },
                        tooltip:{
                            show:false
                        },
                        data: [
                            // 数组第二位必须要有个值
                            ["2022-02-01", 0],
                            ["2022-02-02", 0],
                            ["2022-02-03", 0],
                            ["2022-02-04", 0],
                            ["2022-02-05", 0],
                            ["2022-02-06", 0],
                            ["2022-02-07", 0],
                            ["2022-02-08", 0],
                            ["2022-02-09", 0],
                            ["2022-02-10", 0],
                            ["2022-02-11", 0],
                            ["2022-02-12", 0],
                            ["2022-02-13", 0],
                            ["2022-02-14", 0],
                            ["2022-02-15", 0],
                            ["2022-02-16", 0],
                            ["2022-02-17", 0],
                            ["2022-02-18", 0],
                            ["2022-02-19", 0],
                            ["2022-02-20", 0],
                            ["2022-02-21", 0],
                            ["2022-02-22", 0],
                            ["2022-02-23", 0],
                            ["2022-02-24", 0],
                            ["2022-02-25", 0],
                            ["2022-02-26", 0],
                            ["2022-02-27", 0],
                            ["2022-02-28", 0],
                        ],
                    },
                    {
                        name: "发电量",
                        type: "heatmap",
                        coordinateSystem: "calendar",
                        data: [
                            // 对比第三位 -1 - 2 之间进行颜色判断
                            ["2022-02-01", -1, -1],
                            ["2022-02-02", -1, -1],
                            ["2022-02-03", -1, -1],
                            ["2022-02-04", -1, -1],
                            ["2022-02-05", -1, -1],
                            ["2022-02-06", -1, -1],
                            ["2022-02-07", -1, -1],
                            ["2022-02-08", -1, -1],
                            ["2022-02-09", -1, -1],
                            ["2022-02-10", -1, -1],
                            ["2022-02-11", -1, -1],
                            ["2022-02-12", -1, -1],
                            ["2022-02-13", -1, -1],
                            ["2022-02-14", -1, -1],
                            ["2022-02-15", -1, -1],
                            ["2022-02-16", -1, -1],
                            ["2022-02-17", -1, -1],
                            ["2022-02-18", -1, -1],
                            ["2022-02-19", -1, -1],
                            ["2022-02-20", -1, -1],
                            ["2022-02-21", -1, -1],
                            ["2022-02-22", -1, -1],
                            ["2022-02-23", -1, -1],
                            ["2022-02-24", -1, -1],
                            ["2022-02-25", -1, -1],
                            ["2022-02-26", -1, -1],
                            ["2022-02-27", -1, -1],
                            ["2022-02-28", -1, -1],
                        ],
                    },
                ],
            };
            return option;
        },
        leftButton() {
            this.stationInfoWs.send(
                JSON.stringify({
                    stationId: +this.$route.query.stationId,
                    userId: this.$store.getters.userId,
                    params: {
                        sign: 201,
                        date: this.moment(this.dateTime)
                            .subtract(1, "months")
                            .format("YYYY-MM"),
                    },
                })
            );
            this.dateTime = this.moment(this.dateTime)
                .subtract(1, "months")
                .format("YYYY-MM");
        },
        rightButton() {
            this.stationInfoWs.send(
                JSON.stringify({
                    stationId: +this.$route.query.stationId,
                    userId: this.$store.getters.userId,
                    params: {
                        sign: 201,
                        date: this.moment(this.dateTime)
                            .add(1, "months")
                            .format("YYYY-MM"),
                    },
                })
            );
            this.dateTime = this.moment(this.dateTime)
                .add(1, "months")
                .format("YYYY-MM");
        },
        getDataList() {
            let dataList = this.data.map((item) => {
                return [
                    this.moment(item.date).format("YYYY-MM-DD"),
                    item.value,
                    item.flag,
                ];
            });
            let dateList = this.data.map((item) => {
                return [this.moment(item.date).format("YYYY-MM-DD"), 0];
            });
            this.option.series[0].data = dateList;
            this.option.series[1].data = dataList;
            this.option.calendar[0].range = this.dateTime;
            this.setOptions();
        },
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                this.getDataList();
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

<style scoped lang="scss">
.title {
    padding: 10px;
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
}
.cander {
    padding: 0 10px 10px 10px;
    .canderTop {
        width: 100%;
        text-align: right;
        color: #fff;
        font-size: 0.4rem;
        .leftButton {
            color: #6b6f7b;
            font-weight: 600;
            cursor: pointer;
        }
        .rightButton {
            color: #6b6f7b;
            font-weight: 600;
            cursor: pointer;
        }
    }
    .canderExplain {
        color: #fff;
        font-size: 0.3rem;
    }
}
</style>