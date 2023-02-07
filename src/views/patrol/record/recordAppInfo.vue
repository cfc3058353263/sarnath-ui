<template>
  <div class="app-container">
    <form-create :rule="formRule" v-model="fModel" :option="option" :value.sync="formData" />
    <div class="buttonStyle">
      <el-button @click="cancel" type="primary">关 闭</el-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import formCreate from '@form-create/element-ui'
import axios from 'axios'
Vue.use(formCreate)
export default {
  name: 'recordInfoappi',
  components: {},
  data() {
    return {
      recordId: undefined,
      stationid: undefined,
      token: '',
      fModel: {},
      formRule: [],
      formData: {},
      formOption: {},
      // 组件参数配置
      option: {
        // 显示重置表单按扭
        resetBtn: false,
        submitBtn: false,
        form:{disabled: false} //表单控件是否禁用
      },
      mapData: {}, //上传组件集合
    }
  },
  created() {
    this.recordId = this.$route.query && this.$route.query.recordId
    this.stationid = this.$route.query && this.$route.query.stationid
    this.token = this.$route.query && this.$route.query.token

    //获取表单数据
    this.handleInfo()
  },
  mounted() {},
  methods: {
    cancel() {
      var self = this
      uni.postMessage({
        data: {
          action: 'close',
        },
      })
    },

    getTypeForRule(rule) {
      var result = []
      if (rule) {
        rule.forEach((item) => {
          //不是数组
          if (item.type == 'upload') {
            result.push(item)
          }
          if (item.children) {
            var tempArray = this.getTypeForRule(item.children)
            result.push(...tempArray)
          }
          //是数组
          if (item.length > 0 && item && typeof item == 'object') {
            item.forEach((child) => {
              var tempArray = this.getTypeForRule(child)
              result.push(...tempArray)
            })
          }
        })
      }
      return result
    },

    //根据设备计划id,查询计划表单
    handleInfo() {
      var self = this

      var url =
        process.env.VUE_APP_BASE_API + '/system/patrolPlanRecord/recordInfo?id=' + this.recordId
      axios
        .get(url, {
          // params:{planId:this.planId,stationid:this.stationid},
          headers: { Authorization: 'Bearer ' + this.token },
        })
        .then((res) => {
          var rule=formCreate.parseJson(res.data.data.formRule)|| []
          
          if (rule) {
            var result = this.getTypeForRule(rule)
            if (result && result.length > 0) {
              result.forEach((item) => {
                item.props.headers = { Authorization: 'Bearer ' + this.token }
                //  item.props.action=process.env.VUE_APP_BASE_API+'/file/upload';
                item.props.listType = 'picture-card'
                item.props.showFileList = true
                item.props.autoUpload = false
                item.props.disabled = true
                //  item.props.onSuccess=function (res, file,fileList) {//拼接照片
                //     file.filePath = res.data.url;
                //     Vue.set(self.mapData,item.field,fileList)

                // }
              })
            }
            this.formRule = rule
            // //禁用表单
            // if (self.formRule) {
            //   self.formRule = self.formRule.map((x) => {
            //     if (x.props) {
            //       x.props.disabled = true
            //     } else {
            //       x.props = { disabled: true }
            //     }

            //     return x
            //   })
            // }
            var fData = formCreate.parseJson(res.data.data.formData || '{}')


            //根据路径去后台获取预览图片地址
            result.forEach((item) => {
              var pathList = fData[item.field]

              var query = { pathList: pathList }
              //根据list集合去后台获取预览地址

        var preViewUrl=process.env.VUE_APP_BASE_API + '/file/previewList'
              axios.post(preViewUrl, query,{
                  headers: { Authorization: 'Bearer ' + this.token },
                }).then((reitem) => {
                  fData[item.field] = reitem.data.data
                  self.formData = fData

                  self.title = '巡检内容'
                })


 
            })
          }
        })
        .catch(function (error) {
          alert(error)
          // uni.redirectTo('/pages/operation/patrol/record/recordList')
        })
    },
  },
}
</script>
<style scoped>
  .buttonStyle{
    text-align: center;
  }
</style>
