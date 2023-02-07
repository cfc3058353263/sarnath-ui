<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px" :rules="searchRules">
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
            <el-form-item prop="projectStartDate" label="开始时间">
                <el-date-picker v-model="queryParams.projectStartDate" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="projectEndDate" label="结束时间">
                <el-date-picker v-model="queryParams.projectEndDate" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="项目状态" prop="projectType">
                <el-select v-model="queryParams.projectStatus" placeholder="项目状态" clearable size="small" style="width: 200px">
                    <el-option v-for="dict in projectStatusList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
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
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['project:implementa:add']" @click="handleCheck">整体验收
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-close" size="mini" :disabled="multiple" v-hasPermi="['project:implementa:remove']" @click="handleClose">项目关闭
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
            <el-table-column label="项目类型" prop="projectType" :show-overflow-tooltip="true" :formatter="projectTypeFormat" />
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
            <el-table-column label="状态" prop="projectStatus" :show-overflow-tooltip="true" :formatter="projectStatusFormat" />
            <el-table-column label="监督人" prop="superviseUser" :show-overflow-tooltip="true" />
            <el-table-column label="验收人" prop="checkUser" :show-overflow-tooltip="true" />
            <el-table-column label="验收结果" prop="checkResult" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['project:implementa:edit']" @click="handleTrack(scope.row)">项目跟踪
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        <!-- 分页 -->

        <!-- 整体验收 -->
        <el-dialog title="整体验收" :visible.sync="dialogView" width="700" :before-close="dialogBeforeClose" :close-on-click-modal="false">
            <el-form ref="checkForm" :rules="checkFormRules" :model="checkForm" label-width="80px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="120px" label="验收人" prop="checkUser">
                            <el-input style="width:100%" v-model="checkForm.checkUser" placeholder="请输入验收人" maxlength="20" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="120px" label="监督人" prop="superviseUser">
                            <el-input style="width:100%" v-model="checkForm.superviseUser" placeholder="请输入监督人" maxlength="20" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="120px" label="验收结果" prop="checkResult">
                            <el-input v-model="checkForm.checkResult" type="textarea" placeholder="请输入内容" maxlength="500" :rows="7" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="120px" label="上传验收报告" prop="uploadImgs">
                            <el-upload list-type="picture-card" ref="uploadImgRef" accept="image/jpeg,image/jpg,image/png" :headers="uploadImgs.headers" :action="uploadImgs.url" :on-progress="handleFileProgressUploadImgs" :on-success="handleFileSuccessUploadImgs" :on-error="handleFileErrorUploadImgs" :on-remove="handleRemoveUploadImgs" :auto-upload="false" :file-list="uploadImgs.fileList">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                 
            </el-form>
             <div slot="footer">
                            <el-button type="primary" @click="handleSubmitForm">提 交</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
        </el-dialog>
        <!-- 整体验收 -->
    </div>
</template>

