<template>
    <div class="app-container">
        <el-row>
            <!--设备数据-->
            <el-col>
                <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px" :rules="queryRules">
                    <!-- <el-form-item label="所属电站" prop="stationIds">
                        <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
                    </el-form-item> -->
                    <el-form-item label="设备类型" prop="deviceType">
                        <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small" style="width: 240px">
                            <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="设备名称" prop="deviceName">
                        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" maxlength="50" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                    </el-form-item>

                    <el-form-item label="设备状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="设备状态" clearable size="small" style="width: 120px">
                            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['assets:devices:add']">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['assets:devices:remove']">删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['assets:devices:import']">导入</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['assets:devices:export']">导出</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-download" size="mini" @click="handleExportQrcode" v-hasPermi="['assets:devices:qrcode']">导出二维码</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>
                <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="所属电站" key="stationName" prop="stationName" width="220" :show-overflow-tooltip="true" />
                    <el-table-column width="150" label="设备编码" key="deviceCode" prop="deviceCode" :show-overflow-tooltip="true" />
                    <el-table-column label="设备名称" key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
                    <el-table-column label="规格" key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
                    <el-table-column label="型号" key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
                    <el-table-column label="设备类型" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
                    <el-table-column label="上级设备" key="parentName" prop="parentName" :show-overflow-tooltip="true" />
                    <el-table-column label="设备状态" key="statusName" prop="statusName" :show-overflow-tooltip="true" />
                    <el-table-column label="供应商" key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" align="left" width="260" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['assets:devices:edit']">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['assets:devices:info']">查看</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['assets:devices:remove']">删除</el-button>
                            <el-button size="mini" type="text" v-if="scope.row.status!=3" icon="el-icon-edit-outline" @click="handleAddDiscard(scope.row)" v-hasPermi="['assets:devices:discard']">报废登记</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
            </el-col>
        </el-row>

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备编码" prop="deviceCode">
                            <el-input v-model="form.deviceCode" placeholder="设备编码" :disabled="isEnableCode" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称" prop="deviceName">
                            <el-input v-model="form.deviceName" placeholder="设备名称" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="规格" prop="deviceSpecs">
                            <el-input v-model="form.deviceSpecs" placeholder="规格" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号" prop="deviceModel">
                            <el-input v-model="form.deviceModel" placeholder="型号" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备类型" prop="deviceType">
                            <el-select filterable v-model="form.deviceType" placeholder="设备类型" clearable size="small">
                                <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="上级设备" prop="parent">
                            <treeselect v-model="form.parent" :options="deviceOptions" :show-count="true" placeholder="请选择上级设备" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-row >
          <el-col :span="12">
            <el-form-item label="装机容量" prop="installedCapacity">
              <el-input v-model="form.installedCapacity" placeholder="装机容量" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="getSystem == 1">
            <el-form-item label="供应商" prop="deviceSupplier">
              <el-select filterable v-model="form.deviceSupplier" placeholder="供应商" clearable size="small">
                <el-option v-for="dict in supplierOptions" :key="dict.supId" :label="dict.supName" :value="dict.supId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->

                <el-row v-if="getSystem == 2">
                    <el-col :span="12">
                        <el-form-item label="所属风场" prop="installedCapacity">
                            <el-select v-model="form.stationId" placeholder="请选择">
                                <el-option v-for="item in stationOptions" :key="item.stationId" :label="item.stationName" :value="item.stationId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备厂家" prop="deviceSupplier">
                            <el-select filterable v-model="form.deviceSupplier" placeholder="设备厂家" clearable size="small">
                                <el-option v-for="dict in supplierOptions" :key="dict.supId" :label="dict.supName" :value="dict.supId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="getSystem == 1">
                    <el-col :span="12">
                        <el-form-item label="所属电站">
                            <el-select v-model="form.stationId" placeholder="请选择">
                                <el-option v-for="item in stationOptions" :key="item.stationId" :label="item.stationName" :value="item.stationId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接入数量" prop="number">
                            <el-input v-model.number="form.number" controls-position="right" type="number" oninput="if(value.length > 12) value=value.slice(0, 12)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="getSystem == 2">
                    <el-col :span="12">
                        <el-form-item label="安装位置" prop="installationSite">
                            <el-input v-model="form.installationSite" placeholder="安装位置" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="安装数量" prop="number">
                            <el-input v-model.number="form.installationNumber" controls-position="right" type="number" oninput="if(value.length > 12) value=value.slice(0, 12)" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="getSystem == 1">
                    <el-col :span="12">
                        <el-form-item label="安装日期" prop="installTime">
                            <el-date-picker v-model="form.installTime" style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择安装日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到期日期" prop="endTime">
                            <el-date-picker v-model="form.endTime" style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择到期日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="getSystem == 2">
                    <el-col :span="12">
                        <el-form-item label="投运日期" prop="installTime">
                            <el-date-picker v-model="form.installTime" style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择安装日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="到期日期" prop="endTime">
                            <el-date-picker v-model="form.endTime" style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择到期日期"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="装机容量" prop="installedCapacity">
                            <el-input v-model.number="form.installedCapacity" placeholder="装机容量" maxlength="20" oninput="if(value.length > 12) value=value.slice(0, 12)" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="getSystem == 1">
                        <el-form-item label="供应商" prop="deviceSupplier">
                            <el-select filterable v-model="form.deviceSupplier" placeholder="供应商" clearable size="small">
                                <el-option v-for="dict in supplierOptions" :key="dict.supId" :label="dict.supName" :value="dict.supId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea" placeholder="请输入内容" maxlength="500"></el-input>
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
                    <el-link type="info" style="font-size:16px;vertical-align:baseline" @click="importTemplate"> 下载模板 </el-link>
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

        <!-- 设备报废登记对话框 -->
        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="openDiscard" width="400px" append-to-body>
            <el-form ref="formDiscard" :model="formDiscard" :rules="rulesDiscard" label-width="80px">
                <el-row>
                    <el-col>
                        <el-form-item label="报废时间" prop="discardTime">
                            <el-date-picker v-model="formDiscard.discardTime" style="width:100%" type="date" value-format="yyyy-MM-dd" placeholder="选择报废时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="处理方式" prop="discardMethod">
                            <el-input v-model="formDiscard.discardMethod" placeholder="请输入处理方式" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="负责人" prop="discardUser">
                            <el-input v-model="formDiscard.discardUser" placeholder="请输入负责人" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="上传图片">
                            <el-upload list-type="picture-card" :limit="1" ref="uploadImg" accept="image/jpeg,image/jpg,image/png" :headers="uploadImg.headers" :disabled="uploadImg.isUploading" :action="uploadImg.url" :on-progress="handleFileUploadProgressImage" :on-success="handleFileSuccessImage" :auto-upload="false">
                                <i slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{ file }">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                        <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                                            <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                </div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-upload
        ref="uploadImg"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="uploadImg.headers"
        :disabled="uploadImg.isUploading"
        :action="uploadImg.url"
        :on-progress="handleFileUploadProgressImage"
        :on-success="handleFileSuccessImage"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload> -->

                <el-row>
                    <el-col>
                        <el-form-item label="报废原因" prop="discardRemark">
                            <el-input v-model="formDiscard.discardRemark" type="textarea" placeholder="请输入内容" maxlength="500"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDiscardForm">确 定</el-button>
                <el-button @click="closeDiscardDialg">取 消</el-button>
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
    addDiscard,
    exportDataQrcode,
} from "@/api/assets/device";
import { getSupplierSelect } from "@/api/assets/supplier";
import { getIsEnableCode } from "@/api/utils";

