<template>
  <div class="contain">
    <div class="box">
      <div class="pay">
        <img src="/static/img/chenggong.png" alt />
        <span>支付成功</span>
        <div @click="back">查看订单</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0
    };
  },
  components: {},
  onLoad(options) {
    this.id = options.id;
    console.log(this.id);
    wx.setNavigationBarTitle({
      title: "支付成功"
    });
  },
  mounted() {},
  methods: {
    back() {
      let num;
      if (this.id == 0) {
        num = 2;
        wx.setStorageSync("tarnum", 0);
      } else if (this.id == 1) {
        num = 1;
        wx.setStorageSync("tarnum", 1);
      } else {
        num = 2;
        wx.setStorageSync("tarnum", 2);
      }
      this.$router.replace({
        path: "/pages/order/all",
        query: { id: num }
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  height: 100%;
}

.box {
  width: 100%;
  padding: 72px 0 0;

  .pay {
    width: 100%;
    padding: 2rem 0.4rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;

    img {
      width: 1.7rem;
      height: 1.7rem;
    }

    span {
      margin: 0.35rem 0;
    }

    div {
      width: 6rem;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgb(115, 210, 66);
      border-radius: 6px;
      color: #fff;
    }
  }
}
</style>
