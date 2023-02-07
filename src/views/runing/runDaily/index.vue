<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form ref="queryParams" :model="queryParams" :inline="true" :rules="searchRules">
            <!-- <el-form-item label="所属电站" prop="stationIdList">
                <station-Checkbox :stations="queryParams.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item> -->
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small" :picker-options="endTime" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['runing:runDaily:add']">补录
                </el-button>
            </el-col>
            <!--
            <el-col :span="1.5">
                <el-button type="danger" v-if="false" plain icon="el-icon-delete" size="mini" @click="handleDeleteAll" :disabled="multiple" v-hasPermi="['runing:runDaily:submit']">删除
                </el-button>
            </el-col> -->
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" v-hasPermi="['runing:runDaily:downLoad']" @click="handleExport">导出
                </el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <span style="color: red; font-size: 13px">红色数值表示当日发电量过低</span>
        <el-table v-loading="loading" :data="list" >
<!--            <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" width="220" fixed />-->
            <el-table-column label="日报日期" width="110" prop="calendar" :show-overflow-tooltip="true" fixed />
            <el-table-column label="并网容量" prop="netInstallCapacity" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="运行天数" prop="runDays" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="天气" prop="actualWeather" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="当日发电量(kWh)" prop="dayKwh" :show-overflow-tooltip="true" width="100">
              <template slot-scope="scope">
                <span :class="rowClassName(scope)">{{scope.row.dayKwh}}</span>
              </template>
            </el-table-column>
            <el-table-column label="日MW发电量" prop="dayMwKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="当日辐照量(Wh/㎡)" prop="sDayRadiation" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="当日预计辐照量(Wh/㎡)" prop="sDayForeRadiation" :show-overflow-tooltip="true" width="100"/>
            <el-table-column label="有效发电小时数" prop="sElecHours" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="日发电效率" prop="sRatio" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="月并网容量预计发电量" prop="foreNetKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="月发电量" prop="monthKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="月完成比" prop="monthCompletePercent" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="本年计划完成比" prop="contractCompletePercent" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="合同发电量" prop="contractKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="累计发电量" prop="totalKwh" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="故障损失" prop="faultLoss" :show-overflow-tooltip="true" width="100" />
            <el-table-column label="非故障损失" prop="notFaultLoss" :show-overflow-tooltip="true" width="120" />
            <el-table-column prop="correctStatus" label="纠正状态" width="120" :formatter="statusFormat"></el-table-column>

            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleCheck(scope.row)" v-hasPermi="['runing:runDaily:search']">查看
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['runing:runDaily:edit']">纠正
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '1'" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['runing:runDaily:remove']">删除
                    </el-button>
                    <el-button v-if="scope.row.submitStatus === '1'" size="mini" type="text" icon="el-icon-plus" @click="handleSave(scope.row)" v-hasPermi="['runing:runDaily:submit']">提交
                    </el-button>
<!--                    <el-button v-if="scope.row.submitStatus === '2'" size="mini" type="text" icon="el-icon-message" @click="handlesave(scope.row)" v-hasPermi="['runing:runDaily:save']">发送邮件-->
<!--                    </el-button>-->
                    <el-button v-if="scope.row.submitStatus === '2'" size="mini" type="text" icon="el-icon-download" @click="handleDownload(scope.row)" v-hasPermi="['runing:runDaily:downLoad']">下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->
        <!-- 编辑/新增对话框 -->
        <AddDayDataDialog ref="AddDayDataDialog" :get-list="getList" />
        <!-- 编辑/新增对话框 -->
        <!-- 邮箱发送 -->
        <el-dialog style="margin-top:15vh" :close-on-press-escape="false" title="发送邮件" :visible.sync="emailOpen" width="500px" :close-on-click-modal="false" append-to-body :show-close="false">
            <el-form ref="formEmail" :model="formEmail" label-width="80px" :rules="emailRules" @submit.native.prevent>
                <el-form-item label="邮箱地址" prop="mailTo">
                    <el-input v-model="formEmail.mailTo" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">发 送</el-button>
                <el-button @click="emailClose">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 邮箱发送 -->
    </div>
