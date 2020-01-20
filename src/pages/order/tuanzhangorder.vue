<template>
  <div class="contain">
    <!-- <main-header :text="text" @back="back"></main-header> -->
    <div class="box">
      <van-tabs
        :active="active"
        @click="shopper"
        color="rgb(114,209,65)"
        title-active-color="rgb(114,209,65)"
        :swipeable="true"
        :sticky="true"
        @change="shopper"
      >
        <van-tab :title="topNav[0]" id="0">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <!-- <span style="color: red;" v-if="v.state2 == 0">待付款</span> -->
                <!-- <span v-if="v.state2 == 1">准备出仓</span> -->
                <span v-if="v.state2 == 2" style="color: red;">待发货</span>
                <span v-if="v.state2 == 3" style="color: red;">待收货</span>
                <span v-if="v.state2 == 4" style="color: red;">待取货</span>
                <span v-if="v.state2 == 6">已取消</span>
                <span v-if="v.state2 == 7">待退款</span>
                <span v-if="v.state2 == 8">已退款</span>
                <span v-if="v.state2 == 9">拒绝退款</span>
              </h3>
              <!-- 2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 -->
              <div class="wrapper">
                <img :src="v.productImage" alt lazy-load />
                <div class="s_right">
                  <div class="s_top">
                    <span>{{v.productName}}</span>
                  </div>
                  <!-- <p>{{v.}}</p> -->
                  <p>{{v.skuName}}</p>
                  <div class="s_price"></div>
                </div>
                <div class="pin_price">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <!-- <div class="pay" v-if="v.state2 == 3">
                <span>15天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div> -->
            </li>
          </ul>
        </van-tab>
        <van-tab :title="topNav[1]" id="1">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <!-- <span style="color: red;" v-if="v.state2 == 0">待付款</span>
                <span v-if="v.state2 == 1">准备出仓</span>-->
                <span v-if="v.state2 == 2" style="color: red;">待发货</span>
                <span v-if="v.state2 == 3" style="color: red;">待收货</span>
                <span v-if="v.state2 == 4" style="color: red;">待评价</span>
                <span v-if="v.state2 == 6">已取消</span>
                <span v-if="v.state2 == 7">待退款</span>
                <span v-if="v.state2 == 8">已退款</span>
                <span v-if="v.state2 == 9">拒绝退款</span>
              </h3>
              <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
              <div class="wrapper">
                <img :src="v.productImage" alt lazy-load />
                <div class="s_right">
                  <div class="s_top">
                    <span>{{v.productName}}</span>
                  </div>
                  <!-- <p>{{v.}}</p> -->
                  <p>{{v.skuName}}</p>
                  <div class="s_price"></div>
                </div>
                <div class="pin_price">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <!-- <div class="pay" v-if="v.state2 == 3">
                <span>15天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div> -->
            </li>
          </ul>
        </van-tab>
        <van-tab :title="topNav[2]" id="2">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <!-- <span style="color: red;" v-if="v.state2 == 0">拼团成功</span> -->
                <!-- <span v-if="v.state2 == 1">1已发货</span> -->
                <span v-if="v.state2 == 2" style="color: red;">待发货</span>
                <span v-if="v.state2 == 3" style="color: red;">已发货</span>
                <span v-if="v.state2 == 4" style="color: red;">待取货</span>
                <span v-if="v.state2 == 5" style="color: red;">已完成</span>
                <span v-if="v.state2 == 6">已取消</span>
                <span v-if="v.state2 == 7">待退款</span>
                <span v-if="v.state2 == 8">已退款</span>
                <span v-if="v.state2 == 9">拒绝退款</span>
              </h3>
              <!-- 0客户已下单 1已发货 2待取货 3已完成 4退款售后 -->
              <!-- //2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 -->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt />
                <div class="s_right">
                  <div class="s_top">
                    <span>{{v.productName}}</span>
                  </div>
                  <p>{{v.skuName}}</p>
                  <div class="s_price"></div>
                </div>
                <div class="pin_price">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <!-- <div class="pay" v-if="v.state2 == 3">
                <span>15天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div> -->
            </li>
          </ul>
          <!-- </van-pull-refresh> -->
          <!-- </van-list> -->
        </van-tab>
        <van-tab :title="topNav[3]" id="3">
          <!-- <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="beginLoading"
            :offset="10"
          >-->
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <!-- <span style="color: red;" v-if="v.state2 == 0">拼团成功</span> -->
                <!-- <span v-if="v.state2 == 1">已发货</span> -->
                <span v-if="v.state2 == 2" style="color: red;">待发货</span>
                <span v-if="v.state2 == 3" style="color: red;">已发货</span>
                <span v-if="v.state2 == 4" style="color: red;">待取货</span>
                <span v-if="v.state2 == 5">已完成</span>
                <span v-if="v.state2 == 6">已取消</span>
                <span v-if="v.state2 == 7">待退款</span>
                <span v-if="v.state2 == 8">已退款</span>
                <span v-if="v.state2 == 9">拒绝退款</span>
              </h3>
              <!-- 2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 -->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt />
                <div class="s_right">
                  <div class="s_top">
                    <span>{{v.productName}}</span>
                  </div>
                  <!-- <p>{{v.}}</p> -->
                  <p>{{v.skuName}}</p>
                  <div class="s_price"></div>
                </div>
                <div class="pin_price">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <!-- <div class="pay" v-if="v.state2 == 4">
                <p>共计:￥{{v.finalPay}}元</p>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div> -->
            </li>
          </ul>
          <!-- </van-pull-refresh> -->
          <!-- </van-list> -->
        </van-tab>
      </van-tabs>
      <div class="loading" v-if="more">
        <span>没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      active: "",
      page: 1,
      totalPage: 2,
      list: [],
      pendEvaluateNumber: "", //已完成
      pendPayNumber: "", //已下单
      pendReceiveNumber: "", //待收货
      pendSendNumber: "", //待取货
      cid: "",
      more: false,
      leaderid: "",
      leader: "",
      topNav:[]
    };
  },
  components: {},
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "社区订单"
    });
    this.active = options.id;
    console.log(this.active);
    if (wx.getStorageSync("leaderInfo")) {
      this.leader = JSON.parse(wx.getStorageSync("leaderInfo"));
      this.leaderid = JSON.parse(wx.getStorageSync("leaderInfo")).leaderid;
      this.getNum();
    }
    if(wx.getStorageSync("user")){
      this.cid=JSON.parse(wx.getStorageSync("user")).cid;
    }
  },
  onShow() {
    this.list = [];
    this.myOrder(this.active, this.page);
  },
  mounted() {},
  onReachBottom() {
    console.log("到底了");
    // let self=this;
    console.log(this.page, this.totalPage);
    if (this.page < this.totalPage) {
      this.page += 1;
      this.myOrder(this.active, this.page);
    } else {
      this.more = true;
    }
  },
  methods: {
    getLear(){
          let parmas = {
        cmd: "leaderInfo",
        cid: this.cid
      };
      Request.postRequest(parmas).then(res => {
        console.log(res);
        this.leader=res;
        this.getNum()
      });
    },
    getNum() {
      // if (this.leader != "") {
        let arry=['客户已下单',"商家已发货","客户待取货","订单已完成"]
        let res = this.leader;
        this.pendEvaluateNumber = res.finishNum; //已完成
        this.pendPayNumber = res.pendSendNum; //已下单
        this.pendReceiveNumber = res.pendReceiveNum; //已发货
        this.pendSendNumber = res.pendGetNum; //待取货
      // }else{
      //     this.getLear();
      // }
      this.pendPayNumber != 0
        ? (arry[0] = arry[0] + "(" + this.pendPayNumber + ")")
        : arry[0];
  
      this.pendReceiveNumber != 0
        ? (arry[1] = arry[1] + "(" + this.pendReceiveNumber + ")")
        : arry[1];
            this.pendSendNumber != 0
        ? (arry[2] = arry[2] + "(" + this.pendSendNumber + ")")
        : arry[2];
      this.pendEvaluateNumber != 0
        ? (arry[3] = arry[3] + "(" + this.pendEvaluateNumber + ")")
        : arry[3];
      this.topNav = arry;

     
    },
    myOrder(status, page) {
      let myOrder = {
        cmd: "leardOrderList",
        leaderid: this.leaderid,
        pageNow: page,
        status: this.active
      };
      console.log(myOrder);
      Request.postRequest(myOrder)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            for (let i in res.dataList) {
              this.list.push(res.dataList[i]);
            }
            if (res.dataList.length == 0) {
              this.more = true;
            }
          }
        })
        .catch(res => {});
    },
    shopper(event) {
      if (event.target.index == undefined) {
        return false;
      } else {
        this.active = event.target.index;
        this.page = 1;
        this.list = [];
        this.myOrder(this.active, this.page);
      }
    },
    //详情
    // order(v) {
    //   console.log(v);
    //   let obj = { direct: 1, id: v.id };
    //   wx.navigateTo({
    //     url: "/pages/order/tuanzhangorder?id=" + JSON.stringify(obj)
    //   });
    // }
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.van-tabs__wrap {
  position: fixed !important;
  top: 0 !important;
}

