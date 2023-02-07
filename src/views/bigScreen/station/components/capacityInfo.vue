<template>
    <div class="flex flex-v" style="margin:0 20px;">
        <div class="title">
            <span class="ml5">发电量信息</span>
        </div>
        <div class="flex flex-1 flex-pack-justify">
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.dayKwh}}</span>
                </div>
                <div class="titleFont">
                    <span>日发电量</span>
                    <span class="Company">（kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.monthKwh}}</span>
                </div>
                <div class="titleFont">
                    <span>月发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.yearKwh}}</span>
                </div>
                <div class="titleFont">
                    <span>年发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.totalKwh}}</span>
                </div>
                <div class="titleFont">
                    <span>总发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
        </div>
        <div class="flex flex-1 " style="border-top:1px solid #65c6e7;margin-top:0.3rem;padding-top:0.2rem">
            <div class="flex flex-1 flex-align-center flex-pack-center" style="font-size: 0.3rem;">
                <div class="titleFont">
                    <span>日消纳</span>
                </div>
                <div class="indexFont">
                    <span class="index" style="margin-left:10px;background:#e60012;color:#fff">{{data&&data.dayConsume}}
                    <span style="font-size:0.5rem">%</span></span>
                </div>
            </div>
            <div class="flex flex-1 flex-align-center flex-pack-center">
                <div class="titleFont">
                    <span>月消纳</span>
                </div>
                <div class="indexFont">
                    <span class="index" style="margin-left:10px;background:#e60012;color:#fff">{{data&&data.monthConsume}}
                    <span style="font-size:0.5rem">%</span></span>
                </div>
            </div>
            <div class="flex flex-1 flex-align-center flex-pack-center">
                 <div class="titleFont">
                    <span>年消纳</span>
                </div>
                <div class="indexFont">
                    <span class="index" style="margin-left:10px;background:#e60012;color:#fff">{{data&&data.yearConsume}}
                    <span style="font-size:0.5rem">%</span></span>
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
            default: {},
        },
    },
    mounted() {},
    methods: {},
};
</script>
<style scoped lang="scss">
.title {
    padding: 10px;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
}
.titleFont {
    font-size: 0.4rem;
    text-align: center;
    color: #65c6e7;
    .Company {
        color: #fff;
        font-size: 0.3rem;
    }
}
.indexFont {
    text-align: center;
    .index {
        font-family: "DS-DIGIB";
        font-size: 1rem;
        height: 1rem;
        line-height: 1rem;
        color: #00d2ff;
        text-align: center;
        font-weight: 600;
    }
}
</style>
