<template>
  <div class="list">

      <div class="search">
        <div class="search_input">
        <input confirm-type="search" v-model="keywords" placeholder="请输入商品名称" @confirm="goSearch">
      </div>
      <span @click="goSearch">搜索</span>
      </div>
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
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="beginLoading"
            :offset="10"
            v-if="!show"
          >
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="showList"></recommendfen>
            <!-- </van-pull-refresh> -->
          </van-list>
        </van-tab>
        <van-tab title="好评优先">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="beginLoading"
            :offset="10"
            v-if="!show"
          >
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="showList"></recommendfen>
            <!-- </van-pull-refresh> -->
          </van-list>
        </van-tab>
        <van-tab title="价格优先">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="beginLoading"
            :offset="10"
            v-if="!show"
          >
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="showList"></recommendfen>
            <!-- </van-pull-refresh> -->
          </van-list>
        </van-tab>
        <van-tab title="销量优先">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="beginLoading"
            :offset="10"
            v-if="!show"
          >
            <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
            <recommendfen :recommend="showList"></recommendfen>
            <!-- </van-pull-refresh> -->
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
    <div class="no" v-if="show">暂没有搜索的商品</div>
  </div>
</template>

<script>
import recommendfen from "@/components/recommendfen";
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
      ink: "",
      keywords:'',
      sid:''
    };
  },
  components: {
    recommendfen
  },
  onLoad(options) {
    if(options.id){
      this.keywords =JSON.parse(options.id).key;
      this.sid=JSON.parse(options.id).sid;

    }
    console.log(this.keywords);
  },
  mounted() {
    this.initDta(this.keywords);
  },
  computed: {
    showList() {
      return this.list;
    }
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  methods: {
    initDta(keywords) {
      this.list=[];
      let Category = {
        cmd: "selectGoodsByName",
        orderType: this.sorts,
        sid:this.sid,
        name: keywords,
        pageNow: this.page,
        flag:'1'
      };
      console.log(Category);
      Request.postRequest(Category)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.text = res.categoryName;
            this.totalPage = res.totalPage;
            if (this.page <= res.totalPage) {
              for (var i = 0; i < res.dataList.length; i++) {
                this.list.push(res.dataList[i]);
              }
            }else if (res.dataList.length== 0) {
            this.show = true;
          }
          } 
        })
        .catch(res => {});
    },
     goSearch() {
      console.log(this.keywords ,"....."+this.value)

      if (this.keywords == "") {
        wx.showToast({
          title: "搜索内容不能为空",
          icon:'none'
        });
        return;
      } else {
        this.initDta(this.keywords);
      }
    },

    beginLoading() {
      if (this.page < this.totalPage) {
        this.page += 1;
        this.initDta(this.keywords);
      } else {
        wx.showToast({
          title: "没有更多了",
          icon:'none'
        });
      }
    },
    sort(k) {
      if (k.target.index==undefined) {
        return false;
      } else {
        this.sorts = k.target.index;
        this.clear();
        this.initDta(this.keywords);
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
.search{
   width: 100%;
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
     .search_input {
      width: 60%;
      background:#e5e5ee;
      input{
        width:100%;
        height:30px;
        padding-left:10px;
        font-size:13px;
     
      }
    }

    span {
      font-size: 14px;
      color: #333;
      margin-left:20px;
    }
}

</style>
