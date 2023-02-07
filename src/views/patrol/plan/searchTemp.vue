<template>
  <div class="app-container">
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <!--计划数据-->
        <el-col>
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

            <el-form-item label="方案名称" prop="templateName">
              <el-input v-model="queryParams.templateName" placeholder="请输入方案名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" maxlength="50" />
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small" style="width: 240px">
                <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" :data="dataList" highlight-current-row @current-change="handleCurrentChange" style="cursor:pointer"  >
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column width="200" label="巡检方案名称" key="templateName" prop="templateName" :show-overflow-tooltip="true" />
            <el-table-column width="150" label="设备类型" key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
            <el-table-column label="巡检周期" key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />
            <el-table-column label="周期巡检次数" key="number" prop="number" :show-overflow-tooltip="true" />
            <el-table-column label="巡检周期最短天数" key="minNumber" prop="minNumber" :show-overflow-tooltip="true" />
            <el-table-column label="巡检周期最长天数" key="maxNumber" prop="maxNumber" :show-overflow-tooltip="true" />
            <el-table-column label="最后编辑时间" key="updateTime" prop="updateTime" :show-overflow-tooltip="true" />
          </el-table>

          <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">选择</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listData, getInfo } from '@/api/patrol/template'

export default {
  name: 'searchTemp',
  props: {
    // 是否显示弹出层
    open: {
      type: Boolean,
      default: false,
    },
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
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      // 弹出层标题
      title: '选择巡检方案',
      deviceTypeOptions: [], //设备类型
      currentRow: {}, //当前行
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        planName: undefined,
        deviceType: undefined,
        status: 2,
      },
      query:{},
    }
  },
  created() {
    this.handleQuery()
    // 根据systemId获取对应的字典列表
    if(this.$store.getters.currentSystem == 1) {
      //设备类型
      this.getDicts('sys_device_type').then((response) => {
        this.deviceTypeOptions = response.data
      })
    }else {
      //设备类型
      this.getDicts('sys_device_type_wind').then((response) => {
        this.deviceTypeOptions = response.data
      })
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listData(this.query).then((response) => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.$emit('cancelTemp')
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.query=Object.assign({},this.queryParams)
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // var self = this;
      // this.reset();
      this.dialogVisible = true
      // this.title = "添加计划";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      var self = this
      const id = row.id
      getInfo(id).then((response) => {
        self.form = response.data
        self.detailList = response.detail
        self.open = true
        self.title = '修改计划'
      })
    },
    handleInfo(row) {
      var self = this
      const id = row.id
      getInfo(id).then((response) => {
        self.form = response.data
        self.form.disable = true
        self.detailList = response.detail
        self.open = true
        self.title = '查看计划'
      })
    },

    /** 提交按钮 */
    submitForm: function () {
      //选择方案
      this.$emit('selectTemp', this.currentRow)
    },

    handleCurrentChange(val) {
      this.currentRow = val
    },
  },
}
</script>
