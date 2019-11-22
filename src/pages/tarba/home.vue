<template>
  <div class="contain">
    <!-- <div formType="submit"> -->
    <!-- <div class="head"> -->
    <form @submit="getformid" report-submit="true">
      <div class="head">
        <div class="city">
          <img src="/static/img/shouye-dingwei.png" alt />
          <span v-if="active==0" @click="choseNearBy">{{current}}</span>
          <span v-else @click="getCurLocation">{{city}}</span>
          <!-- <span v-else @click.stop="getCurLocation">{{leader.neighbor}}</span> -->
        </div>
        <div class="search">
          <img src="/static/img/shouye-sousuo.png" alt />
          <input
            type="text"
            placeholder="输入店铺或商品名称"
            @focus="goSearch"
            placeholder-style="color:#fff"
          />
        </div>
        <div class="message" @click="goMessage">
          <button formType="submit" class="formid"></button>
          <img src="/static/img/shouye-xiaoxi.png" alt />
        </div>
      </div>
    </form>
    <!-- </div> -->
    <div ref="all" class="wrapper">
      <van-tabs
        :active="active"
        color="rgb(114,209,65)"
        title-active-color="rgb(114,209,65)"
        sticky
        swipeable
        duration="0.1"
        @change="changeIng"
      >
        <van-tab :title="v.name" v-for="(v,k) in cate1" :key="k">
          <div class="swipe" v-if="showNav">
            <swipe :images="images"></swipe>
          </div>

          <div class="navs">
            <navs :datas="datas" :direct="direct"></navs>
          </div>

          <div class="slide-box">
            <discount
              :recommendList="list"
              :title="title"
              v-if="cate1[active].name=='精品推荐'"
              :direct="direct"
            ></discount>

            <div class="list" v-else @click.stop>
              <h3 v-if="title">{{title1}}</h3>

              <ul class="list-box">
                <li
                  v-for="(item,index) in dataList"
                  :key="index"
                  @click.stop="detail(item.id)"
                  v-if="k<3"
                >
                  <img :src="item.image" alt lazy-load />
                  <div class="list-content">
                    <div class="list-top">
                      <div class="list-title">{{item.name}}</div>
                      <div class="list-produce">{{item.text}}</div>
                    </div>
                    <div class="list-price">
                      <div class="list-left">
                        <span>￥{{item.price}}</span>
                        <s v-if="item.discount==1">￥{{item.originalPrice}}</s>
                      </div>
                      <img src="/static/img/gouwuche2.png" alt @click.stop="shopcart(item)" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <p class="zhe_p" @click.stop="chakan(cate1[active].name)">查看更多>></p>
          </div>
          <recommendx :recommend="recommendList" :tits="tits" :direct="direct"></recommendx>
          <div class="loading" v-if="more">
            <span>没有更多了</span>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import swipe from "@/components/swipe";
