<template>
    <div class="app-container">
        <div class="form">
            <div class="formHeader">
                录入日发电量
            </div>
            <div class="formContainer">
                <el-form ref="form" :model="form" label-width="160px" style="width:800px">
                    <el-form-item label="所属电站">
                        <el-input v-model="form.station" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-input v-model="form.date" disabled></el-input>
                    </el-form-item>
                    <el-form-item :label="item.deviceName" v-for="(item,index) of deviceList" :key="index" :prop="`inputs[${index}].devicePower`" :rules="[{ required: true, message: `请输入${item.deviceName}设备的当日发电量`, trigger: 'blur' }]">
                        <el-input v-model.number="form.inputs[index].devicePower" type="number" oninput="if(value.length > 15) value=value.slice(0, 15)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="formFoot" v-if="deviceList.length !== 0">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getDevice, addDevice } from "@/api/dataMaintain/deviceDay";
export default {
    name: "addDeviceDay",
    data() {
        return {
            form: {
                inputs: [],
            },
            deviceList: [],
            station: null,
            rules: {
                stationId: [
                    {
                        required: true,
                        message: "合同期电量不能为空",
                        trigger: "blur",
                    },
                    { type: "number", message: "合同期电量必须为数字" },
                ],
                input: [
                    {
                        type: "array",
                        required: true,
                        // message: "请选择日期区间",
                        fields: {
                            0: {
                                type: "string",
                                required: true,
                                message: "请选择开始日期",
                            },
                            1: {
                                type: "string",
                                required: true,
                                message: "请选择结束日期",
                            },
                        },
                    },
                ],
            },
        };
    },
    methods: {
        /**获取设备列表 */
        getDevice(stationId, systemId) {
            getDevice({ stationId, systemId }).then((res) => {
                this.deviceList = res.data;
                this.form.inputs = this.deviceList.map((item, indx) => {
                    return {
                        deviceId: item.deviceId,
                        devicePower: null,
                        systemId: this.station.systemId,
                        stationId: this.station.stationId,
                    };
                });
            });
        },
        /**录入设备数据 */
        addDevice() {
            addDevice(this.form.inputs).then((res) => {
                if (res.code == 200) {
                    this.msgSuccess("新增成功");
                    this.cancel();
                }
            });
        },
        /**确认 */
        confirm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.addDevice();
                }
            });
        },
        /**取消 */
        cancel() {
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.push({
                path: "/statistics/dataMaintain/deviceDay",
            });
        },
    },
    created() {
        this.station = JSON.parse(this.$route.query.station);
        this.form.station = this.station.stationName;
        this.form.date = this.moment().format("YYYY-MM-DD HH:mm:ss");
        this.getDevice(this.station.stationId, this.station.systemId);
    },
};
</script>
<style scoped lang="scss">
.app-container {
    padding: 20px;
    .form {
        border: 1px solid #bfc5c9;
        border-radius: 5px;
        .formHeader {
            padding: 10px;
            color: #686b6d;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #bfc5c9;
        }
        .formContainer {
            padding: 10px;
            display: flex;
            justify-content: center;
        }
        .formFoot {
            padding: 10px;
            display: flex;
            justify-content: center;
        }
    }
    ::v-deep input[type="number"] {
        -moz-appearance: textfield;
    }
    ::v-deep input[type="number"]::-webkit-inner-spin-button,
    ::v-deep input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
}
</style>