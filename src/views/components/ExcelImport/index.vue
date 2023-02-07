<template>
    <!-- 设备导入对话框 -->
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :title="title" :visible.sync="open" width="400px" append-to-body>
        <el-upload ref="upload" :limit="2" accept=".xlsx, .xls" :file-list="fileList"
            :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false" drag
            :on-change="onChange">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
                <el-checkbox v-model="upload.updateSupport" >{{"是否更新已经存在的"+dataName}}</el-checkbox>
                <el-link style="vertical-align:baseline;font-size:16px;color:#333;margin-left:5px" type="info" @click="importTemplate"><span>下载模板</span></el-link>
            </div>
            <div class="el-upload__tip" style="color:red" slot="tip">
                提示：仅允许导入“xls”或“xlsx”格式文件！
            </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="open = false">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
    name: "ExcelImport",
    props: {
        //标题
        title: {
            type: String,
            require: true,
            default: "上传",
        },
        //是否更新已经存在的...
        dataName:{
            type: String,
            require: true,
            default: null,
        },
        //刷新数据的方法
        getList: {
            type: Function,
            default: null,
        },
        //模板下载地址
        templateUrl:{
            type:String,
            default:null
        },
        //上传地址
        uploadUrl:{
            type:String,
            default:null
        },
        //表格前缀
        prefix:{
            type:String,
            default:null
        }
    },
    data() {
        return {
            open: false,
            // 设备导入参数
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
                url: process.env.VUE_APP_BASE_API + "/" + this.uploadUrl,
            },
            fileList:[]
        };
    },
    methods: {
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
                callback:action=>{
                        this.open = false
                        this.getList()
                }
            })
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download(
                this.templateUrl,
                {
                    ...this.queryParams,
                },
                `${this.prefix}.xlsx`
            )
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
    },
};
</script>
<style scoped>
.dialog-footer{
    display: flex;
    justify-content: space-around;
}
</style>
