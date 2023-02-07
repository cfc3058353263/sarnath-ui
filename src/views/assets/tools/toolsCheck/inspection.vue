<template>
    <div class="app-container">
        <div class="form">
            <div class="formHeader">
                录入日发电量
            </div>
            <div class="formContainer">
                <el-form ref="form" :model="form" label-width="160px" :rules="rules">
                    <el-form-item label="所属电站" class="formItem">
                        <el-select v-model="form.stationId" filterable style="width:100%" disabled>
                            <el-option v-for="item in this.stationList" :key="item.id" :label="item.stationName" :value="item.stationId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="formItem">
                        <el-button type="primary " icon="el-icon-plus" size="mini" @click="toolsShow = !toolsShow">待送检安全工器具</el-button>
                    </el-form-item>
                    <!-- 待送检工器具 -->
                    <el-form-item v-show="toolsShow" label="工器具名称" class="formItem">
                        <el-input v-model="searchValue" placeholder="请输入工器具名称" maxlength="50">
                             <el-button slot="append" icon="el-icon-search" @click="getCheckList"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-table v-show="toolsShow" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                        <!-- 合格 -->
                        <el-table-column width="80" align="center">
                            <template slot="header" slot-scope="{ column, $index }">
                                <el-checkbox v-model="qualified" @change="checkAllQualified(column, $index)">合格</el-checkbox>
                            </template>
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.qualified" @change="checkQualified(scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <!-- 合格 -->
                        <!-- 不合格 -->
                        <el-table-column width="90" align="center">
                            <template slot="header" slot-scope="{ column, $index }">
                                <el-checkbox v-model="unqualified" @change="checkAllUnqualified(column, $index )">不合格</el-checkbox>
                            </template>
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.unqualified" @change="checkUnqualified(scope.row)"></el-checkbox>
                            </template>
                        </el-table-column>
                        <!-- 不合格 -->

                        <el-table-column prop="toolsName" label="安全工器具名称" width="120" />
                        <el-table-column prop="detailCode" label="安全工器具编号" show-overflow-tooltip />
                        <el-table-column prop="toolsSpecs" label="安全工器具规格" show-overflow-tooltip />
                        <el-table-column prop="checkCycle" label="检验周期" show-overflow-tooltip />
                        <el-table-column prop="checkTime" label="最近一次检验时间" show-overflow-tooltip />
                        <el-table-column prop="nextCheckTime" label="下次检验时间" show-overflow-tooltip />
                        <el-table-column prop="name" label="送检单个报告图片" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div class="uploadClass">
                                    <el-upload
                                        :action="uploadImg.url"
                                        :limit="1"
                                        list-type="picture-card" 
                                        :auto-upload="true" 
                                        :headers="uploadImg.headers" 
                                        :file-list="scope.row.fileList"
                                        :on-success="(response, file, fileList)=>onSuccess(response, file, fileList,scope.row)"
                                        :on-change="(file,fileList)=>uploadOnchange(file,fileList,scope.row)">
                                        <i slot="default" class="el-icon-plus" style="font-size:7px"></i>
                                        <div slot="file" slot-scope="{file}">
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" style="width:32px;height:32px;">
                                            <span class="el-upload-list__item-actions" >
                                                <span class="el-upload-list__item-delete" @click="handleRemove(file,scope.row)">
                                                    <i class="el-icon-delete" style="font-size:20px"></i>
                                                </span>
                                            </span>
                                        </div>
                                    </el-upload>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 待送检工器具 -->
                    <el-form-item label="检验日期" class="formItem" prop="testTime">
                        <el-date-picker v-model="form.testTime" type="date" :clearable="false" size="small" style="width:100%" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="送检人" class="formItem" prop="testUser">
                        <el-input v-model="form.testUser" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="送检机构" class="formItem" prop="testCompany">
                        <el-input v-model="form.testCompany" maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="送检说明" class="formItem" prop="remark">
                        <el-input type="textarea" v-model="form.remark" maxlength="200" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="总的送检报告" class="formItem" required>
                        <el-upload 
                            list-type="picture-card"
                            :limit="1"
                            ref="uploadImg" 
                            accept="image/jpeg,image/jpg,image/png" 
                            :headers="uploadImg.headers" 
                            :disabled="uploadImg.isUploading" 
                            :action="uploadImg.url" 
                            :auto-upload="true" 
                            :on-success="handleFileSuccessImage" 
                            :on-change="onChange" 
                            :file-list="form.fileList">
                            <i class="el-icon-plus"></i>
                            <!-- :on-remove="handleRemove"  -->
                            <!-- :on-preview="handlePictureCardPreview"  -->
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div class="formFoot">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button type="primary">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { getCheckList,getAdd } from "@/api/assets/tools/toolsCheck";

export default {
    name: "addDeviceDay",
    data() {
        return {
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
            searchValue: "",
            form: {
                stationId: null,
                fileList: [], //总送检报告
                detailList:[],
            },
            qualified: false, //合格选框状态
            unqualified: false, //不合格选框状态
            toolsShow: false,
            rules: {
                testTime: [
                    {
                        required: true,
                        message: "检验日期不能为空",
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
                remark: [
                    {
                        required: true,
                        message: "检验结论不能为空",
                        trigger: "blur",
                    },
                ],
            },
            tableData: [],
            fileList: [],
        };
    },
    methods: {
        //获取送检表
        getCheckList() {
            getCheckList({ searchValue: this.searchValue }).then((res) => {
                let tableData = res.data;
                for (let item of tableData) {
                    item.qualified = false;
                    item.unqualified = false;
                    item.fileList = [];
                    item.testUrl = null;
                }
                this.tableData = tableData;
            });
        },
        // 合格
        checkAllQualified(column, index) {
            this.qualified && (this.unqualified = false);
            this.tableData.map((item) => {
                item.qualified = this.qualified;
                this.qualified && (item.unqualified = false);
                this.qualified ? (item.status = 1) : (item.status = null);
            });
        },
        // 不合格
        checkAllUnqualified(column, index) {
            this.unqualified && (this.qualified = false);
            this.tableData.map((item) => {
                item.unqualified = this.unqualified;
                this.unqualified && (item.qualified = false);
                this.unqualified ? (item.status = 2) : (item.status = null);
            });
        },
        //合格单选
        checkQualified(row) {
            row.qualified && (row.unqualified = false);
            row.qualified ? (row.status = 1) : (row.status = null);
        },
        //不合格单选
        checkUnqualified(row) {
            row.unqualified && (row.qualified = false);
            row.unqualified ? (row.status = 2) : (row.status = null);
        },
        //确认
        confirm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    let detailList = this.tableData.filter((item,index)=>{
                        return item.status
                    })
                    if(detailList.length === 0){
                        this.msgError("请选择待送检安全工器具");
                        return
                    }
                    if(!this.form.testUrl){
                        this.msgError("总的送检报告不能为空");
                        return
                    }
                    this.form.detailList = detailList
                    getAdd(this.form).then(res=>{
                        this.msgSuccess("送检成功");
                        this.$store.dispatch("tagsView/delView", this.$route);
                        this.$router.push({
                            path:
                                this.$store.getters.currentSystem == 1
                                    ? "/light/assets/tools/toolsCheck"
                                    : "/wind/assets/tools/toolsCheck",
                        });
                    })

                }
            })
        },
        /**图片删除 */
        handleRemove(file, row) {
            row.fileList = [];
        },
        /**文件状态改变 */
        uploadOnchange(file, fileList, row) {
            row.fileList = fileList;
        },
        /**单独的图片上传成功的接口 */
        onSuccess(response, file, fileList,row){
            row.imageUrl = response.data.url
        },
        /**总的送检报告 */
        handleFileSuccessImage(response, file, fileList,){
            this.form.testUrl = response.data.url
        },
        /** 总送检报告*/
        onChange(file, fileList) {
            this.form.fileList = fileList
        },
    },
    computed: {
        ...mapGetters(["stationList", "currentStation"]),
    },
    created() {
        this.form.stationId = this.currentStation;
        this.getCheckList();
    },
};
</script>
<style scoped lang="scss">
.app-container {
    padding: 20px;
    .form {
        border: 1px solid #bfc5c9;
        border-radius: 5px;
        .formHeader {
            padding: 10px;
            color: #686b6d;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #bfc5c9;
        }
        .formContainer {
            text-align: center;
            padding: 10px;
            .formItem {
                width: 800px;
                margin: 0 auto;
                margin-bottom: 20px;
            }
            .uploadClass {
                ::v-deep .el-upload--picture-card {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                }
                ::v-deep .el-upload-list--picture-card .el-upload-list__item {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    margin-bottom: 0px;
                }
            }
        }
        .formFoot {
            padding: 10px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>