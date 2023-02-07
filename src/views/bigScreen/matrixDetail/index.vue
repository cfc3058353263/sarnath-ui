<template>
    <div class="container flex flex-v">
        <div class="topTitle flex flex-align-center flex-pack-justify">
            <el-image class="imgStyle" :src="require('../../../assets/images/bigScreen/matrix/titleImg.png')"></el-image>
            <div class="flex-1 leftText">
                <div style="margin-left:7rem">
                    {{matrixName}}
                </div>
            </div>
            <div class="flex-1 centerText">
                {{matrixName}}{{currentIndex == 1 ? "汇流箱" : "箱逆变"}}
            </div>
            <div class="flex-1 rightButton flex flex-pack-end ">
                <div class="flex" style="margin-right:1rem">
                    <div class="dateStyle" :class="{active:currentIndex==1}" @click="changeColor(1)">汇流箱</div>
                    <div class="dateStyle" :class="{active:currentIndex==2}" @click="changeColor(2)" style="margin:0 0.2rem">箱逆变</div>
                    <!-- <div class="dateStyle" :class="{active:currentIndex==3}" @click="changeColor(3)">箱变</div> -->
                </div>
            </div>
            <div class="rightButton" style="margin-right:10px;">
                <router-link to>
                    <div class="dateStyle flex flex-pack-around" style="align-items: center;" @click="$router.go(-1)">
                        <el-image style="height: 0.4rem;" :src="require('../../../assets/images/bigScreen/station/back.png')" fit="fill" @click="$router.back(-1)"></el-image>
                        <span>返回</span>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="flex flex-1 index">
            <div class="flex flex-1 wh100" v-if="currentIndex==1">
                <CombinerBox :data="combinerBoxData" :nameList="nameList" :fontSize="fontSize" />
            </div>
            <div class="flex flex-1 wh100" v-if="currentIndex==2">
                <Inverter :boxChangeData="boxChangeData" :data="inverterData" :dayKwhList="dayKwhList" :fontSize="fontSize" />
            </div>
            <!-- <div class="flex flex-1 wh100" v-if="currentIndex==3">
                <BoxChange :data="boxChangeData" :fontSize="fontSize" />
            </div> -->
        </div>
        <NavRight />
    </div>
</template>

<script>
import CombinerBox from "./combinerBox";
import Inverter from "./inverter";
import BoxChange from "./boxChange";
import { sendWebsocket } from "@/utils/websocket.js";
import { Loading } from "element-ui";
import NavRight from "@/components/navRight";

export default {
    components: {
        CombinerBox,
        Inverter,
        BoxChange,
        NavRight,
    },
    data() {
        return {
            matrixDetail: null,
            currentIndex: this.$store.getters.currentIndex,
            fontSize: null,
            combinerBoxData: null,
            nameList: null,
            inverterData: null,
            dayKwhList: null,
            boxChangeData: null,
            matrixName: null,
        };
    },
    methods: {
        changeColor(index) {
            this.currentIndex = index;
            switch (index) {
                case 1:
                    this.matrixDetail.send(
                        JSON.stringify({
                            stationId: +this.$route.query.stationId,
                            matrixId: +this.$route.query.matrixId,
                            deviceType: 6,
                        })
                    );
                    break;
                case 2:
                    this.matrixDetail.send(
                        JSON.stringify({
                            stationId: +this.$route.query.stationId,
                            matrixId: +this.$route.query.matrixId,
                            deviceType: 7,
                        })
                    );

                    break;

                default:
                    this.matrixDetail.send(
                        JSON.stringify({
                            stationId: +this.$route.query.stationId,
                            matrixId: +this.$route.query.matrixId,
                            deviceType: 3,
                        })
                    );
                    break;
            }
        },
        link() {
            this.$router.push("combinerBox");
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
        wsMessage(data) {
            switch (this.currentIndex) {
                case 1:
                    var reg = /^I/;
                    let nameList = [];
                    for (let item of data) {
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
                    this.combinerBoxData = data;
                    break;
                case 2:
                    this.inverterData = data.inverterUnitInfo;
                    this.dayKwhList = data.inverterUnitInfo.dayKwhList;
                    this.boxChangeData = data.boxTransformerInfo;
                    break;

                default:
                    this.boxChangeData = data;
                    break;
            }
        },
    },
    mounted() {
        this.matrixName = this.$route.query.matrixName;
        this.fontSizeCompute();
        this.matrixDetail = sendWebsocket(
            "/system/websocket/matrixInfo",
            {
                stationId: +this.$route.query.stationId,
                matrixId: +this.$route.query.matrixId,
                deviceType: this.currentIndex == 1 ? 6 : 7,
            },
            this.wsMessage,
            null
        );
    },
    beforeDestroy() {
        this.$store.commit("SET_CURRENTINDEX", 1);
        document.getElementsByTagName("html")[0].style.fontSize = "16px";
    },
};
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-image: url("../../../assets/images/bigScreen/matrix/background.jpg");
    background-size: 100% 100%;
    .topTitle {
        width: 100%;
        height: 4.175rem;
        flex-shrink: 0; //不会被压缩
        position: relative;
        .imgStyle {
            height: 100%;
            position: absolute;
        }
        .leftText {
            font-size: 0.5rem;
            color: #fff;
            z-index: 999;
        }
        .centerText {
            text-align: center;
            font-size: 0.8rem;
            z-index: 999;
            font-weight: 600;
            color: #fff;
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