<script>
// 引用
import topSearch from "@/views/components/TopSearch";
import { getDicts } from "@/api/system/dict/data";
import {
    getProjectListByStatusNotXj,
    projectCheck,
    projectClose,
} from "@/api/project/implementa/index.js";
import { getToken } from "@/utils/auth";
import stationCheckbox from "@/views/components/stationCheckbox";

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
                                self.moment(self.queryParams.projectStartDate),
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
                projectStatus: undefined,
                projectStartDate: this.moment().format("yyyy-MM-01 00:00:00"),
                projectEndDate: this.moment().format("yyyy-MM-DD 23:59:59"),
                stationIds: [],
            },
            query: {},
            // 多选框 选中数组
            ids: [],
            projectNames: [],
            projectStatus: [],
            // 多选框 非单个禁用
            single: true,
            // 多选框 非多个禁用
            multiple: true,
            // 搜索 时间选择框
            timeRange: [],
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 项目类型列表
            projectTypeList: [],
            // 项目状态列表
            projectStatusList: [
                { dictLabel: "全部", dictValue: "" },
                {
                    dictLabel: "实施中",
                    dictValue: "2",
                },
                { dictLabel: "已验收", dictValue: "3" },
                { dictLabel: "已关闭", dictValue: "4" },
            ],
            // 表格数据
            projectList: [],
            // 是否显示弹出层
            dialogView: false,
            // 整体验收form
            checkForm: {
                uploadImgs: [],
                checkResult: "",
            },
            // 整体验收校验参数
            checkFormRules: {
                superviseUser: [
                    {
                        required: true,
                        message: "监督人不能为空",
                        trigger: "blur",
                    },
                ],
                checkUser: [
                    {
                        required: true,
                        message: "验收人不能为空",
                        trigger: "blur",
                    },
                ],
                checkResult: [
                    {
                        required: true,
                        message: "验收结果不能为空",
                        trigger: "blur",
                    },
                ],
            },
            // 上传图片参数
            uploadImgs: {
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
                uploadNum: 0,
            },
            searchRules: {
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
        projectStatusFormat(row) {
            return this.selectDictLabel(
                this.projectStatusList,
                row.projectStatus
            );
        },
        // 项目类型
        projectTypeFormat(row) {
            return this.selectDictLabel(this.projectTypeList, row.projectType);
        },

        /** 表格数据查询 */
        getList() {
            this.loading = true;
            getProjectListByStatusNotXj(this.query).then((respons) => {
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
            this.queryParams.projectStartDate = undefined;
            this.queryParams.projectStatu = "001";
            this.queryParams.projectEndDate = undefined;
            this.timeRange = [];
            this.handleQuery();
        },

        /** 整体验收按钮 */
        handleCheck() {
            if (this.ids.length != 1) {
                this.msgWarn("请选择一条项目数据");
                return;
            }
            if (this.projectStatus[0] == 4) {
                this.msgWarn("该项目已关闭");
                return;
            }
            if (this.projectStatus[0] == 3) {
                this.msgWarn("该项目已验收");
                return;
            }
            if (this.projectStatus[0] == 1) {
                this.msgWarn("该项目未通过立项");
                return;
            }
            this.dialogView = true;
            this.checkForm.projectId = this.ids[0];
        },

        /** 关闭弹出页面前操作 */
        dialogBeforeClose() {
            this.dialogView = false;
            this.checkForm = {
                uploadImgs: [],
            };
            this.$refs.uploadImgRef.uploadFiles = [];
            this.uploadImgs.uploadNum = 0;
        },

        // 弹出页面取消按钮
        cancel() {
            this.dialogView = false;
            this.checkForm = {
                uploadImgs: [],
            };
            this.$refs.uploadImgRef.uploadFiles = [];
            this.uploadImgs.uploadNum = 0;
        },

        /** 提交按钮 */
        handleSubmitForm() {
            if (this.$refs.uploadImgRef.uploadFiles.length < 1) {
                this.msgWarn("请最少选择一张图片");
                return;
            }
            this.$refs.uploadImgRef.submit();
        },

        // 图片上传成功后 调用
        submitForm() {
            if (
                this.uploadImgs.uploadNum ==
                this.$refs.uploadImgRef.uploadFiles.length
            ) {
                // 对表单数据进行校验
                this.$refs["checkForm"].validate((valid) => {
                    if (valid) {
                        projectCheck(this.checkForm).then((response) => {
                            if (response.code == 200) {
                                this.msgSuccess("提交成功");
                                this.cancel();
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    }
                });
            }
        },

        // 项目关闭按钮
        handleClose() {
            const projectIds = this.ids;
            const projectNames = this.projectNames;
            this.$confirm('是否关闭"' + projectNames + '"的项目?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return projectClose(projectIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("操作成功");
                });
        },

        // 项目跟踪按钮
        handleTrack(row) {
            this.$router.push({
                name: "projectTrack",
                query: {
                    projectId: row.projectId,
                    projectStatus: row.projectStatus,
                },
            });
        },

        // 第一个图片处理 文件上传中
        handleFileProgressUploadImgs(event, file, fileList) {
            this.uploadImgs.isUploading = true;
        },
        // 第一个图片处理 文件上传成功
        handleFileSuccessUploadImgs(response, file, fileList) {
            this.checkForm.uploadImgs.push(response.data.url);
            this.uploadImgs.isUploading = false;
            this.uploadImgs.uploadNum++;
            this.submitForm();
        },
        // 第一个图片处理 文件上传失败
        handleFileErrorUploadImgs(response, file, fileList) {
            this.msgError("图片上传失败");
        },
        // 第一个图片处理 文件删除
        handleRemoveUploadImgs(file) {
            this.uploadImgs.fileList = [];
            // this.$refs.uploadImgs.handleRemove(file);
        },
        // 第一个图片处理 文件更改
        // handleFileChangeUploadImgs(file, fileList){
        //   this.uploadImgs.isChange = true;
        //   if (fileList.length > 0) {
        //     //单个覆盖上传
        //     this.uploadImgs.fileList = [fileList[fileList.length - 1]];
        //   }
        // },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.projectId);
            this.projectNames = selection.map((item) => item.projectName);
            this.projectStatus = selection.map((item) => item.projectStatus);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        changeStart(date) {
            this.queryParams.projectEndDate = null;
        },
    },

    watch: {
        timeRange: function (val) {
            if (val.length > 0) {
                this.queryParams.projectStartDate = this.moment(val[0]).format(
                    "yyyy-MM-DD 00:00:00"
                );
                this.queryParams.projectEndDate = this.moment(val[1]).format(
                    "yyyy-MM-DD 23:59:59"
                );
            }
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
