<template>
    <div class="app-container">
        <!--    搜索栏-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" :rules="rules">
            <el-form-item label="电站名称" prop="stationId">
                <station-search :queryParams="queryParams" stationId="stationId" />
            </el-form-item>
            <el-form-item label="日期" prop="dateTime">
                <el-date-picker v-model="queryParams.dateTime" size="small" type="date" value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>

        </el-form>
        <!--汇总数据-->
        <el-table :data="inverterInfo">
            <el-table-column label="平均发电量" align="center" key="avgKwh" prop="avgKwh" />
            <el-table-column label="平均发电效率" align="center" key="avgEfficiency" prop="avgEfficiency" />
            <el-table-column label="平均每兆瓦发电量" align="center" key="avgKwhPerMW" prop="avgKwhPerMW" />
            <el-table-column label="离散率" align="center" key="divergence" prop="divergence" />
            <el-table-column label="当日辐照" align="center" key="irradiation" prop="irradiation" />
<!--            <el-table-column label="交流损耗" align="center" key="exchangeLoss" prop="exchangeLoss" />-->
            <el-table-column label="逆变器总发电量" align="center" key="totalKwh" prop="totalKwh" />
            <el-table-column label="关口表发电量" align="center" key="gatewayKwh" prop="gatewayKwh" />
            <!-- <el-table-column label="逆变器侧PR" align="center" key="inverterPR" prop="inverterPR" />
            <el-table-column label="电站PR" align="center" key="stationPR" prop="stationPR" /> -->

        </el-table>

        <el-table v-loading="loading" :data="inverterList.slice((pageNum-1)*pageSize,pageNum*pageSize)">
            <el-table-column width="150" label="设备编号" align="center" key="deviceCode" prop="deviceCode" />

            <el-table-column label="设备发电量" align="center" key="devicePower" prop="devicePower" />
            <el-table-column label="发电效率（%）" align="center" key="deviceEfficiency" prop="deviceEfficiency" />
            <el-table-column label="每兆瓦发电量（kWh）" align="center" key="deviceKwhPerMW" prop="deviceKwhPerMW" />

            <el-table-column label="日期" align="center" key="dataTime" prop="dataTime" />

        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" />
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import { getInverterDivergence } from "@/api/dataMaintain/inverter";

export default {
    name: "inverterDiscreteRate",
    components: {
        StationSearch,
    },
    data() {
        return {
            //遮罩层
            loading: false,
            //查询参数
            queryParams: {
              pageNum: 1,
              pageSize: 15,
              stationId: null,
              dateTime: this.moment().subtract(1, 'day').format("YYYY-MM-DD")
            },
            showSearch: true,
            inverterList: [],
            inverterInfo: [],
            total: 0,
            pageNum: 1,
            pageSize: 15,
            rules: {
                stationId: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                dateTime: [
                    {
                        required: true,
                        message: "日期不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {},
    mounted() {
      this.getList();
    },
    methods: {
        /**
         * 获取数据接口
         */
        getList() {
            getInverterDivergence(this.queryParams).then((res) => {
                this.inverterInfo = [];

                let inverterData = {
                    avgKwh:
                        res.inverterData.avgKwh === null
                            ? "-"
                            : res.inverterData.avgKwh,
                    avgEfficiency:
                        res.inverterData.avgEfficiency === null
                            ? "-"
                            : res.inverterData.avgEfficiency,
                    avgKwhPerMW:
                        res.inverterData.avgKwhPerMW === null
                            ? "-"
                            : res.inverterData.avgKwhPerMW,
                    divergence:
                        res.inverterData.divergence === null
                            ? "-"
                            : res.inverterData.divergence,
                    irradiation:
                        res.inverterData.irradiation === null
                            ? "-"
                            : res.inverterData.irradiation,
                    exchangeLoss:
                        res.inverterData.exchangeLoss === null
                            ? "-"
                            : res.inverterData.exchangeLoss,
                    totalKwh:
                        res.inverterData.totalKwh === null
                            ? "-"
                            : res.inverterData.totalKwh,
                    gatewayKwh:
                        res.inverterData.gatewayKwh === null
                            ? "-"
                            : res.inverterData.gatewayKwh,
                    inverterPR:
                        res.inverterData.inverterPR === null
                            ? "-"
                            : res.inverterData.inverterPR,
                    stationPR:
                        res.inverterData.stationPR === null
                            ? "-"
                            : res.inverterData.stationPR,
                };
                this.inverterInfo.push(inverterData);
                this.inverterList =
                    res.inverterData.inverterList === null
                        ? []
                        : res.inverterData.inverterList;
                this.total = this.inverterList.length;
                this.pageNum = 1;
            });
        },
        /**
         * 点击搜索按钮操作
         */
        search() {
            this.$refs["queryForm"].validate((valid) => {
                if (valid) {
                    this.getList();
                }
            });
        },
    },
};
</script>


<style>
</style>
