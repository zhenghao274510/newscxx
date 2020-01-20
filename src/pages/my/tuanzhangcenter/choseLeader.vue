<template>
  <div class="box">
    <ul>
      <li v-for="(v,k) in dataList" :key="k" @click="confircom(v)">
        <div class="servce-list-left">
          <img :src="v.image" alt class="img" />
        </div>
        <div class="servce-list-middle">
          <p class="name">{{v.name}}</p>
          <p>{{v.neighbor}}</p>
        </div>
        <div class="servce-list-right name" v-if="v.spacing<1">{{v.spacing*1000}}m</div>
        <div class="servce-list-right name" v-else>{{v.spacing}}Km</div>
      </li>
    </ul>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
export default {
  data() {
    return {
      dataList: [],
      page: 1,
      totalPage: 1
    };
  },

  // invertCode
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad() {
    this.point = JSON.parse(wx.getStorageSync("point"));
    console.log(this.point);
    this.loadData();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    confircom(e) {
      wx.setStorageSync('leaderInfo', JSON.stringify(e));
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        });
          
      },30)
    },
    loadData() {
      let parmas = {
        cmd: "nearbyGroupleader",
        lon: this.point.longitude,
        lat: this.point.latitude,
        pageNow: this.page
      };
      console.log(parmas);
      Request.postRequest(parmas)
        .then(res => {
          res.result == 0
            ? ((this.totalPage = res.totalPage),
              res.dataList.forEach(item => {
                item.spacing = (Math.round(item.spacing / 100) / 10).toFixed(1);
                this.dataList.push(item);
              }))
            : wx.showToast({
                title: res.resultNote
              });
        })
        .catch(err => {});
    }
  },
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      this.loadData();
    } else {
      this.more = true;
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
<style scoped>
.box {
  padding: 20px 15px;
}
.box ul {
}
.box ul li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  margin-bottom: 10px
}
.servce-list-left {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
}
.img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.servce-list-middle {
  flex: 1;
}
.servce-list-middle p {
  font-size: 12px;
  color: #222222;
}
.name {
  font-size: 13px;
  font-weight: bold;
}
.servce-list-right {
  padding: 0 5px;
}
</style>