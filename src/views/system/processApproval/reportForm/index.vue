<template>
    <div class="app-container">
        <top-search :queryParams="queryParams" :inputItem="inputItem" :getList="getList" :resetQuery="resetQuery"></top-search>
        <!-- 按钮.... -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:code:add']">创建流程模型</el-button>
            </el-col>
        </el-row>
        <!-- 按钮.... -->
        <!-- table -->
        <el-table :data="data.slice((pageNum-1)*15,pageNum*15)" style="width: 100%">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="id" label="模型id" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="name" label="模型名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="key" label="模型key" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="version" label="版本" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="备注描述" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{JSON.parse(scope.row.metaInfo).description}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="lastUpdateTime" label="最后更新时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleRelease(scope.row)">发布</el-button>
                    <el-button size="mini" type="text" icon="el-icon-circle-close" @click="handleDesign(scope.row)">设计流程</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
         <pagination v-show="total>0" :total="total" :page.sync="pageNum"/>
        <!-- table -->
        <!-- 创建 -->
        <el-dialog :close-on-press-escape="false" width="1200px" :visible.sync="open" :close-on-click-modal="false" append-to-body :title="title">
            <iframe :src="iframUrl" frameborder="0" width="100%" height="800px" scrolling="auto" style="background-color: #fff;"></iframe>
        </el-dialog>
        <el-dialog title="创建模型" :close-on-press-escape="false" width="600px" :visible.sync="creatModel" :close-on-click-modal="false" append-to-body :show-close="false">
             <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-row :gutter=10>
                    <el-col :span="24">
                        <el-form-item label="创建模型" prop="modelName">
                            <el-input v-model="form.modelName" placeholder="请输入创建模型" :disabled="title==='编辑'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="模型Key" prop="key">
                           <el-input v-model="form.key" placeholder="请输入应用ID" :disabled="title==='编辑'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="模型描述" prop="description">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" resize="none" show-word-limit placeholder="请输入内容" v-model="form.description">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
             <div class="dialog-footer">
                <el-button type="primary" @click="comfir">确 定</el-button>
                <el-button @click="creatModel = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getList,getCreate,getRemove,getRelease } from "@/api/process/model";
import topSearch from "@/views/components/TopSearch";

export default {
    name: "reportForm",
    components: {
        topSearch,
    },
    data() {
        return {
            queryParams:{
                keyWord:'',
                column:'createTime',
                order:"desc"
            },
            data: [],
            open: false,
            openSearch: false,
            total: 0,
            title: "",
            pageNum: 1,
            inputItem: [
                { label: "模型名称", name: "keyWord", placeholder: "请输入模型名称" },
            ],
            form: {},
            creatModel:false,
            rules: {
                modelName: [
                    {
                        required: true,
                        message: "创建模型不能为空",
                        trigger: "blur",
                    },
                ],
                key: [
                    {
                        required: true,
                        message: "模型key不能为空",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "模型描述不能为空",
                        trigger: "blur",
                    },
                ],
            },
            iframUrl:"null"
        };
    },
    created() {
        this.getList()
    },
    methods: {
        /**列表 */
        getList() {
            this.pageNum = 1
            getList(this.queryParams).then(res=>{
                this.data = res.rows
                this.total = res.total
            })
        },
        /**重置 */
        resetQuery(){
            this.queryParams.keyWord = ""
        },
        /**创建流程模型 */
        handleAdd() {
            this.form = {}
            this.creatModel = true;
        },
        /**确认 */
        comfir(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    getCreate(this.form).then(res=>{
                        this.msgSuccess('模型创建成功')
                        this.creatModel = false
                        this.queryParams.keyWord = ""
                        this.getList(this.queryParams)
                    })
                }
            });
        },
        /** 发布*/
        handleRelease(row) {
            this.$confirm("是否确认发布当前设计流程?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return getRelease(row.id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("启动成功");
                });
        },
        /**设计流程 */
        handleDesign(row){
            this.open = true
            this.iframUrl = "http://192.168.2.231:9500/activiti/modeler.html?modelId="+row.id
        },
        /** 删除*/
        handleDelete(row) {
            this.$confirm("是否确认删除当前流程模型?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(function () {
                    return getRemove(row.id);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
}
</style>