<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="参数类型" prop="paramType">
                <el-select clearable v-model="queryParams.paramType" style="width:100%" placeholder="请选择参数类型">
                    <el-option v-for="dict in dict.type.sys_deviceparams_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="参数编号" prop="paramNo">
                <el-input v-model="queryParams.paramNo" placeholder="请输入参数编号" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="参数名称" prop="paramName">
                <el-input v-model="queryParams.paramName" placeholder="请输入参数名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="参数地址" prop="paramAddress">
                <el-input v-model="queryParams.paramAddress" placeholder="请输入参数地址" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['station:deviceParams:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['station:deviceParams:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['station:deviceParams:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['station:deviceParams:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="deviceParamsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="设备名称" align="center" prop="deviceName" />
            <el-table-column label="参数类型" align="center" prop="paramType">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_deviceParams_type" :value="scope.row.paramType" />
                </template>
            </el-table-column>
            <el-table-column label="参数编号" align="center" prop="paramNo" />
            <el-table-column label="参数名称" align="center" prop="paramName" />
            <el-table-column label="参数地址" align="center" prop="paramAddress" />
             <el-table-column label="参数状态" align="center" prop="paramStatus">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_param_status" :value="scope.row.paramStatus" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['station:deviceParams:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['station:deviceParams:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改电站设备参数对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="设备名称" prop="deviceName">
                    <el-select v-model="form.deviceId" style="width:100%" placeholder="请选择设备名称">
                        <el-option v-for="item of stationDeviceList" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数类型" prop="paramType">
                    <el-select clearable v-model="form.paramType" style="width:100%" placeholder="请选择参数类型">
                        <el-option v-for="dict in dict.type.sys_deviceParams_type" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数编号" prop="paramNo">
                    <el-input v-model="form.paramNo" placeholder="请输入参数编号" />
                </el-form-item>
                <el-form-item label="参数名称" prop="paramName">
                    <el-input v-model="form.paramName" placeholder="请输入参数名称" />
                </el-form-item>
                <el-form-item label="参数地址" prop="paramAddress">
                    <el-input v-model="form.paramAddress" placeholder="请输入参数地址" />
                </el-form-item>
                <el-form-item label="参数状态" prop="paramStatus">
                    <el-radio-group v-model="form.paramStatus">
                        <el-radio
                            v-for="dict in dict.type.sys_param_status"
                            :key="dict.value"
                            :label="dict.value"
                        >{{dict.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listDeviceParams,
    getDeviceParams,
    delDeviceParams,
    addDeviceParams,
    updateDeviceParams,
} from "@/api/station/deviceParams";
import { listNoPageDevice } from "@/api/station/device";

export default {
    name: "DeviceParams",
    dicts: ["sys_deviceParams_type","sys_param_status"],
    data() {
        return {
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
            // 总条数
            total: 0,
            // 电站设备参数表格数据
            deviceParamsList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                id: null,
                stationId: null,
                deviceName: null,
                deviceId: null,
                paramType: null,
                paramNo: null,
                paramName: null,
                paramAddress: null,
                delFlag: null,
                createTime: null,
                createBy: null,
                updateTime: null,
                updateBy: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            //电站设备列表
            stationDeviceList: [],
        };
    },
    created() {
        listNoPageDevice({
            ...this.queryParams,
            stationId: this.$route.query.stationId,
        }).then((response) => {
            this.stationDeviceList = response.data;
        });
        this.getList();
    },
    methods: {
        /** 查询电站设备参数列表 */
        getList() {
            this.loading = true;
            listDeviceParams({
                ...this.queryParams,
                stationId: this.$route.query.stationId,
            }).then((response) => {
                this.deviceParamsList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                stationId: null,
                deviceName: null,
                deviceId: null,
                paramType: null,
                paramNo: null,
                paramName: null,
                paramAddress: null,
                delFlag: null,
                createTime: null,
                createBy: null,
                updateTime: null,
                updateBy: null,
            };
            this.resetForm("form");
            this.form.stationId = this.$route.query.stationId;
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加电站设备参数";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getDeviceParams(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = "修改电站设备参数";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateDeviceParams(this.form).then((response) => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDeviceParams(this.form).then((response) => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(
                    '是否确认删除电站设备参数编号为"' + ids + '"的数据项？'
                )
                .then(function () {
                    return delDeviceParams(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "station/deviceParams/export",
                {
                    ...this.queryParams,
                },
                `deviceParams_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
