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
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :type="dateType" :clearable="false" pageSize="small" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" @change="changeEnd" :type="dateType" :clearable="false" pageSize="small" :picker-options="endTime" style="width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" pageSize="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->

        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="所属电站" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="query.searchType == 'date'">{{ moment(scope.row.calendar).format('YYYY-MM-DD') }}</span>
                    <span v-else-if="query.searchType == 'month'">{{ moment(scope.row.calendar).format('YYYY-MM') }}</span>
                    <span v-else-if="query.searchType == 'year'">{{ moment(scope.row.calendar).format('YYYY') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发电量(kWh)" prop="powerKwh" :show-overflow-tooltip="true" />
            <el-table-column label="发电量(kWh)90%-115%" prop="powerNine" :show-overflow-tooltip="true" />
            <el-table-column label="发电量(kWh)70%-90%" prop="powerSeven" :show-overflow-tooltip="true" />
            <el-table-column label="发电量(kWh)0%-70%" prop="powerZero" :show-overflow-tooltip="true" />
            <el-table-column label="模拟发电量(kWh)" prop="simulationKwh" :show-overflow-tooltip="true" />
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import { getPowerRatio } from "@/api/dataMaintain/pgsEfficiency.js";

export default {
    name: "dpgStatistics",
    components: {
        StationSearch,
        excelImport,
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
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                endTime: this.moment().format("YYYY-MM-DD"),
                stationIds: [],
                systemId: null,
                searchType: 'date'
            },
            query: {},
            dataList: [],
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
      this.getDeviceDay();
    },
    methods: {
        /**获取设备发电量 日 */
        getDeviceDay() {
            this.loading = true;
            getPowerRatio(this.queryParams).then((res) => {
                const {
                    pageNum,
                    pageSize,
                    startTime,
                    endTime,
                    stationIds,
                    systemId,
                    searchType,
                } = this.queryParams;
                this.query = {
                    pageNum,
                    pageSize,
                    startTime,
                    endTime,
                    stationIds,
                    systemId,
                    searchType,
                };
                this.dataList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        //分页
        getList() {
            this.loading = true;
            getPowerRatio(this.query, this.query.dateType).then((res) => {
                this.dataList = res.rows;
                this.total = res.total;
                this.loading = false;
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
                        this.queryParams.searchType = this.dateType;
                        this.getDeviceDay();
                    }
                }
            });
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
        /**日期类型选 */
        changeSelect(value) {
            this.queryParams.startTime = null;
            this.queryParams.endTime = null;
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.selectD {
    text-align: center;
}
</style>