</template>
<script>
import AddDayDataDialog from "@/views/components/OperationManagement/Solar/AddSolarDayDataDialog";
import { sendMail, getDayInfo } from "@/api/runing/runDaily/runDaily";
import {
    getDayDataList,
    deleteDayData,
    submitDayData,
} from "@/api/runing/OperationDayData";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "runDaily",
    components: {
        stationCheckbox,
        AddDayDataDialog,
    },
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.startTime),
                                "day"
                            ) < 0
                    );
                },
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: this.moment().format("yyyy-MM-01"),
                endTime: this.moment().format("yyyy-MM-DD"),
                stationIdList: [],
            },
            query: {},
            //table数据
            list: [],
            // 非多个禁用
            multiple: true,
            // 是否显示加载
            loading: false,
            // 总条数
            total: 0,

            // 发送邮件form表单
            formEmail: {},
            // 发送邮件弹窗显示
            emailOpen: false,
            // 发送邮件校验规则
            emailRules: {
                mailTo: [
                    {
                        required: true,
                        message: "邮箱地址不能为空",
                        trigger: "blur",
                    },
                    {
                        pattern:
                            /^[\da-z]+([\-\.\_]?[\da-z]+)*@[\da-z]+([\-\.]?[\da-z]+)*(\.[a-z]{2,})+$/i,
                        message: "请输入正确的邮箱地址",
                    },
                ],
            },
            visibleOptions: [],
            // 搜索校验规则
            searchRules: {
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.queryParams.stationIdList = [this.$store.getters.currentStation];
        this.$nextTick(() => {
            this.handleSearch();
        });
        this.getDicts("sys_runing_submit_status").then((response) => {
            this.visibleOptions = response.data;
        });
        // this.getList();
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        //列表获取
        getList() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.loading = true;
            getDayDataList(this.query).then((res) => {
                this.loading = false;
                this.list = res.rows;
                this.total = res.total;
            });
        },
        /**查询 */
        handleSearch() {
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
        /**重置 */
        resetQuery() {
            this.queryParams.startTime = this.moment().format("yyyy-MM-01");
            this.queryParams.endTime = this.moment().format("yyyy-MM-DD");
            this.getList();
        },
        /**时间选择 */
        changeDate(date) {
            this.queryParams.startTime = date[0];
            this.queryParams.endTime = date[1];
        },
        changeStart(date) {
            this.queryParams.endTime = null;
        },

        //查看
        handleCheck(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/runing/runDaily/info",
                query: {
                    row: row.id,
                    calendar: row.calendar,
                },
            });
        },
        //新增
        handleAdd() {
            this.$refs.AddDayDataDialog.addDayReport("日报补录");
        },
        // 编辑
        handleUpdate(row) {
            getDayInfo({ dayReportId: row.id, correctType: 1 }).then((res) => {
                this.$refs.AddDayDataDialog.editDayReport("日报纠正", res.data);
            });
        },
        //删除
        handleDelete(row) {
            this.$confirm("是否确认删除?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return deleteDayData(row.id);
                })
                .then(() => {
                    this.msgSuccess("删除成功");
                    this.getList();
                });
        },
        //提交
        handleSave(row) {
            this.$confirm("是否确认提交?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return submitDayData(row.id);
                })
                .then(() => {
                    this.msgSuccess("提交成功");
                    this.getList();
                });
        },

        /**导出 */
        handleExport() {
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.download(
                        "system/operationDayData/exportDayDataList",
                        {
                            ...this.queryParams,
                        },
                        `日报.xlsx`
                    );
                }
            });
        },
        //下载
        handleDownload(row) {
            this.download(
                "system/operationDayData/exportDayDataList",
                {
                    ...this.queryParams,
                    id: row.id,
                },
                `日报.xlsx`
            );
        },
        /**发送邮件 */
        handlesave(row) {
            this.emailOpen = true;
            this.formEmail = {};
            this.formEmail.dayId = row.id;
        },
        /**发送 */
        save() {
            this.$refs.formEmail.validate((valid) => {
                if (valid) {
                    sendMail(this.formEmail.mailTo, this.formEmail.dayId).then(
                        (res) => {
                            this.emailOpen = false;
                            this.msgSuccess("发送成功");
                        }
                    );
                }
            });
        },
        /**取消 */
        emailClose() {
            this.emailOpen = false;
            this.resetForm("formEmail");
        },
        // 显示状态字典翻译
        statusFormat(row, column) {
            if (row.menuType == "F") {
                return "";
            }
            return this.selectDictLabel(this.visibleOptions, row.correctStatus);
        },
        rowClassName(row) {
          if (row.row.isLessAvgHalf == 1) {
            return 'redware'
          } else {
            return ''
          }
        }
    },
};
</script>
<style>
.redware {
  background-color:red !important;
  color: white;
}
</style>
