<template>
    <div class="container">
        <div class="home">
            <div class="backgroundImg flex flex-v">
                <div class="flex-2 flex">
                    <div id="combinerBox" class="wh100"></div>
                </div>
                <div class="flex title flex-pack-justify">
                    <div class="leftTitle">
                    </div>
                    <div class="flex rightTitle">
                        <div class="flex flex-align-center">
                            <div class="under"></div>
                            <span>偏低 </span>
                        </div>
                        <div class="flex flex-align-center" style="margin-left:0.5rem">
                            <div class="zeroValue"></div>
                            <span>异常 </span>
                        </div>
                        <div class="flex flex-align-center" style="margin-left:0.5rem">
                            <div class="zeroValue" style="background:#809fb8"></div>
                            <span>通讯中断 </span>
                        </div>
                    </div>
                </div>
                <div class="flex-3 flex index" ref="tableRef">
                    <el-table v-loading="!data" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight" :data="data" border style="width: 100%;color:#fff;">
                        <el-table-column :min-width="fontSize * 5" align="center" prop="lastDate" label="时间">
                            <template slot-scope="scope">
                                <span :style="{background:diffMM(scope.row.lastDate) > 30 ? '#809fb8' : 'none'}">{{moment(scope.row.lastDate).format("YYYY-MM-DD HH:mm:ss")}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="fontSize * 4" align="center" prop="汇流箱名称" label="汇流箱编号">
                            <template slot-scope="scope">
                                <span>{{scope.row["汇流箱名称"]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :min-width="fontSize * 3" align="center" prop="母线电压" label="母线电压(V)">
                        </el-table-column>
                        <el-table-column :min-width="fontSize * 3" align="center" prop="总电流" label="总电流(A)">
                        </el-table-column>
                        <el-table-column :min-width="fontSize * 3" align="center" prop="平均电流" label="平均电流(A)">
                        </el-table-column>
                        <el-table-column :min-width="fontSize * 3" align="center" prop="总功率" label="总功率(kw)">
                        </el-table-column>
                        <el-table-column v-for="(item,index) of nameList" :key="index" :min-width="fontSize * 2.5" align="center" :prop="item" :label="item">
                            <template slot-scope="scope">
                                <div v-if="moment().format('H') > 6 &&moment().format('H') < 16" class="wh100" :style="{background:scope.row[item] > 0 && scope.row[item] <= scope.row['平均电流(A)'] / 2 ? '#bfba13' : (scope.row[item] <= 0 ? '#b21a2e' : 'none')}">{{scope.row[item] ? scope.row[item] : "未接入"}}</div>
                                <div v-else class="wh100" :style="{background:scope.row[item] <= 0 ? '#b21a2e' : 'none'}">{{scope.row[item] ? scope.row[item] : "未接入"}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from "echarts";
import resize from "@/utils/resize.js";
export default {
    mixins: [resize],
    props: {
        data: {
            default: null,
        },
        nameList: {
            default: null,
        },
        fontSize: {
            type: Number,
            default: null,
        },
    },
    data() {
        let that = this;
        return {
            form: {
                status: 1,
                keyword: "",
                current: 0.1,
            },
            options: [
                { value: 1, label: "正常" },
                { value: 2, label: "偏低" },
                { value: 3, label: "异常" },
            ],
            tableHeight: null,
            loading: false,
        };
    },
    methods: {
        initChart() {
            let mapDiv = document.getElementById("combinerBox");
            this.chart = echarts.init(mapDiv);
            this.chart.setOption(this.option);
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },
        setOption: (fontSize) => {
            let option = {
                tooltip: {
                    trigger: "axis",
                    position: function (point, params, dom, rect, size) {
                        var x = 0; // x坐标位置
                        var y = 0; // y坐标位置
                        var pointX = point[0];
                        var pointY = point[1];
                        var boxWidth = size.contentSize[0];
                        var boxHeight = size.contentSize[1];
                        if (boxWidth > pointX) {
                            x = 5;
                        } else {
                            x = pointX - boxWidth;
                        }
                        if (boxHeight > pointY) {
                            y = 5;
                        } else {
                            y = pointY - boxHeight;
                        }
                        return [x, y];
                    },
                    axisPointer: {
                        type: "cross",
                    },
                    textStyle: {
                        fontSize: fontSize * 0.35,
                    },
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    top: "15%",
                    bottom: "15%",
                },
                legend: {
                    top: "10px",
                    color: "#fff",
                    textStyle: {
                        color: "#fff",
                        fontSize: fontSize * 0.35,
                    },
                },
                xAxis: {
                    type: "category",
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: [],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: "#fff",
                            fontSize: fontSize * 0.35,
                        },
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: "#0c71b7",
                        },
                    },
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
                yAxis: {
                    type: "value",
                    name: "A",
                    min: 0,
                    nameTextStyle: {
                        padding: [0, 0, 0, 0], // 四个数字分别为上右下左与原位置距离
                        color: "#fff",
                        fontSize: fontSize * 0.35,
                    },
                    // position: "right",
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            color: "rgba(26,179,149,0.2)",
                            fontSize: fontSize * 0.35,
                        },
                    }, //去除网格线
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        //y轴刻度线
                        show: true,
                        lineStyle: {
                            type: "dashed",
                            color: "rgba(26,179,149,0.2)",
                            fontSize: fontSize * 0.35,
                        },
                    },
                    axisLabel: {
                        formatter: "{value} ",
                        textStyle: {
                            fontSize: fontSize * 0.35,
                            color: "#fff",
                        },
                    },
                },
                series: [],
            };
            return option;
        },
        getList(list) {
            let series = [];
            for (let item of list) {
                let config = {
                    name: "",
                    type: "line",
                    smooth: true,
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2,
                            },
                        },
                    },
                    data: [],
                };
                for (let idx in item) {
                    for (let name of this.nameList) {
                        if (name == idx) {
                            config.name = item["汇流箱名称"];
                            config.data.push(item[idx]);
                        }
                    }
                }
                series.push(config);
            }
            this.option.xAxis.data = this.nameList;
            this.option.series = series;
            this.setOptions();
        },
        diffMM(date) {
            let startDate = this.moment(date).format("YYYY-MM-DD HH:mm:ss");
            let endDate = this.moment().format("YYYY-MM-DD HH:mm:ss");
            return this.moment(endDate).diff(startDate, "minutes");
        },
    },
    created() {},
    async mounted() {
        this.$nextTick(() => {
            this.tableHeight = this.$refs.tableRef.clientHeight;
            this.option = this.setOption(this.fontSize);
            this.initChart();
        });
        window.onresize = () => {
            this.tableHeight = this.$refs.tableRef.clientHeight;
        };
    },
    watch: {
        data: {
            handler(newVal, oldVal) {
                this.getList(newVal);
            },
        },
    },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.container {
    position: relative;
    .home {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        .backgroundImg {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0%;
            top: 0px;
            background-size: 100% 100%;
            padding: 0 20px 20px;
            overflow: hidden;
            ::v-deep .el-form-item {
                margin-bottom: 0px;
            }
            ::v-deep .el-form-item__label {
                color: #fff;
            }
            .title {
                font-size: 0.5rem;
                color: #fff;
                width: 100%;
                .under {
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.5rem;
                    background: #bfba13;
                    margin-right: 0.3rem;
                }
                .zeroValue {
                    display: inline-block;
                    width: 0.5rem;
                    height: 0.5rem;
                    background: #b21a2e;
                    margin-right: 0.3rem;
                }
            }
            .index {
                background: rgb(0, 13, 52, 0.5);
                // padding: 1.5rem 2rem;
                overflow: hidden;
                // .table {
                //     height: 100%;
                //     overflow: hidden;
                // }
            }
            //滑动
            ::v-deep .el-scrollbar .el-scrollbar__wrap {
                overflow-x: hidden !important;
            }

            // // 滚动条整体样式
            ::-webkit-scrollbar {
                height: 12px;
            }
            // 定义滑块颜色、内阴影及圆角
            ::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background-color: #36b3cd;
            }
            //滑动槽的背景颜色
            ::-webkit-scrollbar-track-piece {
                border-radius: 10px;
                background-color: #142a37;
            }

            //查询
            ::v-deep .el-form {
                display: flex;
                margin-top: 10px;
                margin-bottom: 10px;
            }
            ::v-deep .el-form-item {
                margin-bottom: 0;
                display: flex;
                align-items: center;
            }
            ::v-deep .el-form-item__label {
                color: #8089a5;
                font-size: 0.35rem;
            }
            ::v-deep .el-input--medium .el-input__inner {
                background: none;
                color: #fff;
                border: 1px solid #0681a0;
                border-radius: 0;
                height: 0.8rem;
                width: 5rem;
                font-size: 0.35rem;
            }
            ::v-deep .el-range-editor--medium .el-range-input {
                background: #08698f;
                color: #c0c4cc;
            }
            //按钮
            .btnSearch {
                background: #00aeff;
                border: 1px solid #0681a0;
                border-radius: 0;
                width: 2.8rem;
                height: 0.8rem;
                font-size: 0.35rem;
            }

            //table
            .el-table {
                background: none;
            }
            ::v-deep .el-table tr {
                background: none;
            }
            ::v-deep .el-table__header-wrapper th {
                background: #003e71;
                color: #d4e6f5;
                font-size: 0.45rem;
                height: 1rem;
                line-height: 1rem;
                border-bottom: 1px solid #809fb8;
                border-right: 1px solid #809fb8;
            }
            ::v-deep .el-table--border td {
                border-right: 1px solid #809fb8;
            }
            ::v-deep .el-table .cell {
                color: #d4e6f5;
                font-size: 0.4rem;
                height: 0.8rem;
                line-height: 0.8rem;
            }
            .el-table::before,
            .el-table--group::after,
            .el-table--border::after {
                background-color: #809fb8;
            }
            ::v-deep .el-table--group,
            .el-table--border {
                border: 1px solid #809fb8;
                border-left: 2px solid #809fb8 !important;
                border-top: 2px solid #809fb8 !important;
            }

            ::v-deep .el-table--border .el-table__cell {
                border-right: 1px solid #809fb8;
                border-bottom: 1px solid #809fb8;
                background-color: #07648a;
                background: rgba(0, 0, 0, 0.35) !important;
            }
            ::v-deep .el-table tbody tr:hover > td {
                background-color: #0681a0;
            }
        }
    }
}
</style>