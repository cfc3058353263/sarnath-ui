<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="detailTitle pb5 ml0 mt10">
            <div class="titleIcon"></div>
            <span class="ml5">电站基本信息</span>
        </div>
        <div class="flex-1 flex flex-v stationInfo">
            <div class="flex-1 flex flex-v flex-pack-around info">
                <div class="container flex flex-align-center ">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">电站名称 ：</span>
                    <span>{{data&&data.stationName}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">装机容量 ：</span>
                    <span>{{data&&data.stationInstallCapacity /1000 }}MW</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">运维负责人:</span>
                    <span>{{data&&data.stationDirector}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">业主单位 ：</span>
                    <span>{{data&&data.stationOwnerUnit}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">电站状态 ：</span>
                    <span>{{data&&runType[data.stationStatus]}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">安全运行 ：</span>
                    <span>{{data&&data.stationRunDays+ "天"}} </span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/name.png')" style="height: 14px;" fit="none" />
                    <span class="titleInfo">环境温度 ：</span>
                    <span>{{data&&data.ambientTemp+ "℃"}} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    props: {
        data: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {
            runType: {
                1: "正常",
                2: "停机",
                3: "故障异常",
            },
        };
    },
    mounted() {},
    methods: {},
};
</script>

<style scoped lang="scss">
.stationInfo {
    padding: 10px 20px 0 20px;
    .info {
        border-top: 1.5px solid #2495fe;
        .container {
            padding-left: 20px;
            color: #fff;
            font-size: 12px;
            .titleInfo {
                margin: 0 10px;
            }
        }
    }
}
</style>