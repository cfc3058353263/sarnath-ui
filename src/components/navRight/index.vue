<template>
    <div class="navR flex flex-v flex-pack-around" ref="navR" :style="{right:rightD}">
        <div class="navR_indicate" v-if='show_navR_indicate' style="">
        </div>
        <div class="navRItemOuterOuter" @click="toPage(menu.key)" v-for="(menu, menu_idx) in menus" :key="menu_idx">
            <div class="navRItemOuter">
                <div class="navRItem">
                    <div class="navRItemInner navRItemInner1 flex flex-align-center flex-pack-center">
                        <i :class="menu.icon"></i>
                        <i v-if="menu_idx!=menusLen" class="iconfont icon-xialajiantouxiangxia"></i>
                    </div>

                    <div class="navRItemInner navRItemInner2 flex flex-align-center flex-pack-center">
                        <div class="navRItemName1">
                            <div>{{menu.title.substring(0,2)}}</div>
                            <div>{{menu.title.substring(2)}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import debounce from "lodash/debounce";
import {
    getStationId,
    setStationId,
    getSystemId,
    setSystemId,
} from "@/utils/auth";

export default {
    // props: {
    //     menus: Array,
    // },
    components: {},

    computed: {
        rightD() {
            return this.show ? "3px" : "-70px";
        },
    },

    data() {
        return {
            menusLen: 0,
            show_navR_indicate: true,
            menus: [
                {
                    icon: "iconfont icon-fupin",
                    title: "首页",
                    index: "index",
                    key: "1",
                },
                {
                    icon: "iconfont icon-yewutubiaonengxiaobutie",
                    title: "光伏运维",
                    index: "light",
                    key: "2",
                },
                {
                    icon: "iconfont icon-guihuaxiangmu",
                    title: "统计分析",
                    index: "statistics",
                    key: "4",
                },
                {
                    icon: "iconfont icon-xiangmu",
                    title: "系统管理",
                    index: "system",
                    key: "5",
                },
            ],
            show: false,
        };
    },
    mounted: function () {
        document.addEventListener("mousemove", this.handleMousemove);
        this.menusLen = this.menus.length - 1;
    },
    destroyed() {
        document.removeEventListener("mousemove", this.handleMousemove);
    },

    methods: {
        handleMousemove: debounce(function (event) {
            // console.log('onmousemove', event);
            let screenWidth = document.body.clientWidth;
            let leftDis = event.pageX;
            let d = screenWidth - leftDis; //鼠标距离窗口右边的距离

            this.show = this.show ? d < 70 : d < 25;
            if (this.show) {
                this.show_navR_indicate = false;
            } else {
                this.show_navR_indicate = true;
            }
        }, 20),
        handleSelect(key, keyPat, route) {
            let obj;
            switch (key) {
                case "1":
                    this.$store.dispatch("tagsView/delAllViews"); //清空其他系统的缓存
                    this.$router.push({ path: "/index" }).catch((err) => {});
                    break;
                case "2":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "光伏运维";
                    });
                    if (this.$store.getters.permissions[0].menus.length !== 0) {
                        this.$store.dispatch("tagsView/delAllViews"); //清空其他系统的缓存
                        this.changeHeader(obj[0]); //添加电站id和系统id
                        this.changeSystem(obj[0].list); //系统切换更新菜单
                        this.$router.push("/light").catch((err) => {}); //默认的页面跳转
                    }
                    break;
                case "4":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "统计分析";
                    });
                    if (obj[0].list.length !== 0) {
                        this.changeHeader(obj[0]);
                        setSystemId(obj[0].systemId);
                        this.changeSystem(obj[0].list);
                        this.$store.dispatch("tagsView/delAllViews");
                        this.$router
                            .push("/statistics/statistics/spgStatistics")
                            .catch((err) => {});
                    }
                    break;
                case "5":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "系统管理";
                    });
                    if (obj[0].list.length !== 0) {
                        this.changeHeader(obj[0]);
                        setSystemId(obj[0].systemId);
                        this.changeSystem(obj[0].list);
                        this.$store.dispatch("tagsView/delAllViews");
                        this.$router
                            .push("/system/system/dept")
                            .catch((err) => {});
                    }
                    break;
            }
        },
        changeSystem(route) {
            //系统切换
            this.$store.commit("SET_SIDEBAR_ROUTERS", route);
        },
        changeHeader(arr) {
            //系统id 和 电站id 的切换
            if (getSystemId() == arr.systemId) {
                this.$store.commit("SET_CURRENTSYSTEM", getSystemId());
                this.$store.commit("SET_STATIONLIST", arr.stations);
            } else {
                setSystemId(arr.systemId); //本地系统id
                this.$store.commit("SET_CURRENTSYSTEM", arr.systemId); //全局系统id
                if (arr.stations.length !== 0) {
                    this.$store.commit("SET_STATIONLIST", arr.stations);
                    this.$store.commit(
                        "SET_CURRENTSTATION",
                        arr.stations[0].stationId
                    ); //全局电站id
                }
            }
        },
        //页面跳转
        toPage: function (target) {
            this.handleSelect(target);
        },
    },
};
</script>

