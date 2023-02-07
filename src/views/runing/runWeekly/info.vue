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
                <el-table-column align="center" prop="dateName" label="计划电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekForecastkWh : scope.row.dateName == "月" ? tableList.monthForecastkWh : tableList.yearForecastkWh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="实际电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekKWh : scope.row.dateName == "月" ? tableList.monthKWh : tableList.yearKWh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="完成比不含损失（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekKwhRatio : scope.row.dateName == "月" ? tableList.monthKwhRatio : tableList.yearKwhRatio }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="损失电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekTotalLoss : scope.row.dateName == "月" ? tableList.monthTotalLoss : tableList.yearTotalLoss }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="完成比含损失（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekKwhLossRatio : scope.row.dateName == "月" ? tableList.monthKwhLossRatio : tableList.yearKwhLossRatio }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="厂用电量(万kWh)">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekSDayUseKwh : scope.row.dateName == "月" ? tableList.monthSDayUseKwh : tableList.yearSDayUseKwh }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="powerRealLossDay" label="厂用电率（%）">
                    <template slot-scope="scope">
                        <span>{{ scope.row.dateName == "周" ? tableList.weekSFactoryUsePercent : scope.row.dateName == "月" ? tableList.monthSFactoryUsePercent : tableList.yearSFactoryUsePercent }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="title">
                <span> 四、本周日发电量分析 </span>
            </div>
            <el-table v-loading="load" :data="tableList.dayDataOutputList" style="width: 100%" border>
                <el-table-column align="center" prop="calendar" label="日期"></el-table-column>
                <el-table-column align="center" prop="sInstallCapacity" label="设计并网容量（MW）"></el-table-column>
                <el-table-column align="center" prop="sStationCapacity" label="上报并网容量（MW）"></el-table-column>
                <el-table-column align="center" prop="sDayKwh" label="发电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="sDayUseKwh" label="上网电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="sDayRadiation" label="辐照量(MJ/㎡)"></el-table-column>
                <el-table-column align="center" prop="sUtilizationHours" label="等效利用小时数(h）"></el-table-column>
                <el-table-column align="center" prop="sLosskWh" label="故障损失电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="sNotLosskWh" label="非故障损失电量(万kWh)"></el-table-column>
                <el-table-column align="center" prop="sActualWeather" label="天气状况"></el-table-column>
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
                        <span>{{ tableList.yearNotCloseOrderNum }}</span>
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
<!--            <div class="title">-->
<!--                <span> 六、两票执行情况： </span>-->
<!--            </div>-->
<!--            <el-table v-loading="load" :data="[]" style="width: 100%" border>-->
<!--                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerDay" label="类别"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerIrradiationDay" label="操作票（份）"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerEmployDay" label="电气一种工作票（份）"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="电气二种工作票（份）"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="风机工作票（份）"></el-table-column>-->
<!--            </el-table>-->
<!--            <div class="title">-->
<!--                <span> 两票明细： </span>-->
<!--            </div>-->
<!--            <el-table v-loading="load" :data="[]" style="width: 100%">-->
<!--                <el-table-column type="index" align="center" prop="calendar" label="类型"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerDay" label="工作票编号"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerIrradiationDay" label="任务"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerEmployDay" label="许可时间"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="终结时间"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="许可人"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="负责人"></el-table-column>-->
<!--                <el-table-column align="center" prop="powerRealLossDay" label="执行情况"></el-table-column>-->
<!--            </el-table>-->
            <div class="title">
                <span> 六、本周逆变器日均MW发电量分析</span>
            </div>
            <div class="titleInfo">
                <span> 本周逆变器日均MW发电量为
                    <span style="color:red">
                        {{tableList.weekDeviceDayAvgMWPower + "kW"}}
                    </span>最高值
                    <span style="color:red">
                        {{tableList.weekDeviceDayAvgMWPowerMax + "kW"}}
                    </span>
                    <span style="color:red">
                        {{"(" + tableList.weekDeviceDayAvgMWPowerMaxName + ")"}}
                    </span>最低值为
                    <span style="color:red">
                        {{tableList.weekDeviceDayAvgMWPowerMin + "kW"}}
                    </span>
                    <span style="color:red">
                        {{"(" +tableList.weekDeviceDayAvgMWPowerMinName + ")"}}
                    </span></span>
            </div>
            <span> 设备发电能力最差10台逆变器明细: </span>
            <el-table v-loading="load" :data="tableList.deviceMWPowerDataOutputList" style="width: 100%" border>
                <el-table-column type="index" align="center" prop="calendar" label="序号"></el-table-column>
                <el-table-column align="center" prop="deviceName" label="设备名称"></el-table-column>
                <el-table-column align="center" prop="devicePower" label="设备当日发电量"></el-table-column>
                <el-table-column align="center" prop="deviceInstalledCapacity" label="装机容量(MW)"></el-table-column>
                <el-table-column align="center" prop="avgMWPower" label="本周日均MW发电量(kWh)"></el-table-column>
                <el-table-column align="center" prop="deviation" label="偏差比"></el-table-column>
                <el-table-column align="center" prop="remark" label="说明"></el-table-column>
            </el-table>
<!--            <div class="title">-->
<!--                <span> 八、清洗除草执情况 </span>-->
<!--            </div>-->
<!--            <div class="titleInfo">-->
<!--                <span>-->
<!--                    组件清洗：本年合同要求次数：-->
<!--                    <span style="color:red">-->
<!--                        {{tableList.askCleanNumber}}-->
<!--                    </span>-->
<!--                    实际清洗次数：-->
<!--                    <span style="color:red">-->
<!--                        {{tableList.realCleanNumber}}-->
<!--                    </span>-->
<!--                    目前清洗进度：-->
<!--                    <span style="color:red">-->
<!--                        {{`${tableList.realCleanNumber} / ${tableList.askCleanNumber}`}}-->
<!--                    </span>-->

<!--                </span>-->
<!--            </div>-->
<!--            <div class="titleInfo">-->
<!--                <span>-->
<!--                    光伏除草：本年合同要求次数：-->
<!--                    <span style="color:red">-->
<!--                        {{tableList.askWeedNumber}}-->
<!--                    </span>-->
<!--                    实际除草次数：-->
<!--                    <span style="color:red">-->
<!--                        {{tableList.realWeedNumber}}-->
<!--                    </span>-->
<!--                    目前除草进度：-->
<!--                    <span style="color:red">-->
<!--                        {{`${tableList.realWeedNumber} / ${tableList.askWeedNumber}`}}-->
<!--                    </span>-->
<!--                </span>-->
<!--            </div>-->
<!--            <span> 组件清洗明细 </span>-->

<!--            <el-table v-loading="load" :data="tableList.cleanProjectDataOutputList" style="width: 100%" border>-->
<!--                <el-table-column align="center" type="index" label="序号"></el-table-column>-->
<!--                <el-table-column align="center" prop="cleanType" label="清洗方式"></el-table-column>-->
<!--                <el-table-column align="center" prop="cleanCapacity" label="清洗容量"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectStartDate" label="实际开始日期"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectEndDate" label="结束日期"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectStatus" label="状态"></el-table-column>-->
<!--                <el-table-column align="center" prop="superviseUser" label="监督人"></el-table-column>-->
<!--                <el-table-column align="center" prop="checkUserName" label="验收人"></el-table-column>-->
<!--                <el-table-column align="center" prop="checkResult" label="验收结果"></el-table-column>-->
<!--            </el-table>-->
<!--            <span> 除草明细 </span>-->
<!--            <el-table v-loading="load" :data="tableList.weedProjectDataOutputList" style="width: 100%" border>-->
<!--                <el-table-column align="center" type="index" label="序号"></el-table-column>-->
<!--                <el-table-column align="center" prop="useType" label="除草方式"></el-table-column>-->
<!--                <el-table-column align="center" prop="weedArea" label="除草面积"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectStartDate" label="实际开始日期"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectEndDate" label="结束日期"></el-table-column>-->
<!--                <el-table-column align="center" prop="projectStatus" label="状态"></el-table-column>-->
<!--                <el-table-column align="center" prop="superviseUser" label="监督人"></el-table-column>-->
<!--                <el-table-column align="center" prop="checkUserName" label="验收人"></el-table-column>-->
<!--                <el-table-column align="center" prop="checkResult" label="验收结果"></el-table-column>-->
<!--            </el-table>-->
        </div>
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
            cleanWeedList: [], //清洗和除草
            load: false,
        };
    },
    created() {
        this.row = this.$route.query;
        this.getWeekInfoData();
    },
    methods: {
        //获取数据
        getWeekInfoData() {
            this.load = true;
            getWeekInfoData(this.row).then((res) => {
                this.load = false;
                this.tableList = res.data;
                this.stationCapacity =
                    this.tableList.sysPowerStationNetCapacityOutput.stationCapacity;
                this.stationInstallCapacity =
                    this.tableList.sysPowerStationNetCapacityOutput.stationInstallCapacity;
            });
        },
        //发电量合并行
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
        //工单合并行
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
    },
};
</script>
<style lang="scss" scoped>
.info {
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
