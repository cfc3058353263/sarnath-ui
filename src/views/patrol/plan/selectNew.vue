<template>
  <div class="app-container" style="mo">
    <el-steps :active="active" finish-status="success" style="padding:10px 30px 10px 30px">
      <el-step title="新建计划"></el-step>
      <el-step title="巡检内容"></el-step>
      <el-step title="计划预览"></el-step>
    </el-steps>

    <div style="width:100%">
      <div v-if="active==0" class="step1">
        <div class="tag-group" style="padding:10px" v-if="form.id!=null">
          <span class="tag-group__title">选择的方案：</span>
          <el-popover placement="top-start" width="80" trigger="hover" content="点击查看详情">

          </el-popover>

        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="编号" prop="planCode">
            <el-input v-model="form.planCode" placeholder="编号" :disabled="isEnableCode" maxlength="50" />
          </el-form-item>

          <el-form-item label="巡检计划名称" prop="planName">
            <el-input v-model="form.planName" placeholder="巡检计划名称" maxlength="30" />
          </el-form-item>

          <el-form-item label="计划开始时间" prop="startDate">
            <el-date-picker style="width:100%" v-model="form.startDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="计划结束时间" prop="endDate">
            <el-date-picker style="width:100%" v-model="form.endDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>

          <el-form-item label="设备类型" prop="deviceType">
            <el-select style="width:100%" :disabled="form.disable" filterable v-model="form.deviceType" placeholder="设备类型" clearable size="small" @change="changeDeviceType">
              <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item label="巡检周期" prop="cycle">
            <el-select style="width:100%" :disabled="form.disable" v-model="form.cycle" placeholder="巡检周期" clearable size="small">
              <el-option v-for="dict in cycleOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item label="周期巡检次数" prop="number">
            <el-input-number v-model="form.number" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
          </el-form-item>

          <el-form-item label="周期最短时间(天)" prop="minNumber">
            <el-input-number v-model="form.minNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
          </el-form-item>
          <el-form-item label="周期最长时间(天)" prop="maxNumber">
            <el-input-number v-model="form.maxNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="form.disable" />
          </el-form-item>

        </el-form>
      </div>
      <div v-if="active==2" class="step1">
        <el-form ref="form1" :model="form" :rules="rules" label-width="150px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编号" prop="planCode">
                <el-input v-model="form.planCode" placeholder="编号" :disabled="true" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="巡检计划名称" prop="planName">
                <el-input v-model="form.planName" placeholder="巡检计划名称" maxlength="30" :disabled="true" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">

              <el-form-item label="计划开始时间" prop="startDate">
                <el-date-picker style="width:100%" :disabled="true" v-model="form.startDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择开始时间"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划结束时间" prop="endDate">
                <el-date-picker style="width:100%" :disabled="true" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="form.endDate" type="date" placeholder="选择结束时间"></el-date-picker>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">

              <el-form-item label="巡检周期" prop="cycle">
                <el-select style="width:100%" v-model="form.cycle" placeholder="巡检周期" clearable size="small" :disabled="true">
                  <el-option v-for="dict in cycleOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="周期巡检次数" prop="endDate">
                <el-input v-model="form.number" placeholder="周期巡检次数" maxlength="30" :disabled="true" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="周期最短时间(天)" prop="minNumber">
                <el-input-number v-model="form.minNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="true" />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="周期最长时间(天)" prop="maxNumber">
                <el-input-number v-model="form.maxNumber" controls-position="right" :min="0" :max="99999999" style="width:100%" :disabled="true" />
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>
      </div>

      <div v-if="active!=0" class="step2">
        <div class="tag-group" style="padding:10px">
          <span class="tag-group__title">设备类型：</span>
          <el-tag :key="deviceTypeName" effect="dark">
            {{ deviceTypeName }}
          </el-tag>
        </div>

        <div class="tag-group" style="padding: 10px 10px 20px 10px;" v-if="active==1">
          <span class="tag-group__title" style="float:left;padding:5px">选择设备：</span>
          <!-- <el-select style="float: left;margin-left:20px;" v-model="deviceSelect" placeholder="请选择设备" clearable filterable size="small">
            <el-option v-for="dict in deviceOptions" :key="dict.deviceId" :label="dict.deviceName" :value="dict.deviceId" />
          </el-select> -->
  <el-button style="float: left;margin-left:20px;" type="primary" plain icon="el-icon-plus" v-if="!form.disable" class="button-new-tag" size="small" @click="openSelectDev">选择设备</el-button>
          <!-- <el-button style="float: left;margin-left:20px;" type="primary" plain icon="el-icon-plus" v-if="!form.disable" class="button-new-tag" size="small" @click="addRow">增加</el-button> -->
           <el-button style="float: left;margin-left:20px;" type="danger" plain icon="el-icon-delete" v-if="!form.disable" class="button-new-tag" size="small" @click="deleteDevList">批量删除</el-button>
        </div>
        <div v-if="active!=0" style="margin-top:20px;margin-left:0px">
          <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column width="150" label="设备编码" align="center" key="deviceCode" prop="deviceCode" />
            <el-table-column label="设备名称" key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
            <el-table-column label="型号" key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
            <!-- <el-table-column
            label="设备类型"

            key="deviceTypeName"
            prop="deviceTypeName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备状态"

            key="statusName"
            prop="statusName"
            :show-overflow-tooltip="true"
          /> -->
            <el-table-column label="供应商" key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
            <el-table-column label="所属电站" key="stationName" prop="stationName" width="160">
            </el-table-column>
            <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width" v-if="active==1">
              <template slot-scope="scope">

                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="active==1">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div slot="footer" class="footer step1" style="margin-top:40px;">
        <el-button type="primary" v-if="active!=0" @click="upForm" style="width:200px;">上一步</el-button>
        <el-button v-if="active!=2" type="success" @click="nextForm" style="width:200px;">下一步</el-button>
        <el-button v-if="active==2" type="success" @click="submitForm" style="width:200px;">完成</el-button>
      </div>

    </div>


    
    <!-- 选择设备 -->
    <el-dialog title="选择设备" :visible.sync="openDev" width="850"  append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
       <el-row>
        <el-col>
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="设备名称" prop="filterDeviceName">
              <el-input v-model="filterDeviceName" placeholder="请输入设备名称" clearable size="small" style="width: 240px"  maxlength="50" />
            </el-form-item>
           <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="filterQuery">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
        <el-table v-loading="loading" ref="selectTable"   height="600px" :data="deviceOptions" @selection-change="handleSelectionDev">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column width="160"  label="设备编码" key="deviceCode" prop="deviceCode" >
               <template slot-scope="scope">
              <span style="padding-right:5px">{{scope.row.deviceCode}}</span>
              <el-tag type="primary" v-if="getselectId.indexOf(scope.row.deviceId)!=-1" disable-transitions>选</el-tag>
            </template>
             </el-table-column>
            <el-table-column label="设备名称" key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
            <el-table-column label="规格" key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
            <el-table-column label="型号" key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
            <el-table-column   label="供应商" key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
            <el-table-column label="所属电站" key="stationName" prop="stationName" >
            </el-table-column>
          </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="OpenDevOk">确 定</el-button>
        <el-button @click="cancelOpenDev">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { listData, add, update, removeData, getInfo, updateStatus } from '@/api/patrol/plan'
