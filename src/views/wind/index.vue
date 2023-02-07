<template>
    <div class="app-container">
        <!-- top -->
        <div>
            <el-row :gutter="1">
                <el-col :span="4">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">1586</span> 天</div>
                        <div>安全运行</div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{topData?topData.totalKwh:0}}</span> kWh</div>
                        <div>日发电量</div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{topData?topData.radiation:0}}</span> Wh/m²</div>
                        <!-- <div>日辐照量</div> -->
                        <div>日MW发电量</div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">{{topData?topData.mwKwh:0}}</span> kWh</div>
                        <div>月发电量</div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">2266.96</span> 万度</div>
                        <div>年发电量</div>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">1.07</span> 亿度</div>
                        <div>总发电量</div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="topItem">
                        <div><span style="font-size:26px;font-weight:700;">1.37</span> 亿</div>
                        <div>总收入</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 统计图 -->
        <div class="echartsView">
            <div id="echarts" ref="charts" style="height:100%;width:100%"></div>
        </div>
        <!-- 统计图 -->
    </div>
</template>
<script>
import { getPowerGeneration } from "@/api/runing/runDaily/runDaily";
import StationSearch from "@/views/components/stationSearch";
var echarts = require("echarts");
import resize from "../dashboard/mixins/resize";

export default {
    mixins: [resize],
    components: {
        StationSearch,
    },
    name: "runDaily",
    data() {
        return {
            list: [],
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            dateType: "date",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-01-01"),
                endTime: this.moment().format("YYYY-12-31"),
                stationIds: [],
                systemId: null,
                searchType: "month",
            },
            option: {
                title: { text: "发电量对比分析" },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow",
                    },
                },
                xAxis: {
                    type: "category",
                    data: [],
                },
                yAxis: {
                    type: "value",
                },
                series: [
                    {
                        name: "发电量",
                        color: "rgb(26, 179, 148)",
                        type: "bar",
                        data: [],
                        tooltip: {
                            valueSuffix: " kWh",
                        },
                    },
                ],
            },
            topData: {},
        };
    },
    created() {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
        this.queryParams.systemId = this.$store.getters.currentSystem;
        this.getList({
            ...this.queryParams,
        });
        getPowerGeneration({
            ...this.queryParams,
            searchType: "date",
            startTime: this.moment().format("YYYY-MM-DD"),
            endTime: this.moment().format("YYYY-MM-DD"),
        }).then((res) => {
            // getPowerGeneration({...this.queryParams,searchType:"date",startTime:"2021-11-24",endTime:"2021-11-24"}).then(res=>{
            this.topData = res.data.rows[0];
        });
    },
    mounted() {
        this.initChart();
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
        //列表获取
        getList(queryParams) {
            getPowerGeneration(queryParams).then((res) => {
                this.list = res.data.rows;
                if (this.list.length === 0) {
                    this.option.title = {
                        text: "暂无数据",
                        x: "center",
                        y: "center",
                        textStyle: {
                            color: "#909399",
                            fontWeight: "normal",
                            fontSize: 16,
                        },
                    };
                    this.setOptions();
                    return;
                }
                this.option.xAxis.data = this.list.map((item, index) => {
                    return item.calendar;
                });
                this.option.series[0].data = this.list.map((item, index) => {
                    return item.totalKwh;
                });
                this.setOptions();
            });
        },
    },
};
</script>
<style scoped>
.echartsView {
    margin-top: 20px;
    height: 500px;
    text-align: center;
}
.topItem {
    background-color: #283847;
    height: 87px;
    color: #fff;
    font-size: 13px;
    /* text-align: center; */
    /* line-height: 87px; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>
