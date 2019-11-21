<template>
  <div class="contain">
    <div class="box">
      <ul>
        <li v-for="(v,k) in coupons" :key="k">
          <div class="c_price">
            <span style="font-size:25px">{{v.amount}}</span>
          </div>
          <div class="c_produce">
            <h3>满{{v.miniPurchase}}元可用</h3>
            <div class="c_time">
              <span>有效期至{{v.closingDate}}</span>
              <span style="color: #72d140" @click="getCoupon(v.amount,v.id)" v-if="show[k]">立即使用</span>
              <span style="color: #666" v-else>不可用</span>
              <span style="color: #666" v-if="v.status==1">已使用</span>
              <span style="color: #666" v-if="v.status==2">已过期</span>
            </div>
            <p>
              仅限
              <span style="color: #72d140">{{user}}</span>使用
            </p>
          </div>
        </li>
      </ul>
      <div class="no" v-if="noCoupons">暂没有优惠券可以使用</div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      coupons: [],
      page: 1,
      user: "",
      noCoupons: false,
      id: "",
      cid: "",
      dataList: [],
      show: []
    };
  },
  onLoad(options) {
    this.coupons = [];
    this.id = JSON.parse(options.id).sid;
    this.user = JSON.parse(options.id).sname;

    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }
    if (wx.getStorageSync("good")) {
      this.dataList = JSON.parse(wx.getStorageSync("good"));
    }
    this.myCoupon(this.id);
    console.log(this.dataList);

    // this.user = this.$router.history.current.params.name;
  },
  computed: {
    jiage() {
      let countlu = 0;

      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].new != undefined) {
          countlu +=
            Number(this.dataList[i].new) * Number(this.dataList[i].number);
        } else if (this.dataList[i].price != undefined) {
          countlu +=
            Number(this.dataList[i].price) * Number(this.dataList[i].number);
        }
      }
      return countlu;
    }
  },
  components: {},
  mounted() {},
   onShareAppMessage() {
     return this.$share.share()
   },
  methods: {
    formatTime(unixtime) {
      var date = new Date(unixtime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;//年月日时分秒
      return y + "-" + m + "-" + d + " " + h + ":" + minute;
    },
    myCoupon(id) {
      let datas = {
        cmd: "myCoupon",
        cid: this.cid,
        sid: id,
        pageNow: 1
      };
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            console.log(res.dataList);
            // this.coupons=res.dataList;
            console.log(this.coupons + "....获取数据");
            for (let i in res.dataList) {
              res.dataList[i].closingDate = this.formatTime(
                res.dataList[i].closingDate
              );
              this.coupons.push(res.dataList[i]);
              if (res.dataList[i].status == 0) {
                if (this.jiage >= parseFloat(res.dataList[i].miniPurchase)) {
                  this.show[i] = true;
                } else {
                  this.show[i] = false;
                }
              }
            }
          }
        })
        .catch(res => {});
    },

    getCoupon(state, id) {
      console.log(state, id);
      let you = {};
      you.num = state;
      you.id = id;
      you.sid = this.id;
      wx.setStorageSync("you", JSON.stringify(you));
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
    }
  }
};
</script>
<style>
page {
  width: 100%;
  min-height: 100%;
  background: #f5f5f5;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  height: 100%;
}

.no {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
}

.box {
  width: 100%;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;

    li {
      width: 100%;
      height: 3rem;
      background: url('../../../static/img/youhuijuan.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      // padding: 0.3rem;
      box-sizing: border-box;
      margin-top: 0.3rem;

      .c_price {
        width: 30%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        font-size: 20px;
        color: red;
        border-right: 1px dashed #eee;
      }

      .c_produce {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.3rem 0 0.3rem 0.1rem;
        box-sizing: border-box;

        h3 {
          width: 100%;
          height: 0.8rem;
          line-height: 0.8rem;
          font-size: 16px;
          color: #333;
        }

        .c_time {
          width: 100%;
          height: 0.8rem;
          display: flex;
          justify-content: space-between;
          line-height: 0.6rem;

          span {
            font-size: 14px;
            color: #999;
          }
        }
      }

      p {
        width: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 14px;
        color: #999;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>
