<template>
    <div class="flex flex-1 flex-v">
        <div class="topTitle flex">
            <div class="flex flex-1 flex-pack-justify">
                <span class="titleName">运维统计</span>
                <div class="titleData">
                    <span style="font-size:0.4rem">设备总数 </span>
                    <span>{{deviceTotalNum&&deviceTotalNum}}</span>
                </div>
            </div>
        </div>
        <div class="flex-1 flex">
            <div class="flex-1">
                <div id="operatEcharts" class="wh100"></div>
            </div>
            <div class="flex-1 flex flex-v" style="padding:0.3rem 0">
                <div class="flex-1 flex flex-v flex-pack-center">
                    <div class="fault" @click="()=>{stationfault && +(stationfault[stationName].combinerBoxInfo.abnormalNum) > 0 ?  link() : null}" :style="{color:color}">汇流箱故障（{{stationfault && ((stationfault[stationName] && stationfault[stationName].combinerBoxInfo.abnormalNum)+ "/" + (stationfault[stationName] && stationfault[stationName].combinerBoxInfo.totalNum))}}）</div>
                    <el-progress style="font-size:0.5rem" :percentage=" stationfault && stationfault[stationName] && stationfault[stationName].combinerBoxInfo.abnormalNum !== 0 ? (stationfault[stationName].combinerBoxInfo.abnormalNum) / (stationfault[stationName].combinerBoxInfo.totalNum) * 100 : 0" :stroke-width="12" :color="color" :text-inside="true"></el-progress>
                </div>
                <div class="flex-1 flex flex-v flex-pack-center">
                    <div class="fault" @click="()=>{stationfault && +(stationfault[stationName].boxTransformerInfo.abnormalNum) > 0 ?  link() : null}" :style="{color:color}">逆变器故障（{{stationfault && ((stationfault[stationName] && stationfault[stationName].boxTransformerInfo.abnormalNum) + "/" + (stationfault[stationName] && stationfault[stationName].boxTransformerInfo.totalNum))}}）</div>
                    <el-progress style="font-size:0.5rem" :percentage="stationfault && stationfault[stationName] && stationfault[stationName].boxTransformerInfo.abnormalNum !== 0 ? (stationfault[stationName].boxTransformerInfo.abnormalNum) / (stationfault[stationName].boxTransformerInfo.totalNum) * 100 : 0" :stroke-width="12" :color="color" :text-inside="true"></el-progress>
                </div>
                <div class="flex-1 flex flex-v flex-pack-center">
                    <div class="fault" @click="()=>{stationfault && +(stationfault[stationName].inverterInfo.abnormalNum) > 0 ?  link() : null}" :style="{color:color}">箱变故障（{{stationfault && ((stationfault[stationName] && stationfault[stationName].inverterInfo.abnormalNum) + "/" + (stationfault[stationName] && stationfault[stationName].inverterInfo.totalNum))}}）</div>
                    <el-progress style="font-size:0.5rem" :percentage="stationfault && stationfault[stationName] && stationfault[stationName].inverterInfo.abnormalNum !== 0 ? (stationfault[stationName].inverterInfo.abnormalNum) / (stationfault[stationName].inverterInfo.totalNum) * 100 : 0" :stroke-width="12" :color="color" :text-inside="true"></el-progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
