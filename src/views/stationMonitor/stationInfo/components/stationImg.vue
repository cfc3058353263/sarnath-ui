<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="detailTitle pb5 ml0 mt10">
            <div class="titleIcon"></div>
            <span class="ml5">电站图片</span>
        </div>
        <div class="flex-1">
            <div style="height:100%;padding:0 10px 10px">
                <el-image style="width: 100%; height: 100%" :src="null" fit="cover"></el-image>
                <!-- <el-carousel trigger="click" style="height:100%">
                    <el-carousel-item v-for="item,index of data" :key="index">
                    </el-carousel-item>
                </el-carousel> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            imgList,
        };
    },
    mounted() {},
    methods: {},
};
</script>

<style scoped lang="scss">
.stationImg {
    padding: 0 10px 10px 10px;
}
::v-deep .el-carousel__container {
    position: relative;
    height: 100%;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>