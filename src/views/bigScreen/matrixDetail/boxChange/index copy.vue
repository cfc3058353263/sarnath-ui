<template>
    <div class="boxChangeHome flex flex-1 flex-v">
        <div class="flex-1 flex-v flex boxChangeStatus">
            <div class="flex title flex-pack-justify">
                <div class="boxChangeTitle">
                    箱变状态
                </div>
            </div>
            <div class="flex-1 index flex ">
                <!-- <div class="flex-1 flex flex-pack-justify">
                    <div class="flex-1">
                        <div class="flex flex-pack-justify">
                            <span class="fault">断路器合闸信号</span>
                            <span class="fault">{{data && data.circuitBreakerSwitchOn}}台</span>
                        </div>
                        <el-progress style="font-size:0.5rem" :percentage="data &&data.circuitBreakerSwitchOn ? (data.circuitBreakerSwitchOn / data.boxTransformerList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                    </div>
                    <div class="flex-1" style="margin:0 0.5rem">
                        <div class="flex flex-pack-justify">
                            <span class="fault">断路器分闸信号</span>
                            <span class="fault">{{data && data.circuitBreakerOpening}}台</span>
                        </div>
                        <el-progress style="font-size:0.5rem" :percentage="data && data.circuitBreakerOpening ? (data.circuitBreakerOpening / data.boxTransformerList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-pack-justify">
                            <span class="fault">变压器超高温跳闸信号</span>
                            <span class="fault">{{data && data.transformerTripping}}台</span>
                        </div>
                        <el-progress style="font-size:0.5rem" :percentage="data && data.transformerTripping ? (data.transformerTripping / data.boxTransformerList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                    </div>
                    <div class="flex-1" style="margin:0 0.5rem">
                        <div class="flex flex-pack-justify">
                            <span class="fault">变压器超温告警信号</span>
                            <span class="fault">{{data && data.transformerWarn}}台</span>
                        </div>
                        <el-progress style="font-size:0.5rem" :percentage="data && data.transformerWarn ? (data.transformerWarn / data.boxTransformerList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                    </div>
                    <div class="flex-1">
                        <div class="flex flex-pack-justify">
                            <span class="fault">低压短路器故障信号</span>
                            <span class="fault">{{data && data.circuitBreakerFault}}台</span>
                        </div>
                        <el-progress style="font-size:0.5rem" :percentage="data && data.circuitBreakerFault ? (data.circuitBreakerFault / data.boxTransformerList.length) * 100 : 0" :stroke-width="12" color="#00f416" :text-inside="true"></el-progress>
                    </div>
                </div> -->
                <!-- <div class="flex-1 flex flex-pack-around">
                    <div style="font-size:0.6rem;color:#fff">
                        <div>
                            断路器合闸
                        </div>
                        <div class="flex flex-pack-around" v-if="data && data.boxTransformerList.length > 0">
                            <span v-for="index in (+data.circuitBreakerSwitchOn)" :key="index" class="under"></span>
                            <span v-for="index in (data.boxTransformerList.length - (+data.circuitBreakerSwitchOn))" :key="index" class="zeroValue"></span>
                        </div>
                    </div>
                    <div style="font-size:0.6rem;color:#fff">
                        <div>
                            断路器分闸
                        </div>
                        <div class="flex flex-pack-around" v-if="data && data.boxTransformerList.length > 0">
                            <span v-for="index in (+data.circuitBreakerOpening)" :key="index" class="under"></span>
                            <span v-for="index in (data.boxTransformerList.length - (+data.circuitBreakerOpening))" :key="index" class="zeroValue"></span>
                        </div>
                    </div>
                    <div style="font-size:0.6rem;color:#fff">
                        <div>
                            变压器超高温跳闸
                        </div>
                        <div class="flex flex-pack-around" v-if="data && data.boxTransformerList.length > 0">
                            <span v-for="index in (+data.transformerTripping)" :key="index" class="under"></span>
                            <span v-for="index in (data.boxTransformerList.length - (+data.transformerTripping))" :key="index" class="zeroValue"></span>
                        </div>
                    </div>
                    <div style="font-size:0.6rem;color:#fff">
                        <div>
                            变压器超温告警
                        </div>
                        <div class="flex flex-pack-around" v-if="data && data.boxTransformerList.length > 0">
                            <span v-for="index in (+data.transformerWarn)" :key="index" class="under"></span>
                            <span v-for="index in (data.boxTransformerList.length - (+data.transformerWarn))" :key="index" class="zeroValue"></span>
                        </div>
                    </div>
                    <div style="font-size:0.6rem;color:#fff">
                        <div>
                            低压短路器故障
                        </div>
                        <div class="flex flex-pack-around" v-if="data && data.boxTransformerList.length > 0">
                            <span v-for="index in (+data.circuitBreakerFault)" :key="index" class="under"></span>
                            <span v-for="index in (data.boxTransformerList.length - (+data.circuitBreakerFault))" :key="index" class="zeroValue"></span>
                        </div>
                    </div>
                </div> -->
                <div class="flex-1 gaugeEcharts">
                    <div id="boxChangehalt" class="wh100"></div>
                    <div class="status">断路器合闸</div>
                </div>
                <div class="flex-1 gaugeEcharts">
                    <div id="boxChangeNomal" class="wh100"></div>
                    <div class="status">断路器分闸</div>
                </div>
                <div class="flex-1 gaugeEcharts">
                    <div id="boxChangeWarn" class="wh100"></div>
                    <div class="status">变压器超高温跳闸</div>
                </div>
                <div class="flex-1 gaugeEcharts">
                    <div id="boxChangeFault" class="wh100"></div>
                    <div class="status">变压器超温告警</div>
                </div>
                <div class="flex-1 gaugeEcharts">
                    <div id="boxChangeInterrupt" class="wh100"></div>
                    <div class="status">低压短路器故障</div>
                </div>

            </div>
        </div>
        <div class="flex-1 flex-v flex boxChange">
            <div class="boxChangeTitle">箱变设备</div>
            <div class="flex-1 boxChangeIndex flex flex-pack-justify">
                <el-scrollbar style="height:100%;width:100%;position: absolute;color:#efefef;top:0;left:0;">
                    <div style="padding: 0.5rem 1rem;">
                        <el-row :gutter="10">
                            <el-col v-for="(item,index) of data&&data.boxTransformerList" :key="index" :span="12" style="text-align:center">
                                <div class="device flex flex-v flex-1">
                                    <div class="flex-1 flex">
                                        <div class="status flex flex-v flex-align-center flex-pack-around">
                                            <div class="name">{{item.deviceName}}</div>
                                            <el-image :src="require('../../../../assets/images/bigScreen/inverter/inverter.png')" fit="cover"></el-image>
                                            <!-- <div class="normalName">正常运行</div> -->
                                        </div>
                                        <div class="parameter flex-1 flex flex-v flex-pack-around">
                                            <el-row :gutter="10" class="flex-1 flex">
                                                <el-col :span="12" class="flex flex-1 flex-v flex-pack-around">
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧A相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIA1_1A_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧B相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIB1_1B_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧C相电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIC1_1C_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧A相测量电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIA2_2A_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧B相测量电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIB2_2B_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧C相测量电流:</span>
                                                            <span class="indexUnit flex-2">{{item.CIC2_2C_measure_electric}}</span>
                                                            <span class="indexUnit flex-1">A</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧A相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUA1_1A_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧B相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUB1_1B_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧C相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUC1_1C_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧A相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUA2_2A_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                </el-col>
                                                <el-col :span="12" class="flex flex-1 flex-v flex-pack-around">
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧B相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUB2_2B_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧C相测量电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUC2_2C_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧AB相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUAB1_1AB_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧BC相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUBC1_1BC_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧CA相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUCA1_1CA_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧AB相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUAB2_2AB_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧BC相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUBC2_2BC_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">二侧CA相测量线电压:</span>
                                                            <span class="indexUnit flex-2">{{item.CUCA2_2CA_measure_voltage}}</span>
                                                            <span class="indexUnit flex-1">V</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧A相测量有功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CPA1_1A_measure_activePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧B相测量有功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CPB1_1B_measure_activePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                </el-col>
                                                <el-col :span="12" class="flex flex-1 flex-v flex-pack-around">
                                                    <el-col :span="24">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧C相测量有功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CPC1_1C_measure_activePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧3相测量有功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.C3P1_13_measure_activePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧A相测量无功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CQA1_1A_measure_reactivePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧B相测量无功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CQB1_1B_measure_reactivePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧C相测量无功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CQC1_1C_measure_reactivePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧3相测量无功功率:</span>
                                                            <span class="indexUnit flex-2">{{item.C3Q1_13_measure_reactivePower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧A相测量视在功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CSA1_1A_measure_apparentPower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧B相测量视在功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CSB1_1B_measure_apparentPower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧C相测量视在功率:</span>
                                                            <span class="indexUnit flex-2">{{item.CSC1_1C_measure_apparentPower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
                                                        </div>
                                                    </el-col>
                                                    <el-col :span="24" class="flex">
                                                        <div class="flex flex-1 flex-pack-around flex-align-center">
                                                            <span class="flex-8">一侧3相测量视在功率:</span>
                                                            <span class="indexUnit flex-2">{{item.C3S1_13_measure_apparentPower}}</span>
                                                            <span class="indexUnit flex-1">W</span>
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

                </el-scrollbar>
            </div>
        </div>
    </div>
</template>

<script>
const gaugeData = [
    {
        value: 20,
        // name: "Perfect",
        title: {
            offsetCenter: ["0%", "-30%"],
        },
        detail: {
            valueAnimation: true,
            offsetCenter: ["0%", "-20%"],
        },
    },
];
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
const colors = ["#07e3b6", "#00fcff", "#2495fe"];
export default {
    mixins: [resize],
    props: {
        data: {
            default: null,
        },
        fontSize: {
            type: Number,
            default: {},
        },
    },
    data() {
        let self = this;
        return {
            form: {
                status: 1,
                keyword: "",
                current: 0.1,
            },
            currentIndex: 2,
            chart1: null,
            max: 0,
            option1: {
                series: [
                    {
                        type: "gauge",
                        radius: "100%",
                        startAngle: 180,
                        endAngle: 0,
                        pointer: {
                            show: false,
                        },
                        min: 0,
                        max: null,
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: "#051c48",
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#03153e",
                                        },
                                        {
                                            offset: 1,
                                            color: "#00b0ff",
                                        },
                                    ]
                                ),
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [[1, "#051c48"]],
                            },
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 10,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            distance: 0,
                            color: "#fff",
                            fontSize: this.fontSize * 0.5,
                            formatter: function (value) {
                                if (value === 0) {
                                    return "0";
                                } else if (value === self.max) {
                                    return self.max;
                                }
                                return "";
                            },
                        },
                        data: [
                            {
                                value: 0,
                                title: {
                                    offsetCenter: ["0%", "-30%"],
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ["0%", "-20%"],
                                },
                            },
                        ],
                        detail: {
                            width: 80,
                            height: 14,
                            fontSize: this.fontSize * 0.8,
                            color: "#fff",
                            borderColor: "auto",
                            borderRadius: 20,
                            borderWidth: 0,
                            formatter: "{value}台",
                            // function (value) {
                            //     // "{value}台",
                            //     return value+"台"
                            // },
                        },
                    },
                ],
            },
            chart2: null,
            option2: {
                series: [
                    {
                        type: "gauge",
                        radius: "100%",
                        startAngle: 180,
                        endAngle: 0,
                        pointer: {
                            show: false,
                        },
                        min: 0,
                        max: null,
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: "#051c48",
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#051d49",
                                        },
                                        {
                                            offset: 1,
                                            color: "#47ffec",
                                        },
                                    ]
                                ),
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [[1, "#051c48"]],
                            },
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 10,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            distance: 0,
                            color: "#fff",
                            fontSize: this.fontSize * 0.5,
                            formatter: function (value) {
                                if (value === 0) {
                                    return "0";
                                } else if (value === self.max) {
                                    return self.max;
                                }
                                return "";
                            },
                        },
                        data: [
                            {
                                value: 400,
                                title: {
                                    offsetCenter: ["0%", "-30%"],
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ["0%", "-20%"],
                                },
                            },
                        ],
                        detail: {
                            width: 80,
                            height: 14,
                            fontSize: this.fontSize * 0.8,
                            color: "#fff",
                            borderColor: "auto",
                            borderRadius: 20,
                            borderWidth: 0,
                            formatter: "{value}台",
                        },
                    },
                ],
            },
            chart3: null,
            option3: {
                series: [
                    {
                        type: "gauge",
                        radius: "100%",
                        startAngle: 180,
                        endAngle: 0,
                        pointer: {
                            show: false,
                        },
                        min: 0,
                        max: 0,
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: "#051c48",
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#071d4b",
                                        },
                                        {
                                            offset: 1,
                                            color: "#8373eb",
                                        },
                                    ]
                                ),
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [[1, "#051c48"]],
                            },
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 10,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            distance: 0,
                            color: "#fff",
                            fontSize: this.fontSize * 0.5,
                            formatter: function (value) {
                                if (value === 0) {
                                    return "0";
                                } else if (value === self.max) {
                                    return self.max;
                                }
                                return "";
                            },
                        },
                        data: [
                            {
                                value: 400,
                                title: {
                                    offsetCenter: ["0%", "-30%"],
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ["0%", "-20%"],
                                },
                            },
                        ],
                        detail: {
                            width: 80,
                            height: 14,
                            fontSize: this.fontSize * 0.8,
                            color: "#fff",
                            borderColor: "auto",
                            borderRadius: 20,
                            borderWidth: 0,
                            formatter: "{value}台",
                        },
                    },
                ],
            },
            chart4: null,
            option4: {
                series: [
                    {
                        type: "gauge",
                        radius: "100%",
                        startAngle: 180,
                        endAngle: 0,
                        pointer: {
                            show: false,
                        },
                        min: 0,
                        max: 0,
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: "#051c48",
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#081d48",
                                        },
                                        {
                                            offset: 1,
                                            color: "#ff534a",
                                        },
                                    ]
                                ),
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [[1, "#051c48"]],
                            },
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 10,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            distance: 0,
                            color: "#fff",
                            fontSize: this.fontSize * 0.5,
                            formatter: function (value) {
                                if (value === 0) {
                                    return "0";
                                } else if (value === self.max) {
                                    return self.max;
                                }
                                return "";
                            },
                        },
                        data: [
                            {
                                value: 400,
                                title: {
                                    offsetCenter: ["0%", "-30%"],
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ["0%", "-20%"],
                                },
                            },
                        ],
                        detail: {
                            width: 80,
                            height: 14,
                            fontSize: this.fontSize * 0.8,
                            color: "#fff",
                            borderColor: "auto",
                            borderRadius: 20,
                            borderWidth: 0,
                            formatter: "{value}台",
                        },
                    },
                ],
            },
            chart5: null,
            option5: {
                series: [
                    {
                        type: "gauge",
                        radius: "100%",
                        startAngle: 180,
                        endAngle: 0,
                        pointer: {
                            show: false,
                        },
                        min: 0,
                        max: 0,
                        progress: {
                            show: true,
                            overlap: false,
                            roundCap: true,
                            clip: false,
                            itemStyle: {
                                borderWidth: 0,
                                borderColor: "#051c48",
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    1,
                                    0,
                                    0,
                                    [
                                        {
                                            offset: 0,
                                            color: "#071e49",
                                        },
                                        {
                                            offset: 1,
                                            color: "#8c9da8",
                                        },
                                    ]
                                ),
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [[1, "#051c48"]],
                            },
                        },
                        splitLine: {
                            show: false,
                            distance: 0,
                            length: 10,
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            distance: 0,
                            color: "#fff",
                            fontSize: this.fontSize * 0.5,
                            formatter: function (value) {
                                if (value === 0) {
                                    return "0";
                                } else if (value === self.max) {
                                    return self.max;
                                }
                                return "";
                            },
                        },
                        data: [
                            {
                                value: 400,
                                title: {
                                    offsetCenter: ["0%", "-30%"],
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ["0%", "-20%"],
                                },
                            },
                        ],
                        detail: {
                            width: 80,
                            height: 14,
                            fontSize: this.fontSize * 0.8,
                            color: "#fff",
                            borderColor: "auto",
                            borderRadius: 20,
                            borderWidth: 0,
                            formatter: "{value}台",
                        },
                    },
                ],
            },
        };
    },
    methods: {
        changeColor(index) {
            this.currentIndex = index;
        },
        initChart(dom, option, chart) {
            let mapDiv = document.getElementById(dom);
            chart = echarts.init(mapDiv);
            this.setOptions(option, chart);
            window.addEventListener("resize", () => {
                chart.resize();
            });
        },
        /**添加统计图数据 */
        setOptions(option, chart) {
            chart.setOption(option);
        },
    },
    mounted() {
        this.$nextTick(() => {
            // this.initChart("boxChangehalt", this.option1, this.chart1);
            // this.initChart("boxChangeNomal", this.option2, this.chart2);
            // this.initChart("boxChangeWarn", this.option3, this.chart3);
            // this.initChart("boxChangeFault", this.option4, this.chart4);
            // this.initChart("boxChangeInterrupt", this.option5, this.chart5);
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", () => {
            this.chart1.resize();
            this.chart2.resize();
            this.chart3.resize();
            this.chart4.resize();
            this.chart5.resize();
        });
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                let status = 0;
                let name = "";
                let self = this;
                self.max = newVal.boxTransformerList.length;
                // 
                self.option1.series[0].max = self.max;
                for (let index in newVal.circuitBreakerSwitchOn) {
                    if (newVal.circuitBreakerSwitchOn[index] > 0) {
                        status++;
                    } else {
                        name + index;
                    }
                }
                self.option1.series[0].data[0].value = status;
                if (status != 0 && status != newVal.boxTransformerList.length) {
                    self.option1.series[0].detail.formatter = status + "台（" + name + "）";
                }
                this.initChart("boxChangehalt", this.option1, this.chart1);
                status = 0
                name = ""
// 
                self.option2.series[0].max = self.max;
                for (let index in newVal.circuitBreakerOpening) {
                    if (newVal.circuitBreakerOpening[index] > 0) {
                        status++;
                    } else {
                        name + index;
                    }
                }
                self.option2.series[0].data[0].value = status;
                if (status != 0 && status != newVal.boxTransformerList.length) {
                    self.option2.series[0].detail.formatter = status + "台（" + name + "）";
                }
                this.initChart("boxChangeNomal", this.option2, this.chart2);
                status = 0
                name = ""
// 
                self.option3.series[0].max = self.max;
                for (let index in newVal.transformerTripping) {
                    if (newVal.transformerTripping[index] > 0) {
                        status++;
                    } else {
                        name + index;
                    }
                }
                self.option3.series[0].data[0].value = status;
                if (status != 0 && status != newVal.boxTransformerList.length) {
                    self.option3.series[0].detail.formatter = status + "台（" + name + "）";
                }
                this.initChart("boxChangeWarn", this.option3, this.chart3);
                status = 0
                name = ""
// 
                self.option4.series[0].max = self.max;
                for (let index in newVal.transformerWarn) {
                    if (newVal.transformerWarn[index] > 0) {
                        status++;
                    } else {
                        name + index;
                    }
                }
                self.option4.series[0].data[0].value = status;
                if (status != 0 && status != newVal.boxTransformerList.length) {
                    self.option4.series[0].detail.formatter = status + "台（" + name + "）";
                }
                this.initChart("boxChangeFault", this.option4, this.chart4);
                status = 0
                name = ""
// 
                self.option5.series[0].max = self.max;
                for (let index in newVal.circuitBreakerFault) {
                    if (newVal.circuitBreakerFault[index] > 0) {
                        status++;
                    } else {
                        name + index;
                    }
                }
                self.option5.series[0].data[0].value = status;
                if (status != 0 && status != newVal.boxTransformerList.length) {
                    self.option5.series[0].detail.formatter = status + "台（" + name + "）";
                }
                this.initChart("boxChangeInterrupt", this.option5, this.chart5);
                status = 0
                name = ""
            },
        },
    },
};
</script>

