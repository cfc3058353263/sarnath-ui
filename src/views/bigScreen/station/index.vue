<template>
    <div class="container flex flex-v">
        <div class="flex topTitle" style="padding:0 1rem">
            <div class="flex-1">
                <span>
                    {{moment().format("YYYY年MM月DD日")}}
                </span>
                <span>
                    {{getWeek()}}
                </span>
                <span>
                    {{moment().format("HH:MM")}}
                </span>
            </div>
            <div class="flex-1 flex flex-pack-center stationName">{{stationName}}</div>
            <div class="flex-1 flex flex-pack-end">
                <el-popover popper-class="down-popover" placement="top" width="250" trigger="hover" style="padding:0">
                    <div style="text-align:center;color:#fff;margin-bottom:5px;font-size:0.4rem;color:#1ae0fe">环境监测仪</div>
                    <!-- <div class="hjStyle flex">
                        <span class="flex-1" style="text-align:right">环境气压：</span>
                        <span class="flex-1">{{envMonitorData && envMonitorData.ambientTemperature}} ℃</span>
                    </div> -->
                    <p class="hjStyle" style="border-top:1px solid #1ae0fe;padding-top:5px">环境温度：{{envMonitorData && envMonitorData.ambientTemperature}} ℃</p>
                    <p class="hjStyle">环境风速：{{envMonitorData && envMonitorData.windSpeed}} m/s</p>
                    <p class="hjStyle">环境风向：{{envMonitorData && envMonitorData.windDirection}} 度</p>
                    <p class="hjStyle">环境气压：{{envMonitorData && envMonitorData.pressure}} hPa</p>
                    <p class="hjStyle">环境湿度：{{envMonitorData && envMonitorData.humidity}} %</p>
                    <span slot="reference" style="margin:0 10px;cursor: pointer;">{{weather&&weather.dayWeather}} {{weather&&weather.dayWindDir}}风 {{weather&&weather.dayWindPower}}级 气温{{weather&&weather.nightTemp}}~{{weather&&weather.dayTemp}}℃ </span>
                </el-popover>
                <div class="rightButton" style="margin:0 10px;">
                    <router-link to>
                        <div class="dateStyle flex flex-pack-around" style="align-items: center;" @click="$router.go(-1)">
                            <el-image style="height: 0.4rem;" :src="require('../../../assets/images/bigScreen/station/back.png')" fit="fill" @click="$router.back(-1)"></el-image>
                            <span>返回</span>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="flex-1 flex" style="padding-top:2rem">
            <div class="flex-1" style="position: relative;overflow: hidden;">
                <div class="flex" style="width:100%;height:100%;position:absolute;left:0%;top:0;">
                    <el-row class="flex" style="height:100%;width:100%; padding:10px 20px">
                        <el-col :span="6" class="flex flex-v">
                            <div class="index flex-3 flex">
                                <StationImg :imgUrl="imgUrl" :stationVideo="stationVideo" />
                            </div>
                            <div class="index flex-3 flex mt10">
                                <PowerGeneration :data="monthPowerKwhList" :fontSize="fontSize" />
                            </div>
                            <div class="index flex-3 flex mt10">
                                <StationInfo :data="powerStationInfo" />
                            </div>
                        </el-col>
                        <el-col :span="12" class="flex flex-v">
                            <div class="flex-4 index">
                                <CapacityInfo :data="powerInfo" />
                                <Device :data="deviceInfo" />
                            </div>
                            <div class="flex-6 wh100 flex" style="padding:10px 0;margin:0 10px">
                                <Analysis :dayKwhAnalysisList="dayKwhAnalysisList" :monthKwhAnalysisList="monthKwhAnalysisList" :yearKwhAnalysisList="yearKwhAnalysisList" :fontSize="fontSize" />
                            </div>
                        </el-col>
                        <el-col :span="6" class="flex flex-v">
                            <div class="flex-3 index flex wh100">
                                <PowerLoss :monthLossKwhList="monthLossKwhList" :fontSize="fontSize" />
                            </div>
                            <div class="flex-3 index flex">
                                <Patrolplan :patrolPlanList="patrolPlanList" :fontSize="fontSize" />
                            </div>
                            <div class="flex-3 index flex">
                                <WorkorderStatistics :issueOrderInfo="issueOrderInfo" :fontSize="fontSize" />
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <NavRight />
    </div>
</template>
<script>
import StationImg from "./components/stationImg";
import PowerGeneration from "./components/powerGeneration";
import StationInfo from "./components/stationInfo";
import CapacityInfo from "./components/capacityInfo";
import Analysis from "./components/analysis";
import Device from "./components/device";
import PowerLoss from "./components/powerLoss";
import Patrolplan from "./components/patrolplan";
import WorkorderStatistics from "./components/workorderStatistics";
import NavRight from "@/components/navRight";
import { sendWebsocket } from "@/utils/websocket.js";
import { Loading } from "element-ui";

