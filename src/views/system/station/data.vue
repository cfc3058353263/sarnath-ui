<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <div class="table">
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">{{tableData.systemId=="1" ? "电站":"风场"}}名称</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{tableData.stationName}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">{{tableData.systemId=="1" ? "电站":"风场"}}区域</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationArea[tableData.stationArea]}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">{{tableData.systemId=="1" ? "电站":"风场"}}类型</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationType[tableData.stationType]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">{{tableData.systemId=="1" ? "电站":"风场"}}状态</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationStatus[tableData.stationStatus]}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">{{tableData.systemId=="1" ? "电站":"风场"}}业主</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationOwner[tableData.stationOwner]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">并网时间</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{moment(tableData.netTime).format("YYYY-MM-DD HH:mm:ss")}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">并网接入等级</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationLinklevel[tableData.netLevel]}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">售电方式</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{stationSale[tableData.saleType]}}</div>
                    </div>
                </div>
                <div class="tableFlex">
                    <div class="titleStyle">
                        <div class="in">装机容量</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{tableData.installCapacity}}</div>
                    </div>
                    <div class="titleStyle">
                        <div class="in">实际并网容量</div>
                    </div>
                    <div class="labelStyle">
                        <div class="in">{{tableData.netCapacity}}</div>
                    </div>
                </div>
                <div class="tableFlex" style="border-bottom: 1px solid #dfe6ec;">
                    <div class="titleStyle">
                        <div class="in">电站概况</div>
                    </div>
                    <div class="labelStyle" style="width:75%">
                        <div class="in">{{tableData.stationDesc}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="info">
            <div class="title">
                <span>修改记录</span>
            </div>
            <div class="table">
                <el-table :data="tableData.logs" style="width: 100%">
                    <el-table-column prop="prop" label="序号">
                        <template slot-scope="scope">
                            <span>{{scope.row.number}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                        <template slot-scope="scope">
                            <span>{{scope.row.status}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="修改时间">
                        <template slot-scope="scope">
                            <span>{{
              moment(scope.row.updateTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateUser" label="修改人">
                        <template slot-scope="scope">
                            <span>{{ scope.row.updateUser }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateContext" label="修改内容">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import { stationDetails } from "@/api/system/station";
export default {
    name: "stationDetails",
    data() {
        return {
            tableData: [],
            // 电站类型
            stationType: {},
            // 电站区域
            stationArea: {},
            // 售电方式
            stationSale: {},
            // 电站状态
            stationStatus: {},
            // 并网等级
            stationLinklevel: {},
            // 业主id
            stationOwner: {},
            loading: false,
        };
    },
    created() {
        this.stationDetails();
        this.stationType = JSON.parse(this.$route.query.stationType);
        this.stationArea = JSON.parse(this.$route.query.stationArea);
        this.stationSale = JSON.parse(this.$route.query.stationSale);
        this.stationStatus = JSON.parse(this.$route.query.stationStatus);
        this.stationLinklevel = JSON.parse(this.$route.query.stationLinklevel);
        this.stationOwner = JSON.parse(this.$route.query.stationOwner);
    },
    methods: {
        stationDetails() {
            this.loading = true;
            stationDetails(this.$route.query.stationId).then((res) => {
                this.tableData = res.data;
                this.loading = false;
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
// .rowStyle {
//     border-top: 1px solid #dfe6ec;
//     border-left: 1px solid #dfe6ec;
// }
// .valueStyle {
//     border-right: 1px solid #dfe6ec;
//     border-bottom: 1px solid #dfe6ec;
//     background-color: #f9f9f9;
//     padding-right: 20px;
//     height: 45px;
//     text-align: right;
//     line-height: 45px;
// }
// .labelStyle {
//     border-right: 1px solid #dfe6ec;
//     border-bottom: 1px solid #dfe6ec;
//     height: 45px;
//     text-align: center;
//     line-height: 45px;
// }
// .valueText {
//     border-right: 1px solid #dfe6ec;
//     border-bottom: 1px solid #dfe6ec;
//     background-color: #f9f9f9;
//     padding-right: 20px;
//     text-align: right;
//     line-height: 45px;
//     height: 80px;
// }
// .labelText {
//     border-right: 1px solid #dfe6ec;
//     border-bottom: 1px solid #dfe6ec;
//     text-align: center;
//     line-height: 45px;
//     height: 80px;
// }
</style>
