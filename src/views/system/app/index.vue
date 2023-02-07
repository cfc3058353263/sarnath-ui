<template>
    <div class="app-container">
        <top-search v-show="showSearch" :queryParams="queryParams" :inputItem="inputItem" :selectItem="selectItem" :getList="getSearch" :resetQuery="resetQuery"></top-search>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:app:add']">新增</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v :data="data" style="width: 100%">
            <el-table-column prop="appId" label="应用ID" :show-overflow-tooltip="true"/>
            <el-table-column prop="platForm" label="系统类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="versionCode" label="版本号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="下载链接" :show-overflow-tooltip="true">
                 <template slot-scope="scope">
                    <el-link :href="scope.row.downloadUrl" type="primary">点击下载</el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.status == 0" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)" v-hasPermi="['system:app:edit']">编辑</el-button>
                    <el-button size="mini" v-if="scope.row.status == 0" type="text" icon="el-icon-circle-check" @click="handleRelease(scope.row)" v-hasPermi="['system:app:start']">发布</el-button>
                    <el-button size="mini" v-if="scope.row.status == 1" type="text" icon="el-icon-circle-check">已发布</el-button>
                    <el-button size="mini" v-if="scope.row.status == 0" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:app:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        <!-- table -->
        <!-- 新增 -->
        <el-dialog :close-on-press-escape="false" width="600px" :visible.sync="open" :close-on-click-modal="false" append-to-body :title="title" :show-close="false">
            <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                <el-row :gutter=10>
                    <el-col :span="12">
                        <el-form-item label="应用ID" prop="appId">
                            <el-input v-model="form.appId" placeholder="请输入应用ID" :disabled="title==='编辑'" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="系统类型" prop="platForm">
                            <el-select placeholder="请选择系统类型" clearable v-model="form.platForm" style="width:100%">
                                <el-option v-for="item,index in platformList" :key="index" :label="item.platform" :value="item.platform">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="版本号" prop="versionCode">
                           <el-input v-model="form.versionCode" placeholder="请输入版本号" :disabled="title==='编辑'" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="升级信息标题" prop="updateTitle"  >
                            <el-input v-model="form.updateTitle" placeholder="请输入信息标题" maxlength="20" style="width:100%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="升级信息提示" prop="updateMessage"  >
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" style="width:100%" maxlength="100" show-word-limit placeholder="请输入内容" v-model="form.updateMessage">
                            </el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="24">
                    <el-form-item label="文件上传"  >
                         <el-upload ref="upload" :limit="2"
                            :file-list="fileList"
                            :headers="upload.headers"
                            :action="upload.url + '?updateSupport=' + upload.updateSupport"
                            :disabled="upload.isUploading"
                            :on-remove="handleRemove"
                            :on-progress="handleFileUploadProgress"
                            :on-success="handleFileSuccess"
                            :auto-upload="false" drag
                            :on-change="onChange">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或
                                <em>点击上传</em>
                            </div>
                        </el-upload>
                         </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            <div  slot="footer"  class="dialog-footer">
                <el-button type="primary" @click="comfir">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
    </div>
</template>

<script>
import { appAdd,appList,appUpdate,appRelease,appDelete } from "@/api/system/app";
import topSearch from "@/views/components/TopSearch";
import { getdictList } from "@/api/utils";
import { getToken } from "@/utils/auth";

