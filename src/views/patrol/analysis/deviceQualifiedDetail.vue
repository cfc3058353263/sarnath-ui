<template>
  <div class="app-container">
    <!-- 查询条件 -->
    <el-form :model="queryParams" ref="queryParams" :rules="rules" :inline="true" label-width="90px" v-show="showSearch">
     <!-- <el-form-item label="所属电站" prop="stationIds">
            <station-Checkbox :stations="queryParams.stationIds" @getStations="getStations"></station-Checkbox>
      </el-form-item> -->
      <el-form-item prop="deviceStatus" label="设备状态">
        <el-select v-model="queryParams.deviceStatus" placeholder="设备状态" clearable size="small" style="width:100%">
          <el-option v-for="dict in deviceStatusList" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="queryParams.deviceType" placeholder="设备类型" clearable size="small" style="width: 240px">
          <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item prop="startDate" label="开始时间">
        <el-date-picker v-model="queryParams.startDate" @change="changeStart" type="date" :clearable="false" size="small" style="margin-right:10px;width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="endDate" label="结束时间">
        <el-date-picker v-model="queryParams.endDate" @change="changeEnd" type="date" :clearable="false" size="small" :picker-options="endDate" style="width:150px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" maxlength="50" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>

      </el-form-item>
      <el-form-item>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['patrol:analysis:export']">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件 -->

    <!-- 按钮.... -->
    <!-- table -->
    <el-table v-loading="loading" :data="dataList" :row-class-name="rowClassName">

      <el-table-column label="电站名称" prop="stationName" :show-overflow-tooltip="true" />
      <el-table-column label="巡检时间" prop="optTime" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" prop="deviceName" :show-overflow-tooltip="true" />
      <el-table-column label="巡检编号" prop="id" :show-overflow-tooltip="true" />
      <el-table-column label="设备编号" prop="deviceCode" :show-overflow-tooltip="true" />
      <el-table-column label="巡检人" prop="optUserName" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['assets:spare:ledger:info']">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table -->
     <pagination v-show="total > 0" :total="total" :page.sync="query.pageNum" :limit.sync="query.pageSize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <form-create :rule="formRule" v-model="fModel" height="600px" :option="options" :value.sync="formData" />
      </div>

      <div slot="footer" align="center" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import stationCheckbox from '@/views/components/stationCheckbox'
