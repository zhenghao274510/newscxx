<template>
  <div class="list">
    <div class="search">
      <div class="type" @click.stop="showChose=true">
        {{options[value].text}}
        <img src="/static/img/down.png" v-if="!showChose" />
        <img src="/static/img/up.png" v-else />
        <!-- 下拉 菜单 -->
        <ul v-if="showChose" class="chose_muen">
          <li
            v-for="(v,k) in options"
            :key="k"
            @click.stop="choseStyle(k)"
            :class="{'active':value==index}"
          >{{v.text}}</li>
        </ul>
      </div>

      <div class="search_input">
        <input confirm-type="search" v-model="keywords" placeholder="请输入关键字" @confirm="goSearch" />
      </div>
      <span @click="goSearch">搜索</span>
    </div>
    <div class="history">
      <div class="h_box">
        <span>历史搜索</span>
        <img src="/static/img/delete.png" alt @click="remove" />
      </div>
      <ul class="h_list">
        <li v-for="(item,index) in searchList" :key="index" @click="goSearchs(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";

export default {
  data() {
    return {
      showChose: false,
      value: 0,
      keywords: "",
      options: [
        {
          value: 1,
          text: "商品"
        },
        {
          value: 2,
          text: "商家"
        }
      ],
      searchList: []
    };
  },
  created() {},
  mounted() {
    this.shou();
  },
  onShow() {
    this.keywords = "";
  },
  methods: {
    choseStyle(ind) {
      console.log(ind);
      this.value = ind;
      this.showChose = false;
    },
    remove() {
      let self = this;
      console.log(11);
      wx.removeStorage({
        key: "search",
        success(res) {
          self.searchList = [];
        }
      });
      // wx.removeStorageSync("search");
    },
    shou() {
      console.log(wx.getStorageSync("search"));
      if (wx.getStorageSync("search")) {
        this.searchList = JSON.parse(wx.getStorageSync("search")).val;
        console.log(this.searchList);
      }
    },
    goSearch() {
      console.log(this.keywords, "....." + this.value);

      if (this.keywords == "") {
        wx.showToast({
          title: "搜索内容不能为空",
          icon: "none"
        });
        return;
      } else {
        let key=this.keywords.trim();
        let shop = { val: [] };
        for (let i in this.searchList) {
          if (this.searchList[i]==key) {
             this.searchList.splice(i,1);
          }
        }
        this.searchList.unshift(key);

        shop.val = this.searchList;
        wx.setStorageSync("search", JSON.stringify(shop));
        if (this.value == 0) {
          wx.navigateTo({
            url: "/pages/search/search_product?id=" + key
          });
        } else {
          wx.navigateTo({
            url: "/pages/search/search_shop?id=" + key
          });
        }
      }
    },
    goSearchs(val) {
      console.log(val);
      if (this.value == 0) {
        wx.navigateTo({
          url: "/pages/search/search_product?id=" + val
        });
      } else if (this.value == 1) {
        wx.navigateTo({
          url: "/pages/search/search_shop?id=" + val
        });
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// @import '../common/stylus/variable';
.list {
  width: 100%;

  .search {
    width: 100%;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 0.3rem;
      height: 0.5rem;
    }

    .type {
      width: 24%;
      height: 30px;
      padding: 0 5px;
      margin-left: 0.4rem;
      background: #F5F5F5;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      box-sizing: border-box;

      img {
        width: 15px;
        height: 15px;
      }

      .chose_muen {
        position: absolute;
        bottom: -70px;
        left: 0;
        background: #fff;
        width: 100%;
        box-shadow: 0 4px 4px #ccc;

        li {
          line-height: 30px;
          text-align: center;
          font-size: 14px;
        }
      }
    }

    .search_input {
      width: 57%;
      background: #e5e5ee;

      input {
        width: 100%;
        height: 30px;
        padding-left: 10px;
        font-size: 13px;
      }
    }

    span {
      margin-left: 5px;
      font-size: 14px;
      color: #333;
      z-index: 99;
    }
  }

  .history {
    width: 100%;
    padding: 0.1rem 0.4rem;
    box-sizing: border-box;
    border-top: 1px solid #eee;

    .h_box {
      width: 100%;
      padding: 0 0.1rem 0 0.2rem;
      box-sizing: border-box;
      border-left: 4px solid #6ed240;
      height: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 14px;
        color: #999;
      }

      img {
        width: 0.3rem;
        height: 0.4rem;
      }
    }

    .h_list {
      width: 100%;
      display: flex;
      margin-top: 0.1rem;
      flex-wrap: wrap;

      li {
        padding: 0 10px;
        height: 0.4rem;
        line-height: 0.4rem;
        background: #F7F8FA;
        border-radius: 10px;
        font-size: 14px;
        color: #333;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
