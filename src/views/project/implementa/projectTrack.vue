<template>
    <div class="app-container">
        <!-- 计划table -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini"
                           v-hasPermi="['assets:tools:outHouse:add']" v-if="projectStatus==2" @click="funAddTask">制定计划
                </el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <el-table v-loading="taskLoading" :data="taskList" @current-change="taskTableRowClick"
                  :row-class-name="tableRowClassName" :row-style="rowClass">
            <el-table-column type="index" width="55" prop="prop" label="序号"/>
            <el-table-column align="center" label="任务" prop="taskName" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="计划开始时间" prop="startDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="计划结束时间" prop="endDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="负责人" prop="taskDutyUser" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                               v-hasPermi="['assets:tools:outHouse:confirm']" v-if="projectStatus==2"
                               @click="funAddLog(scope.row)">填写日志
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:tools:outHouse:edit']"
                               v-if="projectStatus==2" @click="funEditTask(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete"
                               v-hasPermi="['assets:tools:outHouse:remove']" v-if="projectStatus==2"
                               @click="funDeleteTask(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 计划table -->
        <!-- 分页 -->
        <pagination v-show="taskTotal > 0" :total="taskTotal" :page.sync="taskQueryParams.currentPage"
                    :limit.sync="taskQueryParams.size" @pagination="getList"/>
        <!-- 分页 -->


        <!-- 日志按钮.... -->
        <!--        <el-row :gutter="10" class="mb8">-->
        <!--            <el-col :span="1.5">-->
        <!--                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['assets:tools:outHouse:add']" @click="handleAdd">新增</el-button>-->
        <!--            </el-col>-->
        <!--        </el-row>-->
        <!-- 日志table -->
        <el-table style="margin-top: 40px" v-loading="taskLogLoading" :data="taskLogList">
            <el-table-column type="index" width="55" prop="prop" label="序号"/>
            <el-table-column align="center" label="跟踪时间" prop="trackTime" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="完成情况" prop="completeStatus" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.completeStatus == 1 ? '已完成' : '未完成' }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="执行人" prop="executeUser" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="监督人" prop="superviseUser" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="工作内容" prop="workContent" :show-overflow-tooltip="true"/>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:tools:outHouse:edit']"
                               v-if="projectStatus==2" @click="funEditLog(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:tools:outHouse:edit']"
                               @click="funWatchLog(scope.row)">查看
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete"
                               v-hasPermi="['assets:tools:outHouse:remove']" v-if="projectStatus==2"
                               @click="funDeleteLog(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 计划弹出框 -->
        <el-dialog :visible.sync="taskDialogView" width="600px" :before-close="funTaskDialogClose"
                   :close-on-click-modal="false">
            <el-form ref="taskForm" :model="taskForm" label-width="120px" :rules="taskRules">
                <el-row>
                    <el-form-item label="计划名称" prop="taskName">
                        <el-input style="width:100%" v-model="taskForm.taskName" placeholder="请输入计划名称" maxlength="50"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="计划开始时间" prop="startDate">
                        <el-date-picker style="width:100%" v-model="taskForm.startDate" type="date" placeholder="选择日期"
                                        value-format="yyyy-MM-dd HH:mm:ss"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="计划结束时间" prop="endDate">
                        <el-date-picker style="width:100%" v-model="taskForm.endDate" type="date" placeholder="选择日期"
                                        value-format="yyyy-MM-dd HH:mm:ss"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="负责人" prop="taskDutyUser">
                        <el-input style="width:100%" v-model="taskForm.taskDutyUser" placeholder="请输入负责人" maxlength="50"/>
                    </el-form-item>
                </el-row>
                 
            </el-form>
              <div slot="footer"   >
                        <el-button type="primary" @click="funTaskSubmit">提 交</el-button>
                        <el-button @click="funTaskDialogClose">关 闭</el-button>
                    </div>
        </el-dialog>
        <!-- 计划弹出框 -->

        <!-- 日志弹出框 -->
        <el-dialog :visible.sync="logDialogView" width="600px" :before-close="funLogDialogClose"
                   :close-on-click-modal="false">
            <el-form ref="logForm" :model="logForm" label-width="80px" :rules="logRules">
                <el-row>
                    <el-form-item label="跟踪时间" prop="trackTime">
                        <el-date-picker style="width:100%" v-model="logForm.trackTime" type="date" placeholder="选择日期"
                                        value-format="yyyy-MM-dd HH:mm:ss" :disabled="logDialogViewType==3?true:false"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="完成情况" prop="completeStatus">
                        <el-select style="width:100%" v-model="logForm.completeStatus" placeholder="请选择完成情况"
                                   :disabled="logDialogViewType==3?true:false">
                            <el-option label="已完成" value="1"/>
                            <el-option label="未完成" value="2"/>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="执行人" prop="executeUser">
                        <el-input style="width:100%" v-model="logForm.executeUser" placeholder="请输入执行人" maxlength="20"
                                  :disabled="logDialogViewType==3?true:false"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="监督人" prop="superviseUser">
                        <el-input style="width:100%" v-model="logForm.superviseUser" placeholder="请输入监督人" maxlength="20"
                                  :disabled="logDialogViewType==3?true:false"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="工作内容" prop="workContent">
                        <el-input
                            v-model="logForm.workContent"
                            type="textarea"
                            placeholder="请输入内容"
                            maxlength="500"
                            :rows="7"
                            :disabled="logDialogViewType==3?true:false"
                        />
                    </el-form-item>
                </el-row>
               

            </el-form>
             <div slot="footer">
                        <el-button type="primary" @click="funLogSubmit" v-if="logDialogViewType!=3?true:false">提 交
                        </el-button>
                        <el-button @click="funLogDialogClose">关 闭</el-button>
                    </div>
        </el-dialog>
        <!-- 日志弹出框 -->
    </div>
