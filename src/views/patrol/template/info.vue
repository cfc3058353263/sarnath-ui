<template>
  <div class="app-container" style="mo">
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body  
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      @close="cancel"
      >
      <el-form ref="form" :model="form"   label-width="150px">

        
        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检方案名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="巡检方案名称" maxlength="30" style="width:100%" :disabled="form.disable"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
               <el-input v-model="form.deviceTypeName" placeholder="设备类型" maxlength="30" style="width:100%" :disabled="form.disable"/>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="12">
            <el-form-item label="巡检周期" prop="cycle">
              <el-input v-model="form.cycleName" placeholder="巡检周期" maxlength="30" style="width:100%" :disabled="form.disable"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期巡检次数" prop="number">
              <el-input-number v-model="form.number" controls-position="right" :min="0" :max="99999999"  style="width:100%"  :disabled="form.disable"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="周期最短时间(天)" prop="minNumber" >
              <el-input-number v-model="form.minNumber" controls-position="right" :min="0" :max="99999999"  style="width:100%" :disabled="form.disable"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周期最长时间(天)" prop="maxNumber"  >
              <el-input-number v-model="form.maxNumber" controls-position="right" :min="0" :max="99999999"  style="width:100%" :disabled="form.disable"/>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>

      <el-card class="box-card" v-if="form.disable">
        <div slot="header" class="clearfix">
          <span>巡检表单</span>
        </div>
        <form-create v-model="formModel" :rule="formRule" :option="formOption" ></form-create>
      </el-card>


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import formCreate from "@form-create/element-ui";
Vue.use(formCreate);
import {
  listData,
  add,
  update,
  removeData,
  getInfo,
  updateStatus,
  getTmpInfo
} from "@/api/patrol/plan";
import {
  selectByType
} from "@/api/assets/device";
export default {
  name: "selecttemp",
  props:{
     // 是否显示弹出层
    open:{
      type: Boolean,
      default: false
    },
    tempId:{
      type: Number,
      default: undefined
    }
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
      isEnableCode:true,//后台是否为自动填充编号  
      // 总条数
      total: 0,
      formRule:{},
      formOption:{},
      formModel:{},
      // 用户表格数据
      dataList: null,
      deviceList:[],
      deviceSelect:undefined,
            // 设备树选项
      deviceOptions: undefined,
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      deviceTypeOptions: [], //设备类型
      statusOptions:[],//状态枚举
      tmpInfo:{},
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
    };
  },
  created() {
    var self=this;
      
    if (self.tempId) {//查询信息
      this.getTmpInfoData(self.tempId); 
    }
  },
  watch: {
    tempId: function (newVal, oldVal) {
       this.getTmpInfoData(newVal); 
    }
  },
  methods: {
    /** 查询方案详情 */
    getTmpInfoData(id) {
      this.loading = true;
      var self=this;
      getTmpInfo(id).then(response => {
        this.form = response.data;
        if(self.form.formRule){
          self.formRule=formCreate.parseJson(self.form.formRule);
        }
        if(self.form.formOption){
          self.formOption=formCreate.parseJson(self.form.formOption);
        }
        
         
        this.form.disable=true
        this.loading = false;
        
      });
    },

    // 取消按钮
    cancel() {
      var self=this;
      self.$emit('cancelInfo');
    },
 
  }
};
</script>
<style scoped>
   ::v-deep .el-step__icon{
     height: 50px;
     width:50px;
   }
   ::v-deep .el-step.is-horizontal .el-step__line{
     top:23px;
   }
   ::v-deep .el-step__icon-inner{
     font-size: 30px;
   }
   .step1{
  
     text-align: center;
     width:600px;margin:0 auto
   }
   .step2{
     width: 80%;
    margin:0 auto
   }
   
  .box-card {
    width: 100%;
    background-color:#F2F6FC;
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