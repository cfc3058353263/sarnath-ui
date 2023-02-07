<template>
  <div class="app-container">
    <div class="info">
      <div class="title">
        <span> 基础信息 </span>
      </div>

      <div class="table">
        <table class="tableInfo" cellspacing="0">
          <tr>
            <th class="thBackground" rowspan="4">基础数据</th>
            <th><span>日期日报</span></th>
            <th><span>天气情况</span></th>
            <th><span>发电量</span></th>
            <th><span>编辑人</span></th>
            <th><span>日报状态</span></th>
          </tr>
          <tr>
            <td><span>{{reportDetail.calendar}}</span></td>
            <td><span>{{reportDetail.actualWeather}}</span></td>
            <td><span>{{reportDetail.dayKwh}}</span></td>
            <td><span>{{reportDetail.updateUserName}}</span></td>
            <td><span>{{reportDetail.submitStatus === "1"? "未提交":"已提交"}}</span></td>
          </tr>
          <tr>
            <th><span>平均风速</span></th>
            <th><span>单台风机平均发电量</span></th>
            <th><span>当日下网电量</span></th>
            <th><span>厂用电量</span></th>
            <th><span>厂用电率</span></th>
          </tr>
          <tr>
            <td><span>{{reportDetail.wAvgWind}}</span></td>
            <td><span>{{reportDetail.wKwhPerFan}}</span></td>
            <td><span>{{reportDetail.wBuyNetKwh}}</span></td>
            <td><span>{{reportDetail.wDayFactoryUseKwh}}</span></td>
            <td><span>{{reportDetail.wFactoryUsePercent}}</span></td>
          </tr>
          <tr>
            <th class="thBackground" rowspan="2">月发电量数据</th>
            <th><span>本月计划发电量/kWh</span></th>
            <th><span>本月累计发电量/kWh</span></th>
            <th><span>本月计划完成比/％</span></th>
            <th><span>本月下网电量/kWh</span></th>
            <th><span>本月厂用电量</span></th>
          </tr>
          <tr>
            <td><span>{{reportDetail.forecastKwh}}</span></td>
            <td><span>{{reportDetail.monthKwh}}</span></td>
            <td><span>{{reportDetail.monthCompletePercent}}</span></td>
            <td><span>{{reportDetail.wBuyNetMonthKwh}}</span></td>
            <td><span>{{reportDetail.wMonthFactoryUseKwh}}</span></td>
          </tr>
          <tr>
            <th class="thBackground" rowspan="2">年发电量数据</th>
            <th><span>本年计划发电量/万kWh</span></th>
            <th><span>本年累计发电量/万kWh</span></th>
            <th><span>本年计划完成比/％</span></th>
          </tr>
          <tr>
            <td><span>{{reportDetail.contractKwh}}</span></td>
            <td><span>{{reportDetail.contractTotalKwh}}</span></td>
            <td><span>{{reportDetail.contractCompletePercent}}</span></td>
          </tr>
        </table>
      </div>

    </div>

    <!-- tag -->
    <el-tabs type="border-card" v-model="activeTab" @tab-click="changeTab">
      <el-tab-pane label="巡检记录" name="1">
        <el-table v-loading="loading" :data="tablelist">
          <el-table-column label="巡检计划" align="center" prop="planName" :show-overflow-tooltip="true" />
          <el-table-column label="设备类型" align="center" prop="deviceTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="开始时间" align="center" prop="startDate" :show-overflow-tooltip="true" />
          <el-table-column label="结束时间" align="center" prop="endDate" :show-overflow-tooltip="true" />
          <el-table-column label="巡检人员" align="center" prop="optUserName" :show-overflow-tooltip="true" />
        </el-table>
        <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="getInspection" />
      </el-tab-pane>
      <el-tab-pane label="工单记录" name="2">
        <el-table v-loading="loading" :data="tablelist">
          <el-table-column label="工单编号" align="center" prop="issueCode" :show-overflow-tooltip="true" />
          <el-table-column label="工单类型" align="center" prop="issueTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="设备类型" align="center" prop="deviceTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="设备名称" align="center" prop="deviceName" :show-overflow-tooltip="true" />
          <el-table-column label="故障现象" align="center" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column label="工单状态" align="center" prop="batchCode" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ issueStatus[scope.row.issueStatus] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="gdquery.currentPage" :limit.sync="gdquery.size" @pagination="getHandleIssueOrderByPage" />
      </el-tab-pane>
      <el-tab-pane label="两票记录" name="3">
        <el-table v-loading="loading" :data="tablelist">
          <el-table-column label="出库日期" align="center" prop="optTime" />
          <el-table-column label="操作票" align="center" prop="orderCode" :show-overflow-tooltip="true" />
          <el-table-column label="电气一种工作票" align="center" prop="number" :show-overflow-tooltip="true" />
          <el-table-column label="电气二种工作票" align="center" prop="unit" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ unit[scope.row.toolsUnit] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="火车工作牌" align="center" prop="reason" :show-overflow-tooltip="true" />
        </el-table>
        <!-- <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="queryParams.currentPage" :limit.sync="queryParams.size" @pagination="null" /> -->
      </el-tab-pane>
      <el-tab-pane label="项目记录" name="4">
        <el-table v-loading="loading" :data="tablelist">
          <el-table-column label="项目编号" align="center" prop="projectCode" />
          <el-table-column label="项目名称" align="center" prop="projectName" :show-overflow-tooltip="true" />
          <el-table-column label="项目负责人" align="center" prop="dutyUserName" :show-overflow-tooltip="true" />
          <el-table-column label="日志时间" align="center" prop="logCreateTime" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.logCreateTime&&moment(scope.row.logCreateTime).format("yyyy-MM-DD HH:mm:ss")}}</span>
            </template>
          </el-table-column>
          <el-table-column label="当日具体工作" align="center" prop="logWorkContent" :show-overflow-tooltip="true" />
        </el-table>
        <pagination :auto-scroll="false" v-show="total > -1" :total="total" :page.sync="xmquery.pageNum" :limit.sync="xmquery.pageSize" @pagination="getProjectList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getDayDetailByContractId} from "@/api/runing/runDaily/runDailyWind";
