<template>
    <div class="container flex flex-v">
        <div class="flex">
            <div>
                <el-image style="width:100%;position:absolute" :src="require('../../../assets/images/index/title.png')" fit="fill"></el-image>
            </div>
        </div>
        <el-image class="line" :src="require('../../../assets/images/index/line.png')" fit="fit"></el-image>
        <div class="flex flex-1" style="padding:0 40px">
            <div class="flex-1 flex flex-v leftData" style="padding-top:1.7rem;">
                <div class="flex flex-v">
                    <div class="flex flex-pack-justify" style="align-items: end;">
                        <div style="font-size:0.7rem;font-weight:600;" class="fontTitle">发电量</div>
                        <div class="flex ">
                            <div class="data">{{data&&data.totalKwh}}</div>
                            <div class="company">万kWh</div>
                        </div>
                    </div>
                    <el-image :src="require('../../../assets/images/index/leftImg.png')" fit="fill"></el-image>
                </div>
                <!-- <div class="rightData">
                    <div class="flex flex-pack-around " style="padding-right:20px;margin-top:-20px">
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.dayProfit}}</span>
                                <span class="company">万元</span>
                            </div>
                            <div class="name">日收益</div>
                        </div>
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.monthProfit}}</span>
                                <span class="company">万元</span>
                            </div>
                            <div class="name">月收益</div>
                        </div>
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.yearProfit}}</span>
                                <span class="company">万元</span>
                            </div>
                            <div class="name">年收益</div>
                        </div>
                    </div>
                </div> -->
                <!-- <div class="flex-1" style="position: relative;overflow: hidden;">
                    <div class="flex flex-align-center" style="width:100%;height:100%;position:absolute;left:0%;top:0;padding-left:20px">
                        <span class="data">{{data&&data.totalKwh}}</span>
                        <span class="company">万kWh</span>
                    </div>
                </div> -->
                <div>
                    <div class="flex flex-pack-around " style="padding-right:20px;margin-top:-20px">
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.dayTotalKwh}}</span>
                                <span class="company">万kWh</span>
                            </div>
                            <div class="name">日发电</div>
                        </div>
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.monthTotalKwh}}</span>
                                <span class="company">万kWh</span>
                            </div>
                            <div class="name">月发电</div>
                        </div>
                        <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.yearTotalKwh}}</span>
                                <span class="company">万kWh</span>
                            </div>
                            <div class="name">年发电</div>
                        </div>
                        <!-- <div class="flex flex-v flex-align-center">
                            <div>
                                <span class="data">{{data&&data.yearProfit}}</span>
                                <span class="company">万kWh</span>
                            </div>
                            <div class="name">累计发电</div></div>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="flex-2 centerContainter">
                <div class="flex flex-pack-center flex-align-center" style="height:1.5rem; position:relative">
                    <el-image style="width:100%;position:absolute" :src="require('../../../assets/images/index/borderImg.png')" fit="fill"></el-image>
                    <div class="centerData">
                        <span class="title">装机容量</span>
                        <span class="data">{{data&&data.installCapacity}}</span>
                        <span class="company">MW</span>
                    </div>
                    <div class="centerData" style="padding:0 3rem">
                        <span class="title">运行天数</span>
                        <span class="data">{{data&&data.runDays}}</span>
                        <span class="company">天</span>
                    </div>
                    <div class="centerData">
                        <span class="title">电站总数</span>
                        <span class="data">{{data&&data.stationNum}}</span>
                        <span class="company">个</span>
                    </div>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex-1 rightData" style="padding-top:1.7rem;">
                    <div class="flex flex-v" style="text-align:right">
                        <span style="font-size:0.7rem;font-weight:600;" class="fontTitle">发电收益</span>
                        <el-image :src="require('../../../assets/images/index/rightImg.png')" fit="fill"></el-image>
                    </div>
                    <div>
                        <div class="flex flex-pack-around " style="padding-right:20px;margin-top:-20px">
                            <div class="flex flex-v flex-align-center">
                                <div>
                                    <span class="data" style="background:#e60012;color:#fff">{{data&&data.dayProfit}}
                                        <span class="company" style="color:#fff">万元</span></span>
                                </div>
                                <div class="name">日收益</div>
                            </div>
                            <div class="flex flex-v flex-align-center">
                                <div>
                                    <span class="data" style="background:#e60012;color:#fff">{{data&&data.monthProfit}}
                                    <span class="company" style="color:#fff">万元</span></span>
                                </div>
                                <div class="name">月收益</div>
                            </div>
                            <div class="flex flex-v flex-align-center">
                                <div>
                                    <span class="data" style="background:#e60012;color:#fff">{{data&&data.yearProfit}}
                                    <span class="company" style="color:#fff">万元</span></span>
                                </div>
                                <div class="name">年收益</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    position: relative;
    .borderImg {
        position: absolute;
        height: 1.5rem;
        width: 100%;
        z-index: 1000;
        bottom: 0;
    }
    .line {
        position: absolute;
        z-index: 10;
        top: 54%;
        transform: translate(-50.5%);
        left: 50%;
    }
    .leftData {
        .data {
            font-family: DS-DIGIB;
            color: #04ba1b;
            font-size: 0.6rem;
            font-weight: 700;
        }
        .company {
            color: #65c6e7;
            font-size: 0.5rem;
            font-weight: 500;
            margin-left: 0.15rem;
        }
        .name {
            font-size: 0.5rem;
            color: #65c6e7;
        }
    }
    .rightData {
        .data {
            font-family: DS-DIGIB;
            color: #04ba1b;
            font-size: 0.6rem;
            font-weight: 700;
        }
        .company {
            color: #65c6e7;
            font-size: 0.5rem;
            font-weight: 500;
            margin-left: 0.15rem;
        }
        .name {
            font-size: 0.5rem;
            color: #65c6e7;
        }
    }
    .centerContainter {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        .centerData {
            .title {
                font-size: 0.5rem;
                color: #fff;
            }
            .data {
                font-family: DS-DIGIB;
                font-size: 0.8rem;
                color: #04ba1b;
                padding: 0 5px 0 10px;
            }
            .company {
                font-size: 0.5rem;
                color: #65c6e7;
            }
        }
    }
    .fontTitle {
        // font-family: TTChaoHeiJ;
        color: #65c6e7;
    }
}
</style>