<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <div class="table">
                <el-row class="rowStyle">
                    <el-col class="labelStyle" :span="2">序号</el-col>
                    <el-col class="labelStyle" :span="4">指标</el-col>
                    <el-col class="labelStyle" :span="18">数值</el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">1</el-col>
                    <el-col class="labelStyle" :span="4">本月计划发电量(万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.forecastKwh}}</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">2</el-col>
                    <el-col class="labelStyle" :span="4">本月实际发电量(万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.monthKwh}}</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">3</el-col>
                    <el-col class="labelStyle" :span="4">本月损失电量(万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.losskWh}}</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">4</el-col>
                    <el-col class="labelStyle" :span="4">本月完成比-包含损失(%)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.powerMonthLossComplete}}%</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">5</el-col>
                    <el-col class="labelStyle" :span="4">本年计划发电量(万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.contractKwh}}</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">6</el-col>
                    <el-col class="labelStyle" :span="4">本年累计发电量(万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.yearKwh}}</span></el-col>
                    <!--  -->
                    <el-col class="labelStyle" :span="2">7</el-col>
                    <el-col class="labelStyle" :span="4">本年累计完成比(%)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.powerYearComplete}}%</span></el-col>
                    <!--  -->
                    <!-- <el-col class="labelStyle" :span="2">8</el-col>
                    <el-col class="labelStyle" :span="4">本年损失电量（万kW•h)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.operationContract.powerPercentLossYear}}</span></el-col> -->
                    <!--  -->
                    <!-- <el-col class="labelStyle" :span="2">9</el-col>
                    <el-col class="labelStyle" :span="4">本年完成比-包含损失(%)</el-col>
                    <el-col class="labelStyle" :span="18"><span>{{row.operationContract.powerPercentInLossComplete}}</span></el-col> -->
                    <!--  -->
                </el-row>
            </div>
        </div>
        <el-table :data="tableList" style="width: 100%">
            <el-table-column align="center" prop="calendar" label="日期"> </el-table-column>
            <el-table-column align="center" prop="dayKwh" label="当日发电量(kWh)"> </el-table-column>
            <el-table-column align="center" prop="sDayRadiation" label="当日辐照量(Wh/㎡)"> </el-table-column>
            <el-table-column align="center" prop="sElecHours" label="有效发电小时数(h)"> </el-table-column>
            <el-table-column align="center" prop="faultLoss" label="故障损失"> </el-table-column>
            <el-table-column align="center" prop="notFaultLoss" label="非故障损失"> </el-table-column>
            <el-table-column align="center" prop="actualWeather" label="天气"> </el-table-column>
        </el-table>
        <pagination :auto-scroll="false" v-show="tabletotal > -1" :total="tabletotal" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getPlanDay" :page-sizes="[7]" />
        <!-- tag -->
        <el-tabs style="margin-top:20px" type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="巡检记录" name="1">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="巡检计划" align="center" prop="planName" :show-overflow-tooltip="true" />
                    <el-table-column label="设备类型" align="center" prop="deviceTypeName" :show-overflow-tooltip="true" />
                    <el-table-column label="开始时间" align="center" prop="startDate" :show-overflow-tooltip="true" />
                    <el-table-column label="结束时间" align="center" prop="endDate" :show-overflow-tooltip="true" />
                    <el-table-column label="巡检人员" align="center" prop="optUserName" :show-overflow-tooltip="true" />
                </el-table>
                <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getInspection" />
            </el-tab-pane>
            <el-tab-pane label="工单记录" name="2">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="工单编号" align="center" prop="issueCode" :show-overflow-tooltip="true" />
                    <el-table-column label="工单类型" align="center" prop="issueTypeName" :show-overflow-tooltip="true" />
                    <el-table-column label="设备类型" align="center" prop="deviceTypeName" :show-overflow-tooltip="true" />
                    <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true" />
                    <el-table-column label="故障现象" align="center" prop="remark" :show-overflow-tooltip="true" />
                    <el-table-column label="工单状态" align="center" prop="batchCode" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ issueStatus[scope.row.issueStatus] }}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="gdquery.pageNum" :limit.sync="gdquery.pageSize" @pagination="getHandleIssueOrderByPage" />
            </el-tab-pane>
            <!-- <el-tab-pane label="两票记录" name="3">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column align="center" show-overflow-tooltip prop="" label="操作票 本周数量|状态" :render-header="renderHeader">
                        <template>
                            <div class="votes">
                                <span>2</span>
                                <span>新建</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="电气一种工作票 本周数量|状态" align="center" prop="" :show-overflow-tooltip="true" :render-header="renderHeader" />
                    <el-table-column label="电气二种工作票 本周数量|状态" align="center" prop="" :show-overflow-tooltip="true" :render-header="renderHeader">

                    </el-table-column>
                    <el-table-column label="火车工作牌 本周数量|状态" align="center" prop="" :show-overflow-tooltip="true" :render-header="renderHeader" />
                </el-table>
                <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getStockList" />
            </el-tab-pane>
            <el-tab-pane label="项目记录" name="4">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="项目编号" align="center" prop="projectCode" />
                    <el-table-column label="项目名称" align="center" prop="projectName" :show-overflow-tooltip="true" />
                    <el-table-column label="项目负责人" align="center" prop="dutyUserName" :show-overflow-tooltip="true" />
                    <el-table-column label="日志时间" align="center" prop="logCreateTime" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ scope.row.logCreateTime&&moment(scope.row.logCreateTime).format("yyyy-MM-DD HH:mm:ss")}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="当日具体工作" align="center" prop="logWorkContent" :show-overflow-tooltip="true" />
                </el-table>
                <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="xmquery.pageNum" :limit.sync="xmquery.pageSize" @pagination="getProjectList" />
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
// import { getPlanDay } from "@/api/runing/runMonthly/runMonthly";
import { getDayDataList } from "@/api/runing/OperationDayData";
import {
    getInspection,
    getHandleIssueOrderByPage,
    getdictList,
    getProjectList,
} from "@/api/runing/recordList";
export default {
    name: "MonthlyInfo",
    data() {
        return {
            // tag
            total: 0,
            stockList: [],
            loading: false,
            // tab
            tabletotal: 0,
            tableList: [],
            load: false,
            //切换
            activeTab: "1",
            // 巡检查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                params: {
                    beginTime: null,
                    endTime: null,
                },
            },
            //工单记录
            gdquery: {
                pageNum: 1,
                pageSize: 15,
                startTime: null,
                endTime: null,
            },
            //工单状态
            issueStatus: {},
            //项目记录
            xmquery: {
                pageNum: 1,
                pageSize: 15,
                createStartTime: null,
                createEndTime: null,
            },
            // table查询参数
            query: {
                calendar: null, //时间
                contractId: null, //
                currentPage: 1,
                size: 7,
            },
            row: {},
        };
    },
    created() {
        this.row = JSON.parse(this.$route.query.row);
        this.query = {
            stationIdList: [this.row.stationId],
            startTime: this.moment(this.row.monthTitle).format("YYYY-MM-01"),
            endTime: this.moment(this.row.monthTitle)
                .endOf("month")
                .format("YYYY-MM-DD"),
            pageNum: 1,
            pageSize: 7,
        };
        // this.query.calendar = JSON.parse(this.$route.query.row).calendar;
        // this.query.contractId = JSON.parse(this.$route.query.row).contractId;
        this.getPlanDay();
        //巡检
        this.queryParams.params.beginTime = this.row.calendar;
        this.queryParams.params.endTime = this.moment(this.row.calendar)
            .endOf("month")
            .format("YYYY-MM-DD");
        //工单
        this.gdquery.startTime = this.row.calendar;
        this.gdquery.endTime = this.moment(this.row.calendar)
            .endOf("month")
            .format("YYYY-MM-DD");
        //项目
        this.xmquery.createStartTime = this.row.calendar;
        this.xmquery.createEndTime = this.moment(this.row.calendar)
            .endOf("month")
            .format("YYYY-MM-DD");
        //巡检
        this.getInspection();
        // 根据systemId获取对应的字典列表
        if (this.$store.getters.currentSystem == 1) {
            //工单状态
            getdictList("sys_workorder_status").then((res) => {
                for (let item of res.data) {
                    this.issueStatus[item.dictValue] = item.dictLabel;
                }
            });
        } else {
            //工单状态
            getdictList("sys_workorder_status").then((res) => {
                for (let item of res.data) {
                    this.issueStatus[item.dictValue] = item.dictLabel;
                }
            });
        }
    },
    methods: {
        //切换选项卡
        changeTab(tab, event) {
            var self = this;
            //重置翻页
            switch (self.activeTab) {
                case "1":
                    self.queryParams.pageNum = 1;
                    self.queryParams.pageSize = 15;
                    self.getInspection();
                    break;
                case "2":
                    self.gdquery.pageNum = 1;
                    self.gdquery.pageSize = 15;
                    self.getHandleIssueOrderByPage();
                    break;
                case "3":
                    break;
                case "4":
                    self.xmquery.pageNum = 1;
                    self.xmquery.pageSize = 15;
                    self.getProjectList();
                    break;
            }
        },
        /** 查询库存记录 */
        getStockList(id) {
            this.loading = true;
        },
        /** 查询巡检记录 */
        getInspection() {
            this.loading = true;
            getInspection(this.queryParams).then((res) => {
                this.stockList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        /** 查询工单记录 */
        getHandleIssueOrderByPage() {
            this.loading = true;
            getHandleIssueOrderByPage(this.gdquery).then((res) => {
                this.stockList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        /** 查询检测记录 */
        getStockTestList() {
            this.loading = true;
        },
        /** 查询项目记录 */
        getProjectList() {
            this.loading = true;
            getProjectList(this.xmquery).then((res) => {
                this.stockList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        /** 自定义表头 */
        renderHeader(createElement, { column, _self }) {
            let label = column.label;
            let labelArr = label.split(" ");
            let lab1 = labelArr[1].split("|")[0];
            let lab2 = labelArr[1].split("|")[1];
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
                        [labelArr[0]]
                    ),
                    createElement(
                        "div",
                        {
                            attrs: { type: "text" },
                            style: {
                                display: ["flex"],
                                justifyContent: ["space-around"],
                            },
                        },
                        [
                            createElement("div", { style: { width: "50%" } }, [
                                lab1 || "",
                            ]),
                            createElement("div", { style: { width: "50%" } }, [
                                lab2 || "",
                            ]),
                        ]
                    ),
                ]
            );
        },
        /**获取日期数据 */
        getPlanDay() {
            this.load = true;
            getDayDataList(this.query).then((res) => {
                console.log(res);
                this.load = false;
                this.tableList = res.rows;
                this.tabletotal = res.total;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    margin-bottom: 10px;
    .el-col {
        font-weight: 400;
    }
    .title {
        height: 30px;
        background-color: #d7dde4;
        span {
            line-height: 30px;
        }
    }
    //**表格样式设计 */
    .table {
        padding-top: 10px;
        padding-bottom: 10px;
        .rowStyle {
            border-top: 1px solid #dfe6ec;
            border-left: 1px solid #dfe6ec;
            .valueStyle {
                border-right: 1px solid #dfe6ec;
                border-bottom: 1px solid #dfe6ec;
                background-color: #f9f9f9;
                height: 30px;
                text-align: center;
                line-height: 30px;
                text-align: center;
            }
            .labelStyle {
                overflow: hidden;
                text-overflow: ellipsis; 
                border-right: 1px solid #dfe6ec;
                border-bottom: 1px solid #dfe6ec;
                height: 30px;
                text-align: center;
                line-height: 30px;
                font-size: 14px;
            }
        }
    }
}
.votes {
    display: flex;
    justify-content: space-around;
}
</style>
