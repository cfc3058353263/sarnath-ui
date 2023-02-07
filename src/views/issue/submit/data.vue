<template>
  <div class="app-container">
    <div class="info">
      <div class="title">
        <span>工单信息</span>
      </div>
      <div class="table">
        <el-row v-loading="loading" class="rowStyle">
          <el-col class="valueStyle" :span="3">工单类型</el-col>
          <el-col class="labelStyle" :span="5">
            {{issueOrder.issueTypeName}}
          </el-col>
          <el-col class="valueStyle" :span="3">工单编号</el-col>
          <el-col class="labelStyle" :span="5">
            {{issueOrder.issueCode}}
          </el-col>
          <el-col class="valueStyle" :span="3">工单来源</el-col>
          <el-col class="labelStyle" :span="5">
            {{issueOrder.issueFrom}}
          </el-col>
          <el-col class="valueStyle" :span="3" v-if="isFaultIssue">工单级别</el-col>
          <el-col class="labelStyle" :span="5" v-if="isFaultIssue">
            {{issueOrder.issueLevel}}
          </el-col>
          <el-col class="valueStyle" :span="3" v-if="isDefectIssue">缺陷级别</el-col>
          <el-col class="labelStyle" :span="5" v-if="isDefectIssue">
            {{issueOrder.issueLevel}}
          </el-col>
          <el-col class="valueStyle" :span="3" v-if="isNotFaultIssue">损失类型</el-col>
          <el-col class="labelStyle" :span="5" v-if="isNotFaultIssue">
            {{issueOrder.lossType}}
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import {getIssueOrderById} from "@/api/issue/issue";

export default {
  name: "issueSubmitData",
  data() {
    return {
      //遮罩层
      loading: false,
      issueId: undefined,
      issueOrder: undefined,

    }
  },
  created() {
    const issueId = this.$route.query && this.$route.query.issueId;
    if (issueId) {
      this.issueId = issueId;
      this.getIssueOrderInfo();
    }
  },
  methods: {
    /**
     * 获取工单信息
     */
    getIssueOrderInfo() {
      this.loading = true;
      getIssueOrderById(this.issueId).then((res) => {
        this.issueOrder = res.IssueOrder;
        this.loading = false;
      });

    }
  },
  computed: {
    isFaultIssue() {
      return this.issueOrder.issueType === "1";
    },
    isNotFaultIssue() {
      return this.issueOrder.issueType === "2";
    },
    isDefectIssue() {
      return this.issueOrder.issueType === "3";
    }
  },
}
</script>

<style lang="scss" scoped>
  .info {
    border: 1px solid #d7dde4;
    padding: 5px 10px;
    margin-bottom: 10px;

    .el-col {
      font-weight: 400;
    }

    .title {
      height: 30px;
      background-color: #d7dde4;

      span {
        line-height: 30px;
      }
    }

    //**表格样式设计 */
    .table {
      padding-top: 10px;
      padding-bottom: 10px;

      .rowStyle {
        border-top: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;

        .valueStyle {
          border-right: 1px solid #dfe6ec;
          border-bottom: 1px solid #dfe6ec;
          background-color: #f9f9f9;
          padding-right: 20px;
          height: 45px;
          text-align: right;
          line-height: 45px;
        }

        .labelStyle {
          border-right: 1px solid #dfe6ec;
          border-bottom: 1px solid #dfe6ec;
          height: 45px;
          text-align: left;
          line-height: 45px;
          padding-left: 20px;

          span {
            color: #909399;
          }
        }
      }
    }
  }

</style>
