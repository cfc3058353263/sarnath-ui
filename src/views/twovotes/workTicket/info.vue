<template>
    <div class="app-container">
        <div class="info">
            <div class="title">
                <span> 基础信息 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="单位">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="工作票编号">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="工作票类型">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="状态">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="info">
            <div class="title">
                <span> 工作票签发 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="业主方签发人">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="签发时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="info">
            <div class="title">
                <span> 运行接票 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="接票人">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="接票时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="info">
            <div class="title">
                <span> 值长批准 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="值长">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="签字时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="批准开始时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="批准结束时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="info">
            <div class="title">
                <span> 安措办理 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="办理人">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="办理时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="info">
            <div class="title">
                <span> 工作许可 </span>
            </div>
            <el-form :rules="rules" ref="form" :model="form" :inline="true" label-width="120px">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="许可人">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="weekNum" label="许可时间">
                            <el-select v-model="form.weekNum">
                                <el-option v-for="item in week" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <el-tabs style="margin-top:20px" type="border-card" v-model="activeTab" @tab-click="changeTab">
            <el-tab-pane label="工作成员" name="1">
            </el-tab-pane>
            <el-tab-pane label="缺陷单" name="2">
            </el-tab-pane>
            <el-tab-pane label="风险及控制措施" name="3">
            </el-tab-pane>
            <el-tab-pane label="安全措施" name="4">
            </el-tab-pane>
            <el-tab-pane label="检修交代" name="4">
            </el-tab-pane>
            <el-tab-pane label="工作票终结" name="4">
            </el-tab-pane>
            <el-tab-pane label="附件" name="4">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { getPlanDay, getWeekInfoData } from "@/api/runing/runWeekly/runWeekly";
import {
    getInspection,
    getHandleIssueOrderByPage,
    getdictList,
    getProjectList,
} from "@/api/runing/recordList";
export default {
    name: "weeklyInfo",
    data() {
        return {
            tableList: [],
            stockList: [],
            form: {},
            queryParams: {},
        };
    },
    created() {},
    methods: {
        //切换选项卡
        changeTab(tab, event) {
            var self = this;
            //重置翻页
            switch (self.activeTab) {
                case "1":
                    break;
                case "2":
                    break;
                case "3":
                    break;
                case "4":
                    break;
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.info {
    padding: 5px 10px;
    .el-col {
        font-weight: 400;
    }
    .title {
        text-align: left;
        margin-bottom: 5px;
        span {
            font-weight: 700;
        }
    }
    .titleInfo {
        text-align: left;
        margin-bottom: 5px;
        span {
            font-size: 14px;
            color: #515a6e;
        }
    }
}
.votes {
    display: flex;
    justify-content: space-around;
}
</style>
