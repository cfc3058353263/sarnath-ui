<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" label-width="90px" v-show="showSearch" :rules="rules">
            <el-form-item label="电站名称" prop="stationId">
                <station-search ref="station" :queryParams="queryParams" stationId="stationId" systemId="systemId"></station-search>
            </el-form-item>
            <el-form-item label="预警类型">
                <el-select v-model="queryParams.warningType" placeholder="请选择预警类型">
                    <el-option v-for="(item,index) of warningType" :key="index" :label="item.dictLabel" :value="item.dictSort"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" type="date" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker :disabled="!queryParams.startTime" v-model="queryParams.endTime" type="date" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleOpen">新增预警电站</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-s-promotion" size="mini" @click="handleOpen">发送服务配置</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-search" size="mini" @click="handleOpen">查看预警信息</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="所属电站" prop="stationName" :show-overflow-tooltip="true" width="200"/>
            <el-table-column label="日期" prop="createTime" :show-overflow-tooltip="true" width="200"/>
            <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="scope.row.isEnable == 0" size="mini" type="text" icon="el-icon-video-pause" @click="handleDelete(scope.row)">禁用
                    </el-button>
                    <el-button v-if="scope.row.isEnable == 1" size="mini" type="text" icon="el-icon-video-play" @click="handleDelete(scope.row)">启用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getList(false)" />
        <!-- 分页 -->
        <!-- 编辑/新增对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" width="600px" :close-on-click-modal="false" append-to-body :show-close="false" :title="title">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="所属电站" prop="stationId">
                            <station-search ref="station" :queryParams="form" stationId="stationId" systemId="systemId" style="width:100%"></station-search>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="预警类型" prop="warningType">
                            <el-select v-model="form.warningType" placeholder="请选择预警类型" style="width:100%">
                                <el-option v-for="(item,index) of warningType" :key="index" :label="item.dictLabel" :value="item.dictSort"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" maxlength="500" show-word-limit placeholder="请输入内容" v-model="form.remark">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">保 存</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 编辑/新增对话框 -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import { getdictList } from "@/api/utils";
import { getList,addWain,updateWain,changeType } from "@/api/maintain/yearWain";
export default {
    name: "yearWain",
    components: {
        StationSearch,
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
            showSearch: true,
            loading: false,
            total: 0,
            warningType: [],
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: "",
                endTime: "",
                stationId: null,
                systemId: null,
            },
            query: {},
            dataList: [],
            open: false,
            form: {
                stationId: null,
                systemId: null,
                warningType:null,
                remark:null
            },
            title:"",
            rules: {
                stationId: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                warningType: [
                    {
                        required: true,
                        message: "预警类型",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        getdictList("warning_Type").then((res) => {
            this.warningType = res.data;
        });
        // this.$nextTick(() => {
        //     this.search();
        // });
    },
    methods: {
        /**获取设备列表 */
        getList() {
            this.loading = true;
            getList(this.query).then((res) => {
                this.dataList = res.data.rows;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /**查询 */
        search() {
            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    this.query = JSON.parse(JSON.stringify(this.queryParams));
                    this.getList();
                }
            });
        },
        /**新增 */
        handleOpen() {
            this.open = true;
            this.title = "新增"
        },
        /**提交 */
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.title === "编辑") {
                        updateWain(this.form).then(res=>{
                            this.cancel()
                            this.getList();
                        })
                    } else {
                        addWain(this.form).then((res) => {
                            this.cancel()
                            this.getList();
                        });
                    }
                }
            });
        },
        /**取消 */
        cancel() {
            this.open = false;
            this.form = {}
            this.resetForm("form");
            this.$refs.form.resetFields();
            this.$refs.station.stationName = null
        },
        handleUpdate(row){
            this.open = true;
            this.title = "编辑";
            this.form = row
            this.$nextTick(()=>{
                this.$refs.station.stationName = row.stationId
            })
        },
        handleDelete(row) {
            this.$confirm("是否执行此操作?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return changeType(row.id);
                })
                .then(() => {
                    this.msgSuccess("更新成功");
                    this.getList();
                });
        },
        /**时间选择 */
        changeStart(date) {
            this.queryParams.endTime = null;
        },
    },
};
</script>

<style>
</style>