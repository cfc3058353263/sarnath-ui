<template>
    <div class="flex flex-v" style="margin:0 20px;height:100px">
         <div class="detailTitle pb5 ml5 mt10">
            <div class="titleIcon"></div>
            <span class="ml5">发电量信息</span>
        </div>
        <div class="flex flex-1 flex-pack-justify">
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.dayPower}}</span>
                </div>
                <div class="titleFont">
                    <span>日发电量</span>
                    <span class="Company">（kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.monthPower}}</span>
                </div>
                <div class="titleFont">
                    <span>月发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.yearPower}}</span>
                </div>
                <div class="titleFont">
                    <span>年发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
            <div class="flex flex flex-v">
                <div class="indexFont">
                    <span class="index">{{data&&data.totalPower}}</span>
                </div>
                <div class="titleFont">
                    <span>总发电量</span>
                    <span class="Company">（万kWh）</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        data:{
            type:Object,
            default:{}
        }
    },
    mounted(){
    },
    methods:{

    }
};
</script>
<style scoped lang="scss">
.titleFont {
    font-size: 14px;
    text-align: center;
    color: #fff;
    .Company {
        color: #fff;
        font-size: 12px;
    }
}
.indexFont {
    text-align: center;
    .index {
        font-family: "DS-DIGIB";
        font-size: 39px;
        height: 39px;
        line-height: 39px;
        color: #00d2ff;
        text-align: center;
        font-weight: 600;
    }
}
</style>