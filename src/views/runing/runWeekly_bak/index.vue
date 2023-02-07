<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" :inline="true">
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker size="small" @change="getStartTime" value-format="yyyy-MM-dd" v-model="form.startTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker size="small" value-format="yyyy-MM-dd" :picker-options="endWeek" v-model="form.endTime" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['runing:runWeekly:download']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getListWeek"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="周报时间" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.startTime }}</span>
                    <span>至</span>
                    <span>{{ scope.row.endTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="周发电量(kWh)" prop="powerRealWeek" :show-overflow-tooltip="true" />
            <el-table-column label="预计日均辐照量(Wh/㎡)" prop="powerPlanIrradiationWeek" :show-overflow-tooltip="true" />
            <el-table-column label="日均实际辐照量(Wh/㎡)" prop="powerRealIrradiationWeek" :show-overflow-tooltip="true" />
            <el-table-column label="周利用小时数(h)" prop="powerEmployWeek" :show-overflow-tooltip="true" />
            <el-table-column label="周故障损失电量(kWh)" prop="powerLossWeek" :show-overflow-tooltip="true" />
            <el-table-column label="周非故障损失电量(kWh)" prop="powerNoLossWeek" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownLoad(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getListWeek" />
        <!-- 分页 -->
    </div>
</template>
<script>
import { getList } from "@/api/runing/runWeekly/runWeekly";
export default {
    name: "runWeekly",
    data() {
        let self = this;
        let e = null;
        return {
            startWeek: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            endWeek: {
                disabledDate(time) {
                    let t = self.moment(time.getTime()).format("yyyy-MM-DD"); //所有
                    let s = self.moment(self.form.startTime).format("yyyy-MM-DD"); //开始
                    let nextE = self.moment(s).add(6, "days").format("yyyy-MM-DD"); //第一个7天时间
                    if(nextE === t){
                        return false;
                    }
                    return (
                        self.moment(t).diff(self.moment(nextE), "days") < 0
                        ||
                         self.moment(t).diff(self.moment(nextE), "days") % 7 !== 0
                        )
                },
            },
            list: [],
            time: [],
            form: {
                currentPage: 1,
                size: 15,
                startTime: null,
                endTime: null,
            },
            query:{},
            showSearch: true,
            loading: false,
            // 总条数
            total: 0,
            rules: {
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
    methods: {
        getList() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.query = JSON.parse(JSON.stringify(this.form));
                    this.getListWeek();
                }
            });
        },
        getListWeek(){
            if(!this.query.startTime){
                return 
            }
            this.loading = true;
            getList(this.query).then((res) => {
                this.loading = false;
                this.list = res.data.records;
                this.total = res.data.total;
            }).catch(err=>{
                this.loading = false;
            })
        },
        /**下载 */
        handleDownLoad(row) {
             this.download(
                        "system/operationPlanDay/exportWeek",
                        {
                            ...this.form,id:row.id
                        },
                        `周报.xlsx`
                    );
        },
        /**查看 */
        handleWeekSee(row) {
            this.$router.push({
                name: "weeklyInfo",
                query: {
                    row: JSON.stringify(row),
                },
            });
        },
        /**清空结束时间 */
        getStartTime() {
            this.form.endTime = null;
        },
        /**导出 */
        handleExport() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.download(
                        "system/operationPlanDay/exportWeek",
                        {
                            ...this.form,
                        },
                        `周报.xlsx`
                    );
                }
            });
        },
    },
};
</script>
<style scoped>
</style>