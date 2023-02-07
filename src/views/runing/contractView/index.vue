<template>
  <div class="app-container">
    合同一览
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item prop="startTime" label="时间范围">
        <el-date-picker v-model="form.queryYear" type="year" @change="dateSelectListener" :clearable="false" size="small">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "contractView",
  data() {
    return {
      form: {}
    }
  },
  created() {
    //默认查询今年
    this.form.queryYear = new Date();

    this.getList();

  },
  methods: {
    /**
     * 查询列表操作
     */
    getList() {

    },

    /**
     * 点击查询按钮操作
     */
    query() {
      this.getList();
    },
    /**
     * 日期选择监听
     */

    dateSelectListener(date){

    }



  }
}
</script>

<style scoped>

</style>
