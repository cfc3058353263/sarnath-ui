<template>
  <div class="app-container" :style="'height:'+ height" v-loading="loading" >
    <iframe :src="url" frameborder="no" style="width: 100%;height: 100%" scrolling="auto"></iframe>
  </div>
</template>

<script>
export default {
  name: "report",
  data() {
    return {
       url:process.env.VUE_APP_REPORT_API + "/jmreport/list",
       height: document.documentElement.clientHeight - 94.5 + "px;",
    };
  },
  created() {
   
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false;
    }, 230);
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px;";
    };
  }
};
</script>