let colors = ["#6cdabd", "#3fc3d0", "#dd614a", "#f77900", "#f7b61c"];
export default {
    props: {
        fontSize: {
            type: Number,
            default: null,
        },
        stationList: {
            type: Array,
            default: null,
        },
        deviceTotalNum: {
            type: Number,
            default: null,
        },
        operationList: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            option: null,
            stationfault: null,
            stationName: "万华公安光伏电站",
            stationId: null,
            color: "#6cdabd",
            echartsIdex: 0,
            interval: null,
        };
    },
    mounted() {},
    methods: {
        /**echarts 初始化 */
        initChart() {
            let mapDiv = document.getElementById("operatEcharts");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
            this.echartsInterval();
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
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    show: false,
                },
                series: [
                    {
                        // hoverAnimation: false, //触碰动画
                        // tooltip: { //触碰是否显示弹框
                        //     show: false,
                        // },
                        name: "电站设备",
                        type: "pie",
                        radius: ["50%", "70%"],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            //中心显示大小
                            label: {
                                show: true,
                                fontSize: fontSize * 0.3,
                                fontWeight: "bold",
                                color: "#fff",
                            },
                        },
                        // label: {
                        //     //饼图图形上的文本标签
                        //     normal: {
                        //         show: true,
                        //         position: "inner", //标签的位置
                        //         textStyle: {
                        //             fontSize: fontSize * 0.35, //文字的字体大小
                        //             color: "#fff",
                        //         },
                        //         formatter: "{d}%",
                        //     },
                        // },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            // {
                            //     value: 0,
                            //     itemStyle: { normal: { color: "#3fc3d0" } },
                            // },
                            {
                                value: 0,
                                itemStyle: { normal: { color: "#6cdabd" } },
                                name: "",
                            },
                            {
                                value: 0,
                                itemStyle: { normal: { color: "#f7b61c" } },
                                name: "",
                            },
                            {
                                value: 0,
                                itemStyle: { normal: { color: "#f77900" } },
                                name: "",
                            },
                            // {
                            //     value: 0,
                            //     itemStyle: { normal: { color: "#dd614a" } },
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
                    self.color =
                        this.option.series[0].data[
                            self.echartsIdex
                        ].itemStyle.normal.color;
                    self.stationName =
                        this.option.series[0].data[self.echartsIdex].name;
                    self.stationId =
                        this.option.series[0].data[self.echartsIdex].stationId;
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
                    self.color =
                        this.option.series[0].data[
                            self.echartsIdex
                        ].itemStyle.normal.color;
                    self.stationName =
                        this.option.series[0].data[self.echartsIdex].name;
                    self.stationId =
                        this.option.series[0].data[self.echartsIdex].stationId;
                    self.echartsIdex = self.echartsIdex + 1;
                }
            }, 3000);
        },
        link() {
            this.$router.push({
                path: "matrix",
                query: {
                    stationId: this.stationId,
                    stationName: this.stationName,
                },
            });
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", () => {
            this.chart.resize();
        });
        clearInterval();
    },
    watch: {
        operationList: {
            handler(newVal, oldVal) {
                this.option.series[0].data[0].value = newVal.zjFault.completed;
                this.option.series[0].data[0].value = newVal.hlxFault.completed;
                this.option.series[0].data[0].value = newVal.nbqFault.completed;
                this.option.series[0].data[0].value = newVal.xbFault.completed;
                this.option.series[0].data[0].value =
                    newVal.otherFault.completed;
                this.setOptions();
            },
        },
        stationList: {
            handler(newVal, oldVal) {
                console.log(newVal)
                let stationfault = {};
                for (let index in newVal) {
                    this.option.series[0].data[index].value =
                        newVal[index].stationDeviceNum;
                    this.option.series[0].data[index].name =
                        newVal[index].stationName;
                    this.option.series[0].data[index].stationId =
                        newVal[index].stationId;
                    stationfault[newVal[index].stationName] =
                        newVal[index].deviceStatusMap;
                }
                this.stationfault = stationfault;
                this.setOptions();
                // let index = 0;
                this.chart.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: 0,
                });
                // 当鼠标移入时，如果不是第一项，则把当前项置为选中，如果是第一项，则设置第一项为当前项
                let self = this;
                this.chart.on("mouseover", function (e) {
                    clearInterval(self.interval);
                    self.stationName = e.data.name;
                    self.stationId = e.data.stationId;
                    self.color = e.data.itemStyle.color;
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
    .titleData {
        font-size: 0.4rem;
        color: #65c6e7;
        font-weight: 400;
    }
}
::v-deep .el-progress-bar__inner {
    border-radius: 0;
}
::v-deep .el-progress-bar__outer {
    border-radius: 0;
    background-color: rgb(255, 255, 255, 0.1);
}
::v-deep .el-progress-bar__innerText {
    font-size: 0;
}
.fault {
    font-size: 0.35rem;
    cursor: pointer;
}
</style>