<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px" :rules="rulesForm">
            <el-form-item label="所属电站" prop="stationIds">
                <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="queryParams.projectName" placeholder="请输入项目名称" clearable size="small" style="width: 200px" maxlength="50" />
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
                <el-select v-model="queryParams.projectType" placeholder="项目类型" clearable size="small" style="width: 200px">
                    <el-option label="全部" value="" />
                    <el-option v-for="dict in projectTypeList" :key="dict.id" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->

        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['project:projectApproval:add']" @click="handleAdd">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-check" size="mini" :disabled="multiple" v-hasPermi="['project:projectApproval:submit']" @click="handleProjectCheck">立项通过
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->

        <!-- table -->
        <el-table v-loading="loading" :data="projectList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="项目编号" prop="projectCode" :show-overflow-tooltip="true" />
            <el-table-column label="项目名称" prop="projectName" :show-overflow-tooltip="true" />
            <el-table-column label="项目类型" prop="projectType" :show-overflow-tooltip="true" :formatter="typeFormat" />
            <el-table-column label="计划开始时间" prop="projectStartDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.projectStartDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="计划结束时间" prop="projectEndDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.projectEndDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目负责人" prop="dutyUserName" :show-overflow-tooltip="true" />
            <el-table-column label="状态" prop="projectStatus" :show-overflow-tooltip="true" :formatter="statusFormat" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['project:projectApproval:edit']" @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-search" v-hasPermi="['project:projectApproval:search']" @click="handleView(scope.row)">查看
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['project:projectApproval:remove']" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        <!-- 分页 -->

        <el-dialog :close-on-press-escape="false" :show-close="false" :title="dialogViewType==1?'新增项目':(dialogViewType==2?'编辑项目':'查看项目')" :visible.sync="dialogView" width="900" :before-close="dialogBeforeClose" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-col :span="12">
                            <el-form-item label-width="120px" label="项目类型" prop="projectType">
                                <el-select style="width:100%" v-model="form.projectType" placeholder="请选择项目类型" @change="projectTypecChange(form.projectType)" :disabled="(dialogViewType==3||dialogViewType==2)?true:false">
                                    <el-option v-for="dict in projectTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label-width="120px" label="项目名称" prop="projectName">
                                <el-input style="width:100%" v-model="form.projectName" placeholder="请输入项目名称" maxlength="50" :disabled="dialogViewType==3?true:false" />
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="项目编号" prop="projectCode">
                            <el-input style="width:100%" v-model="form.projectCode" placeholder="请输入项目编号" maxlength="50" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="验收方式" prop="checkType">
                            <el-select style="width:100%" v-model="form.checkType" placeholder="请选择验收方式" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="dict in checkTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label-width="120px" label="项目负责人" prop="dutyUser">
                            <el-select style="width:100%" v-model="form.dutyUser" placeholder="请选择项目负责人" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="user in dutyUserList" :key="user.userId" :label="user.nickName" :value="user.userId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>

                <!--                <el-row>-->
                <!--                    <el-col :span="12">-->
                <!--                        <el-form-item label-width="120px"  label="监督人" prop="superviseUser">-->
                <!--                            <el-input style="width:100%" v-model="form.superviseUser" placeholder="请输入监督人" maxlength="50"-->
                <!--                                      :disabled="dialogViewType==3?true:false"/>-->
                <!--                        </el-form-item>-->
                <!--                    </el-col>-->
                <!--                </el-row>-->

                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="开始时间" prop="projectStartDate">
                            <el-date-picker style="width:100%" v-model="form.projectStartDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="dialogViewType==3?true:false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="结束时间" prop="projectEndDate">
                            <el-date-picker style="width:100%" v-model="form.projectEndDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="dialogViewType==3?true:false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="实施厂家" prop="supId">
                            <el-select style="width:100%" v-model="form.supId" placeholder="请选择实施厂家" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="sup in supIdList" :key="sup.supId" :label="sup.supName" :value="sup.supId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row v-if="dialogViewProjectType==1">
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="光伏组件类型" prop="moduleType">
                            <el-select style="width:100%" v-model="form.moduleType" placeholder="请选择光伏组件类型" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="dict in moduleTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="光伏组件位置" prop="moduleLocation">
                            <el-input style="width:100%" v-model="form.moduleLocation" placeholder="请输入光伏组件位置" maxlength="50" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row v-if="dialogViewProjectType==1">
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="清洗容量" prop="cleanCapacity">
                            <el-input style="width:100%" v-model="form.cleanCapacity" placeholder="请输入清洗容量" maxlength="50" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="清洗方式" prop="cleanType">
                            <el-select style="width:100%" v-model="form.cleanType" placeholder="请选择清洗方式" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="dict in cleanTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="dialogViewProjectType==2">
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="除草区域" prop="cleanArea">
                            <el-input style="width:100%" v-model="form.cleanArea" placeholder="请输入除草区域" maxlength="50" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="除草面积" prop="weedArea">
                            <el-input style="width:100%" v-model="form.weedArea" placeholder="请输入除草面积" maxlength="50" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="dialogViewProjectType==2">
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="使用方式" prop="useType">
                            <el-select style="width:100%" v-model="form.useType" placeholder="请选择使用方式" :disabled="dialogViewType==3?true:false">
                                <el-option v-for="dict in useTypeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label-width="120px" label="上传方案" prop="planImgurl">
                            <el-upload list-type="picture-card" ref="planImgurl" :limit="1" accept="image/jpeg,image/jpg,image/png" :headers="planImg.headers" :disabled="dialogViewType==3?true:(planImg.isUploading)" :action="planImg.url" :on-progress="handleFileProgressPlanImgurl" :on-success="handleFileSuccessPlanImgurl" :on-error="handleFileErrorPlanImgurl" :on-remove="handleRemovePlanImgurl" :on-change="handleFileChangePlanImgurl" :auto-upload="false" :file-list="planImg.fileList">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="dialogViewProjectType==1?'清洗前照片':(dialogViewProjectType==2?'除草前照片':'实施前照片')" label-width="120px" prop="beforePlanImgurl">
                            <el-upload list-type="picture-card" ref="beforePlanImgurl" :limit="1" accept="image/jpeg,image/jpg,image/png" :headers="beforePlanImg.headers" :disabled="dialogViewType==3?true:(beforePlanImg.isUploading)" :action="beforePlanImg.url" :on-success="handleFileSuccessBeforeImgurl" :on-error="handleFileErrorBeforeImgurl" :on-remove="handleRemoveBeforeImgurl" :on-change="handleFileChangeBeforeImgurl" :auto-upload="false" :file-list="beforePlanImg.fileList">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="120px" :label="dialogViewProjectType==1?'清洗原因':(dialogViewProjectType==2?'除草原因':'实施原因')" prop="projectReason">
                            <el-input v-model="form.projectReason" type="textarea" placeholder="请输入内容" maxlength="500" :rows="7" :disabled="dialogViewType==3?true:false" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmitForm" v-if="dialogViewType==1||dialogViewType==2">保 存
                </el-button>
                <el-button @click="funDialogClose" v-if="dialogViewType==1||dialogViewType==2">取 消</el-button>
                <el-button @click="funDialogClose" v-if="dialogViewType==3">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// 引用
