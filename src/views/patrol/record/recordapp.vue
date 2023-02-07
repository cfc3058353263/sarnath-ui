<template>
  <div class="app-container">
       <!-- <form-create></form-create> -->
        
        <form-create v-model="formModel" :rule="formRule" :option="option"></form-create>
    
         
  </div>
</template>
<script>
import Vue from 'vue'
import formCreate from '@form-create/element-ui'
import axios from 'axios'
Vue.use(formCreate)
export default {
  name: 'recordInfoapp',
  components:{},
  data() {
    return {
       planId:undefined,
       stationid:undefined,
       token:"",
       formModel: {},
       formRule: [],
       formOption: {},
      // 表单生成规则数组对象  生成规则：http://www.form-create.com/v2/guide/rule.html
      // 生成规则数组中一个对象就是一个表单项（是一个json对象），在里面可以对应的表单名称、类型、属性、值、样式、类名、是否必填、错误提示等。
      rule: [
        {
          type: "input", // 生成组件的名称(就是表单的名称：如input，radio，checkbox，select，slider等)
          field: "userName", // 表单组件的字段名称(就是表单的name属性，注：该必须唯一),自定义组件可以不配置
          className: "user-name-dom", // 设置组件的class属性
          title: "用户名称：", // 组件的名称, 选填
          value: "", // 表单组件的字段值(就是表单的value值),自定义组件可以不用设置
          props: {
            placeholder: "请输入用户名称！",
            disabled: false,
            readonly: false,
            clearable: true // 是否显示清空按钮
          },
          validate: [
            {
              trigger: "blur",
              required: true,
              message: "用户名称不能为空！"
            }
          ],
          col: {
            md: { span: 12 }
          }
        },
 
        {
          type: "input",
          field: "password",
          title: "用户密码：",
          value: "666",
          props: {
            // input的表单类型 <input type="">：注：有些表单类型form-create和element-ui专门做成了组件，可以在上面的type中直接用，所以下面有些类型如（radio）在这里会无效哦！！
 
            // text	默认。定义单行输入字段，用户可在其中输入文本。默认是 20 个字符。
            // button	定义可点击的按钮（大多与 JavaScript 使用来启动脚本）
            // checkbox	定义复选框。
            // color	定义拾色器。
            // date	定义日期字段（带有 calendar 控件）
            // datetime	定义日期字段（带有 calendar 和 time 控件）
            // datetime-local	定义日期字段（带有 calendar 和 time 控件）
            // month	定义日期字段的月（带有 calendar 控件）
            // week	定义日期字段的周（带有 calendar 控件）
            // time	定义日期字段的时、分、秒（带有 time 控件）
            // email	定义用于 e-mail 地址的文本字段
            // file	定义输入字段和 "浏览..." 按钮，供文件上传
            // hidden	定义隐藏输入字段
            // image	定义图像作为提交按钮
            // number	定义带有 spinner 控件的数字字段
            // password	定义密码字段。字段中的字符会被遮蔽。
            // radio	定义单选按钮。
            // range	定义带有 slider 控件的数字字段。
            // reset	定义重置按钮。重置按钮会将所有表单字段重置为初始值。
            // search	定义用于搜索的文本字段。
            // submit	定义提交按钮。提交按钮向服务器发送数据。
            // tel	定义用于电话号码的文本字段。
            // url	定义用于 URL 的文本字段。
 
            type: "password",
            placeholder: "请输入用户密码！"
          },
          col: {
            md: { span: 12 }
          }
        },
 
        {
          type: "input",
          field: "summary",
          title: "个人简介：",
          value: "",
          props: {
            type: "textarea",
            rows: 3,
            placeholder: "请输入个人简介！"
          }
        },
 
        {
          type: "radio",
          field: "sex",
          title: "性 别：",
          value: 0,
          options: [
            { label: "先 生", value: 1 },
            { label: "女 士", value: 2 },
            { label: "人 妖", value: 3, disabled: true },
            { label: "未 知", value: 0 }
          ]
        },
 
        {
          type: "checkbox",
          field: "hobby",
          title: "爱 好：",
          value: [1, 3],
          options: [
            { label: "吃喝", value: 1 },
            { label: "上班", value: 2, disabled: true },
            { label: "旅游", value: 3 },
            { label: "运动", value: 4 },
            { label: "学习", value: 5, disabled: true }
          ]
        },
 
        {
          type: "select",
          field: "address",
          title: "想去哪里：",
          value: 6,
          col: {
            //   sx: {span: 24}
            md: { span: 10 }
          },
          options: [
            { label: "内国走走", value: 1 },
            { label: "呆在公司", value: 2, disabled: true },
            { label: "非洲美洲", value: 3 },
            { label: "港澳台游", value: 4 },
            { label: "东南亚游", value: 5 },
            { label: "澳洲旅游", value: 6 },
            { label: "自驾游", value: 7 }
          ]
        },
 
        {
          type: "select",
          field: "address2",
          title: "想多选点：",
          value: [3, 5],
          col: {
            md: { span: 14 }
          },
          props: {
            multiple: true,
            placement: "bottom"
          },
          options: [
            { label: "内国走走", value: 1 },
            { label: "呆在公司", value: 2, disabled: true },
            { label: "非洲美洲", value: 3 },
            { label: "港澳台游", value: 4 },
            { label: "东南亚游", value: 5 },
            { label: "澳洲旅游", value: 6 },
            { label: "自驾游", value: 7 }
          ]
        }
      ],
 
      // 组件参数配置
      option: {
        // 显示重置表单按扭
        resetBtn: true,
        // onSubmit:formData =>{
        //   //  //按钮进入提交状态
        //   //   fApi.btn.loading();
        //   //    //重置按钮禁用
        //   //   fApi.resetBtn.disabled();
        //   //TODO ajax提交表单
        //    this.postMsg(formData)
        // },
         
        // 表单提交按扭事件
        onSubmit: formData => {
            this.postMsg(formData)
          // console.log("获取表单中的数据：", formData);
 
          //按钮进入提交状态
          //   this.fApi.btn.loading();
 
          //重置按钮禁用
          //   this.fApi.resetBtn.disabled();
 
          //按钮进入可点击状态
          //   this.fApi.btn.finish();
        }
      
       
      },
      mapData:{},//上传组件集合
 
 


    }
  },
  created() {
      this.planId = this.$route.query && this.$route.query.planId;
      this.stationid = this.$route.query && this.$route.query.stationid;
      this.token=this.$route.query && this.$route.query.token;
      
      //获取表单数据
      this.getForm();
  },
  mounted () {
    const id = this.$route.query.id
    this.$nextTick(()=>{
      document.addEventListener('UniAppJSBridgeReady', function() {  
        uni.getEnv(function(res) {  
          // console.log('当前环境：' + JSON.stringify(res));  
        });  
      });
    })
  },
  methods: {
     postMsg(formdata){
       var self=this;
       if(self.mapData&&Object.keys(self.mapData).length>0){//说明有上传图片控件，启动上传，取出上传后的路径
        Object.keys(self.mapData).forEach(item => {
          var fileList=self.mapData[item];
          if(fileList){
            //替换上传后的路径
             var imgList=fileList.map(x=>{
              return x.filePath
            });
             Vue.set(formdata, item, imgList)
          }
        });
          
       }
         formdata=JSON.stringify(formdata)
        uni.postMessage({  
            data: {  
                action: formdata
            }  
        });  
    },
    //根据设备计划id,查询计划表单
    getForm(){
      var self=this;

      var url=process.env.VUE_APP_BASE_API+"/system/patrolPlan/getPlanForm?planId="+this.planId
      axios.get(url,{
                        // params:{planId:this.planId,stationid:this.stationid},
                        headers: {'Authorization': 'Bearer ' + this.token }
                    }).then((res)=>{
                        // this.formOption=res.data.data.formOption
                        var rule=formCreate.parseJson(res.data.data.formRule)|| []
                        if(rule){
                          var result=this.getTypeForRule(rule)
                          if(result&&result.length>0){
                            result.forEach(item=>{
                              item.props.headers={Authorization: "Bearer " + this.token}
                               item.props.action=process.env.VUE_APP_BASE_API+'/file/upload';
                               item.props.listType="picture-card";
                               item.props.showFileList=true
                               item.props.autoUpload=true;
                               item.props.onSuccess=function (res, file,fileList) {//拼接照片
                                  file.filePath = res.data.url;
                                  Vue.set(self.mapData,item.field,fileList)
                                  
                              }
                              // result[0].props.onRemove=function (file, fileList) {//删除照片
                              //     file.url = res.data.url;
                              //     // self.imgList.slice(file)
                              // }
                            });
                          }
                          this.formRule=rule;
                        }
                    }).catch(function (error) {
                    　　 alert(error);
                        uni.redirectTo("/pages/operation/patrol/device/index");
      });
    },

    getTypeForRule(rule){
      var result=[];
      if(rule){
        rule.forEach(
            item=>{
              //不是数组
            if(item.type=="upload"){
              result.push(item);
            }
            if(item.children){
              var tempArray=this.getTypeForRule(item.children);
              result.push(...tempArray)
            }
            //是数组
            if(item.length>0&&item&&typeof item=="object"){
              item.forEach(child=>{
                 var tempArray=this.getTypeForRule(child);
                result.push(...tempArray)
              })
              
            }
            }
        )
      }
      return result;
    }
  },
}
</script>
<style scoped>
 
</style>
