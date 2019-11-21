<template>
  <div class="box">
    <ul>
      <li class="list" v-for="(v,k) in dataList" :key="k" @click="details(v.orderid)">
        <h5 style="background:#fff">订单编号:{{v.orderid}}</h5>
        <van-card
          thumb-mode="scaleToFill"
          :num="v.number"
          :price="v.amount"
          :desc="v.skuName"
          :title="v.productName"
          :thumb="v.productImage"
        />
        <h3 style="background:#fff">总共￥{{v.finalPay}}</h3>
      </li>
    </ul>
    <div class="no" v-if="show">暂无数据</div>
    <div class="loading" v-if="more">
      <span>没有更多了</span>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
export default {
  data() {
    return {
      leaderid: "",
      page: 1,
      totalPage: 1,
      dataList: [],
      more: false,
      show: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "今日收益"
    });
    this.dataList = [];
    this.leaderid = options.id;
    this.loading();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      this.loading();
    } else {
      this.more = true;
    }
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  //方法集合
  methods: {
    loading() {
      this.show = false;
      let parmas = {
        cmd: "toDayEffectiveOrder",
        pageNow: this.page,
        leaderid: this.leaderid
      };
      console.log(parmas);
      Request.postRequest(parmas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            if (res.dataList.length == 0) {
              this.show = true;
            } else {
              for (let i in res.dataList) {
                this.dataList.push(res.dataList[i]);
              }
            }
          }
        })
        .catch(err => {});
    },
    details(id) {
      console.log(id);
      let obj = { direct: 1, id: id };
      wx.navigateTo({
        url: "/pages/order/shequorderdetial?id=" + JSON.stringify(obj)
      });
    }
  },
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
  //生命周期 - 更新之前
  beforeUpdate() {},
  //生命周期 - 更新之后
  updated() {},
  //生命周期 - 销毁之前
  beforeDestroy() {},
  //生命周期 - 销毁完成
  destroyed() {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style>
page {
  width: 100%;
  min-height: 100%;
  background: #eee;
}
</style>
<style scoped>
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
.box {
}
.list {
  margin-top: 10px;
}
.list h5,
.list h3 {
  padding: 0 15px;
  font-size: 14px;
  line-height: 30px;
}
.list h3 {
  text-align: right;
}
</style>