</template>

<script>

import {
    getTaskListByProjectId,
    addTask,
    getTaskByTaskId,
    modifyTask,
    deleteTask,
    getLogByLogId,
    getLogsByTaskId,
    addLog,
    modifyLog,
    deleteLog
} from "@/api/project/implementa/index.js";

export default {
    name: "projectTrack",
    data() {
        return {
            // 遮罩层
            taskLoading: false,
            taskLogLoading: false,
            selectedIndex: 0,
            // 项目id
            projectId: undefined,
            // 项目状态
            projectStatus: undefined,
            // 查询参数
            taskQueryParams: {
                pageNum: 1,
                pageSize: 15,
            },
            // 计划列表总条数
            taskTotal: 0,
            // 计划列表
            taskList: [],
            // 日志列表
            taskLogList: [],

            // 是否显示 计划弹出层
            taskDialogView: false,
            // 计划弹出层 类型 1：新建，2：编辑
            taskDialogViewType: 1,
            // 计划表单参数
            taskForm: {},
            // 计划表单校验规则
            taskRules: {
                taskName: [{required: true, message: '计划名称不能为空', trigger: 'blur'}],
                startDate: [{required: true, message: '计划开始时间不能为空', trigger: 'blur'}],
                endDate: [{required: true, message: '计划结束时间不能为空', trigger: 'blur'}],
                taskDutyUser: [{required: true, message: '负责人不能为空', trigger: 'blur'}],
            },

            /** 日志弹出层 **/
            // 是否显示
            logDialogView: false,
            // 弹出层类型 1：新建，2：编辑
            logDialogViewType: 1,
            // 日志表单参数
            logForm: {},
            // 日志表单校验规则
            logRules: {
                trackTime: [{required: true, message: '跟踪时间不能为空', trigger: 'blur'}],
                completeStatus: [{required: true, message: '完成情况不能为空', trigger: 'blur'}],
                // executeUser: [{required: true, message: '执行人不能为空', trigger: 'blur'}],
                // superviseUser: [{required: true, message: '监督人不能为空', trigger: 'blur'}],
                // workContent: [{required: true, message: '工作内容不能为空', trigger: 'blur'}],
            },
        };
    },
    created() {
        this.projectId = this.$route.query.projectId;
        this.projectStatus = this.$route.query.projectStatus;
        this.getList();
    },
    methods: {
        /** list */
        getList() {
            this.loading = true;
            // 根据项目id获取计划列表
            getTaskListByProjectId(this.projectId).then(res => {
                if (res.taskList != null) {
                    this.taskList = res.taskList.rows;
                    this.taskTotal = res.taskList.total;
                }
                if (res.logsList != null) {
                    this.taskLogList = res.logsList;
                }
            });
        },

        // 获取日志列表
        getLogList(taskId) {
            getLogsByTaskId(taskId).then(res => {
                if (res.code == 200) {
                    this.taskLogList = res.data;
                }
            });
        },

        // 计划列表行点击事件
        taskTableRowClick(row) {
            if (row != null) {
                this.selectedIndex = row.index;
                this.getLogList(row.taskId);
            }

        },
        rowClass({row, rowIndex}) {
            if (this.selectedIndex === rowIndex) {
                return {
                    border: "solid 1px #3dffef",
                    "background-color": "rgba(185, 221, 249, 0.75)",
                };
            }
        },
        tableRowClassName({row, rowIndex}) {
            row.index = rowIndex;
        },

        /**制定计划 */
        funAddTask() {
            this.taskDialogView = true;
            this.taskDialogViewType = 1;
        },
        // 计划编辑
        funEditTask(row) {
            this.taskDialogView = true;
            this.taskDialogViewType = 2;
            getTaskByTaskId(row.taskId).then(res => {
                this.taskForm = res.data;
            });
        },
        // 计划弹窗关闭
        funTaskDialogClose() {
            this.getList();
            this.taskDialogView = false;
            this.taskDialogViewType = 1;
            this.taskForm = {};

        },
        // 计划提交
        funTaskSubmit() {
            this.$refs["taskForm"].validate(valid => {
                if (valid) {
                    this.taskForm.projectId = this.projectId;
                    if (this.taskDialogViewType == 1) {
                        //  新增
                        addTask(this.taskForm).then(res => {
                            if (res.code == 200) {
                                this.msgSuccess("提交成功");
                                this.funTaskDialogClose();
                            } else {
                                this.msgWarn(res.msg);
                                return;
                            }
                        });
                    }
                    if (this.taskDialogViewType == 2) {
                        // 编辑
                        modifyTask(this.taskForm).then(res => {
                            if (res.code == 200) {
                                this.msgSuccess("提交成功");
                                this.funTaskDialogClose();
                            } else {
                                this.msgWarn(res.msg);
                                return;
                            }
                        });
                    }
                }
            });
        },
        // 计划删除
        funDeleteTask(row) {
            const taskId = row.taskId;
            this.$confirm('是否确认删除名称为"' + row.taskName + '"的计划?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteTask(taskId);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },

        /** 日志 **/
        // 填写日志
        funAddLog(row) {
            this.logDialogView = true;
            this.logDialogViewType = 1;
            this.logForm.taskId = row.taskId;
        },
        // 编辑
        funEditLog(row) {
            this.logDialogView = true;
            this.logDialogViewType = 2;
            this.logForm.logId = row.logId;
            getLogByLogId(row.logId).then(res => {
                this.logForm = res.data;
            });
        },
        // 查看
        funWatchLog(row) {
            this.logDialogView = true;
            this.logDialogViewType = 3;
            this.logForm.logId = row.logId;
            getLogByLogId(row.logId).then(res => {
                this.logForm = res.data;
            });
        },
        // 关闭
        funLogDialogClose() {
            this.logDialogView = false;
            this.logDialogViewType = 1;
            this.getLogList(this.logForm.taskId);
            this.logForm = {};
        },
        funLogSubmit() {
            this.$refs["logForm"].validate(valid => {
                if (valid) {
                    if (this.logDialogViewType == 1) {
                        this.logForm.maintainProjectId = this.projectId;
                        //  新增
                        addLog(this.logForm).then(res => {
                            if (res.code == 200) {
                                this.msgSuccess("提交成功");
                                this.funLogDialogClose();
                            } else {
                                this.msgWarn(res.msg);
                                return;
                            }
                        });
                    }
                    if (this.logDialogViewType == 2) {
                        // 编辑
                        modifyLog(this.logForm).then(res => {
                            if (res.code == 200) {
                                this.msgSuccess("提交成功");
                                this.funLogDialogClose();
                            } else {
                                this.msgWarn(res.msg);
                                return;
                            }
                        });
                    }
                }
            });
        },
        // 删除
        funDeleteLog(row) {
            const taskId = row.logId;
            this.$confirm('是否确认删除该日志?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteLog(taskId);
            }).then(() => {
                this.getLogList(taskId);
                this.msgSuccess("删除成功");
            })
        },


    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}

.el-table ::v-deep tbody tr:hover > td {
    background-color: transparent;
}
</style>
