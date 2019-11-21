<template>
  <div class="contain">
    <div class="box">
      <div class="top" v-for="(v,k) in dataList" :key="k">
        <h3>购物体验满意度</h3>
        <van-rate :value="v.stars" :disabled="true" disabled-color="#ffd21e" />
        <p class="msg">{{v.content}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      cid: "",
      id: "",
      dataList: []
    };
  },
  components: {},
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "我的评价"
    });
    this.id = options.id;
    console.log(this.id);
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    this.man(this.id);
  },
  mounted() {},
  methods: {
    man(id) {
      let defaultAddress = {
        cmd: "evaluteList",
        cid: this.cid,
        orderId: id,
        pageNow: 1
      };
      Request.postRequest(defaultAddress)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            // this.value=res.stars;
            // this.content=res.content;
            this.dataList = res.dataList;
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  display: flex;
  flex-direction: column;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .top {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 1px solid #eee;
      padding: 0 0.4rem;
      box-sizing: border-box;

      h3 {
        width: 100%;
        padding: 0.5rem 0 0.3rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        color: #333;
      }

      p {
        width: 100%;
        padding: 0.3rem;
        box-sizing: border-box;
        background: #f5f5f5;
        border-radius: 8px;
        font-size: 14px;
        color: #999;
        line-height: 20px;
        margin-top: 0.3rem;
      }
    }
  }
}
</style>
