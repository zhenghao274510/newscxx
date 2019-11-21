<template>
  <div class="list">
      <ul class="list-box">
        <li v-for="(v,k) in recommendList" :key="k" @click.stop="detail(v.id)">
          <img :src="v.image" alt lazy-load />
          <div class="list-content">
            <div class="list-top">
              <div class="list-title">{{v.name}}</div>
              <div class="list-produce">{{v.text}}</div>
            </div>
            <div class="list-price">
              <div class="list-left">
                <span
                  style="color: red;font-size: 16px;"
                >￥{{v.price}}</span>
                <span
                  style="color: #dedede;font-size: 16px; text-decoration: line-through;"
                  v-if="v.discount==1"
                >￥{{v.originalPrice}}</span>
              </div>
              <img src="/static/img/gouwuche2.png" alt @click.stop="shopcart(v)" />
            </div>
          </div>
        </li>
      </ul>
      <div class="loading" v-if="more">
            <span>没有更多了</span>
          </div>
  </div>
</template>

<script>
// import MainHeader from "@/components/mainHeader";
import Request from "@/common/js/request";
export default {
  data() {
    return {
      recommendList: [],
      page: 1,
      more: false,
      cid: "",
      id:'',
      totalPage:1
    };
  },
  onLoad(options) {
    this.id=options.id;
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      this.discountGoods(this.page);
   
  },
  components: {
  },
  mounted() {
  },
     onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc: "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: ""  // 路径，传递参数到指定页面。
    };
  },
   onReachBottom() {
     console.log("触底 加载")
      if (this.page >= this.totalPage) {
        this.more = true;
      } else {
        this.page++;
        let discountGoods = {
          cmd: "discountGoods",
          pageNow: this.page
        };
        Request.postRequest(discountGoods)
          .then(res => {
            if (res.result == 0) {
              for (var i in res.discount) {
                this.recommendList.push(res.discount[i]);
              }
            }
            console.log(this.recommendList);
          })
          .catch(res => {});
      }
    },
  methods: {
    detail(id) {
      console.log(id);
      wx.navigateTo({
        url: "/pages/Good/gooddetials?id=" + id
      });
    },
    shopcart(v) {
      let datas = {
        cmd: "addToCar",
        gid: v.id,
        cid: this.cid,
        specifications: v.skuId,
        number: 1
      };
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: "添加购物车成功"
            });
          }
        })
        .catch(res => {});
    },
    discountGoods(page) {
      let discountGoods = {
        cmd: "discountGoods",
        pageNow: page
      };
      Request.postRequest(discountGoods)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            this.recommendList = res.discount;
            if(this.totalPage==this.page){
              this.more=true;
            }
          }
        })
        .catch(res => {});
    },
   
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .list-box {
    width: 100%;

    li {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding:10px 0;
      border-bottom: 1px solid #eee;
      margin-top 15px;

      img {
        width: 1.8rem;
        height: 1.8rem;
      }

      .list-content {
        width: 70%;
        height: 1.35rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 0.3rem;
        box-sizing: border-box;
        font-size: 14px;
        color: #333;
        .list-top {
          width: 100%;

          .list-title {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .list-produce {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 0.2rem;
          }
        }

        .list-price {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 0.35rem;
            height: 0.35rem;
          }
        }
      }
    }
  }

  .list-more {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}
</style>
