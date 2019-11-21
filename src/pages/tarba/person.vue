<template>
  <div class="contain">
    <div class="box">
      <div class="wrapper">
        <div class="xiaoxi" @click="message">
          <img src="/static/img/xiaoxi01.png" alt class="xiaoxi" />
          <b class="xiaob" v-if="xiaoshow==true"></b>
        </div>
        <div class="person" @click="goMsg">
          <div class="user">
            <span style="font-weight: 600;margin-bottom: 0.3rem;font-size:14px;">{{username}}</span>
            <span>{{mobile}}</span>
          </div>
          <div class="person_img">
            <img
              style="width:0.3rem;height:0.4rem;margin-left:0.3rem;"
              src="/static/img/jinru02.png"
              alt
            />
            <div class="imgs">
              <img :src="headImage" alt v-if="headImage!=''" />
              <img src="/static/img/touxiang.png" alt v-else />
            </div>
          </div>
        </div>
        <div class="top-nav">
          <div class="top-head">
            <span>我的订单</span>
            <div class="top-right">
              <span>
                <a @click="gotoall(0)">全部订单</a>
              </span>
              <img
                style="width:0.2rem;height:0.3rem;margin-left:0.3rem;"
                src="/static/img/jinru02.png"
                alt
              />
            </div>
          </div>
          <div class="top-bar">
            <van-tabbar :fixed="false" active-color="#666">
              <van-tabbar-item to :info="pendPayNumber" v-if="pendPayNumber>0" @click="gotoall(1)">
                <span>
                  待付款
                  <!-- <a :href="'/pages/order/all/'+1">待付款</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daifukuan.png" />
              </van-tabbar-item>
              <van-tabbar-item to v-else @click="gotoall(1)">
                <span>
                  待付款
                  <!-- <a :href="'/pages/order/all'+1">待付款</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daifukuan.png" />
              </van-tabbar-item>
              <van-tabbar-item
                to
                :info="pendSendNumber"
                v-if="pendSendNumber>0"
                @click="gotoall(2)"
              >
                <span>
                  待发货
                  <!-- <a :href="'/pages/order/all'+2">待发货</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daifahuo.png" />
              </van-tabbar-item>
              <van-tabbar-item to v-else @click="gotoall(2)">
                <span>
                  待发货
                  <!-- <a :href="'/pages/order/all/'+2">待发货</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daifahuo.png" />
              </van-tabbar-item>
              <van-tabbar-item
                to
                :info="pendReceiveNumber"
                v-if="pendReceiveNumber>0"
                @click="gotoall(3)"
              >
                <span>
                  待收货
                  <!-- <a :href="'/pages/order/all/'+3">待收货</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daishouhuo.png" />
              </van-tabbar-item>
              <van-tabbar-item to v-else @click="gotoall(3)">
                <span>
                  待收货
                  <!-- <a :href="'/pages/order/all/'+3">待收货</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daishouhuo.png" />
              </van-tabbar-item>
              <van-tabbar-item
                to
                :info="pendEvaluateNumber"
                v-if="pendEvaluateNumber>0"
                @click="gotoall(4)"
              >
                <span>
                  待评价
                  <!-- <a :href="'/pages/order/all/'+4"></a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daipingjia.png" />
              </van-tabbar-item>
              <van-tabbar-item to v-else @click="gotoall(4)">
                <span>
                  待评价
                  <!-- <a :href="'/pages/order/all/'+4">待评价</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/daipingjia.png" />
              </van-tabbar-item>
              <van-tabbar-item
                to
                :info="afterSaleNumber"
                v-if="afterSaleNumber>0"
                @click="gotoall(5)"
              >
                <span>
                  退款/售后
                  <!-- <a :href="'/pages/order/TuiShop/'+5">退款/售后</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/tuikuanshouhou.png" />
              </van-tabbar-item>
              <van-tabbar-item to v-else @click="gotoall(5)">
                <span>
                  退款/售后
                  <!-- <a :href="'/pages/order/TuiShop/'+5">退款/售后</a> -->
                </span>
                <img slot="icon" slot-scope="props" src="/static/img/tuikuanshouhou.png" />
              </van-tabbar-item>
            </van-tabbar>
          </div>
        </div>
        <div class="bottom-nav">
          <div class="bottom-head">
            <div style="font-size:14px;background:#fff;">山城乡鲜服务</div>
          </div>
          <ul style="border-radius:0 0 5px 5px ;">
            <li class="one">
              <a href="/pages/my/shoucang">
                <img src="/static/img/my_shoucang.png" alt />
              </a>
              <span>我的收藏</span>
            </li>
            <li class="one">
              <a href="/pages/my/mypingjia">
                <img src="/static/img/my_pingjia.png" alt />
              </a>
              <span>我的评价</span>
            </li>
            <li class="one">
              <a href="/pages/address/myadd">
                <img src="/static/img/my_dizhi.png" alt />
              </a>
              <span>地址管理</span>
            </li>
          </ul>
          <!-- <div style="height:15px;background:#eee"></div> -->
          <ul style="border-radius:5px;margin-top:10px;">
            <li class="two">
              <a href="/pages/my/shangjia/shangjiaruzhu">
                <img src="/static/img/my_ruzhu.png" alt />
              </a>
              <span>商家中心</span>
            </li>
            <li class="two" @click="learCenter">
              <img src="/static/img/my_tuanzhang@2x.png" alt />
              <!-- <span>{{text}}</span> -->
              <span>团长中心</span>
            </li>
            <li class="two">
              <a href="/pages/my/kefucenter">
                <img src="/static/img/my_kefu.png" alt />
              </a>
              <span>客服中心</span>
            </li>
            <li class="two">
              <a href="/pages/my/shezhicenter">
                <img src="/static/img/my_shezhi.png" alt />
              </a>
              <span>设置</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      num: 4,
      active: 2,
      xiaoshow: false,
      username: "", //昵称
      mobile: "", //手机号
      headImage: "", //头像
      afterSaleNumber: "", //待退款
      pendEvaluateNumber: "", //待评价
      pendPayNumber: "", //待付款
      pendReceiveNumber: "", //待收货
      pendSendNumber: "", //待发货
      useryin: false,
      gou: 0,
      cid: "",
      formid: "",
      first: true,
      // text: "团长入驻",
      state: 0
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "我的"
    });
    this.xiaoshow = false;
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      // if(this.cid!=undefined){
      //   this.showText();
      // }
    }
  },
  onShow() {
    if (this.cid == undefined) {
      this.nouser();
    } else {
      this.gouserInfo();
      this.infoList();
    }
  },
  mounted() {},
  onShareAppMessage() {
    return this.$share.share();
  },
  methods: {
    nouser() {
      wx.showModal({
        title: "温馨提醒！",
        content: "你还没有绑定手机号,请先绑定手机号,确认信息",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/bind/bindtell"
            });
          } else if (res.cancel) {
            console.log("取消");
          }
        }
      });
    },
    infoList() {
      this.show = false;
      let datas = {
        cmd: "infoList",
        cid: this.cid,
        pageNow: 1
      };
      Request.noLoading(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            for (var i in res.dataList) {
              if (res.dataList[i].read == 0) {
                this.xiaoshow = true;
                break;
              }
            }
          }
        })
        .catch(res => {});
    },
    gouserInfo() {
      let goCarlist = {
        cmd: "myInfo",
        cid: this.cid
      };
      Request.postRequest(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.setStorageSync("order", JSON.stringify(res));
            this.username = res.nickName; //昵称
            this.mobile = `${res.mobile.slice(0, 3)}****${res.mobile.slice(
              -4
            )}`; //手机号
            this.headImage = res.headImage; //头像
            this.pendEvaluateNumber = res.pendEvaluateNumber; //待评价
            this.pendPayNumber = res.pendPayNumber; //待付款
            this.pendReceiveNumber = res.pendReceiveNumber; //待收货
            this.pendSendNumber = res.pendSendNumber; //待发货
          }
        })
        .catch(res => {});
    },
    showText() {
      if (wx.getStorageSync("ISLEADER")) {
        this.text = "团长中心";
        this.state = wx.getStorageSync("ISLEADER");
      } else {
        let parmas = {
          cmd: "leaderInfo",
          cid: this.cid
        };
        Request.noLoading(parmas)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              this.state = res.state;
              if (res.state == 1) {
                this.text = "团长中心";
                wx.setStorageSync("ISLEADER", res.state);
                wx.setStorageSync("leaderInfo", JSON.stringify(res));
              }
            }
          })
          .catch(err => {});
      }
    },
    learCenter() {
      if(this.first){
        this.first=false;
        let parmas = {
          cmd: "leaderInfo",
        cid: this.cid
      };
      Request.postRequest(parmas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.state = res.state;
            this.first=true;
            if (res.state == 1) {
              // this.text = "团长中心";
              wx.setStorageSync("ISLEADER", res.state);
              wx.setStorageSync("leaderInfo", JSON.stringify(res));
            }
            let num = Number(this.state);
            switch (num) {
              case 0:
                wx.showToast({
                  title: "正在审核中!请稍等...",
                  icon: "none"
                });
                break;
              case 1:
                setTimeout(() => {
                  wx.navigateTo({
                    url: "/pages/my/tuanzhangcenter/tuanzhangcenter"
                  });
                }, 30);

                break;
              case 2:
                wx.showToast({
                  title: "你的审核没有通过，请重新填写个人信息",
                  icon: "none"
                });
                setTimeout(() => {
                  wx.navigateTo({
                    url: "/pages/my/tuanzhangcenter/restuanzhang"
                  });
                }, 500);
                break;
              case 3:
                wx.navigateTo({
                  url: "/pages/my/tuanzhangcenter/restuanzhang"
                });
            }
          }
        })
        .catch(err => {});
      }
    },
    // learCenter() {
    //   let num = Number(this.state);
    //   switch (num) {
    //     case 0:
    //       wx.showToast({
    //         title: "正在审核中!请稍等...",
    //         icon: "none"
    //       });
    //       break;
    //     case 1:
    //       setTimeout(() => {
    //         wx.navigateTo({
    //           url: "/pages/my/tuanzhangcenter/tuanzhangcenter"
    //         });
    //       }, 30);

    //       break;
    //     case 2:
    //       wx.showToast({
    //         title: "你的审核没有通过，请重新填写个人信息",
    //         icon: "none"
    //       });
    //       setTimeout(() => {
    //         wx.navigateTo({
    //           url: "/pages/my/tuanzhangcenter/restuanzhang"
    //         });
    //       }, 500);
    //       break;
    //     case 3:
    //       wx.navigateTo({
    //         url: "/pages/my/tuanzhangcenter/restuanzhang"
    //       });
    //   }
    // },
    goMsg() {
      if (this.cid == undefined) {
        this.nouser();
      } else {
        wx.navigateTo({
          url: "/pages/my/person_msg"
        });
      }
    },
    message() {
      wx.navigateTo({
        url: "/pages/my/message"
      });
    },
    gotoall(m) {
      wx.setStorageSync("tarnum", "0");
      switch (m) {
        case 0:
          wx.navigateTo({ url: "/pages/order/all?id=" + 0 });
          break;
        case 1:
          wx.navigateTo({ url: "/pages/order/all?id=" + 1 });
          break;
        case 2:
          wx.navigateTo({ url: "/pages/order/all?id=" + "2" });
          break;
        case 3:
          wx.navigateTo({ url: "/pages/order/all?id=" + 3 });
          break;
        case 4:
          wx.navigateTo({ url: "/pages/order/all?id=" + 4 });
          break;
        case 5:
          wx.navigateTo({ url: "/pages/order/TuiShop?cid=" + this.cid });
          break;
      }
    }
  }
};
</script>
<style>
.van-hairline--top-bottom::after {
  border: none !important;
}
page {
  width: 100%;
  min-height: 100%;
  background: #eee;
}
</style>

