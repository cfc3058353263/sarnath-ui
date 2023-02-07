<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <top-search v-show="showSearch" :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" maxlength="200" :getList="getList" :resetQuery="resetQuery"></top-search>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:station:add']">新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="multiple" v-hasPermi="['system:station:remove']">删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:station:import']">导入
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:station:export']">导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getStationSearch"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="stationList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="250" />
            <el-table-column label="电站区域" prop="stationArea" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationArea[scope.row.stationArea] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="电站类型" prop="stationType" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationType[scope.row.stationType] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="实际并网容量" prop="netCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="并网接入等级" prop="netLevel" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationLinklevel[scope.row.netLevel] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="售电方式" prop="saleType" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationSale[scope.row.saleType] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="并网时间" prop="netTime" width="180">
                <template slot-scope="scope">
                    <span>{{
            scope.row.netTime
              ? moment(scope.row.netTime).format("YYYY-MM-DD HH:mm:ss")
              : null
          }}</span>
                </template>
            </el-table-column>
            <el-table-column label="电站业主" prop="stationOwner" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationOwner[scope.row.stationOwner] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="电站状态" prop="stationStatus" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ stationStatus[scope.row.stationStatus] }}</span>
                </template>
            </el-table-column>
            <el-table-column label="类别" prop="stationStatus" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.systemId == "1" ? "电站" : "风场" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <!--                    <el-button size="mini" type="text" icon="el-icon-edit" @click="pushCapcity(scope.row)">并网容量管理</el-button>-->

                    <el-button size="mini" type="text" icon="el-icon-search" v-hasPermi="['system:station:check']" @click="handlecheck(scope.row)">查看
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:station:edit']">编辑
                    </el-button>

                    <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
                        <span class="el-dropdown-link">
                            <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleStationDelete" icon="el-icon-circle-check" v-hasPermi="['system:station:remove']">删除电站</el-dropdown-item>
                            <el-dropdown-item command="handleStationCapcity" icon="el-icon-circle-check" v-hasPermi="['system:station:capcity']">并网容量管理</el-dropdown-item>
                            <el-dropdown-item command="handleStationDevice" icon="el-icon-circle-check" v-hasPermi="['system:station:device']">设备管理</el-dropdown-item>
                            <el-dropdown-item command="handleStationDeviceParams" icon="el-icon-circle-check" v-hasPermi="['system:station:deviceParams']">测点管理</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <!--                    <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:station:remove']" @click="handleDelete(scope.row)">删除-->
                    <!--                    </el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getStationSearch" />
        <!-- 分页 -->
        <!-- 选择对话框 -->
        <el-dialog class="selectD" :visible.sync="dialogVisible" width="400px" :show-close="false" style="text-algin:center" custom-class="centerClass" append-to-body>
            <el-button type="success" @click="selectType(1)" style="margin:-20px 10px 10px 10px;width:100px">电站</el-button>
            <el-button type="primary" @click="selectType(2)" style="margin:-20px 10px 10px 10px;width:100px">风场</el-button>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" width="700px" :close-on-click-modal="false" append-to-body :show-close="false" :title="title">
            <el-form style="height: 420px" ref="form" :model="form" :rules="rules" label-position="right" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="lableForm.stationNameLable" prop="stationName">
                            <el-input v-model="form.stationName" placeholder="请输入名称" maxlength="200" style="width:100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="lableForm.stationAreaLable" prop="stationArea">
                            <el-select v-model="form.stationArea" style="width: 100%">
                                <el-option v-for="item in stationArea.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="lableForm.stationTypeLable" prop="stationType">
                            <el-select v-model="form.stationType" placeholder="电站类型" style="width: 100%">
                                <el-option v-for="item in stationType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="lableForm.stationStatusLable" prop="stationStatus">
                            <el-select v-model="form.stationStatus" placeholder="电站状态" style="width: 100%">
                                <el-option v-for="item in stationStatus.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="lableForm.stationOwnerLable" prop="stationOwner">
                            <el-select filterable clearable v-model="form.stationOwner" placeholder="电站业主" style="width: 100%">
                                <el-option v-for="item in stationOwner.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="并网时间" prop="netTime">
                            <el-date-picker style="width: 100%" type="datetime" placeholder="选择日期时间" v-model="form.netTime" disabled>
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="并网接入等级" prop="netLevel" style="flex-grow: 1">
                            <el-select v-model="form.netLevel" placeholder="并网接入等级" style="width: 100%">
                                <el-option v-for="item in stationLinklevel.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="售电方式" prop="saleType">
                            <el-select v-model="form.saleType" placeholder="售电方式" style="width: 100%">
                                <el-option v-for="item in stationSale.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="装机容量" prop="installCapacity" style="flex-grow: 1">

                            <el-input placeholder="请输入内容" v-model.number="form.installCapacity" oninput="if(value.length > 15) value=value.slice(0, 15)" style="width: 100%" type="number">
                                <template slot="append">MW</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实际并网容量" prop="netCapacity">
                            <el-input type="number" placeholder="0" v-model="form.netCapacity" oninput="if(value.length > 15) value=value.slice(0, 15)" :disabled="true" style="width: 100%">
                                <template slot="append">MW</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电站经度" prop="stationLongitude">
                            <el-input type="text" placeholder="请输入内容" v-model="form.stationLongitude" style="width: 100%" maxlength="50">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电站纬度" prop="stationLatitude">
                            <el-input type="text" placeholder="请输入内容" v-model="form.stationLatitude" style="width: 100%" maxlength="50">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电站负责人" prop="stationPerson">
                            <el-input type="text" placeholder="请输入内容" v-model="form.stationPerson" style="width: 100%" maxlength="50">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
            <el-form-item label="电站照片" prop="stationImg" maxlength="15">
              <el-input type="text" placeholder="请输入内容" v-model="form.stationImg" style="width: 100%">
              </el-input>
            </el-form-item>
          </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="电站地址" prop="stationAddress">
                            <el-input type="text" placeholder="请输入内容" v-model="form.stationAddress" style="width: 100%" maxlength="200">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属城市" prop="stationCity">
                            <el-select v-model="form.stationCity" placeholder="请输入选择" clearable>
                                <el-option v-for="dict in dict.type.sys_station_city" :key="dict.value" :label="dict.label" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="上传图片" prop="stationImg">
                            <el-upload list-type="picture-card" 
                            :limit="1" ref="uploadImg"
                             accept="image/jpeg,image/jpg,image/png" 
                             :headers="uploadImg.headers" 
                             :disabled="uploadImg.isUploading" 
                             :action="uploadImg.url"
                              :on-progress="handleFileUploadProgressImage" 
                              :on-success="handleFileSuccessImage" 
                              :on-change="onChange" :on-remove="handleRemove" 
                              :auto-upload="false" 
                              :file-list="fileList">
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="上传视频" prop="stationImgList">
                            <el-upload ref="uploadVideo" 
                            :limit="1"
                            :file-list="videoList"
                            :action="uploadVideo.url"
                            :auto-upload="true" 
                            drag
                             :on-success="handleFileSuccessVideo"
                            :on-change="onChangeVideo"
                            >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或
                                <em>点击上传</em>
                            </div>
                              <div class="el-upload__tip" slot="tip">只能上传mp4文件</div>
                        </el-upload>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-col :span="24">
                    <el-form-item :label="lableForm.stationDescLable" prop="stationDesc">
                        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" maxlength="2000" show-word-limit placeholder="请输入内容" v-model="form.stationDesc">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑对话框 -->

        <!-- 上传组件 -->
        <excel-import uploadUrl="system/sysPowerStation/importData" templateUrl="system/sysPowerStation/importTemplate" ref="import" title="电站数据导入" dataName="电站数据" prefix="电站导入模版" :getList="getList" />
        <!-- 上传组件 -->
    </div>
