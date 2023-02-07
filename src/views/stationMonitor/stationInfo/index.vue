<template>
    <div class="container">
        <div class="viewContainer">
            <div class="backgroundImg flex flex-v">
                <div class="flex-1" style="position: relative;overflow: hidden;">
                    <el-row class="flex" style="height:100%;width:100%">
                        <el-col :span="6" class="flex flex-v">
                            <div class="index border-all flex-3 flex">
                                <StationImg :data="imgUrl" />
                            </div>
                            <div class="index border-all flex-3 flex mt10">
                                <PowerGeneration :stationInfoWs="stationInfoWs" :data="monthList" />
                            </div>
                            <div class="index border-all flex-3 flex mt10">
                                <StationInfo :data="stationInfo" />
                            </div>
                        </el-col>
                        <el-col :span="12" class="flex flex-v">
                            <div>
                                <CapacityInfo :data="powerInfo" />
                            </div>
                            <div class="flex-7 wh100 flex">
                                <Analysis :data="analysis" />
                            </div>
                            <div class="flex-3 wh100 flex">
                                <Power :data="hourList" />
                            </div>
                        </el-col>
                        <el-col :span="6" class="flex flex-v">
                            <div class="flex-1 border-all index mt10 wh100">
                                <Inverter :data="inverter" :stationId="$route.query.stationId" />
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StationImg from "./components/stationImg";
import PowerGeneration from "./components/powerGeneration";
import StationInfo from "./components/stationInfo";
import CapacityInfo from "./components/capacityInfo";
import Analysis from "./components/analysis";
import Power from "./components/power";
import Inverter from "./components/inverter";
import { sendWebsocket } from '@/utils/websocket.js'

export default {
    name: "stationInfo",
    components: {
        StationImg,
        PowerGeneration,
        StationInfo,
        CapacityInfo,
        Analysis,
        Power,
        Inverter,
    },
    data() {
        return {
            powerInfo: null,
            inverter: null,
            hourList: [],
            analysis: null,
            stationInfo: null,
            monthList: [],
            stationInfoWs: null,
            imgUrl: [],
        };
    },
    async mounted() {
        console.log(this.$store.getters.user.userId)
        this.stationInfoWs = sendWebsocket('/websocket/solarStation',{stationId:+this.$store.getters.currentStation,userId:this.$store.getters.user.userId},this.wsMessage,null)
    },
    methods: {
        wsMessage(data){
            if(data.sign === 205){
                this.powerInfo = data.powerInfo;
                this.inverter = data.inverterMap;
            }else if(data.sign === 203){
                this.analysis = data;
            }else if(data.sign === 204){
                this.hourList = data.dataList
            }else if(data.sign === 202){
                this.stationInfo = data
                this.imgUrl = data.picsList
            }else if(data.sign === 201){
                this.monthList = data.monthList
            }
        }
    },
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.container {
    height: calc(100vh - 134px);
    position: relative;
    .viewContainer {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        
        .backgroundImg {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0%;
            top: 0px;
            background-size: 100% 100%;
            background-image: url("../../../assets/images/background.png");
            padding: 20px;
            .titleImg {
                width: 100%;
                height: 37px;
                text-align: center;
            }
            .index {
                background-image: url("../../../assets/images/indexBackground.png");
                background-size: cover;
                overflow: hidden;
            }
        }
    }
}
</style>
