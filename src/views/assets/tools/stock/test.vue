<template>
    <div class="app-container">
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column type="index" align="center" label="序号">
            </el-table-column>
            <el-table-column label="批次" prop="batchCode" :show-overflow-tooltip="true" />
            <el-table-column label="工器具编码" prop="toolsCode" :show-overflow-tooltip="true" />
            <el-table-column label="工器具名称" prop="toolsName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" prop="toolsSpecs" :show-overflow-tooltip="true" />
            <el-table-column label="型号" prop="toolsModel" :show-overflow-tooltip="true" />
            <el-table-column label="库存数量" prop="numberRepertory" :show-overflow-tooltip="true" />
            <el-table-column label="最近一次检验时间" prop="checkTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{  scope.row.checkTime&&moment(scope.row.checkTime).format("yyyy-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="下次检验时间" prop="nextCheckTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.nextCheckTime&&moment(scope.row.nextCheckTime).format("yyyy-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检验周期" prop="checkCycle" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ cycle[scope.row.checkCycle] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.registerId" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="!scope.row.registerId" size="mini" type="text" icon="el-icon-edit-outline" @click="handleTest(scope.row)">登记</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->

        <!-- 编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" :close-on-click-modal="false" :show-close="false" append-to-body :title="title" width="400px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="检验时间" prop="testTime">
                            <el-date-picker v-model="form.testTime" type="datetime" placeholder="选择日期时间" style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="检测单位" prop="testCompany">
                            <el-input v-model="form.testCompany" placeholder="请输入负责人" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="送检人" prop="testUser">
                            <el-input v-model="form.testUser" placeholder="请输入负责人" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="检验结论" prop="testStatus">
                            <el-select v-model="form.testStatus" style="width: 100%">
                                <el-option v-for="item in testStatus" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="检测报告">
                            <el-upload list-type="picture-card" ref="uploadImg" accept="image/jpeg,image/jpg,image/png" :headers="uploadImg.headers" :disabled="uploadImg.isUploading" :action="uploadImg.url" :on-remove="handleRemove" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-success="handleFileSuccessImage" :on-change="onChange" :file-list="fileList">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :modal="false" :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="" />
                            </el-dialog>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <div class="dialog-footer">
                            <el-button type="primary" @click="submitForm">保 存</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 编辑对话框 -->
    </div>
</template>

<script>
import {
    testList,
    getdictList,
    testUpadte,
    testRegister,
    testGet,
} from "@/api/assets/tools/test";