</template>

<script>
import {
    stationList,
    stationSearch,
    stationUpdate,
    stationAdd,
    stationDelete,
    getArea,
    getSaleType,
    getPowerstate,
    getLinklevel,
    getStationtype,
    getStationOwner,
    getwindFieldType,
} from "@/api/system/station";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";
import excelImport from "@/views/components/ExcelImport";
import { getToken } from "@/utils/auth";

export default {
    name: "station",
    dicts: ["sys_station_city"],
    components: {
        topSearch,
        excelImport,
    },
    data() {
        // 装机容量校验
        var validateInstallCapacity = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入装机容量"));
            } else if (value.toString().length > 13) {
                callback(new Error("装机容量长度不能超过13位"));
            } else {
                let intStr = value.toString().split(".")[0];
                let decStr = value.toString().split(".")[1];
                if (intStr.length > 6) {
                    callback(new Error("整数长度不能超过6位"));
                } else if (decStr !== undefined) {
                    if (decStr.length > 6) {
                        callback(new Error("整数长度不能超过6位"));
                    }
                    callback();
                } else {
                    callback();
                }
            }
        };
        // 并网容量校验
        var validateNetCapacity = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入并网容量"));
            } else if (value.length > 13) {
                callback(new Error("并网容量长度不能超过13位"));
            } else {
                let intStr = value.split(".")[0];
                let decStr = value.split(".")[1];
                if (intStr.length == 0) {
                    callback(new Error("请输入正确的格式"));
                } else if (intStr.length > 6) {
                    callback(new Error("整数长度不能超过6位"));
                } else if (decStr !== undefined) {
                    if (decStr.length > 6) {
                        callback(new Error("整数长度不能超过6位"));
                    }
                    callback();
                } else {
                    callback();
                }
            }
        };
        return {
            //topSearch
            inputItem: [
                {
                    label: "电站名称",
                    name: "name",
                    placeholder: "请输入电站名称",
                },
            ],
            selectItem: [
                {
                    label: "类型",
                    options: [],
                    name: "type",
                },
                {
                    label: "区域",
                    options: [],
                    name: "area",
                },
            ],
            // table表格数据
            stationList: [],
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                name: null,
                type: null,
                area: null,
                startTime: null,
                stopTime: null,
            },
            query: {},
            // 电站类型
            stationType: { options: [] },
            // 风电类型
            windFieldType: { options: [] },
            // 电站区域
            stationArea: { options: [] },
            // 售电方式
            stationSale: { options: [] },
            // 电站状态
            stationStatus: { options: [] },
            // 并网等级
            stationLinklevel: { options: [] },
            // 业主id
            stationOwner: { options: [] },
            // 编辑还是新增
            operaType: "",
            // 遮罩层
            loading: false,
            dialogVisible: false,
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
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否显示弹出层（数据权限）
            openDataScope: false,
            isEdit: false,
            // 表单参数
            form: {},
            lableForm: {},
            lableFormSolar: {
                stationNameLable: "电站名称",
                stationAreaLable: "电站区域",
                stationTypeLable: "电站类型",
                stationStatusLable: "电站状态",
                stationOwnerLable: "电站业主",
                stationDescLable: "电站概况",
            },
            lableFormWind: {
                stationNameLable: "风场名称",
                stationAreaLable: "风场区域",
                stationTypeLable: "风场类型",
                stationStatusLable: "风场状态",
                stationOwnerLable: "风场业主",
                stationDescLable: "风场概况",
            },
            //上传图片参数
            uploadImg: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/file/upload",
            },
            //上传展示list
            fileList: [],
            //video
            videoList: [],
            uploadVideo: {
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的设备数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/file/upload',
            },

            // 表单校验
            rules: {
                stationName: [
                    {
                        required: true,
                        message: "电站名称不能为空",
                        trigger: "blur",
                    },
                ],
                stationArea: [
                    {
                        required: true,
                        message: "电站区域不能为空",
                        trigger: "blur",
                    },
                ],
                stationType: [
                    {
                        required: true,
                        message: "电站类型不能为空",
                        trigger: "blur",
                    },
                ],
                stationStatus: [
                    {
                        required: true,
                        message: "电站状态不能为空",
                        trigger: "blur",
                    },
                ],
                installCapacity: [
                    {
                        required: true,
                        message: "装机容量不能为空",
                        trigger: "blur",
                    },
                    // { type: "number", message: "装机容量必须为数字" },
                ],
                // netCapacity: [
                //     {
                //         validator: validateNetCapacity,
                //         required: true,
                //         // message: "实际并网容量不能为空",
                //         trigger: "blur",
                //     },
                // ],
            },
        };
    },
    created() {
        this.loading = true;
        axios
            .all([
                getArea(),
                getSaleType(),
                getPowerstate(),
                getLinklevel(),
                getStationtype(),
                getwindFieldType(),
                getStationOwner(),
            ])
            .then(
                axios.spread(
                    (
                        area,
                        saleType,
                        powerstate,
                        linklevel,
                        stationType,
                        windFieldType,
                        stationOwner
                    ) => {
                        //区域
                        for (let item of this.selectItem) {
                            if (item.label === "区域") {
                                for (let list of area.data) {
                                    const obj = {
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    };
                                    item.options.push(obj);
                                    this.stationArea[list.dictValue] =
                                        list.dictLabel;
                                    this.stationArea.options.push({
                                        value: +list.dictValue,
                                        label: list.dictLabel,
                                    });
                                }
                            }
                        }
                        // 售电
                        for (let item of saleType.data) {
                            this.stationSale[item.dictValue] = item.dictLabel;
                            this.stationSale.options.push({
                                value: +item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        // 电站
                        for (let item of powerstate.data) {
                            this.stationStatus[item.dictValue] = item.dictLabel;
                            this.stationStatus.options.push({
                                value: +item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        // 并网等级
                        for (let item of linklevel.data) {
                            this.stationLinklevel[item.dictValue] =
                                item.dictLabel;
                            this.stationLinklevel.options.push({
                                value: +item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        // 电站类型
                        for (let item of this.selectItem) {
                            if (item.label === "类型") {
                                for (let list of stationType.data) {
                                    const obj = {
                                        value: list.dictValue,
                                        label: list.dictLabel,
                                    };
                                    item.options.push(obj);
                                    this.stationType[list.dictValue] =
                                        list.dictLabel;
                                    this.stationType.options.push({
                                        value: +list.dictValue,
                                        label: list.dictLabel,
                                    });
                                }
                            }
                        }
                        //风电类型
                        for (let item of windFieldType.data) {
                            this.windFieldType[item.dictValue] = item.dictLabel;
                            this.windFieldType.options.push({
                                value: +item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        // 电站业主
                        for (let item of stationOwner.data) {
                            this.stationOwner[item.dictValue] = item.dictLabel;
                            this.stationOwner.options.push({
                                value: +item.dictValue,
                                label: item.dictLabel,
                            });
                        }
                        // this.getstationList();
                        this.getList();
                    }
                )
            );
    },
    methods: {
        // 更多操作触发
        handleCommand(command, row) {
            switch (command) {
                case "handleStationDelete":
                    this.handleDelete(row);
                    break;
                case "handleStationCapcity":
                    this.pushCapcity(row);
                    break;
                case "handleStationDevice":
                    this.pushDevice(row);
                    break;
                case "handleStationDeviceParams":
                    this.pushDeviceParams(row);
                    break;
                default:
                    break;
            }
        },
        /** 获取电站列表接口 */
        getstationList() {
            this.loading = true;
            stationList().then((res) => {
                this.stationList = res.data;
                this.total = res.data.length;
                this.loading = false;
            });
        },
        /**重置 */
        resetQuery() {
            this.queryParams = {
                currentPage: 1,
                size: 15,
                name: null,
                type: null,
                area: null,
            };
        },
        /**电站查询接口 */
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.getStationSearch();
        },
        /**分页 */
        getStationSearch() {
            this.loading = true;
            stationSearch(this.query).then((res) => {
                this.stationList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        // 表格多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.stationId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.fileList = [];
            this.videoList = [];
            this.resetForm("form");
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.selectType(1);
            // this.isEdit = false;
            // this.dialogVisible = true;
        },
        /** 编辑按钮操作 */
        handleUpdate(row) {
            this.lableForm = {};
            if (row.systemId === 1) {
                this.lableForm = JSON.parse(
                    JSON.stringify(this.lableFormSolar)
                );
            } else {
                this.lableForm = JSON.parse(JSON.stringify(this.lableFormWind));
            }
            if (row.stationImg) {
                this.fileList = [{ name: null, url: row.stationImg }];
            }
            if(row.stationImgList.length !== 0){
                this.videoList = [{ name: null, url: row.stationImgList[0] }]
            }
            this.open = true;
            this.form = JSON.parse(JSON.stringify(row));
            this.operaType = "updata";
            this.title = "编辑";
            this.isEdit = true;
        },
        /**查看按钮操作 */
        handlecheck(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + "/system/station/data",
                params: {
                    // stationId: row.stationId,
                },
                query: {
                    stationId: row.stationId,
                    stationArea: JSON.stringify(this.stationArea),
                    stationType: JSON.stringify(this.stationType),
                    stationSale: JSON.stringify(this.stationSale),
                    stationStatus: JSON.stringify(this.stationStatus),
                    stationLinklevel: JSON.stringify(this.stationLinklevel),
                    stationOwner: JSON.stringify(this.stationOwner),
                },
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.fileList.length > 0) {
                        if (!this.fileList[0].name) {
                            this.form.stationImg = null;
                            this.submit();
                        } else {
                            this.$refs.uploadImg.submit();
                        }
                    } else {
                        this.form.stationImg = null;
                        this.submit();
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.stationId || this.ids;
            this.$confirm("是否删除电站?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return stationDelete(postIds);
                })
                .then(() => {
                    this.getStationSearch();
                    this.msgSuccess("删除成功");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/sysPowerStation/export",
                {
                    ...this.queryParams,
                },
                `电站导出数据.xlsx`
            );
        },

        /** 导入按钮操作 */
        handleImport() {
            this.$refs.import.open = true;
        },
        selectType(type) {
            this.dialogVisible = false;
            //1 电站  2 风场
            if (type == 1) {
                this.open = true;
                this.operaType = "add";
                this.form = {};
                this.form.systemId = 1;
                this.title = "新增电站";

                this.lableForm = {
                    stationNameLable: "电站名称",
                    stationAreaLable: "电站区域",
                    stationTypeLable: "电站类型",
                    stationStatusLable: "电站状态",
                    stationOwnerLable: "电站业主",
                    stationDescLable: "电站概况",
                };
            } else {
                this.open = true;
                this.operaType = "add";
                this.form = {};
                this.form.systemId = 2;
                this.title = "新增风场";

                this.lableForm = {
                    stationNameLable: "风场名称",
                    stationAreaLable: "风场区域",
                    stationTypeLable: "风场类型",
                    stationStatusLable: "风场状态",
                    stationOwnerLable: "风场业主",
                    stationDescLable: "风场概况",
                };
            }
        },
        // 并网容量
        pushCapcity(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/system/station/capacity",
                // name: "capacity",
                params: {
                    // stationId: row.stationId,
                },
                query: {
                    row: JSON.stringify(row),
                },
            });
        },
        // 设备管理
        pushDevice(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/system/station/devcieConfig",
                // name: "capacity",
                params: {
                    // stationId: row.stationId,
                },
                query: {
                    stationId: row.stationId,
                },
            });
        },
        // 测点管理
        pushDeviceParams(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/system/station/deviceParams",
                // name: "capacity",
                params: {
                    // stationId: row.stationId,
                },
                query: {
                    stationId: row.stationId,
                },
            });
        },
        // 文件上传中处理  图片上传
        handleFileUploadProgressImage(event, file, fileList) {
            this.uploadImg.isUploading = true;
        },
        // 文件上传成功处理 图片上传
        handleFileSuccessImage(response, file, fileList) {
            this.form.stationImg = response.data.url;
            this.uploadImg.isUploading = false;
            this.$refs.uploadImg.clearFiles();
            this.submit();
        },
        handleRemove(file) {
            this.fileList = [];
        },
        // 图片发生改变时执行
        onChange(file, fileList) {
            if (fileList.length > 0) {
                //单个覆盖上传
                this.fileList = [fileList[fileList.length - 1]];
            }
        },
        // 提交操作
        submit() {
            if (this.operaType === "updata") {
                stationUpdate(this.form.stationId, this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("编辑成功");
                        this.open = false;
                        this.fileList = [];
                        this.getStationSearch();
                    }
                });
            } else {
                stationAdd(this.form).then((res) => {
                    if (res.data) {
                        this.msgSuccess("添加成功");
                        this.open = false;
                        this.fileList = [];
                        this.getStationSearch();
                    }
                });
            }
        },
        //以下是视频video的方法
        // 删除视频
        handleRemoveVideo(){
            this.videoList = []
        },
          // 文件上传中处理
        handleFileUploadProgressVideo(event, file, fileList) {
            this.uploadVideo.isUploading = true;
        },
         // 文件上传成功处理
        handleFileSuccessVideo(response, file, fileList) {
            this.uploadVideo.isUploading = false;
            this.$refs.uploadVideo.clearFiles();
            this.form.stationImgList = [response.data.url]
            this.msgSuccess("上传成功");
        },
          /**保证只有一个文件 */
        onChangeVideo(file, fileList) {
        if (fileList.length > 0) {
            this.videoList = [fileList[fileList.length - 1]]//这一步，是 展示最后一次选择文件
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.selectD {
    text-align: center;
}
::v-deep input[type="number"] {
    -moz-appearance: textfield;
}
::v-deep input[type="number"]::-webkit-inner-spin-button,
::v-deep input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
