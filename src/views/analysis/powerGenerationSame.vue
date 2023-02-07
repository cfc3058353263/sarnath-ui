<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" :rules="rules" label-width="90px" v-show="showSearch">
            <el-form-item label="所属电站" prop="stationIds">
                <station-search ref="station" :queryParams="queryParams" stationId="stationIds" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item label="查询类型">
                <el-select v-model="dateType" placeholder="请选择查询类型" @change="changeSelect">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in dateTypeList" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :type="dateType" :clearable="false" size="small" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" @change="changeEnd" :type="dateType" :clearable="false" size="small" :picker-options="stopTime" style="width:150px">
                </el-date-picker>
            </el-form-item>
<!--
            <el-form-item prop="contractId" label="合同日期" v-if="dateType === 'year'">
                <el-select v-model="queryParams.contractId" placeholder="请选择合同日期">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in contractList" :key="index"></el-option>
                </el-select>
            </el-form-item> -->

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 统计图 -->
        <div class="echartsView">
            <div ref="charts" style="height:100%;width:100%"></div>
        </div>
        <!-- 统计图 -->
        <!-- 按钮.... -->
        <!-- table月 -->
        <el-table v-loading="loading" :data="dataList"  border v-if="this.queryParams.searchType !== 'year'">
            <!-- v-if="this.queryParams.searchType=='date'" -->
            <el-table-column label="日期" prop="dateTitle" :show-overflow-tooltip="true" width="100px" />
            <el-table-column align="center" show-overflow-tooltip label='{"label":["发电量同期对比","上一年发电量","当前年发电量","发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.hiskwh}}</span>
                        <span>{{scope.row.nowkwh}}</span>
                        <span>{{scope.row.kwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["MW发电量","上一年MW发电量","当前年MW发电量","MW发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.hisMWkwh}}</span>
                        <span>{{scope.row.nowMWkwh}}</span>
                        <span>{{scope.row.mwkwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["辐照量","上一年实际辐照值","当前年实际辐照值","辐照同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.hisRadiation}}</span>
                        <span>{{scope.row.nowRadiation}}</span>
                        <span>{{scope.row.radiationrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["故障损失发电量","上一年故障损失发电量","当前年故障损失发电量","故障损失发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.hisLossKwh}}</span>
                        <span>{{scope.row.nowLossKwh}}</span>
                        <span>{{scope.row.lossKwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["非故障损失发电量","上一年非故障损失发电量","当前年非故障损失发电量","非故障损失发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.hisNonLossKwh}}</span>
                        <span>{{scope.row.nowNonLossKwh}}</span>
                        <span>{{scope.row.nonLossKwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- table月 -->
        <!-- table月 -->
        <el-table v-loading="loading" :data="dataList" v-if="this.queryParams.searchType=='year'">
            <el-table-column label="日期" prop="dateTitle" :show-overflow-tooltip="true" width="100px" />
            <el-table-column align="center" show-overflow-tooltip label='{"label":["发电量同期对比","当前年发电量","发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.nowkwh}}</span>
                        <span>{{scope.row.kwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["MW发电量","当前年MW发电量","MW发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.nowMWkwh}}</span>
                        <span>{{scope.row.mwkwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["辐照量","当前年实际辐照值","辐照同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.nowRadiation}}</span>
                        <span>{{scope.row.radiationrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["故障损失发电量","当前年故障损失发电量","故障损失发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.nowLossKwh}}</span>
                        <span>{{scope.row.lossKwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" show-overflow-tooltip label='{"label":["非故障损失发电量","当前年非故障损失发电量","非故障损失发电量同比升高（%）"]}' :render-header="renderHeader">
                <template slot-scope="scope">
                    <div class="votes">
                        <span>{{scope.row.nowNonLossKwh}}</span>
                        <span>{{scope.row.nonLossKwhrate}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- table月 -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import {
    getList,
    getContract,
} from "@/api/dataMaintain/powerGenerationSame.js";
var echarts = require("echarts");
import resize from "../dashboard/mixins/resize";

export default {
    name: "dpgStatistics",
    mixins: [resize],
    components: {
        StationSearch,
        excelImport,
    },
    data() {
        let self = this;
        return {
            stopTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.startTime),
                                "day"
                            ) < 0
                    );
                },
            },
            showSearch: true,
            loading: false,
            total: 0,
            dateType: "date",
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            queryParams: {
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-MM-DD"),
                stationIds: null,
                systemId: null,
                searchType: "date",
            },
            contractList: [],
            query: {},
            dataList: [],
            rules: {
                time: [
                    {
                        type: "array",
                        required: true,
                        message: "请选择日期区间",
                        fields: {
                            0: {
                                type: "string",
                                required: true,
                                message: "请选择开始日期",
                            },
                            1: {
                                type: "string",
                                required: true,
                                message: "请选择结束日期",
                            },
                        },
                    },
                ],
                stationIds: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                contractId: [
                    {
                        required: true,
                        message: "合同日期不能为空",
                        trigger: "blur",
                    },
                ],
            },
            option: {
                //echarts 配置
                title: { text: "发电量同期对比" },
                tooltip: { trigger: "axis" },
                legend: {
                    data: [
                        "发电量同比升高（%）",
                        "MW发电量同比升高（%）",
                        "实际辐照量同比升高（%）",
                        "故障损失同比升高（%）",
                        "非故障损失同比升高（%）",
                    ],
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [],
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        show: true,
                        interval: "auto",
                        formatter: "{value} %",
                    },
                    show: true,
                },
                series: [
                    {
                        name: "发电量同比升高（%）",
                        type: "line",
                        stack: "总量",
                        data: [],
                    },
                    {
                        name: "MW发电量同比升高（%）",
                        type: "line",
                        stack: "总量",
                        data: [],
                    },
                    {
                        name: "实际辐照量同比升高（%）",
                        type: "line",
                        stack: "总量",
                        data: [],
                    },
                    {
                        name: "故障损失同比升高（%）",
                        type: "line",
                        stack: "总量",
                        data: [],
                    },
                    {
                        name: "非故障损失同比升高（%）",
                        type: "line",
                        stack: "总量",
                        data: [],
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
        this.initChart();
        this.getList();
    },
    methods: {
        /**echarts 初始化 */
        initChart() {
            this.chart = echarts.init(this.$refs.charts);
            this.setOptions();
        },
        /**添加统计图数据 */
        setOptions() {
            this.chart.setOption(this.option);
        },

        /**获取设备发电量 日 */
        getList() {
            this.loading = true;
            switch (this.dateType) {
                case "date":
                    this.queryParams.searchType = this.dateType;
                    this.queryParams.contractId = null;
                    break;
                case "month":
                    this.queryParams.searchType = this.dateType;
                    this.queryParams.contractId = null;
                    break;
                case "year":
                    this.queryParams.searchType = this.dateType;
                    break;
            }
            getList(this.queryParams).then((res) => {
                this.dataList = res.rows;
                this.loading = false;
                this.option.xAxis.data = this.dataList.map((item) => {
                    return item.dateTitle;
                });
                // 折线图倒序
                this.option.xAxis.data = this.option.xAxis.data.reverse();
                this.option.series[0].data = this.dataList.map((item) => {
                    return item.kwhrate;
                });
                this.option.series[1].data = this.dataList.map((item) => {
                    return item.mwkwhrate;
                });
                this.option.series[2].data = this.dataList.map((item) => {
                    return item.radiationrate;
                });
                this.option.series[3].data = this.dataList.map((item) => {
                    return item.lossKwhrate;
                });
                this.option.series[4].data = this.dataList.map((item) => {
                    return item.nonLossKwhrate;
                });
                this.setOptions();
            });
        },
        //查询
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    if (
                        this.moment(this.queryParams.endTime).diff(
                            this.moment(this.queryParams.startTime),
                            "day"
                        ) < 0
                    ) {
                        this.msgError("日期区间结束时间不得早于开始时间");
                    } else {
                        this.getList();
                    }
                }
            });
        },
        /**日期类型选 */
        changeSelect(value) {
            this.queryParams.startTime = null;
            this.queryParams.endTime = null;
            let queryParams = JSON.stringify(this.queryParams);
            this.$refs.queryParams.resetFields();
            this.queryParams = JSON.parse(queryParams);
        },
        /**时间选择 */
        changeStart(date) {
            this.queryParams.endTime = null;
            switch (this.dateType) {
                case "date":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-01");
                    break;
                case "year":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-01-01");
                    break;
            }
        },
        changeEnd(date) {
            switch (this.dateType) {
                case "date":
                    this.queryParams.endTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.endTime = this.moment(date)
                        .endOf("month")
                        .format("YYYY-MM-DD");
                    break;
                case "year":
                    this.queryParams.endTime =
                        this.moment(date).format("YYYY-12-31");
                    break;
            }
        },
        getContractYear(systemId, stationIds) {
            getContract({ systemId, stationIds }).then((res) => {
                this.contractList = res.data;
            });
        },
        /** 自定义表头 */
        renderHeader(createElement, { column, _self }) {
            let label = JSON.parse(column.label).label;
            let element = [];
            for (let index in label) {
                if (index > 0) {
                    let div = createElement("div", { style: { flex: 1 } }, [
                        label[index] || "",
                    ]);
                    element.push(div);
                }
            }
            return createElement(
                "div",
                {
                    class: "header-center",
                },
                [
                    createElement(
                        "div",
                        {
                            attrs: { type: "text" },
                        },
                        [label[0]]
                    ),
                    createElement(
                        "div",
                        {
                            attrs: { type: "text" },
                            style: {
                                display: ["flex"],
                                justifyContent: ["space-around"],
                                flexDirection: ["row"],
                            },
                        },
                        element
                    ),
                ]
            );
        },
    },
};
</script>
<style lang="scss" scoped>
.echartsView {
    height: 400px;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.selectD {
    text-align: center;
}
.votes {
    display: flex;
    justify-content: space-around;
    span {
        flex: 1;
    }
}
</style>
