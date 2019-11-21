<template>
  <div class="list">
    <div class="shop">
      <van-tabs
        v-model="active"
        color="rgb(114,209,65)"
        title-active-color="rgb(114,209,65)"
        @click="sort"
        @change="sort"
        :swipeable="true"
        :sticky="true"
      >
        <van-tab title="综合排序">
          <recommendfen :recommend="list"></recommendfen>
        </van-tab>
        <van-tab title="好评优先">
          <recommendfen :recommend="list"></recommendfen>
        </van-tab>
        <van-tab title="价格优先">
          <recommendfen :recommend="list"></recommendfen>
        </van-tab>
        <van-tab title="销量优先">
          <recommendfen :recommend="list"></recommendfen>
        </van-tab>
      </van-tabs>
    </div>
    <div class="no" v-if="show">没有更多了</div>
  </div>
</template>

<script>
import Recommendfen from "@/components/recommendfen";
import Request from "@/common/js/request";

export default {
  data() {
    return {
      active: 0,
      list: [],
      isLoading: false,
      loading: false,
      finished: false,
      sorts: 0,
      page: 1,
      totalPage: "",
      show: false,
      recommend: [],
      id: "",
      ink: ""
    };
  },
  components: {
    Recommendfen
  },
  onLoad(options) {
    this.list = [];
    console.log(options);
    this.id = JSON.parse(options.id).id;
    wx.setNavigationBarTitle({
      title: JSON.parse(options.id).name
    });
    this.initDta();
    // console.log(this.id);
  },
  mounted() {},
  //  上拉刷新
  onPullDownRefresh() {
    this.initDta();
  },
  onReachBottom() {
    console.log("到底了");
    // let self=this;
    console.log(this.page, this.totalPage);
    if (this.page < this.totalPage) {
      this.page += 1;
      this.initDta();
    } else {
      this.show = true;
    }
  },

  methods: {
    initDta() {
      this.show=false;
      let Category = {
        cmd: "selectGoodsByCategory",
        orderType: this.sorts,
        id: this.id,
        pageNow: this.page
      };
      console.log(Category);
      Request.postRequest(Category)
        .then(res => {
          console.log(res);
          this.totalPage = res.totalPage;

          if (res.result == 0) {
            if (res.dataList.length > 0) {
              this.show = false;
              // if (this.page <= res.totalPage) {
              for (var i = 0; i < res.dataList.length; i++) {
                this.list.push(res.dataList[i]);
              }
            } else if (res.dataList !== undefined || res.dataList.length == 0) {
              this.show = true;
            }
          }
          // }
        })
        .catch(res => {});
    },
    //  分享
    onShareAppMessage() {
     return this.$share.share()
   },

    sort(k) {
      if (k.target.index == undefined) {
        return false;
      } else {
        this.sorts = k.target.index;
        this.clear();
        this.initDta();
      }
      console.log(k.target.index);
      // let self = this;
    },
    clear() {
      this.list = [];
      this.page = 1;
      this.finished = false;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.no {
  width: 100%;
  height: 100%;
  // position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  height: 1.2rem;
  // top: 124px;
  // left: 0;
  // bottom: 0;
  z-index: 999;
}

.van-tabs__wrap {
  position: fixed !important;
  top: 0;
}

.list {
  width: 100%;

  .shop {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
