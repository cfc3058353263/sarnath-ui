<template>
    <div class="app-container">
        <!--  搜索条件  -->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <!-- <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item label="工单类型" prop="issueType">
                <el-select size="small" v-model="queryParams.issueType" placeholder="工单类型" clearable>
                    <el-option v-for="item in issueTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
                <el-select size="small" v-model="queryParams.deviceType" placeholder="设备类型" clearable>
                    <el-option v-for="item in deviceTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" maxlength="50" />
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker size="small" v-model="queryParams.startTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="故障开始时间" prop="endTime">
                <el-date-picker size="small" v-model="queryParams.endTime" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作按钮-->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['issue:submit:add']">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:supplier:del']">删除
                </el-button>
            </el-col>
            <el-button type="primary" plain icon="el-icon-check" size="mini" @click="submit" :disabled="multiple" v-hasPermi="['system:role:add']">提交
            </el-button>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="issueList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column width="150" label="工单编号" align="center" key="issueCode" prop="issueCode" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="工单类型" align="center" key="issueTypeName" prop="issueTypeName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="设备类型" align="center" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="设备名称" align="center" key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="下发人" align="center" key="issuePersonName" prop="issuePersonName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="下发时间" align="center" key="createTime" prop="createTime" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="处理单位" align="center" key="optDept" prop="optDept" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="工单状态" align="center" key="issueStatusName" prop="issueStatusName" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-plus" @click="submit(scope.row)">提交
                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

        <!--  新增和编辑弹窗  -->
        <IssueSubmitDialog ref="IssueSubmitDialog" :issueTypeOptions="issueTypeOptions" :issueLevelOptions="issueLevelOptions" :issueSourceOptions="issueSourceOptions" :issueStatusOptions="issueStatusOptions" :sysFaultTypeOptions="sysFaultTypeOptions" :deviceTypeOptions="deviceTypeOptions" :isEnableCode="isEnableCode" />

    </div>
</template>

<script>
import IssueSubmitDialog from "@/views/components/IssueSubmitDialog";
import { getDicts } from "@/api/system/dict/data";
import { getIsEnableCode } from "@/api/utils";
import { treeselectInput } from "@/api/system/dept";
import {
    submitNewIssueOrder,
    getIssueOrderByPage,
    deleteIssueOrder,
} from "@/api/issue/issue";
import stationCheckbox from "@/views/components/stationCheckbox";
import {
    getIssueDetailsListById,
    getIssueOrderById,
    getLossKwhByIssueId,
} from "@/api/issue/issue";

export default {
    name: "index",
    components: { IssueSubmitDialog, stationCheckbox },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //总数
            total: 0,
            //多选框选中id集合
            ids: [],
            // 非多个禁用
            multiple: true,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                issueStatus: "1", //只查询新建订单
                deviceType: undefined,
                deviceName: undefined,
                status: undefined,
                stationIds: [],
            },
            query: {},
            // 工单列表数据
            issueList: [],
            //工单类型选项
            issueTypeOptions: [],
            //工单级别选项
            issueLevelOptions: [],
            //工单来源选项
            issueSourceOptions: [],
            //工单状态选项
            issueStatusOptions: [],
            //设备类型选项
            deviceTypeOptions: [],
            //损失类型选项
            sysFaultTypeOptions: [],
            //是否启用了编码
            isEnableCode: false,
            // 搜索校验规则
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
        this.query = Object.assign({}, this.queryParams);
        this.getOptionData();
        this.$nextTick(() => {
            this.handleQuery();
        });
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

            //获取工单级别字典数据
            getDicts("sys_workorder_level").then((res) => {
                this.issueLevelOptions = res.data;
            });
            getDicts("sys_workorder_source").then((res) => {
                this.issueSourceOptions = res.data;
            });
            getDicts("sys_workorder_status").then((res) => {
                this.issueStatusOptions = res.data;
            });
            getDicts("sys_fault_type").then((res) => {
                this.sysFaultTypeOptions = res.data;
            });
        },
        /**
         * 获取工单列表
         */
        getList() {
            this.loading = true;
            getIssueOrderByPage(this.query).then((res) => {
                this.issueList = res.rows;
                //循环拼接设备名称
                this.issueList.forEach((item) => {
                    if (item.deviceCustomName != null) {
                        if (item.deviceName) {
                            item.deviceName =
                                item.deviceName + "|" + item.deviceCustomName;
                        } else {
                            item.deviceName = item.deviceCustomName;
                        }
                    }
                });

                this.total = res.total;
                this.loading = false;
            });
        },
        /**
         * 点击查询按钮操作
         */
        handleQuery() {
            this.query = Object.assign({}, this.queryParams);
            //校验开始和结束时间
            if (
                this.queryParams.startTime !== undefined &&
                this.queryParams.endTime !== undefined
            ) {
                if (this.queryParams.endTime < this.queryParams.startTime) {
                    this.msgError("结束时间小于开始时间");
                    return;
                }
            }
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
        /**
         * 点击重置按钮操作
         */
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 15,
                issueStatus: "1", //只查询新建订单
                deviceType: undefined,
                deviceName: undefined,
                status: undefined,
            };
            this.getList();
        },
        /**
         * 点击新增按钮操作
         */
        handleAdd() {
            this.$refs.IssueSubmitDialog.addIssue("提报工单");
        },
        /**
         *
         */
        handleDelete(row) {
            const issueIds = row.id || this.ids;
            this.$confirm("是否确认删除这些工单数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return deleteIssueOrder(issueIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
        /**
         * 点击提交按钮操作
         */
        submit(row) {
            const issueIds = row.id || this.ids;
            this.$confirm("是否提交工单数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return submitNewIssueOrder(issueIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("提交成功");
                });
        },
        /**
         * 点击编辑按钮操作
         */
        handleUpdate(row) {
            getIssueOrderById(row.id).then((res) => {
                this.$refs.IssueSubmitDialog.modifyIssue(
                    "提报工单",
                    res.IssueOrder
                );
            });
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.multiple = !selection.length;
        },
    },
    watch: {},
};
</script>

<style scoped>
</style>
