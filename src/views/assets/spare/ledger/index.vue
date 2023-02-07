<template>
  <div class="app-container">
    <el-row>
      <!--备品数据-->
      <el-col>
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="备品编码" prop="spareCode">
            <el-input v-model="queryParams.spareCode" placeholder="请输入备品编码" maxlength="50" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="备品名称" prop="spareName">
            <el-input v-model="queryParams.spareName" placeholder="请输入备品名称" maxlength="50" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="库存状态" prop="stockStatus">
            <el-select v-model="queryParams.stockStatus" placeholder="库存状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in stockStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['assets:spare:ledger:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" :row-class-name="rowClassName">
          <el-table-column width="150" label="备品编码" align="center" key="spareCode" prop="spareCode" :show-overflow-tooltip="true"/>
          <el-table-column label="备品名称" align="center" key="spareName" prop="spareName" :show-overflow-tooltip="true" />
          <el-table-column label="规格" align="center" key="spareSpecs" prop="spareSpecs" :show-overflow-tooltip="true" />
          <el-table-column label="型号" align="center" key="spareModel" prop="spareModel" :show-overflow-tooltip="true" />
          <el-table-column label="单位" align="center" key="spareUnitName" prop="spareUnitName" :show-overflow-tooltip="true" />
          <el-table-column label="供应商" align="center" key="spareSupplierName" prop="spareSupplierName" :show-overflow-tooltip="true" />
          <el-table-column label="单价(元)" align="center" key="price" prop="price" :show-overflow-tooltip="true" >
              <template slot-scope="scope">
                <span>{{scope.row.price==null ? '' : scope.row.price+' 元'}}</span>
              </template>
          </el-table-column>
          <el-table-column label="当前库存" align="center" key="currentNum" prop="currentNum" :show-overflow-tooltip="true" />

          <el-table-column label="最高库存" align="center" key="spareMaxNum" prop="spareMaxNum" width="160" />
          <el-table-column label="最底库存" align="center" key="spareMinNum" prop="spareMinNum" width="160">
          </el-table-column>
          <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['assets:spare:ledger:info']">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listLedgerData,
  treeselectInput,
  add,
  update,
  removeData,
  getInfo,
  exportData,
} from '@/api/assets/sparebase'
import { getSupplierSelect } from '@/api/assets/supplier'
import { getIsEnableCode } from '@/api/utils'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Device',
  components: { Treeselect },
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
      // 表格数据
      dataList: null,
      stockStatusOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        stockStatus: undefined,
        spareName: undefined,
        spareCode: undefined,
      },
      query:{

      }
    }
  },
  created() {
    this.handleQuery()
    //备品类型
    this.getDicts('sys_stock_status').then((response) => {
      this.stockStatusOptions = response.data
    })
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true

      listLedgerData(this.queryParams).then((response) => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 表单重置
    reset() {
      this.form = {}
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.query = JSON.parse(JSON.stringify(this.queryParams));
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

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/sparebase/exportLedger',
        {
          ...this.queryParams,
        },
        `备品盘点_${new Date().getTime()}.xlsx`
      )
    },
    rowClassName(row) {
      if (row.row.color == 'red') {
        return 'redware'
      } else {
        return ''
      }
    },
    handleInfo(row) {
      this.$router.push({
        path: this.$store.getters.routerPrefix + '/assets/spare/ledgerinfo',
        query: {
          id: row.id,
        },
      })
    },
  },
}
</script>

<style >
.redware {
  background-color:bisque !important;
}
</style>
