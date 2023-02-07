<template>
  <div class="app-container">
    <!-- 搜索条件   -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px" :rules="rules">
      <el-form-item label="入库单号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入入库单号"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="入库状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="入库状态"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="dict in spareStatusList"
            :key="dict.id"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-date-picker
          unlink-panels
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item prop="startTime" label="开始时间">
          <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
          </el-date-picker>
      </el-form-item>
      <el-form-item prop="endTime" label="结束时间">
          <el-date-picker v-model="queryParams.endTime" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
          </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['assets:spare:entry:add']">新增
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"/>
    </el-row>
    <!--    出库表单  -->
    <el-table
      v-loading="loading"
      :data="spareOderList"
      @current-change="handleCurrentChange"
      :row-class-name="tableRowClassName"
      :row-style="rowClass">
      <el-table-column type="index" width="55" prop="prop" label="序号"/>
      <el-table-column
        label="出库单号"
        prop="orderCode"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!--          <span>{{moment(scope.row.createTime).format("yyyy-MM-DD HH:mm:ss")}}</span>-->
          <span>{{formatTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="createUserName"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="出库时间"
        prop="optTime"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.optTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="出库人"
        prop="optUserName"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="入库状态"
        prop="status"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ spareStatusOption[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.status=='1'"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status=='1'"
            @click="handleDelete(scope.row)">删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            v-if="scope.row.status=='1'"
            @click="confirm(scope.row)">确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page-sizes="[7]"
      :page.sync="query.currentPage"
      :limit.sync="query.size"
      @pagination="getList"
    />

    <div>出库明细列表</div>
    <el-table
      v-loading="loading"
      :data="spareOderDetailList"
    >
      <el-table-column type="index" width="55" prop="prop" label="序号"/>
      <el-table-column
        label="备品类型"
        prop="spareTypeName"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="备品编码"
        prop="spareCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="备品名称"
        prop="spareName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="规格"
        prop="spareSpecs"
        :show-overflow-tooltip="true"
        width="60"
      />
      <el-table-column
        label="型号"
        prop="spareModel"
        :show-overflow-tooltip="true"
        width="60"
      />
      <el-table-column
        label="单位"
        prop="spareUnitName"
        :show-overflow-tooltip="true"
        width="60"/>
      <el-table-column
        label="批次"
        prop="batchCode"
        :show-overflow-tooltip="true"/>

      <el-table-column
        label="出库数量"
        prop="number"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="单价"
        prop="price"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="总价"
        prop="amount"
        :show-overflow-tooltip="true"/>

      <el-table-column
        label="出库原因"
        prop="reason"
        :show-overflow-tooltip="true"/>

    </el-table>

  </div>
</template>

<script>
import {
  deleteSpareOrders,
  getDetailById,
  getSpareOrderByPage,
  submitOrderOut,
} from "@/api/assets/spare/EntryAndOutStore";

export default {
  name: "SpareOutStore",
  data() {
    let self = this;
    return {
      endTime: {
          disabledDate(time) {
              return (
                  self
                      .moment(time.getTime())
                      .diff(self.moment(self.queryParams.startTime), "day") < 0
              );
          },
      },
      queryParams: {
        orderType: 1,
        pageSize: 7,
        pageNum: 1,
        orderCode: undefined,
        status: undefined,
        startTime: this.moment().format("yyyy-MM-01 00:00:00"),
        endTime: this.moment().format("yyyy-MM-DD 23:59:59")
      },
      query:{},
      // 遮罩层
      loading: false,
      // 非多个禁用
      multiple: true,
      //时间范围
      timeRange: null,
      // 显示搜索条件
      showSearch: true,
      //出库单列表
      spareOderList: [],
      //出库单详细列表
      spareOderDetailList: [],
      //总数
      total: 0,
      //列表选中Index
      selectedIndex: null,
      // 备品入库状态列表
      spareStatusList: [
        {id: 0, dictLabel: "全部", dictValue: null},
        {id: 1, dictLabel: "新建", dictValue: "1", confirm: true, delete: true},
        {id: 2, dictLabel: "已提交", dictValue: "2", confirm: false, delete: false}
      ],
      spareStatusOption: {
        "1": "新建",
        "2": "已提交"
      },
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
    this.$nextTick(()=>{
      this.handleQuery();
    })
  },
  methods: {
    /**
     * 获取出库单列表
     */
    getList() {

      getSpareOrderByPage(this.queryParams).then((respons) => {
        this.spareOderList = respons.rows;
        this.total = respons.total;
      })
    },
    /**
     * 获取订单详细
     */
    getSpareDetailList(orderId) {
      getDetailById(orderId).then((res) => {
        this.spareOderDetailList = res.SpareOrderDetails;

      });
    },
    /**
     * 点击查询按钮操作
     */
    handleQuery() {
       this.$refs.queryForm.validate((valid) => {
            if (valid) {
                this.query = JSON.parse(JSON.stringify(this.queryParams));
                this.getList();
            }
        });
    },
    /**
     * 点击重置按钮操作
     */
    resetQuery() {
      this.queryParams = {
        orderType: 1,
        pageSize: 7,
        pageNum: 1,
        orderCode: undefined,
        status: undefined,
        startTime: this.moment().format("yyyy-MM-01 00:00:00"),
        endTime: this.moment().format("yyyy-MM-DD 23:59:59")
      };
      this.getList();
    },
    /**
     * 点击新增按钮操作
     */
    handleAdd() {
      this.$router.push({
        path: this.$store.getters.routerPrefix + '/assets/spare/outStore/data',
      });
    },
    /**
     * 点击编辑按钮操作
     */
    handleUpdate(row) {
      this.$router.push({
        path: this.$store.getters.routerPrefix + '/assets/spare/outStore/data',
        query: {orderId: row.id},
      });
    },
    /** 确认按钮操作 */
    confirm(row) {
      this.$confirm("是否确认修改当前的数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return submitOrderOut(row.id);
        })
        .then(() => {
          this.getList();
          this.getSpareDetailList(row.id)
          this.msgSuccess("修改成功");
        });
    },
    /**
     * 删除按钮操作
     */
    handleDelete(row) {
      this.$confirm("是否确认出库?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteSpareOrders(row.id);
        })
        .then(() => {
          this.getList();
          this.spareOderDetailList = [];
          this.msgSuccess("删除成功");
        });
    },
    /**以下是点击tb变色接口 */
    handleCurrentChange(val) {
      this.selectedIndex = val.index;
      this.getSpareDetailList(val.id);
    },
    rowClass({row, rowIndex}) {
      if (this.selectedIndex === rowIndex) {
        return {
          border: "solid 1px #3dffef",
          "background-color": "rgba(185, 221, 249, 0.75)",
        };
      }
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
    },
    /**
     * 格式化时间
     */
    formatTime(time) {
      if (time === null || time === undefined) {
        return "-";
      }
      return this.moment(time).format("yyyy-MM-DD HH:mm:ss")
    },
    changeStart(date) {
        this.queryParams.endTime = null;
    },
  },
  watch: {
    timeRange: function (val) {
      this.queryParams.startTime = this.moment(val[0]).format("yyyy-MM-DD 00:00:00")
      this.queryParams.endTime = this.moment(val[1]).format("yyyy-MM-DD 23:59:59")
    }
  }
}
</script>

<style scoped>

</style>
