<template>
  <div class="contain">
    <div class="box">
      <h3>收货人信息</h3>
      <div class="user_box" @click="shouhuo" v-if="addchu==false">
        <div class="user_left">
          <p>{{addcity.addr}}</p>
          <div class="user_name">
            <span>{{addcity.receiverName}}</span>
            <span style="margin-left: 0.4rem;">{{addcity.mobile}}</span>
          </div>
        </div>
        <img src="/static/img/gengduo3.png" alt />
      </div>
      <div v-else class="user_box nouser" @click="shouhuo" style="line-height:70px">
        <div class="user_left">去选择收货地址</div>
        <img src="/static/img/gengduo3.png" alt />
      </div>
    </div>
    <div
      class="go_shop"
      v-for="(item , index) in shopList"
      :key="index"
      v-if="item.items.length!=0"
    >
      <h3>{{item.title}}</h3>
      <ul>
        <li v-for="(v,k) in item.items" :key="k" v-if="v.check==true">
          <img :src="v.url" alt lazy-load />
          <div class="lis_right">
            <div class="lis_detail">
              <span>{{v.name}}</span>
              <span>X {{v.number}}</span>
              <span>{{v.new}}</span>
            </div>
            <div class="lis_key">规格：{{v.kg}}</div>
          </div>
        </li>
      </ul>
      <ul v-for="(v,k) in item.items" :key="k">
        <li v-for="(x,y) in freight" :key="y" v-if="x.id==v.id">
          <span>配送费:</span>
          <div class="lufei">
            <span v-if="x.prc!==0">￥{{x.prc}}</span>
            <span v-else>￥{{x.prc}}.00</span>
          </div>
        </li>
      </ul>
      <div class="msg">
        <div class="user_coupon">
          <span>优惠券:</span>
          <div class="c_coupon" @click="youhui(item.id,item.title,item.items)" v-if="sid==item.id">
            <span>￥{{amount}}</span>
            <img src="/static/img/gengduo3.png" alt />
          </div>
          <div class="c_coupon" @click="youhui(item.id,item.title,item.items)" v-else>
            <span>请选择使用优惠券</span>
            <img src="/static/img/gengduo3.png" alt />
          </div>
        </div>
        <div class="beizhu">
          <h3>备注说明:</h3>
          <editor placeholder="请输入告诉我们您的其他要求" @blur="onChange" :id="index"></editor>
          <!-- <textarea placeholder="请输入告诉我们您的其他要求"  @change="onChange" ></textarea> -->
        </div>
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
      guizhe: require("../../../static/img/guize.png"),
      shopList: [],
      addcity: {}, //默认地址
      freight: [], //配送费
      amount: 0.0, //优惠券金额
      youID: "",
      sid: "",
      add: "",
      bill: "",
      billyin: true,
      addchu: false,
      texts: [],
      cid: "",
      Invoice: "",
      openId: "",
      orderid: "",
      direct: 0
    };
  },
  components: {},
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "确认订单"
    });
    this.billyin = false;
    this.bill = "";
    this.sid = "";
    this.amount="";
    this.youhuis = false;
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      this.openId = JSON.parse(wx.getStorageSync("user")).openId;
    }
    if (options.id) {
      this.direct = JSON.parse(options.id).direct;
      console.log(this.direct);
    }

    if (wx.getStorageSync("car")) {
      this.shopList = JSON.parse(wx.getStorageSync("car"));
      wx.removeStorageSync("car");
      console.log(this.shopList);
      for (let i = 0; i < this.shopList.length; i++) {
        this.texts[i] = "";
        this.shopList[i].items = this.shopList[i].items.filter(function(item) {
          return item.check;
        });
      }
    }
    // this.defaultAddress(this.cid);
    // this.youxiu();
  },
  onHide() {
    console.log("onHide");
  },
  onReady() {
    console.log("onReady");
  },
  onUnload() {
    console.log("onUnload");
  },
  onShow() {
    console.log("onShow");
    if (wx.getStorageSync("newaddress")) {
      this.addcity = JSON.parse(wx.getStorageSync("newaddress"));
      wx.removeStorageSync("newaddress");
    } else {
      this.defaultAddress(this.cid);
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
    } else {
    }
  },
  computed: {
    total() {
      let count = 0;

      for (let i = 0; i < this.shopList.length; i++) {
        for (let j = 0; j < this.shopList[i].items.length; j++) {
          if ((this.shopList[i].items[j].check = true)) {
            // if (this.shopList[i].id == this.sid) {
            count +=
              Number(this.shopList[i].items[j].new) *
              Number(this.shopList[i].items[j].number);
            // }
            // count +=
            //   Number(this.shopList[i].items[j].new) *
            //   Number(this.shopList[i].items[j].number);
          }
        }
      }

      count = count - Number(this.amount);
      count = Math.floor(count * 100) / 100;
      if (count < 0) {
        count = 0.01;
      }
      return count;
    },
    lu() {
      let countlu = 0;
      for (let i = 0; i < this.freight.length; i++) {
        countlu += Number(this.freight[i].prc);
      }
      return countlu;
    },
    endPrice() {
      return (this.total + this.lu).toFixed(2);
    }
  },
  mounted() {
    if (wx.getStorageSync("you")) {
      this.amount = JSON.parse(wx.getStorageSync("you")).num;
      this.youID = JSON.parse(wx.getStorageSync("you")).id;
      wx.removeStorageSync("you");
      this.youhuis = true;
    } else {
      this.youxiu();
    }
  },
  methods: {
    onChange(e) {
      let k = e.target.id;
      this.texts[k] = e.target.text;
      console.log(this.texts);
    },
    goBill() {
      this.$router.push("/pages/order/fapiao");
    },
    youxiu() {
      let addjia = 0;
      for (let i in this.shopList) {
        console.log(this.shopList[i]);
        for (let x in this.shopList[i].items) {
          if (this.shopList[i].items[x].check == true) {
            console.log(
              this.shopList[i].items[x].number * this.shopList[i].items[x].new,
              "+++"
            );
            if (this.shopList[i].items.length > 1) {
              addjia +=
                this.shopList[i].items[x].number *
                this.shopList[i].items[x].new;
            } else {
              addjia =
                this.shopList[i].items[x].number *
                this.shopList[i].items[x].new;
            }
          }
        }
        let datas = {
          cmd: "myCoupon",
          cid: this.cid,
          sid: this.shopList[i].id,
          pageNow: 1
        };
        Request.postRequest(datas)
          .then(res => {
            if (res.result == 0) {
              let arrcon = [];
              for (let y in res.dataList) {
                if (res.dataList[y].miniPurchase <= addjia) {
                  arrcon.push(res.dataList[y]);
                  this.sid = this.shopList[i].id;
                }
              }
              // console.log(arrcon);
              if (arrcon.length >= 2) {
                let hand = 0;
                for (let h = 0; h < arrcon.length - 1; h++) {
                  if (arrcon[h + 1].amount >= arrcon[h].amount) {
                    hand = arrcon[h + 1];
                  }
                  this.amount = hand.amount;
                  this.youID = hand.id;
                }
              } else if (arrcon.length == 1) {
                this.amount = arrcon[0].amount;
                this.youID = arrcon[0].id;
              }
            }
          })
          .catch(res => {});
      }
    },
    shouhuo() {
      this.$router.push("/pages/address/buyadd");
    },
    youhui(id, name, item) {
      console.log(id, "......" + item, "111111" + name);
      wx.setStorageSync("good", JSON.stringify(item));
      let obj = { sname: name, sid: id };
      wx.navigateTo({
        url: "/pages/shopdetails/couponlin?id=" + JSON.stringify(obj)
      });
    },
    //  调取 默认收货地址
    defaultAddress(id) {
      let defaultAddress = {
        cmd: "defaultAddress",
        cid: id
      };
      console.log(defaultAddress);
      Request.postRequest(defaultAddress)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.addchu = false;
            this.addcity = res;
            this.add = res.id;
            console.log(this.addcity);
            // localStorage.setItem("add", JSON.stringify(this.add));
            for (let a in this.shopList) {
              console.log(this.shopList[a]);
              if (this.shopList[a].items.length != 0) {
                this.getUserFreight(this.add, this.shopList[a].items[0].id); //调取配送费
              }
            }
          }
        })
        .catch(res => {});
    },
    getUserFreight(addID, carID) {
      this.freight = [];
      this.donghua = true;
      console.log(carID);
      let aid = [];
      aid.push(carID);
      let getUserFreight = {
        cmd: "getUserFreight",
        receiverId: this.add,
        cartId: aid
      };
      console.log(getUserFreight);
      Request.postRequest(getUserFreight)
        .then(res => {
          console.log(res);
          this.donghua = false;
          if (res.result == "0") {
            let xin = [];
            let lufei = [];
            let fre = {};
            fre.id = carID;
            console.log("配送费" + res.freight);
            fre.prc = Math.floor(res.freight * 100) / 100;
            this.freight.push(fre);
            console.log(this.freight);
          }
        })
        .catch(res => {});
    },
    order() {
      if (this.addchu == true) {
        // Toast("请添加收货地址");
        wx.showToast({
          title: "请添加收货地址",
          icon: "none"
        });
      } else {
        let shopall = [];
        for (let a in this.shopList) {
          if (this.shopList[a].items.length != 0) {
            let prices = 0;
            let you = 0;
            let shopgoods = [];
            for (let ai in this.shopList[a].items) {
              prices +=
                Number(this.shopList[a].items[ai].new) *
                Number(this.shopList[a].items[ai].number);
              let shopgood = {};
              console.log(this.shopList[a].items[ai]);
              shopgood.gid = this.shopList[a].items[ai].gid;
              shopgood.gnum = this.shopList[a].items[ai].number;
              shopgood.skuId = this.shopList[a].items[ai].skuid;
              shopgood.gprice = Number(this.shopList[a].items[ai].new);
              shopgoods.push(shopgood);
              for (let i in this.freight) {
                if (this.shopList[a].items[ai].id == this.freight[i].id)
                  you = this.freight[i].prc;
              }
            }
            let shopa = {};
            let goodt = [];
            let myprc = 0;
            let lufei = 0;
            shopa.shop = this.shopList[a].id;
            if (this.shopList[a].id !== this.sid) {
              shopa.pid = "";
              shopa.fee = "";
              myprc = prices;
            } else {
              shopa.pid = this.youID;
              shopa.fee = this.amount;
              if (prices - this.amount < 0) {
                myprc = 0.01;
              } else {
                myprc = prices - this.amount;
              }
            }

            shopa.invoice = this.Invoice;
            // for(let k in this.texts){
            // shopa.remark[k]=this.texts[k];
            // }
            shopa.remark = this.texts[a];
            shopa.price = prices;
            for (let ai in this.shopList[a].items) {
              for (let i in this.freight) {
                if (this.shopList[a].items[ai].id == this.freight[i].id) {
                  lufei = this.freight[i].prc;
                }
                shopa.shippingFee = lufei;
              }
            }
            shopa.amount = myprc + shopa.shippingFee;
            goodt.push(shopgoods);
            shopa.goods = goodt[0];
            shopall.push(shopa);
          }
        }
        let objsh = {
          cmd: "orderSubmit",
          cid: this.cid,
          aid: this.addcity.id,
          totalFee: this.endPrice,
          // totalFee: "0.01",
          orders: shopall
        };
        console.log(objsh);
        Request.postRequest(objsh)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              this.orderid = res.bigOrderId;
              //  微信付款
              let parmas = {
                cmd: "payByWx",
                orderid: this.orderid,
                openid: this.openId,
                //   总价
                 money: this.endPrice
                // money: "0.01"
              };
              console.log(parmas);
              Request.postRequest(parmas).then(res => {
                if (res.result == 0) {
                  console.log(res.body);
                  this.PayBywx(
                    res.body.timeStamp,
                    res.body.nonceStr,
                    res.body.prepay,
                    res.body.signType,
                    res.body.paySign
                  );
                } else {
                  wx.showToast({
                    title: res.resultNote,
                    icon: "none"
                  });
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
          console.log("支付成功!");
        },
        fail(res) {
          console.log("交易失败!");
          wx.showToast({
            title: "取消交易",
            icon: "none"
          });
          wx.setStorageSync("tarnum", self.direct);
          self.$router.replace({ path: "/pages/order/all", query: { id: 1 } });
        }
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
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
  flex-direction: column;
  padding: 0 12px;
  box-sizing: border-box;
  border-top: 1px solid #eee;

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
        font-weight: 700;
        font-size: 16px;
        -webkit-box-orient: vertical;
        line-height: 30px;
        padding-top: 0.3rem;
      }

      .user_name {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0.1rem 0;
        color: #333;
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

.go_shop {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0.2rem;
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

    li {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.3rem;
      font-size: 14px;
      color: #333;
      position: relative;

      .lufei {
        position: absolute;
        right: 0;
      }

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
        box-sizing: border-box;

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
    box-sizing: border-box;

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

  .editor {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #333;
    padding: 0.4rem 0;
    box-sizing: border-box;

    h3 {
      width: 100%;
    }

    e {
      width: 100%;
      height: 3rem;
      padding: 0.4rem 0;
      box-sizing: border-box;
      border: none;
      resize: none;
      box-sizing: border-box;
    }
  }
}

.card {
  border-top: 10px solid #eee;
  border-bottom: 10px solid #eee;
  margin-bottom: 50px;
  padding: 0 10px;
}

.count {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  z-index: 999999;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;

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
    z-index: 999;
  }
}
</style>
