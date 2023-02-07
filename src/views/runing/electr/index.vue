<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :inline="true" :rules="rules">
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="form.startTime" @change="changeStart" size="small" type="date" style="margin-right:10px;" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="form.endTime" size="small" :picker-options="endTime" type="date" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['runing:electr:add']">新增合同</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="合同编号" prop="contractCode" :show-overflow-tooltip="true" />
            <el-table-column label="合同开始时间" prop="contractBeginDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.contractBeginDate).format("YYYY-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="合同结束时间" prop="contractEndDate" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ moment(scope.row.contractEndDate).format("YYYY-MM-DD") }}</span>
                </template>
            </el-table-column>
            <el-table-column label="模拟发电效率(%)" prop="efficiencySim" :show-overflow-tooltip="true" />
            <el-table-column label="效益效能比(%)" prop="protocolPercent" :show-overflow-tooltip="true" />
            <el-table-column label="预计年均辐照值(Wh/㎡)" prop="sRadioAvgYear" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getPlanMomthList" />
        <!-- 分页 -->
    </div>
</template>
<script>
import { planMonthList } from "@/api/runing/electr/planMonth";
export default {
    name: "electr",
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(self.moment(self.form.startTime), "day") < 0
                    );
                },
            },
            //分页查询
            queryParams: {},
            total: 0,
            list: [],
            form: {
                pageNum: 1,
                pageSize: 15,
                startTime: null,
                endTime: null,
            },
            showSearch: true,
            loading: false,
            // 表单校验
            rules: {},
        };
    },
    created() {
        this.$nextTick(() => {
            this.getList();
        });
    },
    methods: {
        /**查询 */
        getList() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.queryParams = JSON.parse(JSON.stringify(this.form));
                    this.getPlanMomthList();
                }
            });
        },
        /**分页 */
        getPlanMomthList() {
            this.loading = true;
            planMonthList(this.queryParams).then((res) => {
                if (res.code === 200) {
                    this.loading = false;
                    this.list = res.rows;
                    this.total = res.total;
                }
            });
        },
        /**重置 */
        resetQuery() {
            this.form = {};
        },
        /**新增 */
        handleAdd() {
            this.$router.push({
                path: this.$store.getters.routerPrefix + '/runing/electr/planMonth',
            });
        },
        //编辑
        handleUpdate(row) {
            this.$router.push({
                path: this.$store.getters.routerPrefix + '/runing/electr/monthUpdate',
                query: {
                    id: row.id,
                },
            });
        },
        changeStart(date) {
            this.form.endTime = null;
        },
    },
};
</script>
<style scoped>
</style>
