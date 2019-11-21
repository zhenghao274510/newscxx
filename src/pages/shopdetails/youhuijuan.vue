<template>
  <div class="contain">
    <div class="box">
      <ul>
        <li v-for="(v,k) in coupons" :key="k">
          <img src="/static/img/youhuijuan.png" alt />
          <div class="c_price">
            <span>￥</span>
            <span style="font-size:30px">{{v.amount}}</span>
          </div>
          <div class="c_produce">
            <h3>满{{v.miniPurchase}}元可用</h3>
            <div class="c_time">
              <span>有效期至:{{v.closingDate}}</span>
              <span
                style="color: #72d140;margin-left:20px;"
                @click="getCoupon(v.state,v.id)"
                v-if="v.state==0"
              >点击领券</span>
              <span style="margin-left:20px;" @click="getCoupon(v.state,v.id)" v-else>已领取</span>
            </div>
            <p>仅限{{user}}使用</p>
          </div>
        </li>
      </ul>
      <div class="no" v-if="noCoupons">暂没有优惠券可以领取</div>
      <div class="loading" v-if="more">
        <span>没有更多了</span>
      </div>
    </div>
    <dialogs :data1="data1" :data2="data2" :showDialog="showDialog" @hide="hide"></dialogs>
    <dialogs :data1="datas1" :data2="data2" :data3="data3" :showDialog="showDialogs" @hide="hides"></dialogs>
  </div>
</template>

<script>
import Dialogs from "@/components/dialogs";
import Request from "@/common/js/request";
export default {
  data() {
    return {
      text: "领取优惠券",
      data1: "领取成功",
      datas1: "领取失败",
      data2: "知道了",
      data3: "您已领取过优惠券，不要太贪心哦!",
      showDialog: false,
      showDialogs: false,
      coupons: [],
      page: 1,
      noCoupons: false,
      cid: "",
      id: "",
      user: "",
      more: false,
      totalPage: 1
    };
  },
  components: {
    Dialogs
  },
  onLoad(options) {
    console.log(options.params);
    this.id = JSON.parse(options.params).id;
    this.user = JSON.parse(options.params).name;
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
  },
  mounted() {
    this.infinite();
  },
  //  上拉触底 加载
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page++;
      this.infinite();
    } else {
      this.more = true;
    }
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  methods: {
    getCoupon(state, id) {
      let self = this;
      if (state == 0) {
        let datas = {
          cmd: "receiveCoupon",
          id: id,
          cid: this.cid
        };
        Request.postRequest(datas)
          .then(res => {
            if (res.result == 0) {
              console.log(res);
              this.showDialog = true;
              this.infinite();
            }
          })
          .catch(res => {});
      } else if (state == 1) {
        this.showDialogs = true;
      }
    },
    hide() {
      this.showDialog = false;
    },
    hides() {
      this.showDialogs = false;
    },
    infinite() {
      let self = this;
      let datas = {
        cmd: "couponList",
        id: this.id,
        cid: this.cid
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            self.totalPage = res.totalPage;
            if (res.dataList.length > 0) {
              self.noCoupons = false;
              res.dataList.forEach(item => {
                item.closingDate = item.closingDate.substring(0, 10);
              });
              self.coupons = res.dataList;
            } else if (self.page <= self.totalPage) {
              this.more = true;
            } else {
              self.noCoupons = true;
            }
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
  background: #f5f5f5;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  height: 100%;
}

.no {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
}

.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;

    li {
      width: 100%;
      height: 2.4rem;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      margin: 0.15rem 0;
      position: relative;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }

      .c_price {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: red;
        border-right: 1px dashed #eee;
        z-index: 12;
      }

      .c_produce {
        margin-left: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding: 0.2rem 0 0.2rem 0;
        box-sizing: border-box;
        z-index: 12;

        h3 {
          width: 100%;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 16px;
          color: #333;
        }

        .c_time {
          width: 100%;
          height: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;

          span {
            font-size: 12px;
            color: #999;
          }
        }
      }

      p {
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 14px;
        color: #999;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>
