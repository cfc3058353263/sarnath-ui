<template>
  <div class="app-container" style="mo">
    <el-dialog :title="title" :visible.sync="open" center width="70%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="width:100%">
        <el-tabs type="border-card" v-model="activeTab" >
        <el-tab-pane label="计划内容" name="1">
           <div class="step1">
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

                <el-form-item label="巡检周期" prop="startDate">
                  <el-input v-model="form.cycleName" placeholder="巡检周期" maxlength="30" :disabled="true" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="周期巡检次数" prop="endDate">
                  <el-input v-model="form.number" placeholder="周期巡检次数" maxlength="30" :disabled="true" />
                </el-form-item>
              </el-col>

            </el-row>

          </el-form>
        </div>

        <div class="step2">
          <div class="tag-group" style="padding:10px">
            <span class="tag-group__title">设备类型：</span>
            <el-tag :key="form.deviceTypeName" effect="dark">
              {{ form.deviceTypeName }}
            </el-tag>
          </div>

          <div style="margin-top:20px;margin-left:0px">
            <el-table v-loading="loading" :data="deviceList">
              <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
              <el-table-column width="150" label="设备编码"  key="deviceCode" prop="deviceCode" />
              <el-table-column label="设备名称"  key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
              <el-table-column label="规格"  key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
              <el-table-column label="型号"  key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
              <el-table-column label="供应商"  key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
              <el-table-column label="所属电站"  key="stationName" prop="stationName" width="160">
              </el-table-column>
            </el-table>
          </div>
        </div>
        </el-tab-pane>
        <el-tab-pane label="巡检表单" name="2">
           <form-create v-model="formModel" :rule="formRule" :option="formOption" ></form-create>  
        </el-tab-pane>
        
      </el-tabs>
       

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  listData,
  add,
  update,
  removeData,
  getInfo,
  updateStatus,
  getTmpInfo,
} from '@/api/patrol/plan'
import { selectByType } from '@/api/assets/device'
import formCreate from '@form-create/element-ui'
Vue.use(formCreate)
export default {
  name: 'planinfo',
  props: {
    // 是否显示弹出层
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '计划详情',
    },
    planId: {
      type: Number,
      default: undefined,
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
      // 日期范围
      dateRange: [],
      // 弹出层标题
      // title: "",
      deviceTypeOptions: [], //设备类型
      statusOptions: [], //状态枚举
      tmpInfo: {},
      activeTab: '1',
      formModel:{},
      formRule:[],
      formOption:{},
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
      },
    }
  },
  created() {
    var self = this

    if (self.planId) {
        //查询信息
        self.getInfoData(self.planId)
    }
  },
  watch: {
    planId: function (newVal, oldVal) {
      this.getInfoData(newVal)
    },
  },
  methods: {
    /** 查询计划详情 */
    getInfoData(id) {
      var self = this
      self.loading = true
      getInfo(id).then((response) => {
        self.form = response.data
        self.deviceList = response.deviceList
        self.formRule = formCreate.parseJson(self.form.formRule)
        self.formOption = formCreate.parseJson(self.form.formOption)

        if (self.form.templateId) {
          //查询方案信息
          self.getTmpInfoData(self.form.templateId)
        }
        self.loading = false
      })
    },
    /** 查询方案详情 */
    getTmpInfoData(id) {
      var self = this
      self.loading = true
      getTmpInfo(id).then((response) => {
        self.tmpInfo = response.data
        // if(self.tmpInfo.formRule){
        //   self.formRule=formCreate.parseJson(self.tmpInfo.formRule);
        // }
        // if(self.tmpInfo.formOption){
        //   self.formOption=formCreate.parseJson(self.tmpInfo.formOption);
        // }
        self.form.cycle = self.tmpInfo.cycle
        self.form.cycleName = self.tmpInfo.cycleName
        self.form.number = self.tmpInfo.number
        self.loading = false
      })
    },

    // 取消按钮
    cancel() {
      var self = this
      self.formModel={}
       self.formRule=[]
       self.formOption={}
      self.$emit('cancelInfo')
    },
    //切换选项卡
    changeTab(tab, event) {
      var self = this
      

      switch (self.activeTab) {
        case '1':
         
          break
        case '2':
            
          break
      }
    },
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