<template>
    <div class="app-container">
        <!--  搜索条件  -->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item label="工单类型" prop="issueType">
                <el-select size="small" v-model="queryParams.issueType" placeholder="工单类型" clearable style="width: 100%">
                    <el-option v-for="item in issueTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select size="small" v-model="queryParams.deviceType" placeholder="设备类型" clearable style="width: 100%">
                    <el-option v-for="item in deviceTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" style="width: 100%" maxlength="50"/>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker size="small" v-model="queryParams.startTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="故障开始时间" prop="endTime">
                <el-date-picker size="small" v-model="queryParams.endTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="工单状态" prop="issueStatus">
                <el-select size="small" v-model="queryParams.issueStatus" placeholder="工单状态" clearable style="width: 100%">
                    <el-option v-for="item in issueStatusOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="issueHandleList">
            <el-table-column width="150" label="工单编号" align="center" key="issueCode" prop="issueCode" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="工单类型" align="center" key="issueTypeName" prop="issueTypeName" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="工单状态" align="center" key="issueStatusName" prop="issueStatusName" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="设备类型" align="center" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="设备名称" align="center" key="deviceName" prop="deviceName" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="处理单位" align="center" key="optDeptName" prop="optDeptName" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="工单下发时间" align="center" key="createTime" prop="createTime" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="工单更新时间" align="center" key="lastUpdateTime" prop="lastUpdateTime" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="故障小时数" align="center" key="faultHours" prop="faultHours" :show-overflow-tooltip="true"/>
            <el-table-column width="150" label="工单损失kwh" align="center" key="lossKwh" prop="lossKwh" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.issueStatus!='3'" @click="dealIssue(scope.row)">处理
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-search" @click="checkIssue(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

    </div>
</template>

<script>
import { getDicts } from "@/api/system/dict/data";
import { getHandleIssueOrderByPage } from "@/api/issue/issue";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "index",
    components: { stationCheckbox },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //总数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                deviceType: undefined,
                deviceName: undefined,
                status: undefined,
                stationIds: [],
            },
            query: {},
            // 工单列表数据
            issueHandleList: [],
            //工单类型选项
            issueTypeOptions: [],
            //设备类型选项
            deviceTypeOptions: [],
            issueStatusOptions: [
                { dictValue: "2", dictLabel: "处理中" },
                { dictValue: "3", dictLabel: "已完成" },
            ],
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
        this.getOptionData();
        this.$nextTick(() => {
            this.handleQuery();
        });
        // this.handleQuery();
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        /**
         * 获取下拉框和字典数据
         */
        getOptionData() {
            // 根据systemId获取对应的字典列表
            if (this.$store.getters.currentSystem == 1) {
                //获取工单类型字典数据
                getDicts("sys_workorder_type").then((res) => {
                    this.issueTypeOptions = res.data;
                });
                //获取设备类型
                getDicts("sys_device_type").then((res) => {
                    this.deviceTypeOptions = res.data;
                });
            } else {
                //获取工单类型字典数据
                getDicts("sys_workorder_type_wind").then((res) => {
                    this.issueTypeOptions = res.data;
                });
                //获取设备类型
                getDicts("sys_device_type_wind").then((res) => {
                    this.deviceTypeOptions = res.data;
                });
            }
        },
        /**
         * 获取列表
         */
        getList() {
            getHandleIssueOrderByPage(this.query).then((res) => {
                this.issueHandleList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        /**
         * 重置查询表单
         */
        resetQueryForm() {
            this.queryParams.issueType = undefined;
            this.queryParams.deviceType = undefined;
            this.queryParams.deviceName = undefined;
            this.queryParams.startTime = undefined;
            this.queryParams.endTime = undefined;
            this.queryParams.issueStatus = undefined;
        },
        /**
         * 点击查询按钮操作
         */
        handleQuery() {
            this.query = Object.assign({}, this.queryParams);
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.getList();
                }
            });
            // this.getList();
        },
        /**
         * 点击重置按钮操作
         */
        resetQuery() {
            this.resetQueryForm();
            this.getList();
        },
        /**
         * 点击处理按钮操作
         */
        dealIssue(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/issue/handle/data",
                // name: "issueHandleData",
                params: {},
                query: { issueId: row.id, createTime: row.createTime },
            });
        },
        /**
         * 点击查看按钮操作
         * @param row
         */
        checkIssue(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/issue/handle/info",
                // name: "issueHandleInfo",
                params: {},
                query: { issueId: row.id },
            });
        },
    },
};
</script>

<style scoped>
</style>
