<template>
  <div class="list" @click.stop>
    <h3 v-if="tits">{{tits}}</h3>
    <ul class="list-box">
      <li v-for="(v,k) in recommend" :key="k" @click.stop="goDetail(v.id)">
        <div class="divimg">
          <img :src="v.image" alt lazy-load />
        </div>
        <div class="list-text">{{v.name}}</div>
        <div class="list-price">
          <div class="list-left">
            <span v-if="v.price!==undefined">￥{{v.price}}</span>
            <s v-if="v.discount==1">￥{{v.originalPrice}}</s>
          </div>
          <img src="/static/img/gouwuche2.png" alt @click.stop="shopcart(v)" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  props: {
    tits: {
      type: String,
      default: ""
    },
    recommend: {
      type: Array,
      default: []
    },
    direct: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cid: ""
    };
  },
  onShow() {
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }
  },
  methods: {
    goDetail(id) {
      console.log(id);
      let obj = {};
      obj.id = id;
      if (this.direct == 100) {
        obj.type = 1;
        wx.navigateTo({
          url: "/pages/pintuan/gooddetailspin?id=" + JSON.stringify(obj)
        });
      } else if (this.direct == 200) {
        obj.type = 2;
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      } else {
        obj.type = 0;
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      }
    },
    shopcart(v) {
      if (this.cid == undefined || this.cid=="") {
        console.log(this.cid, 31);
        wx.showModal({
          title: "温馨提醒！",
          content: "你还没有登录，请先登录",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/author/index"
              });
            }
          }
        });
      } else {
        console.log(32);
        let datas = {
          cmd: "addToCar",
          gid: v.id,
          cid: this.cid,
          specifications: v.skuId,
          number: 1
        };
        Request.postRequest(datas)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              wx.showToast({
                title: "添加购物车成功",
                icon: "none"
              });
              this.$api.getnum(this.cid);
              // this.gounum();
              // this.donghua = false;
            }
          })
          .catch(res => {});
      }
      console.log(v);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #333;
  }

  .list-box {
    margin-top: 0.2rem;
    width: 100%;
    padding: 0 0.1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    li {
      align-items: center;
      width: 49%;
      background: #fff;
      padding: 0.2rem;
      box-sizing: border-box;
      margin-bottom: 0.2rem;

      .divimg {
        width: 100%;
        height: 144px;
        overflow: hidden;
        text-align: center;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .list-text {
        width: 100%;
        font-size: 12px;
        color: #333;
        margin: 0.2rem 0;
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

        .list-left {
          display: flex;

          span {
            font-size: 16px !important;
            color: red;
          }

          s {
            font-size: 14px;
            text-decoration: line-through;
            color: #dedede;
            margin-left: 10px;
          }
        }

        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
    }
  }
}
</style>
