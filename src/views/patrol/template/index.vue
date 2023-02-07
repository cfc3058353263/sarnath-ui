<template>
  <div class="app-container">
    <el-row>
      <!--方案数据-->
      <el-col>
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="所属系统" prop="systemId">
            <el-select v-model="queryParams.systemId" placeholder="所属系统" clearable size="small" style="width: 240px">
              <el-option v-for="dict in systemList" :key="dict.id" :label="dict.name" :value="dict.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="方案名称" prop="templateName">
            <el-input v-model="queryParams.templateName" placeholder="请输入方案名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" maxlength="50" />
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small" style="width: 240px">
              <el-option v-for="dict in deviceTypeSearch" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item label="方案状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="方案状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['patrol:template:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-circle-check" size="mini" @click="handleEnable" :disabled="multiple" v-hasPermi="['patrol:template:enable']">生效</el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-circle-close" size="mini" @click="handleDisable" :disabled="multiple" v-hasPermi="['patrol:template:stop']">停用</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <!-- <el-table-column label="序号" type="index" width="50" ></el-table-column> -->
          <el-table-column width="200" label="巡检方案名称"  key="templateName" prop="templateName" :show-overflow-tooltip="true" />
          <el-table-column width="150" label="设备类型"  key="deviceTypeName" prop="deviceTypeName" :show-overflow-tooltip="true" />
          <el-table-column label="巡检周期"  key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />
          <el-table-column label="周期巡检次数"  key="number" prop="number" :show-overflow-tooltip="true" />
          <el-table-column label="巡检周期最短天数"  key="minNumber" prop="minNumber" :show-overflow-tooltip="true" />
          <el-table-column label="巡检周期最长天数"  key="maxNumber" prop="maxNumber" :show-overflow-tooltip="true" />
          <el-table-column label="最后编辑时间"  key="updateTime" prop="updateTime" :show-overflow-tooltip="true" />
           <el-table-column label="所属系统"  key="systemName" prop="systemName" :show-overflow-tooltip="true" />
          <el-table-column label="状态"  key="statusName" prop="statusName" width="160" />

          <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status==1" @click="handleUpdate(scope.row)" v-hasPermi="['patrol:template:edit']">编辑</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status==1" @click="handleDesigner(scope.row)" v-hasPermi="['patrol:template:editform']">表单设计</el-button>
              <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['patrol:template:info']">查看</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status==1" @click="handleDelete(scope.row)" v-hasPermi="['patrol:template:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">

        <el-row>
         <el-col :span="12">
            <el-form-item label="所属系统" prop="systemId">
              <el-select style="width:100%" :disabled="form.disable" filterable v-model="form.systemId" placeholder="所属系统" clearable size="small" @change="change">
                <el-option v-for="dict in systemList" :key="dict.id" :label="dict.name" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡检方案名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="巡检方案名称" maxlength="30" style="width:100%" :disabled="isEdit||form.disable" />
            </el-form-item>
          </el-col>
         
        </el-row>
        <el-row>
         <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select style="width:100%" :disabled="form.disable" filterable v-model="form.deviceType" placeholder="设备类型" clearable size="small">
                <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="巡检周期" prop="cycle">
              <el-select style="width:100%" :disabled="form.disable" v-model="form.cycle" placeholder="巡检周期" clearable size="small">
                <el-option v-for="dict in cycleOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="周期最短时间(天)" prop="minNumber">
              <el-input-number v-model="form.minNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期最长时间(天)" prop="maxNumber">
              <el-input-number v-model="form.maxNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="周期巡检次数" prop="number">
              <el-input-number v-model="form.number" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <el-card class="box-card" v-if="form.disable">
        <div slot="header" class="clearfix">
          <span>巡检表单</span>
        </div>
        <form-create v-model="formModel" :rule="formRule" :option="formOption"></form-create>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="!form.disable" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 表单弹窗 -->
    <designer ref="refdes" @cancel="cancelDesigner" :title="title" :currentObj="currentObj" @save="saveDesigner" :open="openDesigner"></designer>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  listData,
  add,
  update,
  updateForm,
  removeData,
  getInfo,
  updateStatus,
} from '@/api/patrol/template'
import designer from '@/views/components/FormDesigner/designer'
import formCreate from '@form-create/element-ui'
Vue.use(formCreate)
export default {
  name: 'template1',
  components: { designer },
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
      // 用户表格数据
      dataList: null,
      formModel: {},
      formRule: {},
      formOption: {},
      // 弹出层标题
      title: '',
      deviceTypeOptions: [], //设备类型
      cycleOptions: [], //巡检周期枚举
      statusOptions: [], //状态枚举
      // 是否显示弹出层
      open: false,
      openDesigner: false,
      currentObj: {},
      isEdit: false,
      // 表单参数
      form: {},
      systemList:[{id:1,name:"光伏运维"},{id:2,name:"风电运维"}],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        templateName: undefined,
        deviceType: undefined,
        status: undefined,
        systemId:undefined
      },
      inputVisible: false,
      inputValue: '',
      deviceTypeSolar:[],//光伏设备类型
      deviceTypeWind:[],//风场设备类型
      deviceTypeSearch:[],//所有设备类型

      // 表单校验
      rules: {
         systemId: [{ required: true, message: '请选择系统', trigger: 'blur' }],
        templateName: [{ required: true, message: '方案名称不能为空', trigger: 'blur' }],
        deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
        cycle: [{ required: true, message: '巡检周期不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '巡检周期次数不能为空', trigger: 'blur' }],
        minNumber: [{ required: true, message: '周期最短时间(天)不能为空', trigger: 'blur' }],
        maxNumber: [{ required: true, message: '周期最长时间(天)不能为空', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.handleQuery()
    var self=this;
    //巡检周期
    this.getDicts('sys_patrol_cycle').then((response) => {
      this.cycleOptions = response.data
    })
    //状态枚举
    this.getDicts('sys_scheme_status').then((response) => {
      this.statusOptions = response.data
    })
    //设备类型
      this.getDicts('sys_device_type').then((response) => {
        this.deviceTypeSolar= response.data
        self.deviceTypeSearch=self.deviceTypeSearch.concat(response.data)
      })
      //设备类型  风场
      this.getDicts('sys_device_type_wind').then((response) => {
        this.deviceTypeWind = response.data
        self.deviceTypeSearch=self.deviceTypeSearch.concat(response.data)
      })
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
      this.open = false
      this.reset()
    },

    cancelDesigner() {
      this.openDesigner = false
      this.currentObj = {}
    },

    // 表单重置
    reset() {
      this.form = {}
      this.resetForm('form')
      this.isEdit = false;
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
      var self = this
      this.reset()
      this.open = true
      this.title = '添加方案'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      var self = this
      const id = row.id
      self.isEdit = true;
      getInfo(id).then((response) => {
        self.form = response.data
        self.open = true
        self.title = '修改方案'
      })
    },
    handleDesigner(row) {
      var self = this
      self.currentObj = row
      if (self.currentObj.status == 1) {
        self.currentObj.isSave = true
      } else {
        self.currentObj.isSave = false
      }
      self.currentObj.urlType = 0 //模板标识
      self.openDesigner = true

      self.title = '【' + row.templateName + '】 表单设计'
      //调用子页面
      self.$refs.refdes.getInfoData(row.id, 0)
    },
    handleInfo(row) {
      var self = this
      const id = row.id
      getInfo(id).then((response) => {
        self.form = response.data
        self.form.disable = true
        self.formRule = formCreate.parseJson(self.form.formRule)|| []
        self.formOption = formCreate.parseJson(self.form.formOption)|| {}
        if(self.formOption){
          self.formOption.submitBtn=false
        }

        self.open = true
        self.title = '查看方案'
      })
    },

    /**启用方案 */
    handleEnable(row) {
      const selectIds = row.id || this.ids
      var params = new URLSearchParams()
      params.append('ids', selectIds)
      params.append('type', 2)
      updateStatus(params).then(() => {
        this.getList()
        this.msgSuccess('启用成功')
      })
    },
    /**停用方案 */
    handleDisable(row) {
      const selectIds = row.id || this.ids
      var params = new URLSearchParams()
      params.append('ids', selectIds)
      params.append('type', 1)

      updateStatus(params).then(() => {
        this.getList()
        this.msgSuccess('停用成功')
      })
    },
    /** 保存表单*/
    saveDesigner(obj) {
      updateForm(obj).then((response) => {
        this.msgSuccess('修改成功')
        this.openDesigner = false
        this.currentObj = {}
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.methods = this.detailList
          if (this.form.id != undefined) {
            update(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            add(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('是否确认删除方案名称为"' + row.templateName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return removeData(id)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    handleClose(tag) {
      this.detailList.splice(this.detailList.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      var self = this
      let inputValue = this.inputValue
      if (inputValue) {
        this.detailList.push({ mNo: (self.detailList.length || 0) + 1, mName: inputValue })
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /**所属系统切换 */
    change(item){
      var self = this
      delete this.form.deviceType
      self.deviceTypeOptions = {}
       if(self.form.systemId == 1) {
          //设备类型
          self.deviceTypeOptions=self.deviceTypeSolar;
        }else if(self.form.systemId ==2){
          self.deviceTypeOptions=self.deviceTypeWind;
        }else{
          this.deviceTypeOptions=[]
        }
    }
  },
}
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  background-color: #f2f6fc;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
