<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="1000px"
      append-to-body>
      <el-row>
        <el-col :span="4">
          <el-steps direction="vertical" :active="1" :space="40">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="20">
          <el-form>
            <el-alert
              title="温馨提示：若流程运行至未分配审批人员的审批节点时，流程将自动中断取消！"
              type="warning"
              :closable="false"
              show-icon/>
            <span/>
            <el-form-item label="节点名称：" style="flex-grow:1">
              <span>{{editNode.title}}</span>
            </el-form-item>

            <el-form-item label="节点类型：" style="flex-grow:1">
              <span>{{dictNodeType[editNode.type]}}</span>
            </el-form-item>

            <el-alert
              title="每个节点设置，如有修改都请保存一次，跳转节点后数据不会自动保存！"
              type="success"
              :closable="false"
              show-icon/>
            <br/>


          </el-form>

        </el-col>

      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getProcessNode} from "@/api/system/workFlow";

export default {
  name: "DataNodeDialog",
  data() {
    return {
      //弹窗显示标识
      open: false,
      //标题
      title: "",
      //表单
      from: {},
      editNode: {title: "123"},
      //节点类型字典
      dictNodeType: []

    }
  },
  created() {


  },
  methods: {
    /**
     * 打开弹窗操作
     * @param title
     */
    openDialog(data, title) {
      this.form = data;
      this.title = title;
      this.open = true;
      this.getList();
    },

    /**
     * 获取节点数据
     */
    getList() {
      let param = {};
      param.id = this.form.id;
      getProcessNode(param).then((res) => {
      })

    },

  }
}
</script>

<style scoped>

</style>
