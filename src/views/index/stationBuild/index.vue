<template>
    <div class="flex flex-1 flex-v">
        <div class="topTitle flex">
            <div class="flex flex-1 flex-pack-justify">
                <span class="titleName">规模分布</span>
                <div class="titleData">
                    <span>并网总容量</span>
                    <span style="color:#3edb07">{{netCapacity&&(+netCapacity).toFixed(3)}}</span>
                    <span>MW</span>
                </div>
            </div>
        </div>
        <div class="flex-1 contain flex flex-v flex-pack-start">
            <div class="flex flex-v" v-for="(item,index) of stationBuildList&&stationBuildList" :key="index">
                <div class="flex flex-pack-justify textStyle" style="color:#ffff01">
                    <span style="font-size:0.4rem;" :style="{color:index==0?'#04ba18':'#ffff01'}">{{item.provinceName}}</span>
                    <span :style="{color:index==0?'#04ba18':'#ffff01'}">并网容量{{item.netCapacity}}MW 
                        <span style="color:#8d918f" v-if="item.installCapacity-item.netCapacity !== 0">未并网容量{{item.installCapacity-item.netCapacity}} MW</span>
                    </span>
                </div>
                <div style="width:100%">
                    <div class="line" style="background:#04ba18;" :style="{width:(item.netCapacity/item.installCapacity)*100 + '%',background:index==0?'#04ba18':'#ffff01'}">
                    </div>
                    <div class="line" style=";background:#8d918f;" :style="{width:((item.installCapacity-item.netCapacity)/item.installCapacity)*100 + '%'}"></div>
                </div>
            </div>
            <!-- <div class="flex flex-v" style="">
                <div class="flex flex-pack-justify textStyle" style="color:#ffff01">
                    <span style="font-size:0.4rem;color:#ffff01">安徽省</span>
                    <span>并网容量（17.519MW）</span>
                </div>
                <div style="width:100%">
                    <div class="line" style=";background:#ffff01;width:60%">
                    </div>
                    <div class="line" style=";background:#8d918f;width:40%"></div>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "@/utils/resize.js";
export default {
    props: {
        netCapacity: {
            type: String,
            default: null,
        },
        stationBuildList: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {
            currentIndex: 1,
            option: {},
        };
    },
    mounted() {},
    methods: {},
    watch: {
        stationBuildList: {
            handler(newVal, oldVal) {},
        },
    },
};
</script>

<style lang="scss" scoped>
.topTitle {
    padding: 10px;
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    .titleName {
        font-size: 0.4rem;
        color: #65c6e7;
        font-weight: 400;
    }
    .titleData {
        font-size: 0.4rem;
        color: #65c6e7;
        font-weight: 400;
    }
}
.contain {
    padding: 0.5rem;
    .textStyle {
        font-size: 0.4rem;
        color: #04ba18;
        margin-top: 10px;
    }
    .line {
        display: inline-block;
        height: 0.4rem;
        width: 100%;
        background: #04ba18;
        margin-top: 10px;
    }
}
</style>