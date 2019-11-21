<template>
  <div class="list" ref="list">
    <div class="search" ref="search">
      <div class="search_input">
        <van-search placeholder="请输入商品名称" @change="onChange" />
      </div>
      <span @click="goSearch">搜索</span>
    </div>
    <shop-header
      ref="shop"
      @goCoupon="goCoupon"
      :dataList="shopList"
      :store="store"
      @stores="stores"
    ></shop-header>
    <div class="line" ref="line"></div>
    <ul class="fenlei">
      <li
        :class="{'add':laia==index}"
        v-for="(item,index) in titleList"
        :key="index"
        @click="shopper(index)"
      >{{item}}</li>
    </ul>
    <div
      class="cascad-menu"
      ref="cascadMenu"
      v-if="laia==0"
      :class="ai==true?'cascad-menua':'cascad-menus'"
    >
      <scroll-view ref="leftMenu" scroll-y class="left-menu">
        <div class="left-menu-container">
          <ul>
            <li
              class="left-item"
              ref="leftItem"
              @click="selectLeft(index)"
              v-for="(menu, index) in list"
              :class="{'current': actindex === index}"
              :key="index"
            >
              <p class="text">{{menu.categoryName}}</p>
            </li>
          </ul>
        </div>
      </scroll-view>
      <scroll-view class="right-menu" @scroll="scrollHeight" :scroll-into-view="contentId" scroll-y>
        <div class="right-menu-container">
          <ul>
            <li class="right-item" v-for="(menu,i) in list" :key="i" :id="'con_'+i">
              <div class="title">{{menu.categoryName}}</div>
              <ul>
                <li v-for="(item, j) in menu.productList" :key="j" @click="goGoods(item)">
                  <div class="data-wrapper">
                    <img :src="item.image" alt />
                    <div class="s_right">
                      <div class="s_top">
                        <span class="shop_name">{{item.name}}</span>
                        <span style="color:#999" class="shop_num">已售：{{item.soldNumber}}份</span>
                      </div>
                      <p>{{item.describe}}</p>
                      <div class="s_price">
                        <span>￥{{item.price}}</span>
                        <span
                          style="text-decoration: line-through;color: #999;margin-left: 0.2rem;"
                        >￥{{item.originalPrice}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <div style="height:20px"></div>
            </li>
          </ul>
        </div>
      </scroll-view>
    </div>
    <div v-if="laia==1" style="margin-top:20px;">
      <div class="rate" ref="rates">
        <div class="r_left">
          <span style="font-size: 40px">{{stars}}</span>
          <span>综合评分</span>
        </div>
        <div class="r_right">
          <span>商品评分：</span>
          <van-rate :value="star" disabled disabled-color="rgb(255,210,30)" />
        </div>
      </div>
      <div class="comment">
        <!-- <scroll-view :on-infinite="infinite" > -->
        <div class="c_dis">
          <div class="c_item" v-for="(v,k) in userComments" :key="k">
            <img :src="v.headImage" alt class="img" />
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
              <div class="c_img" v-if="v.images.length > 0">
                <img :src="imgs" v-for="imgs in v.images" alt :key="imgs" />
              </div>
            </div>
          </div>
        </div>
        <div class="loading" v-if="more">
          <span>没有更多了</span>
        </div>
        <!-- </scroll-view> -->
        <div class="noComment" v-if="noComments">
          <div style="padding-top:50px;">
           暂没有该商家的评论
          </div>
          
          </div>
      </div>
    </div>
    <div class="s_shop" v-if="laia==2">
      <div class="shop_box" ref="shopping">
        <div class="self_box" ref="shopper">
          <div v-for="(v,k) in shops" :key="k">
            <div class="self_top">
              <h3 class="shop_zi">商家环境</h3>
              <div class="self_img">
                <img :src="img" v-for="(img,index) in v.imglist" alt :key="index" />
              </div>
              <p>{{v.introduction}}</p>
            </div>
            <ul>
              <li>
                <div class="self_name shop_zi">商家名称</div>
                <div class="self_content">{{v.name}}</div>
              </li>
              <li>
                <div class="self_name shop_zi">商家地址</div>
                <div class="self_content">{{v.address}}</div>
              </li>
              <li>
                <div class="self_name shop_zi">商家电话</div>
                <div class="self_content">{{v.mobile}}</div>
              </li>
            </ul>
            <div class="self_top" style="border-bottom:none">
              <h3 class="shop_zi">营业资质</h3>
              <div class="self_img">
                <img :src="item" v-for="(item,index) in v.businessLicence" alt :key="index" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShopHeader from "@/components/shopHeader";
import Request from "@/common/js/request";
// import Scroll from "@/components/scroll1";
export default {
  data() {
    return {
      titleList: ["商品", "评价", "商家"],
      ai: false,
      more: false,
      laia: 0,
      page: 1,
      totalPage: 5,
      star: 0,
      stars: 0,
      list: [],
      active: 0,
      value1: "",
      shopList: [],
      store: "1",
      dataLists: [],
      noComments: false,
      comments: [],
      userComments: [],
      shops: [],
      cPage: 1,
      cTotalPage: 3,
      cateId: "",
      user: "",
      shopID: "",
      id: "",

      //  两栏联动数据
      contentId: "",
      actindex: 0,
      navulHeight: 0, // 导航里ul高度
      navItemHeight: 0, // 每个导航高度
      listHeight: [], // foods内部块的高度
      contentHeight: [], // 内容区域scroll-view高度
      timer: null
    };
  },
  onLoad(options) {
    this.clear();
    this.id = options.id;
    this.init();
    console.log(this.id);
    this.laia = 0;
  },
  onShow() {
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }
  },
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
  components: {
    ShopHeader
  },
  onReachBottom() {
    if (this.laia == 1) {
      console.log("到底了");
      console.log(this.cPage, this.cTotalPage);
      if (this.cPage < this.cTotalPage) {
        this.cPage += 1;
        this.infinite();
      } else {
        this.more = true;
      }
    }

    // let self=this;
  },
  methods: {
    onChange(e) {
      this.value1 = e.mp.detail;
      console.log(this.value1);
    },
    //  搜索商品
    goSearch() {
      if (this.value1 == "") {
        wx.showToast({
          title: "搜索内容不能为空",
          icon: "none"
        });
      } else {
        let obj = {
          sid: this.id,
          key: this.value1
        };
        wx.navigateTo({
          url: "/pages/search/shopsearchprod?id=" + JSON.stringify(obj)
        });
      }
    },
    init() {
      this.shopList = [];
      let self = this;
      let datas = {
        cmd: "enterShopInfo",
        sid: this.id,
        cid: this.cid,
        flag: "1"
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res, "商家信息");
          if (res.result == 0) {
            this.shopID = res.id;
            res.star = Number(res.stars);
            self.shopList.push(res);
            if (res.coupon.id == undefined) {
              self.ai = true;
            } else {
              self.ai = false;
            }
            console.log(self.ai);
            self.user = res.name;
            if (res.collect) {
              self.store = "0";
            } else {
              self.store = "1";
            }
            self.bgeinLoading();
          }
        })
        .catch(res => {});
    },
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
          }
        }
      });
    },
    stores() {
      if (this.cid == undefined) {
        this.nouser();
      } else {
        if (this.store == "1") {
          this.store = "0";
        } else if (this.store == "0") {
          this.store = "1";
        }
        let datas = {
          cmd: "collectShop",
          sid: this.id,
          cid: this.cid,
          type: this.store
        };
        Request.postRequest(datas)
          .then(res => {
            if (res.result == 0) {
              if (this.store == 0) {
                wx.showToast({
                  title: "收藏成功"
                });
              } else {
                wx.showToast({
                  title: "取消收藏",
                  icon: none
                });
              }
            }
          })
          .catch(res => {});
      }
    },
    clear() {
      this.actindex = 0;
      this.contentId = "";
      this.navulHeight = 0;
      this.navItemHeight = 0;
      this.listHeight = [];
      this.contentHeight = [];
    },
    goCoupon(id) {
      console.log(id);
      if (this.cid == undefined) {
        this.nouser();
      } else {
        let params = {
          id: id,
          name: this.user
        };
        wx.navigateTo({
          url: "./youhuijuan?params=" + JSON.stringify(params)
        });
      }
    },
    goGoods(e) {
      console.log(e);
      if (e.type == 1) {
        wx.navigateTo({
          url: "/pages/pintuan/gooddetailspin?id=" + JSON.stringify(e)
        });
      } else {
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(e)
        });
      }
    },
    bgeinLoading() {
      let datas = {
        cmd: "selectShopGoods",
        id: this.cateId,
        sid: this.shopID,
        pageNow: this.page
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res.dataList);
          if (res.result == 0) {
            if (res.dataList != undefined) {
              this.list = res.dataList;
              if (this.list.length != 0) {
                setTimeout(() => {
                  this.calculateHeight();
                }, 100);
              }
            }
          }
        })
        .catch(res => {});
    },
    infinite() {
      let self = this;
      let datas = {
        cmd: "evaluateShopGoods",
        id: this.id,
        pageNow: this.cPage
      };
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            self.star = Number(res.average);
            self.stars = res.average;
            self.cTotalPage = res.totalPage;
            if (res.dataList.length == 0) {
              self.noComments = true;
            } else {
              for (let i in res.dataList) {
                // res.dataList[i].star = Number(res.dataList[i].stars);
                self.userComments.push(res.dataList[i]);
                console.log(self.userComments);
              }
            }
          }
        })
        .catch(res => {});
    },
    shopper(ind) {
      // this.clear();
      if (this.laia == ind) {
        return;
      } else {
        this.userComments = [];
        switch (ind) {
          case 0:
            this.laia = 0;
            break;
          case 1:
            if (this.laia != 1) {
              this.laia = 1;
              this.infinite();
            } else {
              return false;
            }
            break;
          case 2:
            if (this.laia != 2) {
              this.laia = 2;
              this.getShopinfo();
            } else {
              return false;
            }
            break;
        }
      }
    },
    getShopinfo() {
      let self = this;
      self.shops = [];
      let datas = {
        cmd: "businessInfo",
        id: self.id
      };
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            self.shops.push(res);
            for (var i in self.shops[0].images) {
              var arr = self.shops[0].images[i].split("|");
              let arrlist = {};
              arrlist = arr[0];
              console.log(arrlist);
              var imglist = [];
              imglist.push(arrlist);
              self.shops[0].imglist = imglist;
            }
          }
        })
        .catch(res => {});
    },
    // changeShop(ind, id) {
    //   this.itemIndex = ind;
    //   this.cateId = id;
    //   this.clear();
    //   this.bgeinLoading();
    // },
    selectLeft(index) {
      this.actindex = index;
      this.contentId = `con_${index}`;
    },
    scrollHeight(e) {
      // this.contentId = ''
      let scrollTop = e.target.scrollTop;
      // console.log(scrollTop)
      let length = this.listHeight.length;
      if (scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
        return;
      } else if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
        this.actindex = 0;
      }
      for (let i = 0; i < length; i++) {
        if (
          scrollTop >= this.listHeight[i - 1] &&
          scrollTop < this.listHeight[i]
        ) {
          this.actindex = i;
        }
      }
    },
    calculateHeight() {
      //  创建查询对象
      this.clear();
      var query = wx.createSelectorQuery();
      let h = 0;
      // if (this.listHeight.length!= 0) {
      query.selectAll(".right-item").boundingClientRect(rects => {
        console.log(rects);
        rects.forEach(rect => {
          h += rect.height;
          this.listHeight.push(h);
        });

        console.log(this.listHeight);
      });
      query.select(".right-menu").boundingClientRect(rect => {
        console.log(rect);

        this.contentHeight = rect.height;
      });
      query.select(".left-menu").boundingClientRect(rect => {
        this.navulHeight = rect.height;
      });
      query
        .select(".left-item")
        .boundingClientRect(rect => {
          this.navItemHeight = rect.height;
        })
        .exec();
      // }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.noComment {
  width: 100%;
  height: 100%;
  position: absolute;
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

.list {
  width: 100%;
  height: 100%;

  .search {
    width: 100%;
    padding: 0 0.2rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;

    img {
      width: 0.3rem;
      height: 0.5rem;
    }

    .search_input {
      width: 80%;
      margin-right: 16px;
    }

    span {
      font-size: 14px;
      color: #333;
    }
  }

  .s_product {
    width: 100%;
    position: relative;

    .s_nav {
      width: 25%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      background: #f5f5f5;

      ul {
        width: 100%;

        li {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          color: #333;
        }
      }
    }

    .s_list {
      width: 75%;
      position: absolute;
      top: 0;
      left: 25%;
      bottom: 0;
      overflow: hidden;
    }
  }

  .fenlei {
    display: flex;
    justify-content: space-around;
    font-size: 18px;

    .add {
      border-bottom: 2px solid green;
      color: green;
    }
  }

  .rate {
    width: 100%;
    height: 90px;
    margin-top: 5px;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .r_left {
      width: 30%;
      height: 70%;
      z-index: 99;
      padding: 0.4rem;
      padding-right: 0;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      color: #333;
      border-right: 2px solid #eee;
    }

    .r_right {
      width: 70%;
      height: 70%;
      padding: 0.4rem;
      padding-left: 0;
      background: #f5f5f5;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #333;
    }
  }

  .comment {
    width: 100%;
    position: relative;

    .c_dis {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 0.4rem;
      box-sizing: border-box;

      .c_item {
        width: 100%;
        padding: 0.4rem 0;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;

        .img {
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

  .s_shop {
    width: 100%;
    min-height: 500px;
    position: relative;
    margin-top: 20px;

    .shop_box {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;

      .self_box {
        width: 100%;
        display: flex;
        flex-direction: column;
        color: #333;

        .self_top {
          width: 100%;
          padding: 0.3rem 0.4rem;
          box-sizing: border-box;
          border-bottom: 12px solid #eee;

          h3 {
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            color: #333;
          }

          .self_img {
            width: 100%;
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            img {
              width: 2.4rem;
              height: 2.4rem;
              margin-right: 0.4rem;
              margin-top: 0.4rem;
            }
          }

          p {
            width: 100%;
            font-size: 12px;
            margin-top: 0.5rem;
            color: #333;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 20px;
          }
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
            font-size: 14px;
            color: #333;
            border-bottom: 1px solid #eee;
            padding: 0.3rem 0.4rem;
            box-sizing: border-box;

            .self_name {
              width: 40%;
            }

            .self_content {
              width: 60%;
              color: #999;
              text-align: right;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}

.shop_zi {
  font-weight: 700;
}

.cascad-menua {
  top: 255px;
}

.cascad-menus {
  top: 335px;
}

.cascad-menu {
  display: flex;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  position: absolute;
  bottom: 0;

  .left-menu {
    flex: 0 0 100px;
    width: 100px;
    background: #f5f5f5;
    z-index: 999;

    .left-item {
      height: 54px;
      width: 100%;
      text-align: center;

      &.current {
        background: #fff;
        color: rgb(114, 209, 65);
        border-left: 4px solid rgb(114, 209, 65);
      }

      .text {
        width: 100%;
        line-height: 54px;
      }
    }
  }

  .right-menu {
    width: 100%;

    .right-item {
      height: 100%;

      .title {
        border-bottom: 1px solid #ccc;
        height: 30px;
        line-height: 35px;
        padding-left: 10px;
      }

      .data-wrapper {
        display: flex;
        align-items: center;
        padding: 0.3rem;
        border-bottom: 1px solid #eee;

        img {
          width: 2rem;
          height: 2rem;
        }

        .s_right {
          width: 160px;
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

            .shop_name {
              width: 50%;
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              height: 20px;
              line-height: 20px;
            }
          }

          p {
            width: 100%;
            display: block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 12px;
            color: #999;
          }

          .s_price {
            width: 100%;
            display: flex;
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>
