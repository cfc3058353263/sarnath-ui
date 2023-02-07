<template>
    <div class="app-container">
        <el-row>
            <!--备品数据-->
            <el-col>
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                    <el-form-item label="备品类型" prop="spareType">
                        <el-select v-model="queryParams.spareType" placeholder="备品类型" clearable size="small" style="width: 240px">
                            <el-option v-for="dict in spareTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="备品编码" prop="spareCode">
                        <el-input v-model="queryParams.spareCode" placeholder="请输入备品编码" maxlength="50" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item label="备品名称" prop="spareName">
                        <el-input v-model="queryParams.spareName" placeholder="请输入备品名称" maxlength="50" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['assets:spare:base:add']">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['assets:spare:base:remove']">删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['assets:spare:base:import']">导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['assets:spare:base:export']">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>
                <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <!-- <el-table-column label="序号" type="index" width="50" ></el-table-column> -->
                    <el-table-column width="150" label="备品类型" key="spareTypeName" prop="spareTypeName" />
                    <el-table-column width="160px" label="备品编码" key="spareCode" prop="spareCode"  :show-overflow-tooltip="true"/>
                    <el-table-column label="备品名称" key="spareName" prop="spareName" :show-overflow-tooltip="true" />
                    <el-table-column label="规格" key="spareSpecs" prop="spareSpecs" :show-overflow-tooltip="true" />
                    <el-table-column label="型号" key="spareModel" prop="spareModel" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" key="spareUnitName" prop="spareUnitName" :show-overflow-tooltip="true" />
                    <el-table-column label="供应商" key="spareSupplierName" prop="spareSupplierName" :show-overflow-tooltip="true" />
                    <el-table-column label="最高库存" key="spareMaxNum" prop="spareMaxNum" width="160" />
                    <el-table-column label="最底库存" key="spareMinNum" prop="spareMinNum" width="160">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['assets:spare:base:edit']">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['assets:spare:base:remove']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备品类型" prop="spareType">
                            <el-select filterable v-model="form.spareType" placeholder="备品类型" clearable size="small" style="width:100%">
                                <el-option v-for="dict in spareTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备品编码" prop="spareCode">
                            <el-input v-model="form.spareCode" placeholder="备品编码" :disabled="isEnableCode" maxlength="50" style="width:100%" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备品名称" prop="spareName">
                            <el-input v-model="form.spareName" placeholder="备品名称" maxlength="50" style="width:100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格" prop="spareSpecs">
                            <el-input v-model="form.spareSpecs" placeholder="规格" maxlength="50" style="width:100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="型号" prop="spareModel">
                            <el-input v-model="form.spareModel" placeholder="型号" maxlength="50" style="width:100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位" prop="spareUnit">
                            <el-select v-model="form.spareUnit" placeholder="单位" clearable size="small" style="width:100%">
                                <el-option v-for="dict in spareUnitOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="最底库存" prop="spareMinNum">
                            <el-input v-model.number="form.spareMinNum" :min="0" oninput="if(value.length > 15) value=value.slice(0, 15)" style="width:100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最高库存" prop="spareMaxNum">
                            <el-input v-model.number="form.spareMaxNum" :min="0" oninput="if(value.length > 15) value=value.slice(0, 15)" style="width:100%" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商" prop="supplierId">
                            <el-select filterable v-model="form.supplierId" placeholder="供应商" clearable size="small" style="width:100%">
                                <el-option v-for="dict in supplierOptions" :key="dict.supId" :label="dict.supName" :value="dict.supId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="250" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 设备导入对话框 -->
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <el-checkbox v-model="upload.updateSupport">是否更新已经存在的设备数据</el-checkbox>
                    <el-link type="info" style="font-size:16px" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">
                    提示：仅允许导入“xls”或“xlsx”格式文件！
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listData,
    treeselectInput,
    add,
    update,
    removeData,
    getInfo,
    exportData,
} from "@/api/assets/sparebase";
import { getSupplierSelect } from "@/api/assets/supplier";
import { getIsEnableCode } from "@/api/utils";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "base",
    components: { Treeselect },
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
            // 用户表格数据
            dataList: null,
            isEnableCode: true, //后台是否为自动填充编号
            // 弹出层标题
            title: "",
            supplierOptions: [],
            spareUnitOptions: [], //单位
            // 是否显示弹出层
            open: false,
            //备品类型
            spareTypeOptions: [],
            // 表单参数
            form: {},
            formDiscard: {},
            formStation: {},
            defaultProps: {
                children: "children",
                label: "label",
            },
            // 设备导入参数
            upload: {
                // 是否显示弹出层（设备导入）
                open: false,
                // 弹出层标题（设备导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的设备数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                    station: this.$store.getters.currentStation,
                    system: this.$store.getters.currentSystem,
                },
                // 上传的地址
                url:
                    process.env.VUE_APP_BASE_API +
                    "/system/sparebase/importData",
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                spareType: undefined,
                spareName: undefined,
                spareCode: undefined,
            },
            query: {},
            // 表单校验
            rules: {
                spareCode: [
                    {
                        required: true,
                        message: "备品编码不能为空",
                        trigger: "blur",
                    },
                ],
                spareName: [
                    {
                        required: true,
                        message: "备品名称不能为空",
                        trigger: "blur",
                    },
                ],
                spareType: [
                    {
                        required: true,
                        message: "备品类型不能为空",
                        trigger: "blur",
                    },
                ],
                spareUnit: [
                    {
                        required: true,
                        message: "单位不能为空",
                        trigger: "blur",
                    },
                ],
                spareMaxNum: [
                    { type: "number", message: "最低库存必须为数字" },
                ],
                spareMinNum: [
                    { type: "number", message: "最高库存必须为数字" },
                ],
            },
        };
    },
    created() {
        this.handleQuery();
        //备品类型
        this.getDicts("sys_spare_type").then((response) => {
            this.spareTypeOptions = response.data;
        });
        //单位
        this.getDicts("sys_device_unit").then((response) => {
            this.spareUnitOptions = response.data;
        });
        //获取供应商下拉框
        getSupplierSelect().then((response) => {
            this.supplierOptions = response.data;
        });
    },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            listData(this.query).then((response) => {
                this.dataList = response.rows;
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
            this.form = {};
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.query = JSON.parse(JSON.stringify(this.queryParams));
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
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            var self = this;
            //传入编码类型查询是否启用了自动编号
            getIsEnableCode(3).then((res) => {
                self.isEnableCode = res.data;
                if (self.isEnableCode) {
                    self.rules.spareCode[0].required = false; //去掉编码验证
                }
            });
            this.reset();
            this.open = true;
            this.title = "添加备品";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            var self = this;
            const id = row.id;
            this.isEnableCode = true; //编号不能修改
            getInfo(id).then((response) => {
                self.form = response.data;
                self.open = true;
                self.title = "修改备品";
            });
        },

        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.spareMinNum >= this.form.spareMaxNum) {
                        return this.msgError("最低库存不得或大于等于最高库存");
                    }
                    if (this.form.id != undefined) {
                        update(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        if (this.isEnableCode) {
                            this.form.spareCode = undefined; //后台生成，防止前台恶意篡改，最后请求前清空一次数据
                        }
                        add(this.form).then((response) => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const id = row.id || this.ids;
            var sparname = "";
            if (row.spareName) {
                sparname = row.spareName;
            } else {
                sparname = this.dataList
                    .filter((x) => this.ids.indexOf(x.id) > -1)
                    .map((x) => x.spareName);
            }
            this.$confirm(
                '是否确认删除备品名称为"' + sparname + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return removeData(id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/sparebase/export",
                {
                    ...this.queryParams,
                },
                `备品基本信息_${new Date().getTime()}.xlsx`
            );
        },

        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "备品导入";
            this.upload.open = true;
        },

        /** 下载模板操作 */
        importTemplate() {
            this.download(
                "system/sparebase/importTemplate",
                {
                    ...this.queryParams,
                },
                `备品基本信息导入模板.xlsx`
            );
        },

        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert(response.msg, "导入结果", {
                dangerouslyUseHTMLString: true,
            });
            this.getList();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },

        handleRemove(file) {
            this.$refs.uploadImg.handleRemove(file);
        },
    },
};
</script>
