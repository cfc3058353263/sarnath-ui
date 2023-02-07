<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <div class="table">
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">工器具类型</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{toolsType[row.toolsType]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工器具分类</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{toolsClass[row.toolsClass]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工器具编码</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.toolsCode}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">工器具名称</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.toolsName}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">规格</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.toolsSpecs}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">单位</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{unit[row.toolsUnit]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">型号</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.toolsModel}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">当前库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.repertory}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">供应商</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{supplierType[row.supplierId]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">检验周期</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{cycle[row.checkCycle]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">最高库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.maxNum}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">最低库存</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{row.minNum}}</div>
                    </div>
                </div>
                 <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
                    <div class="titleStyle">
                        <div class="in">最近一次检验时间</div>
                    </div>
                    <div class="labelStyle" style="width:37.5%"><div class="in">{{row.checkTime&&moment(row.checkTime).format("yyyy-MM-DD") }}</div></div>
                    <div class="titleStyle">
                        <div class="in">下次检验时间</div>
                    </div>
                    <div class="labelStyle" style="width:37.5%"><div class="in">{{row.nextCheckTime&&moment(row.nextCheckTime).format("yyyy-MM-DD")}}</div></div>
                </div>
            </div>
        </div>

        <el-tabs type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="库存记录" name="1">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="库存日期" align="center" prop="createDate" />
                    <el-table-column label="库存数量" align="center" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" prop="unit" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ unit[scope.row.unit] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="截止日期" align="center" prop="endDate" :show-overflow-tooltip="true" />
                </el-table>
                <pagination v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="getStockList" />
            </el-tab-pane>
            <el-tab-pane label="入库记录" name="2">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="入库日期" align="center" prop="optTime" />
                    <el-table-column label="入库单号" align="center" prop="orderCode" :show-overflow-tooltip="true" />
                    <el-table-column label="入库数量" align="center" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" prop="unit" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ unit[scope.row.toolsUnit] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="入库人" align="center" prop="optUserName" :show-overflow-tooltip="true" />
                    <el-table-column label="入库批次" align="center" prop="batchCode" :show-overflow-tooltip="true" />
                </el-table>
                <pagination v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="getStockList" />
            </el-tab-pane>
            <el-tab-pane label="出库记录" name="3">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="出库日期" align="center" prop="optTime" />
                    <el-table-column label="出库单号" align="center" prop="orderCode" :show-overflow-tooltip="true" />
                    <el-table-column label="出库数量" align="center" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" align="center" prop="unit" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ unit[scope.row.toolsUnit] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="出库原因" align="center" prop="reason" :show-overflow-tooltip="true" />
                    <el-table-column label="出库人" align="center" prop="optUserName" :show-overflow-tooltip="true" />
                    <el-table-column label="出库批次" align="center" prop="batchCode" :show-overflow-tooltip="true" />
                </el-table>
                <pagination v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="getStockList" />
            </el-tab-pane>
            <el-tab-pane label="检测登记" name="4">
                <el-table v-loading="loading" :data="stockList">
                    <el-table-column label="检测日期" align="center" key="testTime" prop="testTime" />
                    <el-table-column label="检测批次" align="center" key="batchCode" prop="batchCode" :show-overflow-tooltip="true" />
                    <el-table-column label="检测数量" align="center" key="number" prop="number" :show-overflow-tooltip="true" />
                    <el-table-column label="送检人" align="center" key="testUser" prop="testUser" :show-overflow-tooltip="true" />
                    <el-table-column label="检验结论" align="center" key="testStatus" prop="testStatus" :show-overflow-tooltip="true" />
                    <el-table-column label="检测报告" align="center" key="testUrl" prop="testUrl" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <img :src="scope.row.testUrl" min-width="30" height="30" @click="preView(scope.row.testUrl)" />
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="getStockTestList" />
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="dialogVisible" style="text-align: center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog>
    </div>
</template>

<script>
import {
    stockRepertory,
    stockIn,
    stockoyt,
    stockTest,
} from "@/api/assets/tools/stock";

export default {
    name: "stockInfo",
    data() {
        return {
            // 总条数
            total: 0,
            stockList: [],
            // 表格数据
            loading: false,
            activeTab: "1",
            // 查询参数
            queryParams: {
                currentPage: 1,
                size: 15,
                id: null,
            },
            row: {},
            // 供应商类型
            supplierType: { options: [] },
            //工器具类型
            toolsType: { options: [] },
            //工器具分类
            toolsClass: { options: [] },
            //单位
            unit: { options: [] },
            //周期
            cycle: { options: [] },
            // 图片预览
            dialogImageUrl: "",
            //图片遮罩层
            dialogVisible: false,
        };
    },
    created() {
        const id = this.$route.query && this.$route.query.id;
        this.row = JSON.parse(this.$route.query.row);
        this.supplierType = JSON.parse(this.$route.query.supplierType);
        this.toolsType = JSON.parse(this.$route.query.toolsType);
        this.toolsClass = JSON.parse(this.$route.query.toolsClass);
        this.unit = JSON.parse(this.$route.query.unit);
        this.cycle = JSON.parse(this.$route.query.cycle);
        this.queryParams.id = this.row.toolsId;
        this.getStockList();
    },
    methods: {
        //切换选项卡
        changeTab(tab, event) {
            var self = this;
            //重置翻页
            self.queryParams = {
                currentPage: 1,
                size: 15,
                id: this.row.toolsId,
            };
            switch (self.activeTab) {
                case "1":
                    self.getStockList();
                    break;
                case "2":
                    self.getStockInList();
                    break;
                case "3":
                    self.getStockOutList();
                    break;
                case "4":
                    self.getStockTestList();
                    break;
            }
        },
        /** 查询库存记录 */
        getStockList(id) {
            this.loading = true;
            stockRepertory(this.queryParams).then((res) => {
                this.stockList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 查询入库记录 */
        getStockInList() {
            this.loading = true;
            stockIn(this.queryParams).then((res) => {
                this.stockList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 查询出库记录 */
        getStockOutList() {
            this.loading = true;
            stockoyt(this.queryParams).then((res) => {
                this.stockList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 查询检测记录 */
        getStockTestList() {
            this.loading = true;
            stockTest(this.queryParams).then((res) => {
                this.stockList = res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        /** 预览 */
        preView(imgUrl) {
            this.dialogImageUrl = imgUrl;
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
                padding: 5px;
                color: #909399;
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
