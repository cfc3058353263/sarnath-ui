<template>
    <div class="app-container">
        <!-- 查询条件 -->
        <el-form :model="queryParams" ref="queryParams" :inline="true" :rules="rules" label-width="80px" v-show="showSearch">
            <el-form-item label="所属电站" prop="stationId">
                <station-search ref="station" :queryParams="queryParams" stationId="stationId" systemId="systemId"></station-search>
            </el-form-item>
<!--            <el-form-item label="设备类型" prop="deviceType">-->
<!--                <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型">-->
<!--                    <el-option :label="item.dictLabel" :value="item.dictValue" v-for="(item,index) in deviceTypeList" :key="index"></el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="查询类型">
                <el-select v-model="dateType" placeholder="请选择查询类型" @change="changeSelect" style="width:200px">
                    <el-option :label="item.label" :value="item.value" v-for="(item,index) in dateTypeList" :key="index" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="startTime" label="开始时间">
                <el-date-picker v-model="queryParams.startTime" @change="changeStart" :type="dateType" :clearable="false" size="small" style="margin-right:10px;width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop="stopTime" label="结束时间">
                <el-date-picker v-model="queryParams.stopTime" @change="changeEnd" :type="dateType" :clearable="false" size="small" :picker-options="stopTime" style="width:150px">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 查询条件 -->

        <!-- 按钮.... -->
        <!-- table -->
        <el-table v-loading="loading" :data="dataList">
            <el-table-column label="日期" prop="dataTime" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="query.dateType == 'devicePowerCountOnDay'">{{ moment(scope.row.dataTime).format('YYYY-MM-DD') }}</span>
                    <span v-else-if="query.dateType == 'devicePowerCountOnMonth'">{{ moment(scope.row.dataTime).format('YYYY-MM') }}</span>
                    <span v-else-if="query.dateType == 'devicePowerCountOnYear'">{{ moment(scope.row.dataTime).format('YYYY') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备名称" prop="deviceName" :show-overflow-tooltip="true" />
            <el-table-column label="设备日发电量(kWh)" prop="devicePower" :show-overflow-tooltip="true" />
        </el-table>
        <!-- table -->
        <!-- 分页 -->
        <pagination v-show="true" :total="total" :page.sync="query.currentPage" :limit.sync="query.size" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />
        <!-- 分页 -->
    </div>
</template>

<script>
import StationSearch from "@/views/components/stationSearch";
import excelImport from "@/views/components/ExcelImport";
import { getdictList } from "@/api/utils.js";
import { getDeviceDay } from "@/api/dataMaintain/dpgStatistics.js";

export default {
    name: "dpgStatistics",
    components: {
        StationSearch,
        excelImport,
    },
    data() {
        let self = this;
        return {
            stopTime: {
                disabledDate(time) {
                    return self.moment(time.getTime()).diff(self.moment(self.queryParams.startTime), "day") < 0 ;
                },
            },
            showSearch: true,
            loading: false,
            total: 0,
            dateType: "date",
            dateTypeList: [
                { value: "date", label: "天" },
                { value: "month", label: "月" },
                { value: "year", label: "年" },
            ],
            deviceTypeList: [],
            queryParams: {
                currentPage: 1,
                size: 15,
                startTime: this.moment().format("YYYY-MM-01"),
                stopTime: this.moment().format("YYYY-MM-DD"),
                stationId: null,
                systemId: null,
                deviceType: 'date',
            },
            query:{},
            dataList: [],
            rules: {
                time: [
                    {
                      required: true
                    },
                ],
                stationId: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                deviceType: [
                    {
                        required: true,
                        message: "设备类型不能为空",
                        trigger: "blur",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                stopTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    created() {
        this.getdictList();
    },
    mounted() {
      this.getDeviceDay();
    },
    methods: {
        //字典
        getdictList() {
            getdictList("sys_device_type").then((res) => {
                this.deviceTypeList = res.data;
            });
        },
        /**获取设备发电量 日 */
        getDeviceDay() {
            this.loading = true;
            let dateType
            switch (this.dateType) {
                case "date":
                    dateType = 'devicePowerCountOnDay'
                    break;
                case "month":
                    dateType = 'devicePowerCountOnMonth'
                    break;
                case "year":
                    dateType = 'devicePowerCountOnYear'
                    break;
            }
            this.queryParams.deviceType = 1;
            getDeviceDay(this.queryParams,dateType).then((res) => {
                this.dataList = res.data && res.data.records;
                this.loading = false;
                this.total = res.data.total;
                const {currentPage,size,startTime,stopTime,stationId,systemId,deviceType} = this.queryParams
                this.query = {currentPage,size,startTime,stopTime,stationId,systemId,deviceType,dateType:dateType};
            });
        },
        //分页
        getList(){
            this.loading = true;
            getDeviceDay(this.query,this.query.dateType).then((res) => {
                this.dataList = res.data && res.data.records;
                this.total = res.data.total;
                this.loading = false;
            });
        },
        //查询
        search() {

            this.$refs["queryParams"].validate((valid) => {
                if (valid) {
                    if(this.moment(this.queryParams.stopTime).diff(this.moment(this.queryParams.startTime), "day") < 0 ){
                        this.msgError("日期区间结束时间不得早于开始时间");
                    }else{
                        this.getDeviceDay();
                    }
                }
            });
        },
        /**时间选择 */
        changeDate(date) {
              switch (this.dateType) {
                case "daterange":
                    this.queryParams.startTime = date[0];
                    this.queryParams.stopTime = date[1];
                    break;
                case "monthrange":
                    this.queryParams.startTime = date[0];
                    this.queryParams.stopTime = this.moment(date[1]).endOf('month').format("YYYY-MM-DD");
                    break;
            }
        },
        /**日期类型选 */
        changeSelect(value){
            this.queryParams.startTime = null;
            this.queryParams.stopTime = null;
        },
        changeStart(date) {
            this.queryParams.stopTime = null;
            switch (this.dateType) {
                case "date":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-MM-01");
                    break;
                case "year":
                    this.queryParams.startTime =
                        this.moment(date).format("YYYY-01-01");
                    break;
            }
        },
        changeEnd(date) {
            switch (this.dateType) {
                case "date":
                    this.queryParams.stopTime =
                        this.moment(date).format("YYYY-MM-DD");
                    break;
                case "month":
                    this.queryParams.stopTime = this.moment(date)
                        .endOf("month")
                        .format("YYYY-MM-DD");
                    break;
                case "year":
                    this.queryParams.stopTime =
                        this.moment(date).format("YYYY-12-31");
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: space-around;
}
.selectD {
    text-align: center;
}
</style>
