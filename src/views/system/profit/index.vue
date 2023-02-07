<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="profitDate">
        <el-date-picker clearable
                        v-model="queryParams.profitDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:profit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:profit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:profit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:profit:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="profitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="电站名称" align="center" prop="stationName" />
      <el-table-column label="日期" align="center" prop="profitDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.profitDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日收益" align="center" prop="dayProfti" />
      <el-table-column label="月收益" align="center" prop="monthProfti" />
      <el-table-column label="年收益" align="center" prop="yearProfti" />
      <el-table-column label="日消纳比" align="center" prop="dayConsume" />
      <el-table-column label="月消纳比" align="center" prop="monthConsume" />
      <el-table-column label="年消纳比" align="center" prop="yearConsume" />
<!--      <el-table-column label="更新者" align="center" prop="updateUser" />-->
<!--      <el-table-column label="逻辑删除" align="center" prop="isDel" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:profit:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:profit:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改日收益等临时对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属电站" prop="stationId" label-width="150px">
          <station-search :queryParams="form" stationId="stationId" />
        </el-form-item>
        <el-form-item label="日期" prop="profitDate" label-width="150px">
          <el-date-picker clearable
                          v-model="form.profitDate"
                          type="date"
                          style="width: 100%"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="日收益(元)" prop="dayProfti" label-width="150px">
          <el-input v-model="form.dayProfti" placeholder="请输入日收益" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="月收益(元)" prop="monthProfti" label-width="150px">
          <el-input v-model="form.monthProfti" placeholder="请输入月收益" style="width: 100%" />
        </el-form-item>
        <el-form-item label="年收益(元)" prop="yearProfti" label-width="150px">
          <el-input v-model="form.yearProfti" placeholder="请输入年收益" style="width: 100%" />
        </el-form-item>
        <el-form-item label="日消纳比(%)" prop="dayConsume" label-width="150px">
          <el-input v-model="form.dayConsume" placeholder="请输入日消纳比" style="width: 100%" />
        </el-form-item>
        <el-form-item label="月消纳比(%)" prop="monthConsume" label-width="150px">
          <el-input v-model="form.monthConsume" placeholder="请输入月消纳比" style="width: 100%" />
        </el-form-item>
        <el-form-item label="年消纳比(%)" prop="yearConsume" label-width="150px">
          <el-input v-model="form.yearConsume" placeholder="请输入年消纳比" style="width: 100%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProfit, getProfit, delProfit, addProfit, updateProfit } from "@/api/profit/profit";
import StationSearch from "@/views/components/stationSearch";

export default {
  name: "Profit",
  components: {
    StationSearch,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日收益临时表格数据
      profitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        profitDate: null,
        dayProfti: null,
        monthProfti: null,
        yearProfti: null,
        dayConsume: null,
        monthConsume: null,
        yearConsume: null,
        updateUser: null,
        isDel: null
      },
      // 表单参数
      form: {
        stationId:null,
      },
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /**获取你已选中的电站 */
    getStations(res) {
      this.form.stationIdList = res;
    },
    /** 查询日收益临时列表 */
    getList() {
      this.loading = true;
      listProfit(this.queryParams).then(response => {
        this.profitList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        profitDate: null,
        dayProfti: null,
        monthProfti: null,
        yearProfti: null,
        dayConsume: null,
        monthConsume: null,
        yearConsume: null,
        createUser: null,
        createTime: null,
        updateUser: null,
        updateTime: null,
        isDel: null,
        stationId:null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加收益";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProfit(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改收益";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProfit(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProfit(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该数据项？').then(function() {
        return delProfit(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/profit/export', {
        ...this.queryParams
      }, `profit_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