<style scoped lang="stylus">
._van-tabbar {
  width: 100% !important;
}

.van-tabbar-item {
  font-size: 16px;
}

._van-tabbar-item__icon img {
  width: 36px !important;
  height: 36px !important;
}

.top-bar {
  width: 100%;
  display: flex;
  padding: 0.3rem 0 0.2rem;
}

.contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #72D241;
    padding: 0rpx 20rpx;
    box-sizing: border-box;
    height: 400rpx;

    .wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      padding-top: 30rpx;

      .xiaoxi {
        position: relative;
        width: 0.7rem;
        height: 0.7rem;

        img {
          width: 0.7rem;
          height: 0.7rem;
        }

        .xiaob {
          position: absolute;
          right: 0;
          top: 5px;
          background: red;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
      }

      .person {
        width: 100%;
        // height: 144px;
        // padding: 0.2rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .user {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          color: #fff;
          padding-left: 0.1rem;
        }

        .person_img {
          flex: 1;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;

          .imgs {
            width: 1.6rem;
            height: 1.6rem;
            font-size: 0;
            margin-right: 30px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }

    .top-nav {
      width: 100%;
      background: #fff;
      position: absolute;
      top: 2.8rem;
      left: 0;
      border-radius: 8px;
      // padding: 0.2rem 0;
      box-sizing: border-box;

      .top-head {
        width: 100%;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;
        padding: 0 0.4rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;

        .top-right {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .bottom-nav {
      width: 100%;
      // background: #eee;
      position: absolute;
      top: 5.4rem;
      left: 0;
      border-radius: 8px;
      // padding: 0.2rem 0;
      box-sizing: border-box;

      .bottom-head {
        width: 100%;
        height: 1rem;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;
        padding: 0 0.4rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        border-radius: 8px 8px 0 0;
      }

      ul {
        width: 100%;
        background: #fff;
        display: flex;
        flex-wrap: wrap;
        padding: 20px 0 0 0;

        // border-radius:8px;
        li {
          margin-bottom: 0.15rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #333;

          a {
            display: block;
          }

          img {
            width: 38px;
            height: 38px;
            margin-bottom: 0.3rem;
          }
        }

        .one {
          width: 30%;
          margin-right: 3%;
        }
      }

      .two {
        width: 22%;
        margin-right: 3%;
      }
    }
  }
}
</style>
