<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :rules="rules" :inline="true" ref="form" :model="form" label-width="80px">
            <el-form-item label-width="200px" label="合同编号">
                <el-input placeholder="请输入合同编号" clearable size="small" maxlength="50" v-model="form.contractCode" />
            </el-form-item>

            <el-form-item prop="contractBeginDate" label="开始时间" label-width="150px">
                <el-date-picker disabled v-model="form.contractBeginDate" :clearable="false" size="small" style="width:215px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="contractEndDate" label="结束时间" label-width="150px">
                <el-date-picker disabled v-model="form.contractEndDate" :clearable="false" size="small" style="width:215px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="contractKwh" label-width="150px" label="合同期电量(kWh)">
                <el-input disabled placeholder="请输入合同期电量" clearable size="small" v-model.number="form.contractKwh" />
            </el-form-item>
            <el-form-item prop="sRadioAvgYear" label-width="200px" label="预计年均值辐照值(Wh/㎡)">
                <el-input disabled placeholder="请输入预计年均值辐照值" clearable size="small" v-model.number="form.sRadioAvgYear" />
            </el-form-item>
            <!--  -->
            <el-form-item prop="protocolPercent" label-width="150px" label="协议效能比">
                <el-input placeholder="请输入协议效能比" clearable size="small" style="width:215px" oninput="if(value.length > 15) value=value.slice(0, 15)" v-model.number="form.protocolPercent" />
            </el-form-item>
            <el-form-item prop="efficiencySim" label-width="150px" label="模拟发电效率">
                <el-input placeholder="请输入模拟发电效率" clearable style="width:215px" oninput="if(value.length > 15) value=value.slice(0, 15)" size="small" v-model.number="form.efficiencySim" />
            </el-form-item>
            <!--  -->
            <el-form-item label="备注" label-width="150px">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" maxlength="500" type="textarea" v-model="form.remark" placeholder="" clearable size="small" style="width: 500px" />
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-success" size="mini" @click="handleCalculation">计算</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-edit" size="mini" v-hasPermi="['runing:electr:edit']" @click="handleUpdate">确认修改</el-button>
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
            </el-table-column>
            <el-table-column label="日均实际辐照量(kWh)" prop="sDayRealAvgRadiation" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="并网容量预计发电量(kWh)" prop="foreNetKwh" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-input placeholder="" clearable size="small" v-model.number="scope.row.foreNetKwh" oninput="if(value.length > 15) value=value.slice(0, 15)" />
                </template>
            </el-table-column>
            <el-table-column align="wcb" label="发电量完成比" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-progress color="#1AB394" :percentage="scope.row.powerRatio"></el-progress>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { addPlan, getPlan, calculation } from "@/api/runing/electr/planMonth";
export default {
    name: "monthUpdate",
    data() {
        let self = this;
        return {
            pickerOptions: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(self.moment(), "days") < 0
                    );
                },
            },
            //合同id
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
            form: {},
            //time
            time: [],
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
    created() {
        this.id = this.$route.query.id;
        this.getList(this.id);
    },
    methods: {
        //列表获取
        getList(cId) {
            this.loading = true;

            getPlan(cId).then((res) => {
                this.form = {
                    id: res.data.id,
                    contractCode: res.data.contractCode, //合同编号
                    contractBeginDate: res.data.contractBeginDate, //开始时间
                    contractEndDate: res.data.contractEndDate, //结束时间
                    sRadioAvgYear: res.data.sRadioAvgYear, //年均辐照量值
                    contractKwh: res.data.contractKwh, //合同电量
                    efficiencySim: res.data.efficiencySim, //模拟发电效率
                    protocolPercent: res.data.protocolPercent, //协议效能比
                    remark: res.data.remark,
                };
                this.list = res.data.monthList;
                this.loading = false;
            });
        },
        //计算
        handleCalculation() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    for (let item of this.list) {
                        if (!item.sMonthTotalRadiation) {
                            return this.msgError(
                                "请将预计月累计辐照量填写完整"
                            );
                        }
                    }
                    for (let item of this.list) {
                        if (item.foreNetKwh == null) {
                            return this.msgError(
                              "请将并网容量预计发电量填写完整"
                            );
                        }
                    }
                    let submit = {
                        ...this.form,
                        monthList: this.list,
                    };
                    calculation(submit).then((res) => {
                        this.msgSuccess("计算成功");
                        this.list = res.data;
                    });
                }
            });
        },
        //编辑
        handleUpdate() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    for (let item of this.list) {
                        if (!item.sMonthTotalRadiation) {
                            return this.msgError(
                                "请将预计月累计辐照量填写完整"
                            );
                        }
                    }
                    for (let item of this.list) {
                        if (item.foreNetKwh == null) {
                            return this.msgError(
                              "请将并网容量预计发电量填写完整"
                            );
                        }
                    }
                    let self = this;
                    this.$confirm("是否确认修改?", "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(function () {
                            let data = { ...self.form, monthList: self.list };
                            return addPlan(data);
                        })
                        .then(() => {
                            this.msgSuccess("修改成功");
                        });
                }
            });
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .el-progress-bar__outer {
    background-color: #ed5565;
}
::v-deep .el-input.is-disabled .el-input__inner {
    color: #152d5d;
}
::v-deep .el-input__inner {
    color: #000;
    border: 0.5px solid #000;
}
</style>
