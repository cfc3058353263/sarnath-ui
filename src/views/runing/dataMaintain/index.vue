<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="日报日期" prop="calendar">
                <el-date-picker clearable v-model="queryParams.calendar" type="date" value-format="yyyy-MM-dd" placeholder="请选择日报日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="提交时间" prop="submitTime">
                <el-date-picker clearable v-model="queryParams.submitTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择提交时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="correctList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="日报日期" align="center" prop="calendar" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.calendar, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="旧实际天气" align="center" prop="oldActualWeather" />
            <el-table-column label="旧发电量" align="center" prop="oldDayKwh" />
            <el-table-column label="旧辐照量" align="center" prop="oldSDayRadiation" />
            <el-table-column label="新实际天气" align="center" prop="newActualWeather" />
            <el-table-column label="新日发电量" align="center" prop="newDayKwh" />
            <el-table-column label="新日辐照量" align="center" prop="newSDayRadiation" />
            <el-table-column prop="submitStatus" label="状态" :formatter="statusFormat"></el-table-column>
            <el-table-column label="纠正类型" prop="correctType" :show-overflow-tooltip="true" >
                  <template slot-scope="scope">
                      <span>{{scope.row.correctType == 1? "纠正" : "补录"}}</span>
                  </template>
            </el-table-column>
            <!-- <el-table-column label="提交状态: 1未提交，2已提交，3审核通过，4审核不通过" align="center" prop="submitStatus" /> -->
            <!-- <el-table-column label="审核时间" align="center" prop="reviewTime" width="180"> -->
            <!-- <el-table-column label="纠正原因" align="center" prop="correctReason" />
            <el-table-column label="纠正类型：1纠正，2补录" align="center" prop="correctType" />
            <el-table-column label="提交时间" align="center" prop="submitTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.submitTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核意见" align="center" prop="  " />
            <el-table-column label="审核人" align="center" prop="reviewUserId" />
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.reviewTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.submitStatus !== 3 && scope.row.submitStatus !== 4" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row,3)">通过</el-button>
                    <el-button size="mini" v-if="scope.row.submitStatus !== 3 && scope.row.submitStatus !== 4" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row,4)">不通过</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="审核意见" prop="reviewComments">
                    <el-input v-model="form.reviewComments" placeholder="请输入内容" type="textarea" :rows="3" maxlength="5000"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="open = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listCorrect,
    getCorrect,
    delCorrect,
    addCorrect,
    updateCorrect,
    getReview,
} from "@/api/runing/dataMaintain";

export default {
    name: "Correct",
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
            // 运行日报纠正表格数据
            correctList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            // 表单参数
            form: {
                stationId: null,
            },
            visibleOptions: [],
            // 表单校验
            rules: {
                reviewComments: [
                    {
                        required: true,
                        message: "审核意见不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.stationId = this.$store.getters.currentStation;
        this.getList();
        this.getDicts("sys_runing_submit_status").then((response) => {
            this.visibleOptions = response.data;
        });
    },
    methods: {
        /** 查询运行日报纠正列表 */
        getList() {
            this.loading = true;
            listCorrect(this.queryParams).then((response) => {
                this.correctList = response.rows;
                this.total = response.total;
                this.loading = false;
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
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加运行日报纠正";
        },
        /** 修改按钮操作 */
        handleUpdate(row, id) {
            this.title = "审核意见";
            this.form = row;
            // this.form.submitStatus = id
            if (id == 4) {
                this.open = true;
            } else {
                this.$modal
                    .confirm(
                        '是否确认审核通过该天日报？'
                    )
                    .then(() => {
                        this.form.reviewComments = "审核通过";
                        return getReview({ ...this.form, submitStatus: 3 })
                    })
                    .then(() => {
                        this.getList();
                        this.$modal.msgSuccess("审核通过");
                    })
                    .catch(() => {});
                // this.form.reviewComments = "审核通过";
                // getReview({ ...this.form, submitStatus: id }).then((res) => {
                //     this.$modal.msgSuccess("审核通过");
                //     this.open = false;
                //     this.getList();
                // });
            }
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    getReview({ ...this.form, submitStatus: 4 }).then((res) => {
                        this.$modal.msgSuccess("审核未通过");
                        this.open = false;
                        this.getList();
                    });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(
                    '是否确认删除运行日报纠正编号为"' + ids + '"的数据项？'
                )
                .then(function () {
                    return delCorrect(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "system/correct/export",
                {
                    ...this.queryParams,
                },
                `correct_${new Date().getTime()}.xlsx`
            );
        },
        // 显示状态字典翻译
        statusFormat(row, column) {
            if (row.menuType == "F") {
                return "";
            }
            return this.selectDictLabel(this.visibleOptions, row.submitStatus);
        },
    },
};
</script>