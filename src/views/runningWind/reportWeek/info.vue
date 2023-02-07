<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 一、并网情况： </span>
            </div>
            <el-table v-loading="load" :data="[tableList.sysPowerStationNetCapacityOutput]" style="width: 100%" border>
                <el-table-column align="center" prop="netTime" label="最后一次并网日期"></el-table-column>
                <el-table-column align="center" prop="netCapacity" label="增并容量（MW）"> </el-table-column>
                <el-table-column align="center" prop="stationInstallCapacity" label="装机容量（MW）"></el-table-column>
                <el-table-column align="center" prop="stationCapacity" label="实际装机（MW）"></el-table-column>
                <el-table-column align="center" prop="gridConnectionFlagName" label="完全并网状态"></el-table-column>
                <!-- <el-table-column align="center" prop="" label="备注"></el-table-column> -->
            </el-table>
            <div class="title">
                <span> 二、主要设备运行情况： </span>
            </div>
            <el-table v-loading="load" :data="tableList.deviceDataOutputList" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>
                <el-table-column align="center" prop="deviceTypeName" label="设备"></el-table-column>
                <el-table-column align="center" prop="deviceTotalNum" label="总数"></el-table-column>
                <el-table-column align="center" prop="deviceRunNum" label="运行数量"></el-table-column>
                <el-table-column align="center" prop="deviceStatus" label="运行状态"></el-table-column>
                <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            </el-table>
            <div class="title">
                <span> 三、发电量完成情况： </span>
            </div>
            <el-table v-loading="load" :data="dateCategory" style="width: 100%" :span-method="objectSpanMethod" border>
                <el-table-column align="center" prop="calendar" label="规划容量(MW)">
                    <template>
                        <span>{{ stationInstallCapacity }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerDay" label="实际装机容量(MW)">
                    <template>
                        <span>{{ stationCapacity}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="dateName" label="类别"></el-table-column>
                <el-table-column align="center" prop="dateName" label="计划发电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekForecastkWh : scope.row.dateName == "月" ? tableList.monthForecastkWh : tableList.yearForecastkWh }}</span>
                    </template>
                </el-table-column>
                <!--  -->
                <el-table-column align="center" prop="powerRealLossDay" label="风机发电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekWFanTotalKwh : scope.row.dateName == "月" ? tableList.monthWFanTotalKwh : tableList.yearWFanTotalKwh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="上网发电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekWUpNetKwh : scope.row.dateName == "月" ? tableList.monthWUpNetKwh : tableList.yearWUpNetKwh }}</span>
                    </template>
                </el-table-column>
                <!--  -->
                <el-table-column align="center" prop="powerRealLossDay" label="损失电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekTotalLoss : scope.row.dateName == "月" ? tableList.monthTotalLoss : tableList.yearTotalLoss }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="厂用电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekWDayFactoryUseKwh : scope.row.dateName == "月" ? tableList.monthWDayFactoryUseKwh : tableList.yearWDayFactoryUseKwh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="厂用电率（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekWFactoryUsePercent : scope.row.dateName == "月" ? tableList.monthWFactoryUsePercent : tableList.yearWFactoryUsePercent }}</span>
                    </template>
                </el-table-column>
                <!--  -->
                <el-table-column align="center" prop="powerRealLossDay" label="发电量完成比（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekWKwhRatio : scope.row.dateName == "月" ? tableList.monthWKwhRatio : tableList.yearWKwhRatio }}</span>
                    </template>
                </el-table-column>
                <!--  -->
            </el-table>
            <div class="title">
                <span> 四、本周日发电量分析 </span>
            </div>
            <el-table v-loading="load" :data="tableList.dayDataOutputList" style="width: 100%" border>
                <el-table-column align="center" prop="calendar" label="日期"></el-table-column>
                <el-table-column align="center" prop="wUpNetKwh" label="上网电量（kWh）"></el-table-column>
                <el-table-column align="center" prop="wFanTotalKwh" label="风机发电量（MW）"></el-table-column>
                <el-table-column align="center" prop="wUtilizationHours" label="利用小时数（h）"></el-table-column>
                <el-table-column align="center" prop="wMinWind" label="最小风速（m/s）"></el-table-column>
                <el-table-column align="center" prop="wMaxWind" label="最大风速（m/s）"></el-table-column>
                <el-table-column align="center" prop="wAvgWind" label="平均风速（m/s）"></el-table-column>
                <el-table-column align="center" prop="wMaxLoad" label="最大负载（MW）"></el-table-column>
                <!-- 缺少 -->
                <el-table-column align="center" prop="" label="当日发电分析"></el-table-column>
                <el-table-column align="center" prop="" label="备注"></el-table-column>
            </el-table>
            <div class="title">
                <span> 五、工单执行情况： </span>
            </div>
            <el-table v-loading="load" :data="orderCategory" style="width: 100%" :span-method="orderSpanMethod" border>
                <el-table-column align="center" prop="orderName" label="类别"></el-table-column>
                <el-table-column align="center" prop="" label="故障工单数量">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekLossOrderNum : tableList.yearLossOrderNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="故障工单数量">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekNotLossOrderNum : tableList.yearNotLossOrderNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="截止目前未关闭工单数量">
                    <template slot-scope="">
                        <span>{{ tableList.yearNotCloseOrderNum  }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerEmployDay" label="损失电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekTotalLoss : tableList.yearTotalLoss }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="故障损失(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekLosskWh : tableList.yearLosskWh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="非故障损失(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekNotLosskWh : tableList.yearNotLosskWh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="损失占比（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekForecastTotalLossRatio : tableList.yearForecastTotalLossRatio }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="故障损失占比（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekForecastLossRatio : tableList.yearForecastLossRatio }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="非故障损失占比（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekForecastNotLossRatio : tableList.yearForecastNotLossRatio }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="title">
                <span style="font-size:15px"> 故障损失说明： </span>
            </div>
            <el-table v-loading="load" :data="tableList.faultOrderDataOutputList" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>
                <el-table-column align="center" prop="deviceName" label="故障设备"></el-table-column>
                <el-table-column align="center" prop="faultReason" label="故障原因"></el-table-column>
                <el-table-column align="center" prop="affectInstallCapacity" label="影响容量（MW）"></el-table-column>
                <el-table-column align="center" prop="lossKwh" label="损失电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="startTime" label="故障开始时间"></el-table-column>
                <el-table-column align="center" prop="endTime" label="故障结束时间"></el-table-column>
                <el-table-column align="center" prop="orderStatus" label="目前处理状态"></el-table-column>
            </el-table>
            <div class="title">
                <span style="font-size:15px"> 非故障损失电量说明： </span>
            </div>
            <el-table v-loading="load" :data="tableList.notFaultOrderDataOutputList" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>
                <el-table-column align="center" prop="deviceName" label="故障设备"></el-table-column>
                <el-table-column align="center" prop="faultReason" label="故障原因"></el-table-column>
                <el-table-column align="center" prop="affectInstallCapacity" label="影响容量（MW）"></el-table-column>
                <el-table-column align="center" prop="lossKwh" label="损失电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="startTime" label="故障开始时间"></el-table-column>
                <el-table-column align="center" prop="endTime" label="故障结束时间"></el-table-column>
                <el-table-column align="center" prop="orderStatus" label="目前处理状态"></el-table-column>
            </el-table>
            <div class="title">
                <span> 六、两票执行情况： </span>
            </div>
            <el-table v-loading="load" :data="[]" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>
                <el-table-column align="center" prop="powerDay" label="类别"></el-table-column>
                <el-table-column align="center" prop="powerIrradiationDay" label="操作票（份）"></el-table-column>
                <el-table-column align="center" prop="powerEmployDay" label="电气一种工作票（份）"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="电气二种工作票（份）"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="风机工作票（份）"></el-table-column>
            </el-table>
            <div class="title">
                <span> 两票明细： </span>
            </div>
            <el-table v-loading="load" :data="[]" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="类型"></el-table-column>
                <el-table-column align="center" prop="powerDay" label="工作票编号"></el-table-column>
                <el-table-column align="center" prop="powerIrradiationDay" label="任务"></el-table-column>
                <el-table-column align="center" prop="powerEmployDay" label="许可时间"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="终结时间"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="许可人"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="负责人"></el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="执行情况"></el-table-column>
            </el-table>
        </div>
        <el-table v-loading="load" :data="[]" style="width: 100%">
            <el-table-column align="center" prop="calendar" label="日期"> </el-table-column>
            <el-table-column align="center" prop="powerDay" label="发电量（kWh）"> </el-table-column>
            <el-table-column align="center" prop="powerIrradiationDay" label="当日辐照量(Wh/㎡)"> </el-table-column>
            <el-table-column align="center" prop="powerEmployDay" label="有效发电小时数(h)"> </el-table-column>
            <el-table-column align="center" prop="powerRealLossDay" label="损失电量"> </el-table-column>
            <el-table-column align="center" prop="powerAvgDay" label="日均MW发电量"> </el-table-column>
            <el-table-column align="center" prop="weather" label="天气"> </el-table-column>
        </el-table>
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
            <el-tab-pane label="两票记录" name="3">
                <el-table v-loading="loading" :data="stockList">
                    <!-- 自定义表头测试 -->
                    <el-table-column align="center" show-overflow-tooltip prop="telephone" label="操作票 本周数量|状态" :render-header="renderHeader">
                        <!-- <template>
                            <div class="votes">
                                <span>2</span>
                                <span>新建</span>
                            </div>
                        </template> -->
                    </el-table-column>
                    <!--  -->

                    <el-table-column label="电气一种工作票 本周数量|状态" align="center" prop="number" :show-overflow-tooltip="true" :render-header="renderHeader" />
                    <el-table-column label="电气二种工作票 本周数量|状态" align="center" prop="unit" :show-overflow-tooltip="true" :render-header="renderHeader">
                        <template slot-scope="scope">
                            <span>{{ unit[scope.row.toolsUnit] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="火车工作牌 本周数量|状态" align="center" prop="reason" :show-overflow-tooltip="true" :render-header="renderHeader" />
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
            </el-tab-pane>
        </el-tabs>
        <!-- <el-dialog :visible.sync="dialogVisible" style="text-align: center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog> -->
    </div>
</template>

<script>
import { getPlanDay, getWeekInfoData } from "@/api/runing/runWeekly/runWeekly";
import {
    getInspection,
    getHandleIssueOrderByPage,
    getdictList,
    getProjectList,
} from "@/api/runing/recordList";
export default {
    name: "weeklyInfo",
    data() {
        return {
            tableList: [],
            dateCategory: [
                { dateName: "周" },
                { dateName: "月" },
                { dateName: "年" },
            ],
            orderCategory: [{ orderName: "周" }, { orderName: "年度" }],
            stationCapacity: "", //实际装机
            stationInstallCapacity: "", //规划容量/装机容量
            // tag
            total: 0,
            stockList: [],
            loading: false,
            // tab
            tabletotal: 0,
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
                startTime: null, //时间
                endTime: null, //
                currentPage: 1,
                size: 7,
            },
            row: null,
        };
    },
    created() {
        // this.row = JSON.parse(this.$route.query.row);
        this.row = this.$route.query
        this.getWeekInfoData();
        // this.query.endTime = JSON.parse(this.$route.query.row).endTime;
        // this.query.startTime = JSON.parse(this.$route.query.row).startTime;
        // this.getPlanDay();
        // //巡检
        // this.queryParams.params.beginTime = this.row.startTime;
        // this.queryParams.params.endTime = this.row.endTime;
        // //工单
        // this.gdquery.startTime = this.row.startTime;
        // this.gdquery.endTime = this.row.endTime;
        // //项目
        // this.xmquery.createStartTime = this.row.startTime;
        // this.xmquery.createEndTime = this.row.endTime;
        // //巡检
        // this.getInspection();
        // // 根据systemId获取对应的字典列表
        // if(this.$store.getters.currentSystem == 1) {
        //   //工单状态
        //   getdictList("sys_workorder_status").then((res) => {
        //     for (let item of res.data) {
        //       this.issueStatus[item.dictValue] = item.dictLabel;
        //     }
        //   });
        // }else {
        //   //工单状态
        //   getdictList("sys_workorder_status").then((res) => {
        //     for (let item of res.data) {
        //       this.issueStatus[item.dictValue] = item.dictLabel;
        //     }
        //   });
        // }
    },
    methods: {
        //获取数据
        getWeekInfoData() {
            getWeekInfoData(this.row).then((res) => {
                this.tableList = res.data;
                this.stationCapacity =
                    this.tableList.sysPowerStationNetCapacityOutput.stationCapacity;
                this.stationInstallCapacity =
                    this.tableList.sysPowerStationNetCapacityOutput.stationInstallCapacity;
            });
        },
        //合并行
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            } else if (columnIndex === 1) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
        //合并行
        orderSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 3) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0,
                    };
                }
            }
        },
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
            getPlanDay(this.query).then((res) => {
                this.load = false;
                this.tableList = res.data.records;
                this.tabletotal = res.data.total;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    // margin-bottom: 10px;
    .el-col {
        font-weight: 400;
    }
    .title {
        text-align: left;
        margin-bottom: 5px;
        span {
            font-weight: 700;
        }
    }
    .titleInfo {
        text-align: left;
        margin-bottom: 5px;
        span {
            font-size: 14px;
            color: #515a6e;
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
