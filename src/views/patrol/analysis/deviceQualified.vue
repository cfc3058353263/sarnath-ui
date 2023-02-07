<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="90px" v-show="showSearch" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>

            </el-form-item> -->
            <el-form-item prop="startDate" label="开始时间">
                <el-date-picker v-model="queryParams.startDate" @change="changeStart" type="date" :clearable="true" size="small" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endDate" label="结束时间">
                <el-date-picker v-model="queryParams.endDate" @change="changeEnd" type="date" :clearable="true" size="small" :picker-options="endDate" style="width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>

            </el-form-item>
            <el-form-item>
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['patrol:analysis:export']">导出</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->

        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">

            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="设备总数" prop="deviceCount" :show-overflow-tooltip="true" />
            <el-table-column label="巡检次数" prop="checkCount" :show-overflow-tooltip="true" />
            <el-table-column label="正常次数" prop="normalCount" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link v-if="scope.row.normalCount>0" type="primary" @click="normalClick()">{{scope.row.normalCount}}</el-link>

                    <span v-else>{{scope.row.normalCount}}</span>

                </template>
            </el-table-column>
            <el-table-column label="不正常次数" prop="abnormalCount" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.abnormalCount==0" type="danger" slot="reference" :disable-transitions="true" style="font-size: large;" :hit="true" size="medium">
                        <el-link type="primary" @click="abnormalClick()">{{scope.row.abnormalCount}}</el-link>
                    </el-tag>
                    <span v-else>{{scope.row.abnormalCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="未巡检设备数量" prop="unCheckInverterCount" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.unCheckInverterCount>0" placement="top-start" title="未巡检设备" width="400" trigger="hover" :content="scope.row.unCheckList.join(',')">
                        <el-tag type="danger" slot="reference" :disable-transitions="true" style="font-size: large;" :hit="true" size="medium">{{scope.row.unCheckInverterCount}}</el-tag>

                    </el-popover>
                    <span v-else>{{scope.row.unCheckInverterCount}}</span>

                </template>
            </el-table-column>
            <el-table-column label="合格率" prop="normalRate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{scope.row.normalRate}}%</span>
                </template>
            </el-table-column>
            <el-table-column label="未巡检设备占比" prop="unCheckInverterRate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{scope.row.unCheckInverterRate}}%</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

    </div>
</template>

<script>
import stationCheckbox from "@/views/components/stationCheckbox";
import excelImport from "@/views/components/ExcelImport";
import { listData } from "@/api/patrol/deviceQualified.js";

export default {
    name: "deviceQualified",
    components: {
        stationCheckbox,
        excelImport,
    },
    data() {
        let self = this;
        return {
            endDate: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.startDate),
                                "day"
                            ) < 0
                    );
                },
            },
            showSearch: true,
            loading: false,
            total: 0,
            queryParams: {
                currentPage: 1,
                size: 15,
                startDate: null,
                endDate: null,
                stationIds: [],
            },
            dataList: [],
            rules: {
                stationIds: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        //分页
        getList() {
            this.loading = true;
            listData(this.queryParams).then((res) => {
                this.dataList = res.data;

                this.loading = false;
            });
        },
        //查询
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    if (
                        this.moment(this.queryParams.endDate).diff(
                            this.moment(this.queryParams.startDate),
                            "day"
                        ) < 0
                    ) {
                        this.msgError("日期区间结束时间不得早于开始时间");
                    } else {
                        this.$refs.queryParams.validate((valid) => {
                            if (valid) {
                                this.getList();
                            }
                        });
                    }
                }
            });
        },
        /**时间选择 */
        changeStart(date) {
            this.queryParams.endDate = null;
            this.queryParams.startDate = this.moment(date).format("YYYY-MM-DD");
        },
        changeEnd(date) {
            this.queryParams.endDate = this.moment(date).format("YYYY-MM-DD");
        },
        /**日期类型选 */
        changeSelect(value) {
            this.queryParams.startDate = null;
            this.queryParams.endDate = null;
        },
        handleExport() {},
        abnormalClick() {
            //不正常次数
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/patrol/deviceQualified/info",
                query: {
                    deviceStatus: 2,
                    stationIds: this.queryParams.stationIds,
                    startDate: this.queryParams.startDate,
                    endDate: this.queryParams.endDate,
                },
            });
        },
        normalClick() {
            //正常次数
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/patrol/deviceQualified/info",
                query: {
                    deviceStatus: 1,
                    stationIds: this.queryParams.stationIds,
                    startDate: this.queryParams.startDate,
                    endDate: this.queryParams.endDate,
                },
            });
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
