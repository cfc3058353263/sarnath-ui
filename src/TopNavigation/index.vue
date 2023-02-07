<template>
    <div class="topNav">
        <el-menu :default-active="index" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">光伏运维</el-menu-item>
            <!-- <el-menu-item index="3">风电运维</el-menu-item> -->
            <el-menu-item index="4">统计分析</el-menu-item>
            <el-menu-item index="5">系统管理</el-menu-item>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
              <div class="avatar-wrapper">
                    <div class="user-avatar">
                        <span>{{this.$store.getters.name}}</span>
                    </div>
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu>
    </div>
</template>
<script>
import { getStationId, setStationId,getSystemId ,setSystemId } from '@/utils/auth'
export default {
    name: "TopNavigation",
    props: {
        index: {
            type: String,
            default: "1",
        },
    },
    methods: {
        handleSelect(key, keyPat,route) {
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
                    if (obj[0].stations.length !== 0) {
                        this.$store.dispatch("tagsView/delAllViews"); //清空其他系统的缓存
                        this.changeHeader(obj[0]) //添加电站id和系统id
                        this.changeSystem(obj[0].list); //系统切换更新菜单
                        this.$emit("changeIndex", key); //修改父组件index的值
                        this.$router.push({ path: route.path?route.fullPath:"/light" }).catch((err) => {}); //默认的页面跳转
                    }
                    break;
                case "3":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "风电运维";
                    });
                    if (obj[0].stations.length !== 0) {
                        this.changeHeader(obj[0])
                        setSystemId(obj[0].systemId)
                        this.changeSystem(obj[0].list);
                        this.$emit("changeIndex", key);
                        this.$store.dispatch("tagsView/delAllViews");
                        this.$router.push({ path: route.path?route.fullPath:"/wind" }).catch((err) => {});
                    }
                    break;
                case "4":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "统计分析";
                    });
                    if (obj[0].list.length !== 0) {
                        this.changeHeader(obj[0])
                        setSystemId(obj[0].systemId)
                        this.changeSystem(obj[0].list);
                        this.$emit("changeIndex", key);
                        this.$store.dispatch("tagsView/delAllViews");
                        this.$router.push({ path: route.path?route.fullPath:"/statistics/statistics/spgStatistics" }).catch((err) => {});
                    }
                    break;
                case "5":
                    obj = this.$store.getters.routes.filter((item, index) => {
                        return item.systemName === "系统管理";
                    });
                    if (obj[0].list.length !== 0) {
                        this.changeHeader(obj[0])
                        setSystemId(obj[0].systemId)
                        this.changeSystem(obj[0].list);
                        this.$emit("changeIndex", key);
                        this.$store.dispatch("tagsView/delAllViews");
                        this.$router.push({ path: route.path?route.fullPath:"/system/system/dept" }).catch((err) => {});
                    }
                    break;
            }
        },
        changeSystem(route) { //系统切换
            this.$store.commit("SET_SIDEBAR_ROUTERS", route);
        },
        changeHeader(arr){    //系统id 和 电站id 的切换
            if(getSystemId() == arr.systemId){
                this.$store.commit('SET_CURRENTSYSTEM', getSystemId())
                this.$store.commit('SET_STATIONLIST', arr.stations)
            }else{
                setSystemId(arr.systemId) //本地系统id
                this.$store.commit('SET_CURRENTSYSTEM', arr.systemId) //全局系统id
                if(arr.stations.length !== 0){
                    this.$store.commit('SET_STATIONLIST', arr.stations)
                    this.$store.commit('SET_CURRENTSTATION', arr.stations[0].stationId) //全局电站id
                }
            }
        },
        async logout() {
            this.$confirm("确定注销并退出系统吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                location.href = "/index";
                });
            });
        },
    },
    created() {
        this.handleSelect(this.index,null,this.$route);
    },
};
</script>
<style scoped lang="scss">
.topNav {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1500;
}
.el-menu {
    display: flex;
    justify-content: center;
}
.el-menu.el-menu--horizontal {
    border-bottom: 0px;
}
.avatar-container{
    height: 50px;
    position: absolute;
    top:0;
    right: 50px;
    .avatar-wrapper {
        position: relative;
    .user-avatar {
        height: 50;
        line-height: 50px;
        cursor: pointer;
        border-radius: 10px;
        color: #fff;
        font-size: 14px;
    }

    .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
        }
    }
}
.el-dropdown {
    color: #fff;
}
</style>
