<template>
  <div class="contain">
    <div class="middle" v-for="(v,k) in detailList" :key="k">
      <div class="g_swipe">
        <swiper @change="onChange" :autoplay="3000" circular="true" style="width:100%;">
          <swiper-item v-for="(img,inx) in v.images" :key="inx" style="width:100%;">
            <img :src="img" alt @click.stop="clickBannerImg(inx)" class="imgs" />
          </swiper-item>
        </swiper>
        <div class="custom-indicator" slot="indicator">{{current+1}}/{{v.images.length}}</div>
        <div class="g_top">
          <img src="/static/img/xiangq_gouwu.png" alt @click="order" />
        </div>
        <div class="showtime" v-if="LeaveEnd!=0">
          <span>距离结束时间：</span>
          <van-count-down :time="LeaveEnd" format="DD天HH时mm分ss秒" />
        </div>
        <div class="showtime" v-else>
          <span>活动已结束</span>
        </div>
      </div>
      <div class="g_product">
        <div class="g_left">
          <div class="g_title">
            <h3>{{v.name}}</h3>
            <!-- <span>销量 ：{{v.soldNumber}}</span> -->
            <span>成团人数 ：{{personnum}}</span>
          </div>
          <!-- <div class="g_money" v-if="v.freight!=='-1'&&v.freight!==undefined">满￥{{v.freight}}包邮</div> -->
          <div class="g_money">
            <div class="money">
              <span class="g_new">￥{{v.price}}</span>&nbsp;&nbsp;
              <span class="g_old" v-if="v.originalPrice!=undefined">￥{{v.originalPrice}}</span>
            </div>
          </div>
        </div>
        <div class="g_right">
          <img src="/static/img/xiangq_fenxiang.png" alt />
          <button open-type="share" class="pos"></button>
        </div>
      </div>
      <!-- 最近购买人 -->
      <div class="buyIcon">
        <div class="buyNUm">
          <h3>最近购买</h3>
          <span>{{buyNum}}</span>
        </div>

        <div class="buyDetails">
          <div class="Icon">
            <img :src="item" alt v-for="(item,index) in buyRecord" :key="index" />
            <!-- <img src="/static/img/chenggong.png" alt />
            <img src="/static/img/chenggong.png" alt />-->
          </div>
          <div></div>
        </div>
      </div>
      <div class="goods_img">
        <h2>商品详情：</h2>
        <p>{{v.describe}}</p>
        <img
          :src="img"
          v-for="(img,inx) in v.describeImages"
          :key="inx"
          @click="clickDescribeImg(inx)"
          mode="widthFix"
        />
      </div>

      <van-goods-action v-if="!showBase">
        <div class="tarmay">
          <div class="woshi" @click="shopdian">
            <img src="/static/img/dianpu.png" alt />
            <span>店铺</span>
          </div>
          <div class="woshi" @click="kefu(sphone)">
            <img src="/static/img/kefu.png" alt />
            <span>客服</span>
          </div>
        </div>

        <div class="addbtn">
          <span class="first" @click.stop="addCart">加入购物车</span>
          <span class="two" @click.stop="addCart">立即下单</span>
        </div>
      </van-goods-action>
      <!-- 商品的规格选择开始 -->

      <div v-if="showBase" class="showSku" @click.stop="showBase=false">
        <!-- <div>选择规格</div> -->
        <div class="allskuinfo" @click.stop>
          <div class="title">
            <img :src="logo" alt class="oneimgs" />
            <div class="skuname">
              <p>{{SKname}}</p>
              <p>
                <span>￥{{currentSkuList.price}}</span>
              </p>
            </div>
            <img src="/static/img/cross.png" alt class="close" @click.stop="showBase=false" />
          </div>
          <div class="skudetail">
            <span
              @click.stop="changSku(index,item)"
              v-for="(item,index) in skuList"
              :key="index"
              :class="{'skuActive':active==index}"
            >{{item.val}}</span>
          </div>
          <div class="addnum">
            <div>
              <p>数量</p>
              <p style="font-size:12px;">剩余{{currentSkuList.stock}}件</p>
            </div>
            <div class="buynum">
              <span @click.stop="del">-</span>
              <input type="number" v-model="val" />
              <span @click.stop="add">+</span>
            </div>
          </div>

          <div class="addbtn">
            <span class="first" @click.stop="onAdd">加入购物车</span>
            <span class="two" @click.stop="addBuy">立即下单</span>
          </div>
        </div>
      </div>

      <!-- 商品的规格选择结束 -->
    </div>
    <!-- 下部 评论 -->
    <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="beginLoading"> -->
    <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
    <div ref="comment" class="comment">
      <div class="c_dis">
        <div class="c_item" v-for="(v,k) in list" :key="k">
          <img :src="v.headImage" alt class="usericon" />
          <div class="item_right">
            <div class="right_top">
              <div class="r_tit">
                <span>{{v.nickName}}</span>
                <span>{{v.createTime}}</span>
              </div>
              <div class="user_star">
                <van-rate :value="v.stars" disabled disabled-color="rgb(255,210,30)" :size="14" />
                <span style="margin-left:0.2rem">{{v.stars}}.0</span>
              </div>
            </div>
            <p>{{v.content}}</p>
            <div class="c_img">
              <!-- <template v-for="(i,index) in v.url" :key="index">
                    <img :src="i.imgs" alt>
              </template>-->
              <img
                :src="i"
                alt
                v-for="(i,index) in v.images"
                :key="index"
                @click.stop="seecomment(k,index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-if="more">
      <span>没有更多了</span>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      more: false,
      cid: "",
      //  规格id
      id: "",
      shares: {},
      type: false,
      current: 0,
      detailList: [],
      hasCouponyin: false,
      list: [],
      dataList: [],
      page: 1,
      totalPage: 3,
      showBase: false,
      dian: "",
      sphone: "",
      sname: "",
      shopID: "",
      SKname: "",
      val: 1,
      skuList: [],
      currentSkuList: {},
      show: false,
      images: [],
      logo: "",
      active: 0,
      personnum: "", // 成团人数
      buyRecord: "", //  购买人数
      endtime: "", //  结束时间
      buyNum: "", //  最近购买
      LeaveEnd: ""
    };
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "商品详情"
    });
    this.id = JSON.parse(options.id).id;
    this.direct = JSON.parse(options.id).type;
    console.log(options.id);

    this.init();
  },
  onShow() {
    this.active = 0;
    this.val = 1;
    // this.list = [];
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }
  },
  //   底部  评价 加载
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      this.uinit();
    } else {
      this.more = true;
    }
  },
  mounted() {
    console.log("mounted");
    this.showBase = false;
    this.more = false;
    // console.log(this.LeaveEnd);
  },
  computed: {
    //   倒计时
    // LeaveEnd() {
    //   let end = new Date(this.endtime).getTime();
    //   let now = new Date().getTime();
    //   if (end > now) {
    //     return end - now;
    //   } else {
    //     return 0;
    //   }
    // }
  },
  components: {},
  methods: {
    // getformid(e) {
    //   console.log(e);
    // },
    add() {
      if (this.val < this.currentSkuList.stock) {
        this.val += 1;
      } else {
        wx.showToast({
          title: "没有那多库存了",
          icon: "none"
        });
      }
    },
    del() {
      if (this.val > 1) {
        this.val -= 1;
      }
    },
    formatTime(unixtime) {
      var date = new Date(unixtime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
      return y + "-" + m + "-" + d + " " + h + ":" + minute;
    },
    //   选规格
    changSku(ind, e) {
      this.val = 1;
      this.active = ind;
      this.id = e.id;
      this.currentSkuList = this.skuList[ind];
    },
    addBuy() {
      console.log(this.val);
      wx.setStorageSync("direct", this.direct);
      if (this.currentSkuList.stock <= 0) {
        wx.showToast({
          title: "该规格商品已售空",
          icon: "none"
        });
      } else {
        this.currentSkuList.number = this.val;
        this.currentSkuList.images = this.logo;
        this.currentSkuList.sname = this.sname;
        this.currentSkuList.name = this.SKname;
        this.currentSkuList.sid = this.shopID;
        this.currentSkuList.id = this.id;
        console.log(this.currentSkuList);
        this.showBase = false;
        wx.navigateTo({
          url:
            "/pages/pintuan/pintuanGood?good=" +
            JSON.stringify(this.currentSkuList)
        });
      }
    },
    //  微信图片预览
    clickBannerImg(inx) {
      console.log(inx);
      wx.previewImage({
        current: this.detailList[0].images[inx],
        urls: this.detailList[0].images
      });
    },
    //  微信图片预览
    clickDescribeImg(inx) {
      wx.previewImage({
        // 当前展示
        current: this.detailList[0].describeImages[inx],
        //  要展示的数组
        urls: this.detailList[0].describeImages
      });
    },
    seecomment(k, inx) {
      wx.previewImage({
        // 当前展示
        current: this.list[k].images[inx],
        //  要展示的数组
        urls: this.list[k].images
      });
    },
    addCart() {
      if (this.cid ==undefined ||this.cid=="") {
        this.nouser();
      } else {
        if (this.LeaveEnd == 0) {
          wx.showToast({
            title: "该商品活动已结束,请选择其他商品!",
            icon: "none"
          });
        } else {
          this.showBase = true;
        }
      }

      console.log(1);
    },

    onChange(e) {
      this.current = e.mp.detail.current;
    },
    init() {
      this.detailList = [];
      this.list=[];
      let datas = {
        cmd: "goodsDetail",
        id: this.id,
        cid: this.cid
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          if (res.result == 0) {
            this.uinit();
            console.log(res);
            this.buyNum = res.buyNum;
            this.personnum = res.personnum; // 成团人数
            this.buyRecord = res.buyRecord; //  购买记录
            this.endtime = res.endtime.replace(/-/g, "/"); //  结束时间
            let end = new Date(this.endtime).getTime();
            let now = new Date().getTime();
            if (end > now) {
              this.LeaveEnd = end - now;
            } else {
              this.LeaveEnd = 0;
            }

            // this.endtime = "2019-10-29";
            console.log(this.endtime);
            this.skuList = res.specifyValue;
            this.currentSkuList = this.skuList[0];
            this.logo = res.logo;
            this.SKname = res.name;
            console.log(this.skuList);
            this.sphone = res.sphone;
            this.sname = res.sname;
            this.dian = res.sid;
            this.shopID = res.id;
            console.log(this.dian);
            if (res.isCollect == true) {
              this.type = true;
            } else {
              this.type = false;
            }
            if (res.hasCoupon == 1) {
              this.hasCouponyin = true;
            } else {
              this.hasCouponyin = false;
            }
            this.detailList.push(res);
            this.goods.title = res.name;
            this.goods.picture = res.images[0];

            this.donghua = false;
          }
        })
        .catch(res => {});
    },
    stepperchange(e) {
      this.val = e;
    },
    kefu(tel) {
      wx.makePhoneCall({
        phoneNumber: tel
      });
    },
    shopdian() {
      console.log(this.dian);
      wx.navigateTo({
        url: "/pages/shopdetails/index?id=" + this.dian
      });
    },
    uinit() {
      let pin = {
        cmd: "goodsComment",
        id: this.id,
        pageNow: this.page
      };
      Request.postRequest(pin)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            console.log(res.dataList);
            for (let i in res.dataList) {
              // console.log(Formdata.formatTime( res.dataList[i].createTime))
              res.dataList[i].createTime = this.formatTime(
                res.dataList[i].createTime
              );
              this.list.push(res.dataList[i]);
              console.log(this.list);
            }
          }
        })
        .catch(res => {});
    },
    formatTime(unixtime) {
      var date = new Date(unixtime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
      return y + "-" + m + "-" + d + " " + h + ":" + minute;
    },

    showSku() {
        if (this.cid == undefined ||this.cid=="") {
        // this.$router.push("/login");
        this.nouser();
      } else {
      this.showBase = true;
      }
    },
    //  顶部 购物车图标
    order() {
      wx.switchTab({
        url: "/pages/tarba/cart"
      });
    },
    onAdd() {
      if (this.currentSkuList.stock <= 0) {
        wx.showToast({
          title: "该规格商品已售空",
          icon: "none"
        });
      } else {
        let shoplist = {
          cmd: "addToCar",
          gid: this.id,
          cid: this.cid,
          specifications: this.currentSkuList.skuId,
          number: this.val
        };
        console.log(shoplist);
        Request.postRequest(shoplist)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              wx.showToast({
                title: "已加入购物车"
              });
              this.showBase = false;
            }
          })
          .catch(res => {});
        // }
      }
    },
    nouser() {
      wx.showModal({
        title: "温馨提醒！",
        content: "你还没有绑定手机号,请先绑定手机号,确认信息",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/author/index"
            });
          }
        }
      });
    },
    tiaozhuan(id, name) {
      //优惠券我来了
      console.log(id, name);
      let obj = {};
      obj.id = id;
      obj.name = name;
      wx.navigateTo({
        url: "/pages/shopdetails/couponlin?id=" + JSON.stringify(obj)
      });
    }
  },
  onShareAppMessage() {
    let obj = { type: this.direct, id: this.id };
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  }
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
._swiper {
  height: 100%;
}