import topSearch from "@/views/components/TopSearch";
import { getDicts } from "@/api/system/dict/data";
import stationCheckbox from "@/views/components/stationCheckbox";

import {
    getProjectList,
    getUserListByStationId,
    getSupList,
    addProject,
    projectCheckSuccess,
    getProjectByProjectId,
    modifyProject,
    delProject,
} from "@/api/project/projectApproval/approval";
import { getToken } from "@/utils/auth";

export default {
    name: "project",
    components: {
        topSearch,
        stationCheckbox,
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
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                projectName: undefined,
                projectType: undefined,
                projectStatus: 1,
                startTime: undefined,
                endTime: undefined,
                contractProjectId: undefined,
                stationIds: [],
            },
            contractProjectId: undefined,
            query: {},
            // 多选框 选中数组
            ids: [],
            projectNames: [],
            // 多选框 非单个禁用
            single: true,
            // 多选框 非多个禁用
            multiple: true,
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
            title: "",
            // 是否显示弹出层
            dialogView: false,
            // 弹出层类型 1:新增, 2:编辑, 3:查看
            dialogViewType: 1,
            /** 弹出层 项目类型 */
            dialogViewProjectType: 0,
            // 项目类型列表
            projectTypeList: [],
            // 项目状态列表
            projectStatusList: [],
            // 使用方式列表
            useTypeList: [],
            // 清洗方式列表
            cleanTypeList: [],
            // 验收方式列表
            checkTypeList: [],
            // 项目负责人列表
            dutyUserList: [],
            // 实施厂家列表
            supIdList: [],
            // 表格数据
            projectList: [],

            // 表单校验
            rules: {
                projectType: [
                    {
                        required: true,
                        message: "项目类型不能为空",
                        trigger: "blur",
                    },
                ],
                projectName: [
                    {
                        required: true,
                        message: "项目名称不能为空",
                        trigger: "blur",
                    },
                ],
                dutyUser: [
                    {
                        required: true,
                        message: "项目负责人不能为空",
                        trigger: "blur",
                    },
                ],
                // superviseUser: [{required: true, message: '监督人不能为空', trigger: 'blur'}],
                supId: [
                    {
                        required: true,
                        message: "实施厂家不能为空",
                        trigger: "blur",
                    },
                ],
                moduleType: [
                    {
                        required: true,
                        message: "光伏组件类型不能为空",
                        trigger: "blur",
                    },
                ],
                cleanType: [
                    {
                        required: true,
                        message: "清洗方式不能为空",
                        trigger: "blur",
                    },
                ],
                cleanCapacity: [
                    {
                        required: true,
                        message: "清洗容量不能为空",
                        trigger: "blur",
                    },
                ],
                moduleLocation: [
                    {
                        required: true,
                        message: "光伏组件位置不能为空",
                        trigger: "blur",
                    },
                ],
                cleanArea: [
                    {
                        required: true,
                        message: "除草区域不能为空",
                        trigger: "blur",
                    },
                ],
                weedArea: [
                    {
                        required: true,
                        message: "除草面积不能为空",
                        trigger: "blur",
                    },
                ],
                useType: [
                    {
                        required: true,
                        message: "使用方式不能为空",
                        trigger: "blur",
                    },
                ],
                projectStartDate: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                projectEndDate: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                checkType: [
                    {
                        required: true,
                        message: "验收方式不能为空",
                        trigger: "blur",
                    },
                ],
                projectReason: [
                    {
                        required: true,
                        message: "原因不能为空",
                        trigger: "blur",
                    },
                ],
                // beforePlanImgurl: [{required: true, message: '照片不能为空', trigger: 'blur'}],
            },
            rulesForm: {
                stationIds: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
            },
            // 上传图片参数
            planImg: {
                // 是否禁用上传
                isUploading: false,
                // 是否更改
                isChange: false,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                    station: this.$store.getters.currentStation,
                    system: this.$store.getters.currentSystem,
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/upload",
                // 文件列表
                fileList: [],
            },
            // 是否上传成功
            planImgUploadSuccess: false,

            beforePlanImg: {
                // 是否禁用上传
                isUploading: false,
                // 是否更改
                isChange: false,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                    station: this.$store.getters.currentStation,
                    system: this.$store.getters.currentSystem,
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/upload",
                // 文件列表
                fileList: [],
            },
            // 是否上传成功
            beforePlanImgUploadSuccess: false,
        };
    },
    created(row) {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
        this.contractProjectId = this.$route.query.id;
        this.queryParams.contractProjectId = this.contractProjectId;
        this.$nextTick(() => {
            this.handleQuery();
            this.getViewDictList();
        });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        /** 字典状态字典翻译 **/
        // 项目状态
        statusFormat(row) {
            return this.selectDictLabel(
                this.projectStatusList,
                row.projectStatus
            );
        },
        // 项目类型
        typeFormat(row) {
            return this.selectDictLabel(this.projectTypeList, row.projectType);
        },

        /** 表格数据查询 */
        getList() {
            this.loading = true;
            getProjectList(this.query).then((respons) => {
                this.projectList = respons.rows;
                this.total = respons.total;
                this.loading = false;
            });
        },
        // 获取页面字典列表
        getViewDictList() {
            getDicts("sys_project_type").then((response) => {
                this.projectTypeList = response.data;
            });
            getDicts("sys_project_status").then((response) => {
                this.projectStatusList = response.data;
            });
            // 获取清洗方式
            getDicts("sys_wash_type").then((response) => {
                this.cleanTypeList = response.data;
            });
            // 获取验收方式
            getDicts("sys_examine_type").then((response) => {
                this.checkTypeList = response.data;
            });
            // 获取使用方式
            getDicts("sys_weeding_type").then((response) => {
                this.useTypeList = response.data;
            });
            this.moduleTypeList = [
                { dictLabel: "晶硅", dictValue: "晶硅" },
                { dictLabel: "薄膜", dictValue: "薄膜" },
            ];
            // 根据用户选择电站查询当前电站下所有用户
            getUserListByStationId(this.$store.getters.currentStation).then(
                (response) => {
                    this.dutyUserList = response.data;
                }
            );
        },

        /** 搜索框 查询按钮 **/
        handleQuery() {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    this.query = Object.assign({}, this.queryParams);
                    this.getList();
                }
            });
        },

        /** 搜索框 重置按钮 **/
        resetQuery() {
            this.queryParams.projectName = undefined;
            this.queryParams.projectType = undefined;
            this.queryParams.startTime = undefined;
            this.queryParams.endTime = undefined;
            this.timeRange = [];
            this.handleQuery();
        },

        /** 立项通过按钮 */
        handleProjectCheck(row) {
            const projectIds = row.projectId || this.ids;
            const projectNames = row.projectName || this.projectNames;
            this.$confirm(
                '是否确认通过立项"' + projectNames + '"的项目?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return projectCheckSuccess(projectIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("操作成功");
                });
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.dialogView = true;
            this.dialogViewType = 1;
        },

        /** 编辑按钮操作 */
        handleEdit(row) {
            this.dialogView = true;
            this.dialogViewType = 2;
            // 根据用户选择电站查询当前电站下所有用户
            getUserListByStationId(this.$store.getters.currentStation).then(
                (response) => {
                    this.dutyUserList = response.data;
                }
            );
            // 根据项目id获取项目信息
            getProjectByProjectId(row.projectId).then((res) => {
                this.form = res.data;
                this.projectTypecChange(res.data.projectType);
                this.planImg.fileList = [
                    {
                        url: res.data.planImgurlPreView,
                    },
                ];
                this.beforePlanImg.fileList = [
                    {
                        url: res.data.beforePlanImgurlPreView,
                    },
                ];
            });
        },

        /** 查看按钮操作 */
        handleView(row) {
            this.dialogView = true;
            this.dialogViewType = 3;
            // 根据用户选择电站查询当前电站下所有用户
            getUserListByStationId(this.$store.getters.currentStation).then(
                (response) => {
                    this.dutyUserList = response.data;
                }
            );
            // 根据项目id获取项目信息
            getProjectByProjectId(row.projectId).then((res) => {
                this.form = res.data;
                this.projectTypecChange(res.data.projectType);
                this.planImg.fileList = [
                    {
                        url: res.data.planImgurlPreView,
                    },
                ];
                this.beforePlanImg.fileList = [
                    {
                        url: res.data.beforePlanImgurlPreView,
                    },
                ];
            });
        },

        /** 关闭弹出页面前操作 */
        dialogBeforeClose() {
            this.dialogView = false;
            this.form = {};
            this.planImg.fileList = [];
            this.beforePlanImg.fileList = [];
            this.$refs["form"].clearValidate();
        },

        /** 保存按钮 */
        handleSubmitForm() {
            var self = this;
            // console.log('planImgurl.uploadFiles:' + self.$refs.planImgurl.uploadFiles.length)
            // console.log('planImg.fileList:' + self.planImg.fileList.length)
            // console.log('beforePlanImgurl.uploadFiles:' + self.$refs.beforePlanImgurl.uploadFiles.length)
            // 首先判断两个图片是否为空
            //  2021-10-20 上传方案可以为空
            // if (self.$refs.planImgurl.uploadFiles.length == 0) {
            //     self.msgError("请选择图片！");
            //     return;
            // }
            if (self.$refs.beforePlanImgurl.uploadFiles.length == 0) {
                self.msgError("请选择图片！");
                return;
            }
            // 对表单数据进行校验
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    // 表单校验成功
                    if (
                        !this.planImg.isChange &&
                        !this.beforePlanImg.isChange
                    ) {
                        // 两个图片都未被修改，直接提交表单数据
                        this.submitForm();
                    } else {
                        if (self.planImg.isChange) {
                            // 第一个图片被修改,上传
                            self.$refs.planImgurl.submit();
                        } else {
                            // 未被修改
                            self.planImgUploadSuccess = true;
                        }

                        if (self.beforePlanImg.isChange) {
                            // 第二个图片被修改,上传
                            self.$refs.beforePlanImgurl.submit();
                        } else {
                            // 未被修改
                            self.beforePlanImgUploadSuccess = true;
                        }
                    }
                }
            });
        },
        // 提交项目信息
        submitForm() {
            if (this.dialogViewType == 1) {
                this.form.contractProjectId = this.contractProjectId;
                // 新增
                addProject(this.form).then((res) => {
                    if (res.code == 200) {
                        this.msgSuccess("添加成功");
                        this.funDialogClose();
                        this.getList();
                        this.dialogViewType = 0;
                        this.planImgUploadSuccess = false;
                        this.$refs.planImgurl.clearFiles();
                        this.$refs.beforePlanImgurl.clearFiles();
                    } else {
                        this.msgWarn(ref.msg);
                    }
                });
            } else {
                // 编辑
                modifyProject(this.form).then((res) => {
                    if (res.code == 200) {
                        this.msgSuccess("编辑成功");
                        this.funDialogClose();
                        this.getList();
                        this.dialogViewType = 0;
                        this.beforePlanImgUploadSuccess = false;
                        this.$refs.planImgurl.clearFiles();
                        this.$refs.beforePlanImgurl.clearFiles();
                    } else {
                        this.msgWarn(ref.msg);
                    }
                });
            }
        },

        // 弹出页面取消按钮
        funDialogClose() {
            this.dialogView = false;
            this.form = {};
            this.$refs.planImgurl.clearFiles();
            this.$refs.beforePlanImgurl.clearFiles();
            this.$refs["form"].clearValidate();
        },

        /** 删除按钮操作 */
        handleDelete(row) {
            const projectId = row.projectId;
            this.$confirm(
                '是否确认删除项目名称为"' + row.projectName + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return delProject(projectId);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },

        // 第一个图片处理 文件上传中
        handleFileProgressPlanImgurl(event, file, fileList) {
            this.planImg.isUploading = true;
        },
        // 第一个图片处理 文件上传成功
        handleFileSuccessPlanImgurl(response, file, fileList) {
            // console.log('planImgUploadSuccess')
            this.form.planImgurl = response.data.url;
            this.planImg.isUploading = false;

            this.planImgUploadSuccess = true;
        },
        // 第一个图片处理 文件上传失败
        handleFileErrorPlanImgurl(response, file, fileList) {
            this.msgError("图片上传失败");
        },
        // 第一个图片处理 文件删除
        handleRemovePlanImgurl(file) {
            this.planImg.fileList = [];
            // this.$refs.planImgurl.handleRemove(file);
        },
        // 第一个图片处理 文件更改
        handleFileChangePlanImgurl(file, fileList) {
            // console.log('planImg change')
            this.planImg.isChange = true;
            if (fileList.length > 0) {
                //单个覆盖上传
                this.planImg.fileList = [fileList[fileList.length - 1]];
            }
        },

        // 第二个图片处理 文件上传中
        handleFileProgressBeforeImgurl(event, file, fileList) {
            this.beforePlanImg.isUploading = true;
        },
        // 第二个图片处理 文件上传成功
        handleFileSuccessBeforeImgurl(response, file, fileList) {
            // console.log('beforePlanImgUploadSuccess')
            this.form.beforePlanImgurl = response.data.url;
            this.beforePlanImg.isUploading = false;

            this.beforePlanImgUploadSuccess = true;
        },
        // 第二个图片处理 文件上传失败
        handleFileErrorBeforeImgurl(response, file, fileList) {
            this.msgError("图片上传失败");
        },
        // 第二个图片处理 文件删除
        handleRemoveBeforeImgurl(file) {
            this.beforePlanImg.fileList = [];
            // this.$refs.beforePlanImgurl.handleRemove(file);
        },
        // 第二个图片处理 文件更改
        handleFileChangeBeforeImgurl(file, fileList) {
            // console.log('beforePlanImg change')
            this.beforePlanImg.isChange = true;
            if (fileList.length > 0) {
                //单个覆盖上传
                this.beforePlanImg.fileList = [fileList[fileList.length - 1]];
            }
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.projectId);
            this.projectNames = selection.map((item) => item.projectName);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },

        // 根据项目类型更改触发事件
        projectTypecChange(projectType) {
            let sup = { supType: projectType };
            getSupList(sup).then((response) => {
                this.supIdList = response.data;
            });
            this.dialogViewProjectType = projectType;
        },
        changeStart(date) {
            this.queryParams.endTime = null;
        },
    },

    watch: {
        timeRange: function (val) {
            if (val.length > 0) {
                this.queryParams.startTime = this.moment(val[0]).format(
                    "yyyy-MM-DD 00:00:00"
                );
                this.queryParams.endTime = this.moment(val[1]).format(
                    "yyyy-MM-DD 23:59:59"
                );
            }
        },
        planImgUploadSuccess: function (val) {
            // console.log('planImg change: ' + 'planImgUploadSuccess:'+this.planImgUploadSuccess + ', beforePlanImgUploadSuccess:' + this.beforePlanImgUploadSuccess)
            if (this.planImgUploadSuccess && this.beforePlanImgUploadSuccess) {
                this.submitForm();
            }
        },
        beforePlanImgUploadSuccess: function (val) {
            // console.log('beforePlanImg change: ' + 'planImgUploadSuccess:'+this.planImgUploadSuccess + ', beforePlanImgUploadSuccess:' + this.beforePlanImgUploadSuccess)
            if (this.planImgUploadSuccess && this.beforePlanImgUploadSuccess) {
                this.submitForm();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.el-table ::v-deep tbody tr:hover > td {
    background-color: transparent;
}
</style>