import {getWindDayDataDetail} from "@/api/runing/OperationDayData";
import {getdictList, getHandleIssueOrderByPage, getInspection, getProjectList} from "@/api/runing/recordList";

export default {
  name: "windDayReportInfo",
  data() {
    return {
      dayDataId:undefined,
      queryForm: {
        contractId: undefined,
        dateTime: undefined
      },
      reportDetail: {},
      loading: false,
      activeTab: "1",
      // 查询参数
      // 巡检查询
      queryParams: {
        currentPage: 1,
        size: 15,
        params: {
          beginTime: null,
          endTime: null,
        },
      },
      //工单记录
      gdquery: {
        currentPage: 1,
        size: 15,
        createTime: null,
        endTime: null,
      },
      //工单状态
      issueStatus: {},
      //项目记录
      xmquery: {
        pageNum: 1,
        pageSize: 15,
        createTime: null,
      },
      tablelist:[],
      total:0,
    }
  },
  created() {
    // this.queryForm.contractId = this.$route.query.contractId;
    this.queryForm.dateTime = this.$route.query.dateTime;
    this.dayDataId=this.$route.query.id;
    this.getDayData();

    //巡检
    this.queryParams.params.beginTime = this.queryForm.dateTime;
    this.queryParams.params.endTime = this.queryForm.dateTime;
    //工单
    this.gdquery.createTime = this.queryForm.dateTime;
    this.gdquery.endTime = this.queryForm.dateTime;
    //项目
    this.xmquery.createTime = this.queryForm.dateTime;
    this.getInspection();

    // 根据systemId获取对应的字典列表
    if(this.$store.getters.currentSystem == 1) {
      //工单状态
      getdictList("sys_workorder_status").then((res) => {
        for (let item of res.data) {
          this.issueStatus[item.dictValue] = item.dictLabel;
        }
      });
    }else {
      //工单状态
      getdictList("sys_workorder_status").then((res) => {
        for (let item of res.data) {
          this.issueStatus[item.dictValue] = item.dictLabel;
        }
      });
    }




  },
  methods: {
    //切换选项卡
    changeTab(tab, event) {
      var self = this;
      //重置翻页
      switch (self.activeTab) {
        case "1":
          self.queryParams.currentPage = 1;
          self.queryParams.size = 15;
          self.getInspection();
          break;
        case "2":
          self.gdquery.currentPage = 1;
          self.gdquery.size = 15;
          self.getHandleIssueOrderByPage();
          break;
        case "3":
          break;
        case "4":
          self.xmquery.pageNum = 1;
          self.xmquery.pageSize = 15;
          self.getProjectList();
          break;
      }
    },
    getDayData() {
      getWindDayDataDetail(this.dayDataId).then((res) => {
        this.reportDetail = res.data;
      });
    },
    /** 查询巡检记录 */
    getInspection() {
      this.loading = true;
      getInspection(this.queryParams).then((res) => {
        this.tablelist = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 查询工单记录 */
    getHandleIssueOrderByPage() {
      this.loading = true;
      getHandleIssueOrderByPage(this.gdquery).then((res) => {
        this.tablelist = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 查询检测记录 */
    getStockTestList() {
      this.loading = true;
    },
    /** 查询项目记录 */
    getProjectList() {
      this.loading = true;
      getProjectList(this.xmquery).then((res) => {
        this.tablelist = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    margin-bottom: 10px;

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

      .tableInfo {
        width: 100%;
        border-top: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
        table-layout: fixed;
        tr {
          .thBackground {
            background-color: #d7dde4;
          }

          th {
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            height: 30px;

            span {
              color: #515a6e;
              font-size: 13px;
            }
          }

          td {
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
            text-align: center;
            height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;        
            span {
              font-size: 13px;
            }
          }
        }
      }
    }

    .el-col {
      border-left: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      border-bottom: 1px solid #dfe6ec;
      text-align: left;
      padding: 20px;

      span {
        color: #909399;
        font-size: 13px;
      }
    }
  }
</style>
