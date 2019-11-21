<template>
  <div class="contain">
    <div class="box">
      <h3 v-if="state == 0">
        <span @click="gotoPay">去支付</span>
        <!-- <span @click="quxiao">取消订单</span> -->
      </h3>
      <!--//订单状态 0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
      <!-- 订单状态 0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款 -->
      <!-- <div class="wait" v-if="state == 1">等待商家接单</div> -->
      <div class="cancel" v-if="state ==1">
        <span style="font-size:14px;margin-bottom:0.4rem;">等待商家接单</span>
        <div class="look" style="font-size:14px;color:#fff;" @click="shentui">申请退款</div>
      </div>
      <div class="cancel" v-if="state ==2">
        <span style="font-size:14px;margin-bottom:0.4rem;">商家已接单，待发货</span>
        <div class="look" style="font-size:14px;color:#fff;" @click="shentui">申请退款</div>
      </div>
      <div class="cancel" v-if="state == 3">
        <span style="font-size:14px;margin-bottom:0.4rem;">商品正在路上，请耐心等待</span>
        <div class="lookmore">
          <div
            class="look"
            style="font-size:14px;color:#fff;"
            @click="goLogistic(orders.goods)"
            v-if="orders.deliveryType==2||orders.wlNo!==''"
          >查看物流</div>
          <div
            class="look"
            style="font-size:14px;color:#fff;"
            @click="call(orders.recevingCall)"
            v-else-if="orders.deliveryType==1"
          >联系收派员</div>
          <div class="look" style="font-size:14px;color:#fff;" @click="shentui">申请退款</div>
        </div>
      </div>
      <div class="cancel" v-if="state == 4">
        <span style="font-size:14px;margin-bottom:0.4rem;">待评价</span>
        <div class="look" style="font-size:14px;" @click="pjlun(orders)">
          <div style="color:#fff;" @click="ping">去评价</div>
        </div>
      </div>
      <div class="cancel" v-if="state == 5">
        <span style="font-size:14px;margin-bottom:0.4rem;">订单已完成, 感谢您的使用</span>
        <div class="look" style="font-size:14px;color:#fff;" @click="checkComment">查看评价</div>
      </div>
      <div class="cancel" v-if="state ==6">
        <span style="font-size:14px;margin-bottom:0.4rem;">订单已取消</span>
        <span style="font-size:14px;color:#999;">取消原因：{{orders.reason}}</span>
        <span @click="del" class="pos">删除订单</span>
      </div>
      <div class="cancel" v-if="state == 7">
        <span style="font-size:14px;margin-bottom:0.4rem;">等待商家同意退单申请</span>
        <span style="font-size:14px;color:#999;">退款原因：{{orders.reason}}</span>
        <span @click="subShen" class="pos">取消申请</span>
      </div>
      <div class="cancel" v-if="state == 8">
        <span style="font-size:14px;margin-bottom:0.4rem;">已退款</span>
        <span style="font-size:14px;color:#999;">退款原因：{{orders.reason}}</span>
        <span @click="del" class="pos">删除订单</span>
      </div>
    </div>
    <div class="go_shop">
      <h3>{{orders.sname}}</h3>
      <ul>
        <li v-for="(v,k) in ordershop" :key="k" @click="tiaoimg(v.id)">
          <img :src="v.image" alt lazy-load />
          <div class="lis_right">
            <div class="lis_detail">
              <span>{{v.name}}</span>
              <span>X {{v.number}}</span>
              <span>￥{{v.price}}</span>
            </div>
            <div class="lis_key">规格：{{v.specifications}}</div>
          </div>
        </li>

        <li style="margin-top: 0.5rem">
          <span>配送费:</span>
          <span>￥{{orders.distributionFee}}</span>
        </li>
      </ul>
    </div>
    <div class="msg">
      <div class="user_coupon" v-if="orders.discountFee!=='0.00'">
        <span>优惠券</span>
        <div class="c_coupon">
          <span>-￥{{orders.discountFee}}</span>
        </div>
      </div>
      <div class="user_coupon">
        <span>订单总计</span>
        <div class="c_coupon">
          <span style="color:red;">￥{{orders.finalPay}}</span>
        </div>
      </div>
      <a class="link" @click="tel(orders.smobile)">
        <img src="/static/img/tel.png" alt />
        <span>联系商家</span>
      </a>
    </div>
    <div class="orders">
      <div class="user_coupon">
        <span>订单信息</span>
      </div>
      <div class="user_coupon" >
        <span>订单号</span>
        <div class="c_coupon">
          <span>{{orders.id}}</span>
        </div>
      </div>
      <div class="user_msg" >
        <span>收货地址</span>
        <div class="address">
          <p>{{orders.address}}</p>
          <div>
            <span>{{orders.username}}</span>
            <span>{{orders.phone}}</span>
          </div>
        </div>
      </div>
      <div class="beizhu_msg">
        <span>备注信息：</span>
        <p>{{orders.remark}}</p>
      </div>
      <div class="user_coupon">
        <span>创建时间</span>
        <div class="c_coupon">
          <span>{{orders.createTime}}</span>
        </div>
      </div>
      <div class="user_coupon" v-if="state == 6">
        <span>取消时间</span>
        <div class="c_coupon">
          <span>{{orders.cancelTime}}</span>
        </div>
      </div>
      <div
        class="user_coupon"
        v-if="state == 1||state == 2||state == 3 || state == 4 || state == 5 ||  state == 7 || state == 8 || state == 9"
      >
        <span>付款时间</span>
        <div class="c_coupon">
          <span>{{orders.payTime}}</span>
        </div>
      </div>
      <div
        class="user_coupon"
        v-if="state == 2||state == 3 || state == 4 || state == 5 ||  state == 7 || state == 8 || state == 9"
      >
        <span>商家接单时间</span>
        <div class="c_coupon">
          <span>{{orders.receiveTime}}</span>
        </div>
      </div>
      <div
        class="user_coupon"
        v-if="state == 3 || state == 4 || state == 5 ||  state == 7 || state == 8 || state == 9"
      >
        <span>发货时间</span>
        <div class="c_coupon">
          <span>{{orders.sendTime}}</span>
        </div>
      </div>
      <div
        class="user_coupon"
        v-if="state == 4 || state == 5 ||  state == 7 || state == 8 || state == 9"
      >
        <span>确认收货时间</span>
        <div class="c_coupon">
          <span>{{orders.confirmGetTime}}</span>
        </div>
      </div>
      <div class="user_coupon" v-if=" state == 5 ||  state == 7 || state == 8 || state == 9">
        <span>评价时间</span>
        <div class="c_coupon">
          <span>{{orders.evaluateTime}}</span>
        </div>
      </div>
      <div class="user_coupon" v-if="  state == 7 || state == 8 || state == 9">
        <span>申请售后时间</span>
        <div class="c_coupon">
          <span>{{orders.applyRefundTime}}</span>
        </div>
      </div>
      <div class="user_coupon last" style="border-bottom: none;" v-if=" state == 8 || state == 9">
        <span>商家处理时间</span>
        <div class="c_coupon">
          <span>2018-04-25 18:25:45</span>
        </div>
      </div>
    </div>
    <div class="no_more">没有更多了</div>
    <div class="sure" v-if="state == 3" @click="shou">确认收货</div>
    <div class="sure" v-if="state==0" @click="quxiao">取消订单</div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      datas: "",
      state: "", //订单状态
      orders: [], //订单详情全部
      ordershop: [], //商品数据
      id: "",
      cid: "",
      openId: "",
      direct:0
    };
  },
  onLoad(options) {
    console.log(options.id);
    this.ordershop = [];
    this.orders = [];
    this.id =JSON.parse(options.id).id;
    this.direct =JSON.parse(options.id).direct;
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      this.openId = JSON.parse(wx.getStorageSync("user")).openId;
      console.log(this.openId);
    }
    wx.setNavigationBarTitle({
      title: "订单详情"
    });
    // this.mess = JSON.parse(localStorage.getItem("mess")).tit;
    // console.log(this.mess);
  },
  components: {},
  onShow() {
    this.orderDetail(this.id);
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  methods: {
    // copy(ind){
    //   switch(ind){

    //   }
    // },
    shentui() {
      wx.navigateTo({
        url: "/pages/order/shenqingtui?ids=" + this.id
      });
    },
    ping() {
      wx.navigateTo({
        url: "/pages/goodPing/goodPingIndex?ids=" + this.id
      });
    },
    tiaoimg(id) {
      let obj={type:this.direct,id:id}
      wx.navigateTo({
        url: "/pages/Good/gooddetials?id=" +JSON.stringify(obj)
      });
    },
    //   取消订单
    quxiao() {
      // wx.setStorageSync('num','1');
      wx.setStorageSync("orderid", this.id);
      this.$router.replace("/pages/order/quxiaoorder");
    },
    //  删除订单
    del() {
      console.log("删除订单");
      let deleteOrder = {
        cmd: "deleteOrder",
        id: this.id
      };
      console.log(deleteOrder);
      Request.postRequest(deleteOrder)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: "删除成功"
            });
            this.$router.go(-1);
          }
        })
        .catch(res => {});
    },

    //   取消申请
    subShen() {
      console.log("取消申请");
      let deleteOrder = {
        cmd: "cancelApplyRefund",
        id: this.id
      };
      console.log(deleteOrder);
      Request.postRequest(deleteOrder)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.$router.go(-1);
          }
        })
        .catch(res => {});
    },
    checkComment() {
      wx.navigateTo({
        url: "/pages/goodPing/goodPingDetails?id=" + this.id
      });
    },
    goLogistic(i) {
      let obj = {};
      obj.wlNo = this.orders.wlNo;
      obj.img = i[0].image;
      obj.wlCode = this.orders.wlCode;
      wx.navigateTo({
        url: "/pages/order/wuliu?id=" + JSON.stringify(obj)
      });
    },
    call(tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    },
    tel(tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
      console.log("商家电话" + tel);
      // let a = document.createElement(a);
      // a.href = "tel:" + tel;
      // a.click();
    },
    pjlun(aa) {
      wx.navigateTo({
        title: "/pages/goodPing/goodPingIndex?id=" + aa.id
      });
    },
    orderDetail(id) {
      let orderDetail = {
        cmd: "orderDetail",
        id: id
      };
      Request.postRequest(orderDetail)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.state = res.status;
            this.orders = res;
            this.ordershop = res.goods;
          }
        })
        .catch(res => {});
    },
    shou() {
      let self = this;
      wx.showModal({
        title: "确认收货",
        content: "是否确认收货？",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success: result => {
          if (result.confirm) {
            let orderDetail = {
              cmd: "confirmReceive",
              id: self.id
            };
            Request.postRequest(orderDetail)
              .then(res => {
                console.log(res);
                if (res.result == 0) {
                  self.$router.go(-1);
                }
              })
              .catch(res => {});
          }
        },
        fail: () => {},
        complete: () => {}
      });
    },
    gotoPay() {
      console.log(this.id);
      let parmas = {
        cmd: "payByWx",
        orderid: this.id,
        openid: this.openId
      };
      console.log(parmas);
      Request.postRequest(parmas).then(res => {
        if (res.result == 0) {
          console.log(res);
          this.PayBywx(
            res.body.timeStamp,
            res.body.nonceStr,
            res.body.prepay,
            res.body.signType,
            res.body.paySign
          );
        }
      });
    },
    PayBywx(timeStamp, nonceStr, prepay_id, signType, paySign) {
      let self=this;
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: prepay_id,
        signType: signType,
        paySign: paySign,
        success(res) {
          wx.navigateTo({
            url: "/pages/order/pay_success?id="+self.direct
          });
          console.log("支付成功!");
        },
        fail(res) {
          console.log("交易失败!");
          wx.showToast({
            title: "取消交易",
            icon: "none"
          });
        }
      });
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

    h3 {
      width: 100%;
      height: 1.5rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 14px;
      color: rgb(114, 209, 65);
      border-top: 1px solid #eee;
    }

    .cancel {
      width: 100%;
      height: 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #333;
      border-top: 1px solid #eee;
      position: relative;

      .pos {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }

      .look {
        padding: 0.05rem 0.1rem;
        background: rgb(114, 209, 65);
        border-radius: 6px;
        font-size:14px;
      }

      .lookmore {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 60%;
        margin: 0 auto;
      }
    }

    .wait {
      width: 100%;
      height: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #333;
      border-top: 1px solid #eee;
    }
  }

  .go_shop {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0.4rem;
    box-sizing: border-box;
    border-top: 10px solid #f5f5f5;
    border-bottom: 10px solid #f5f5f5;

    h3 {
      width: 100%;
      height: 0.8rem;
      line-height: 0.8rem;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
    }

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-bottom: 0.4rem;

      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.3rem;
        font-size: 14px;
        color: #333;

        img {
          width: 2rem;
          height: 2rem;
        }

        .lis_right {
          flex: 1;
          height: 2rem;
          padding-left: 0.4rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;

          .lis_detail {
            width: 100%;
            height: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .lis_key {
            width: 100%;
            height: 1rem;
            display: flex;
            align-items: center;
            color: #999;
          }
        }
      }
    }
  }

  .msg {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0.4rem;
    box-sizing: border-box;
    border-bottom: 10px solid #f5f5f5;

    .user_coupon {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1ox solid #eee;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
      padding-top: 0.5rem;

      .c_coupon {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;

        img {
          width: 0.3rem;
          height: 0.4rem;
          margin-left: 0.4rem;
        }
      }
    }

    .last {
      border-bottom: none;
    }

    .link {
      width: 100%;
      height: 1rem;
      background: rgb(114, 209, 65);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0.4rem 0;

      img {
        width: 0.6rem;
        height: 0.6rem;
      }

      span {
        font-size: 14px;
        color: #fff;
        margin-left: 0.2rem;
      }
    }
  }

  .linktwo {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0.4rem 0;

    .one {
      background: #fff;
      border: 1px solid rgb(114, 209, 65);

      span {
        font-size: 14px;
        color: rgb(114, 209, 65);
        margin-left: 0.2rem;
      }
    }

    .two {
      background: rgb(114, 209, 65);

      span {
        font-size: 14px;
        color: #fff;
        margin-left: 0.2rem;
      }
    }

    .linkchild {
      width: 40%;
      height: 0.85rem;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      img {
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }

  .orders {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0.4rem;
    box-sizing: border-box;

    .user_coupon {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1ox solid #eee;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
      padding-top: 0.5rem;

      .c_coupon {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999;
      }
    }

    .user_msg {
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1ox solid #eee;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
      padding-top: 0.5rem;

      .address {
        width: 60%;
        display: flex;
        flex-direction: column;
        color: #999;

        p {
          margin-bottom: 0.3rem;
          line-height: 18px;
        }
      }
    }

    .beizhu_msg {
      width: 100%;
      display: flex;
      flex-direction: column;
      border-bottom: 1ox solid #eee;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
      padding-top: 0.5rem;

      p {
        margin-top: 0.3rem;
        line-height: 18px;
        font-size: 14px;
        color: #999;
      }
    }
  }

  .no_more {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    background: #eee;
    font-size: 12px;
    color: #666;
  }

  .sure {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    background: rgb(114, 209, 65);
    font-size: 14px;
    color: #fff;
  }
}
</style>
