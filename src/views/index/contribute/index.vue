<template>
    <div class="flex flex-1 flex-v">
        <div class="topTitle flex">
            <div class="flex flex-1 flex-pack-justify">
                <span class="titleName">社会贡献</span>
            </div>
        </div>
        <div class="flex-1">
            <div class="flex-1 flex flex-pack-around" style="padding-top:20px">
                <div class="img flex flex-v flex-align-center">
                    <el-image class="flex-1" :src="require('../../../assets/images/index/co2.png')" fit="fit"></el-image>
                    <div style="padding:15px 0">
                        <span class="data">{{contribute&&contribute.carbonDioxide}}</span>
                        <span class="company">吨</span>
                    </div>
                    <span class="name">二氧化碳减排</span>
                </div>
                <div class="img flex flex-v flex-align-center">
                    <el-image class="flex-1" :src="require('../../../assets/images/index/coal.png')" fit="fit"></el-image>
                    <div style="padding:15px 0">
                        <span class="data">{{contribute&&contribute.saveCoal}}</span>
                        <span class="company">吨</span>
                    </div>
                    <span class="name">节约标准煤</span>
                </div>
                <div class="img flex flex-v flex-align-center">
                    <el-image class="flex-1" :src="require('../../../assets/images/index/pines.png')" fit="fit"></el-image>
                    <div style="padding:15px 0">
                        <span class="data">{{contribute&&contribute.plantTree}}</span>
                        <span class="company">棵</span>
                    </div>
                    <span class="name">等效植树</span>
                </div>
                <!-- <div class="img flex flex-v flex-align-center">
                    <el-image class="flex-1" :src="require('../../../assets/images/index/CCER.png')" fit="fit"></el-image>
                    <div style="padding:15px 0">
                        <span class="data">{{contribute&&contribute.CCER}}</span>
                        <span class="company">%</span>
                    </div>
                    <span class="name">核证指标</span>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import resize from "@/utils/resize.js";
export default {
    props: {
        contribute: {
            type: Object,
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
}
.img {
    .data {
        color: #04ba19;
        font-size: 0.6rem;
    }
    .company {
        color: #4a98c0;
        font-size: 0.4rem;
    }
    .name {
        color: #4a98c0;
        font-size: 0.4rem;
    }
}
</style>