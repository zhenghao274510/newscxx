<template>
  <div class="contain" ref="list">
    <!-- <div v-if="dataList.length==0" class="shopkong" @click="init">请点我重新定位</div> -->
    <div class="shop">
      <shop :dataList="dataList" @goDetail="goDetailID" v-if="dataList.length!=0"></shop>
      <div v-else class="kong">附近暂无商店</div>
      <div class="loading" v-if="more">
        <span>没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script>
import shop from "@/components/shop";
import Request from "@/common/js/request";
// import QQMapWX from "@/common/jsdk/qqmap-wx-jssdk";
// import getCity from "@/common/js/location";
export default {
  data() {
    return {
      cid: "",
      num: 2,
      active: 2,
      dataList: [],
      page: 1,
      gou: 0,
      center: {},
      totalPage: 1,
      more: false
    };
  },
  components: {
    shop
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "附近商家"
    });
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    if (wx.getStorageSync("point")) {
      this.center = JSON.parse(wx.getStorageSync("point"));
      console.log(this.center);
    }
  },
  mounted() {
    if (this.center != {}) {
      this.nearbyShop();
    }
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.page += 1;
      this.nearbyShop();
    } else {
      this.more = true;
    }
  },
  methods: {
    nearbyShop() {
      // this.donghua = true;
      this.pointyin = false;
      let nearbyShop = {
        cmd: "nearbyShop",
        cid: this.cid,
        lon: this.center.longitude,
        lat: this.center.latitude,
        pageNow: this.page
      };
      Request.postRequest(nearbyShop)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
          this.totalPage = res.totalPage;
            for (let i in res.dataList) {
              res.dataList[i].star = Number(res.dataList[i].stars);
              res.dataList[i].spacing = (
                Math.round(res.dataList[i].spacing / 100) / 10
              ).toFixed(1);
              if (res.dataList[i].spacing <= 3) {
                this.dataList.push(res.dataList[i]);
              }
              // if(this.totalPage==1){
              //   this.more=true;
              // }
            }

            console.log(this.dataList);
          }
        })
        .catch(res => {});
    },
    init() {
      let self = this;
      wx.showLoading({
        title: "定位中，请稍后.."
      });
      wx.getLocation({
        type: "gcj02",
        success(res) {
          wx.hideLoading();
          wx.showToast({
            title: "定位成功!",
            icon: "none"
          });
          wx.setStorageSync("point", JSON.stringify(res));
          self.nearbyShop();
        }
      });
    },
    goDetailID(ID) {
      let url = "/pages/shopdetails/index?id=" + ID;
      console.log(ID, url);
      wx.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  box-sizing: border-box;

  .head {
    width: 100%;
    height: 60px;
    padding: 10px 0.4rem 0;
    box-sizing: border-box;
    font-size: 15px;
    color: #333;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    background: #fff;
    border-bottom: 1px solid #dedede;
  }

  .shop {
    width: 100%;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    padding-top: 10px;
  }

  .kong {
    text-align: center;
    font-size: 14px;
    margin-top: 40px;
  }

  .shopkong {
    text-align: center;
    font-size: 14px;
    margin: 150px auto;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #dedede;
    width: 40%;
    line-height: 50px;
  }
}
</style>
