<template>
  <div>
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="open"
      width="600px"
      :show-close="false"
      append-to-body>

      <el-form
        ref="form"
        :model="form"
        label-width="160px"
        class="form">
        <el-row>
          <el-col :span="22">
            <el-form-item label="流程分类" prop="categoryId" style="flex-grow:1">
              <el-select v-model="form.categoryId" placeholder="请选择流程分类" style="width: 100%">
                <el-option
                  v-for="item in issueTypeOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="流程类目(app使用)" prop="typeId" style="flex-grow:1">
              <el-select v-model="form.typeId" placeholder="请选择流程类目" style="width: 100%">
                <el-option
                  v-for="item in issueTypeOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="关联表单" prop="routeName" style="flex-grow:1">
              <el-select v-model="form.routeName" placeholder="请选择关联表单" style="width: 100%">
                <el-option
                  v-for="item in issueTypeOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button
              size="mini"
              type="text"
              @click="viewForm()">预览表单
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="角色授权" prop="roles" style="flex-grow:1">
              <el-select v-model="form.roles" placeholder="请选择角色授权" style="width: 100%">
                <el-option
                  v-for="item in issueTypeOptions"
                  :key="item.id"
                  :label="item.dictLabel"
                  :value="item.dictValue"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="排序" prop="sort" style="flex-grow:1">
              <el-input v-model="form.sort"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注描述" prop="description">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                maxlength="500"
                show-word-limit
                placeholder="请输入备注描述"
                v-model="form.description"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "EditDialog",
  data() {
    return {
      //弹窗显示标识
      open: false,
      //标题
      title: "",
      //表单对象
      form: {},
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

    },
    /**
     * 点击 保存 按钮操作
     */
    submitForm() {
      //TODO 保存接口

    },
    /**
     * 点击 取消 按钮操作
     */
    cancelForm() {
      this.open = false;
    },
    /**
     * 点击 预览表单 按钮操作
     */
    viewForm() {

    }

  }
}
</script>

<style scoped>
  .dialog-footer {
    display: flex;
    justify-content: space-around;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

</style>
