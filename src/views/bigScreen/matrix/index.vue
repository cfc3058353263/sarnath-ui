<template>
    <div class="container flex flex-v">
        <div class="topStyle">
            <div class="name flex flex-pack-justify flex-align-center">
                <div class="companyName">
                    道生国际
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
            <div class="title">{{this.$route.query.stationName}}</div>
        </div>
        <div class="flex-1 center">
            <div class="flex-1 item">
                <el-scrollbar style="height:100%;width:100%;position: absolute;color:#efefef;top:0;left:0;">
                    <el-row style="margin:0 2.5rem">
                        <el-col v-for="(item,index) of deviceList" :key="index" :span="6" style="text-align:center">
                            <el-image class="imgStyle" :src="require('../../../assets/images/bigScreen/matrix/matrix.png')" @click="link(item)" fit="fill"></el-image>
                            <div>
                                <span class="capacity" style="font-size: 0.5rem;color:#65c6e7">装机容量：</span>
                                <span class="capacity" style="font-family: DS-DIGIB;color:#65c6e7">{{item.capacity}}</span>
                                <span class="capacity" style="font-size: 0.5rem;color:#65c6e7">kwp</span>
                            </div>
                            <div class="textStyle">{{item.deviceName}} <span v-if="item.params.totalAbNormalNum > 0" class="abnormal">(设备异常)</span></div>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </div>
        <NavRight />
    </div>
</template>

<script>
import { listNoPageDevice } from "@/api/bigScreen/matrix";
import NavRight from "@/components/navRight";

export default {
    components: {
        NavRight,
    },
    data() {
        return {
            deviceList: [],
        };
    },
    methods: {
        link(item) {
            this.$router.push({
                path: "matrixDetail",
                query: {
                    stationId: this.$route.query.stationId,
                    matrixId: item.deviceId,
                    matrixName: item.deviceName,
                },
            });
        },
        /**字体大小计算 */
        fontSizeCompute() {
            let width = document.body.clientWidth;
            if (width >= 1200) {
                let fontsize = (width / 1920) * 40;
                document.getElementsByTagName("html")[0].style.fontSize =
                    fontsize + "px";
            }
            window.onresize = () => {
                return (() => {
                    let width = document.body.clientWidth;
                    if (width >= 1200) {
                        let fontsize = (width / 1920) * 40;
                        document.getElementsByTagName(
                            "html"
                        )[0].style.fontSize = fontsize + "px";
                    }
                })();
            };
        },
        getDeviceList() {
            listNoPageDevice({
                stationId: this.$route.query.stationId,
                deviceType: 8,
            }).then((res) => {
                this.deviceList = res.data;
            });
        },
    },
    mounted() {
        this.fontSizeCompute();
        this.getDeviceList();
    },
    beforeDestroy() {
        document.getElementsByTagName("html")[0].style.fontSize = "16px";
    },
};
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    background-image: url("../../../assets/images/index/background.png");
    background-size: 100% 100%;
    .topStyle {
        width: 100%;
        border-bottom: 1px solid #00aeff;
        padding: 0.5rem 0.8rem;
        .name {
            font-size: 1rem;
            font-weight: 700;
            color: #fff;
            // font-family: Tebs;
            .companyName {
                font-family: "TTChaoHeiJ";
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
                    height: 0.5rem;
                    text-align: center;
                    border-radius: 4px;
                }
                .active {
                    background-color: #00aeff;
                }
            }
        }
        .title {
            text-align: center;
            font-size: 0.8rem;
            font-weight: 600;
            color: #fff;
            font-family: "TTChaoHeiJ";
        }
    }
    .center {
        // padding: 0 10rem;
        .item {
            color: #fff;
            font-size: 14px;
            height: 100%;
            width: 100%;
            position: relative;
            ::v-deep .el-scrollbar__wrap {
                overflow-x: hidden;
            }
            ::v-deep .el-scrollbar__bar.is-vertical {
                top: 10px;
            }
        }
        .textStyle {
            color: #fff;
            text-align: center;
            font-size: 0.5rem;
            margin: 0.2rem 0;
            .abnormal {
                color: #e60012;
                font-size: 0.4rem;
            }
        }
        .capacity {
            color: #fff;
            text-align: center;
            font-size: 0.8rem;
        }
        .imgStyle {
            width: 55%;
            cursor: pointer;
        }
    }
}
</style>