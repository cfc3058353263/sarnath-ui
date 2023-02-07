<template>
    <div class="devicebg flex">
        <div class="device flex flex-1">
            <div class="contain flex-1 flex flex-v flex-align-center">
                <div class="name">
                    逆变器单元（{{data&&data.inverterInfo.totalNum}}）
                </div>
                <div class="name flex flex-1 flex-pack-around flex-align-center">
                    <div class="flex flex-align-center">
                        <div>
                            正常数
                        </div>
                        <div class="data" :class="{normal:data&&data.inverterInfo.normalNum>0}">{{data&&data.inverterInfo.normalNum}}</div>
                    </div>
                    <div class="flex flex-align-center" style="cursor: pointer;" @click="data&&data.inverterInfo.abnormalNum>0 && link()">
                        <div>
                            异常数
                        </div>
                        <div class="data" :class="{error:data&&data.inverterInfo.abnormalNum>0}">{{data&&data.inverterInfo.abnormalNum}}</div>
                    </div>
                </div>
            </div>
            <div class="contain flex-1 flex flex-v flex-align-center" style="border-left:1px solid #00b9e9;border-right:1px solid #00b9e9">
                <div class="name">
                    直流汇流箱（{{data&&data.combinerBoxInfo.totalNum}}）
                </div>
                <div class="name flex flex-1 flex-pack-around flex-align-center">
                    <div class="flex flex-align-center">
                        <div>
                            正常数
                        </div>
                        <div class="data" :class="{normal:data&&data.combinerBoxInfo.normalNum>0}">{{data&&data.combinerBoxInfo.normalNum}}</div>
                    </div>
                    <div class="flex flex-align-center" style="cursor: pointer;" @click="data&&data.combinerBoxInfo.abnormalNum>0 && link()">
                        <div>
                            异常数
                        </div>
                        <div class="data" :class="{error:data&&data.combinerBoxInfo.abnormalNum>0}">{{data&&data.combinerBoxInfo.abnormalNum}}</div>
                    </div>
                </div>
            </div>
            <div class="contain flex-1 flex flex-v flex-align-center">
                <div class="name">
                    箱变（{{data&&data.boxTransformerInfo.totalNum}}）
                </div>
                <div class="name flex flex-1 flex-pack-around flex-align-center">
                    <div class="flex flex-align-center">
                        <div>
                            正常数
                        </div>
                        <div class="data" :class="{normal:data&&data.boxTransformerInfo.normalNum>0}">{{data&&data.boxTransformerInfo.normalNum}}</div>
                    </div>
                    <div class="flex flex-align-center" style="cursor: pointer;" @click="data&&data.boxTransformerInfo.abnormalNum>0 && link()">
                        <div>
                            异常数
                        </div>
                        <div class="data" :class="{error:data&&data.boxTransformerInfo.abnormalNum>0}">{{data&&data.boxTransformerInfo.abnormalNum}}</div>
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
            default: {},
        },
    },
    methods:{
        link() {
            this.$router.push({
                path: "matrix",
                query: {
                    stationId: this.$route.query.stationId,
                    stationName: this.$route.query.stationName,
                },
            });
        },
    }
};
</script>

<style scoped lang="scss">
.devicebg {
    margin-top: 15px;
    height: 3rem;
    background-image: url("../../../../assets/images/bigScreen/station/devicebg.png");
    background-size: 100% 100%;
    .device {
        padding: 0.5rem;
        .contain {
            .name {
                text-align: center;
                width: 100%;
                font-size: 0.4rem;
                .data {
                    margin-left: 10px;
                    font-size: 0.7rem;
                }
            }
        }
    }
}
.normal {
    color: #04a91b;
}
.error {
    color: #e50204;
}
</style>