<style lang="scss" scoped>
.boxChangeHome {
    padding: 1rem;
    .boxChangeTitle {
        font-size: 0.4rem;
        color: #fff;
        padding-bottom: 0.1rem;
    }
    .boxChangeStatus {
        overflow: hidden;
        .status {
            font-size: 0.35rem;
            color: #fff;
        }
        .under {
            display: inline-block;
            width: 1.2rem;
            height: 0.6rem;
            background: #006310;
            margin-right: 0.3rem;
            font-size: 0.4rem;
            line-height: 0.6rem;
            text-align: center;
            margin-top: 0.2rem;
        }
        .zeroValue {
            display: inline-block;
            width: 1.2rem;
            height: 0.6rem;
            background: #b21a2e;
            margin-right: 0.3rem;
            font-size: 0.4rem;
            line-height: 0.6rem;
            text-align: center;
            margin-top: 0.2rem;
        }
        .index {
            background: rgb(0, 13, 52, 0.5);
            padding: 0.5rem 1rem;
            .gaugeEcharts {
                position: relative;
                .status {
                    position: absolute;
                    bottom: 20%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.55rem;
                    color: #fff;
                }
            }
        }
    }

    .boxChange {
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
        .boxChangeIndex {
            background: rgb(0, 13, 52, 0.5);

            position: relative;
            ::v-deep .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            ::v-deep .el-scrollbar__bar.is-vertical {
                top: 10px;
            }

            .device {
                border: 2px solid #00446b;
                padding: 0.2rem 0.2rem;
                // max-width: 18rem;
                margin-left: 0px;
                min-height: 7rem;
                margin-top: 0.2rem;
                .name {
                    font-size: 0.4rem;
                    color: #fff;
                    text-align: center;
                    margin-bottom: 0.3rem;
                }
                .status {
                    // padding-right: 0.2rem;
                    .normalName {
                        font-size: 0.4rem;
                        color: #00f416;
                    }
                }
                .parameter {
                    // padding-left: 0.2rem;
                    font-size: 0.35rem;
                    color: #0083c9;
                    span {
                        padding: 1px 0;
                    }
                    .indexUnit {
                        color: #fff;
                    }
                }
            }
        }
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
</style>