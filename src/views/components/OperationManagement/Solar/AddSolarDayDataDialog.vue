<template>
    <div>
        <el-dialog :close-on-press-escape="false" :visible.sync="open" :close-on-click-modal="false" append-to-body :show-close="true" :title="title">
            <div v-if="id">旧日报</div>
            <el-form v-if="id" :model="form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="日报日期" prop="calendar" label-width="140px">
                            <el-date-picker disabled style="width: 100%" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.calendar" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="天气情况" prop="actualWeather" label-width="150px">
                            <el-input disabled v-model="form.oldActualWeather" placeholder="请输入天气情况" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="当日发电量(kWh)" prop="dayKwh" label-width="140px">
                            <el-input disabled v-model.number="form.oldDayKwh" style="width: 100%" oninput="if(value.length > 12) value=value.slice(0, 12)"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="当日辐照量(Wh/㎡)" prop="sDayRadiation" label-width="150px">
                            <el-input disabled v-model.number="form.oldSDayRadiation" style="width: 100%" oninput="if(value.length > 12) value=value.slice(0, 12)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
<!--                    <el-col :span="24">-->
<!--                        <el-form-item label="运行日志" prop="remark" label-width="140px">-->
<!--                            <el-input disabled v-model="form.oldRemark" placeholder="请输入内容" type="textarea" :rows="5" maxlength="5000"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->

                </el-row>

            </el-form>
            <div v-if="id">新日报</div>
            <el-form ref="form" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="日报日期" prop="calendar" label-width="140px">
                            <el-date-picker :disabled="id !== null" style="width: 100%" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.calendar" :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="天气情况" prop="newActualWeather" label-width="150px">
                            <el-input v-model="form.newActualWeather" placeholder="请输入天气情况" maxlength="50"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="当日发电量(kWh)" prop="newDayKwh" label-width="140px">
                            <el-input v-model="form.newDayKwh" style="width: 100%" oninput="value=value.replace(/[^0-9.]/g,'') && value.slice(0, 12)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="当日辐照量(Wh/㎡)" prop="newSDayRadiation" label-width="150px">
                            <el-input v-model="form.newSDayRadiation" style="width: 100%" oninput="value=value.replace(/[^0-9.]/g,'') && value.slice(0, 12)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
<!--                    <el-col :span="24">-->
<!--                        <el-form-item label="运行日志" prop="newRemark" label-width="140px">-->
<!--                            <el-input v-model="form.newRemark" placeholder="请输入内容" type="textarea" :rows="5" maxlength="5000"></el-input>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label="label" prop="correctReason" label-width="140px">
                            <el-input v-model="form.correctReason" placeholder="请输入内容" type="textarea" :rows="3" maxlength="5000"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--  -->
                <el-row v-if="form.reviewComments">
                    <el-col :span="24">
                        <el-form-item label="审核意见" prop="reviewComments" label-width="140px">
                            <el-input disabled v-model="form.reviewComments" maxlength="5000"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">提 交</el-button>
                <el-button v-if="id" type="primary" @click="preservation">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getdictList } from "@/api/utils";
import {
    calculateSolarRatio,
    addDayData,
    updateDayData,
    getSubmitInfo,
    getpreservationInfo,
} from "@/api/runing/OperationDayData";

export default {
    name: "AddDayDataDialog",
    props: {
        getList: {
            type: Function,
        },
    },
    data() {
        return {
            //标题
            title: "",
            //是否显示标识
            open: false,
            form: {},
            //天气下拉
            weather: [],
            //时间选择配置
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            //修改时使用的日报id
            id: undefined,
            ratio: 0,
            label: "",
            // 表单校验
            rules: {
                calendar: [
                    { required: true, message: "请选择月份", type: "string" },
                ],
                newDayKwh: [
                    {
                        required: true,
                        message: "当日发电量不能为空",
                        trigger: "blur",
                    },
                ],
                newActualWeather: [
                    {
                        required: true,
                        message: "天气情况不能为空",
                        trigger: "blur",
                    },
                ],
                newSDayRadiation: [
                    {
                        required: true,
                        message: "当日辐照量不能为空",
                        trigger: "blur",
                    },
                    // { type: "number", message: "当日辐照量必须为数字" },
                ],
                // newRemark: [
                //     {
                //         required: true,
                //         message: "运行日志不能为空",
                //         trigger: "blur",
                //     },
                // ],
                correctReason: [
                    {
                        required: true,
                        message: "纠正原因不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        /**获取天气字典 */
        getdictList("sys_weather_type").then((res) => {
            this.weather = res.data;
        });
    },
    methods: {
        /**
         * 新增日报数据入口
         */
        addDayReport(title) {
            this.resetForm("form");
            this.id = null;
            this.label = "补录原因";
            this.openDialog(title);
            this.form.stationId = this.$store.getters.currentStation;
            this.form.correctType = 2;
        },
        /**
         * 修改日报数据入口
         */
        editDayReport(title, row) {
            this.resetForm("form");
            this.label = "纠正原因";
            this.openDialog(title);
            this.form = row;
            this.form.correctType = 1;
            this.id = row.targetId;
        },

        /**
         * 打开窗口统一方法
         */
        openDialog(title) {
            this.resetForm();
            this.title = title;
            this.open = true;
        },
        /**
         * 点击计算发电效率按钮操作
         */
        calculateRatio() {
            if (this.form.calendar === undefined) {
                this.msgError("请选择日期");
                return;
            }

            if (this.form.dayKwh === undefined) {
                this.msgError("请输入当日发电量");
                return;
            }

            if (this.form.sDayRadiation === undefined) {
                this.msgError("请输入当日辐照量");
                return;
            }

            calculateSolarRatio(this.form).then((res) => {
                this.ratio = res.ratio;
            });
        },
        /**
         * 点击保存按钮操作
         */
        preservation() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.id === undefined) {
                        //无id,新增日报
                        //添加日报
                        addDayData(this.form).then((res) => {
                            this.msgSuccess("添加成功");
                            this.closeDialog();
                            this.getList();
                        });
                    } else {
                        getpreservationInfo(this.form).then((res) => {
                            console.log(res);
                            this.msgSuccess("保存成功");
                            this.closeDialog();
                            this.getList();
                        });
                        // updateDayData(this.id, this.form).then((res) => {
                        // });
                    }
                }
            });
        },
        /**
         * 点击提交按钮操作
         */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    getSubmitInfo(this.form).then((res) => {
                        console.log(res);
                        this.msgSuccess("提交成功");
                        this.closeDialog();
                        this.getList();
                    });
                }
            });
        },

        /**
         * 点击取消按钮操作
         */
        cancel() {
            this.closeDialog();
            this.resetForm("form");
        },
        /**
         * 关闭dialog操作
         */
        closeDialog() {
            this.form = {};
            this.open = false;
            this.resetForm("form");
        },
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
