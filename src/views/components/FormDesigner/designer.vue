<template>
  <div class="main" ref="dialogDesigner">
    <el-dialog
      :title="title"
      :visible.sync="open"
      center
      :show-close="false"
      fullscreen
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <div  class="middle" style="height:98%"> 
       <!--表单构建器-->
        <fc-designer class="form-build" ref="designer"    >
          <template slot="handle" >
            <el-button v-if="currentObj.isSave" type="primary" @click="submitForm"  plain round icon="el-icon-edit-outline">保存</el-button>
            <el-button @click="cancel"   plain round icon="el-icon-close">关闭</el-button>
             
          </template>
        </fc-designer>
    </div>
     
    </el-dialog>
    <!--对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogState"
      :close-on-click-modal="false"
      append-to-body
    >
      <codemirror
        v-model="codemirrorContent"
        :options="codemirrorOptions"
        style="height: 90%; text-align: left; border: 1px solid #ccc"
      >
      </codemirror>
      <el-row v-if="dialogMenu">
        <el-button @click="dialogState = false">取 消</el-button>
        <el-button type="primary" @click="handleImport()">导 入</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入表单构建插件
import Vue from "vue";
import formCreate from "@form-create/element-ui";
import FcDesigner from "@form-create/designer";
Vue.use(formCreate);
Vue.use(FcDesigner);

// 引入代码编辑器
import jsonlint from "jsonlint-mod";
import { codemirror } from "vue-codemirror";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/mode/javascript/javascript.js";

import {
  getInfoPlan,
  getInfo
} from "@/api/patrol/template";
export default {
  name: "designer",
  components: {
    codemirror,
  },
  props: {
    // 是否显示弹出层
    open: {
      type: Boolean,
      default: false,
    },
    currentObj: {},
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogTitle: "", // 对话框标题
      dialogState: false, // 对话框状态
      dialogMenu: false, // 对话框菜单状态

      // codemirror配置
      codemirrorOptions: {
        mode: "application/json",
        theme: "default",
        gutters: ["CodeMirror-lint-markers"],
        tabSize: 2,
        lint: true,
        line: true,
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true,
        styleActiveLine: true,
        readOnly: false,
      },
      // codemirror内容
      codemirrorContent: null,
    };
  },
  beforeCreate() {
    // 开启JSON校验
    window.jsonlint = jsonlint;
  },
created(){

},
  methods: {
    /** 查询计划详情 */
    getInfoData(id,type) {
      var self=this;
      this.loading = true;
      if(id&&type==0){
        getInfo(id).then(response => {
            if(response.data.formRule){
              this.$refs.designer.setRule(response.data.formRule)
            }
            // if(response.data.formOption){
            //   this.$refs.designer.setOption(response.data.formOption)
            // }
        
        });
      }else if(id&&type==1){
          getInfoPlan(id).then(response => {
              if(response.data.formRule){
                this.$refs.designer.setRule(response.data.formRule)
              }
              // if(response.data.formOption){
              //   this.$refs.designer.setOption(response.data.formOption)
              // }
        
        });
      }
      
    },
    submitForm() {
      var self = this;
      self.currentObj.formRule = JSON.stringify(self.$refs.designer.getRule(),null,2);
      self.currentObj.formOption= JSON.stringify(self.$refs.designer.getOption(),null,2);
      self.$emit("save", self.currentObj);
      self.$refs.designer.setRule([])
    },
    // 取消按钮
    cancel() {
      var self = this;
      self.$emit("cancel");
      self.$refs.designer.setRule([])
    },
    // 导出表单JSON
    handleDownloadRule() {
      this.dialogTitle = "表单规则";
      this.dialogState = true;
      this.dialogMenu = false;

      this.codemirrorOptions.readOnly = true;
      this.codemirrorContent = JSON.stringify(
        this.$refs.designer.getRule(),
        null,
        2
      );
      this.currentObj.formData = JSON.stringify(
        this.$refs.designer.getRule(),
        null,
        2
      );
    },
    // 导出表单配置
    handleDownloadOption() {
      this.dialogTitle = "表单配置";
      this.dialogState = true;
      this.dialogMenu = false;

      this.codemirrorOptions.readOnly = true;
      this.codemirrorContent = JSON.stringify(
        this.$refs.designer.getOption(),
        null,
        2
      );
    },
    // 导入表单JSON
    handleUploadRule() {
      this.dialogTitle = "导入表单规则";
      this.dialogState = true;
      this.dialogMenu = true;

      this.codemirrorOptions.readOnly = false;
      this.codemirrorContent = JSON.stringify([], null, 2);
    },
    // 导入表单配置
    handleUploadOption() {
      this.dialogTitle = "导入表单配置";
      this.dialogState = true;
      this.dialogMenu = true;

      this.codemirrorOptions.readOnly = false;
      this.codemirrorContent = JSON.stringify({}, null, 2);
    },
    // 配置导入
    handleImport() {
      try {
        let content = JSON.parse(this.codemirrorContent);
        if (this.dialogTitle == "导入表单规则") {
          this.$refs.designer.setRule(content);
        }
        if (this.dialogTitle == "导入表单配置") {
          this.$refs.designer.setOptions(content);
        }
        this.dialogState = false;
      } catch (e) {
        alert("输入内容格式有误!");
      }
    },
  },
};
</script>
<style scoped>
::v-deep .el-dialog.is-fullscreen {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
::v-deep .el-dialog--center .el-dialog__body{
    height: 100%;
     padding: 0 !important;

}
::v-deep .el-el-dialog__footer{
    height: 0px;
    display: none;
    padding: 0 !important;
}
.aside{
    margin-bottom: 0px !important;
}
</style>
