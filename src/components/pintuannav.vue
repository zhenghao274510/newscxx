<template>
  <div class="all">
    <div class="contains">
      <div class="nav-item" v-for="(item,index) in datas" :key="index">
        <img :src="item.icon" alt @click.stop="classify(item)" lazy-load />
        <span>{{item.name}}</span>
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
      // if (this.direct == 100) {
        wx.navigateTo({
          url: "/pages/class/onepinclass?id=" + JSON.stringify(e)
        });
      // } else {
      //   wx.navigateTo({
      //     url: "/pages/class/oneclass?id=" + JSON.stringify(e)
      //   });
      // }
      console.log(e);
    },
   
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
