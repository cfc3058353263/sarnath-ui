<template>
  <div class="app-container">
    <el-row class="mb10">
      <!--计划数据-->
      <el-col>
        <!-- <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

          <el-form-item label="计划名称" prop="planName">
            <el-input v-model="queryParams.planName" placeholder="请输入计划名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" maxlength="50" />
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="queryParams.deviceType" filterable placeholder="设备类型" clearable size="small" style="width: 240px">
              <el-option v-for="dict in deviceTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始时间">
            <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form> -->

        <!-- 任务列表 -->
        <el-table v-loading="loading" :data="dataList" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column width="150" label="设备编码"  key="deviceCode" prop="deviceCode" />
          <el-table-column label="设备名称"  key="deviceName" prop="deviceName" :show-overflow-tooltip="true" />
          <el-table-column label="规格"  key="deviceSpecs" prop="deviceSpecs" :show-overflow-tooltip="true" />
          <el-table-column label="型号"  key="deviceModel" prop="deviceModel" :show-overflow-tooltip="true" />
          <el-table-column label="供应商"  key="deviceSupplierName" prop="deviceSupplierName" :show-overflow-tooltip="true" />
          <el-table-column label="所属电站"  key="stationName" prop="stationName" width="160">
          </el-table-column>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 巡检数据 -->
    <el-row class="mb8">
      <el-col>

        <!-- 巡检列表 -->
        <el-table v-loading="loading1" :data="recordList" @selection-change="handleSelectionChange">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <!-- <el-table-column label="计划时间"  key="startDate"  :show-overflow-tooltip="true" >
            <template slot-scope="scope">
               <span>{{scope.row.startDate}} ~ {{scope.row.endDate}}</span>
            </template>
          </el-table-column> -->
         
          <el-table-column label="巡检周期"  key="cycleName" prop="cycleName" :show-overflow-tooltip="true" />
          <el-table-column label="巡检号码"  key="number" prop="number" :show-overflow-tooltip="true" />
          <el-table-column label="类型"  key="recordType"  :show-overflow-tooltip="true" >
            <template slot-scope="scope">
                <span v-if="scope.row.recordType==0">计划巡检</span>
                <span v-if="scope.row.recordType==1">临时巡检</span>
            </template>
          </el-table-column>
           <el-table-column label="巡检时间"  key="optTime" prop="optTime" :show-overflow-tooltip="true" />
          <el-table-column label="巡检人"  key="optUserName" prop="optUserName" :show-overflow-tooltip="true" />
           <el-table-column label="经度"  key="longitude" prop="longitude" :show-overflow-tooltip="true" />
           <el-table-column label="纬度"  key="latitude" prop="latitude" :show-overflow-tooltip="true" />
          <el-table-column label="状态"  key="statusName"  prop="statusName" :show-overflow-tooltip="true" />
          <el-table-column label="操作"  class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['patrol:template:edit']"
                >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDesigner(scope.row)"
                v-hasPermi="['patrol:template:editform']"
                >表单设计</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-search" @click="handleInfo(scope.row)" v-hasPermi="['patrol:template:info']">查看</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['patrol:template:remove']">删除</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="recordTotal > 0" :total="recordTotal" :page.sync="queryParams1.pageNum" :limit.sync="queryParams1.pageSize" @pagination="getInfoList" />
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <div>
        <form-create :rule="formRule" v-model="fModel" :option="options" :value.sync="formData" />
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { listData, add, update, getdeviceList, recordList, removeData,preView} from '@/api/patrol/record'
import formCreate from '@form-create/element-ui'
Vue.use(formCreate)
export default {
  name: 'recordInfo',
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      loading1: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      openDesigner: false,
      // 总条数
      total: 0,
      recordTotal: 0,
      // 用户表格数据
      dataList: null,
      recordList: [],
      deviceList: [],
      // 日期范围
      dateRange: [],
      fModel: {},
      formRule: [],
      formData: {},
      // 弹出层标题
      title: '',
      deviceTypeOptions: [], //设备类型
      statusOptions: [], //状态枚举
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      planId: undefined,
      deviceId: undefined,
      currentRow: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      queryParams1: {
        pageNum: 1,
        pageSize: 15,
      },
      options: {
        submitBtn: false,
      },
    }
  },
  created() {
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
    //状态枚举
    this.getDicts('sys_plan_status').then((response) => {
      this.statusOptions = response.data
    })
    const id = this.$route.query && this.$route.query.id
    if (id) {
      //查询信息
      this.planId = id
      this.getList()
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      getdeviceList(this.planId).then((response) => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询巡检记录 */
    getInfoList() {
      var self = this
      self.loading1 = true
     
      self.queryParams1.planId = self.planId
      self.queryParams1.deviceId = self.currentRow.deviceId
      recordList(self.queryParams1).then((response) => {
        this.recordList = response.rows
        this.recordTotal = response.total
        this.loading1 = false
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
    },
    handleInfo(row) {
      var self = this
      self.open = true;
      var rule=Object.assign([],formCreate.parseJson(row.formRule || '[]'))
      if(rule){
         var result=this.getTypeForRule(rule)
            if(result&&result.length>0){
              result.forEach(item=>{
                item.props.headers={Authorization: "Bearer " + this.token}
                //  item.props.action=process.env.VUE_APP_BASE_API+'/file/upload';
                  item.props.listType="picture-card";
                  item.props.showFileList=true
                  item.props.autoUpload=false;
                  item.props.disabled=true;
                //  item.props.onSuccess=function (res, file,fileList) {//拼接照片
                //     file.filePath = res.data.url;
                //     Vue.set(self.mapData,item.field,fileList)
                    
                // }
                
              });
            }
            this.formRule=rule;
      //禁用表单
            if (self.formRule) {
              self.formRule = self.formRule.map((x) => {
                if(x.props){
                  x.props.disabled=true
                }else{
                  x.props={disabled:true}
                }
                
                return x;
              })
            }
            var fData=formCreate.parseJson(row.formData || '{}')
                  //根据路径去后台获取预览图片地址
            result.forEach(item=>{
              var pathList=fData[item.field]
                
                var query={pathList:pathList}
              //根据list集合去后台获取预览地址
              preView(query).then(res=>{
                fData[item.field]=res.data;
                self.formData = fData

                  self.title = '巡检内容'
              })
            })
            }
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
    },
    // onFormSubmit(data) {
    //   this.formData = JSON.stringify(data)
    //   console.log(this.formData)
    // },
    handleCurrentChange(val) {
      this.currentRow = val
       this.queryParams1.pageNum = 1
      this.getInfoList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids
      var self = this
      this.$confirm('是否确认删除该数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return removeData(id)
        })
        .then(() => {
          self.recordList.splice(self.recordList.indexOf(row), 1)
          self.msgSuccess('删除成功')
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.formRule = []
      this.formData = {}
    },
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

.selectD {
  text-align: center;
}
</style>