import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getDicts } from "../../../api/system/dict/data";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "devices",
    components: { Treeselect, stationCheckbox },
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
            dialogImageUrl: undefined,
            // 设备树选项
            deviceOptions: undefined,
            stationOptions: [],
            deviceExpand: false,
            deviceNodeAll: false,
            supplierOptions: [],
            // 是否显示弹出层
            open: false,
            //报废弹窗
            openDiscard: false,
            // 状态数据字典
            statusOptions: [],
            //设备类型
            deviceTypeOptions: [],
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
                url: process.env.VUE_APP_BASE_API + "/system/device/importData",
            },
            // 上传图片参数
            uploadImg: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                    station: this.$store.getters.currentStation,
                    system: this.$store.getters.currentSystem,
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/upload",
            },
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
            // 表单校验
            rules: {
                deviceCode: [
                    {
                        required: true,
                        message: "设备编码不能为空",
                        trigger: "blur",
                    },
                ],
                deviceName: [
                    {
                        required: true,
                        message: "设备名称不能为空",
                        trigger: "blur",
                    },
                ],
                deviceType: [
                    {
                        required: true,
                        message: "设备类型不能为空",
                        trigger: "blur",
                    },
                ],
                parent: [
                    {
                        required: true,
                        message: "上级设备不能为空",
                        trigger: "blur",
                    },
                ],
                installedCapacity: [
                    {
                        required: true,
                        message: "装机容量不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "装机容量必须为数字" },
                ],
                number: [{ type: "number", message: "最高库存必须为数字" }],
            },
            rulesDiscard: {
                discardTime: [
                    {
                        required: true,
                        message: "报废时间不能为空",
                        trigger: "blur",
                    },
                ],
                discardMethod: [
                    {
                        required: true,
                        message: "处理方式不能为空",
                        trigger: "blur",
                    },
                ],
                discardUser: [
                    {
                        required: true,
                        message: "负责人不能为空",
                        trigger: "blur",
                    },
                ],
                discardRemark: [
                    {
                        required: true,
                        message: "报废原因不能为空",
                        trigger: "blur",
                    },
                ],
                installedCapacity: [
                    {
                        required: true,
                        message: "装机容量不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "装机容量必须为数字" },
                ],
            },
            //分页查询
            queryRules: {
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
    watch: {
        // 根据名称筛选设备树
        deviceName(val) {
            this.$refs.tree.filter(val);
        },
    },
    computed: {
        stationList() {
            return this.$store.getters.stationList.filter(
                (x) => x.stationId == this.$store.getters.currentStation
            );
        },
        getSystem() {
            return this.$store.getters.currentSystem;
        },
    },
    created() {
        this.queryParams.stationIds = [this.$store.getters.currentStation];
        this.$nextTick(() => {
            this.handleQuery();
        });

        this.getDicts("sys_device_status").then((response) => {
            this.statusOptions = response.data;
        });
        // 根据systemId获取对应的字典列表
        if (this.$store.getters.currentSystem == 1) {
            this.getDicts("sys_device_type").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        } else {
            this.getDicts("sys_device_type_wind").then((response) => {
                this.deviceTypeOptions = response.data;
            });
        }
        this.stationOptions = this.stationList;
        //获取供应商下拉框
        getSupplierSelect().then((response) => {
            this.supplierOptions = response.data;
        });

        this.getTreeselect();
        // this.getTreeselect()
        // listPostSelect().then(response => {
        //       this.postOptions = response.data;
        // });
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIds = res;
        },
        /** 查询设备列表 */
        getList() {
            this.loading = true;
            listData(this.query).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.getList();
        },
        /** 查询设备下拉树结构 */
        getTreeselect() {
            treeselectInput().then((response) => {
                this.deviceOptions = response.data;
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
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.deviceId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            var self = this;
            //传入设备编码查询是否启用了自动编号
            getIsEnableCode(1).then((res) => {
                self.isEnableCode = res.data;
                if (self.isEnableCode) {
                    self.rules.deviceCode[0].required = false; //去掉设备编码验证
                }
            });
            this.reset();
            this.open = true;
            this.title = "添加设备";
            this.form.stationId = this.$store.getters.currentStation;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            var self = this;
            const deviceId = row.deviceId;
            this.isEnableCode = true; //编号不能修改
            getInfo(deviceId).then((response) => {
                self.form = response.data;
                self.form.installedCapacity = +self.form.installedCapacity;
                self.open = true;
                self.title = "修改设备";
            });
        },

        handleInfo(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/assets/devices/info",
                query: {
                    deviceId: row.deviceId,
                },
            });
        },

        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.form.deviceId != undefined) {
                        update(this.form).then((response) => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        if (this.isEnableCode) {
                            this.form.deviceCode = undefined; //后台生成，防止前台恶意篡改，最后请求前清空一次数据
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
            const deviceId = row.deviceId || this.ids;
            var devname = "";
            if (row.deviceName) {
                devname = row.deviceName;
            } else {
                devname = this.dataList
                    .filter((x) => this.ids.indexOf(x.deviceId) > -1)
                    .map((x) => x.deviceName);
            }
            this.$confirm(
                '是否确认删除设备名称为  "' + devname + '"  的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(function () {
                    return removeData(deviceId);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/device/export",
                {
                    ...this.queryParams,
                },
                `device_${new Date().getTime()}.xlsx`
            );
        },

        /** 导出按钮操作二维码 */
        handleExportQrcode() {
            this.download(
                "system/device/exportQrcode",
                {
                    ...this.queryParams,
                },
                `device_qrcode_${new Date().getTime()}.xlsx`
            );
        },

        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "设备导入";
            this.upload.open = true;
        },

        /** 下载模板操作 */
        importTemplate() {
            this.download(
                "system/device/importTemplate",
                {
                    ...this.queryParams,
                },
                `device_${new Date().getTime()}.xlsx`
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
        //报废原因登记
        submitDiscardForm() {
            var self = this;
            // if (self.$refs.uploadImg.uploadFiles.length == 0) {
            //   self.msgError('请选择图片！')
            //   return
            // }
            self.$refs["formDiscard"].validate((valid) => {
                if (valid) {
                    self.submitFileFormImage();
                }
            });
        },
        closeDiscardDialg() {
            this.$refs.uploadImg.clearFiles();
            this.resetForm("formDiscard");
            this.openDiscard = false;
        },
        /** 新增按钮操作 */
        handleAddDiscard(row) {
            var self = this;
            this.formDiscard = {
                deviceId: row.deviceId,
            };
            this.resetForm("formDiscard");
            this.openDiscard = true;
            this.title = "报废登记";
            if (self.$refs.uploadImg) {
                self.$refs.uploadImg.clearFiles();
            }
        },

        // 提交上传文件
        submitFileFormImage() {
            var self = this;
            if (self.$refs.uploadImg.uploadFiles.length == 0) {
                this.formDiscard.imgUrl = "";
                addDiscard(self.formDiscard).then((re) => {
                    self.msgSuccess("报废成功");
                    self.openDiscard = false;
                    self.getList();
                });
            } else {
                return this.$refs.uploadImg.submit();
            }
        },

        // 文件上传中处理  图片上传
        handleFileUploadProgressImage(event, file, fileList) {
            this.uploadImg.isUploading = true;
        },
        // 文件上传成功处理 图片上传
        handleFileSuccessImage(response, file, fileList) {
            var self = this;
            this.formDiscard.imgUrl = response.data.url;
            this.uploadImg.isUploading = false;
            this.$refs.uploadImg.clearFiles();
            addDiscard(self.formDiscard).then((re) => {
                self.msgSuccess("报废成功");
                self.openDiscard = false;
                self.getList();
            });
        },
        handleRemove(file) {
            this.$refs.uploadImg.handleRemove(file);
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep input[type="number"] {
    -moz-appearance: textfield;
}
::v-deep input[type="number"]::-webkit-inner-spin-button,
::v-deep input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
