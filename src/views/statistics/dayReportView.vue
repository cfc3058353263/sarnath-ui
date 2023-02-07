<template>
    <div class="app-container">
        <!--    搜索栏-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <el-form-item label="电站名称" prop="stationIdList">
                <station-search :queryParams="queryParams" stationId="stationIdList" />
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStartYear" size="small" unlink-panels value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :picker-options="endTime" size="small" unlink-panels value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>

        </el-form>

        <el-table v-loading="loading" :data="dataList" v-if="stationType===1">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="220"/>
            <el-table-column label="日报日期" width="100" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="并网容量" prop="netInstallCapacity" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="天气" prop="actualWeather" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="当日发电量(kWh)" prop="dayKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日MW发电量" prop="dayMwKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="当日辐照量(Wh/㎡)" prop="sDayRadiation" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="当日预计辐照量(Wh/㎡)" prop="sDayForeRadiation" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="有效发电小时数" prop="sElecHours" :show-overflow-tooltip="true" width="100"/>
            <!-- <el-table-column label="日发电效率" prop="sRatio" :show-overflow-tooltip="true" width="100"/> -->
            <el-table-column label="月并网容量预计发电量" prop="foreNetKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="月发电量" prop="monthKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="月完成比" prop="monthCompletePercent" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="本年计划完成比" prop="contractCompletePercent" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="合同发电量" prop="contractKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="累计发电量" prop="totalKwh" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="故障损失" prop="faultLoss" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="非故障损失" prop="notFaultLoss" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="日报状态" prop="submitStatusName" :show-overflow-tooltip="true" width="100"/>
            <!-- <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleCheck(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column> -->
            <!--
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="实际并网容量" prop="netInstallCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="并网时间" prop="netTime" :show-overflow-tooltip="true" />
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" />
            <el-table-column label="天气" prop="actualWeather" :show-overflow-tooltip="true" />
            <el-table-column label="日发电量" prop="totalKwh" :show-overflow-tooltip="true" />
            <el-table-column label="日MW发电量" prop="mwKwh" :show-overflow-tooltip="true" />

            <el-table-column label="日辐照量" prop="radiation" :show-overflow-tooltip="true" />
            <el-table-column label="日发电效率" prop="avgEfficiency" :show-overflow-tooltip="true" />
            <el-table-column label="月并网容量预计发电量" prop="forecastKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月发电量" prop="monthKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月完成比" prop="monthCompletePercent" :show-overflow-tooltip="true" />
            <el-table-column label="合同发电量" prop="contractPower" :show-overflow-tooltip="true" />
            <el-table-column label="故障损失" prop="powerLossDay" :show-overflow-tooltip="true" />
            <el-table-column label="非故障损失" prop="powerNoLossDay" :show-overflow-tooltip="true" /> -->
        </el-table>

        <el-table v-loading="loading" :data="dataList" v-if="stationType!==1">
            <el-table-column label="日期" width="130px" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="实际并网容量" prop="netInstallCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="并网时间" prop="netTime" :show-overflow-tooltip="true" />
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" />
            <el-table-column label="天气" prop="weather" :show-overflow-tooltip="true" />
            <el-table-column label="上网电量" prop="upNetKwh" :show-overflow-tooltip="true" />

            <el-table-column label="单台风机平均发电量" prop="kwhPerFan" :show-overflow-tooltip="true" />
            <el-table-column label="最小风速" prop="minWind" :show-overflow-tooltip="true" />
            <el-table-column label="最大风速" prop="maxWind" :show-overflow-tooltip="true" />
            <el-table-column label="平均风速" prop="avgWind" :show-overflow-tooltip="true" />
            <el-table-column label="最高负荷" prop="maxLoad" :show-overflow-tooltip="true" />
            <el-table-column label="日风机总发电量" prop="fanTotalKwh" :show-overflow-tooltip="true" />
            <el-table-column label="日集电线总发电量" prop="lineTotalKwh" :show-overflow-tooltip="true" />
            <el-table-column label="日下网电量" prop="buyNetKwh" :show-overflow-tooltip="true" />
            <el-table-column label="日厂用电量" prop="factoryUseKwh" :show-overflow-tooltip="true" />
            <el-table-column label="日厂用电率" prop="factoryUsePercent" :show-overflow-tooltip="true" />

            <el-table-column label="月并网容量预计发电量" prop="powerNetCapacityMonth" :show-overflow-tooltip="true" />
            <el-table-column label="月下网电量" prop="buyNetKwhMonth" :show-overflow-tooltip="true" />
            <el-table-column label="月厂用电量" prop="factoryUseKwhMonth" :show-overflow-tooltip="true" />
            <el-table-column label="月厂用电率" prop="factotyUsePersentMonth" :show-overflow-tooltip="true" />
            <el-table-column label="月上网电量" prop="powerRealMonth" :show-overflow-tooltip="true" />
            <el-table-column label="月完成比" prop="powerPercentComplete" :show-overflow-tooltip="true" />

            <el-table-column label="合同发电量" prop="contractPower" :show-overflow-tooltip="true" />
        </el-table>

        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import { getDayDataReport } from "@/api/dataMaintain/dataReport";

export default {
    name: "dayReportView",
    components: {
        StationSearch,
    },
    data() {
        let self = this;
        return {
            endTime: {
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
            //遮罩层
            loading: false,
            showSearch: true,
            // 页面查询参数
            queryParams: {
                pageSize: 15,
                pageNum: 1,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-MM-DD"),
                stationIdList: null,
            },
            // 实际查询条件
            query: {},
            total: 0,
            //数据列表
            dataList: [],
            stationType: 1,
            rules: {
                stationIdList: [
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
            },
        };
    },
    created() {},
    mounted() {
      this.query = JSON.parse(JSON.stringify(this.queryParams));
      this.getList();
    },
    methods: {
        /**
         * 获取日报一览数据
         */
        getList() {
            this.loading = true;
            getDayDataReport(this.query).then((res) => {
                this.loading = false;
                this.total = res.total;
                this.dataList = res.rows;
                this.stationType = this.queryParams.systemId;
            });
        },
        /**
         * 点击 查询 按钮操作
         */
        search() {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    // this.queryParams.stationIdList = [
                    //     this.queryParams.stationIdList,
                    // ];
                    this.query = JSON.parse(JSON.stringify(this.queryParams));
                    this.getList();
                }
            });
        },
        changeStartYear(date) {
            this.queryParams.endTime = null;
        },
        //查看
        handleCheck(row) {
            this.$router.push({
                path:
                    "/light/runing/runDaily/info",
                query: {
                    row: row.id,
                    calendar: row.calendar,
                },
            });
        },
    },
};
</script>

<style scoped>
</style>
