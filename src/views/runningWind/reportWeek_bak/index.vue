<template>
  <div class="app-container">
    <el-form :rules="rules" ref="form" :model="queryForm" :inline="true">
      <el-form-item prop="startTime" label="开始时间">
        <el-date-picker size="small" @change="getStartTime" value-format="yyyy-MM-dd" v-model="queryForm.startTime"
                        type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime" label="结束时间">
        <el-date-picker size="small" value-format="yyyy-MM-dd" :picker-options="endWeek" v-model="queryForm.endTime"
                        type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮.... -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini"
                   v-hasPermi="['runningWind:reportWeek:export']"
                   @click="handleExport">导出
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="周报时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ scope.row.startTimeStr }}</span>
          <span>至</span>
          <span>{{ scope.row.endTimeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周发电量(kWh)" prop="powerRealWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="风机总发电量" prop="fanTotalKwhWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="集电线总发电量" prop="lineTotalKwhWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="周下网电量" prop="buyNetKwhWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="周厂用电量" prop="factoryUseKwhWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="周厂用电率" prop="factotyUsePersentWeek" :show-overflow-tooltip="true"/>
      <el-table-column label="最高负荷" prop="maxLoad" :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-search" @click="handleWeekSee(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['runningWind:reportDay:export']"
                     @click="handleDownLoad(scope.row)">下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getWeekWindDataList} from "@/api/runing/runWeekly/runWeeklyWind";

export default {
  name: "runReportWeekWind",
  data() {
    let self = this;
    let e = null;
    return {
      startWeek: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      endWeek: {
        disabledDate(time) {
          let t = self.moment(time.getTime()).format("yyyy-MM-DD"); //所有
          let s = self.moment(self.queryForm.startTime).format("yyyy-MM-DD"); //开始
          let nextE = self.moment(s).add(6, "days").format("yyyy-MM-DD"); //第一个7天的时间
          if (nextE === t) {
            return false;
          }
          return (
            self.moment(t).diff(self.moment(nextE), "days") < 0
            ||
            self.moment(t).diff(self.moment(nextE), "days") % 7 !== 0
          );
        },
      },
      list: [],
      time: [],
      queryForm: {
        currentPage: 1,
        size: 15,
        startTime: null,
        endTime: null,
      },
      showSearch: true,
      loading: false,
      // 总条数
      total: 0,
      rules: {
        startTime: [
          {
            required: true,
            message: "开始时间不能为空",
            trigger: "blur",
          },
        ],
        endTime: [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "blur",
          },
        ],
      },

    }
  },
  created() {

  },
  methods: {
    /**
     * 获取数据列表
     */
    getList() {
      getWeekWindDataList(this.queryForm).then((res) => {
        this.list = res.rows;
      })

    },
    /**
     * 点击查看按钮操作
     */
    handleWeekSee(row) {
      this.$router.push({
        name: "windWeekReportInfo",
        query: {
          row: JSON.stringify(row),
        },
      });

    },
    /**
     * 点击导出按钮操作
     */
    handleExport() {
      this.download(
        "system/operationPlanDayWind/exportWeekReport",
        {
          ...this.queryForm
        },
        `周报.xlsx`
      );
    },
    /**
     *
     *
     */
    handleDownLoad(row) {
      this.download(
        "system/operationPlanDayWind/exportWeekReport",
        {
          ...this.queryForm, startTimeStr: row.startTimeStr
        },
        `周报.xlsx`
      );
    },
    /**清空结束时间 */
    getStartTime() {
      this.queryForm.endTime = null;
    },

  }

}
</script>

<style scoped>

</style>
