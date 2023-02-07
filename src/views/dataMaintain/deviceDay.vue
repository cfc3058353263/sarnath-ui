<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" :rules="rules" label-width="90px" v-show="showSearch">
            <el-form-item label="电站名称" prop="stationId">
                <station-search ref="station" :queryParams="queryParams" stationId="stationId" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" type="date" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="stopTime" label="结束时间">
                <el-date-picker v-model="queryParams.stopTime" type="date" :clearable="false" size="small" :picker-options="stopTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(false)"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="日期" prop="dataTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.dataTime).format('YYYY-MM-DD') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备名称" prop="deviceName" :show-overflow-tooltip="true" />
            <el-table-column label="设备日发电量(kWh)" prop="devicePower" :show-overflow-tooltip="true" />
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getList(false)" />
        <!-- 分页 -->
    </div>
</template>

<script>
import { getDeviceList } from "@/api/dataMaintain/deviceDay";
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";

export default {
    name: "deviceDay",
    components: {
        StationSearch,
        excelImport,
    },
    data() {
        let self = this
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
            queryParams: {
                currentPage: 1,
                size: 15,
                startTime: null,
                stopTime: null,
                stationId: null,
                systemId: null,
            },
            query: {},
            dataList: [],
            rules: {
                stationId: [
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
                stopTime: [
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
    methods: {
        /**获取设备列表 */
        getList(isTrue) {
            if (isTrue) {
                const {
                    currentPage,
                    size,
                    startTime,
                    stopTime,
                    stationId,
                    systemId,
                } = this.queryParams;
                this.query = {
                    currentPage,
                    size,
                    startTime,
                    stopTime,
                    stationId,
                    systemId,
                };
            }
            this.loading = true;
            getDeviceList(this.query).then((res) => {
                this.dataList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /**查询 */
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    this.getList(true);
                }
            });
        },
        /**新增 */
        handleAdd() {
            if (!this.queryParams.stationId) {
                this.msgError("请选择电站");
                return;
            } else {
                this.$router.push({
                    path: this.$store.getters.routerPrefix +  "/statistics/dataMaintain/addDeviceDay",
                    query: {
                        station: JSON.stringify(this.$refs.station.stationData),
                    },
                });
            }
        },
        /**时间选择 */
        changeStart(date) {
            this.queryParams.stopTime = null;
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
