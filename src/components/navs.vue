<template>
  <div class="all">
    <div class="contains">
      <div class="nav-item" v-for="(item,index) in datas" :key="index" v-if="index<9">
        <img :src="item.icon" alt @click.stop="classify(item)" lazy-load />
        <span>{{item.name}}</span>
      </div>
      <div class="nav-item xia" @click.stop="fenlei" v-if="datas.length>0">
        <img src="/static/img/tilogo.png" alt lazy-load />
        <span>更多</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      default: []
    },
    direct: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    classify(e) {
      e.direct=this.direct;
      if (this.direct == 100) {
        wx.navigateTo({
          url: "/pages/class/onepinclass?id=" + JSON.stringify(e)
        });
      } else {
        wx.navigateTo({
          url: "/pages/class/oneclass?id=" + JSON.stringify(e)
        });
      }
      console.log(e);
    },
    fenlei() {
      let url = "";
      console.log(this.direct);
      if (this.direct == 100) {
        url = "/pages/tarba/class?id=" + 1;
        // this.$router.replace({path:'/pages/tarba/class',query:{id:1}})
      } else if (this.direct == 200) {
        url = "/pages/tarba/class?id=" + 2;
        // this.$router.replace({path:'/pages/tarba/class',query:{id:2}})
      } else {
        url = "/pages/tarba/class?id=" + 0;
        // this.$router.replace({path:'/pages/tarba/class',query:{id:0}})
      }
      console.log(111);
      wx.reLaunch({
        url: url
      });
      // this.$router.replace({ url
      // });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.all {
  width: 100%;
  position: relative;

  .contains {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;

    .nav-item {
      width: 20%;
      margin-top: 10px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }

      span {
        font-size: 12px;
        color: #666;
        margin-top: 7px;
      }
    }
  }
}
</style>
