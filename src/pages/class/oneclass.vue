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
   
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="list"></recommendfen>
            <!-- </van-pull-refresh> -->

        </van-tab>
        <van-tab title="好评优先">
  
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="list" ></recommendfen>
    
        </van-tab>
        <van-tab title="价格优先">
        
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="list" ></recommendfen>
            <!-- </van-pull-refresh> -->
        </van-tab>
        <van-tab title="销量优先">

            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="list" ></recommendfen>
            <!-- </van-pull-refresh> -->
        </van-tab>
      </van-tabs>
    </div>
    <div class="no" v-if="show">暂没有搜索的商品</div>
     <div class="loading" v-if="more">
            <span>没有更多了</span>
          </div>
  </div>
</template>

<script>
import Recommendfen from "@/components/recommendfen";
import Request from "@/common/js/request";

export default {
  data() {
    return {
      text: "分类名称",
      active: 0,
      list: [],
      sorts: 0,
      page: 1,
      totalPage: "",
      show: false,
      recommend: [],
      id: "",
      ink: "",
      direct:1,
      more:false
    };
  },
  components: {
    Recommendfen
  },
  onLoad(options) {
    this.list=[];
    this.id =JSON.parse(options.id).id;
    this.direct=JSON.parse(options.id).direct;
     wx.setNavigationBarTitle({
      title: JSON.parse(options.id).name
    });
      this.initDta();
    console.log(this.id);
  },
  computed: {
    showList() {
      return this.list;
    }
  },
   onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page+=1;
      this.initDta();
    } else {
      this.more = true;
    }
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  methods: {
    initDta() {
      // this.list=[];
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
          if (res.result == 0) {
            this.totalPage = res.totalPage;
              for (var i = 0; i < res.dataList.length; i++) {
                res.dataList[i].type=this.direct;
                this.list.push(res.dataList[i]);
              }
              if(res.dataList.length==0){
                this.show=true;
              }
          }
        })
        .catch(res => {});
    },
    sort(k) {
      if (k.target.index==undefined) {
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
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  top: 124px;
  left: 0;
  bottom: 0;
  z-index: 999;
}

.van-tabs__wrap {
  position: fixed !important;
  top: 40px;
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
