<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="inverter">
            <div class="detailTitle" style="cursor: pointer;" @click="link">
                <div class="titleIcon"></div>
                <span class="ml5">逆变器</span>
            </div>
            <div class="number">
                <div class="flex flex-pack-justify">
                    <div><span>总数：</span><span class="index">{{data&&data.sumNum}}台</span></div>
                    <div><span>运行：</span><span class="index">{{data&&data.yxNum}}台</span></div>
                    <div><span>停机：</span><span class="index">{{data&&data.zdNum}}台</span></div>
                    <div><span>故障：</span><span class="index">{{data&&data.gzNum}}台</span></div>
                </div>
                <div class="flex flex-pack-justify mt10">
                    <div><span>日发电量：</span><span class="index">{{data&&data.power}} kWh</span></div>
                    <div><span>总功率：</span><span class="index">{{data&&data.capacity}} kw</span></div>
                </div>
            </div>
        </div>
        <div class="flex-1 flex flex-v">
            <div class="flex-1 item">
                <el-scrollbar style="height:100%;width:100%;position: absolute;color:#efefef;top:0;left:0;">
                    <el-row class="pd10">
                        <el-col class="colp" :span="12" v-for="(item,index) of inverterList" :key="index">
                            <div class="border">
                                <div style="text-align:center">{{item.name}}</div>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">日发电</el-col>
                                    <el-col class="center" :span="10">{{item.dayKwh}}</el-col>
                                    <el-col class="right" :span="6">kWh</el-col>
                                </el-row>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">月发电</el-col>
                                    <el-col class="center" :span="10">{{item.monthKwh}}</el-col>
                                    <el-col class="right" :span="6">kWh</el-col>
                                </el-row>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">年发电</el-col>
                                    <el-col class="center" :span="10">{{item.yearKwh}}</el-col>
                                    <el-col class="right" :span="6">MWh</el-col>
                                </el-row>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">总发电</el-col>
                                    <el-col class="center" :span="10">{{item.totalKwh}}</el-col>
                                    <el-col class="right" :span="6">MWh</el-col>
                                </el-row>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">状态</el-col>
                                    <el-col class="center" :span="10">{{runType[item.stauts]}}</el-col>
                                    <el-col class="right" :span="6"></el-col>
                                </el-row>
                                <el-row class="mt5" type="flex" align="middle" :gutter="2">
                                    <el-col class="left" :span="8">功率</el-col>
                                    <el-col class="center" :span="10">{{item.capacity}}</el-col>
                                    <el-col class="right" :span="6">kW</el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
            <div class="flex flex-pack-end pd10 pageNumber">
                <el-pagination layout="prev, pager, next" :page-size="pageSize" :total="data&&data.inverterList.length" @current-change="handleCurrentChange">
                </el-pagination>
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
        stationId: {
            type: String,
        },
    },
    data() {
        return {
            runType: {
                1: "正常",
                2: "停机",
                3: "故障",
            },
            pageNum: 1,
            pageSize: 6,
            prevStatus: true,
            nextStatus: true,
        };
    },
    computed: {
        //分页监听
        inverterList: function () {
            if (this.data) {
                if (this.pageNum == 1) {
                    let inverterList = [];
                    if (this.data.inverterList.length > this.pageSize) {
                        inverterList = this.data.inverterList.slice(
                            0,
                            this.pageSize
                        );
                    } else {
                        inverterList = this.data.inverterList;
                    }
                    return inverterList;
                } else {
                    return this.data.inverterList.slice(
                        this.pageSize * (this.pageNum - 1),
                        this.pageSize * this.pageNum
                    );
                }
            } else {
                return [];
            }
        },
    },
    methods: {
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum;
        },
        link() {
            this.$router.push({
                path: "inverter",
                query: { stationId: this.stationId },
            });
        },
    },
};
</script>

<style scoped lang="scss">
.inverter {
    padding: 10px 30px;
    .number {
        font-size: 14px;
        color: #fff;
        .index {
            color: #01bced;
        }
    }
}
.item {
    color: #fff;
    font-size: 14px;
    height: 100%;
    width: 100%;
    position: relative;
    ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    ::v-deep .el-scrollbar__bar.is-vertical {
        top: 10px;
    }
    .colp {
        padding: 0 5px;
        padding-top: 5px;
        .border {
            border: 1px solid #6a769d;
            box-shadow: 0 0 6px #6a769d;
            padding-bottom: 5px;
        }
    }
    .left {
        text-align: right;
    }
    .center {
        text-align: center;
        background: #2495fe;
        margin: 0 10px;
        padding: 3px 0;
    }
    .right {
        text-align: left;
    }
}
.pageNumber {
    color: #777d97;
    padding-right: 20px;
    padding-top: 0px;
    font-size: 16px;
    .el-link {
        font-size: 16px;
    }
}
.el-pagination {
    color: #fff;
    ::v-deep .btn-prev {
        background: none;
        color: #fff;
    }
    ::v-deep .btn-next {
        background: none;
        color: #fff;
    }
    ::v-deep .el-pager li {
        background: none;
    }
}
</style>