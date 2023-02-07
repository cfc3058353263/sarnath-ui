<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="14">
                <div class="station">
                    <div class="topTitle">
                        <span class="name">电站列表</span>
                        <div style="margin-left:10px;width:500px">
                            <el-form :model="form" ref="form" :rules="rules">
                                <el-form-item prop="value" style="margin-bottom:0">
                                    <el-input placeholder="请输入电站名称" v-model="form.value" class="input-with-select">
                                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <el-scrollbar class="page-component__scroll" style="height:100%">
                        <el-row style="margin-right:5px" :gutter="10">
                            <el-col :xs="24" :sm="12" :lg="8" v-for="(item,index) of stationList" :key="index" style="margin-top:10px;">
                                <transition name="el-zoom-in-top">
                                    <div class="stationitem" @click="stationPush(item)" v-show="show" :style="{background:'url('+item.stationImg+')'}" style="background-size: cover;">
                                        <!-- <el-image class="stationBg" :src="item.stationImg"></el-image> -->
                                        <div style="margin-bottom:10px"><span class="itemTitle">{{item.stationName}}</span></div>
                                        <div><span class="itemTitle">装机容量：{{item.installCapacity}}MW</span></div>
                                        <div><span class="itemTitle">电站状态：{{item.stationStatus==1?"运行中":"维修中"}}</span></div>
                                        <div><span class="itemTitle">并网时间：{{item.netTime && moment(item.netTime).format("YYYY-MM-DD")}}</span></div>
                                        <div><span class="itemTitle">电站区域：{{area[item.stationArea]}}</span></div>
                                    </div>
                                </transition>
                            </el-col>
                        </el-row>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col :span="10">
                <div style="margin-bottom: 10px;"><span class="name">电站监控</span></div>
                <div class="monitor">
                    <div class="item1" style="color:#00C4D0">
                        <div><span class="itemTitle1">{{data.zcyx}}</span>个</div>
                        <div style="margin-top:10px">正常运行</div>
                    </div>
                    <div class="item2" style="color:#00C4D0">
                        <div><span class="itemTitle1">{{data.ycyx}}</span>个</div>
                        <div style="margin-top:10px">异常电站</div>
                    </div>
                    <div class="item3" style="background:#00C4D0">
                        <div class="runType"></div>
                        <div style="margin-top:10px">运行状态</div>
                    </div>
                </div>
                <div class="monitor">
                    <div class="item1" style="color:#088165">
                        <div><span class="itemTitle1">{{data.day_kwh.toFixed(2)}}</span>kWh</div>
                        <div style="margin-top:10px">昨日电量</div>
                    </div>
                    <div class="item1" style="color:#088165">
                        <div><span class="itemTitle1">{{data.momthRatio.toFixed(2)}}</span>%</div>
                        <div style="margin-top:10px">月完成比</div>
                    </div>
                    <div class="item2" style="color:#088165">
                        <div><span class="itemTitle1">{{data.yearRatio.toFixed(2)}}</span>%</div>
                        <div style="margin-top:10px">年完成比</div>
                    </div>
                    <div class="item3" style="background:#00ce9b">
                        <div class="fadian"></div>
                        <div style="margin-top:10px">发电情况</div>
                    </div>
                </div>
                <div class="monitor">
                    <div class="item1" style="color:#9F479B">
                        <div><span class="itemTitle1">{{data.dayLoss.toFixed(2)}}</span>kWh</div>
                        <div style="margin-top:10px;">昨日损失</div>
                    </div>
                    <div class="item1" style="color:#9F479B">
                        <div><span class="itemTitle1">{{data.momthLoss.toFixed(2)}}</span>kWh</div>
                        <div style="margin-top:10px;">月损失</div>
                    </div>
                    <div class="item2" style="color:#9F479B">
                        <div><span class="itemTitle1">{{data.yearLoss.toFixed(2)}}</span>kWh</div>
                        <div style="margin-top:10px">年损失</div>
                    </div>
                    <div class="item3" style="background:#9F479B">
                        <div class="sunshi"></div>
                        <div style="margin-top:10px">损失情况</div>
                    </div>
                </div>
                <div class="monitor">
                    <div class="item1" style="color:#395EAB">
                        <div><span class="itemTitle1">{{data.clzOrder.toFixed(2)}}</span>个</div>
                        <div style="margin-top:10px;">处理中工单</div>
                    </div>
                    <div class="item1" style="color:#395EAB">
                        <div><span class="itemTitle1">{{data.addOrder.toFixed(2)}}</span>个</div>
                        <div style="margin-top:10px;">日增工单</div>
                    </div>
                    <div class="item2" style="color:#395EAB">
                        <div><span class="itemTitle1">{{data.monthOrder.toFixed(2)}}</span>个</div>
                        <div style="margin-top:10px">月处理工单</div>
                    </div>
                    <div class="item3" style="background:#395EAB">
                        <div class="guzhang"></div>
                        <div style="margin-top:10px">故障工单</div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from "axios";