import excelImport from '@/views/components/ExcelImport'
import { listDetailData } from '@/api/patrol/deviceQualified.js'
import formCreate from '@form-create/element-ui'
Vue.use(formCreate)
export default {
  name: 'deviceQualifiedDetail',
  components: {
    stationCheckbox,
    excelImport,
  },
  data() {
    let self = this
    return {
      endDate: {
        disabledDate(time) {
          return (
            self.moment(time.getTime()).diff(self.moment(self.queryParams.startDate), 'day') < 0
          )
        },
      },
      showSearch: true,
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        startDate: null,
        endDate: null,
        stationIds: [],
        deviceStatus: undefined,
        deviceName: undefined,
      },
      query:{},
      dataList: [],
      deviceStatusList: [
        { label: '正常', value: "1" },
        { label: '异常', value: "2" },
      ],
      //设备类型
      deviceTypeOptions: [],
      open: false,
      options: {
        submitBtn: false,
        form: { disabled: false }, //表单控件是否禁用
      },
      fModel: {},
      formRule: [],
      formData: {},
      // 弹出层标题
      title: '',
       // 表单校验
        rules: {
            stationIds: [{ required: true, message: '请至少选择一个电站', trigger: 'blur' }],
            startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
            endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
        },
    }
  },
  created() {
    var para
    if (this.$route.query ) {
      para = this.$route.query
    }
    if (para) {
      this.queryParams.stationIds = para.stationIds.map(Number)
    } else {
      this.queryParams.stationIds[this.$store.getters.currentStation]
    }

    this.queryParams.startDate = para.startDate
    this.queryParams.endDate = para.endDate
    this.queryParams.deviceStatus = para.deviceStatus || undefined

    // 根据systemId获取对应的字典列表
    if (this.$store.getters.currentSystem == 1) {
      this.getDicts('sys_device_type').then((response) => {
        this.deviceTypeOptions = response.data
      })
    } else {
      this.getDicts('sys_device_type_wind').then((response) => {
        this.deviceTypeOptions = response.data
      })
    }

    this.queryParams.pageNum = 1
    this.query = JSON.parse(JSON.stringify(this.queryParams));
    //执行第一次查询
    this.getList()
  },
  methods: {
    /**获取你已选中的电站 */
    getStations(res) {
      this.queryParams.stationIds = res
    },
    //分页
    getList() {
      this.loading = true
      listDetailData(this.query).then((res) => {
        this.dataList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    //查询
    search() {
      this.$refs['queryParams'].validate((valid) => {
        if (valid) {
          if (
            this.moment(this.queryParams.endDate).diff(
              this.moment(this.queryParams.startDate),
              'day'
            ) < 0
          ) {
            this.msgError('日期区间结束时间不得早于开始时间')
          } else {
            this.queryParams.pageNum = 1
            this.query = JSON.parse(JSON.stringify(this.queryParams));
            this.getList()
          }
        }
      })
    },
    /**时间选择 */
    changeStart(date) {
      this.queryParams.endDate = null
      
    },
    changeEnd(date) {
      this.queryParams.endDate = this.moment(date).format('YYYY-MM-DD')
    },
    /**日期类型选 */
    changeSelect(value) {
      this.queryParams.startDate = null
      this.queryParams.endDate = null
    },
    handleExport() {
         this.download(
                'system/patrolPlanRecord/qualifiedDetailExport',
                {
                ...this.queryParams,
                },
                `device_${new Date().getTime()}.xlsx`
            )
    },
    cancel() {
      // 取消按钮
      this.open = false
      this.formRule = []
      this.formData = {}
    },
    handleInfo(row) {
      var self = this
      self.open = true
      self.title = row.deviceName
      var rule = Object.assign([], formCreate.parseJson(row.formRule || '[]'))
      this.formRule = rule
      this.formData = formCreate.parseJson(row.formData || '{}')
      // if(rule){
      //     var result=this.getTypeForRule(rule)
      //         // if(result&&result.length>0){
      //         //     result.forEach(item=>{
      //         //         item.props.headers={Authorization: "Bearer " + this.token}
      //         //         //  item.props.action=process.env.VUE_APP_BASE_API+'/file/upload';
      //         //         item.props.listType="picture-card";
      //         //         item.props.showFileList=true
      //         //         item.props.autoUpload=false;
      //         //         item.props.disabled=true;
      //         //         //  item.props.onSuccess=function (res, file,fileList) {//拼接照片
      //         //         //     file.filePath = res.data.url;
      //         //         //     Vue.set(self.mapData,item.field,fileList)

      //         //         // }

      //         //     });
      //         // }
      //         this.formRule=rule;
      // //禁用表单
      //         if (self.formRule) {
      //             self.formRule = self.formRule.map((x) => {
      //                 if(x.props){
      //                 x.props.disabled=true
      //                 }else{
      //                 x.props={disabled:true}
      //                 }

      //                 return x;
      //             })
      //         }
      // var fData=formCreate.parseJson(row.formData || '{}')
      //             //根据路径去后台获取预览图片地址
      //         result.forEach(item=>{
      //         var pathList=fData[item.field]

      //             var query={pathList:pathList}
      //             //根据list集合去后台获取预览地址
      //             preView(query).then(res=>{
      //                 fData[item.field]=res.data;
      //                 self.formData = fData

      //                 self.title = '巡检内容'
      //             })
      //         })
      //     }
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
    rowClassName(row) {
      if (row.row.color == 'red') {
        return 'redware'
      } else {
        return ''
      }
    },
  },
}
</script>
<style  >
.redware {
  background-color: bisque !important;
}
</style>
