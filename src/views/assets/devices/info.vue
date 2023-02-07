<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <div class="table">
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">设备编码</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceCode}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">设备名称</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">规格</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceSpecs}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">型号</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceModel}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">设备类型</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceTypeName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">上级设备</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.parentName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">装机容量</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.installedCapacity}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">供应商</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.deviceSupplierName}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">接入数量</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.number}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">安装时间</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.installTime}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">到期时间</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.endTime}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">设备状态</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.statusName}}</div>
                    </div>
                </div>
                <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
                    <div class="titleStyle">
                        <div class="in">简介</div>
                    </div>
                    <div class="labelStyle" style="width:87.5%"><div class="in">{{baseinfo.remark}}</div></div>
                </div>
            </div>
        </div>
        <el-tabs type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="巡检记录" name="1">
                <el-table v-loading="loading" :data="dataList">
                    <el-table-column label="巡检时间" key="optTime" prop="optTime" :show-overflow-tooltip="true" />
                    <el-table-column label="巡检人" key="optUserName" prop="optUserName" :show-overflow-tooltip="true" />
                    <el-table-column label="巡检周期" key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />
                    <el-table-column label="计划名称" key="planName" prop="planName" :show-overflow-tooltip="true" />

                    <el-table-column label="开始时间" key="startDate" prop="startDate" :show-overflow-tooltip="true" />
                    <el-table-column label="结束时间" key="endDate" prop="endDate" :show-overflow-tooltip="true" />
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getListOne" />
            </el-tab-pane>
            <el-tab-pane label="工单记录" name="2">
                <el-table v-loading="loading" :data="dataList">
                    <el-table-column label="工单编号" key="issueCode" prop="issueCode" />
                    <el-table-column label="工单类型" key="issueTypeName" prop="issueTypeName" />
                    <el-table-column label="故障开始时间" key="createTime" prop="createTime" />
                    <el-table-column label="故障结束时间" key="realEndTime" prop="realEndTime" />
                    <el-table-column label="故障原因" key="remark" prop="remark" />
                    <el-table-column label="损失电量" key="lossKwh" prop="lossKwh" />
                    <el-table-column label="故障处理人" key="optPersonName" prop="optPersonName" />
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getListOne" />
            </el-tab-pane>
            <el-tab-pane label="备品更换记录" name="3">备品更换记录</el-tab-pane>
            <el-tab-pane label="报废记录" name="4">
                <el-table v-loading="loading" :data="dataList">
                    <el-table-column label="报废时间" key="discardTime" prop="discardTime" />
                    <el-table-column label="处理方式" key="discardMethod" prop="discardMethod" :show-overflow-tooltip="true" />
                    <el-table-column label="负责人" key="discardUser" prop="discardUser" :show-overflow-tooltip="true" />
                    <el-table-column label="报废原因" key="discardRemark" prop="discardRemark" :show-overflow-tooltip="true" />
                    <el-table-column label="设备照片" align="center" key="imgPreView">
                        <template slot-scope="scope">
                            <img :src="scope.row.imgPreView" min-width="30" height="30" @click="preView" style="cursor:pointer;" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <el-dialog :visible.sync="dialogVisible" style="text-align:center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import { getInfo } from "@/api/assets/device";
import { recordList } from "@/api/patrol/record";
import { getIssueOrderByDeviceId } from "@/api/issue/issue";

export default {
    name: "deviceInfo",
    data() {
        return {
            // 总条数
            total: 0,
            baseinfo: {},
            // 表格数据
            dataList: null,
            loading: false,
            loadingInfo: false,
            activeTab: "1",
            dialogImageUrl: "",
            dialogVisible: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 15,
            },
        };
    },
    created() {
        const deviceId = this.$route.query && this.$route.query.deviceId;
        if (deviceId) {
            this.queryParams.deviceId = deviceId;
            this.getInfoData(deviceId);
            this.getListOne();
        }
    },
    methods: {
        /** 预览 */
        preView() {
            this.dialogImageUrl = this.baseinfo.imgPreView;
            this.dialogVisible = true;
        },
        /** 查询设备列表 */
        getInfoData(deviceId) {
            this.loadingInfo = true;
            getInfo(deviceId).then((response) => {
                this.baseinfo = response.data;
                this.loadingInfo = false;
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
                    self.getListOne();
                    break;
                case "2":
                    self.getListTwo();
                    break;
                case "3":
                    self.getListThree();
                    break;
                case "4":
                    self.dataList = [self.baseinfo];
                    break;
            }
        },
        //第一个表格数据查询
        getListOne() {
            this.loading = true;
            recordList(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //第二个表格数据查询
        getListTwo() {
            this.loading = true;
            this.queryParams.deviceId = [this.$route.query.deviceId];
            getIssueOrderByDeviceId(this.queryParams).then((response) => {
                this.dataList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        //第三个表格数据查询
        getListThree() {},
        //第四个表格数据查询
        getListFour() {},
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
                width: 12.5%;
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
                width: 12.5%;
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
