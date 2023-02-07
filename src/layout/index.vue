<template>
    <div :class="classObj" class="app-wrapper" :style="{'--current-color': theme}">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <top-navigation ref="topNav" :index="index" @changeIndex="changeIndex"></top-navigation>
        <div v-if="this.path.length != 2">
            <sidebar class="sidebar-container" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }" />
            <div :class="{hasTagsView:needTagsView}" class="main-container">
                <div :class="{'fixed-header':fixedHeader}">
                    <navbar :index="index" />
                    <tags-view v-if="needTagsView" />
                </div>
                <app-main />
                <right-panel v-if="showSettings">
                    <settings />
                </right-panel>
            </div>
        </div>

        <div v-if="this.path.length == 2" style="height:100%">
            <app-main class="IndexStyle"/>
        </div>
    </div>
</template>

<script>
import RightPanel from "@/components/RightPanel";
import { AppMain, Navbar, Settings, Sidebar, TagsView } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { mapState } from "vuex";
import variables from "@/assets/styles/variables.scss";
import TopNavigation from "@/TopNavigation"; //topNav

export default {
    name: "Layout",
    components: {
        AppMain,
        Navbar,
        RightPanel,
        Settings,
        Sidebar,
        TagsView,
        TopNavigation,
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapState({
            theme: (state) => state.settings.theme,
            sideTheme: (state) => state.settings.sideTheme,
            sidebar: (state) => state.app.sidebar,
            device: (state) => state.app.device,
            showSettings: (state) => state.settings.showSettings,
            needTagsView: (state) => state.settings.tagsView,
            fixedHeader: (state) => state.settings.fixedHeader,
        }),
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === "mobile",
            };
        },
        variables() {
            return variables;
        },
    },
    watch: {
        $route(to, from) {
            this.loadPath(to.path)
        },
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch("app/closeSideBar", {
                withoutAnimation: false,
            });
        },
        changeIndex(value) {
            this.index = value;
        },
        loadPath(value) {
            this.path = value.split("/");
            this.$store.commit("SET_ROUTERPREFIX", "/" + this.path[1]);
            switch (this.path[1]) {
                case "index":
                    this.index = "1";
                    break;
                case "light":
                    this.index = "2";
                    break;
                case "wind":
                    this.index = "3";
                    break;
                case "statistics":
                    this.index = "4";
                    break;
                case "system":
                    this.index = "5";
                    break;
            }
        },
    },
    data() {
        return {
            index: "1",
            path:[],
        };
    },
    created() {
        this.loadPath(this.$route.path);
    },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.mobile .fixed-header {
    width: 100%;
}

//大屏背景样式
.IndexStyle{
//   background-image: url("../assets/images/index01.png");
//   background-size: cover;
//   background-position: center center;
  height:100%;
  padding-top:50px;
  overflow:auto;
  box-sizing: border-box;
}
</style>
