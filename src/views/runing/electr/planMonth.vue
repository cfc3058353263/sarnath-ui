<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :rules="rules" :inline="true" ref="form" :model="form" label-width="80px">
            <el-form-item label-width="200px" label="合同编号">
                <el-input placeholder="请输入合同编号" clearable size="small" v-model="form.contractCode" maxlength="50" />
            </el-form-item>

            <el-form-item prop="contractBeginDate" label="开始时间" label-width="150px">
                <el-date-picker v-model="form.contractBeginDate" @change="changeStart" :clearable="false" size="small" style="width:215px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="contractEndDate" label="结束时间" label-width="150px">
                <el-date-picker v-model="form.contractEndDate" :clearable="false" size="small" :picker-options="contractEndDate" style="width:215px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="contractKwh" label-width="150px" label="合同期电量(kWh)">
                <el-input placeholder="请输入合同期电量" clearable size="small" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="form.contractKwh" />
            </el-form-item>
            <el-form-item prop="sRadioAvgYear" label-width="200px" label="预计年均值辐照值(Wh/㎡)">
                <el-input placeholder="请输入预计年均值辐照值" clearable size="small" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="form.sRadioAvgYear" />
            </el-form-item>
            <!--  -->
            <el-form-item prop="protocolPercent" label-width="150px" label="协议效能比">
                <el-input placeholder="请输入协议效能比" clearable size="small" style="width:215px" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="form.protocolPercent" />
            </el-form-item>
            <el-form-item prop="efficiencySim" label-width="150px" label="模拟发电效率">
                <el-input placeholder="请输入模拟发电效率" clearable size="small" style="width:215px" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="form.efficiencySim" />
            </el-form-item>
            <!--  -->
            <el-form-item label="备注" label-width="150px">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" maxlength="500" type="textarea" v-model="form.remark" placeholder="" clearable size="small" style="width: 500px" />
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8" v-if="submitType">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate">生成</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-success" size="mini" @click="handleCalculation">计算</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button v-if="!id" type="success" plain icon="el-icon-success" size="mini" @click="handleSubmit">保存</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="default" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-col>
        </el-row>
        <!-- table -->
        <el-table show-summary v-loading="loading" :data="list">
            <el-table-column type="index" align="center" prop="prop" label="序号">
            </el-table-column>
            <el-table-column label="日期" prop="calendar" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.calendar).format("YYYY年MM月") }}</span>
                </template>
            </el-table-column>
            <!-- 可填写 -->
            <el-table-column label="月预计发电量(kWh)" prop="forecastKwh" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input clearable size="small" v-model.number="scope.row.forecastKwh" oninput="if(value.length > 15) value=value.slice(0, 15)"/>
                </template>
            </el-table-column>
            <!-- 可填写 -->
            <el-table-column label="预计日均辐照量(Wh/㎡)" prop="sDayForeRadiation" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input clearable size="small" v-model.number="scope.row.sDayForeRadiation" oninput="if(value.length > 15) value=value.slice(0, 15)"/>
                </template>
            </el-table-column>
            <!-- 预计月累计辐照量 必填 -->
            <el-table-column label="预计月累计辐照量(Wh/㎡)" prop="sMonthTotalRadiation" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input placeholder="请输入预计月累计辐照量" clearable size="small" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="scope.row.sMonthTotalRadiation" />
                </template>
            </el-table-column>
            <!--  -->
            <el-table-column label="月实际发电量(kWh)" prop="monthRealKwh" :show-overflow-tooltip="true">
                <template>
                    <span>0</span>
                </template>
            </el-table-column>
            <el-table-column label="日均实际辐照量(kWh)" prop="sDayRealAvgRadiation" :show-overflow-tooltip="true">
                <template>
                    <span>0</span>
                </template>
            </el-table-column>
            <el-table-column label="并网容量预计发电量(kWh)" prop="foreNetKwh" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input placeholder="请输入并网容量预计发电量" clearable size="small" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="scope.row.foreNetKwh" />
                </template>
            </el-table-column>
            <el-table-column align="wcb" label="发电量完成比" :show-overflow-tooltip="true">
                <template>
                    <el-progress color="#1AB394" :percentage="0"></el-progress>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { addPlan, calculation } from "@/api/runing/electr/planMonth";
