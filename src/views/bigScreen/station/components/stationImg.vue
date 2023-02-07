<template>
    <div class="flex-1 flex flex-v wh100">
        <div class="title">
            <span class="ml5">电站图片</span>
        </div>
        <div class="flex-1">
            <div style="height:100%;padding:0 10px 10px" @click="showVisible">
                <el-image style="width: 100%; height: 100%" :src="img" fit="cover">
                    <div slot="error" class="image-slot">
                    </div>
                </el-image>
            </div>
        </div>
        <el-dialog title="" :visible.sync="visible" width="900" :before-close="dialogBeforeClose" :close-on-press-escape="false">
            <div id="player">
                <video-player ref="videoPlayer" class="video-player vjs-big-play-centered" :playsinline="false" :options="playerOptions" @ready="onPlayerReady" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnd($event)" />
            </div>
            <div slot="footer">
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
export default {
    components: { videoPlayer },
    props: {
        imgUrl: {
            type: String,
            default: null,
        },
        stationVideo: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            img: null,
            visible: false,
            playerOptions: {
                // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, // 如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: "zh-CN",
                aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [
                    {
                        type: "video/mp4", // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                        src: null, // url地址
                    },
                ],
                hls: true,
                // poster: "http://pic33.nipic.com/20131007/13639685_123501617185_2.jpg", // 你的封面地址
                width: document.documentElement.clientWidth, // 播放器宽度
                notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true, // 全屏按钮
                },
            },
        };
    },
    methods: {
        // 准备好了
        onPlayerReady(v) {
        },
        // 播放了
        onPlayerPlay(v) {
        },
        // 暂停了
        onPlayerPause(v) {
        },
        // 播放结束了
        onPlayerEnd(v) {
        },
        dialogBeforeClose() {
            this.visible = false;
            this.$refs.videoPlayer.player.pause(); // 暂停
        },
        showVisible() {
            if (!this.playerOptions.sources[0].src) {
                this.$message.error("暂无视频播放");
            } else {
                this.visible = true;
                this.$nextTick(()=>{
                    this.$refs.videoPlayer.player.play() // 播放
                // console.log(this.$refs.videoPlayer.player.play())
                })
            }
        },
    },
    watch: {
        imgUrl: {
            handler(newVal, oldVal) {
                if (!this.img) {
                    this.img = newVal;
                }
            },
        },
        stationVideo: {
            handler(newVal, oldVal) {
                if (!this.playerOptions.sources[0].src) {
                    this.playerOptions.sources[0].src = newVal.split("?")[0];
                    // this.playerOptions.sources[0].src = "http://192.168.9.210:9000/daoshengstation/2022/05/27/b524ef310efdc2f2069973ca8ec6f357_20220527112443A002.mp4";
                }
            },
        },
    },
};
</script>

<style scoped lang="scss">
#player {
    margin: 0 auto;
}

.title {
    padding: 10px;
    border: 1px #081a42 solid;
    background-color: rgb(3, 21, 57, 0.3);
    width: 100%;
    font-size: 0.4rem;
    color: #65c6e7;
    float: left;
}
.stationImg {
    padding: 0 10px 10px 10px;
}
::v-deep .el-carousel__container {
    position: relative;
    height: 100%;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
::v-deep .el-dialog__body {
    padding: 0;
}
::v-deep .el-dialog__header {
    padding: 0;
}
::v-deep .el-dialog__body {
    padding: 0px;
}
::v-deep .el-dialog__footer {
    display: none;
}
</style>