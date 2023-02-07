
<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form ref="queryParams" :model="queryParams" :inline="true" :rules="searchRules">
            <el-form-item label="所属电站">
                <el-input v-model="stationName" disabled></el-input>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="true" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime" label="结束时间">
                <el-date-picker v-model="queryParams.endTime" :clearable="true" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
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
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleOpen('增加')">添加并网容量记录</el-button>
            </el-col>
<!--            <el-col :span="1.5">-->
<!--                <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleOpen('减少')">减少装机容量</el-button>-->
<!--            </el-col>-->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="list">
            <el-table-column label="所属电站" prop="stationName" :show-overflow-tooltip="true" />
            <el-table-column label="日期" prop="netTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{moment(scope.row.netTime).format('YYYY-MM-DD')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="增并容量/MW" prop="netCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="装机容量/MW" prop="stationInstallCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="实际并网容量/MW" prop="stationCapacity" :show-overflow-tooltip="true" />
            <el-table-column label="状态" prop="status" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.netType === 1?"增加":"减少" }}</span>
                </template>
            </el-table-column>
            <el-table-column label="完全并网状态" prop="status" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{ scope.row.gridConnectionFlag == 1 ?"未完全并网":"已完全并网" }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-search" @click="handleCheck(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 编辑/新增对话框 -->
        <el-dialog :close-on-press-escape="false" :visible.sync="open" width="600px" :close-on-click-modal="false" append-to-body :show-close="false" :title="title">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="所属电站" label-width="150px">
                            <el-input v-model.number="stationName" disabled style="width: 100%" maxlength="15"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="实际并网容量" label-width="150px" prop="stationCapacity">
                            <el-input v-model.number="form.stationCapacity" style="width: 100%"  oninput="if(value.length > 15) value=value.slice(0, 15)" type="number">
                                <template slot="append">MW</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时间" label-width="150px" prop="netTime">
                            <el-date-picker style="width: 100%" type="date" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.netTime">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item prop="gridConnectionFlag">
                        <el-switch
                          v-model="form.gridConnectionFlag"
                          active-color="#13ce66"
                          active-text="是否完全并网，开启此项以【取消】按照【实际装机容量/设计装机容量】对【预计发电量】的折算"
                          :active-value="0"
                          :inactive-value="1">
                        </el-switch>
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
import {
    getStationCapacityList,
    getCapacityListAdd,
    getCapacityListDelete,
    getCapacityListUpdate
} from "@/api/system/station";
import { valiNumberFloat } from "@/utils/rules"
export default {
    name: "capacity",
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
            stationId:"",
            stationName: "",
            title: "增加",
            showSearch: true,
            loading: false,
            open: false,
            form: {
                netType: null,
                stationCapacity: null,
                netTime: null,
                gridConnectionFlag: null,
            },
            queryParams: {
                pageNum: 1,
                pageSize: 15,
                startTime: null,
                endTime: null,
            },
            query: {},
            list: [],
            rules: {
                stationCapacity: [
                    {
                        required: true,
                        message: "装机容量不能为空",
                        trigger: "blur",
                    }
                ],
                netTime: [
                    {
                        required: true,
                        message: "时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
            searchRules: {
                // startTime: [
                //     {
                //         required: true,
                //         message: "开始时间不能为空",
                //         trigger: "blur",
                //     },
                // ],
                // endTime: [
                //     {
                //         required: true,
                //         message: "结束时间不能为空",
                //         trigger: "blur",
                //     },
                // ],
            },
        };
    },
    created() {
        let row = JSON.parse(this.$route.query.row);
        this.stationName = row.stationName;
        this.queryParams.stationId = row.stationId;
        this.queryParams.systemId = row.systemId;
        this.stationId = row.stationId;
        this.form.stationId = row.stationId;
        this.$nextTick(() => {
            this.handleSearch();
        });
    },
    methods: {
        //查询
        handleSearch() {
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.query = JSON.parse(JSON.stringify(this.queryParams));
                    this.getList();
                }
            });
        },
        //重置
        resetQuery() {},
        //打开
        handleOpen(str) {
            this.open = true;
            this.title = str;
            if (str === "增加") {
                this.form.netType = 1;
            } else if (str === "减少") {
                this.form.netType = 2;
            }
        },
        getList() {
            getStationCapacityList(this.query).then((res) => {
                this.list = res.data;
            });
        },
        //取消
        cancel() {
            this.open = false;
            this.resetForm("form");
            this.form ={

            };
            this.$refs.form.resetFields();
        },
        //保存
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.stationId = this.stationId;
                    if (this.title === "编辑") {
                        getCapacityListUpdate(this.form).then(res=>{
                            this.open = false;
                            this.form = {}
                            this.getList();
                        })
                    } else {
                        getCapacityListAdd(this.form).then((res) => {
                            this.open = false;
                            this.form = {}
                            this.getList();
                        });
                    }
                }
            });
        },
        handleCheck(row) {
            this.handleOpen("编辑");
            this.form =  Object.assign({},row);
        },
        handleDelete(row) {
            this.$confirm("是否确认删除?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return getCapacityListDelete(row.id);
                })
                .then(() => {
                    this.msgSuccess("删除成功");
                    this.getList();
                });
        },
        changeStart(date) {
            this.queryParams.endTime = null;
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep input[type=number] {
    -moz-appearance:textfield;
}
::v-deep input[type=number]::-webkit-inner-spin-button,::v-deep input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
