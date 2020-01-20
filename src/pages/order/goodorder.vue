<template>
  <div class="contain">
    <div class="box">
      <div class="box-left">
        <h3>收货人信息</h3>
        <div class="user_box" @click="shouhuo" v-if="addchu==false">
          <div class="user_left">
            <div class="user_name">
              <span>{{addcity.receiverName}}</span>
              <span style="margin-left: 0.4rem;">{{addcity.mobile}}</span>
            </div>
            <p>{{addcity.addr}}</p>
          </div>
          <img src="/static/img/gengduo3.png" alt />
        </div>
        <div v-else class="user_box nouser" @click="shouhuo" style="lineHeight:70px">
          <div class="user_left">去选择收货地址</div>
          <img src="/static/img/gengduo3.png" alt />
        </div>
      </div>
      <!-- 新增 -->
      <div class="box-right" @click.stop="chosetuan">
        <div style="padding-left:10px;">
          <span>团长</span>
          <p v-if="leaderid!=''">{{leader.name}}</p>
          <p v-else>选择团长</p>
        </div>
      </div>
    </div>
    <div class="go_shop">
      <h3>{{currentGood.sname}}</h3>
      <ul>
        <li>
          <img :src="currentGood.images" alt lazy-load />
          <div class="lis_right">
            <div class="lis_detail">
              <span>{{currentGood.name}}</span>
              <span>X {{currentGood.number}}</span>
              <span>{{currentGood.price}}</span>
            </div>
            <div class="lis_key">规格：{{currentGood.val}}</div>
          </div>
        </li>
      </ul>
      <ul>
        <li style="margin-top: 0.5rem" v-if="freight!=0">
          <span>配送费:</span>
          <span>￥{{freight}}</span>
          <!-- <span v-else>￥{{freight}}.00</span> -->
        </li>
      </ul>
    </div>
    <div class="msg">
      <div class="user_coupon">
        <span>优惠券:</span>
        <div class="c_coupon" @click="youhui">
          <span v-if="youhuis==false">请选择使用优惠券</span>
          <span v-else>￥{{amount}}</span>
          <img src="/static/img/gengduo3.png" alt />
        </div>
      </div>
      <div class="beizhu">
        <h3>备注说明:</h3>
        <editor placeholder="请输入告诉我们您的其他要求" @blur="onChange"></editor>
      </div>
    </div>
    <div class="card msg" @click.stop="goBill">
      <div class="user_coupon" style="border: none">
        <span>是否要发票:</span>
        <div class="c_coupon">
          <span v-if="billyin==false">请选择</span>
          <span v-else>{{bill}}</span>
          <img src="/static/img/gengduo3.png" alt />
        </div>
      </div>
    </div>
    <div class="count">
      <div class="count_left">
        价格：
        <span style="color:red">￥{{endPrice}}</span>
      </div>
      <div class="count_right" @click.stop="order">结算</div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      currentGood: {},
      addcity: {}, //默认地址
      freight: 0.0, //配送费
      amount: 0, //优惠券金额
      youID: "",
      add: "",
      bill: "",
      billyin: true,
      addchu: false,
      youhuis: false,
      texts: "",
      cid: "",
      Invoice: "",
      orderid: "",
      openId: "",
      direct: 0,
      sname: "",
      leaderid: "",
      leader:{}

    };
  },
  components: {},
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "确认订单"
    });
    this.billyin = false;
    this.bill = "";
    this.amount = "";
    this.youhuis = false;
    console.log(this.billyin);

    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      this.openId = JSON.parse(wx.getStorageSync("user")).openId;
      console.log(wx.getStorageSync("user"));
      console.log(this.openId);
    }
    this.currentGood = JSON.parse(options.good);

    console.log(this.currentGood);
  },
  onShow() {
    if (wx.getStorageSync("newaddress")) {
      this.addcity = JSON.parse(wx.getStorageSync("newaddress"));
      wx.removeStorageSync("newaddress");
      console.log(this.addcity);
    } else {
      this.defaultAddress(this.cid);
    }
    if (wx.getStorageSync("leaderInfo")) {
      this.leader = JSON.parse(wx.getStorageSync("leaderInfo"));
      this.leaderid = this.leader.leaderid;
      console.log(this.leader);
    }
    //   获取发票
    if (wx.getStorageSync("Invoice")) {
      //  发票 id  发票类型
      this.Invoice = JSON.parse(wx.getStorageSync("Invoice")).id;
      this.bill = JSON.parse(wx.getStorageSync("Invoice")).bill;
      wx.removeStorageSync("Invoice");
      if (this.bill != undefined) {
        this.billyin = true;
      } else {
        this.billyin = false;
      }
    }
  },

  computed: {
    total() {
      let count = 0;
      let counts = 0;
      count +=
        Number(this.currentGood.price) * Number(this.currentGood.number) -
        Number(this.amount);
      if (count < 0) {
        counts = 0.01;
      } else {
        counts = count;
      }
      return counts;
    },
    endPrice() {
      return (this.total + Number(this.freight)).toFixed(2);
    }
  },
  mounted() {
    console.log("mounted");
    if (wx.getStorageSync("direct")) {
      this.direct = JSON.parse(wx.getStorageSync("direct")).direct;
      wx.removeStorageSync("direct");
      console.log(this.direct);
    }
    if (wx.getStorageSync("you")) {
      this.amount = JSON.parse(wx.getStorageSync("you")).num;
      this.youID = JSON.parse(wx.getStorageSync("you")).id;
      wx.removeStorageSync("you");
      this.youhuis = true;
    } else {
      // this.youhuis = false;
      this.youxiu();
    }
  },
  methods: {
    chosetuan() {
      wx.navigateTo({
        url: "/pages/my/tuanzhangcenter/choseLeader"
      });
    },
    onChange(e) {
      console.log(e);
      this.texts = e.mp.detail.text;
    },
    goBill() {
      wx.navigateTo({
        url: "./fapiao"
      });
    },
    youxiu() {
      let addjia = 0;
      addjia = this.currentGood.number * this.currentGood.price;
      let datas = {
        cmd: "myCoupon",
        cid: this.cid,
        sid: this.currentGood.sid,
        pageNow: 1
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res.dataList);
          if (res.result == 0) {
            let arrcon = [];
            for (let x in res.dataList) {
              if (res.dataList[x].miniPurchase <= addjia) {
                arrcon.push(res.dataList[x]);
              }
            }
            console.log(arrcon);
            if (arrcon.length >= 2) {
              let hand = 0;
              for (let h = 0; h < arrcon.length - 1; h++) {
                if (arrcon[h + 1].amount >= arrcon[h].amount) {
                  hand = arrcon[h + 1];
                }
              }
              console.log(hand);
              this.amount = hand.amount;
              this.youID = hand.id;
              this.youhuis = true;
            } else if (arrcon.length == 1) {
              this.amount = arrcon[0].amount;
              this.youID = arrcon[0].id;
              this.youhuis = true;
            }
          }
        })
        .catch(res => {});
    },
    shouhuo() {
      this.$router.push("/pages/address/buyadd");
    },
    youhui() {
      console.log(this.currentGood.sid);
      let obj = { sname: this.currentGood.sname, sid: this.currentGood.sid };
      wx.navigateTo({
        url: "/pages/shopdetails/couponlin?id=" + JSON.stringify(obj)
      });
      let arr = [];
      arr.push(this.currentGood);
      console.log(arr);
      wx.setStorageSync("good", JSON.stringify(arr));
    },
    textss(e) {
      this.texts = e.target.value;
      // localStorage.setItem("nr", JSON.stringify(this.texts)); //备注
    },
    defaultAddress(id) {
      let defaultAddress = {
        cmd: "defaultAddress",
        cid: id
      };
      Request.postRequest(defaultAddress)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.addchu = false;
            this.addcity = res;
            this.add = res.id;
            // localStorage.setItem("add", JSON.stringify(this.add));
            this.getUserFreight(
              this.add,
              this.currentGood.id,
              this.currentGood.skuId,
              this.currentGood.number
            ); //调取配送费
          } else {
            this.addchu = true;
          }
        })
        .catch(res => {});
    },
    getUserFreight(addID, shopID, skuId, count) {
      this.freight = 0;
      this.donghua = true;
      let getUserFreight = {
        cmd: "getUserFreight",
        receiverId: addID,
        productId: shopID,
        skuId: skuId,
        count: count
      };
      console.log(getUserFreight);
      Request.postRequest(getUserFreight)
        .then(res => {
          this.donghua = false;
          if (res.result == "0") {
            console.log("配送费" + res.freight);
            this.freight = Math.floor(res.freight * 100) / 100;
          }
        })
        .catch(res => {});
    },
    order() {
      if (this.addchu == true) {
        wx.showToast({
          title: "请添加收货地址",
          icon: "none"
        });
      } else {
        let shopa = {};
        let prices = 0;
        console.log(this.currentGood.id);
        shopa.productId = this.currentGood.id;
        shopa.count = this.currentGood.number;
        shopa.skuId = this.currentGood.skuId;
        shopa.gprice = this.currentGood.price;
        prices =
          Number(this.currentGood.number) * Number(this.currentGood.price);
        shopa.couponId = this.youID;
        shopa.money = this.amount;
        shopa.invoiceId = this.Invoice;
        shopa.amount = (this.total + Number(this.freight)).toFixed(2);
        shopa.price = prices;
        shopa.fee = this.freight;
        shopa.remark = this.texts;

        let objsh = {
          cmd: "addOrder",
          uid: this.cid,
          receiverId: this.addcity.id,
          productId: shopa.productId,
          skuId: shopa.skuId,
          count: shopa.count,
          price: shopa.price,
          money: shopa.money,
          fee: shopa.fee,
          amount: this.endPrice,
          // amount: "0.01",
          couponId: shopa.couponId,
          invoiceId: shopa.invoiceId,
          remark: shopa.remark,
          leaderid:this.leaderid
        };
        console.log(objsh);
        Request.postRequest(objsh)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              console.log(res.orderId);
              this.orderid = res.orderId;
              //  微信付款
              let parmas = {
                cmd: "payByWx",
                orderid: this.orderid,
                openid: this.openId,
                money: this.endPrice
                //   总价
                // money: "0.01"
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
            } else {
              wx.showToast({
                title: res.resultNote,
                icon: "none"
              });
            }
          })
          .catch(res => {});
      }
    },
    PayBywx(timeStamp, nonceStr, prepay_id, signType, paySign) {
      let self = this;
      wx.requestPayment({
        timeStamp: timeStamp,
        nonceStr: nonceStr,
        package: prepay_id,
        signType: signType,
        paySign: paySign,
        success(res) {
          self.$router.replace({
            path: "/pages/order/pay_success",
            query: { id: self.direct }
          });
          console.log("支付成功!" + self.direct);
        },
        fail(res) {
          console.log("交易失败!");
          wx.showToast({
            title: "取消交易",
            icon: "none"
          });
          wx.setStorageSync("tarnum", self.direct);
          self.$router.replace({ path: "/pages/order/all", query: { id: 1 } });
          // wx.navigateTo({
          //   url: "/pages/order/all?id=" + 1
          // });
        }
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
  display: flex;
  justify-content: space-between;
  padding: 0 0.2rem 0;
  box-sizing: border-box;
  border-top: 1px solid #eee;

  .box-left {
    width: 75%;

    h3 {
      width: 100%;
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #eee;
    }

    .nouser {
      height: 70px;
      box-sizing: border-box;
    }

    .user_box {
      width: 100%;
      // height:70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      .user_left {
        width: 80%;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #333;

        p {
          width: 100%;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          font-weight: 500;
          font-size: 13px;
          -webkit-box-orient: vertical;
          line-height: 20px;
          // padding-top: 0.3rem;
        }

        .user_name {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0.1rem 0;
          font-size: 14px;
          color: #333;
          box-sizing: border-box;
        }
      }

      img {
        width: 11px;
        height: 11px;
      }
    }
  }

  .box-right {
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 15px;

    div {
      border-left: 1px solid #eee;

      span {
        display: block;
        padding: 3px 7px;
        font-size: 12px;
        background: rgb(114, 209, 65);
        color: #fff;
        text-align: center;
      }

      p {
        font-size: 13px;
        text-align: center;
        margin-top: 10px;
      }
    }
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

  // margin-top: 0.5rem;
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

          span:first-child {
            width: 40%;
            height: 30px;
            line-height: 15px;
            display: block;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
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

  .user_coupon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
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
        width: 0.2rem;
        height: 0.3rem;
        margin-left: 0.4rem;
      }
    }
  }

  .beizhu {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #333;
    padding: 0.4rem 0;
    z-index: 1;

    h3 {
      width: 100%;
    }

    editor {
      width: 100%;
      height: 1.5rem;
      padding: 0.4rem 0;
      box-sizing: border-box;
      border: none;
      resize: none;
      z-index: 1;
    }
  }
}

.card {
  border-top: 10px solid #eee;
  border-bottom: 10px solid #eee;
  margin-bottom: 50px;
}

.count {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  z-index: 999;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  z-index: 999;

  .count_left {
    width: 70%;
    height: 50px;
    line-height: 50px;
    padding: 0 0.4rem;
    box-sizing: border-box;
    background: #fff;
  }

  .count_right {
    width: 30%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: rgb(114, 209, 65);
    color: #fff;
  }
}
</style>
