<template>
    <div class="app-container">
        <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="80px">
            <el-form-item label="所属电站">
                <station-Checkbox :stations="form.stationIdList" @getStations="getStations"></station-Checkbox>
            </el-form-item>
            <el-form-item prop="weekNum" label="发令人">
                <el-select v-model="form.weekNum" style="width:300px">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="weekNum" label="收令人">
                <el-select v-model="form.weekNum" style="width:300px">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="weekNum" label="执行人">
                <el-select v-model="form.weekNum" style="width:300px">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="weekNum" label="监护人">
                <el-select v-model="form.weekNum" style="width:300px">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="weekNum" label="值长">
                <el-select v-model="form.weekNum" style="width:300px">
                    <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="weekNum" label="操作票">
                <el-input v-model="form.weekNum" placeholder="" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleAdd" v-hasPermi="['runing:runWeekly:download']">添加工作票</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getListWeek"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="操作票名称" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="单位" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="发令人" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="收令人" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="执行人" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="监护人" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column label="值长" prop="weekTitle" :show-overflow-tooltip="true" />
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDownLoad(scope.row)">下载</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getListWeek" />
    </div>
</template>
<script>
import { getWeekDataList } from "@/api/runing/runWeekly/runWeekly";
import stationCheckbox from "@/views/components/stationCheckbox";

export default {
    name: "runWeekly",
    components: {
        stationCheckbox,
    },
    data() {
        return {
            week: [
                { label: "曾多次", value: 1 },
                { label: "曾多次", value: 2 },
                { label: "曾多次", value: 3 },
                { label: "曾多次", value: 4 },
                { label: "曾多次", value: 5 },
            ],
            // stations: [], //所属电站
            form: {
                endTime: this.moment().format("YYYY-MM-DD"),
                weekNum: 1,
                pageNum: 1,
                pageSize: 15,
                stationIdList: [],
            },
            query: {},
            list: [],
            showSearch: true,
            loading: false,
            // 总条数
            total: 0,
            rules: {
                endTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
                weekNum: [
                    {
                        required: true,
                        message: "周数不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.form.stationIdList = [this.$store.getters.currentStation];
    },
    methods: {
        /**获取你已选中的电站 */
        getStations(res) {
            this.form.stationIdList = res;
        },
        handleAdd() {
            this.$router.push({
                path:this.$store.getters.routerPrefix + "/twovotes/workTicket/info",
            });
        },
        handleWeekSee(row) {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix + "/runing/runWeekly/info",
                query: {
                    row: JSON.stringify({
                        stationId: row.stationId,
                        startTime: row.weekStartTime,
                        endTime: row.weekEndTime,
                    }),
                },
            });
        },
    },
};
</script>
<style scoped>
</style>