export default {
    name: "planMonth",
    data() {
        let self = this;
        return {
            contractEndDate: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.form.contractBeginDate),
                                "day"
                            ) < 0
                    );
                },
            },
            //月计划id
            id: null,
            //table数据
            list: [],
            loading: false,
            // 总条数
            total: 0,
            // 弹出层标题
            title: "",
            // 弹出层
            open: true,
            //form表单
            form: {
                contractBeginDate: null,
                contractEndDate: null,
            },
            //time
            time: [],
            //是否保存
            submitType: true,
            // 表单校验
            rules: {
                contractBeginDate: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                contractEndDate: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                contractKwh: [
                    {
                        required: true,
                        message: "合同期电量不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "合同期电量必须为数字" },
                ],
                efficiencySim: [
                    {
                        required: true,
                        message: "模拟发电效率不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "模拟发电效率必须为数字" },
                ],
                protocolPercent: [
                    {
                        required: true,
                        message: "协议效能比不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "协议效能比必须为数字" },
                ],
                sRadioAvgYear: [
                    {
                        required: true,
                        message: "预计年均值辐照值不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "预计年均值辐照值必须为数字" },
                ],
            },
        };
    },
    methods: {
        //列表获取
        getList() {},
        //生成
        handleCreate() {
            if (!this.form.contractBeginDate && !this.form.contractEndDate) {
                return this.msgWarn("请选择开始时间和结束时间");
            } else {
                this.list = [];
                let monthList = this.getMonthBetween(
                    this.form.contractBeginDate,
                    this.form.contractEndDate
                );
                for (let index in monthList) {
                    this.list.push({
                        calendar: monthList[index],
                        forecastKwh: null, //月预计发电量
                        sMonthTotalRadiation: null, //预计月累计辐照量 主要是这个
                        sDayForeRadiation: null, //预计日均均辐照量
                        foreNetKwh: null, //并网容量预计发电量
                    });
                }
            }
        },
        //计算
        handleCalculation() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.list.length === 0) {
                        this.msgWarn("请先生成表单");
                    } else {
                        for (let item of this.list) {
                            if (!item.sMonthTotalRadiation) {
                                return this.msgError(
                                    "请将预计月累计辐照量填写完整"
                                );
                            }
                        }
                        let submit = {
                            contractCode: this.form.contractCode, //合同编号
                            contractBeginDate: this.form.contractBeginDate, //开始时间
                            contractEndDate: this.form.contractEndDate, //结束时间
                            sRadioAvgYear: this.form.sRadioAvgYear, //年均辐照量值
                            contractKwh: this.form.contractKwh, //合同电量
                            efficiencySim: this.form.efficiencySim, //模拟发电效率
                            protocolPercent: this.form.protocolPercent, //协议效能比
                            remark: this.form.remark,
                            monthList: this.list,
                        };
                        calculation(submit).then((res) => {
                            this.msgSuccess("计算成功");
                            this.list = res.data;
                        });
                    }
                }
            });
        },
        handleSubmit() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.list.length === 0) {
                        this.msgWarn("请先生成表单");
                    } else {
                        for (let item of this.list) {
                            if (!item.sMonthTotalRadiation) {
                                return this.msgError(
                                    "请将预计月累计辐照量填写完整"
                                );
                            }
                        }
                        let submit = {
                            contractCode: this.form.contractCode, //合同编号
                            contractBeginDate: this.form.contractBeginDate, //开始时间
                            contractEndDate: this.form.contractEndDate, //结束时间
                            sRadioAvgYear: this.form.sRadioAvgYear, //年均辐照量值
                            contractKwh: this.form.contractKwh, //合同电量
                            efficiencySim: this.form.efficiencySim, //模拟发电效率
                            protocolPercent: this.form.protocolPercent, //协议效能比
                            remark: this.form.remark,
                            monthList: this.list,
                        };
                        addPlan(submit).then((res) => {
                            this.msgSuccess("保存成功");
                            this.submitType = false;
                        });
                    }
                }
            });
        },
        //重置
        resetQuery() {
            this.form = {
                contractBeginDate: null,
                contractEndDate: null,
            };
            this.list = [];
        },
        //------[获取两个日期中所有的月份中]
        getMonthBetween(start, end) {
            var result = [];
            var s = start.split("-");
            var e = end.split("-");
            var min = new Date();
            var max = new Date();
            min.setFullYear(s[0], s[1]);
            max.setFullYear(e[0], e[1]);
            var curr = min;
            while (curr <= max) {
                var month = curr.getMonth();
                var str = curr.getFullYear() + "-" + month;
                var s = curr.getFullYear() + "-0";
                if (str == s) {
                    str = curr.getFullYear() + "-12";
                }
                result.push(str);
                curr.setMonth(month + 1);
            }
            for (let index in result) {
                if (index == 0) {
                    result[index] = start;
                } else if (index == result.length - 1) {
                    result[index] = end;
                } else {
                    result[index] = result[index] + "-01";
                }
            }
            return result;
        },
        changeStart(date) {
            this.form.contractEndDate = null;
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-progress-bar__outer {
    background-color: #ed5565;
}
</style>
