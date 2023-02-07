<template>
    <div>
        <!--  新增和编辑弹窗  -->
        <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :title="title" :visible.sync="open" width="1000px" :show-close="false" append-to-body>

            <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="form">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="工单类型" prop="issueType" style="flex-grow:1">
                            <el-select v-model="form.issueType" placeholder="工单类型" style="width: 100%" @change="issueTypeSelectListener">
                                <el-option v-for="item in issueTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="工单编号" prop="issueCode">
                            <el-input v-model="form.issueCode" placeholder="请输入工单编号" :disabled="isEnableCode" maxlength="50" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="isFaultIssue">
                        <el-form-item label="工单级别" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.issueLevel" placeholder="工单级别" style="width: 100%">
                                <el-option v-for="item in issueLevelOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isNotFaultIssue">
                        <el-form-item label="损失类型" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.lossType" placeholder="损失类型" style="width: 100%">
                                <el-option v-for="item in sysFaultTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isDefectIssue">
                        <el-form-item label="缺陷级别" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.issueLevel" placeholder="缺陷级别" style="width: 100%">
                                <el-option v-for="item in issueLevelOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="工单来源" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.issueFrom" placeholder="工单来源" style="width: 100%" :disabled="true">
                                <el-option v-for="item in issueSourceOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="工单下发人" prop="issuePerson">
                            <el-input v-model="currentUser.nickName" placeholder="请输入工单编号" :disabled="true" maxlength="50" show-word-limit />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="处理单位" prop="optDept" style="flex-grow:1">
                            <el-select v-model="form.optDept" placeholder="处理单位" style="width: 100%">
                                <el-option v-for="item in issueOptDeptOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工单状态" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.issueStatus" placeholder="工单状态" style="width: 100%" :disabled="true">
                                <el-option v-for="item in issueStatusOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="设备类型" prop="deviceType">
                            <el-select v-model="form.deviceType" placeholder="设备类型" style="width: 100%" @change="deviceTypeSelect">
                                <el-option v-for="item in deviceTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="自定义故障设备" prop="deviceCustomName" style="flex-grow:1">
                            <el-input placeholder="请输入自定义故障设备" v-model="form.deviceCustomName" @change="customNameInputListener" maxlength="50" :disabled="isDisableDeviceInput" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="故障设备" prop="deviceId" style="flex-grow:1">
                            <el-select v-model="form.deviceId" multiple filterable default-first-option placeholder="请选择故障设备" style="width: 100%" @change="deviceSelect" :disabled="isDisableDeviceSelect">
                                <el-option v-for="item in deviceListOptions" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId" />
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="设备厂家" prop="deviceSupplierName" style="flex-grow:1">
                            <el-input placeholder="请输设备厂家" v-model="form.deviceSupplierName" :disabled="true" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" v-if="isFaultIssue">
                        <el-form-item label="故障部件" prop="faultPart" style="flex-grow:1">
                            <el-input placeholder="请输入故障部件" v-model="form.faultPart" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="isFaultIssue">
                        <el-form-item label="部件厂家" prop="faultPartSupplier" style="flex-grow:1">
                            <el-input placeholder="请输入部件厂家" v-model="form.faultPartSupplier" maxlength="50"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8" v-if="isFaultIssue">
                        <el-form-item label="故障开始时间" prop="optDept" style="width: 100%">
                            <el-date-picker style="width: 100%" v-model="form.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isNotFaultIssue">
                        <el-form-item label="非故障发生时间" prop="optDept">
                            <el-date-picker style="width: 100%" v-model="form.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isDefectIssue">
                        <el-form-item label="缺陷发生时间" prop="optDept" style="width: 100%">
                            <el-date-picker style="width: 100%" v-model="form.startTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isFaultIssue||isNotFaultIssue">
                        <el-form-item label="预计恢复时间" prop="optDept" style="width: 100%">
                            <el-date-picker style="width: 100%" v-model="form.endTime" type="datetime" placeholder="选择日期时间" :picker-options="endTime" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="isDefectIssue">
                        <el-form-item label="预计消缺时间" prop="optDept" style="width: 100%">
                            <el-date-picker style="width: 100%" v-model="form.endTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="8" v-if="isFaultIssue">
                        <el-form-item label="故障损失类型" prop="supType" style="flex-grow:1">
                            <el-select v-model="form.lossType" placeholder="故障损失类型" style="width: 100%">
                                <el-option v-for="item in sysFaultTypeOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="isFaultIssue||isNotFaultIssue">
                        <el-form-item label="是否人为故障" prop="optDept" style="width: 100%">
                            <el-select v-model="form.isPersonFault" placeholder="是否人为故障" style="width: 100%">
                                <el-option v-for="item in isPersonFaultOptions" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上传图片">
                            <el-upload list-type="picture-card" :limit="1" ref="uploadImg" accept="image/jpeg,image/jpg,image/png" :headers="uploadImg.headers" :disabled="uploadImg.isUploading" :action="uploadImg.url" :on-progress="handleFileUploadProgressImage" :on-success="handleFileSuccessImage" :on-change="onChange" :on-remove="handleRemove" :auto-upload="false" :file-list="fileList">
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="故障现象" prop="remark">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" maxlength="500" show-word-limit placeholder="请输入故障现象" v-model="form.remark">
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
import { listData } from '@/api/assets/device'
import { addIssueOrder, modifyIssueOrder } from '@/api/issue/issue'
import { getIsEnableCode } from '@/api/utils'

