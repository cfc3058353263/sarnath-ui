<template>
    <div class="app-container">
        <!--计划数据-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item label="计划名称" prop="planName">
                <el-input v-model="queryParams.planName" placeholder="请输入计划名称" clearable size="small" @keyup.enter.native="handleQuery" maxlength="50" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small">
                    <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="dateRange[0]" size="small" @change="changeStart" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="dateRange[1]" size="small" :picker-options="endTime" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="状态" clearable size="small">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <!-- <el-table-column label="序号" type="index" width="50" align="center"></el-table-column> -->
            <el-table-column width="150" label="巡检计划编号" key="planCode" prop="planCode" :show-overflow-tooltip="true" />
            <el-table-column width="200" label="计划名称" key="planName" prop="planName" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span style="padding-right:5px">{{scope.row.planName}}</span>
                    <el-tag type="primary" v-if="scope.row.templateId!=null" disable-transitions>案</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="150" label="设备类型" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="计划开始时间" key="startDate" prop="startDate" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="计划结束时间" key="endDate" prop="endDate" :show-overflow-tooltip="true" />

            <el-table-column label="巡检周期" key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />

            <el-table-column label="巡检次数" key="recordCount" prop="recordCount" :show-overflow-tooltip="true" />
            <el-table-column label="设备数量" key="deviceCount" prop="deviceCount" :show-overflow-tooltip="true" />

            <el-table-column label="状态" key="statusName" prop="statusName" width="160" />

            <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleInfo(scope.row)" v-hasPermi="['patrol:plan:edit']">巡检记录</el-button>

                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { listData, add, update, getInfo } from "@/api/patrol/record";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "record",
    components: { stationCheckbox },
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(self.moment(self.dateRange[0]), "day") < 0
                    );
                },
            },
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            openDesigner: false,
            // 总条数
            total: 0,
            // 用户表格数据
            dataList: null,
            // 日期范围
            dateRange: [],
            dateTime: [],
            // 弹出层标题
            title: "",
            deviceTypeOptions: [], //设备类型
            statusOptions: [], //状态枚举
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            currentObj: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                planName: undefined,
                deviceType: undefined,
                status: undefined,
                stationIds: [],
            },
            query: {},
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
        this.$nextTick(() => {
            this.handleQuery();
        });
        // 根据systemId获取对应的字典列表
        if (this.$store.getters.currentSystem == 1) {
            //设备类型
            this.getDicts("sys_device_type").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        } else {
            //设备类型
            this.getDicts("sys_device_type_wind").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        }
        //状态枚举
        this.getDicts("sys_plan_status").then((response) => {
            var status = response.data.filter(
                (x) => x.dictValue == "3" || x.dictValue == "4"
            );
            this.statusOptions = status;
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            if (this.dateTime[0] == null || this.dateTime[1] == null) {
                this.dateTime = [];
            }
            listData(this.addDateRange(this.query, this.dateTime)).then(
                (response) => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },

        // 表单重置
        reset() {
            this.form = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.query = Object.assign({}, this.queryParams);
            this.dateTime = JSON.parse(JSON.stringify(this.dateRange));
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.dateRange = [];
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },

        handleInfo(row) {
            var self = this;
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/patrol/record/info",
                query: { id: row.id },
            });
        },
        changeStart(date) {
            this.$set(this.dateRange, 1, null);
        },
    },
};
</script>
<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}

.box-card {
    width: 100%;
    background-color: #f2f6fc;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.selectD {
    text-align: center;
}
</style>
