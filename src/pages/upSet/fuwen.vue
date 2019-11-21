<template>
  <div class="list">
    <web-view :src="'https://m.scxxsx.com'+url"></web-view>
    <!-- <iframe :src="'http://39.108.249.42'+url"></iframe> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  components: {},
  onLoad(options) {
    this.url = wx.getStorageSync("url");
    wx.removeStorageSync("url");

    console.log(this.url);
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.active {
  background: #72D141;
  color: #fff !important;
  border: none !important;
}

.list {
  width: 100%;
  height: 100%;
  padding-top: 50px;
}
</style>