export default {
    name: 'IssueSubmitDialog',
    props: {
        issueTypeOptions: {
            type: Array,
            require: true,
        },
        issueLevelOptions: {
            type: Array,
            require: true,
        },
        issueSourceOptions: {
            type: Array,
            require: true,
        },
        issueStatusOptions: {
            type: Array,
            require: true,
        },
        sysFaultTypeOptions: {
            type: Array,
            require: true,
        },
        deviceTypeOptions: {
            type: Array,
            require: true,
        },
        issueOptDeptOptions: {
            type: Array,
            require: true,
        },
        isEnableCode: {
            type: Boolean,
            require: true,
            default: false,
        },
    },
    data() {
        let self = this
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self.moment(time.getTime()).diff(self.moment(self.form.startTime), 'day') <
                        0
                    )
                },
            },
            //弹窗显示标识
            open: false,
            //弹窗标题
            title: '',
            // 设备表单查询参数
            queryDeviceParams: {
                deviceType: undefined,
            },
            form: {
                issueType: '1', //默认选中 1-故障工单
                issueLevel: '1', //默认选中 1-暂不定义
                issueFrom: '1', //工单来源 默认选择手工创建
                issueStatus: '1', //工单状态，默认选中 1-新建
                isPersonFault: '0', //是否认为故障，默认选中 0-否
            },
            isPersonFaultOptions: [
                { id: 0, dictValue: '0', dictLabel: '否' },
                { id: 1, dictValue: '1', dictLabel: '是' },
            ],
            //设备选项是否可用
            isDisableDeviceSelect: true,
            //设备自定义是否可以输入
            isDisableDeviceInput: true,
            //当前用户对象
            currentUser: {},
            // 上传图片参数
            uploadImg: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: { Authorization: 'Bearer ' + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/file/upload',
            },
            //设备列表选项
            deviceListOptions: [],
            deviceIdList: [],
            //上传展示list
            fileList: [],
            //校验规则
            rules: {
                issueType: [{ required: true, message: '工单类型不能为空', trigger: 'blur' }],
                issuePerson: [{ required: true, message: '工单下发人不能为空', trigger: 'blur' }],
                deviceType: [{ required: true, message: '工单类型不能为空', trigger: 'blur' }],
            },
        }
    },
    created() {},
    methods: {
        /**
         * 添加订单入口
         */
        addIssue(title) {
            this.openDialog(title)
        },
        /**
         * 编辑工单入口
         */
        modifyIssue(title, data) {
            this.openDialog(title)
            this.form = {
                id: data.id,
                issueType: data.issueType,
                issueLevel: data.issueLevel, //默认选中 1-暂不定义
                issueStatus: data.issueStatus, //工单状态，默认选中 1-新建
                isPersonFault: data.isPersonFault, //是否认为故障，默认选中 0-否
                issueCode: data.issueCode,
                issueFrom: data.issueFrom,
                issuePerson: data.issuePerson,
                deviceType: data.deviceType,
                deviceId: data.deviceList.map((item) => item.deviceId),
                faultPart: data.faultPart,
                faultPartSupplier: data.faultPartSupplier,
                lossType: data.lossType,
                optDept: data.optDept,
                remark: data.remark,
                endTime: data.endTime,
                startTime: data.startTime,
                imgUrl: data.imgUrl,
                deviceCustomName: data.deviceCustomName,
            }
            //判断设备列表，不空的话添加供应商名称
            if (data.deviceList.length !== 0) {
                this.form.deviceSupplierName = data.deviceList[0].deviceSupplierName
            }

            if (data.imgUrl !== null) {
                this.fileList = [{ name: '', url: data.imgUrl }]
            }
            this.queryDeviceParams.deviceType = data.deviceType
            this.isDisableDeviceSelect = true
            listData(this.queryDeviceParams).then((res) => {
                this.deviceListOptions = res.rows
                this.form.deviceId = data.deviceList.map((item) => item.deviceId)

                if (this.form.deviceId.length !== 0) {
                    //可以选择
                    this.isDisableDeviceSelect = false
                    this.isDisableDeviceInput = true
                } else {
                    this.isDisableDeviceSelect = false
                    this.isDisableDeviceInput = false
                }
                if (this.form.deviceCustomName != null) {
                    //可以选择
                    this.isDisableDeviceSelect = true
                    this.isDisableDeviceInput = false
                }
            })
            this.open = true
            this.title = '编辑工单'
        },
        /**
         * 打开弹窗
         */
        openDialog(title) {
            //获取当前用户信息
            this.currentUser = this.$store.getters.user
            //获取是否启用了编码规则
            getIsEnableCode('4').then((res) => {
                this.isEnableCode = res.data
                if (!this.isEnableCode) {
                    //添加规则
                    this.rules.issueCode = [
                        { required: true, message: '工单编码不能为空', trigger: 'blur' },
                    ]
                }
            })
            this.resetForm()
            this.title = title
            this.open = true
        },
        /**
         * 获取设备列表
         */
        getDeviceList() {
            this.isDisableDeviceSelect = true
            listData(this.queryDeviceParams).then((res) => {
                this.deviceListOptions = res.rows
                this.form.deviceId = null
                //可以选择
                this.isDisableDeviceSelect = false
                this.isDisableDeviceInput = false
            })
        },

        /**
         * 点击保存按钮操作
         */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    //校验成功
                    if (this.$refs.uploadImg.uploadFiles.length === 0) {
                        //无上传照片
                        if (this.form.id === undefined) {
                            addIssueOrder(this.form).then((res) => {
                                this.msgSuccess('提交成功')
                                this.open = false
                                this.$parent.getList()
                            })
                        } else {
                            //编辑
                            modifyIssueOrder(this.form.id, this.form).then((res) => {
                                this.msgSuccess('编辑成功')
                                this.open = false
                                this.$parent.getList()
                            })
                        }
                    } else {
                        //先提交照片
                        if (this.fileList[0].name === '') {
                            //或未修改图片上传
                            //将url置为null
                            this.form.imgUrl = null

                            if (this.form.id === undefined) {
                                addIssueOrder(this.form).then((res) => {
                                    this.msgSuccess('提交成功')
                                    this.open = false
                                    this.$parent.getList()
                                })
                            } else {
                                //编辑
                                modifyIssueOrder(this.form.id, this.form).then((res) => {
                                    this.msgSuccess('编辑成功')
                                    this.open = false
                                    this.$parent.getList()
                                })
                            }
                        }
                        return this.$refs.uploadImg.submit()
                    }
                }
            })
        },
        // 点击取消按钮
        cancelForm() {
            this.fileList = []
            this.resetForm()
            this.open = false
        },
        /**
         * 点击重置按钮操作
         */
        resetForm() {
            this.isDisableDeviceSelect = true
            this.fileList = []
            this.form = {
                issueType: '1', //默认选中 1-故障工单
                issueLevel: '1', //默认选中 1-暂不定义
                issueFrom: '1', //工单来源 默认选择手工创建
                issueStatus: '1', //工单状态，默认选中 1-新建
                isPersonFault: '0', //是否认为故障，默认选中 0-否
                //设置下发人为当前用户
                issuePerson: this.currentUser.userId,
            }
        },

        /**
         * 工单类型选择监听
         */
        issueTypeSelectListener(data) {
            //修改工单类型，重置表单
            this.resetForm()
            this.form.issueType = data
        },
        /**
         * 设备类型选择监听
         */
        deviceTypeSelect(data) {
            this.queryDeviceParams.deviceType = data
            this.getDeviceList()
            this.$forceUpdate()
        },
        /**
         * 设备选择监听
         * @param data
         */
        deviceSelect(data) {
            let obj = {}
            this.deviceListOptions.forEach((val) => {
                if (val.deviceId === data[0]) {
                    obj = val
                }
            })
            if (data.length !== 0) {
                this.isDisableDeviceInput = true
            } else {
                this.isDisableDeviceInput = false
            }
            this.form.deviceSupplierName = obj.deviceSupplierName
            this.$forceUpdate()
        },
        /**
         * 自定义设备输入监听
         */
        customNameInputListener(data) {
            if (data === undefined || data === '') {
                this.isDisableDeviceSelect = false
            } else {
                this.isDisableDeviceSelect = true
            }
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
            this.form.imgUrl = response.data.url
            this.uploadImg.isUploading = false
            this.$refs.uploadImg.clearFiles()

            if (this.form.id === undefined) {
                addIssueOrder(this.form).then((res) => {
                    this.msgSuccess('提交成功')
                    this.open = false
                    this.$parent.getList()
                })
            } else {
                //编辑
                modifyIssueOrder(this.form.id, this.form).then((res) => {
                    this.msgSuccess('编辑成功')
                    this.open = false
                    this.$parent.getList()
                })
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
    },
    computed: {
        isFaultIssue() {
            return this.form.issueType === '1'
        },
        isNotFaultIssue() {
            return this.form.issueType === '2'
        },
        isDefectIssue() {
            return this.form.issueType === '3'
        },
    },
}
</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
}
</style>