.contain {
  width: 100%;
  height: 100%;
}

.tuanpay {
  overflow: hidden;
  display: block;
  width: 100%;
  border-top: 1px solid #eee;
  padding: 15px 0;

  p {
    text-align: right;
    font-size: 13px;
    line-height: 25px;
    font-weight: bold;
  }

  div {
    width: 1.7rem;
    height: 0.6rem;
    line-height: 0.6rem;
    border-radius: 6px;
    background: #73d242;
    text-align: center;
    font-size: 14px;
    color: #fff;
    float: right;
    margin-top: 15px;
  }
}

.van-tab__pane {
  min-height: 667px;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: column;

  .order_list {
    width: 100%;
    position: relative;

    .order_wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      h3 {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding: 0 0.4rem;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
      }
    }
  }

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;

    li {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 0.4rem;
      box-sizing: border-box;
      border-bottom: 10px solid #eee;

      a {
        display: block;
        width: 100%;
        height: 100%;
      }

      h3 {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
      }

      .wrapper {
        width: 100%;
        display: flex;
        align-items: center;

        img {
          width: 2.2rem;
          height: 2.2rem;
        }

        .s_right {
          flex: 1;
          height: 1.8rem;
          padding-left: 0.2rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .s_top {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #333;
          }

          p {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 12px;
            color: #999;
          }

          .s_price {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #333;
          }
        }
      }

      .pay {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;

        div {
          width: 1.7rem;
          height: 0.6rem;
          line-height: 0.6rem;
          border-radius: 6px;
          background: #73d242;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }
      }

      .comment {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;

        div {
          width: 1.5rem;
          height: 0.6rem;
          line-height: 0.6rem;
          border-radius: 6px;
          background: #73d242;
          text-align: center;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
}
</style>