export default {
    name: "stationInfo",
    components: {
        StationImg,
        PowerGeneration,
        StationInfo,
        CapacityInfo,
        Analysis,
        Device,
        PowerLoss,
        Patrolplan,
        WorkorderStatistics,
        NavRight,
    },
    data() {
        return {
            imgUrl: null,
            weather: null,
            fontSize: null,
            stationName: null,
            //websocket
            monthPowerKwhList: null,
            powerStationInfo: null,
            powerInfo: null,
            deviceInfo: null,
            dayKwhAnalysisList: null,
            monthKwhAnalysisList: null,
            yearKwhAnalysisList: null,
            monthLossKwhList: null,
            patrolPlanList: null,
            issueOrderInfo: null,
            envMonitorData:null,
            dataTrue: false,
            stationVideo:null
        };
    },
    created() {
        Loading.service({
            fullscreen: true,
            spinner: "el-icon-loading",
            text: "加载中...",
            background: "rgba(0, 0, 0, 0.8)",
        });
    },
    mounted() {
        let self = this;
        AMap.plugin("AMap.Weather", function () {
            var weather = new AMap.Weather();
            //执行实时天气信息查询
            weather.getForecast(self.$route.query.cityName, function (err, data) {
                self.weather = data.forecasts[0];
            });
        });
        this.fontSizeCompute();
        this.stationName = this.$route.query.stationName;
        this.stationInfoWs = sendWebsocket(
            "/system/websocket/staionInfo",
            {
                stationId: +this.$route.query.stationId,
                userId: this.$store.getters.user.userId,
            },
            this.wsMessage,
            null
        );
    },
    methods: {
        wsMessage(data) {
            !this.dataTrue && Loading.service({ fullscreen: true }).close();
            this.dataTrue = true;
            this.monthPowerKwhList = data.monthPowerKwhList;
            this.powerStationInfo = {
                ...data.powerStationInfo,
                runDays: data.runDays,
            };
            this.powerInfo = {
                dayKwh: data.dayKwh,
                monthKwh: data.monthKwh,
                yearKwh: data.yearKwh,
                totalKwh: data.totalKwh,
                dayConsume: data.dayConsume,
                monthConsume: data.monthConsume,
                yearConsume: data.yearConsume,
            };
            this.deviceInfo = {
                combinerBoxInfo: data.combinerBoxInfo,
                boxTransformerInfo: data.boxTransformerInfo,
                inverterInfo: data.inverterInfo,
            };
            this.dayKwhAnalysisList = data.dayKwhAnalysisList;
            this.monthKwhAnalysisList = data.monthKwhAnalysisList;
            this.yearKwhAnalysisList = data.yearKwhAnalysisList;
            this.monthLossKwhList = data.LossKwhAnalysisList;
            this.patrolPlanList = data.patrolPlanList;
            this.issueOrderInfo = data.issueOrderList;
            this.imgUrl = data.powerStationInfo.stationImg;
            this.envMonitorData = data.envMonitorData
            this.stationVideo = data.powerStationInfo.stationImgList[0]
        },
        /**字体大小计算 */
        fontSizeCompute() {
            let width = document.body.clientWidth;
            if (width >= 1200) {
                let fontsize = (width / 1920) * 40; //fontsize为当前屏幕的基数字体，相对于设计稿计算得到的。
                this.fontSize = fontsize;
                document.getElementsByTagName("html")[0].style.fontSize =
                    fontsize + "px";
            } else {
                this.fontSize = 40;
            }
            window.onresize = () => {
                //当页面尺寸改变的时候生效
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
        getWeek(date) {
            // 参数时间戳
            let week = this.moment(date).day();
            switch (week) {
                case 1:
                    return "周一";
                case 2:
                    return "周二";
                case 3:
                    return "周三";
                case 4:
                    return "周四";
                case 5:
                    return "周五";
                case 6:
                    return "周六";
                case 0:
                    return "周日";
            }
        },
    },
    beforeDestroy() {
        document.getElementsByTagName("html")[0].style.fontSize = "16px";
    },
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.container {
    height: 100%;
    position: relative;
    background-image: url("../../../assets/images/index/4.jpg");
    background-color: #000e35;
    background-size: 100% 100%;
    color: #fff;
    .topTitle {
        width: 100%;
        height: 2rem;
        position: absolute;
        font-size: 0.4rem;
        margin-top: 0.3rem;
        .stationName {
            font-size: 0.8rem;
            font-weight: 600;
            font-family: "TTChaoHeiJ";
            color: #1ae0fe;
        }
        .rightButton {
            color: #fff;
            z-index: 999;
            font-size: 0.4rem;
            .dateStyle {
                padding: 0 0.1rem;
                background-color: #004383;
                cursor: pointer;
                width: 2rem;
                height: 0.55rem;
                text-align: center;
                border-radius: 4px;
            }
            .active {
                background-color: #00aeff;
            }
        }
    }
    .index {
        overflow: hidden;
    }
}
</style>
<style lang="scss">
.down-popover {
    .hjStyle {
        color: #fff;
        font-size: 0.35rem;
        margin: 0;
        margin-bottom: 0.1rem;
        border-bottom: 1px solid #1ae0fe;
        padding-bottom: 5px;
    }
    border-color: rgba(25, 52, 148, 0.5);
    background-color: rgb(27, 47, 113, 0.5);
}
</style>