import { getdictList, getStationByUser, getPowerAllSummary } from "@/api/utils";
export default {
    data() {
        return {
            stationList: null,
            area: {}, //区域字典
            show: false,
            value: null,
            form: {
                value: null,
            },
            normal: 0,
            data: {},
            rules: {
                value: [
                    {
                        required: true,
                        message: "内容不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        getstationList() {
            getStationByUser().then((res) => {
                this.stationList = res.stations;
                for (let item of this.stationList) {
                    item.stationStatus == 1 && this.normal++;
                }
                this.$nextTick(() => {
                    this.show = true;
                });
            });
        },
        /**切换电站 跳转 */
        stationPush(item) {
            this.$store.commit("SET_CURRENTSTATION", item.stationId);
            this.$router.push({ path: "/light/index" }).catch((err) => {});
        },
        search() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    var reg = new RegExp(this.form.value);
                    this.stationList = this.stationList.filter((item) => {
                        return item.stationName.match(reg);
                    });
                }
            });
        },
        getPowerAllSummary() {
            getPowerAllSummary().then((res) => {
                this.data = res.data;
            });
        },
    },
    mounted() {},
    created() {
        this.getPowerAllSummary();
        axios.all([getdictList("sys_area")]).then(
            axios.spread((area) => {
                for (let item of area.data) {
                    this.area[item.dictValue] = item.dictLabel;
                }
                this.getstationList();
            })
        );
    },
};
</script>

<style scoped lang="scss">
.app-container {
    height: 100%;
    .el-row {
        height: 100%;
        .el-col-14 {
            height: 100%;
        }
    }
    .topTitle {
        display: flex;
        align-items: center;
        padding: 5px;
        padding-right: 10px;
        .name {
            font-size: 14px;
            font-weight: 700;
        }
    }
    .station {
        height: 100%;
        padding-right: 15px;
        overflow: hidden;
        .page-component__scroll .el-scrollbar__wrap {
            overflow-x: hidden;
        }
        ::v-deep .el-scrollbar__bar.is-vertical {
            top: 10px;
        }
        .stationitem {
            width: 100%;
            height: 180px;
            position: relative;
            padding: 10px;
            background-size: cover !important;
            cursor: pointer;
            .stationBg {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 1;
                background-size: cover;
                transition-duration: 0.3s;
                z-index: -999;
            }
            .itemTitle {
                font-weight: 700;
                font-size: 14px;
                color: #fff;
            }
        }
    }
    .monitor {
        display: flex;
        width: 100%;
        height: 150px;
        margin-top: 10px;
        .item1 {
            display: flex;
            width: 50%;
            background-color: #eeeeee;
            text-align: center;
            flex-direction: column;
            justify-content: center;
            font-size: 12px;
        }
        .item1:hover {
            background-color: #317a7e;
            color: #fff !important;
        }
        .itemTitle1 {
            font-size: 24px;
            font-weight: 700;
        }
        .item2 {
            display: flex;
            width: 50%;
            background-color: #eeeeee;
            text-align: center;
            justify-content: center;
            flex-direction: column;
            justify-content: center;
            font-size: 12px;
            box-sizing: border-box;
        }
        .item2:hover {
            background-color: #317a7e;
            color: #fff !important;
            border-right: 0.5px solid #fff;
        }
        .item3 {
            flex: 1;
            display: flex;
            text-align: center;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            font-size: 16px;
            color: #fff;
            .runType {
                width: 150px;
                height: 80px;
                background-image: url("../assets/images/runType.png");
                background-repeat: no-repeat;
                background-position: center;
            }
            .fadian {
                width: 150px;
                height: 80px;
                background-image: url("../assets/images/fadian.png");
                background-repeat: no-repeat;
                background-position: center;
            }
            .sunshi {
                width: 150px;
                height: 80px;
                background-image: url("../assets/images/sunshi.png");
                background-repeat: no-repeat;
                background-position: center;
            }
            .guzhang {
                width: 150px;
                height: 80px;
                background-image: url("../assets/images/guzhang.png");
                background-repeat: no-repeat;
                background-position: center;
            }
        }
    }
}
</style>