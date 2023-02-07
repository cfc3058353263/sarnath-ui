<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" :rules="searchRules" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
            <el-form-item prop="startTime" label="工器具名称">
                <el-input v-model="queryParams.searchValue" placeholder="请填写工器具名称" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="检验结论" prop="testStatus">
                <el-select v-model="queryParams.status" style="width: 100%">
                    <el-option v-for="item in testStatus" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startDate" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endDate" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary " icon="el-icon-plus" v-hasPermi="['assets:tools:toolsCheck:check']" size="mini" @click="handleAdd">安全工器具送检</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger " icon="el-icon-delete" v-hasPermi="['assets:tools:toolsCheck:check']" size="mini" @click="handleRemoveList">删除</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮 -->
        <!-- table -->
        <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="所属电站" prop="stationName" :show-overflow-tooltip="true" width="220" />
            <el-table-column label="安全工具名称" prop="toolsName" :show-overflow-tooltip="true" />
            <el-table-column label="安全工具规格" prop="toolsSpecs" :show-overflow-tooltip="true" />
            <el-table-column label="安全工具编号" prop="toolsCode" :show-overflow-tooltip="true" />
            <el-table-column label="检测单位" prop="testCompany" :show-overflow-tooltip="true" />
            <el-table-column label="检验日期" prop="testTime" :show-overflow-tooltip="true" />
            <el-table-column label="送检人" prop="testUser" :show-overflow-tooltip="true" />
            <el-table-column label="检验结论" prop="testStatus" :show-overflow-tooltip="true" />
            <el-table-column label="上传检测资料" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <img :src="scope.row.testUrl" min-width="30" height="30" @click="preView(scope.row.testUrl)" />
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleRemove(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        <!-- 分页 -->
        <el-dialog :visible.sync="dialogVisible" style="text-align: center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import stationCheckbox from "@/views/components/stationCheckbox";
import { getList, deleteList } from "@/api/assets/tools/toolsCheck";
export default {
    name: "toolsCheck",
    components: {
        stationCheckbox,
    },
    data() {
        let self = this;
        return {
            // 结束时间不能选择开始时间前的日期
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
            //检测结论
            testStatus: [
                { value: "1", label: "已通过" },
                { value: "2", label: "未通过" },
            ],
            //多选框
            ids: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                status: "",
                searchValue: "",
                startDate: null,
                endDate: null,
            },
            query: {},
            // 表单参数
            form: {},
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            // 图片预览
            dialogImageUrl: "",
            //图片遮罩层
            dialogVisible: false,
            // 搜索表单校验
            searchRules: {
                stationIdList: [
                    {
                        type: "array",
                        required: true,
                        message: "请至少选择一个电站",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    created() {
        // this.query = JSON.parse(JSON.stringify(this.queryParams));
        // this.getList();
        this.search();
    },
    methods: {
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 15,
                status: "",
                searchValue: "",
                startDate: null,
                endDate: null,
            };
        },
        /**获取你已选中的电站 */
        getStations(res) {
            this.queryParams.stationIdList = res;
        },
        //
        search() {
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.getList();
        },
        getList() {
            this.loading = true;
            getList(this.query).then((res) => {
                this.list = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        changeStart(date) {
            this.queryParams.endDate = null;
        },
        // 删除
        handleRemove(row) {
            this.ids = [row.id];
            deleteList(this.ids).then((res) => {
                if (res.data) {
                    this.msgSuccess(res.msg);
                    this.getList();
                } else {
                    this.msgError(res.msg);
                }
            });
        },
        //新增
        handleAdd() {
            this.$router.push({
                path:
                    this.$store.getters.routerPrefix +
                    "/assets/toolsCheck/inspection",
            });
        },
        /** 预览 */
        preView(imgUrl) {
            this.dialogImageUrl = imgUrl;
            this.dialogVisible = true;
        },
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.id);
        },
        handleRemoveList() {
            deleteList(this.ids).then((res) => {
                if (res.data) {
                    this.msgSuccess(res.msg);
                    this.getList();
                } else {
                    this.msgError(res.msg);
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.el-table ::v-deep tbody tr:hover > td {
    background-color: transparent;
}
</style>
