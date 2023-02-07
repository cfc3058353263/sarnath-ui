<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="title">
            <span class="ml5">电站基本信息</span>
        </div>
        <div class="flex-1 flex flex-v stationInfo">
            <div class="flex-1 flex flex-v flex-pack-around info">
                <div class="container flex flex-align-center ">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/name.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">电站名称 ：</span>
                    <span class="flex-1">{{data&&data.stationName}}</span>
                    <!-- <span>万华公安光伏电站</span> -->
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/capacity.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">装机容量 ：</span>
                    <span class="flex-1">{{data&&data.installCapacity}}MW</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/user.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">运维负责人:</span>
                    <span class="flex-1">{{data&&data.stationPerson}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/phone.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">业主单位 ：</span>
                    <!-- <span>{{data&&data.stationOwnerUnit}}</span> -->
                    <span class="flex-1">{{data&&data.exportStationOwner}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/status.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">电站状态 ：</span>
                    <span class="flex-1">{{data&&runType[data.stationStatus]}}</span>
                </div>
                <div class="container flex flex-align-center">
                    <el-image :src="require('../../../../assets/images/bigScreen/station/day.png')" style="height: 0.35rem;" fit="fill" />
                    <span class="titleInfo">安全运行 ：</span>
                    <span class="flex-1">{{data&&data.runDays+ "天"}} </span>
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
.title {
    padding: 10px;
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
}
.stationInfo {
    padding: 10px 20px 0 20px;
    .info {
        border-top: 1.5px solid #2495fe;
        .container {
            padding-left: 20px;
            color: #fff;
            font-size: 0.35rem;
            .titleInfo {
                margin: 0 10px;
                // width: 80px;
            }
        }
    }
}
</style>
