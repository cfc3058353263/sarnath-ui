<template>
    <el-form ref="queryParams" :model="this.$props.queryParams" :inline="true" :rules="rules">
        <el-form-item label="电站名称" v-if="stationShow" prop="stationId">
            <station-search ref="station" :queryParams="queryParams" stationId="stationId" systemId="systemId"></station-search>
        </el-form-item>
        <el-form-item v-for="(item, index) in this.$props.inputItem" :key="'select' + index" :label="item.label" prop="roleName">
            <el-input :placeholder="item.placeholder" clearable size="small" style="width: 240px" v-model="queryParams[item.name]" maxlength="50"/>
        </el-form-item>
        <el-form-item v-for="(item, index) in this.$props.selectItem" :key="index" :label="item.label" prop="status">
            <el-select :placeholder="item.label" clearable size="small" style="width: 240px" v-model="queryParams[item.name]">
                <el-option v-for="(list, index) in item.options" :key="index" :label="list.label" :value="list.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="开始时间" v-if="timeShow">
            <el-date-picker v-model="queryParams.startTime" @change="changeStart" :clearable="false" size="small" style="margin-right:10px;width:150px" value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" v-if="timeShow">
            <el-date-picker v-model="queryParams.stopTime" :clearable="false" size="small" :picker-options="endTime" style="width:150px" value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import StationSearch from "@/views/components/stationSearch";
export default {
    name: "TopSearch",
    components: {
        StationSearch,
    },
    props: {
        inputItem: {
            type: Array,
            require: true,
        },
        selectItem: {
            type: Array,
            require: true,
        },
        stationShow: {
            type: Boolean,
            require: true,
            default: false,
        },
        timeShow: {
            type: Boolean,
            require: true,
            default: true,
        },
        queryParams: {
            type: Object,
            required: true,
        },
        getList: {
            type: Function,
            require: true,
        },
        resetQuery: {
            type: Function,
            require: true,
        },
    },
    data() {
        let self = this;
        return {
            endTime: {
                disabledDate(time) {
                    return (
                        self
                            .moment(time.getTime())
                            .diff(
                                self.moment(self.queryParams.startTime),
                                "day"
                            ) < 0
                    );
                },
            },
            rules: {
                stationId: [
                    {
                        required: true,
                        message: "所属电站不能为空",
                        trigger: "blur",
                    },
                ],
                startTime: [
                    {
                        required: true,
                        message: "开始时间不能为空",
                        trigger: "blur",
                    },
                ],
                stopTime: [
                    {
                        required: true,
                        message: "结束时间不能为空",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    methods: {
        search() {
            this.$refs.queryParams.validate((valid) => {
                if (valid) {
                    this.getList && this.getList();
                }
            });
        },
        reset() {
            this.resetQuery && this.resetQuery();
            this.$props.queryParams.startTime =
                this.moment().format("yyyy-MM-01");
            this.$props.queryParams.endTime =
                this.moment().format("yyyy-MM-DD");
        },
        changeStart(date) {
            this.$props.queryParams.stopTime = null;
        },
    },
    created() {},
};
</script>