import { selectByType } from '@/api/assets/device'
import { getIsEnableCode } from '@/api/utils'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'selectNew',
  components: { Treeselect },
  data() {
    return {
      active: 0,
      filterDeviceName:undefined,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      idsSelect:[],
      openDev:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      isEnableCode: true, //后台是否为自动填充编号
      // 总条数
      total: 0,
      // 用户表格数据
      dataList: null,
      deviceList: [],
      deviceSelect: undefined,
      // 设备树选项
      deviceOptions: undefined,
      devicePublicOtions:undefined,
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: '',
      deviceTypeOptions: [], //设备类型
      statusOptions: [], //状态枚举
      cycleOptions: [], //巡检周期枚举
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        planName: undefined,
        deviceType: undefined,
        status: undefined,
      },
      inputVisible: false,
      inputValue: '',

      // 表单校验
      rules: {
        planCode: [{ required: true, message: '计划编号不能为空', trigger: 'blur' }],
        planName: [{ required: true, message: '计划名称不能为空', trigger: 'blur' }],
        startDate: [{ required: true, message: '计划开始时间不能为空', trigger: 'blur' }],
        endDate: [{ required: true, message: '计划结束时间不能为空', trigger: 'blur' }],
        deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
        cycle: [{ required: true, message: '巡检周期不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '巡检周期次数不能为空', trigger: 'blur' }],
        minNumber: [{ required: true, message: '周期最短时间(天)不能为空', trigger: 'blur' }],
        maxNumber: [{ required: true, message: '周期最长时间(天)不能为空', trigger: 'blur' }],
      },
    }
  },
 
  created() {
    var self = this
    const id = this.$route.query && this.$route.query.id
    if (id) {
      //查询信息
      this.getInfoData(id)
      // this.form.id=id;
    } else {
      //传入计划编码查询是否启用了自动编号
      getIsEnableCode(7).then((res) => {
        self.isEnableCode = res.data
        if (self.isEnableCode) {
          self.rules.planCode[0].required = false //去掉计划编码验证
        }
      })
    }

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
    //巡检周期
    this.getDicts('sys_check_cycle').then((response) => {
      this.cycleOptions = response.data
    })
    //状态枚举
    this.getDicts('sys_scheme_status').then((response) => {
      this.statusOptions = response.data
    })
  },
  computed: {
    deviceTypeName() {
      //得到设备类型名称
      if (this.form.deviceType) {
        var device = this.deviceTypeOptions.find((x) => x.dictValue == this.form.deviceType)
        if (device) {
          return device.dictLabel
        }
      }
    },
    getselectId(){
      return this.deviceList.map(x=>x.deviceId)
    }
  },
  methods: {
    /** 查询计划详情 */
    getInfoData(id) {
      this.loading = true
      var self=this;
      getInfo(id).then((response) => {
        self.form = response.data
         
        self.deviceList = response.deviceList || []
        self.loading = false
      })
    },

    /** 查询设备下拉树结构 */
    getTreeselect(type) {
      var self=this
      selectByType(type).then((response) => {
        self.deviceOptions = response.data
        self.devicePublicOtions=response.data
      })
    },
    /** 查询列表 */
    getList() {
      this.loading = true
      var self=this
      listData(this.addDateRange(self.queryParams, self.dateRange)).then((response) => {
        self.dataList = response.rows
        self.total = response.total
        self.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    addRow() {
      if (this.deviceSelect) {
        var obj = this.deviceOptions.find((x) => x.deviceId == this.deviceSelect)
        var check = this.deviceList.find((x) => x.deviceId == obj.deviceId)
        if (check) {
          this.msgError('该设备已存在！')
          return
        }
        this.deviceList.push(obj)
        this.deviceSelect = undefined
      }
    },
    changeDeviceType(){//设备类型改变，情况设备列表
       this.deviceList=[]
    },
    // 表单重置
    reset() {
      this.form = {}
      this.resetForm('form')
    },
    upForm() {
      var self = this
      self.active = self.active - 1
    },
    nextForm() {
      var self = this
      if (this.active == 0) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            self.getTreeselect(this.form.deviceType)
            //清空
            // this.deviceList=[]
            self.active = 1
          }
        })
      } else if (this.active == 1) {
        if (this.deviceList.length > 0) {
          self.active = 2
        } else {
          this.msgError('请至少选择一个设备！')
        }
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.deviceList) {
        this.form.devices = this.deviceList.map((x) => {
          return { deviceId: x.deviceId }
        })
      }
      if (this.form.id != undefined) {
        update(this.form).then((response) => {
          this.msgSuccess('修改成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'plan' })
        })
      } else {
        add(this.form).then((response) => {
          this.msgSuccess('新增成功')
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'plan' })
        })
      }
    },
    selectPlan(type) {
      //1 模板，2计划
      this.currentType = type
      this.dialogVisible = false
      this.open = true
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var self = this
      const id = row.id || this.ids
      this.$confirm('是否确认删除设备为"' + row.deviceName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(function () {
        self.deviceList.splice(self.deviceList.indexOf(row), 1)
      })
    },
        // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.deviceId)
      
    },
    deleteDevList() {
      var self=this;
       this.ids.forEach(ite=>{
        self.deviceList.some((item, i) => {
          if (item.deviceId == ite) {
            self.deviceList.splice(i, 1) //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
          }
        })
       })
      
    },
    openSelectDev(){
      this.openDev=true;

    },
    cancelOpenDev(){
      this.openDev=false;
      this.idsSelect=[];
    },
    OpenDevOk(){
      var self=this;
      this.openDev=false;
      if (this.idsSelect.length>0) {
        this.deviceOptions.forEach(item=>{
          if(self.idsSelect.indexOf(item.deviceId)!=-1){
             var check = self.deviceList.find((x) => x.deviceId == item.deviceId)
              if (!check) {
                  self.deviceList.push(item)
              }
          }
        })
        self.idsSelect=[]
        self.$refs.selectTable.clearSelection();
       
      }
    },
    handleSelectionDev(selection) {
      this.idsSelect = selection.map((item) => item.deviceId)
    },
    filterQuery(){
      var self=this;
      if(this.filterDeviceName&&this.filterDeviceName.trim()){
        this.deviceOptions=this.devicePublicOtions.filter(x=>{
          return x.deviceName.includes(self.filterDeviceName.trim())
        })
      }else{
        this.deviceOptions=this.devicePublicOtions
      }
      
    }

  },
}
</script>
<style scoped>
::v-deep .el-step__icon {
  height: 50px;
  width: 50px;
}
::v-deep .el-step.is-horizontal .el-step__line {
  top: 23px;
}
::v-deep .el-step__icon-inner {
  font-size: 30px;
}
.step1 {
  text-align: center;
  width: 600px;
  margin: 0 auto;
}
.step2 {
  width: 80%;
  margin: 0 auto;
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
