<template>
  <div>
    <el-dialog :close-on-press-escape="false" :visible.sync="open" width="1000px" :close-on-click-modal="false"
               append-to-body :show-close="false" :title="title">
      <el-form ref="form" :model="form" label-width="150px" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="电站"
              prop="optPersonName">
              <el-input v-model="form.stationName" placeholder="电站" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" prop="dateTime" style="width: 100%">
              <el-date-picker
                style="width: 100%"
                v-model="form.calendar"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="天气情况" prop="actualWeather">
              <el-input v-model="form.actualWeather" placeholder="请输入天气情况" maxlength="50"></el-input>
              <!-- <el-select v-model="form.actualWeather" placeholder="请选择天气情况" style="width: 100%">
                <el-option v-for="item of weather" :key="item.id" :label="item.dictLabel"
                           :value="item.dictValue"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="实际温度"
              prop="actualTemperature">
              <el-input v-model="form.actualTemperature" placeholder="实际温度" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="风机总数量"
              prop="wFanSumCount">
              <el-input type="number" v-model="form.wFanSumCount" placeholder="风机总数量"  oninput="if(value.length > 8) value=value.slice(0, 8)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="当日风机运行数量"
              prop="wFanDayCount">
              <el-input type="number"  v-model="form.wFanDayCount" placeholder="当日风机运行数量" oninput="if(value.length > 8) value=value.slice(0, 8)"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="正向有功起(关口表)"
              prop="wForwardPowerBegin">
              <el-input type="number" v-model="form.wForwardPowerBegin" placeholder="正向有功起(关口表)" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="正向有功止(关口表)"
              prop="wForwardPowerEnd">
              <el-input type="number" v-model="form.wForwardPowerEnd" placeholder="正向有功止(关口表)" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="反向有功起(关口表)"
              prop="wReversePowerBegin">
              <el-input type="number" v-model="form.wReversePowerBegin" placeholder="反向有功起(关口表)" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="反向有功止(关口表)"
              prop="wReversePowerEnd">
              <el-input type="number" v-model="form.wReversePowerEnd" placeholder="反向有功止(关口表)" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="风机总发电量"
              prop="wFanTotalKwh">
              <el-input type="number" v-model="form.wFanTotalKwh" placeholder="风机总发电量" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="集电线总发电量"
              prop="wLineTotalKwh">
              <el-input type="number" v-model="form.wLineTotalKwh" placeholder="集电线总发电量" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="AGC（投/退）"
              prop="wAgc">
              <el-select v-model="form.wAgc" placeholder="AGC（投/退）" style="width: 100%">
                <el-option
                  v-for="item in windServiceStatusOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="AVC（投/退）"
              prop="wAvc">
              <el-select v-model="form.wAvc" placeholder="AGC（投/退）" style="width: 100%">
                <el-option
                  v-for="item in windServiceStatusOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="线路停运"
              prop="wLineOutNum">
              <el-input type="number" v-model="form.wLineOutNum" placeholder="线路停运" oninput="if(value.length > 8) value=value.slice(0, 8)"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="停运箱变"
              prop="wBoxOutNum">
              <el-input type="number"  v-model="form.wBoxOutNum" placeholder="停运箱变" oninput="if(value.length > 8) value=value.slice(0, 8)"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="停运风机"
              prop="wFanOutNum">
              <el-input type="number"  v-model="form.wFanOutNum" placeholder="停运风机" oninput="if(value.length > 8) value=value.slice(0, 8)"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item
              label="最小风速"
              prop="wMinWind">
              <el-input type="number" v-model="form.wMinWind" placeholder="最小风速" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="最大风速"
              prop="wMaxWind">
              <el-input type="number" v-model="form.wMaxWind" placeholder="最大风速" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="平均风速"
              prop="wAvgWind">
              <el-input type="number" v-model="form.wAvgWind" placeholder="平均风速" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="最高负荷"
              prop="wMaxLoad">
              <el-input type="number" v-model="form.wMaxLoad" placeholder="最高负荷" oninput="if(value.length > 12) value=value.slice(0, 12)"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import {getdictList} from "@/api/utils";
import {addDayData, updateDayData} from "@/api/runing/OperationDayData";

export default {
  name: "AddWindRunningDayDialog",
  data() {
    return {
      title: '',
      open: false,
      //天气下拉
      weather: [],
      form: {},
      rules: {},
      //风电投退状态
      windServiceStatusOptions: [
        {id: 1, dictLabel: "投", dictValue: '1'},
        {id: 2, dictLabel: "退", dictValue: '2'},
      ]

    }
  },
  created() {
    /**获取天气字典 */
    getdictList("sys_weather_type").then((res) => {
      this.weather = res.data;
    });
  },
  methods: {
    /**
     * 新增日报数据入口
     */
    addDayReport(title) {

      this.openDialog(title);

    },
    /**
     * 修改日报数据入口
     */
    editDayReport(title, data) {
      this.openDialog(title);
      this.form = data;
    },

    /**
     * 打开窗口统一方法
     */
    openDialog(title) {
      this.resetForm();
      this.title = title;
      this.open = true;
    },
    resetForm() {
      this.form = {};
    },
    /**
     * 点击保存按钮操作
     */
    submitForm() {
      if (this.form.id === undefined) {
        if(this.form.wForwardPowerEnd < this.form.wForwardPowerBegin){
          this.msgError("正向有功止(关口表) 不能小于 正向有功起(关口表)")
          return
        }
         if(this.form.wReversePowerEnd < this.form.wReversePowerBegin){
          this.msgError("反向有功止(关口表) 不能小于 反向有功起(关口表)")
          return
        }
        //保存日报
        addDayData(this.form).then((res) => {
          this.msgSuccess("提交成功");
          this.closeDialog()
          this.$parent.getList();
        });
      } else {
        //修改日报
        updateDayData(this.form.id, this.form).then((res) => {
          this.msgSuccess("修改成功");
          this.closeDialog();
          this.$parent.getList();
        });
      }


    },
    /**
     * 点击取消按钮操作
     */
    cancelForm() {
      this.closeDialog()
    },
    /**
     * 关闭dialog操作
     */
    closeDialog() {
      this.form = {};
      this.open = false;
    }


  }
}
</script>

<style scoped>

  .form {
    display: flex;
    flex-direction: column;
  }

</style>
