<template>
  <div class="tenants-box">
    <div class="box">
      <ul>
        <li v-for="(v,k) in list" :key="k" @click="order(v)">
          <div class="content">
            <h3>
              <span>订单编号：{{v.id}}</span>
              <span style="color: red;" v-if="v.status == 0">待付款</span>
              <span v-if="v.status == 1">待处理</span>
              <span v-if="v.status == 2">待发货</span>
              <span v-if="v.status == 3">待收货</span>
              <span v-if="v.status == 4">待评价</span>
              <span v-if="v.status == 5">已评价</span>
              <span v-if="v.status == 6">已取消</span>
              <span v-if="v.status == 7">待退款</span>
              <span v-if="v.status == 8">已退款</span>
              <span v-if="v.status == 9">拒绝退款</span>
            </h3>
            <!--0待付款 1待处理 2待发货 3待收货 4待评价 5已评价 6已取消 7待退款 8已退款 9拒绝退款-->
            <div class="wrapper">
              <img :src="v.simage" alt lazy-load />
              <div class="s_right">
                <div class="s_top">
                  <span>{{v.sname}}</span>
                </div>
                <p>{{v.createTime}}</p>
                <div class="s_price">
                  <span style="color:#999;">共计{{v.number}}件商品</span>
                  <span>￥{{v.finalPay}}元</span>
                </div>
              </div>
            </div>
            <div class="pay" v-if="v.status == 0">
              <span>24小时后自动取消订单</span>
              <div>待支付</div>
            </div>
            <div class="pay" v-if="v.status == 3">
              <span>15天后自动确认收货</span>
              <div style="padding: 0 0.2rem;">确认收货</div>
            </div>
            <div class="comment" v-if="v.status == 4">
              <div style="padding: 0 0.2rem;">评价</div>
            </div>
          </div>
        </li>
      </ul>
      <div class="loading" v-if="more">
        <span>没有更多了</span>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";

export default {
  data() {
    return {
      list: [],
      page: 1,
      totalPage: 2,
      cid: "",
      id: "",
      more:false
    };
  },
  components: {},
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "退款/售后"
    });
    this.cid = options.cid;
    // this.myOrder(this.page);
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  onShow() {
    this.list = [];
    this.myOrder(this.page);
  },
  mounted() {
    this.list = [];
    // this.myOrder(this.page);
  },
  onReachBottom() {
    console.log("到底了");
    // let self=this;
    console.log(this.page, this.totalPage);
    if (this.page < this.totalPage) {
      this.page += 1;
      this.myOrder(this.page);
    } else {
      this.more = true;
    }
  },
  methods: {
    myOrder(page) {
      let myOrder = {
        cmd: "myOrder",
        cid: this.cid,
        pageNow: page,
        status: "5"
      };
      Request.postRequest(myOrder)
        .then(res => {
          if (res.result == 0) {
            console.log(res.dataList);
            if(res.dataList.length==0){
              this.more=true;
            }
            this.totalPage = res.totalPage;
            for (let i in res.dataList) {
              this.list.push(res.dataList[i]);
            }
          }
        })
        .catch(res => {});
    },
    //详情
    order(v) {
      console.log(v);
      let obj = {
        direct: 0,
        id: v.id
      };
      wx.navigateTo({
        url: "/pages/order/orderdetials?id=" + JSON.stringify(obj)
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tenants-box {
  padding: 0 10px 0;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .order_list {
      width: 100%;
      position: relative;

      .order_wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        h3 {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.4rem;
          box-sizing: border-box;
          font-size: 14px;
          color: #333;
        }
      }
    }

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;

      li {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.1rem 0.4rem;
        box-sizing: border-box;
        margin-bottom: 10px;
        border-bottom: 1px solid #eee;

        .content {
          display: block;
          width: 100%;
          height: 100%;
        }

        h3 {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #333;
        }

        .wrapper {
          width: 100%;
          display: flex;
          align-items: center;

          img {
            width: 2.2rem;
            height: 2.2rem;
          }

          .s_right {
            flex: 1;
            height: 1.8rem;
            padding-left: 0.2rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .s_top {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              color: #333;
            }

            p {
              width: 100%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size: 12px;
              color: #999;
            }

            .s_price {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 12px;
              color: #333;
            }
          }
        }

        .pay {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #333;

          div {
            width: 1.5rem;
            height: 0.6rem;
            line-height: 0.6rem;
            border-radius: 6px;
            background: #73d242;
            text-align: center;
            font-size: 14px;
            color: #fff;
          }
        }

        .comment {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          color: #333;

          div {
            width: 1.5rem;
            height: 0.6rem;
            line-height: 0.6rem;
            border-radius: 6px;
            background: #73d242;
            text-align: center;
            font-size: 14px;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
