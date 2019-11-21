<template>
  <div class="contain">
    <div class="box">
      <div class="toptar">
        <div
          v-for="(item,index) in tarbaTitle"
          :key="index"
          :class="{'taractive':tarbaActive==index}"
          @click.stop="changTop(index)"
        >{{item}}</div>
      </div>
      <van-tabs
        :active="active"
        color="rgb(114,209,65)"
        title-active-color="rgb(114,209,65)"
        swipeable
        sticky
        offset-top="40"
        @change="shopper"
      >
        <van-tab title="全部订单">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <span style="color: red;" v-if="v.status == 0">待付款</span>
                <span v-if="v.status == 1 && tarbaActive!=1">等待商家接单</span>
                <span v-if="v.status == 1 && tarbaActive==1" style="color: red;">拼团中</span>
                <span v-if="v.status == 2">待发货</span>
                <span v-if="v.status == 3 && tarbaActive!=1">待收货</span>
                <span v-if="v.status == 3 && tarbaActive==1">已发货</span>
                <span v-if="v.status == 4 && tarbaActive!=1" style="color: red;">待评价</span>
                <span v-if="v.status == 4 && tarbaActive==1" style="color: red;">待取货</span>
                <span v-if="v.status == 5">已评价</span>
                <span v-if="v.status == 10 && tarbaActive==1">待评价</span>
                <span v-if="v.status == 6">已取消</span>
                <span v-if="v.status == 7">待退款</span>
                <span v-if="v.status == 8">已退款</span>
                <span v-if="v.status == 9">拒绝退款</span>
              </h3>
              <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
              <!-- //0待支付 1拼团中 2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 10待评价 -->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt v-if="tarbaActive==1" />
                <img :src="v.simage" lazy-load alt v-else />
                <div class="s_right">
                  <div class="s_top">
                    <span v-if="tarbaActive==1">{{v.productName}}</span>
                    <span v-else>{{v.sname}}</span>
                  </div>
                  <p v-if="tarbaActive==1">{{v.skuName}}</p>
                  <p v-else>{{v.createTime}}</p>
                  <div class="s_price" v-if="tarbaActive!=1">
                    <span style="color:#999;">共计{{v.number}}件商品</span>
                    <span>￥{{v.finalPay}}元</span>
                  </div>
                  <div class="s_price" v-else></div>
                </div>
                <div class="pin_price" v-if="tarbaActive==1">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <div class="pay" v-if="v.status== 0&& tarbaActive!=1">
                <span>24小时后自动取消订单</span>
                <div>去支付</div>
              </div>
              <div class="tuanpay" v-if="tarbaActive==1">
                <p>共计:￥{{v.finalPay}}元</p>
                <div v-if="v.status== 0">去支付</div>
              </div>
              <div class="pay" v-if="v.status == 3">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="pay" v-if="v.status == 4 &&tarbaActive==1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="comment" v-if="v.status == 4 && tarbaActive!=1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status == 10 && tarbaActive==1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status ==5 || v.status ==6">
                <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="topNav[0]">
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <span style="color: red;" v-if="v.status == 0">待付款</span>
                <span v-if="v.status == 1 && tarbaActive!=1">等待商家接单</span>
                <span v-if="v.status == 1 && tarbaActive==1" style="color: red;">拼团中</span>
                <span v-if="v.status == 2">待发货</span>
                <span v-if="v.status == 3 && tarbaActive!=1">待收货</span>
                <span v-if="v.status == 3 && tarbaActive==1">已发货</span>
                <span v-if="v.status == 4 && tarbaActive!=1" style="color: red;">待评价</span>
                <span v-if="v.status == 4 && tarbaActive==1" style="color: red;">待取货</span>
                <span v-if="v.status == 5">已评价</span>
                <span v-if="v.status == 10 && tarbaActive==1">待评价</span>
                <span v-if="v.status == 6">已取消</span>
                <span v-if="v.status == 7">待退款</span>
                <span v-if="v.status == 8">已退款</span>
                <span v-if="v.status == 9">拒绝退款</span>
              </h3>
              <!-- 普通订单 -->
              <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
              <!-- 拼团订单 -->
              <!-- 0待支付 1拼团中 2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 -->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt v-if="tarbaActive==1" />
                <img :src="v.simage" lazy-load alt v-else />
                <div class="s_right">
                  <div class="s_top">
                    <span v-if="tarbaActive==1">{{v.productName}}</span>
                    <span v-else>{{v.sname}}</span>
                  </div>
                  <p v-if="tarbaActive==1">{{v.skuName}}</p>
                  <p v-else>{{v.createTime}}</p>
                  <div class="s_price" v-if="tarbaActive!=1">
                    <span style="color:#999;">共计{{v.number}}件商品</span>
                    <span>￥{{v.finalPay}}元</span>
                  </div>
                  <div class="s_price" v-else></div>
                </div>
                <div class="pin_price" v-if="tarbaActive==1">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <div class="pay" v-if="v.status== 0  && tarbaActive!=1">
                <span>24小时后自动取消订单</span>
                <div>去支付</div>
              </div>
              <div class="tuanpay" v-if="tarbaActive==1">
                <p>共计:￥{{v.finalPay}}元</p>
                <div v-if="v.status== 0">去支付</div>
              </div>
              <div class="pay" v-if="v.status == 3">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="pay" v-if="v.status == 4 &&tarbaActive==1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="comment" v-if="v.status == 4 &&tarbaActive!=1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status == 10 &&tarbaActive==1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status ==5 || v.status ==6">
                <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
              </div>
            </li>
          </ul>
        </van-tab>
        <!-- 普通订单 -->
        <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
        <!-- 拼团订单 -->
        <!-- 0待支付 1拼团中 2待发货 3已发货 4待取货 5已完成  6已取消 7待退款 8已退款 9拒绝退款 -->
        <van-tab :title="topNav[1]">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <span style="color: red;" v-if="v.status == 0">待付款</span>
                <span v-if="v.status == 1 && tarbaActive!=1">等待商家接单</span>
                <span v-if="v.status == 1 && tarbaActive==1" style="color: red;">拼团中</span>
                <span v-if="v.status == 2">待发货</span>
                <span v-if="v.status == 3 && tarbaActive!=1">待收货</span>
                <span v-if="v.status == 3 && tarbaActive==1">已发货</span>
                <span v-if="v.status == 4 && tarbaActive!=1" style="color: red;">待评价</span>
                <span v-if="v.status == 4 && tarbaActive==1" style="color: red;">待取货</span>
                <span v-if="v.status == 5">已评价</span>
                <span v-if="v.status == 10 && tarbaActive==1">待评价</span>
                <span v-if="v.status == 6">已取消</span>
                <span v-if="v.status == 7">待退款</span>
                <span v-if="v.status == 8">已退款</span>
                <span v-if="v.status == 9">拒绝退款</span>
              </h3>
              <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt v-if="tarbaActive==1" />
                <img :src="v.simage" lazy-load alt v-else />
                <div class="s_right">
                  <div class="s_top">
                    <span v-if="tarbaActive==1">{{v.productName}}</span>
                    <span v-else>{{v.sname}}</span>
                  </div>
                  <p v-if="tarbaActive==1">{{v.skuName}}</p>
                  <p v-else>{{v.createTime}}</p>
                  <div class="s_price" v-if="tarbaActive!=1">
                    <span style="color:#999;">共计{{v.number}}件商品</span>
                    <span>￥{{v.finalPay}}元</span>
                  </div>
                  <div class="s_price" v-else></div>
                </div>
                <div class="pin_price" v-if="tarbaActive==1">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <div class="pay" v-if="v.status== 0 &&tarbaActive!=1">
                <span>24小时后自动取消订单</span>
                <div>去支付</div>
              </div>
              <div class="tuanpay" v-if="tarbaActive==1">
                <p>共计:￥{{v.finalPay}}元</p>
                <div v-if="v.status== 0">去支付</div>
              </div>
              <div class="pay" v-if="v.status == 3">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="pay" v-if="v.status == 4 &&tarbaActive==1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="comment" v-if="v.status == 4 &&tarbaActive!=1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status == 10 &&tarbaActive==1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status ==5 || v.status ==6">
                <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="topNav[2]">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <span style="color: red;" v-if="v.status == 0">待付款</span>
                <span v-if="v.status == 1 && tarbaActive!=1">等待商家接单</span>
                <span v-if="v.status == 1 && tarbaActive==1" style="color: red;">拼团中</span>
                <span v-if="v.status == 2">待发货</span>
                <span v-if="v.status == 3 && tarbaActive!=1">待收货</span>
                <span v-if="v.status == 3 && tarbaActive==1">已发货</span>
                <span v-if="v.status == 4 && tarbaActive!=1" style="color: red;">待评价</span>
                <span v-if="v.status == 4 && tarbaActive==1" style="color: red;">待取货</span>
                <span v-if="v.status == 5">已评价</span>
                <span v-if="v.status == 10 && tarbaActive==1">待评价</span>
                <span v-if="v.status == 6">已取消</span>
                <span v-if="v.status == 7">待退款</span>
                <span v-if="v.status == 8">已退款</span>
                <span v-if="v.status == 9">拒绝退款</span>
              </h3>
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt v-if="tarbaActive==1" />
                <img :src="v.simage" lazy-load alt v-else />
                <div class="s_right">
                  <div class="s_top">
                    <span v-if="tarbaActive==1">{{v.productName}}</span>
                    <span v-else>{{v.sname}}</span>
                  </div>
                  <p v-if="tarbaActive==1">{{v.skuName}}</p>
                  <p v-else>{{v.createTime}}</p>
                  <div class="s_price" v-if="tarbaActive!=1">
                    <span style="color:#999;">共计{{v.number}}件商品</span>
                    <span>￥{{v.finalPay}}元</span>
                  </div>
                  <div class="s_price" v-else></div>
                </div>
                <div class="pin_price" v-if="tarbaActive==1">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
                <div class="comment" v-if="v.status ==5 || v.status ==6">
                  <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
                </div>
              </div>
              <div class="pay" v-if="v.status== 0 &&tarbaActive!=1">
                <span>24小时后自动取消订单</span>
                <div>去支付</div>
              </div>
              <div class="tuanpay" v-if="tarbaActive==1">
                <p>共计:￥{{v.finalPay}}元</p>
                <div v-if="v.status== 0">去支付</div>
              </div>
              <div class="pay" v-if="v.status == 3 &&tarbaActive!=1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="pay" v-if="v.status == 4 &&tarbaActive==1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="comment" v-if="v.status == 4 &&tarbaActive!=1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status == 10 &&tarbaActive==1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status ==5 || v.status ==6">
                <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="topNav[3]">
          <ul>
            <li v-for="(v,k) in list" :key="k" @click.stop="order(v)">
              <h3>
                <span>订单编号：{{v.id}}</span>
                <span style="color: red;" v-if="v.status == 0">待付款</span>
                <span v-if="v.status == 1 && tarbaActive!=1">等待商家接单</span>
                <span v-if="v.status == 1 && tarbaActive==1" style="color: red;">拼团中</span>
                <span v-if="v.status == 2">待发货</span>
                <span v-if="v.status == 3 && tarbaActive!=1">待收货</span>
                <span v-if="v.status == 3 && tarbaActive==1">已发货</span>
                <span v-if="v.status == 4 && tarbaActive!=1" style="color: red;">待评价</span>
                <span v-if="v.status == 4 && tarbaActive==1" style="color: red;">待取货</span>
                <span v-if="v.status == 5">已评价</span>
                <span v-if="v.status == 10 && tarbaActive==1">待评价</span>
                <span v-if="v.status == 6">已取消</span>
                <span v-if="v.status == 7">待退款</span>
                <span v-if="v.status == 8">已退款</span>
                <span v-if="v.status == 9">拒绝退款</span>
              </h3>
              <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
              <div class="wrapper">
                <img :src="v.productImage" lazy-load alt v-if="tarbaActive==1" />
                <img :src="v.simage" lazy-load alt v-else />
                <div class="s_right">
                  <div class="s_top">
                    <span v-if="tarbaActive==1">{{v.productName}}</span>
                    <span v-else>{{v.sname}}</span>
                  </div>
                  <p v-if="tarbaActive==1">{{v.skuName}}</p>
                  <p v-else>{{v.createTime}}</p>
                  <div class="s_price" v-if="tarbaActive!=1">
                    <span style="color:#999;">共计{{v.number}}件商品</span>
                    <span>￥{{v.finalPay}}元</span>
                  </div>
                  <div class="s_price" v-else></div>
                </div>
                <div class="pin_price" v-if="tarbaActive==1">
                  <span style="color:#999;">X{{v.number}}</span>
                </div>
              </div>
              <div class="pay" v-if="v.status== 0 && tarbaActive!=1">
                <span>24小时后自动取消订单</span>
                <div>去支付</div>
              </div>
              <div class="tuanpay" v-if="tarbaActive==1">
                <p>共计:￥{{v.finalPay}}元</p>
                <div v-if="v.status== 0">去支付</div>
              </div>
              <div class="pay" v-if="v.status == 3">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="pay" v-if="v.status == 4 &&tarbaActive==1">
                <span>7天后自动确认收货</span>
                <div style="padding: 0 0.1rem;" @click.stop="queshou(v)">确认收货</div>
              </div>
              <div class="comment" v-if="v.status == 4 &&tarbaActive!=1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status == 10 &&tarbaActive==1">
                <div style="padding: 0 0.2rem;" @click.stop="ping(v)">评价</div>
              </div>
              <div class="comment" v-if="v.status ==5 || v.status ==6">
                <div style="padding: 0 0.2rem;" @click.stop="del(v)">删除订单</div>
              </div>
            </li>
          </ul>
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
      // tarbaTitle: ["精品订单", "拼团订单", "拿货团订单"],
      tarbaTitle: ["精品订单", "拼团订单"],
      tarbaActive: 0,
      active: "",
      page: 1,
      totalPage: 1,
      list: [],
      pendEvaluateNumber: "", //待评价
      pendPayNumber: "", //待付款
      pendReceiveNumber: "", //待收货
      pendSendNumber: "", //待发货
      isLoading: false,
      cid: "",
      more: false,
      orderAll: {},
      topNav: []
    };
  },
  // computed: {
  //   topNav() {

  //     return arry;
  //   }
  // },
  components: {},
  onLoad(options) {
    this.list = [];
    wx.setNavigationBarTitle({
      title: "订单中心"
    });
    this.active = options.id;
    // this.tarbaActive=0;
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
  },
  // onShow() {

  // },
  mounted() {
    this.list = [];
    console.log(this.tarbaActive);
    if (wx.getStorageSync("tarnum")) {
      this.tarbaActive = wx.getStorageSync("tarnum");
      wx.removeStorageSync("tarnum");
    }
    if (wx.getStorageSync("order")) {
      this.orderAll = JSON.parse(wx.getStorageSync("order"));
      this.gouserInfo(this.tarbaActive);
    }else{
      this.getNum();
    }
    if (this.tarbaActive != 1) {
      // this.myOrder(this.active, this.page, this.tarbaActive);
      this.myOrder(this.active, this.page);
    } else {
      this.pinTuanOrderList();
    }
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.page += 1;
      if (this.tarbaActive == 1) {
        let parmas = {
          cmd: "pinTuanOrderList",
          cid: this.cid,
          pageNow: this.page,
          status: this.active
        };
        Request.postRequest(parmas)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              this.totalPage = res.totalPage;
              // this.list=res.dataList;
              for (let i in res.dataList) {
                this.list.push(res.dataList[i]);
              }
              // if (this.totalPage == this.page) {
              //   this.more = true;
              // }
            }
          })
          .catch(err => {});
        // return;
      } else {
        let myOrder = {
          cmd: "myOrder",
          cid: this.cid,
          pageNow: this.page,
          status: this.active
          // type: this.tarbaActive
        };
        console.log(myOrder);
        Request.postRequest(myOrder)
          .then(res => {
            console.log(res, "11111");
            if (res.result == 0) {
              this.totalPage = res.totalPage;
              // this.list=res.dataList;
              for (let i in res.dataList) {
                this.list.push(res.dataList[i]);
              }
            }
          })
          .catch(res => {});
      }
    } else {
      this.more = true;
    }
  },
  methods: {
    getNum() {
      let goCarlist = {
        cmd: "myInfo",
        cid: this.cid
      };
      Request.noLoading(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.orderAll = res;
            this.gouserInfo(this.tarbaActive);
          }
        })
        .catch(res => {});
    },
    gouserInfo(num) {
      let res = this.orderAll;
      let arry = ["", "待发货", "待收货", "待评价"];
      if (num == 0) {
        arry[0] = "待付款";
        this.pendEvaluateNumber = res.pendEvaluateNumber; //待评价
        this.pendPayNumber = res.pendPayNumber; //待付款
        this.pendReceiveNumber = res.pendReceiveNumber; //待收货
        this.pendSendNumber = res.pendSendNumber; //待发货
        // 拼团
      } else if (num == 1) {
        arry[0] = "进行中";
        this.pendEvaluateNumber = res.ptnocomment; //待评价
        this.pendPayNumber = res.pting; //待付款
        this.pendReceiveNumber = res.ptnoreceive; //待收货
        this.pendSendNumber = res.ptnosend; //待发
      } 
      // else {
      //   arry[0] = "待付款";
      //   this.pendEvaluateNumber = res.nhtpendEvaluateNumber; //待评价
      //   this.pendPayNumber = res.nhtpendPayNumber; //待付款
      //   this.pendReceiveNumber = res.nhtpendReceiveNumber; //待收货
      //   this.pendSendNumber = res.nhtpendSendNumber; //待发
      // }
      this.pendPayNumber != 0
        ? (arry[0] = arry[0] + "(" + this.pendPayNumber + ")")
        : arry[0];
      this.pendSendNumber != 0
        ? (arry[1] = arry[1] + "(" + this.pendSendNumber + ")")
        : arry[1];
      this.pendReceiveNumber != 0
        ? (arry[2] = arry[2] + "(" + this.pendReceiveNumber + ")")
        : arry[2];
      this.pendEvaluateNumber != 0
        ? (arry[3] = arry[3] + "(" + this.pendEvaluateNumber + ")")
        : arry[3];
      this.topNav = arry;
    },

    //  最顶部
    changTop(ind) {
      this.gouserInfo(ind);
      if (this.tarbaActive == ind) {
        return;
      } else {
        this.tarbaActive = ind;

        this.list = [];
        if (ind == 1) {
          this.pinTuanOrderList();
        } else {
          this.myOrder(this.active, this.page, this.tarbaActive);
        }

        // this.list = [];
      }
    },
    //   拼团 
    pinTuanOrderList() {
      let parmas = {
        cmd: "pinTuanOrderList",
        cid: this.cid,
        pageNow: this.page,
        status: this.active
      };
      Request.postRequest(parmas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            this.list = res.dataList;
            // for (let i in res.dataList) {
            //   this.list.push(res.dataList[i]);
            // }
            if (this.totalPage == this.page) {
              this.more = true;
            }
          }
        })
        .catch(err => {});
    },
    myOrder(status, page) {
      let myOrder = {
        cmd: "myOrder",
        cid: this.cid,
        pageNow: page,
        status: status,
        // type: type
      };
      console.log(myOrder);
      Request.postRequest(myOrder)
        .then(res => {
          console.log(res, "11111");
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            this.list = res.dataList;
            // for (let i in res.dataList) {
            //   this.list.push(res.dataList[i]);
            // }
            if (this.totalPage == this.page) {
              this.more = true;
            }
          }
        })
        .catch(res => {});
    },
    shopper(event) {
      console.log(event);
      if (event.target.index == undefined) {
        return false;
      } else {
        this.active = event.target.index;
        this.page = 1;
        this.list = [];
        if (this.tarbaActive != 1) {
          this.myOrder(this.active, this.page, this.tarbaActive);
        } else {
          this.pinTuanOrderList();
        }
      }
    },
    //详情
    order(v) {
      console.log(v);
      let obj = { direct: this.tarbaActive, id: v.id };
      if (this.tarbaActive == 1) {
        // wx.setStorageSync('isshow',1);
        wx.navigateTo({
          url: "/pages/order/pinorderdetials?id=" + JSON.stringify(obj)
        });
      } else if (this.tarbaActive == 0) {
        // wx.setStorageSync('isshow',0);
        wx.navigateTo({
          url: "/pages/order/orderdetials?id=" + JSON.stringify(obj)
        });
      }
      //  else {
      //   wx.navigateTo({
      //     url: "/pages/order/orderdetials?id=" + JSON.stringify(obj)
      //   });
      // }
    },
    //收货
    queshou(v) {
      let type = this.tarbaActive;
      let parmas;
      parmas = {
        cmd: "confirmReceive",
        id: v.id
      };
      console.log(v.id);
      Request.postRequest(parmas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.list = [];
            wx.showToast({
              title: "收货成功",
              icon: "none"
            });
            this.getNum();
            if (type == 1) {
              //  拼团
              this.pinTuanOrderList();
            } else {
              //   普通
              this.myOrder(this.active, this.page, this.tarbaActive);
            }
          }
        })
        .catch(res => {});
    },
    //评价
    ping(v) {
      wx.navigateTo({
        url: "/pages/goodPing/goodPingIndex?ids=" + v.id
      });
    },
    del(v) {
      console.log("删除订单");
      console.log(v);
      let deleteOrder = {
        cmd: "deleteOrder",
        id: v.id
      };
      console.log(deleteOrder);
      Request.postRequest(deleteOrder)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.list = [];
            wx.showToast({
              title: "删除成功"
            });
            if (this.tarbaActive == 1) {
              //  拼团
              this.pinTuanOrderList();
            } else {
              //   普通
              this.myOrder(this.active, this.page, this.tarbaActive);
            }
          }
        })
        .catch(res => {});
    }
  }
};
</script>
<style >
page {
  width: 100%;
  min-height: 100%;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.van-tabs__wrap {
  position: fixed !important;
  top: 0px !important;
}

.contain {
  width: 100%;
  height: 100%;
}

.van-tab__pane {
  min-height: 667px;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: column;

  .toptar {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    height: 40px;
    position: fixed;
    top: 0;
    background: #fff;
    z-index: 999;

    div {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
    }

    .taractive {
      color: rgb(114, 209, 65);
      border-bottom: 2px solid rgb(114, 209, 65);
    }
  }

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
    padding-top: 40px;

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
        padding: 5px 0;
        box-sizing: border-box;

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

.loading {
  width: 100%;
  height: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999;
}
</style>
