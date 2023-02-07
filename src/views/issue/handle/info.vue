<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span>工单信息</span>
            </div>
            <div class="table">
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">工单类型</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.issueTypeName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工单编号</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.issueCode}}</div>
                    </div>
                </div>
                 <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">工单状态</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.issueStatusName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工单级别</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.issueLevelName}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">处理单位</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.optDept}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工单下发人</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.issuePersonName}}</div>
                    </div>
                </div>
                 <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">故障设备</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.devicenName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">故障部件</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{issueOrder.faultPart}}</div>
                    </div>
                </div>
                <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
                    <div class="titleStyle">
                        <div class="in">工单描述</div>
                    </div>
                    <div class="labelStyle" style="width:75%">
                        <div class="in">{{issueOrder.remark}}</div>
                    </div>
                </div>
            </div>
        </div>

        <el-tabs type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="缺陷过程" name="1">
                <el-table v-loading="loadingTab" :data="dataList">
                    <el-table-column type="index" width="55" prop="prop" label="序号" />
                    <el-table-column label="跟踪时间" key="optTime" prop="optTime" />
                    <el-table-column label="处理人" key="optPersonName" prop="optPersonName" />
                    <el-table-column label="处理阶段" key="handleRangeName" prop="handleRangeName" />
                    <el-table-column label="损失电量" key="lossKwh" prop="lossKwh" />
                    <el-table-column label="影响装机容量" key="affectInstallCapacity" prop="affectInstallCapacity" />
                    <el-table-column label="处理措施" key="deivceAndOptMethod" prop="deivceAndOptMethod" />
                    <el-table-column label="处理照片" key="lastUpdateTime" prop="lastUpdateTime">
                        <template slot-scope="scope">
                            <img :src="scope.row.imgUrl" min-width="30" height="30" @click="preView(scope.row.imgUrl)" style="cursor:pointer;" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="损失电量" name="2">
                <el-table show-summary v-loading="loadingTab" :data="dataList">
                    <el-table-column type="index" width="55" prop="prop" label="序号" />
                    <el-table-column label="时间" key="optTime" prop="optTime">
                        <template slot-scope="scope">
                            <span>{{ moment(scope.row.optTime).format("YYYY年MM月DD日") }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="开始时段" key="startTime">
                        <template slot-scope="scope">
                            <span v-if="scope.$index === 0">{{ scope.row.optTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时段" key="realEndTime">
                        <template slot-scope="scope">
                            <span v-if="scope.$index === dataList.length-1">{{scope.row.optTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="损失电量(kWh)" key="lossKwh" prop="lossKwh" />
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <el-dialog :visible.sync="dialogVisible" style="text-align:center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog>

    </div>
</template>

<script>
import {
    getIssueDetailsListById,
    getIssueOrderById,
    getLossKwhByIssueId,
} from "@/api/issue/issue";

export default {
    name: "issueHandleInfo",
    data() {
        return {
            //遮罩层
            loading: false,
            loadingTab: false,
            issueId: undefined,
            issueOrder: undefined,
            activeTab: "1",
            dataList: [],
            dialogImageUrl: "",
            dialogVisible: false,
        };
    },
    created() {
        const issueId = this.$route.query && this.$route.query.issueId;
        if (issueId) {
            this.issueId = issueId;
            this.getInfo();
            this.getIssueDetailsList();
        }
    },
    methods: {
        getInfo() {
            this.loading = true;
            getIssueOrderById(this.issueId).then((res) => {
                this.issueOrder = res.IssueOrder;
                //循环拼接设备名称
                let list = this.issueOrder.deviceList;
                let deviceName = "";

                if (this.issueOrder.deviceCustomName != null) {
                    deviceName += this.issueOrder.deviceCustomName + "|";
                }

                list.forEach((it) => {
                    deviceName += it.deviceName + "|";
                });
                deviceName = deviceName.substr(0, deviceName.lastIndexOf("|"));

                this.issueOrder.deviceName = deviceName;

                this.loading = false;
            });
        },
        getIssueDetailsList() {
            this.loadingTab = true;
            getIssueDetailsListById(this.issueId).then((res) => {
                this.dataList = res.IssueOrderDetailsList;
                this.loadingTab = false;
            });
        },
        getIssueLossKwhList() {
            this.loadingTab = true;
            getLossKwhByIssueId(this.issueId).then((res) => {
                this.dataList = res.lossKwhList;
                this.loadingTab = false;
            });
        },

        //切换选项卡
        changeTab(tab, event) {
            var self = this;
            self.total = 0;
            self.dataList = [];
            //重置翻页
            self.queryParams = {
                pageNum: 1,
                pageSize: 15,
                deviceId: self.$route.query.deviceId,
            };

            switch (self.activeTab) {
                case "1":
                    self.getIssueDetailsList();
                    break;
                case "2":
                    self.getIssueLossKwhList();
                    break;
            }
        },
        /** 预览 */
        preView(data) {
            this.dialogImageUrl = data;
            this.dialogVisible = true;
        },
    },
};
</script>

<style lang="scss" scoped>
.info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    margin-bottom: 10px;

    .el-col {
        font-weight: 400;
    }

    .title {
        height: 30px;
        background-color: #d7dde4;

        span {
            line-height: 30px;
        }
    }

    //**表格样式设计 */
    .table {
        padding-top: 10px;
        padding-bottom: 10px;
        .tableFlex {
            display: flex;
            align-items: stretch;
            border-left: 1px solid #dfe6ec;
            .titleStyle {
                width: 25%;
                background-color: #f9f9f9;
                border-right: 1px solid #dfe6ec;
                border-top: 1px solid #dfe6ec;
                text-align: center;
                padding: 5px;
                .in {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .labelStyle {
                width: 25%;
                word-wrap: break-word;
                word-break: break-all;
                border-right: 1px solid #dfe6ec;
                border-top: 1px solid #dfe6ec;
                color: #909399;
                padding: 5px;
                .in {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
    }
}
</style>
