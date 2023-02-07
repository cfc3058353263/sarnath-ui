<template>
    <div class="container flex flex-v">
        <div class="rightButton" style="margin-right:10px;">
            <router-link to>
                <div class="dateStyle flex flex-pack-around" style="align-items: center;" @click="$router.back(-1)">
                    <el-image style="height: 0.4rem;" :src="require('../../../../assets/images/bigScreen/station/back.png')" fit="fill" @click="$router.go(-1)"></el-image>
                    <span>返回</span>
                </div>
            </router-link>
        </div>
        <div class="flex-1 flex index bgStyle">
            <div class="flex-1">
                <div id="inverterEcharts" class="wh100"></div>
            </div>
        </div>
        <div class="flex-1 flex flex-v index">
            <div class="flex title flex-align-center flex-pack-justify">
                <el-image class="imgStyle" :src="require('../../../../assets/images/bigScreen/inverter/titleImg.png')"></el-image>
                <div class="leftTitle">
                    汇流箱实时电流
                </div>
                <div class="flex rightTitle">
                    <div class="flex flex-align-center">
                        <div class="under"></div>
                        <span>偏低</span>
                    </div>
                    <div class="flex flex-align-center" style="margin-left:0.5rem">
                        <div class="zeroValue"></div>
                        <span>异常</span>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex index" ref="tableRef">
                <el-table v-loading="loading" :height="tableHeight" :data="tableData" border style="width: 100%;color:#fff;">
                  <el-table-column :min-width="fontSize * 5" align="center" prop="lastDate" label="时间">
                    <template slot-scope="scope">
                      <span :style="{background:diffMM(scope.row.lastDate) > 30 ? '#809fb8' : 'none'}">{{moment(scope.row.lastDate).format("YYYY-MM-DD HH:mm:ss")}}</span>
                    </template>
                  </el-table-column>
                    <el-table-column :min-width="fontSize * 4" align="center" prop="汇流箱名称" label="汇流箱名称">
                        <template slot-scope="scope">
                            <span>{{scope.row["汇流箱名称"]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :min-width="fontSize * 3" align="center" prop="母线电压" label="母线电压(V)">
                    </el-table-column>
                    <el-table-column :min-width="fontSize * 3" align="center" prop="总电流" label="总电流(A)">
                    </el-table-column>
                    <el-table-column :min-width="fontSize * 3" align="center" prop="平均电流" label="平均电流(A)">
                    </el-table-column>
                    <el-table-column :min-width="fontSize * 4" align="center" prop="总功率" label="总功率(kw)">
                    </el-table-column>
                    <el-table-column v-for="(item,index) of nameList" :key="index" :min-width="fontSize * 4" align="center" :prop="item" :label="item">
                        <template slot-scope="scope">
                            <div v-if="moment().format('H') > 6 &&moment().format('H') < 16" class="wh100" :style="{background:scope.row[item] > 0 && scope.row[item] <= scope.row['平均电流(A)'] / 2 ? '#bfba13' : (scope.row[item] <= 0 ? '#b21a2e' : 'none')}">{{scope.row[item]}}</div>
                            <div v-else class="wh100" :style="{background:scope.row[item] <= 0 ? '#b21a2e' : 'none'}">{{scope.row[item]}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <NavRight />
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
import { sendWebsocket } from "@/utils/websocket.js";
import NavRight from "@/components/navRight";

const colors = ["#07e3b6", "#ddd83c", "#2495fe"];
export default {
    components: {
        NavRight,
    },
    mixins: [resize],
    data() {
        return {
            currentIndex: 2,
            fontSize: null,
            option: null,
            tableHeight: null,
            loading: false,
            tableData: null,
            nameList: null,
        };
    },
    methods: {
        initChart() {
            let mapDiv = document.getElementById("inverterEcharts");
            this.chart = echarts.init(mapDiv);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                color: colors,
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
                    left: "6%",
                    right: "12%",
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
        /**字体大小计算 */
        fontSizeCompute() {
            let width = document.body.clientWidth;
            if (width >= 1200) {
                let fontsize = (width / 1920) * 40;
                this.fontSize = fontsize;
                document.getElementsByTagName("html")[0].style.fontSize =
                    fontsize + "px";
            } else {
                this.fontSize = 40;
            }
            window.onresize = () => {
                return (() => {
                    let width = document.body.clientWidth;
                    if (width >= 1200) {
                        let fontsize = (width / 1920) * 40;
                        this.fontSize = fontsize;
                        document.getElementsByTagName(
                            "html"
                        )[0].style.fontSize = fontsize + "px";
                    } else {
                        this.fontSize = 40;
                    }
                })();
            };
        },
      diffMM(date) {
        let startDate = this.moment(date).format("YYYY-MM-DD HH:mm:ss");
        let endDate = this.moment().format("YYYY-MM-DD HH:mm:ss");
        return this.moment(endDate).diff(startDate, "minutes");
      },
        wsMessage(data) {
            var reg = /^I/;
            let nameList = [];
            for (let item of data.combinerBoxDataList) {
                let list = [];
                for (let name in item) {
                    if (name.match(reg)) {
                        list.push(name);
                        if (list.length > nameList.length) {
                            nameList = list;
                        }
                    }
                }
            }
            this.nameList = nameList;
            this.tableData = data.combinerBoxDataList;
            let list = data.dayKwhList;
            let hourList = [];
            let kwh = [];
            let dataPlan = [];
            list.map((item) => {
                hourList.push(this.moment(item.date).format("H") + "时");
                kwh.push(item.kwh);
                dataPlan.push(item.irradiation);
            });
            this.option.xAxis[0].data = hourList;
            this.option.series[0].data = kwh;
            this.option.series[1].data = dataPlan;
            this.setOptions();
        },
    },
    mounted() {
        this.$store.commit("SET_CURRENTINDEX", 2);
        this.fontSizeCompute();
        this.matrixDetail = sendWebsocket(
            "/system/websocket/combinerBox",
            {
                stationId: +this.$route.query.stationId,
                matrixId: +this.$route.query.matrixId,
                inverterUnitId: +this.$route.query.inverterUnitId,
            },
            this.wsMessage,
            null
        );
        this.$nextTick(() => {
            this.tableHeight = this.$refs.tableRef.clientHeight - this.fontSize;
        });
        window.onresize = () => {
            this.tableHeight = this.$refs.tableRef.offsetHeight;
        };
    },
    beforeDestroy() {
        document.getElementsByTagName("html")[0].style.fontSize = "16px";
    },
    watch: {
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
.container {
    width: 100%;
    height: 100%;
    background-image: url("../../../../assets/images/bigScreen/matrix/background.jpg");
    background-size: 100% 100%;
    padding: 1rem;
    .bgStyle {
        background: rgb(0, 13, 52, 0.5);
        // padding: 0.5rem 1rem;
    }
    .rightButton {
        color: #fff;
        z-index: 999;
        font-size: 0.4rem;
        .dateStyle {
            float: right;
            padding: 0 0.1rem;
            background-color: #004383;
            cursor: pointer;
            width: 2rem;
            text-align: center;
            border-radius: 4px;
        }
        .active {
            background-color: #00aeff;
        }
    }
    .title {
        font-size: 0.5rem;
        color: #fff;
        width: 100%;
        position: relative;
        margin: 0.5rem 0;
        .imgStyle {
            position: absolute;
        }
        .leftTitle {
            z-index: 999;
            margin-left: 0.2rem;
        }
        .under {
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            background: #bfba13;
            margin-right: 0.3rem;
        }
        .zeroValue {
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            background: #b21a2e;
            margin-right: 0.3rem;
        }
    }
    .index {
        overflow: hidden;
    }
    //滑动
    ::v-deep .el-scrollbar .el-scrollbar__wrap {
        overflow-x: hidden !important;
    }

    // // 滚动条整体样式
    ::-webkit-scrollbar {
        height: 12px;
    }
    // 定义滑块颜色、内阴影及圆角
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #36b3cd;
    }
    //滑动槽的背景颜色
    ::-webkit-scrollbar-track-piece {
        border-radius: 10px;
        background-color: #142a37;
    }
    //按钮
    .btnSearch {
        background: #00aeff;
        border: 1px solid #0681a0;
        border-radius: 0;
        width: 2.8rem;
        height: 0.8rem;
        font-size: 0.35rem;
    }

    //table
    .el-table {
        background: none;
    }
    ::v-deep .el-table tr {
        background: none;
    }
    ::v-deep .el-table__header-wrapper th {
        background: #003e71;
        color: #d4e6f5;
        font-size: 0.45rem;
        height: 1rem;
        line-height: 1rem;
        border-bottom: 1px solid #809fb8;
        border-right: 1px solid #809fb8;
    }
    ::v-deep .el-table--border td {
        border-right: 1px solid #809fb8;
    }
    ::v-deep .el-table .cell {
        color: #d4e6f5;
        font-size: 0.4rem;
        height: 0.8rem;
        line-height: 0.8rem;
    }
    .el-table::before,
    .el-table--group::after,
    .el-table--border::after {
        background-color: #809fb8;
    }
    ::v-deep .el-table--group,
    .el-table--border {
        border: 1px solid #809fb8;
        border-left: 2px solid #809fb8 !important;
        border-top: 2px solid #809fb8 !important;
    }

    ::v-deep .el-table--border .el-table__cell {
        border-right: 1px solid #809fb8;
        border-bottom: 1px solid #809fb8;
        background-color: #07648a;
        background: rgba(0, 0, 0, 0.35) !important;
    }
    ::v-deep .el-table tbody tr:hover > td {
        background-color: #0681a0;
    }
}
</style>
