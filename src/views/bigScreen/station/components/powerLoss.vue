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
            totalLoss: null,
            echartsIdex: 0,
            interval: null,
        };
    },
    mounted() {},
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("powerLoss");
            this.chart = echarts.init(mapDiv);
            this.chart.setOption(this.option);
            this.echartsInterval();
            let self = this;
            this.chart.on("mouseover", function (e) {
                clearInterval(self.interval);
                self.stationName = e.data.name;
                // self.color = e.data.itemStyle.color;
                if (self.echartsIdex === 0) {
                    self.chart.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                        dataIndex: 0,
                    });
                } else {
                    self.chart.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                        dataIndex: self.echartsIdex - 1,
                    });
                }
                self.chart.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: e.dataIndex,
                });
            });
            //当鼠标离开时，把当前项置为选中
            this.chart.on("mouseout", function (e) {
                self.echartsIdex = e.dataIndex + 1;
                self.chart.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: e.dataIndex,
                });
                self.echartsInterval();
            });
            // let index = 0;
            // this.chart.dispatchAction({
            //     type: "highlight",
            //     seriesIndex: 0,
            //     dataIndex: 0,
            // });
            // // 当鼠标移入时，如果不是第一项，则把当前项置为选中，如果是第一项，则设置第一项为当前项
            // let self = this;
            // this.chart.on("mouseover", function (e) {
            //     self.stationName = e.data.name;
            //     self.color = e.data.itemStyle.color;
            //     if (e.dataIndex != index) {
            //         self.chart.dispatchAction({
            //             type: "downplay",
            //             seriesIndex: 0,
            //             dataIndex: index,
            //         });
            //     }
            //     if (e.dataIndex == 0) {
            //         self.chart.dispatchAction({
            //             type: "highlight",
            //             seriesIndex: 0,
            //             dataIndex: e.dataIndex,
            //         });
            //     }
            // });
            // //当鼠标离开时，把当前项置为选中
            // this.chart.on("mouseout", function (e) {
            //     index = e.dataIndex;
            //     self.chart.dispatchAction({
            //         type: "highlight",
            //         seriesIndex: 0,
            //         dataIndex: e.dataIndex,
            //     });
            // });
            // setInterval(() => {
            //     if (index > this.option.series[0].data.length) {
            //         index = 0;
            //     }
            //     self.chart.dispatchAction({
            //         type: "downplay",
            //         seriesIndex: 0,
            //         dataIndex: index,
            //     });
            //     index++;
            //     self.chart.dispatchAction({
            //         type: "highlight",
            //         seriesIndex: 0,
            //         dataIndex: index,
            //     });
            // }, 3000);
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let self = this
            let option = {
                tooltip: {
                    trigger: "item",
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                legend: {
                    orient: "vertical",
                    left: "100",
                    top: "center",
                    textStyle: {
                        color: "#fff",
                        fontSize: fontSize * 0.35,
                    },
                },
                emphasis: {
                    label: {
                        show: false,
                    },
                },
                series: [
                    {
                        type: "pie",
                        radius: ["45%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: fontSize * 0.3,
                                fontWeight: "bold",
                                color: "#fff",
                                formatter: (e) => {
                                    let proportion = e.data.totalLoss === 0 ? 0 : e.data.value / e.data.totalLoss * 100
                                    return (
                                        e.name +
                                        "\n" +
                                        "损失：" +
                                        e.data.value +
                                        "kWh" +
                                        "\n" +
                                        "占比：" + proportion.toFixed(2) +"%"
                                    );
                                },
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        left: "200",
                        data: [
                            {
                                value: 0,
                                name: "逆变器",
                                // itemStyle: { normal: { color: "#ff5454" } },
                            },
                            {
                                value: 0,
                                name: "汇流箱",
                                // itemStyle: { normal: { color: "#ff8955" } },
                            },
                            {
                                value: 0,
                                name: "箱变",
                                // itemStyle: { normal: { color: "#ffd200" } },
                            },
                            // {
                            //     value: 0,
                            //     name: "直流汇流箱",
                            //     itemStyle: { normal: { color: "#00eacb" } },
                            // },
                            // {
                            //     value: 0,
                            //     name: "组串式逆变器",
                            //     itemStyle: { normal: { color: "#00b4ff" } },
                            // },
                            // {
                            //     value: 0,
                            //     name: "风机",
                            //     itemStyle: { normal: { color: "#1c68da" } },
                            // },
                        ],
                    },
                ],
            };
            return option;
        },
        //定时器
        echartsInterval() {
            let self = this;
            self.interval = setInterval(() => {
                if (self.echartsIdex == this.option.series[0].data.length) {
                    self.chart.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                        dataIndex: self.echartsIdex - 1,
                    });
                    self.echartsIdex = 0;
                    self.chart.dispatchAction({
                        type: "highlight",
                        seriesIndex: 0,
                        dataIndex: self.echartsIdex,
                    });
                    self.stationName =
                        this.option.series[0].data[self.echartsIdex].name;
                    self.echartsIdex = self.echartsIdex + 1;
                } else {
                    self.chart.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                        dataIndex: self.echartsIdex - 1,
                    });
                    self.chart.dispatchAction({
                        type: "highlight",
                        seriesIndex: 0,
                        dataIndex: self.echartsIdex,
                    });
                    self.stationName =
                        this.option.series[0].data[self.echartsIdex].name;
                    self.echartsIdex = self.echartsIdex + 1;
                }
            }, 3000);
        },
        getEchartsData(list) {
            let data = [];
            let totalLoss = 0;
            for (let item of list) {
                data.push({ name: item.deviceTypeLabel, value: item.lossKwh });
                totalLoss = totalLoss + item.lossKwh;
            }
                this.totalLoss = totalLoss;
            for(let item of data){
                item["totalLoss"] = totalLoss
            }
            this.option.series[0].data = data;
            this.setOptions();
        },
    },
    watch: {
        monthLossKwhList: {
            handler(newVal, oldVal) {
                this.getEchartsData(newVal);
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
    beforeDestroy() {
        clearInterval();
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
