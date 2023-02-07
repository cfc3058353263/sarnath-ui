<template>
  <div class="app-container">
    <!-- 搜索条件   -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="供应商名称" prop="supName">
        <el-input v-model="queryParams.supName" maxlength="50" placeholder="请输入供应商名称" clearable size="small" style="width: 200px" />
      </el-form-item>
      <el-form-item label="供应商类型" prop="supType">
        <el-select v-model="queryParams.supType" placeholder="供应商类型" clearable size="small" style="width: 200px">
          <el-option v-for="dict in supTypeList" :key="dict.id" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系人" prop="supPerson">
        <el-input v-model="queryParams.supPerson" placeholder="请输入联系人" maxlength="50" clearable size="small" style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增.... -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['assets:supplier:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['assets:supplier:del']">删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['assets:supplier:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['assets:supplier:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商编号" prop="supCode" :show-overflow-tooltip="true"   />
      <el-table-column label="供应商名称" prop="supName" :show-overflow-tooltip="true"   />
      <el-table-column label="供应商类型" prop="supType" :show-overflow-tooltip="true" :formatter="statusFormat"   />
      <el-table-column label="联系人" prop="supPerson" :show-overflow-tooltip="true"   />
      <el-table-column label="联系方式" prop="supPhone" :show-overflow-tooltip="true"   />
      <el-table-column label="所在城市" prop="supCity" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:supplier:edit']" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-search" v-hasPermi="['assets:supplier:info']" @click="handleCheck(scope.row)">查看
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['assets:supplier:del']" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页插件-->
    <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" :page-sizes="[15, 30, 50, 100]" @pagination="getList" />

    <!-- 新增和编辑对话框 -->
    <el-dialog :close-on-press-escape="false" :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false" append-to-body @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form">

        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商编号" prop="supCode">
              <el-input v-model="form.supCode" placeholder="请输入供应商编号" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="supName">
              <el-input v-model="form.supName" placeholder="请输入供应商名称" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商类型" prop="supType" style="flex-grow:1">
              <el-select v-model="form.supType" placeholder="供应商类型" style="width: 100%">
                <el-option v-for="item in supTypeList" :key="item.id" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在城市" prop="supCity">
              <el-input v-model="form.supCity" placeholder="请输入所在城市" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="supPerson">
              <el-input v-model="form.supPerson" placeholder="请输入联系人" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="supPhone">
              <el-input v-model="form.supPhone" placeholder="请输入联系方式" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="简介" prop="supDesc">
            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" placeholder="请输入简介" v-model="form.supDesc" maxlength="500">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <!-- <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false"
               :close-on-press-escape="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" >是否更新已经存在的供应商数据</el-checkbox>
          <el-link type="info" style="font-size:16px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <excel-import prefix="assets" ref="upload" dataName="供应商数据" uploadUrl="system/assetSupplier/importData" templateUrl="system/assetSupplier/importTemplate" title="用户导入" :getList="getList" />

  </div>

</template>

<script>
//引用
import topSearch from '@/views/components/TopSearch'
import { getToken } from '@/utils/auth'
import {
  findSupplierByPage,
  addSupplier,
  modifySupplier,
  deleteSupplier,
} from '@/api/assets/supplier'
import { getDicts } from '@/api/system/dict/data'
import excelImport from '@/views/components/ExcelImport'
export default {
  name: 'suppliers',
  components: {
    topSearch,
    excelImport,
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        supName: undefined,
        supType: undefined,
        supPerson: undefined,
      },
      query: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: 'Bearer ' + getToken(),
          station: this.$store.getters.currentStation,
          system: this.$store.getters.currentSystem,
        },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/assetSupplier/importData',
      },
      //表单参数
      form: {},
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 非多个禁用
      multiple: true,
      //弹窗标识
      open: false,
      //弹窗标题
      title: '',
      //表格数据
      supplierList: [],
      //供应商类型数据表
      supTypeList: [],
      //总数
      total: 0,
      // 表单校验
      rules: {
        supCode: [{ required: true, message: '供应商编号不能为空', trigger: 'blur' }],
        supName: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
        supType: [{ required: true, message: '供应商类型不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.handleQuery()
    this.getSupTypeList()
  },
  methods: {
    //获取全部列表数据
    getList() {
      this.loading = true
      findSupplierByPage(this.query).then((respons) => {
        this.supplierList = respons.rows
        this.total = respons.total
        this.loading = false
      })
    },
    //获取供应商类型字典表
    getSupTypeList() {
      getDicts('sys_supplier_type').then((response) => {
        this.supTypeList = response.data
      })
    },
    /**
     * 重置表单
     */
    reset() {
      this.form = {
        supId: undefined,
        supCode: undefined,
        supName: undefined,
        supType: undefined,
        supCity: undefined,
        supPerson: undefined,
        supPhone: undefined,
        supDesc: undefined,
      }
    },
    /**
     * 点击查询按钮操作
     */
    handleQuery() {
      this.loading = true
      this.query = JSON.parse(JSON.stringify(this.queryParams))
      this.getList()
    },
    /**
     * 点击重置按钮操作
     */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 15,
        supName: '',
        supType: undefined,
        supPerson: undefined,
      }
      this.getList()
    },
    /**
     * 点击新增操作
     */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加供应商'
    },
    /**
     * 点击查看操作
     */
    handleCheck(row) {
      this.$router.push({
        path: this.$store.getters.routerPrefix + '/assets/supplier/info',
        query: {
          supId: row.supId,
          supTypeList: JSON.stringify(this.supTypeList),
        },
      })
    },
    /**
     * 点击编辑操作
     */
    handleUpdate(row) {
      this.reset()
      this.form = {
        supId: row.supId,
        supCode: row.supCode,
        supName: row.supName,
        supType: row.supType,
        supCity: row.supCity,
        supPerson: row.supPerson,
        supPhone: row.supPhone,
        supDesc: row.supDesc,
      }
      this.open = true
      this.title = '编辑供应商'
    },
    /**
     * 点击删除操作
     */
    handleDelete(row) {
      const supIds = row.supId || this.ids
      const code = row.supCode || this.codes
      this.$confirm(
        // '是否确认删除供应商编号为"' + code + '"的数据项?',
        '是否确认删除所选择的供应商?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(function () {
          return deleteSupplier(supIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    /**
     * 提交表单操作
     */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.supId != undefined) {
            //修改
            modifySupplier(this.form.supId, this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            //增加
            addSupplier(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /**
     * 点击取消按钮操作
     */
    cancel() {
      this.open = false
      this.$refs['form'].clearValidate()
      this.reset()
    },
    closeDialog() {
      this.$refs['form'].clearValidate()
      this.reset()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.supId)
      this.codes = selection.map((item) => item.supCode)
      this.multiple = !selection.length
    },
    // 字典状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.supTypeList, row.supType)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/assetSupplier/export',
        {
          ...this.queryParams,
        },
        `assets_${new Date().getTime()}.xlsx`
      )
    },
    /** 导入按钮操作 */
    handleImport() {
      // this.upload.title = "用户导入";
      // this.upload.open = true;
      this.$refs.upload.open = true
    },

    /** 下载模板操作 */
    importTemplate() {
      this.download(
        'system/assetSupplier/importTemplate',
        {
          ...this.queryParams,
        },
        `asset_${new Date().getTime()}.xlsx`
      )
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
  },
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
}
</style>
