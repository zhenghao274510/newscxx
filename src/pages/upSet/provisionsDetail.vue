<template>
  <div class="wrapper">
    <div class="problemDetails-zi">
      <web-view :src="url"></web-view>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      url: ""
    };
  },
  components: {},
  onLoad() {
    if (wx.getStorageSync('tiaowen')) {
      this.url = JSON.parse(wx.getStorageSync('tiaowen')).url;
      wx.setNavigationBarTitle({
        title: JSON.parse(wx.getStorageSync('tiaowen')).title
      });
    }

    console.log(this.url);
    // this.text = JSON.parse(options.id).title
  },
  mounted() {},
  methods: {}
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.wrapper {
  width: 100%;
  height: 100%;
}

.problemDetails-zi {
  width: 100%;
  height: 100%;
  padding: 0.1rem 0.4rem 30px;
  box-sizing: border-box;
}
</style>
