<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" :rules="searchRules" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
            <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="queryParams.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" :clearable="false" size="small"
                                style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small"
                                style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->

        <!-- table -->
        <el-table v-loading="loading" :data="contractProjectList">
            <el-table-column label="合同编号" prop="contractCode" :show-overflow-tooltip="true"/>
            <el-table-column label="合同开始时间" prop="projectStartDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.contractBeginDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="合同结束时间" prop="projectEndDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.contractEndDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目负责人" prop="projectUser" :show-overflow-tooltip="true"/>
            <el-table-column label="要求清洗次数" prop="askCleanNumber" :show-overflow-tooltip="true"/>
            <el-table-column label="实际清洗次数" prop="realCleanNumber" :show-overflow-tooltip="true"/>
            <el-table-column label="要求除草次数" prop="askWeedNumber" :show-overflow-tooltip="true"/>
            <el-table-column label="实际除草次数" prop="realWeedNumber" :show-overflow-tooltip="true"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete"
                               v-hasPermi="['project:projectContract:manage']" @click="handleManage(scope.row)">项目管理
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['project:projectContract:edit']"
                               @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-search"
                               v-hasPermi="['project:projectContract:search']" @click="handleView(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize"
                    @pagination="getList"/>
        <!-- 分页 -->

        <el-dialog :close-on-press-escape="false" :show-close="false" :title="dialogViewType==1?'编辑':'查看'"
                   :visible.sync="dialogView" width="400" :before-close="dialogBeforeClose"
                   :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-row>
                    <el-col>
                        <el-form-item label-width="150px" label="合同编号" prop="contractCode">
                            <el-input style="width:100%" v-model="form.contractCode" :disabled="true" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label-width="150px" label="项目负责人" prop="projectUser">
                            <el-input style="width:100%" v-model="form.projectUser" placeholder="请输入项目负责人"
                                      maxlength="50" :disabled="dialogViewType==2?true:false"   />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label-width="150px" label="要求清洗次数" prop="askCleanNumber">
                            <el-input type="number" style="width:100%" v-model="form.askCleanNumber" placeholder="请输入要求清洗次数"
                                      maxlength="50" :disabled="dialogViewType==2?true:false" oninput="if(value.length > 8) value=value.slice(0, 8)" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item  label-width="150px" label="要求除草次数" prop="askWeedNumber">
                            <el-input type="number" style="width:100%" v-model="form.askWeedNumber" placeholder="请输要求除草次数"
                                      maxlength="50" :disabled="dialogViewType==2?true:false"  oninput="if(value.length > 8) value=value.slice(0, 8)"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmitForm" v-if="dialogViewType==1">保 存</el-button>
                <el-button @click="funDialogClose" v-if="dialogViewType==1">取 消</el-button>
                <el-button @click="funDialogClose" v-if="dialogViewType==2">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

// 引用
import topSearch from "@/views/components/TopSearch";
import {
    getContractProjectList, getContractProjectById, saveContractProject
} from "@/api/project/contractProject/index";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "contractProject",
    components: {
        topSearch,
        stationCheckbox,
    },
    data() {
        let self = this;
        return {
            // 结束时间不能选择开始时间前的日期
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(self.moment(self.queryParams.startTime), "day") < 0
                    );
                },
            },

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                stationIdList: [],
                startTime: undefined,
                endTime: undefined,
            },
            query: {},

            // 表单参数
            form: {},
            // 搜索 时间选择框
            timeRange: [],
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,

            // 弹出层标题
            dialogTitle: "",
            // 是否显示弹出层
            dialogView: false,
            // 弹出层类型 1:编辑, 2:查看
            dialogViewType: 2,
            // 表格数据
            contractProjectList: [],

            // 表单校验
            rules: {
                projectUser: [{required: true, message: '项目负责人不能为空', trigger: 'blur'}],
                askCleanNumber: [{required: true, message: '要求清洗次数不能为空', trigger: 'blur'}],
                askWeedNumber: [{required: true, message: '要求除草次数不能为空', trigger: 'blur'}],
            },
            // 搜索表单校验
            searchRules:{
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
            }

        };
    },
    created() {
        this.queryParams.stationIdList = [this.$store.getters.currentStation];
        this.$nextTick(() => {
            this.handleQuery();
        })
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        /** 表格数据查询 */
        getList() {
            this.loading = true;
            getContractProjectList(this.query).then(respons => {
                this.contractProjectList = respons.data.rows;
                this.total = respons.data.total;
                this.loading = false;
            });
        },

        /** 搜索框 查询按钮 **/
        handleQuery() {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.query = Object.assign({}, this.queryParams)
                    this.getList();
                }
            });
        },

        /** 搜索框 重置按钮 **/
        resetQuery() {
            this.queryParams.startTime = undefined;
            this.queryParams.endTime = undefined;
            this.timeRange = [];
            this.handleQuery();
        },

        /** 编辑按钮操作 */
        handleEdit(row) {
            this.dialogView = true;
            this.dialogViewType = 1;
            // 根据项目id获取项目信息
            getContractProjectById(row.id).then(res => {
                this.form = res.data;
            });

        },

        /** 查看按钮操作 */
        handleView(row) {
            this.dialogView = true;
            this.dialogViewType = 2;
            // 根据项目id获取项目信息
            getContractProjectById(row.id).then(res => {
                this.form = res.data;
            });
        },

        /** 关闭弹出页面前操作 */
        dialogBeforeClose() {
            this.dialogView = false;
            this.form = {};
            this.$refs['form'].clearValidate();
        },

        /** 保存按钮 */
        handleSubmitForm() {
            var self = this;
            // 对表单数据进行校验
            self.$refs["form"].validate(valid => {
                if (valid) {
                    // 表单校验成功
                    // 编辑
                    saveContractProject(this.form).then(res => {
                        if (res.code == 200) {
                            this.msgSuccess("保存成功");
                            this.funDialogClose();
                            this.getList();
                            this.dialogViewType = 2;
                        } else {
                            this.msgWarn(ref.msg);
                        }
                    });
                }
            });
        },

        // 弹出页面取消按钮
        funDialogClose() {
            this.dialogView = false;
            this.form = {};
            this.$refs['form'].clearValidate();
        },

        /** 项目管理按钮操作 */
        handleManage(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + '/project/projectApproval/index',
                query: {id: row.id}
            });
        }

    }
};
</script>

<style lang="scss" scoped>

.el-table ::v-deep tbody tr:hover > td {
    background-color: transparent;
}
</style>
