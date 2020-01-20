<template>
  <div class="list">
    <h3 v-if="tits">{{tits}}</h3>
    <ul class="list-box">
      <li v-for="(v,k) in recommend" :key="k" @click.stop="goDetail(v)">
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
    //  上拉刷新
    onPullDownRefresh() {
      console.log("开始刷新");
      //  this.initDta();
    },
    onReachBottom() {
      console.log("到底了");
    },
    goDetail(item) {
      let obj = { type: item.type, id: item.id };
      if (item.type == 1||item.type==100) {
        wx.navigateTo({
          url: "/pages/pintuan/gooddetailspin?id=" + JSON.stringify(obj)
        });
      } else if (item.type == 2) {
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      } else {
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      }
    },
    shopcart(v) {
      console.log("recommendfen")
      if (this.cid == undefined||this.cid=="") {
        console.log(21);
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
        console.log(2);
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
                icon:'none'
              });
              this.$api.getnum(this.cid);
            }
          })
          .catch(res => {});
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  background: rgb(250, 250, 250);

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
      padding: 0.3rem;
      box-sizing: border-box;
      margin-bottom: 0.2rem;

      .divimg {
        width: 100%;
        overflow: hidden;
        height: 144px;
        text-align: center;
        font-size: 0;

        img {
          width: 100%;
          height: 130px;
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