import Navs from "@/components/navs";
import Discount from "@/components/discount";
import Recommendx from "@/components/recommendx";
import Request from "@/common/js/request";
import QQMapWX from "@/common/jsdk/qqmap-wx-jssdk";
export default {
  data() {
    return {
      showNav:false,
      current: "",
      active: 0,
      num: 0,
      title: "折扣专区",
      title1: "优质商品推荐",
      tits: "销量推荐",
      city: "",
      images: [],
      datas: [],
      cate1: [],
      dataList: [],
      page: 1,
      totalPage: 1,
      recommendList: [],
      list: [],
      id: 100,
      more: false,
      cid: "",
      qqMapSdk: "",
      direct: 100,
      leader: {},
      fromid: "",
      timer: 0
    };
  },
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "/pages/tarba/home" // 路径，传递参数到指定页面。
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "首页"
    });

    this.diao();
    this.getCurLocation();
    this.qqMapSdk = new QQMapWX({
      key: "JYKBZ-NJNCU-GVDVC-B3RUD-AA5EH-3PFYT"
    })
  },
  onShow() {
    if (wx.getStorageSync("leaderInfo")) {
      this.leader = JSON.parse(wx.getStorageSync("leaderInfo"));
      console.log(this.leader);
      this.current = this.leader.neighbourhood;
    }
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      console.log(this.cid);
      console.log(this.$api)
      this.$api.getnum(this.cid);
    }
  },
  components: {
    swipe,
    Navs,
    Discount,
    Recommendx
  },
  mounted() {},
  //  上拉触底 加载
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      this.addRecommend();
    } else {
      this.more = true;
    }
  },
  methods: {
    getformid(e) {
      console.log(e);
      this.fromid = e.mp.detail.formId;
    },
    initLoad(id) {
      //处理初始化页面数据缓存开始
      let self = this;
      // console.log(id);
      let cateTAB = JSON.parse(wx.getStorageSync("cateTAB"));
      for (let i = 0; i < cateTAB.length; i++) {
        if (id == cateTAB[i].id) {
          console.log(cateTAB[i]);
          self.direct = 0;
          this.showNav=true;
          if (cateTAB[i].list) {
            self.datas = cateTAB[i].list.child;
            self.images = cateTAB[i].list.rotationChart;
            self.totalPage = cateTAB[i].list.totalPage;
            self.recommendList = cateTAB[i].list.order;
            self.dataList = cateTAB[i].list.discount;
          }
          // else {
          let datas = {
            cmd: "recommendGoods",
            id: id,
            pageNow: self.page
          };
          Request.noLoading(datas)
            .then(res => {
              console.log(res);
              if (res.result == 0) {
                cateTAB[i].list = {};
                self.datas = res.child;
                self.images = res.rotationChart;
                self.totalPage = res.totalPage;
                self.dataList = res.discount;
                self.recommendList = res.order;
                cateTAB[i].list.child = res.child;
                cateTAB[i].list.rotationChart = res.rotationChart;
                cateTAB[i].list.totalPage = res.totalPage;
                cateTAB[i].list.discount = res.discount;
                cateTAB[i].list.order = res.order;
                wx.setStorageSync("cateTAB", JSON.stringify(cateTAB));
              }
            })
            .catch(res => {});
          // }

          // }
        } else if (id == cateTAB[i].type) {
          self.direct = id;
           this.showNav=false;
          let parmas = {
            cmd: "pinTuanPage",
            pageNow: self.page,
            type: id
          };
          Request.noLoading(parmas)
            .then(res => {
              console.log(res);
              if (res.result == 0) {
                // cateTAB[i].list = {};
                self.datas = res.child;
                self.totalPage = res.totalPage;
                self.dataList = res.discount;
                self.recommendList = res.order;
                //   console.log(self.dataList)
                // if(res.discount!=[]){
                // cateTAB[i].list.discount = res.discount;
                // }
                // cateTAB[i].list.child = res.child;
                // cateTAB[i].list.totalPage = res.totalPage;

                // cateTAB[i].list.order = res.order;
                // wx.setStorageSync("cateTAB", JSON.stringify(cateTAB));
              }
            })
            .catch(res => {});
          // }
        }
      }
      console.log(self.page, self.totalPage);
      //处理初始化页面数据缓存结束

      //打折商品调用
      if (this.showNav) {
        let discount = {
          cmd: "discountGoods",
          pageNow: 1
        };
        Request.postRequest(discount)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              self.list = res.discount;
              // wx.setStorageSync("discount", JSON.stringify(self.list));
            }
          })
          .catch(res => {});
      }
    },
    diao() {
      wx.removeStorageSync("cateTAB");
      if (wx.getStorageSync("cateTAB")) {
        this.cate1 = JSON.parse(wx.getStorageSync("cateTAB"));
        this.active = 0;
        this.id = this.cate1[0].type;
        this.initLoad(this.id);
      } else {
        let datas = {
          cmd: "goodsCategoryInit",
          uid: ""
        };
        console.log(datas);
        Request.noLoading(datas)
          .then(res => {
            if (res.result == 0) {
              console.log(res);
                this.cate1 = [
                { type: "100", name: "社区团购" },
                { id: "", name: "精品推荐" }
              ];
              // this.cate1 = [
              //   { type: "100", name: "拼团" },
              //   { type: "200", name: "拿货团" },
              //   { id: "", name: "精品推荐" }
              // ];
              // let self=this;
              for (let i in res.dataList) {
                this.cate1.push(res.dataList[i]);
              }
              setTimeout(() => {
                this.id = this.cate1[0].type;
                this.initLoad(this.id);
              }, 30);

              wx.setStorageSync("cateTAB", JSON.stringify(this.cate1));
            }
          })
          .catch(res => {});
      }
    },

    getCurLocation() {
      let self = this;
      wx.showLoading({
        title: "定位中，请稍后..",
        icon: "none"
      });

      wx.getLocation({
        type: "gcj02",
        success(res) {
          console.log(res);
          wx.setStorageSync("point", JSON.stringify(res));
          wx.hideLoading();
          wx.showToast({
            title: "定位成功",
            icon: "none"
          });
          // console.log(res);
          self.qqMapSdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success(res) {
              console.log(res.result);
              self.city = res.result.ad_info.city;
            }
          });
          self.qqMapSdk.search({
            keyword: "住宅小区",
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success(res) {
              console.log(res);
              self.current = res.data[0].title;
            }
          });
        }
      });
    },

    //  数据加载更多
    addRecommend() {
      let self = this;
      console.log(1, self.page, self.totalPage);
      let datas = {};
      // if (self.page < self.totalPage) {
      // self.page += 1;
      if (this.direct==100) {
        console.log("打折加载");
        datas = {
          cmd: "pinTuanPage",
          pageNow: self.page,
          type: self.id
        };
      } else {
        datas = {
          cmd: "recommendGoods",
          id: self.id,
          pageNow: self.page
        };
      }
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log("加油" + res);
          // self.totalPage = res.totalPage;
          if (res.result == 0) {
            for (let i in res.order) {
              self.recommendList.push(res.order[i]);
            }
          }
        })
        .catch(res => {});
      // } else {
      //   this.more = true;
      // }
    },
    clear() {
      this.page = 1;
      this.more = false;
      this.totalPage = 1;
    },
    nouser() {
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
    },
    // 选择附近社区
    choseNearBy() {
      if (this.cid == undefined ||this.cid=="") {
        this.nouser();
      } else {
        wx.navigateTo({
          url: "/pages/pintuan/nearbytuan"
        });
      }
    },
    changeIng(k) {
        let ind = k.target.index;
         this.active = ind;
      console.log(k);
      this.clear();
      if (this.timer == 1) {
        return;
      } else {
        this.timer = 1;
        if (this.cate1[ind].id != undefined) {
          this.id = this.cate1[ind].id;
        } else {
          this.id = this.cate1[ind].type;
        }
        this.initLoad(this.id);
      }
      setTimeout(() => {
        this.timer = 0;
      }, 100);

      console.log(this.id);

     
    },
    goSearch() {
      this.$router.push("/pages/search/index");
    },
    goMessage() {
      if (this.cid == undefined ||this.cid=="") {
        this.nouser();
      } else {
        let parmas = {
          cmd: "uploadFormid",
          uid: this.cid,
          fromid: this.fromid
        };
        console.log(this.fromid);
        Request.postRequest(parmas).then(res => {
          if (res.result == 0) {
            console.log(res);
            console.log(JSON.stringify(res));
            this.$router.push("/pages/my/message");
          }
        });
      }
    },
    // infoList(id) {
    //   let datas = {
    //     cmd: "infoList",
    //     cid: id,
    //     pageNow: 1
    //   };
    //   Request.postRequest(datas)
    //     .then(res => {
    //       if (res.result == 0) {
    //         console.log(res.dataList);
    //         for (var i in res.dataList) {
    //           if (res.dataList[i].read == 0) {
    //             this.xiaoxi = true;
    //           } else {
    //             this.xiaoxi = false;
    //           }
    //         }
    //       }
    //     })
    //     .catch(res => {});
    // },
    chakan(v) {
      console.log(v);
      console.log(this.id);
      // if (this.id == 100 || this.id == 200) 
      if (this.id == 100 ){
        wx.navigateTo({
          url: "/pages/discount/pintuanList?id=" + this.id
        });
      } else if (this.id == "") {
        wx.navigateTo({
          url: "/pages/discount/discountList?id=" + this.id
        });
      } else {
        wx.navigateTo({
          url: "/pages/discount/goodFood?id=" + this.id
        });
      }
    },
    //
    detail(k) {
      console.log(k);
      let obj = {};
      obj.id = k;
      if (this.direct == 100) {
        obj.type = 1;
        wx.navigateTo({
          url: "/pages/pintuan/gooddetailspin?id=" + JSON.stringify(obj)
        });
      } else {
        obj.type = 0;
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      }

      // else if (this.direct == 200) {
      //   obj.type = 2;
      //   wx.navigateTo({
      //     url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
      //   });
      // } 
     
    },
    //购物车图标
    shopcart(v) {
      console.log(1);
      if (this.cid == undefined || this.cid=="") {
        this.nouser();
      } else {
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
                title: "添加购物车成功"
              });
              this.getNum();
              // this.donghua = false;
            }
          })
          .catch(res => {});
      }
    }
  }
};
</script>
<style>
.formid {
  border: none;
  outline: none;
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.van-tabs {
  position: fixed;
  top: 50px;
  z-index: 9999;
}
page {
  width: 100%;
  min-height: 100%;
  background: #fafafa;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  display: flex;
  flex-direction: column;

  // background: #fff;

  // margin-top: 0.5rem;
  h3 {
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    color: #333;
    // background: rgb(250, 250, 250);
  }

  .list-box {
    width: 100%;

    // background:#eee;
    li {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      border-bottom: 1px solid #eee;

      img {
        width: 2.5rem;
        height: 1.25rem;
      }

      .list-content {
        width: 70%;
        height: 3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.4rem 0.3rem;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;

        .list-top {
          width: 100%;

          .list-title {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .list-produce {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 0.2rem;
          }
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
            width: 0.5rem;
            height: 0.5rem;
          }
        }
      }
    }
  }

  .list-more {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}

.zhe_p {
  width: 100%;
  line-height: 1rem;
  font-size: 12px;
  color: #999999;
  text-align: center;
  // background: #fff;
}

.head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.2rem;
  box-sizing: border-box;
  background: #72D241;
  z-index: 9999;

  .dian {
    position: absolute;
    top: 24px;
    right: 17px;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    background: red;
  }

  .city {
    width: auto;
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;

    img {
      width: 0.3rem;
      height: 0.4rem;
    }

    span {
      width: 65px;
      font-size: 14px;
      color: #fff;
      margin-left: 0.1rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .search {
    width: 60%;
    height: 36px;
    border-radius: 50px;
    background: rgb(169, 228, 138);
    display: flex;
    align-items: center;
    padding-left: 15px;
    margin-left: 5px;

    // justify-content: center;
    img {
      width: 0.3rem;
      height: 0.3rem;
    }

    input {
      width: 60%;
      font-size: 14px;
      color: #fff;
      background: none;
      border: none;
      margin-left: 0.2rem;
    }
  }

  .message {
    flex: 1;
    margin-left: 0.1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    img {
      width: 0.3rem;
      height: 0.4rem;
    }
  }
}

.contain {
  width: 100%;
}

.wrapper {
  width: 100%;

  // height: auto;
  .swipe {
    width: 100%;
    height: 180px;
  }

  .navs {
    width: 100%;
    display: flex;
  }

  .slide-box {
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

    .slide-list {
      width: 100%;
      display: flex;
      min-height: 5.5rem;
    }
  }
}
</style>
