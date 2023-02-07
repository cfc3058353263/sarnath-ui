<template>
    <div class="app-container">
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:code:add']">新增</el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table v :data="data" style="width: 100%">
            <el-table-column prop="typeName" label="邮件类型" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="cronName" label="周期" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="menuCode" label="任务状态" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{status[scope.row.status]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="text" icon="el-icon-search" @click="handleSearch(scope.row)">查看</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" v-if="scope.row.status==1" type="text" icon="el-icon-circle-close" @click="handleStop(scope.row)">停用</el-button>
                    <el-button size="mini" v-if="scope.row.status==2" type="text" icon="el-icon-circle-check" @click="handlecheck(scope.row)">启用</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- table -->
        <!-- 新增 -->
        <el-dialog :close-on-press-escape="false" width="600px" :visible.sync="open" :close-on-click-modal="false" append-to-body :title="title">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-row :gutter=10>
                    <el-col :span="12">
                        <el-form-item label="启用周期" prop="cron">
                            <el-select :disabled="title=='编辑'" placeholder="请选择启用周期" clearable v-model="form.cron" style="width:100%">
                                <el-option v-for="item,index in cronMail" :key="index" :label="item.dictLabel" :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="启用类型" prop="type">
                            <el-select :disabled="title=='编辑'" placeholder="请选择启用类型" clearable v-model="form.type" style="width:100%">
                                <el-option v-for="item,index in cronType" :key="index" :label="item.dictLabel" :value="item.dictValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter=10>
                <el-col :span="24">
                        <el-form-item label="收件人" prop="userId">
                            <el-select filterable v-model="form.userId" placeholder="请选择接受用户" multiple style="width:100%" @change="onChange">
                                <el-option v-for="item,index in userList" :key="index" :label="item.nickName+'('+(item.email==null ? '无' :item.email)+')'" :value="item.userId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    </el-row>
            </el-form>
            <el-table v-if="title=='编辑'" :data="dataDetail" style="width: 100%">
                <el-table-column align="center" prop="nickName" label="收件人" :show-overflow-tooltip="true" />
                <el-table-column align="center" prop="email" label="邮箱" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <pagination v-if="title=='编辑'" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[7]" @pagination="getList" />
            <div  slot="footer"  class="dialog-footer">
                <el-button type="primary" @click="comfir">确 定</el-button>
                <el-button @click="open=false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
        <!-- 查看 -->
        <el-dialog :close-on-press-escape="false" width="600px" :visible.sync="openSearch" :close-on-click-modal="false" append-to-body title="新增">
            <el-table v :data="dataDetail" style="width: 100%">
                <el-table-column align="center" prop="nickName" label="收件人" :show-overflow-tooltip="true" />
                <el-table-column align="center" prop="email" label="邮箱" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[7]" @pagination="getList" />
        </el-dialog>
        <!-- 查看 -->
    </div>
</template>

<script>
import {
    crontabList,
    getUserList,
    cronMailAdd,
    cronMailupdate,
    cronMailStart,
    cronMailEnd,
    cronMailDelete,
    getCronMailDetail,
} from "@/api/system/email";
import { getdictList } from "@/api/utils";
import topSearch from "@/views/components/TopSearch";
import axios from "axios";

export default {
    name: "email",
    components: {
        topSearch,
    },
    data() {
        return {
            data: [],
            open: false,
            openSearch: false,
            total: 0,
            title: "",
            queryParams: {
                currentPage: 1,
                size: 7,
                id: 8,
            },
            form: {},
            //用户列表
            userList: [],
            //用户id列表
            userId: [],
            //定时类型
            cronType: [],
            //定时周期
            cronMail: [],
            //详情
            dataDetail: [],
            //状态
            status: {
                1: "已启用",
                2: "未启用",
            },
            rules: {
                cron: [
                    {
                        required: true,
                        message: "启用周期不能为空",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "启用类型不能为空",
                        trigger: "blur",
                    },
                ],
                userId: [
                    {
                        type: "array",
                        required: true,
                        message: "收件人不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        axios
            .all([
                getdictList("cron_type"),
                getdictList("cron_mail"),
                getUserList(),
            ])
            .then(
                axios.spread((cronType, cronMail, userList) => {
                    this.cronType = cronType.data; //类型
                    this.cronMail = cronMail.data; //周期
                    this.userList = userList; //用户
                    this.getList();
                })
            );
    },
    methods: {
        /**列表 */
        getList() {
            crontabList().then((res) => {
                this.data = res.data;
            });
        },
        /**下拉多选 */
        onChange(value) {
            let userIdAndMail = [];
            for (let list of this.userList) {
                for (let item of value) {
                    if (item == list.userId) {
                        userIdAndMail.push({
                            mail: list.email,
                            userId: list.userId,
                        });
                    }
                }
            }
            this.form.userIdAndMail = userIdAndMail;
        },
        /**新增 */
        handleAdd() {
            this.form = {
                userId: [],
            };
            // this.userId = [];
            this.title = "新增";
            this.open = true;
        },
        /**确认 */
        comfir() {
            if (this.title === "新增") {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        cronMailAdd(this.form).then((res) => {
                            if (res.code === 200) {
                                this.msgSuccess("添加成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    }
                });
            } else {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        cronMailupdate(this.form.id, this.form).then((res) => {
                            if (res.code == 200) {
                                this.msgSuccess("编辑成功");
                                this.handleSearch(this.form);
                            }
                        });
                    }
                });
            }
        },
        /** 停用*/
        handleStop(row) {
            // cronMailEnd
            this.$confirm("是否确认停用当前任务?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return cronMailEnd(row.id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("停用成功");
                });
        },
        /** 启用*/
        handlecheck(row) {
            this.$confirm("是否确认启用当前任务?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return cronMailStart(row.id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("启动成功");
                });
        },
        /** 删除*/
        handleDelete(row) {
            this.$confirm("是否确认删除当前任务?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return cronMailDelete(row.id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
        /**查看 */
        handleSearch(row) {
            // this.openSearch = true;
            this.queryParams.id = row.id;
            getCronMailDetail(this.queryParams).then((res) => {
                this.dataDetail = res.data.records;
                this.total = res.data.total;
            });
        },
        /**查询所有 */
        handleAll(id) {
            getCronMailDetail({
                currentPage: 1,
                size: this.userList.length,
                id,
            }).then((res) => {
                for (let item of res.data.records) {
                    for (let list of this.userList) {
                        if (item.userName === list.userName) {
                            this.form.userId.push(list.userId);
                        }
                    }
                }
                this.onChange(this.form.userId);
            });
        },
        /** 编辑*/
        handleEdit(row) {
            this.form = {
                userId: [],
            };
            this.title = "编辑";
            this.open = true;
            this.form.cron = row.cron;
            this.form.type = row.type + "";
            this.form.id = row.id;
            this.handleAll(row.id);
            this.handleSearch(row);
        },
    },
};
</script>
<style lang="scss" scoped>

</style>
