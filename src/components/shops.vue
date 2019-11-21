<template>
  <!-- 收藏店铺 -->
  <div class="list">
    <ul v-if="dataList.length!=0">
      <li v-for="(v,k) in dataList" :key="k" @click.stop="goShopx(v.sid,k)">
        <img :src="v.image" alt lazy-load />
        <div class="list-shop">
          <div class="shop-top">
            <h3>{{v.name}}</h3>
            <span>{{v.city}}</span>
          </div>
          <div class="shop-star">
            <van-rate v-model="v.star" disabled disabled-color="rgb(255,164,20)" :size="12" />
            <span>{{v.stars}}</span>
          </div>
          <span class="may">月销{{v.mothlySaleNumber}}</span>
        </div>
        <div class="quxiao" @click.stop="goShop(v.sid)">取消收藏</div>
      </li>
    </ul>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      cid:''
    };
  },
  components: {},
  onLoad() {
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
  },
  methods: {
    // 取消收藏
    goShop(id, k) {
      console.log(id);
      let datas = {
        cmd: "collectShop",
        cid: this.cid,
        sid: id,
        type: 1
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: "取消收藏成功",
              icon:"none"
            });
            this.dataList.splice(k, 1);
          }
        })
        .catch(res => {});
    },
    goShopx(id) {
      console.log(id + "goShopx");
      wx.navigateTo({
        url: "/pages/shopdetails/index?id=" + id
      });
      // this.$emit("goShopx", id);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;

  ul {
    width: 100%;

    li {
      width: 100%;
      padding: 0.15rem;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .quxiao {
        // margin-top: 45px;
        height: 30px;
        line-height: 30px;
        padding: 0 0.2rem;
        color: #808181;
        font-size:12px;
        border: 1px solid #dedede;
        box-sizing:border-box;
      }

      img {
        width: 2.3rem;
        height: 2.3rem;
      }

      .list-shop {
        flex: 1;
        padding: 0.2rem 0 0.2rem 0.3rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .shop-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          color: #1a1a1a;

          h3 {
            font-size: 13px;
          }
        }

        .shop-star {
          width: 100%;
          display: flex;
          align-items:center;
          // justify-content:space-between;
          color: #333;

          span {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
        }

        p {
          color: #333;
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
.may{
  font-size:12px;
  color:#999;
}
</style>