.buyIcon {
  width: 100%;
  height: 100px;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;

  .buyNUm {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 13px;
    }

    span {
      font-size: 13px;
      color: #999999;
    }
  }

  .buyDetails {
    width: 100%;
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin: 0 5px;
    }
  }

  .Icon {
    width: 80%;
    flex: 1;
  }
}

.showtime {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: red;
  display: flex;
  align-items: center;
  color: #fff;
  position: absolute;
  bottom: 0;
  padding-left: 10px;
  box-sizing: border-box;

  span {
    font-size: 13px;
    // margin-right: 10px;
  }

  i {
    font-size: 15px;
    margin-left: 10px;
  }
}

.contain {
  width: 100%;
  height: auto;
  margin-bottom: 60px;
}

._van-swipe-item img {
  width: 100%;
  height: 100%;
}

._van-goods-action {
  z-index: 2000;
  position: fixed;
  display: flex;
  bottom: 0;
}

.van-popup {
  z-index: 100000;
}

.van-sku-row__title {
  display: none !important;
}

.middle {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.g_top {
  width: 0.6rem;
  height: 0.6rem;
  box-sizing: border-box;
  position: absolute;
  top: 0.2rem;
  right: 0.4rem;

  img {
    width: 0.6rem;
    height: 0.6rem;
  }
}

.g_swipe {
  width: 100%;
  height: 300px;
  color: #333;
  position: relative;

  .imgs {
    height: 100%;
    width: 100%;
  }

  .custom-indicator {
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;
    padding: 0.1rem 15px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 30px;
    font-size: 14px;
    color: #fff;
    z-index: 99;
  }
}

.g_product {
  // width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0 0.2rem 0.2rem;
  box-sizing: border-box;
  position: relative;

  .g_left {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 0.1rem;
    box-sizing: border-box;

    .g_title {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      color: #333;

      h3 {
        // width: 100%;
        display: block;
        overflow: hidden;
        font-size: 15px;
        text-overflow: ellipsis;
      }

      span {
        color: #999;
        font-size: 12px;
        margin-top: 0.2rem;
      }
    }

    .g_money {
      width: 100%;
      font-size: 14px;
      padding-top: 0.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .money {
        display: flex;

        .g_new {
          color: red;
        }

        .g_old {
          color: #999;
          text-decoration: line-through;
          margin-left: 10px;
        }
      }
    }
  }

  .g_right {
    width: 56px;
    display: flex;
    border-radius: 30px;
    margin-right: 5px;
    position: absolute;
    right: 10px;
    top: 10px;

    .pos {
      position: absolute;
      top: 0;
      left: 0;
      height: 50px;
      width: 100%;
      opacity: 0;
      z-index: 99;
    }

    img {
      width: 100%;
      height: 25px;
    }
  }
}

.tarmay {
  width: 40%;
  display: flex;
  align-items: center;

  .woshi {
    flex: 1;
    // height: 30px;
    background: #fff;
    border-right: 1px solid #dedede;
    color: #7d7e80;
    // padding: 5px 15px 0 15px;
    text-align: center;

    span {
      font-size: 12px;
    }

    img {
      width: 20px;
      height: 20px;
      display: block;
      margin: 0 auto;
      opacity: 0.5;
    }
  }
}

.woshia {
  width: 50px;
  border-right: none;
}

.goods_img {
  // width: 100%;
  padding: 0.4rem 0;
  background: #fff;

  h2 {
    padding: 0 0.4rem;
  }

  p {
    // width: 100%;
    padding: 0.5rem 0.4rem;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
  }

  img {
    width: 100%;
    display: block;
  }
}

.comment {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .c_dis {
    // width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0.4rem;
    box-sizing: border-box;

    .c_item {
      // width: 100%;
      padding: 0.4rem 0;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;

      .usericon {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
      }

      .item_right {
        width: 80%;
        padding-left: 0.3rem;
        display: flex;
        flex-direction: column;

        .right_top {
          width: 100%;
          height: 1.2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 14px;
          color: #333;

          .r_tit {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .user_star {
            width: 100%;
            display: flex;
            align-items: center;
          }
        }

        p {
          font-size: 12px;
          color: #333;
          padding-top: 0.6rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .c_img {
          width: 100%;
          margin-top: 0.3rem;
          display: flex;

          img {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.3rem;
          }
        }
      }
    }
  }
}

.copin {
  background: #f4f4f4;
  padding-top: 5px;

  div {
    background: #fff;
    position: relative;
    height: 46px;

    img {
      height: 20px;
      width: 15px;
    }

    .hongbao {
      position: absolute;
      top: 12px;
      left: 20px;
    }

    span {
      position: absolute;
      top: 15px;
      left: 50px;
      font-size: 14px;
      color: #F7725C;
    }

    .quyou {
      position: absolute;
      top: 15px;
      right: 20px;
    }
  }
}

.showSku {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.45);

  .allskuinfo {
    background: #fff;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;

    .title {
      padding: 0.2rem;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .oneimgs {
        position: absolute;
        top: -20px;
        left: 20px;
        width: 100px;
        height: 100px;
        border-radius: 5px;
      }

      .skuname {
        p {
          font-size: 14px;
          display: flex;

          span {
            color: #FE552E;
          }
        }
      }

      .close {
        position: absolute;
        right: 20px;
        top: 20px;
        width: 22px;
        height: 22px;
      }
    }
  }

  .skudetail {
    display: flex;
    padding: 20px;
    margin-top: 40px;
    flex-wrap: wrap;

    span {
      padding: 7px 15px;
      border: 1px solid #c1c1c1;
      font-size: 12px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 15px;
    }

    .skuActive {
      background: #72D241;
      color: #fff;
      border: none;
    }
  }

  .addnum {
    display: flex;
    padding: 10px 20px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    .buynum {
      display: flex;
      align-items: center;

      span {
        width: 25px;
        height: 28px;
        // border: 1px solid #ccc;
        // border-radius: 2rpx;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
      }

      input {
        margin: 0 5px;
        width: 35px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        text-align: center;
        // border: 1px solid #ccc;
        background: #F6F6F6;
        color: #1A1A1A;
      }
    }
  }
}

.addbtn {
  height: 50px;
  width: 100%;
  display: flex;
  font-size: 14px;

  .first {
    width: 50%;
    height: 50px;
    background: #FB9C1C;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }

  .two {
    width: 50%;
    height: 50px;
    background: #72D241;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }
}
</style>
