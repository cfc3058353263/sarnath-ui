<template>
    <div>
        <!--  新增和编辑弹窗  -->
        <el-dialog :close-on-press-escape="false" :title="title" :visible.sync="open" width="1050px" :close-on-click-modal="false" :show-close="false" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="130px" class="form">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="跟踪日期" prop="optTime" style="width: 100%">
                            <el-date-picker style="width: 100%" v-model="form.optTime" type="datetime" :picker-options="pickerOptions" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理人" prop="optPersonName">
                            <el-input v-model="currentUser.nickName" placeholder="处理人" :disabled="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理方式" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.handleWay" placeholder="处理方式" style="width: 100%">
                                <el-option v-for="item in handleWayOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="损失电量（KWh）" prop="lossKwh">
                            <el-input type="number" v-model="form.lossKwh" placeholder="请输入损失电量" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="影响装机容量(M)" prop="affectInstallCapacity">
                            <el-input type="number" v-model="form.affectInstallCapacity" placeholder="请输入影响装机容量(M)" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <!--                        <el-form-item label="处理设备" style="flex-grow:1">-->
                        <!--                            <el-select v-model="form.handleWay" placeholder="处理设备" style="width: 100%">-->
                        <!--                                <el-option-->
                        <!--                                    v-for="item in orderDeviceList"-->
                        <!--                                    :label="item.deviceName"-->
                        <!--                                    :value="item.deviceId"/>-->
                        <!--                            </el-select>-->
                        <!--                        </el-form-item>-->
                        <el-form-item label="故障设备" prop="deviceNameList" style="flex-grow:1">
                            <el-select v-model="form.deviceNameList" multiple filterable default-first-option placeholder="请选择故障设备" style="width: 100%">
                                <el-option v-for="item in orderDeviceList" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                      <el-form-item label="上传图片">
                        <el-upload
                          list-type="picture-card"
                          :limit="1"
                          ref="uploadImg"
                          accept="image/jpeg,image/jpg,image/png"
                          :headers="uploadImg.headers"
                          :disabled="uploadImg.isUploading"
                          :action="uploadImg.url"
                          :on-progress="handleFileUploadProgressImage"
                          :on-success="handleFileSuccessImage"
                          :on-change="onChange"
                          :on-remove="handleRemove"
                          :auto-upload="false"
                          :file-list="fileList"
                        >
                          <i slot="default" class="el-icon-plus"></i>
                        </el-upload>
                      </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="工单状态" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.handleRange" placeholder="工单状态" style="width: 100%">
                                <el-option v-for="item in issueStatusOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="isShowRealEndTime">
                        <el-form-item label="恢复时间" prop="realEndTime" style="width: 100%">
                            <el-date-picker @input="onInput" style="width: 100%" v-model="form.realEndTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="上传图片" required>
                            <el-upload list-type="picture-card" :limit="1" ref="uploadImg" accept="image/jpeg,image/jpg,image/png" :headers="uploadImg.headers" :disabled="uploadImg.isUploading" :action="uploadImg.url" :on-progress="handleFileUploadProgressImage" :on-success="handleFileSuccessImage" :on-change="onChange" :on-remove="handleRemove" :auto-upload="false" :file-list="fileList">
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="处理措施" prop="optMethod">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入处理措施" maxlength="500" show-word-limit v-model="form.optMethod">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer">
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancelForm">取 消</el-button>
            </div>

        </el-dialog>

    </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { addIssueDetails, modifyIssueDetails, getOrderDeviceList } from '@/api/issue/issue'
import { getdictList } from '@/api/utils'

