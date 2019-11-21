<template>
  <div class="list">
    <ul>
      <li v-for="(v,k) in dataList" :key="k" @click="goShopx(v.id)">
        <img :src="v.image" alt lazy-load />
        <div class="list-shop">
          <div class="shop-top">
            <h3>{{v.name}}</h3>
            <!--  -->
            <span v-if="v.spacing<1">{{v.spacing*1000}}m</span>
            <span v-else>{{v.spacing}}km</span>
          </div>
          <div class="shop-star">
            <van-rate
              v-model="v.star"
              disabled
              disabled-color="rgb(255,164,20)"
              allow-half
              :size="12"
            />
            <span>{{v.stars}}</span>
            <span style="margin-left: 0.3rem">月销:{{v.monthlySale}}</span>
          </div>
          <p>{{v.describe}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  methods: {
     goShopx(id) {
      console.log(id + "goShopx");
      wx.navigateTo({
        url: "/pages/shopdetails/index?id=" + id
      });
      // this.$emit("goShopx", id);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.list {
  width: 100%;

  ul {
    width: 100%;

    li {
      width: 100%;
      padding: 0.2rem;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items : center;
      justify-content : space-between;

      img {
        width: 80px !important;
        height:80px;
      }

      .list-shop {
        width:  80%;
        padding: 0.2rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .shop-top {
          width: 100%;
          display: flex;
          justify-content: space-between;
          color: #333;

          h3 {
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 40%;
          }
          span{
            font-size:14px;
          }
        }

        .shop-star {
          width: 100%;
          display: flex;
          align-items : center;
          color: #333;

          span {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
          }
        }

        p {
          color: #333;
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 70%;
        }
      }
    }
  }
}
</style>
