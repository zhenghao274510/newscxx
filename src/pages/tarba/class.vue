<template>
  <div class="contain" ref="list">
    <!-- <div class="head">分类</div> -->

    <div class="top">
      <ul class="head">
        <li
          v-for="(item,index) in title "
          :key="index"
          :class="{'active':activeT==index}"
          @click="changactive(index)"
        >{{item}}</li>
      </ul>
    </div>

    <div class="cascad-menu" ref="cascadMenu" v-if="dataList!=[]">
      <scroll-view class="left-menu" scroll-y>
        <div class="left-menu-container">
          <ul>
            <li
              class="left-item"
              ref="leftItem"
              @click="selectLeft(index, $event)"
              v-for="(menu, index) in dataList"
              :class="{'current': actindex === index}"
              :key="index"
            >{{menu.name}}</li>
          </ul>
        </div>
      </scroll-view>
      <scroll-view class="right-menu" @scroll="scrollHeight" :scroll-into-view="contentId" scroll-y>
        <div class="right-menu-container">
          <ul>
            <li class="right-item" v-for="(menu, i) in dataList" :key="i" :id="'con_'+i">
              <div class="title">{{menu.name}}</div>
              <ul>
                <li v-for="(item, j) in menu.child" :key="j" @click="goGoods(item)">
                  <img :src="item.icon" alt style="width:50px;height:50px;" />
                  <span>{{item.name}}</span>
                </li>
              </ul>
              <div style="height:20px"></div>
            </li>
          </ul>
        </div>
      </scroll-view>
    </div>
    <sec-footer :tabarA="a"></sec-footer>
  </div>
</template>

<script>
import Request from "@/common/js/request";
import secFooter from "@/components/SecFooter"
export default {
  data() {
    return {
      a:1,
      // title: ["精品", "拼团", "拿货团"],
      title: ["精品", "拼团"],
      activeT: 0,
      active: 0,
      dataList: [],
      contentId: "",
      actindex: 0,
      cid: "",
      navulHeight: 0, // 导航里ul高度
      navItemHeight: 0, // 每个导航高度
      listHeight: [], // foods内部块的高度
      contentHeight: [] // 内容区域scroll-view高度
    };
  },
  components: {
    secFooter
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "分类"
    });
    if (options.id != undefined) {
      this.activeT = options.id;
    } else {
      this.activeT = 0;
    }
    this.classify();
  },
  onShow() {
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      if (this.cid != undefined) {
        this.$api.getnum(this.cid);
      }
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
  methods: {
    //   切换数据前  清空  记录
    changactive(ind) {
      if (this.activeT == ind) {
        return;
      } else {
        this.activeT = ind;
        this.classify();
      }
    },
    clear() {
      this.actindex = 0;
      this.navulHeight = 0;
      this.navItemHeight = 0;
      this.listHeight = [];
      this.contentHeight = [];
      this.contentId = "";
    },

    goGoods(e) {
      console.log(e);
      let obj = {
        direct: this.activeT,
        name: e.name,
        id: e.id
      };
      if (this.activeT == 1) {
        wx.navigateTo({
          url: "/pages/class/onepinclass?id=" + JSON.stringify(obj)
        });
      } else {
        wx.navigateTo({
          url: "/pages/class/oneclass?id=" + JSON.stringify(obj)
        });
      }
    },
    classify() {
      let classdata = {
        cmd: "goodsCategory",
        type: this.activeT
      };
      Request.postRequest(classdata)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.dataList = res.dataList;
            if (this.dataList.length != 0) {
              setTimeout(() => {
                this.calculateHeight();
              }, 1000);
            }
          }
        })
        .catch(res => {});
    },
    selectLeft(index, event) {
      this.actindex = index;
      this.contentId = `con_${index}`;
      // this.contentId = `con_${index}`;
    },
    scrollHeight(e) {
      // this.contentId = ''
      let scrollTop = e.target.scrollTop;
      // console.log(scrollTop)
      let length = this.listHeight.length;
      if (scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
        this.actindex = length - 1;
      } else if (scrollTop > 0 && scrollTop < this.listHeight[0]) {
        this.actindex = 0;
      }
      for (let i = 0; i < length; i++) {
        if (
          scrollTop > this.listHeight[i - 1] &&
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
      query.selectAll(".right-item").boundingClientRect(rects => {
        console.log(rects);
        rects.forEach(rect => {
          h += rect.height - 40;
          this.listHeight.push(h);
        });
        // console.log(this.listHeight);
      });
      query.select(".right-menu").boundingClientRect(rect => {
        console.log(rect);
        this.contentHeight = rect.height;
        console.log(this.contentHeight);
      });
      query.select(".left-menu").boundingClientRect(rect => {
        this.navulHeight = rect.height;
      });
      query
        .select(".left-item")
        .boundingClientRect(rect => {
          console.log(rect);
          this.navItemHeight = rect.height;
        })
        .exec();
    }
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
.contain {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // padding: 60px 0 0 0;
  box-sizing: border-box;

  .top {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: #fff;

    .head {
      width: 43%;
      margin: 20px auto;
      // width:100%;
      // padding: 20px 50px 0 50px;
      border: 1px solid #ccc;
      border-radius: 20px;
      box-sizing: border-box;
      height: 33px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      li {
        // padding: 0 25px;
        // border:1px solid transparent; 
        flex:1;
        font-size: 14px;
        border-radius: 20px;
        color: #72D241;
        height: 33px;
        line-height: 33px;
        position: relative;
        border-radius: 20px;
        text-align: center;
      }
      .active {
        background: #72D241;
        color: #fff;
      }
    }
  }

  .category {
    width: 100%;
    border-top: 1px solid #eee;
    box-sizing: border-box;

    .s_product {
      width: 100%;

      .s_nav {
        width: 25%;
        min-height: 800px;
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 40px;
        overflow: hidden;

        ul {
          width: 100%;
          height: 100% !important;
          background: #f5f5f5;

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
        min-height: 500px;
        position: fixed;
        top: 60px;
        left: 25%;
        bottom: 50px;
        overflow: hidden;

        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          padding: 0.4rem;
          box-sizing: border-box;

          li {
            width: 30%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: 2.5%;
            margin-bottom: 0.4rem;
            font-size: 14px;
            color: #333;

            ._img {
              width: 50px !important;
              height: 50px !important;
              margin-bottom: 0.3rem;
            }
          }
        }
      }
    }
  }
}

.cascad-menu {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding-top: 60px;

  .left-menu {
    width: 150px;
    height: 100%;
    background: #f5f5f5;
    z-index: 999;

    .left-item {
      height: 54px;
      width: 100%;
      text-align: center;
      line-height: 54px;
      color: #333;
      font-size: 14px;

      &.current {
        background: #fff;
        color: rgb(114, 209, 65);
        width: 100%;
        border-left: 4px solid rgb(114, 209, 65);
      }
    }
  }

  .right-menu {
    width: 100%;

    .right-item {
      height: 100%;
      // margin-left: -50px;
      padding-left: 0.15rem;
      margin-bottom: 30px;

      .title {
        border-left: 4px solid rgb(114, 209, 65);
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        padding-left: 10px;
        margin: 5px 0;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.2rem;

        li {
          width: 30%;
          display: flex;
          flex-direction: column;
          margin-left: 2.5%;
          align-items: center;
          margin-bottom: 0.2rem;
          font-size: 14px;
          color: #333;

          img {
            width: 1rem;
            height: 1rem;
            margin-bottom: 0.2rem;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