export default {
    name: 'IssueHandleDialog',
    props: {
        issueCreateTime: {
            type: String,
            required: true,
        },
    },
    data() {
        let self = this
        return {
            pickerOptions: {
                disabledDate(time) {
                    return (
                        time.getTime() > Date.now() ||
                        self
                            .moment(time.getTime())
                            .diff(self.moment(self.issueCreateTime), 'days') < 0
                    )
                },
            },
            //弹窗显示标识
            open: false,
            //弹窗标题
            title: '',
            //当前用户对象
            currentUser: {},
            issueId: undefined,
            //表单数据
            form: {},
            // 上传图片参数
            uploadImg: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: { Authorization: 'Bearer ' + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/file/upload',
            },
            //上传展示list
            fileList: [],
            issueStatusOptions: [
                { id: 2, dictValue: '2', dictLabel: '处理中' },
                { id: 3, dictValue: '3', dictLabel: '已完成' },
            ],
            handleWayOptions: [],
            orderDeviceList: [],
            //校验规则
            rules: {
                optTime: [{ required: true, message: '跟踪日期不能为空', trigger: 'blur' }],
            },
        }
    },
    created() {
        this.getdictList()
        // this.getOrderDeviceList();
    },
    methods: {
        addHandleDetails(issueId, title) {
            this.issueId = issueId
            this.openDialog(title)
            this.getOrderDeviceList()
        },
        modifyHandleDetails(issueId, data, title) {
            // console.log(data);
            this.issueId = issueId
            this.openDialog(title)
            this.getOrderDeviceList()
            this.form = {
                id: data.id,
                optTime: data.optTime,
                optPerson: this.currentUser.userId,
                optPersonName: this.currentUser.nickName,
                handleWay: data.handleWay,
                lossKwh: data.lossKwh,
                affectInstallCapacity: data.affectInstallCapacity,
                handleRange: data.handleRange,
                optMethod: data.optMethod,
                imgUrl: data.imgUrl,
                deviceNameList: data.deviceName != null ? data.deviceName.split(', ') : [],
            }
            if (data.imgUrl !== null) {
                this.fileList = [{ name: '', url: data.imgUrl }]
            }
        },

        /**
         * 打开弹窗
         */
        openDialog(title) {
            //获取当前用户信息
            this.currentUser = this.$store.getters.user
            this.resetForm()
            this.title = title
            this.open = true
        },
        /**
         * 点击提交按钮操作
         */
        submitForm() {
            // console.log(this.form);
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.moment(this.form.optTime).diff(this.moment(this.issueCreateTime), 'seconds') < 0){
                        this.msgError("跟踪时间不得早于工单下发时间")
                        return
                    }
                    //校验成功
                    if (this.fileList.length === 0) {
                        this.msgError('请上传图片')
                        return
                        //无上传照片
                        // console.log(this.form.id);
                        // console.log("-----------------");
                        // this.form.imgUrl = '';

                        // if (this.form.id === undefined) {
                        //     this.addIssueDetailsOpt();
                        // } else {
                        //     this.modifyIssueDetailsOpt();

                        // }
                    } else {
                        //先提交照片
                        if (this.fileList[0].name === '') {
                            //或未修改图片上传
                            //将url置为null
                            this.form.imgUrl = null
                            if (this.form.id === undefined) {
                                this.addIssueDetailsOpt()
                            } else {
                                this.modifyIssueDetailsOpt()
                            }
                        } else {
                            return this.$refs.uploadImg.submit()
                        }
                    }
                }
            })
        },

        /**
         * 提交表单操作
         */
        addIssueDetailsOpt() {
            // console.log("开始上传")
            this.form.issueId = this.issueId
            addIssueDetails(this.form).then((res) => {
                this.msgSuccess('提交成功')
                this.open = false
                this.$parent.getList()
                // console.log(res);
            })
        },
        /**
         * 修改表单操作
         */
        modifyIssueDetailsOpt() {
            // console.log("开始编辑上传")
            this.form.issueId = this.issueId
            // console.log(this.form);
            modifyIssueDetails(this.form.id, this.form).then((res) => {
                this.msgSuccess('编辑成功')
                this.open = false
                this.$parent.getList()
                // console.log(res);
            })
        },

        // 弹窗点击取消按钮
        cancelForm() {
            this.open = false
            this.resetForm()
            this.fileList = []
        },
        /**
         * 点击重置按钮操作
         */
        resetForm() {
            this.form = {}
            this.form.optPerson = this.currentUser.userId
            this.fileList = []
        },

        /**
         * 图片相关操作
         */
        // 文件上传中处理  图片上传
        handleFileUploadProgressImage(event, file, fileList) {
            this.uploadImg.isUploading = true
        },
        // 文件上传成功处理 图片上传
        handleFileSuccessImage(response, file, fileList) {
            // console.log(response);
            this.form.imgUrl = response.data.url
            this.uploadImg.isUploading = false
            this.$refs.uploadImg.clearFiles()

            if (this.form.id === undefined) {
                this.addIssueDetailsOpt()
            } else {
                //编辑
                this.modifyIssueDetailsOpt()
            }
        },
        handleRemove(file) {
            this.fileList = []
            // this.$refs.uploadImg.handleRemove(file);
        },
        // 图片发生改变时执行
        onChange(file, fileList) {
            if (fileList.length > 0) {
                //单个覆盖上传
                this.fileList = [fileList[fileList.length - 1]]
            }
        },
        onInput() {
            this.$forceUpdate()
        },
        /**获取工单处理数据字典 */
        getdictList() {
            getdictList('sys_workprocess_type').then((res) => {
                this.handleWayOptions = res.data.map((item) => {
                    return { id: item.id, dictValue: item.dictValue, dictLabel: item.dictLabel }
                })
            })
        },
        /**获取工单设备数据列表 */
        getOrderDeviceList() {
            // console.log(this.issueId );
            getOrderDeviceList(this.issueId).then((res) => {
                this.orderDeviceList = res.data
            })
        },
    },
    computed: {
        isShowRealEndTime() {
            this.form.realEndTime = null
            return this.form.handleRange === '3'
        },
    },
}
</script>

<style scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}

.form {
    display: flex;
    flex-direction: column;
}
</style>
