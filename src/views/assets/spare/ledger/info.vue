<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <div class="table">
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">备品编码</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareCode}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">备品名称</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">规格</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareSpecs}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">型号</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareModel}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">单位</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareUnit}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">当前库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.currentNum}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">最高库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareMinNum}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">最低库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{baseinfo.spareMinNum}}</div>
                    </div>
                </div>
                <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
                    <div class="titleStyle">
                        <div class="in">简介</div>
                    </div>
                    <div class="labelStyle" style="width:87.5%">
                        <div class="in">{{baseinfo.remark}}</div>
                    </div>
                </div>
            </div>
        </div>
        <el-tabs type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="库存记录" name="1">
                <el-table v-loading="loadingList" :data="dataList">
                    <el-table-column label="库存日期" align="center" key="createDate" prop="createDate" />
                    <el-table-column label="库存数量" align="center" key="number" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" key="unit" prop="unit" :show-overflow-tooltip="true" />
                    <el-table-column label="单价" align="center" key="price" prop="price" :show-overflow-tooltip="true" />
                    <el-table-column label="总价" align="center" key="amount" prop="amount" :show-overflow-tooltip="true" />

                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getListOne" />
            </el-tab-pane>
            <el-tab-pane label="入库记录" name="2">
                <el-table v-loading="loadingList" :data="dataList">
                    <el-table-column label="入库日期" align="center" key="optTime" prop="optTime" :show-overflow-tooltip="true" />
                    <el-table-column label="入库单号" align="center" key="orderCode" prop="orderCode" :show-overflow-tooltip="true" />
                    <el-table-column label="入库数量" align="center" key="number" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" key="spareUnitName" prop="spareUnitName" :show-overflow-tooltip="true" />
                    <el-table-column label="单价" align="center" key="price" prop="price" :show-overflow-tooltip="true" />
                    <el-table-column label="总价" align="center" key="amount" prop="amount" :show-overflow-tooltip="true" />
                    <el-table-column label="入库人" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
                    <el-table-column label="入库批次" align="center" key="batchCode" prop="batchCode" :show-overflow-tooltip="true" />

                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getListTwo" />

            </el-tab-pane>
            <el-tab-pane label="出库记录" name="3">
                <el-table v-loading="loadingList" :data="dataList">
                    <el-table-column label="出库日期" align="center" key="optTime" prop="optTime" :show-overflow-tooltip="true" />
                    <el-table-column label="出库单号" align="center" key="orderCode" prop="orderCode" :show-overflow-tooltip="true" />
                    <el-table-column label="出库数量" align="center" key="number" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" key="spareUnitName" prop="spareUnitName" :show-overflow-tooltip="true" />
                    <el-table-column label="单价" align="center" key="price" prop="price" :show-overflow-tooltip="true" />
                    <el-table-column label="总价" align="center" key="amount" prop="amount" :show-overflow-tooltip="true" />
                    <el-table-column label="出库人" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
                    <el-table-column label="出库批次" align="center" key="batchCode" prop="batchCode" :show-overflow-tooltip="true" />

                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getListThree" />

            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import { getInfoLedger, stockPage, orderPage } from "@/api/assets/sparebase";

export default {
    name: "DeviceInfo",
    data() {
        return {
            // 总条数
            total: 0,

            baseinfo: {},
            // 表格数据
            dataList: null,
            loading: false,
            loadingList: false,
            activeTab: "1",
            // 查询参数
            queryParams: {
                id: 0,
                pageNum: 1,
                pageSize: 15,
            },
        };
    },
    created() {
        const id = this.$route.query && this.$route.query.id;
        if (id) {
            this.queryParams.id = id;
            this.getInfoData(id);
            this.getListOne();
        }
    },
    methods: {
        /** 查询备品盘点信息列表 */
        getInfoData(id) {
            this.loading = true;
            getInfoLedger(id).then((response) => {
                this.baseinfo = response.data;
                this.loading = false;
            });
        },
        //切换选项卡
        changeTab(tab, event) {
            var self = this;
            //重置翻页
            self.queryParams.pageNum = 1;
            self.queryParams.pageSize = 15;
            self.dataList = null;

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
            }
        },
        //第一个表格数据查询
        getListOne() {
            this.loadingList = true;
            var self = this;
            stockPage(this.queryParams)
                .then((response) => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loadingList = false;
                })
                .catch(function () {
                    self.loadingList = false;
                });
        },
        //第二个表格数据查询
        getListTwo() {
            this.loadingList = true;
            this.queryParams.type = 0;
            var self = this;
            orderPage(this.queryParams)
                .then((response) => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loadingList = false;
                })
                .catch(function () {
                    self.loadingList = false;
                });
        },
        //第三个表格数据查询
        getListThree() {
            this.loadingList = true;
            this.queryParams.type = 1;
            var self = this;
            orderPage(this.queryParams)
                .then((response) => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loadingList = false;
                })
                .catch(function () {
                    self.loadingList = false;
                });
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
        // .rowStyle {
        //   border-top: 1px solid #dfe6ec;
        //   border-left: 1px solid #dfe6ec;
        //   .valueStyle {
        //     border-right: 1px solid #dfe6ec;
        //     border-bottom: 1px solid #dfe6ec;
        //     background-color: #f9f9f9;
        //     padding-right: 20px;
        //     height: 45px;
        //     text-align: right;
        //     line-height: 45px;
        //   }
        //   .labelStyle {
        //     border-right: 1px solid #dfe6ec;
        //     border-bottom: 1px solid #dfe6ec;
        //     height: 45px;
        //     text-align: left;
        //     line-height: 45px;
        //     padding-left: 20px;
        //     span {
        //       color: #909399;
        //     }
        //   }
        // }
    }
}
</style>
