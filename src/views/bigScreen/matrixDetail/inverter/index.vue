<template>
    <div class="inverterHome flex flex-1 flex-v">
        <el-scrollbar style="height:100%;width:100%;position: absolute;color:#efefef;top:0;left:0;">
            <div style="padding:0.5rem 1rem 0">
                <div class="flex-v flex inverterStatus">
                    <div class="inverterTitle">逆变器单元状态</div>
                    <div class="flex-1 index flex">
                        <div class="flex-1 flex status">
                            <div class="flex-1 flex flex-v flex-pack-justify" style="padding:1rem">
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">正常运行</span>
                                        <span class="fault">{{data && data.normalRunNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data &&data.normalRunNum ? (data.normalRunNum / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                                </div>
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">正常停机</span>
                                        <span class="fault">{{data && data.normalShutNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data && data.normalShutNum ? (data.normalShutNum / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#e60012" :text-inside="true"></el-progress>
                                </div>
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">故障停机</span>
                                        <span class="fault">{{data && data.faultShutNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data && data.faultShutNum ? (data.faultShutNum / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#e60012" :text-inside="true"></el-progress>
                                </div>
                            </div>
                            <div class="flex-1 flex flex-v flex-pack-justify" style="padding:1rem">
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">告警运行</span>
                                        <span class="fault">{{data && data.warnRunNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data && data.warnRunNUm ? (data.warnRunNUm / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#e8ed88" :text-inside="true"></el-progress>
                                </div>
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">降额运行</span>
                                        <span class="fault">{{data && data.reduceRunNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data && data.reduceRunNum ? (data.reduceRunNum / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#e60012" :text-inside="true"></el-progress>
                                </div>
                                <div>
                                    <div class="flex flex-pack-justify">
                                        <span class="fault">通讯故障</span>
                                        <span class="fault">{{data && data.communiFaultNum}}个</span>
                                    </div>
                                    <el-progress style="font-size:0.5rem" :percentage="data && data.communiFaultNum ? (data.communiFaultNum / data.inverterUnitList.length) * 100 : 0" :stroke-width="12" color="#e60012" :text-inside="true"></el-progress>
                                </div>
                            </div>
                        </div>
                        <div class="flex-1 flex flex-v echarts">
                            <div class="flex-1">
                                <div id="inverterEcharts" class="wh100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex-v flex inverter">
                    <div class="inverterTitle">逆变器单元数据</div>
                    <div class="inverterIndex">
                        <el-row :gutter="10" class="wh100">
                            <el-col v-for="(item,index) of data && data.inverterUnitList" :key="index" :span="8" style="text-align:center">
                                <div class="device flex flex-v flex-1">
                                    <div class="flex-1 flex">
                                        <div class="status flex flex-v flex-align-center flex-pack-around">
                                            <div class="name">{{item.deviceName}}</div>
                                            <el-image :src="require('../../../../assets/images/bigScreen/inverter/inverter.png')" fit="cover" style="cursor: pointer;" @click="link(item)"></el-image>
                                            <div class="normalName">{{statusFormat(item.status)}}</div>
                                            <div class="normalName" :style="{background:diffMM(item.lastDate) > 30 ? '#809fb8' : 'none'}">{{moment(item.lastDate).format("YYYY-MM-DD HH:mm:ss")}}</div>
                                        </div>
                                        <div class="parameter flex-1 flex flex-v flex-pack-around">
                                            <el-row :gutter="10" class="flex-1 flex">
                                                <el-col :span="12" class="flex flex-1 flex-v flex-pack-around">
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">日发电量:</span>
                                                            <span class="indexUnit flex-2">{{item.dayKwh}}</span>
                                                            <span class="indexUnit flex-1">kWh</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">月发电量:</span>
                                                            <span class="indexUnit flex-2">{{item.monthKwh}}</span>
                                                            <span class="indexUnit flex-1">kWh</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">年发电量:</span>
                                                            <span class="indexUnit flex-2">{{item.yearKwh}}</span>
                                                            <span class="indexUnit flex-1">kWh</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">总发电量:</span>
                                                            <span class="indexUnit flex-2">{{item.totalRunTime}}</span>
                                                            <span class="indexUnit flex-1">kWh</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">二氧化碳减排:</span>
                                                            <span class="indexUnit flex-2">{{item.carbonDioxide}}</span>
                                                            <span class="indexUnit flex-1">t</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">日并网分钟:</span>
                                                            <span class="indexUnit flex-2">{{item.dayNetMin}}</span>
                                                            <span class="indexUnit flex-1">分</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">总运行时间:</span>
                                                            <span class="indexUnit flex-2">{{item.totalRunTime}}</span>
                                                            <span class="indexUnit flex-1">分</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">效率:</span>
                                                            <span class="indexUnit flex-2">{{(item.efficiency) * 100}}</span>
                                                            <span class="indexUnit flex-1">%</span>
                                                        </div>
                                                    </el-col>
                                                </el-col>
                                                <el-col :span="12" class="flex flex-1 flex-v flex-pack-around">
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">直流电压:</span>
                                                            <span class="indexUnit flex-2">{{item.dcVoltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">直流电流:</span>
                                                            <span class="indexUnit flex-2">{{item.directCurrent}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">A相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.aElectric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">B相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.bElectric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">C相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.vElectric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">有功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.activePower}}</span>
                                                            <span class="indexUnit flex-1">kw</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">无功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.reactivePower}}</span>
                                                            <span class="indexUnit flex-1">kw</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-3">电网频率:</span>
                                                            <span class="indexUnit flex-2">{{item.frequency}}</span>
                                                            <span class="indexUnit flex-1">HZ</span>
                                                        </div>
                                                    </el-col>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <BoxChange :data="boxChangeData" :fontSize="fontSize" />
        </el-scrollbar>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
import BoxChange from "../boxChange";
const colors = ["#07e3b6", "#ddd83c", "#2495fe"];
export default {
    mixins: [resize],
    components: {
        BoxChange,
    },
    props: {
        dayKwhList: {
            default: null,
        },
        data: {
            default: null,
        },
        boxChangeData: {
            default: null,
        },
        fontSize: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            form: {
                status: 1,
                keyword: "",
                current: 0.1,
            },
            currentIndex: 2,
            options: [],
            option: null,
            statusOptions:[]
        };
    },
    methods: {
      diffMM(date) {
        let startDate = this.moment(date).format("YYYY-MM-DD HH:mm:ss");
        let endDate = this.moment().format("YYYY-MM-DD HH:mm:ss");
        return this.moment(endDate).diff(startDate, "minutes");
      },
        changeColor(index) {
            this.currentIndex = index;
        },
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
                    left: "8%",
                    right: "6%",
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
                        name: "发电量",
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
                                // show:true,
                                fontSize: fontSize * 0.35,
                            },
                            formatter: "{value} ",
                        },
                    },
                    {
                        type: "value",
                        name: "辐照量",
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
        link(item) {
            this.$router.push({
                path: "inverterDetail",
                query: {
                    stationId: this.$route.query.stationId,
                    matrixId: +this.$route.query.matrixId,
                    inverterUnitId: item.deviceId,
                },
            });
        },
        getDayKwhList(list) {
            let hourList = [];
            let data = [];
            let dataPlan = [];
            list.map((item) => {
                hourList.push(this.moment(item.date).format("H") + "时");
                data.push(item.kwh);
                dataPlan.push(item.irradiation);
            });
            this.option.xAxis[0].data = hourList;
            this.option.series[0].data = data;
            this.option.series[1].data = dataPlan;
            this.setOptions();
        },
        // 菜单状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row);
        },
    },
    created() {
        this.getDicts("sys_inverter_status").then((response) => {
            this.statusOptions = response.data;
        });
    },
    mounted() {
        this.$nextTick(() => {
            this.option = this.setOption(this.fontSize);
            this.initChart();
        });
    },
    watch: {
        dayKwhList: {
            handler(newVal, oldVal) {
                this.getDayKwhList(newVal);
            },
        },
        fontSize: {
            handler(newVal, oldVal) {},
        },
    },
};
</script>

<style lang="scss" scoped>
.inverterHome {
    padding: 1rem;
    // padding: 0.5rem 1rem;
    position: relative;
    .inverterTitle {
        font-size: 0.4rem;
        color: #00ffe5;
        font-weight: 600;
        padding-bottom: 0.1rem;
    }
    .inverterStatus {
        overflow: hidden;
        height: 8rem;
        .index {
            background: rgb(0, 13, 52, 0.5);
            padding: 0.5rem 1rem;
        }
        .status {
            border: 3px solid #00446b;
            font-size: 0.35rem;
            color: #fff;
            margin-right: 0.5rem;
        }
        .echarts {
            font-size: 0.4rem;
            margin-right: 0.5rem;
            .dateStyle {
                padding: 0 0.1rem;
                background-color: #004383;
                cursor: pointer;
                width: 2rem;
                text-align: center;
                color: #fff;
            }
            .active {
                background-color: #00aeff;
            }
        }
    }

    .inverter {
        overflow: hidden;
        .norm {
            font-size: 0.3rem;
            color: #fff;
            height: 0.5rem;
            .borderNormal {
                border-left: 5px solid #00f416;
                padding: 0 20px 0 5px;
            }
            .borderZero {
                border-left: 5px solid #e60012;
                padding: 0 20px 0 5px;
            }
            .borderLow {
                border-left: 5px solid #fff100;
                padding: 0 20px 0 5px;
            }
            .borderInterrupt {
                border-left: 5px solid #9fa0a0;
                padding: 0 20px 0 5px;
            }
        }
        .inverterIndex {
            background: rgb(0, 13, 52, 0.5);
            padding: 0.5rem 1rem;
            position: relative;
            ::v-deep .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            ::v-deep .el-scrollbar__bar.is-vertical {
                top: 10px;
            }
            .device {
                border: 2px solid #00446b;
                padding: 0.2rem 0.5rem;
                margin-top: 0.2rem;
                max-width: 15.8rem;
                .name {
                    font-size: 0.35rem;
                    color: #fff;
                    text-align: center;
                    margin-bottom: 0.3rem;
                }
                .status {
                    padding-right: 0.2rem;
                    .normalName {
                        font-size: 0.4rem;
                        color: #00f416;
                    }
                }
                .parameter {
                    padding-left: 0.2rem;
                    font-size: 0.35rem;
                    color: #0083c9;
                    .indexUnit {
                        color: #fff;
                    }
                }
            }
        }
    }
}
//查询
::v-deep .el-form {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
}
::v-deep .el-form-item {
    margin-bottom: 0;
    display: flex;
    align-items: center;
}
::v-deep .el-form-item__label {
    color: #8089a5;
    font-size: 0.35rem;
}
::v-deep .el-input--medium .el-input__inner {
    background: none;
    color: #fff;
    border: 1px solid #0681a0;
    border-radius: 0;
    height: 0.8rem;
    // width: 4rem;
    font-size: 0.35rem;
}
::v-deep .el-range-editor--medium .el-range-input {
    background: #08698f;
    color: #c0c4cc;
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
::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
}
::v-deep .el-scrollbar__bar.is-vertical {
    top: 10px;
}
</style>
