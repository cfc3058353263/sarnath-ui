<template>
    <div class="homeContainer s-omp flex flex-v homeContainer-2 bgStyle">
        <div class="flex flex-1 flex-v">
            <div class="flex home-header flex-6 flex-v">
                <TopData :data="topList" />
            </div>
            <div class="flex flex-12" style="padding:0 30px;">
                <dv-border-box-13 style="padding:25px;">
                    <dv-border-box-6 style="padding:6px:position: relative;">
                        <div class="stationStatus flex flex-align-center">
                            <div v-for="dict in dict.type.sys_power_status" :key="dict.value" class="flex flex-1 flex-pack-center flex-align-center">
                                <div class="ridao" :style="{background:dict.color}"></div>
                                <span class="status">{{dict.label}}（{{dict.number}}）</span>
                            </div>
                        </div>
                        <div style="display:none">
                            <div ref="infoData" class="custom-info" @click="link" style="cursor: pointer;">
                                <div class="info-middle">
                                    <div class="info-div">
                                        <div class="info-div">电站名称 ：{{stationName}}</div>
                                        <div class="info-div">日发电量 ：{{dayKwh}} kWh</div>
                                        <div class="info-div">总发电量 ：{{totalKwh}} kWh</div>
                                        <div class="info-div">运行天数 ：{{runDays}} 天</div>
                                        <div class="info-div">电站状态 ：{{statusFormat(stationStatus)}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="map" style="height:100%;width:100%;position:relative"></div>
                    </dv-border-box-6>
                </dv-border-box-13>
            </div>
            <div class="flex flex-8" style="padding:0 30px">
                <div class="flex flex-1 flex-v" style="padding-right:30px;padding-top:5px;">
                    <Electric :dayKwhList="dayKwhList" :monthKwhList="monthKwhList" :yearKwhList="yearKwhList" :fontSize="fontSize" />
                </div>
                <div class="flex flex-1 flex-v" style="padding-right:30px;padding-top:5px;">
                    <StationBuild :netCapacity="netCapacity" :stationBuildList="stationBuildList" />
                </div>
                <div class="flex flex-1 flex-v" style="padding-right:30px;padding-top:5px;">
                    <Operation :stationList="stationList" :operationList="operationList" :deviceTotalNum="deviceTotalNum" :fontSize="fontSize" />
                </div>
                <div class="flex flex-1 flex-v" style="padding-top:5px;">
                    <Contribute :contribute="contribute" />
                </div>
            </div>
        </div>
        <NavRight />
    </div>
</template>

<script>
import TopData from "@/views/index/topData";
import Electric from "@/views/index/electric";
import StationBuild from "@/views/index/stationBuild";
import Operation from "@/views/index/operation";
import Contribute from "@/views/index/contribute";
import NavRight from "@/components/navRight";
// import markerImg from "../assets/images/index/marker.png";
import normal from "../assets/images/index/normal.png";
import repair from "../assets/images/index/repair.png";
import build from "../assets/images/index/build.png";
import plan from "../assets/images/index/plan.png";
import { sendWebsocket } from "@/utils/websocket.js";
import { Loading } from "element-ui";

export default {
    dicts: ["sys_power_status"],
    components: {
        TopData,
        Electric,
        StationBuild,
        Operation,
        Contribute,
        NavRight,
    },
    data() {
        return {
            fontSize: null,
            option: {
                animation: false,
                amap: {
                    center: [115.823826, 31.495418],
                    resizeEnable: true,
                    zoom: 6.5, //缩放
                    zooms: [3, 8],
                    skyColor: "#33216a",
                    showLabel: false,
                },
                geo: {
                    map: "amap",
                    type: "map",
                    zoom: 1.2,
                    roam: true,
                },
            },
            myChart: null,
            map: null,
            /**websocket信息 */
            topList: {},
            dayKwhList: [],
            monthKwhList: [],
            yearKwhList: [],
            operationList: null,
            stationBuildList: [],
            stationList: null, //电站列表
            deviceTotalNum: null,
            contribute: {},
            netCapacity: null,
            //弹框信息
            stationName: null,
            dayKwh: null,
            totalKwh: null,
            runDays: null,
            stationStatus: null,
            stationId: null,
            cityName: null,
            //加载状态
            dataTrue: false,
        };
    },
    methods: {
        // 初始化地图
        async initEchartMap() {
            let provinceData = [];
            var layerProvince = new AMap.LabelsLayer({
                zIndex: 11,
                collision: false, // 开启标注避让
                animation: true, // 开启标注淡入动画
            });

            var districtSearch = new AMap.DistrictSearch({
                level: "country",
                subdistrict: 2, //  显示下级行政区级数
            });

            districtSearch.search("中国", function (status, result) {
                provinceData = result.districtList[0].districtList;
            });

            this.map = new AMap.Map("map", {
                center: [115.823826, 31.495418],
                resizeEnable: true,
                zoom: 6, //缩放
                zooms: [3, 6.4],
                skyColor: "#33216a",
                showLabel: false,
                pitch: 0, // 地图俯仰角度，有效范围 0 度- 83 度，不想要3D效果此处设置为0即可
                viewMode: "3D", // 地图模式
                zIndex: 10,
            });

            var Satellite = new AMap.TileLayer.Satellite({
                zIndex: 10,
            });
            var RoadNet = new AMap.TileLayer.RoadNet({
                zIndex: 10,
            });

            let self = this;
            this.map.on("complete", function () {
                for (var i = 0; i < provinceData.length; i++) {
                    var province = provinceData[i];
                    var marker = new AMap.LabelMarker({
                        name: province.name,
                        position: [province.center.lng, province.center.lat],
                        zIndex: 10,
                        text: {
                            content: province.name,
                            direction: "center",
                            style: {
                                fontSize: self.fontSize * 0.35,
                                fontWeight: 600,
                                fillColor: "#fff",
                                // backgroundColor: "rgb(246,137,38)",
                                borderColor: "#fff",
                            },
                        },
                    });
                    layerProvince.add(marker);
                }
                self.map.add(layerProvince);
            });
            //添加卫星图
            this.map.add([Satellite]);
            // this.borderLine("中国", this.map, "country", "#d3c9a4");
            this.borderLine("安徽省", this.map, "province", "#ffff01");
            this.borderLine("湖北省", this.map, "province", "#04ba1b");
        },
        // 地图省份描边
        async borderLine(city, Map, level, color) {
            let opts = {
                subdistrict: 1,
                // 是否返回行政区边界坐标点
                extensions: "all",
                // 设置查询行政区级别为 市
                level: level,
            };
            // 创建DistrictSearch对象
            const district = new AMap.DistrictSearch(opts);
            district.search(city, function (status, result) {
                let bounds = result.districtList[0].boundaries;
                for (let i = 0; i < bounds.length; i += 1) {
                    // 绘制边界线
                    new AMap.Polyline({
                        path: bounds[i],
                        strokeColor: color,
                        fillColor: "red",
                        fillOpacity: 0.2,
                        strokeWeight: 3,
                        map: Map,
                    });
                }
            });
        },
        // 实例化点标记
        addMarker() {
            var arr = [];
            var markers = [];
            this.stationList.forEach((item) => {
                let markerImg = "";
                switch (item.stationStatus) {
                    case 1:
                        markerImg = normal;
                        break;
                    case 2:
                        markerImg = repair;
                        break;
                    case 3:
                        markerImg = build;
                        break;
                    default:
                        markerImg = plan;
                        break;
                }
                var marker = new AMap.Marker({
                    icon: markerImg, //点标记图片路径
                    position: [item.stationLongitude, item.stationLatitude], //位置
                    offset: new AMap.Pixel(-8, -30), //偏移
                    zIndex: 10,
                });
                arr.push(
                    Object.assign(item, {
                        mapId: marker._amap_id,
                    })
                );
                marker.setMap(this.map);
                markers.push({ item, marker });
                // 鼠标点击marker弹出自定义的信息窗体
                let self = this;
                AMap.event.addListener(marker, "click", function (e) {
                    self.link();
                });
                AMap.event.addListener(marker, "mouseover", function (e) {
                    self.markerClick(item, marker);
                });
                AMap.event.addListener(marker, "mouseout", function (e) {
                    self.map.clearInfoWindow();
                });
            });
            let index = 0;
            this.markerClick(markers[0].item, markers[0].marker);
            index++;
            setInterval(() => {
                if (index > this.stationList.length - 1) {
                    index = 0;
                }
                this.markerClick(markers[index].item, markers[index].marker);
                index++;
            }, 3000);
        },
        //点击标记 获取所点击标记的信息以及窗体要展示的数据，创建信息窗体
        markerClick(item, marker) {
            this.stationName = item.stationName;
            this.dayKwh = item.dayKwh;
            this.totalKwh = item.totalKwh;
            this.runDays = item.runDays;
            this.stationStatus = item.stationStatus;
            this.stationId = item.stationId;
            let infoWindow = this.createInfoWindow();
            this.openInfoWindow(infoWindow, marker);
            // this.map.setCenter([
            //     item.stationLongitude,
            //     item.stationLatitude,
            // ]);
        },
        //构建自定义窗体
        createInfoWindow() {
            var infoWindowData = new AMap.InfoWindow({
                isCustom: true, //使用自定义窗体
                // content: this.getContent(),
                content: this.$refs.infoData,
                offset: new AMap.Pixel(16, -45),
            });
            return infoWindowData;
        },
        //打开窗体
        openInfoWindow(infoWindow, marker) {
            // debugger;
            infoWindow.open(this.map, marker.getPosition());
        },
        //关闭窗体
        closeInfoWindow() {
            this.map.clearInfoWindow();
        },
        /**字体大小计算 */
        fontSizeCompute() {
            let width = document.body.clientWidth;
            if (width >= 1200) {
                let fontsize = (width / 1920) * 40; //fontsize为当前屏幕的基数字体，相对于设计稿计算得到的。
                this.fontSize = fontsize;
                document.getElementsByTagName("html")[0].style.fontSize =
                    fontsize + "px";
            } else {
                this.fontSize = 40;
            }
            window.onresize = () => {
                //当页面尺寸改变的时候生效
                return (() => {
                    let width = document.body.clientWidth;
                    if (width >= 1200) {
                        let fontsize = (width / 1920) * 40;
                        this.fontSize = fontsize;
                        document.getElementsByTagName(
                            "html"
                        )[0].style.fontSize = fontsize + "px";
                    } else {
                        this.fontSize = 40;
                    }
                })();
            };
        },
        // 跳转链接
        link() {
            this.$router.push({
                path: "stationIndex",
                query: {
                    stationId: this.stationId,
                    cityName: "公安县",
                    stationName: this.stationName,
                },
            });
        },
        //字典翻译
        statusFormat(status) {
            for (let item of this.dict.type.sys_power_status) {
                if (item.value == status) {
                    return item.label;
                }
            }
        },
        //获取websocket的信息
        wsMessage(data) {
            !this.dataTrue && Loading.service({ fullscreen: true }).close();
            this.dataTrue = true;
            this.topList = {
                totalKwh: data.totalKwh,
                netCapacity: data.netCapacity,
                runDays: data.runDays,
                stationNum: data.stationNum,
                dayProfit: data.dayProfit,
                monthProfit: data.monthProfit,
                yearProfit: data.yearProfit,
                dayTotalKwh: data.dayTotalKwh,
                monthTotalKwh: data.monthTotalKwh,
                yearTotalKwh: data.yearTotalKwh,
                installCapacity: data.installCapacity,
            };
            if (!this.stationList) {
                this.stationList = data.stationList;
                let colors = ["#04ba19", "#e60012", "#a0a0a0", "#00369e"];
                for (let index in this.dict.type.sys_power_status) {
                    this.dict.type.sys_power_status[index]["number"] = 0;
                    this.dict.type.sys_power_status[index]["color"] =
                        colors[index];
                }
                for (let item of data.stationList) {
                    for (let dict of this.dict.type.sys_power_status) {
                        if (item.stationStatus == dict.value) {
                            dict["number"]++;
                        }
                    }
                }
                this.addMarker();
            }
            this.netCapacity = data.netCapacity;
            this.dayKwhList = data.dayKwhList;
            this.monthKwhList = data.monthKwhList;
            this.yearKwhList = data.yearKwhList;
            this.stationBuildList = data.stationBuildList;
            this.operationList = data.operationList;
            this.deviceTotalNum = data.deviceTotalNum;
            this.contribute = {
                carbonDioxide: data.CarbonDioxide,
                saveCoal: data.saveCoal,
                plantTree: data.plantTree,
                CCER: data.CCER,
            };
        },
    },
    created() {
        Loading.service({
            fullscreen: true,
            spinner: "el-icon-loading",
            text: "加载中...",
            background: "rgba(0, 0, 0, 0.8)",
        });
    },
    mounted() {
        this.stationInfoWs = sendWebsocket(
            "/system/websocket/homePage",
            null,
            this.wsMessage,
            null
        );
        this.initEchartMap();
        this.fontSizeCompute();
    },
    beforeDestroy() {
        document.getElementsByTagName("html")[0].style.fontSize = "16px";
        clearInterval();
    },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
.bgStyle {
    background-image: url("../assets/images/index/background.png");
}
.custom-info {
    border-radius: 5px;
    background-color: rgb(27, 47, 113, 0.5);
    padding: 10px;
}

div.info-middle {
    font-size: 12px;
    line-height: 20px;
}
div.info-div {
    font-size: 14px;
    padding: 2px 0;
    line-height: 20px;
    min-width: 300px;
    font-weight: 400;
}
.stationStatus {
    position: absolute;
    z-index: 99;
    top: 5px;
    left: 5px;
    background: url("../assets/images/index/status.png");
    background-size: 100% 100%;
    height: 50px;
    width: 12rem;
}
.ridao {
    width: 0.35rem;
    height: 0.35rem;
    border-radius: 50%;
}
.status {
    font-size: 0.35rem;
    color: #65c6e7;
    margin-left: 0.1rem;
}
</style>
