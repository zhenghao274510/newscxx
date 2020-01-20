<template>
  <div class="list">
    <ul class="list-box" v-if="recommend.length!=0">
      <li v-for="(v,k) in recommend" :key="k" @click.stop="goDetail(v.gid)">
        <img src="/static/img/cross.png" alt class="xx" @click.stop="goDetailx(v.gid,k)" />
        <img :src="v.image" alt lazy-load class="imgs" />
        <div class="list-text">{{v.name}}</div>
        <div class="list-price">
          <div class="list-left">
            <span
              style="color: red;font-size: 14px;"
              v-if="v.unitPrice!==undefined"
            >￥{{v.unitPrice}}</span>
            <span
              style="color: red;font-size: 14px;"
              v-if="v.unitPrice==undefined"
            >￥{{v.originalPrice}}</span>
          </div>
          <div class="list-right">
            <span style="color: #666;font-size: 14px;">已售：{{v.saleNumber}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  props: {
    recommend: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      cid:''
    };
  },
  onLoad() {},
  onShow() {
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }
  },
  methods: {
    goDetail(id) {
      wx.navigateTo({
        url: "/pages/Good/gooddetials?id=" + id
      });
      //      wx.navigateTo({
      //   url: "/pages/pintuan/gooddetailspin?id=" + k
      // });
    },
    goDetailx(id, k) {
      let datas = {
        cmd: "collectGoods",
        cid: this.cid,
        id: id,
        type: 1
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: "取消收藏商品成功",
              icon: "none"
            });
            // this.$commit('init')
            this.recommend.splice(k, 1);
          }
        })
        .catch(res => {});
    }
  }
};
</script>
<style>
page {
  width: 100%;
  min-height: 100%;
  background: rgb(250, 250, 250);
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  h3 {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    color: #333;
  }

  .list-box {
    margin-top: 0.2rem;
    width: 100%;
    height: 90%;
    padding: 0 0.3rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 49%;
      height: 5rem;
      background: #fff;
      padding: 0.2rem;
      box-sizing: border-box;
      margin-bottom: 0.2rem;
      position: relative;

      .xx {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
      }

      .imgs {
        width: 100%;
        height: 70%;
      }

      .list-text {
        width: 100%;
        font-size: 12px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .list-price {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.4rem;
      }
    }
  }
}
</style>
