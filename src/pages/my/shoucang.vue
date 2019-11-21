<template>
  <div class="list">
    <div class="store">
      <van-tabs
        :active="active"
        color="rgb(114,209,65)"
        title-active-color="rgb(114,209,65)"
        @change="sort"
        :swipeable="true"
        :sticky="true"
      >
        <van-tab title="商品收藏">
          <recommends :recommend="recommends" v-if="recommends.length>0"></recommends>
          <div v-else class="kong">暂无收藏</div>
        </van-tab>
        <van-tab title="店铺收藏">
          <shops :dataList="dataList" v-if="dataList.length>0"></shops>
          <div v-else class="kong">暂无收藏</div>
        </van-tab>
      </van-tabs>
      <div class="loading" v-if="more">
        <span>没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script>
import Recommends from "@/components/recommends";
import Shops from "@/components/shops";
import Request from "@/common/js/request";

export default {
  data() {
    return {
      donghua: false,
      text: "我的收藏",
      active: 0,
      list: [],
      isLoading: false,
      loading: false,
      finished: false,
      sorts: 0,
      page: 1,
      show: false,
      recommends: [],
      dataList: [],
      cid: "",
      page: 1,
      totalPage: 1,
      more: false
    };
  },
  onLoad() {
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      wx.setNavigationBarTitle({
      title: "我的收藏"
    });
  },
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
  computed: {
    showList() {
      return this.list;
    }
  },
  components: {
    Recommends,
    Shops
  },
  mounted() {
    if (this.active == 0) {
      this.beginLoading();
    } else {
      this.onLoads();
    }
  },
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      if (this.active == 0) {
        this.beginLoading();
      } else {
        this.onLoads();
      }
    } else {
      this.more = true;
    }
  },

  methods: {
    clear() {
      this.page = 1;
      this.recommends = [];
      this.dataList = [];
    },
    sort(e) {
      console.log(e);
      let k = e.mp.detail.index;
      this.clear();
      if (k == 0) {
        this.beginLoading();
      } else {
        this.onLoads();
      }
    },
    beginLoading() {
      let datas = {
        cmd: "goodsCollection",
        cid: this.cid,
        pageNow: this.page
      };
      Request.postRequest(datas)
        .then(res => {
          // console.log(res.data.dataList);
          if (res.result == 0) {
            for (let i in res.dataList) {
              this.recommends.push(res.dataList[i]);
            }
    
            console.log(this.recommends);
          }
        })
        .catch(res => {});
    },
    onLoads() {
      let datas = {
        cmd: "shopCollection",
        cid: this.cid,
        pageNow: this.page
      };
      Request.postRequest(datas)
        .then(res => {
          // console.log(res.data.dataList);
          if (res.result == 0) {
            for (let s in res.dataList) {
              res.dataList[s].star = Number(res.dataList[s].stars);
              this.dataList.push(res.dataList[s]);
            }
            console.log(this.dataList);
            // localStorage.setItem("storeshop", JSON.stringify(this.dataList));
          }
        })
        .catch(res => {});
    }
  }
};
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  height: 100%;

  .store {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
  }

  .van-tab__pane {
    height: 12rem;
  }

  .van-tabs {
    height: 100%;

    .van-tabs__content {
      height: 80%;

      .van-list {
        height: 100%;

        .van-pull-refresh {
          height: 100%;
        }
      }
    }
  }
}

.kong {
  text-align: center;
  font-size: 14px;
  color: #333;
  margin-top: 70px;
}
</style>
