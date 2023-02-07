<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['issue:submit:add']">新增处理记录
                </el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" :data="issueDetailList">

            <el-table-column label="跟踪时间" prop="optTime" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="处理人" prop="optPersonName" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="处理阶段" prop="handleRangeName" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="损失电量" prop="lossKwh" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="影响装机容量" prop="affectInstallCapacity" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="处理措施" prop="optMethod" :show-overflow-tooltip="true" width="300" />
            <el-table-column label="处理照片" prop="imgUrl" align="center" key="imgUrl" width="150">
                <template slot-scope="scope">
                    <img :src="scope.row.imgUrl" min-width="30" height="30" @click="preView(scope.row.imgUrl)" style="cursor:pointer;" />
                </template>

            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['assets:supplier:edit']" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['assets:supplier:del']" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog :visible.sync="dialogVisible" style="text-align:center">
            <img width="80%" :src="dialogImageUrl" alt="" />
        </el-dialog>

        <!--  新增和编辑弹窗  -->
        <IssueHandleDialog :issue-create-time="issueCreateTime" ref="IssueHandleDialog" />

    </div>
</template>

<script>
import IssueHandleDialog from '@/views/components/IssueHandleDialog'
import { getIssueDetailsListById, deleteIssueDetails } from '@/api/issue/issue'

export default {
    name: 'issueHandleData',
    components: { IssueHandleDialog },
    data() {
        return {
            // 遮罩层
            loading: true,
            issueId: undefined,
            //处理记录
            issueDetailList: [],
            dialogImageUrl: '',
            dialogVisible: false,
            issueCreateTime: '',
        }
    },
    created() {
        const issueId = this.$route.query && this.$route.query.issueId
        if (issueId) {
            this.issueId = issueId
            this.getList()
        }

        const createTime = this.$route.query && this.$route.query.createTime
        if (createTime) {
            this.issueCreateTime = createTime
        }
    },
    methods: {
        /**
         * 获取工单处理记录表
         */
        getList() {
            getIssueDetailsListById(this.issueId).then((res) => {
                this.issueDetailList = res.IssueOrderDetailsList
                this.loading = false
            })
        },
        /**
         * 点击添加按钮操作
         */
        handleAdd() {
            this.$refs.IssueHandleDialog.addHandleDetails(this.issueId, '新增处理记录')
        },
        /**
         * 点击编辑按钮操作
         */
        handleUpdate(row) {
            this.$refs.IssueHandleDialog.modifyHandleDetails(this.issueId, row, '编辑处理记录')
        },
        /**
         * 删除按钮操作
         */
        handleDelete(row) {
            const issueIds = row.id
            this.$confirm('是否确认删除这条工单数据项?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(function () {
                    return deleteIssueDetails(issueIds)
                })
                .then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                })
        },
        /** 预览 */
        preView(data) {
            this.dialogImageUrl = data
            this.dialogVisible = true
        },
    },
}
</script>

<style scoped>
</style>
