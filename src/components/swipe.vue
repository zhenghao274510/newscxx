<template>
  <div class="box">
    <swiper :autoplay="3000" indicator-active-color="white" indicator-color="#ccc"  circular="true" :height="200" indicator-dots="true">
      <swiper-item
        v-for="(image, index) in images"
        :key="index"
      >
        <img class="imgs" :src="image.image" @click.stop="imgurl(image,image.type,image.content)" lazy-load   mode='scaleToFill' />
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: [],
      oneX: "",
      twoX: ""
    }
  },
  data() {
    return {};
  },

  methods: {
    imgurl(item,type,text){
wx.setStorageSync("url", text);
        
      console.log(item,type,text)
      if(type==0){
        wx.navigateTo({
          url:'/pages/upSet/fuwen'
        })
      }else if(type==1){
        wx.navigateTo({
          url:'/pages/shopdetails/index?id='+text.split('=')[1]
        })
      }else{
          wx.navigateTo({
          url:'/pages/Good/gooddetials?id='+text.split('=')[1]
        })
      }
    }
    // imgurl(type, txt) {
    //   if (this.oneX == this.twoX) {
    //     //当滑动距离等于0时触发点击事件
    //     console.log(type, txt);
    //     if (type == 0) {
    //       this.$router.push({
    //         name: "Fuwen",
    //         params: {
    //           id: txt
    //         }
    //       });
    //     } else if (type == 1) {
    //       this.$router.push({
    //         name: "shop_detailfirst",
    //         params: {
    //           id: txt
    //         }
    //       });
    //     } else {
    //       this.$router.push({
    //         name: "goods_detailsx",
    //         params: {
    //           id: txt
    //         }
    //       });
    //     }
    //   }
    // }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.imgs {
  width: 375px;
  touch-action: none;
  height: 100%;
}
</style>
