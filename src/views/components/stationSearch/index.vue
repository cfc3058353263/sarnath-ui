<template>
    <div class="app-container">
        <el-select v-model="queryParams[stationId]" placeholder="请选择电站">
            <el-option v-for="item in data[0].children" :key="item.stationId" :label="item.stationName" :value="item.stationId">
            </el-option>
        </el-select>
        <!-- <treeselect
            :options="data" :show-count="true"
            placeholder="请选择电站"
            :normalizer="normalizer"
            noResultsText="暂无结果"
            clearValueText="删除"
            :disableBranchNodes="true"
            @select="select"
            v-model="stationName"
            >
        </treeselect> -->
    </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "stationSearch",
    components: { Treeselect },
    props: {
        queryParams: {
            type: Object,
        },
        stationId: {
            default: "stationId",
            type: String,
        },
        systemId: {
            default: "systemId",
            type: String,
        },
        getContractYear: {
            //用于获取合同年的方法
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            data: this.$store.getters.stationAll,
            stationData: null,
            stationName: null,
        };
    },
    watch: {
        stationName: {
            handler(newValue, oldValue) {
                if (!newValue) {
                    const { queryParams, stationId, systemId } = this.$props;
                    queryParams[stationId] = null;
                    queryParams[systemId] = null;
                    this.stationData = null;
                }
            },
        },
    },
    mounted() {
        //只有光伏电站 暂时修改这样
        this.queryParams[this.systemId] = this.data[0].children[0].systemId
        this.queryParams[this.stationId] = this.data[0].children[0].stationId
    },
    methods: {
        //改变自带的id
        normalizer(node) {
            return {
                id: node.stationId,
                label: node.stationName,
                children: node.children,
            };
        },
        //选中
        select(node, instanceId) {
            const { queryParams, stationId, systemId } = this.$props;
            queryParams[stationId] = node.stationId;
            queryParams[systemId] = node.systemId;
            console.log(this.queryParams);
            this.stationData = node;
            this.getContractYear &&
                this.getContractYear(node.systemId, node.stationId); //入参需要系统ID和电站ID
        },
    },
};
</script>
<style lang="scss" scoped>
.app-container {
    // width: 300px;
    padding: 0;
    line-height: 32px !important;
    ::v-deep .vue-treeselect__control {
        height: 32px !important;
    }
}
</style>
