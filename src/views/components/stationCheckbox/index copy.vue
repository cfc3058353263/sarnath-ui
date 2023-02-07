<template>
    <div>
        <el-input disabled v-model="stationName" size="small" style="width:225px;padding-top:3px">
            <el-button slot="append" @click="click" style="background-color: #1ab394;border-top-left-radius: 0%;border-bottom-left-radius: 0%;color: #fff;height:32px;border:0px">选择电站</el-button>
        </el-input>
        <el-dialog title="请选择电站" :visible.sync="open" width="width" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <el-form ref="form" :model="form" :inline="true">
                <el-form-item label="区域">
                    <el-select v-model="form.stationArea" clearable>
                        <el-option v-for="item in areaList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.stationType" clearable>
                        <el-option v-for="item in typeList" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="getList">查询</el-button>
                    <el-button icon="el-icon-refresh" size="small ">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="checkList">
                <el-button size="mini" @click="handleCheckAll" id="checkALlButton">全 选</el-button>
                <el-checkbox-group v-model="checkList" @change="handleChange">
                    <el-row :gutter="10">
                        <el-col :span="8" v-for="(item,index) in stationList" :key="index">
                            <el-checkbox :label="item.stationId" @change="onChange">{{item.stationName}}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-checkbox-group>
            </div>
            <div class="selectedList">
                <span>所选电站</span>
                <div>
                    <el-input type="textarea" :rows="2" disabled :autosize="{ minRows: 4, maxRows: 4}" resize="none" show-word-limit v-model="stationNameList">
                    </el-input>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getdictList, getStationByUser } from "@/api/utils";
import { stationSearch } from "@/api/system/station";
import axios from "axios";

export default {
    name: "stationCheckbox",
    props: {
        stations: {
            type: Array,
        },
    },
    data() {
        return {
            stationName: "",
            open: false,
            form: {
                stationArea: null,
                stationType: null,
            },
            areaList: [], //区域
            typeList: [], //类型
            checkList: this.stations, //当前已选择的电站数组 主要

            checkAllList: [], //当前全选电站的数组
            stationList: [], //当前显示的电站id数组
            stationAllList: [], //当前用户的所有电站id数组

            idNameList: {}, //当前显示的电站id 和 name 对应的对象
            stationNameList: "", //所属电站
            checkAll: false,
        };
    },
    created() {
        this.$store.getters.stationList.map((item) => {
            if (item.stationId === this.$store.getters.currentStation) {
                this.stationName = this.stationNameList = item.stationName;
            }
        });
        this.getDictList();
        this.getAllList();
    },
    methods: {
        click() {
            this.open = true;
        },
        /**数据字典 */
        getDictList() {
            axios
                .all([getdictList("sys_area"), getdictList("sys_power_type")])
                .then(
                    axios.spread((area, type) => {
                        this.areaList = area.data;
                        this.typeList = type.data;
                    })
                );
        },
        /**获取所有电站 */
        getAllList() {
            getStationByUser().then((res) => {
                this.stationAllList = res.stations.map((item, index) => {
                    return item.stationId;
                });
                this.stationList = res.stations;
                this.checkAllList = this.stationAllList;
                res.stations.map((item, index) => {
                    this.idNameList[item.stationId] = item.stationName;
                });
                //初次设置显示电站
                this.handleChange(this.stations)
                this.stationName = this.stationNameList;
            });
        },

        /**获取当前 */
        getList() {
            getStationByUser(this.form).then((res) => {
                this.stationList = res.stations;
                this.checkAllList = res.stations.map((item, index) => {
                    return item.stationId;
                });
                res.stations.map((item, index) => {
                    this.idNameList[item.stationId] = item.stationName;
                });
            });
        },
        /**获取已选中的数组 */
        handleChange(value) {
            // value.length === this.stationList.length && (this.checkAll = true)
            let nameList = "";
            let num = 0;
            for (let id of value) {
                for (let index in this.idNameList) {
                    if (id == index) {
                        if (num) {
                            nameList = nameList + "," + this.idNameList[index];
                        } else {
                            nameList = this.idNameList[index];
                            num++;
                        }
                    }
                }
            }
            this.stationNameList = nameList;
        },
        /**单选状态 */
        onChange(val) {
            // 更新全选按钮状态
            !val && (this.checkAll = val);
        },
        /**全选操作 */
        handleCheckAll() {
            document.getElementById("checkALlButton").blur();
            let isInclude = this.isInclude(this.checkAllList, this.checkList);
            this.checkAll = !isInclude;

            if (this.checkAll) {
                this.checkList = Array.from(
                    new Set(this.checkList.concat(this.checkAllList))
                );
                this.handleChange(this.checkList);
            } else {
                let self = this;
                let arr;
                arr = this.checkList.filter(function (item) {
                    return self.checkAllList.indexOf(item) == -1;
                });
                this.checkList = arr;
                this.handleChange(this.checkList);
            }
        },

        /**判断两个数组是否包含关系 */
        isInclude(aa, bb) {
            return aa.every((item) => {
                return bb.some((sub) => {
                    return sub === item;
                });
            });
        },
        /**确认按钮 */
        confirm() {
            this.open = false;
            this.stationName = this.stationNameList;
            this.$emit('getStations',this.checkList)
        },
    },
};
</script>

<style scoped lang="scss">
.button {
    background-color: #1ab394;
    color: #fff;
    border-top-left-radius: 0%;
    border-bottom-left-radius: 0%;
}
::v-deep .el-dialog__body {
    padding: 10px 20px !important;
}
.checkList {
    padding: 20px 20px;
    height: 300px;
    overflow: auto;
}
.selectedList {
    span {
        color: #606266;
        font-size: 14px;
        font-weight: 700;
    }
}
.dialog-footer {
    text-align: center;
    .el-button--medium {
        padding: 10px 100px;
    }
}
</style>