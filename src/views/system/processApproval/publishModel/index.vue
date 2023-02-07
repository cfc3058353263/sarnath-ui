<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流程名称" prop="lcmc">
        <el-input
          v-model="queryParams.lcmc"
          placeholder="请输入搜索关键词"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="流程标识" prop="lckey">
        <el-input
          v-model="queryParams.lckey"
          placeholder="请输入搜索关键词"
          clearable
          size="small"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="是否最新" prop="zx">
        <el-switch
          v-model="queryParams.zx"
          active-value="0"
          inactive-value="1"
          active-text="是"
          inactive-text="否"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="loading" :data="dataList" style="width: 100%">
      <el-table-column type="index" width="55" align="center"/>
      <el-table-column label="流程名称" :width="200" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="流程标识" :width="200" align="center" prop="processKey" :show-overflow-tooltip="true"/>
      <el-table-column label="版本" :width="100" align="center" prop="version" :show-overflow-tooltip="true"/>
      <el-table-column label="所属分类" :width="200" align="center" prop="categoryId" :show-overflow-tooltip="true"/>
      <el-table-column label="流程图片" :width="200" align="center" prop="diagramName" :show-overflow-tooltip="true"/>
      <el-table-column label="表单路由" :width="200" align="center" prop="routeName" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" :width="200" align="center" prop="status" :show-overflow-tooltip="true"/>
      <el-table-column label="备注说明" :width="200" align="center" prop="description" :show-overflow-tooltip="true"/>
      <el-table-column label="部署时间" :width="200" align="center" prop="createTime" :show-overflow-tooltip="true"/>
      <el-table-column label="更新时间" :width="200" align="center" prop="updateTime" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" :width="400">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editModelStatus(1,scope.row)"
          >启用
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editModelStatus(0,scope.row)"
          >禁用
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="setModelNode(scope.row)"
          >节点设置
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="convertToModel(scope.row)"
          >转为模型
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editModel(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="deleteModel(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <edit-dialog ref="EditDialog"/>
    <data-node-dialog ref="DataNodeDialog"/>

  </div>
</template>

<script>
import EditDialog from "@/views/components/WorkFlow/PublishModel/EditDialog";
import DataNodeDialog from "@/views/components/WorkFlow/PublishModel/DataNodeDialog";
import {publishListData, publishDelByIds} from "@/api/system/workFlow";

export default {
  name: "publishModel",
  components: {EditDialog, DataNodeDialog},
  data() {
    return {
      //遮罩层
      loading: false,
      //查询参数
      queryParams: {},
      //实际查询参数
      query: {},
      showSearch: true,
      //列表数据
      dataList: [{name: "流程1"}],

    }
  },
  created() {
    this.getList();

  },
  methods: {
    /**
     * 获取列表
     */
    getList() {
      this.loading = true;
      publishListData(this.query).then((res) => {
        this.dataList = res.result;
        this.loading = false;
      });
    },
    /**
     * 点击查询按钮操作
     */
    handleQuery() {
      this.query = JSON.parse(JSON.stringify(this.queryParams));
      this.getList();

    },
    /**
     * 点击重置按钮操作
     */
    resetQuery() {

    },
    /**
     * 点击 启用/禁用 按钮操作
     */
    editModelStatus(status, row) {
      let operation = "";
      if (status === 0) {
        operation = "禁用";
      } else {
        operation = "启用";
      }

      this.$confirm('您确认要' + operation + '流程' + row.name, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let params = {
          status: status,
          id: row.id
        };
        //TODO 修改模型


      }).then(() => {
        //TODO 从新获取列表
        this.msgSuccess(operation + "成功");
      });

    },
    /**
     * 点击 节点设置 按钮操作
     * @param row
     */
    setModelNode(row) {
      //TODO 获取节点API  弹出设置弹窗
      this.$refs.DataNodeDialog.openDialog(row, "编辑流程节点");

    },
    /**
     * 点击 转为模型 按钮操作
     * @param row
     */
    convertToModel(row) {
      this.$confirm('您确认要转化流程 ' + row.name + ' 为模型?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        //TODO 调用转换模型API

      }).then(() => {
        //TODO 从新获取列表
        this.msgSuccess(operation + "成功");
      });

    },
    /**
     * 点击 编辑 按钮操作
     * @param row
     */
    editModel(row) {
      this.$refs.EditDialog.openDialog(row, "编辑");
    },
    /**
     * 点击 删除 按钮操作
     * @param row
     */
    deleteModel(row) {
      this.$confirm('您确认要删除流程 ' + row.name + ' ?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        //TODO 调用转换模型API
        let param = {};
        param.ids = row.id;
        publishDelByIds(param).then((res) => {

        });


      }).then(() => {
        //TODO 从新获取列表
        this.msgSuccess("删除成功");
        this.getList()
      });
    }


  }
}
</script>

<style scoped>

</style>