<style scoped>
.navR {
    position: fixed;
    /* right: -70px; */
    top: 45%;
    width: 70px;
    /*height: 600px;*/
    z-index: 1500;
    transform: translateY(-50%);

    -webkit-transition: right 0.3s;
    transition: right 0.3s;
    -webkit-transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
    background-color: rgba(0, 0, 0, 0.4);
}

.navR .iconfont {
    font-size: 54px;
}

.navR .iconfont.icon-index {
    font-size: 64px;
}

.navRItemOuterOuter {
    width: 70px;
    height: 70px;
    /* border:1px solid #1EEDFF; */
    /* background-color: rgba(200, 200, 200, 0.5); */
    background-color: rgba(0, 0, 0, 0);
    /* border-radius: 50% 50%; */
    margin-top: 5px;
    margin-bottom: 5px;
    cursor: pointer;

    overflow: hidden;
    padding: 0;
    -webkit-transition: border-color 0.3s, background-color 0.3s;
    transition: border-color 0.3s, background-color 0.3s;
    -webkit-transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.navRItemInner {
    width: 70px;
    height: 70px;
}

.navRItemInner1 {
    color: rgba(30, 237, 255, 0.8);
    position: relative;
}
.icon-xialajiantouxiangxia {
    position: absolute;
    bottom: -27px;
    left: 50%;
    transform: translateX(-50%) scale(0.5);
    font-size: 5px;
}
.icon-xialajiantouxiangxia:nth-child(5) {
    display: none;
}

.navRItemInner2 {
    color: rgba(30, 237, 255, 0.8);
}

.navRItemOuterOuter {
    position: relative;
}

.navRItemOuterOuter:hover {
    background-color: rgba(63, 81, 181, 1);
}

.navRItem {
    position: absolute;
    z-index: 100001;

    -webkit-transition: -webkit-transform 0.2s, opacity 0.2s;
    transition: transform 0.2s, opacity 0.2s;

    /* -webkit-transform: translateY(-70px);
     transform: translateY(-70px); */
    -webkit-transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
    transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}

.navRItemOuterOuter:hover .navRItem {
    -webkit-transform: translateY(-70px);
    transform: translateY(-70px);
}

.navRItemOuterOuter:hover {
    /* background-color: rgba(20, 20, 20, 0.9); */
    background-color: rgba(1, 102, 255, 0.9);
}

/* .navRItemName{
    position: absolute;
    right:66px;
    top:20px;
    height:30px;
    line-height: 30px;
    font-size: 20px;
    padding-right:0px;
    color:white;
    opacity:1;
    overflow: hidden;
    width:0px;
    background-color: rgba(20,20,20,0.4);

    -webkit-transition:opacity 0.2s,width 0.2s;
  	transition:opacity 0.2s,width 0.2s;
    z-index: 1;
  }
  .navRItemOuterOuter:hover .navRItemName{
    opacity: 1;
    width:100px;
  }
  .navRItemNameC{
    z-index: 1;
    width:100px;
    padding-right:10px;
    float: right;
    text-align: right;
  } */

.navRItemName1 {
    font-size: 18px;
    line-height: 20px;
    color: white;
}
.icon-guihuaxiangmu {
    font-size: 48px !important;
    padding-bottom: 8px;
}
.icon-xiangmu {
    font-size: 46px !important;
    padding-bottom: 8px;
}
.icon-ziyuan {
    font-size: 42px !important;
    padding-bottom: 8px;
}
.icon-yewutubiaonengxiaobutie {
    font-size: 42px !important;
    padding-bottom: 8px;
}
.icon-energy {
    font-size: 52px !important;
    padding-bottom: 8px;
}
.icon-fupin {
    font-size: 46px !important;
    padding-bottom: 8px;
}
.icon-chengguo {
    font-size: 46px !important;
    padding-bottom: 0px;
}
.icon-chengguo + .icon-xialajiantouxiangxia {
    display: none;
}

.navR_indicate {
    position: absolute;
    height: 100%;
    width: 2px;
    background-color: #41fcfa;
    left: -2px;
    box-shadow: -1px 0 5px #41fcfa;
    animation: opacityChange 1s ease-out infinite alternate;
    -webkit-animation: opacityChange 1s ease-out infinite alternate;
}
@keyframes opacityChange {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}

@-webkit-keyframes opacityChange /*Safari and Chrome*/ {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.2;
    }
}

.handR {
    display: none;
    position: absolute;
    width: 24px;
    height: 24px;
    animation: handBounce 1s ease-out infinite alternate;
    -webkit-animation: handBounce 1s ease-out infinite alternate;
}
@keyframes handBounce {
    0% {
        left: -30px;
    }
    60% {
        left: -26px;
    }
    100% {
        left: -26px;
    }
}
</style>