export default {
    name: "app",
    components: {
        topSearch,
    },
    data() {
        return {
            data: [],
            open: false,
            openSearch: false,
            total: 0,
            title: "",
            showSearch: true,
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                appId:"__UNI__03E4552",
                platForm:'',
                versionCode:'',
            },
            query:{},
            inputItem: [
                { label: "应用ID", name: "appId", placeholder: "请输入编码" },
                { label: "版本号", name: "versionCode", placeholder: "请输入编码" },
            ],
            selectItem: [
                {
                    label: "编码状态",
                    options: [
                        {label: "android",value:"android"},{ label: "ios",value:"ios"}
                    ],
                    name: "platForm",
                },
            ],
            form: {
                appId:'__UNI__03E4552'
            },
            //状态
            platformList: [{platform: "android"},{ platform: "ios"}],
            //上传
            upload: {
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的设备数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: {
                    Authorization: "Bearer " + getToken(),
                    station: this.$store.getters.currentStation,
                    system: this.$store.getters.currentSystem
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/file/upload',
            },
            fileList:[],
            rules: {
                appId: [
                    {
                        required: true,
                        message: "应用ID不能为空",
                        trigger: "blur",
                    },
                ],
                platForm: [
                    {
                        required: true,
                        message: "系统类型不能为空",
                        trigger: "blur",
                    },
                ],
                versionCode: [
                    {
                        required: true,
                        message: "版本号不能为空",
                        trigger: "blur",
                    },
                ],
                updateTitle: [
                    {
                        required: true,
                        message: "升级信息标题不能为空",
                        trigger: "blur",
                    },
                ],
                updateMessage: [
                    {
                        required: true,
                        message: "升级信息提示不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getSearch()
    },
    methods: {
        /**查询 */
        getSearch() {
            appList(this.queryParams).then((res) => {
                this.data = res.rows;
                this.total = res.total;
                this.query = JSON.parse(JSON.stringify(this.queryParams));
            });
        },
        /**分页 */
        getList(){
            appList(this.query).then((res) => {
                this.data = res.rows;
                this.total = res.total;
            });
        },
         /**重置 */
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 15,
                appId:"__UNI__03E4552",
                platForm:'android',
                versionCode:'',
            };
        },
        /**新增 */
        handleAdd() {
            this.resetForm("form")
            this.fileList = []
            this.form = {appId:'__UNI__03E4552'}
            this.title = "新增";
            this.open = true;
        },
        /** 编辑*/
        handleEdit(row) {
            this.resetForm("form")
            this.title = "编辑";
            this.form = row
            this.fileList = [{name:"sarnath.apk",url:row.downloadUrl}]
            this.open = true;

        },
        /**确认 */
        comfir() {
            if (this.title === "新增") {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if(this.fileList.length === 0){
                            this.msgError("请上传文件")
                            return
                        }
                        this.submitFileForm()
                    }
                });
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if(this.fileList.length === 0){
                            this.msgError("请上传文件")
                            return
                        }else if(this.fileList[0].status === "success"){
                            this.form.downloadUrl = null;
                            appUpdate(this.form).then(res=>{
                                this.open = false;
                                this.getList();
                                this.fileList = []
                            })
                        }else {
                            this.submitFileForm()
                        }
                    }
                });
            }
        },
        /**取消 */
        cancel(){
            this.open = false;
            this.fileList = []
        },
        /** 启用*/
        handleRelease(row) {
            this.$confirm("是否确认发布当前APP版本?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return appRelease({appId:row.appId,versionCode:row.versionCode});
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("发布成功");
                });
        },
        /** 删除*/
        handleDelete(row) {
            this.$confirm("是否确认删除当前APP版本?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return appDelete({appId:row.appId,versionCode:row.versionCode});
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
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
            this.form.downloadUrl = response.data.url
             if (this.title === "新增") {
                appAdd(this.form).then(res=>{
                    this.open = false;
                    this.getList();
                    this.fileList = []
                })
            }else {
                appUpdate(this.form).then(res=>{
                    this.open = false;
                    this.getList();
                    this.fileList = []
                })
            }
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        /**保证只有一个文件 */
        onChange(file, fileList) {
        if (fileList.length > 0) {
            this.fileList = [fileList[fileList.length - 1]]//这一步，是 展示最后一次选择文件
            }
        },
        /**删除 */
        handleRemove(){
            this.fileList = []
        }
    },
};
</script>
<style lang="scss" scoped>
 
.upload{
    display: flex;
    justify-content: center;
}
</style>