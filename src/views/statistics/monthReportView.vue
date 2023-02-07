<template>
    <div class="app-container">
        <!--    搜索栏-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <el-form-item label="电站名称" prop="stationIds">
                <station-search :queryParams="queryParams" stationId="stationIds"/>
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

        <el-table :data="dataList" v-loading="loading" v-if="stationType===1">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="220"/>
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true" />
            <el-table-column label="装机容量" prop="netInstallCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="并网时间" prop="netTime" :show-overflow-tooltip="true" />
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" />
            <el-table-column label="合同发电量" prop="contractKwh" :show-overflow-tooltip="true" />
            <el-table-column label="本月实际发电量" prop="monthKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月实际完成比例" prop="monthCompletePercent" :show-overflow-tooltip="true" />

        </el-table>

        <el-table :data="dataList" v-loading="loading" v-if="stationType!==1">
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true" width="220"/>
            <el-table-column label="装机容量" prop="netCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="并网时间" prop="netTime" :show-overflow-tooltip="true" />
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" />
            <el-table-column label="合同发电量" prop="contractKwh" :show-overflow-tooltip="true" />
            <el-table-column label="本月实际发电量" prop="monthKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月实际完成比例" prop="monthCompletePercent" :show-overflow-tooltip="true" />

            <el-table-column label="月下网电量" prop="wBuyNetMonthKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月厂用电量" prop="wMonthFactoryUseKwh" :show-overflow-tooltip="true" />
            <el-table-column label="月厂用电率" prop="monthUseKwhPercent" :show-overflow-tooltip="true" />

        </el-table>

        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import { getMonthDataReport } from "@/api/dataMaintain/dataReport";

export default {
    name: "monthReportView",
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
                stationIds: null,
            },
            // 实际查询条件
            query: {},
            total: 0,
            //数据列表
            dataList: [],
            stationType: 1,
            rules: {
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
         * 获取 数据列表
         */
        getList() {
            this.loading = true;
            getMonthDataReport(this.query).then((res) => {
                this.loading = false;
                this.dataList = res.rows;
                this.total = res.total
                this.stationType = this.queryParams.systemId;
            });
        },

        /**
         * 点击 查询 按钮操作
         */
        search() {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    // this.queryParams.stationIds = [this.queryParams.stationIds];
                    this.query = JSON.parse(JSON.stringify(this.queryParams));
                    this.getList();
                }
            });
        },

        changeStartYear(date) {
            this.queryParams.endTime = null;
        },
    },
};
</script>

<style scoped>
</style>