import { getToken } from "@/utils/auth";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
export default {
    name: "stockTest",
    components: {
        topSearch,
    },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            // table表格数据
            list: [],
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                toolsId: null,
            },
            // 供应商类型
            supplierType: { options: [] },
            //工器具类型
            toolsType: { options: [] },
            //工器具分类
            toolsClass: { options: [] },
            //工器具编码是否禁用
            disabled: null,
            //单位
            unit: { options: [] },
            //周期
            cycle: { options: [] },
            //检测结论
            testStatus: [
                { value: "1", label: "已通过" },
                { value: "2", label: "未通过" },
            ],
            // 表单参数
            form: {},
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: false,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //上传展示list
            fileList: [],
            //上传展示list
            file: [],
            // 图片地址
            dialogImageUrl: "",
            // 图片预览是否开启
            dialogVisible: false,
            // 上传图片参数
            uploadImg: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() ,station: this.$store.getters.currentStation,system:this.$store.getters.currentSystem},
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/upload",
            },
            // 表单校验
            rules: {
                testTime: [
                    {
                        required: true,
                        message: "检验时间不能为空",
                        trigger: "blur",
                    },
                ],
                testCompany: [
                    {
                        required: true,
                        message: "检测单位不能为空",
                        trigger: "blur",
                    },
                ],
                testUser: [
                    {
                        required: true,
                        message: "送检人不能为空",
                        trigger: "blur",
                    },
                ],
                testStatus: [
                    {
                        required: true,
                        message: "检验结论不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.toolsId = this.$route.query.toolsId;
        axios
            .all([
                getdictList("sys_supplier_type"),
                getdictList("sys_tools_type"),
                getdictList("sys_tools_class"),
                getdictList("sys_device_unit"),
                getdictList("sys_check_cycle"),
            ])
            .then(
                axios.spread(
                    (supplierType, toolsType, toolsClass, unit, cycle) => {
                        for (let list of toolsClass.data) {
                            this.toolsClass[list.dictValue] = list.dictLabel;
                            this.toolsClass.options.push({
                                value: list.dictValue,
                                label: list.dictLabel,
                            });
                        }
                        for (let list of toolsType.data) {
                            this.toolsType[list.dictValue] = list.dictLabel;
                            this.toolsType.options.push({
                                value: list.dictValue,
                                label: list.dictLabel,
                            });
                        }

                        for (let item of supplierType.data) {
                            this.supplierType[item.dictValue] = item.dictLabel;
                            this.supplierType.options.push({
                                value: item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        for (let item of unit.data) {
                            this.unit[item.dictValue] = item.dictLabel;
                            this.unit.options.push({
                                value: item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        for (let item of cycle.data) {
                            this.cycle[item.dictValue] = item.dictLabel;
                            this.cycle.options.push({
                                value: item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        this.getList();
                    }
                )
            );
    },
    methods: {
        /**重置 */
        resetQuery() {
            this.queryParams = {
                currentPage: 1,
                size: 15,
                name: null,
                classify: null,
                type: null,
            };
        },
        /** 信息查询 */
        getList() {
            this.loading = true;
            testList(this.queryParams).then((res) => {
                this.list = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.form = {};
            this.fileList = [];
            this.resetForm("form");
            this.$refs.form.resetFields();
        },
        /** 登记按钮操作 */
        handleTest(row) {
            this.open = true;
            this.title = "登记";
            this.form = row;
        },
        /** 提交按钮 */
        submitForm: function () {
            let self = this;
            self.$refs["form"].validate((valid) => {
                if (valid) {
                    if (
                        this.title == "编辑" && this.file.length!== 0 &&this.file[0].url == this.fileList[0].url
                    ) {
                        this.form.testUrl = null;
                        this.form.number = this.form.numberRepertory;
                        testUpadte(this.form, this.form.registerId).then(
                            (res) => {
                                if (res.data) {
                                    this.msgSuccess("编辑成功");
                                    this.open = false;
                                    this.form = {};
                                    this.getList();
                                }
                            }
                        );
                    } else {
                        self.submitFileFormImage();
                    }
                }
            });
        },
        // 编辑查询
        handleUpdate(row) {
            this.open = true;
            this.title = "编辑";
            this.form = {};
            testGet(row.toolsId, row.batchCode).then((res) => {
                this.form = res.data;
                this.form.registerId = row.registerId;
                this.form.numberRepertory = row.numberRepertory;
                if (res.data.testUrl) {
                    this.fileList = [{ name: "", url: res.data.testUrl }];
                    this.file = [{ name: "", url: res.data.testUrl }];
                }
            });
        },
        /**图片删除 */
        handleRemove(file, fileList) {
            this.fileList = [];
        },
        /**图片上传到页面后 */
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 文件上传中处理
        handleFileUploadProgressImage(event, file, fileList) {
            this.uploadImg.isUploading = true;
        },
        // 文件上传成功处理 图片上传
        handleFileSuccessImage(response, file, fileList) {
            this.form.testUrl = response.data.url;
            this.uploadImg.isUploading = false;
            this.form.number = this.form.numberRepertory;
            this.$refs.uploadImg.clearFiles();
            if (this.title == "编辑") {
                testUpadte(this.form, this.form.registerId).then((res) => {
                    if (res.data) {
                        this.msgSuccess("编辑成功");
                        this.open = false;
                        this.form = {};
                        this.getList();
                    }
                });
            } else {
                testRegister(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("登记成功");
                        this.open = false;
                        this.form = {};
                        this.getList();
                    }
                });
            }
        },
        // 图片发生改变时执行
        onChange(file, fileList) {
            if (fileList.length > 0) {
                //单个覆盖上传
                this.fileList = [fileList[fileList.length - 1]];
            }
        },
        // 提交上传文件
        submitFileFormImage() {
            var self = this;
            if (self.$refs.uploadImg.uploadFiles.length == 0) {
                this.uploadImg.isUploading = false;
                this.form.number = this.form.numberRepertory;
                this.$refs.uploadImg.clearFiles();
                testRegister(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("登记成功");
                        this.open = false;
                        this.form = {};
                        this.getList();
                    }
                });
            } else {
                return this.$refs.uploadImg.submit();
            }
            return this.$refs.uploadImg.submit();
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
</style>
