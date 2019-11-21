<template>
  <div class="zhangdan">
    <div class="containter">
      <div class="top">
        <div>
          <view class="section">
            <picker
              mode="date"
              :value="startime"
              start="2017-09-01"
              :end="end"
              @change="starChange"
            >
              <view class="picker" v-if="startime==''">开始时间</view>
              <view class="picker" v-else>{{startime}}</view>
            </picker>
          </view>

          <i>-</i>
          <view class="section">
            <picker mode="date" :value="endtime" start="2017-09-01" :end="end" @change="endChange">
              <view class="picker" v-if="endtime==''">结束时间</view>
              <view class="picker" v-else>{{endtime}}</view>
            </picker>
          </view>
          <em @click="goSearch">搜索</em>
        </div>
        <div>
          <p>提现：￥{{withdrawal}}</p>
          <p>收入：￥{{income}}</p>
        </div>
      </div>
      <ul class="detials">
        <li v-for="(v,k) in dataList" :key="k">
          <div>
            <h5>{{v.title}}</h5>
            <p>{{v.adtime}}</p>
          </div>
          <div v-if="v.state==1">
            <span style="color:#FE552E">+￥{{v.amount}}</span>
            <i>待结算</i>
          </div>
          <div v-if="v.state==3">
            <span style="color:#333333">-￥{{v.amount}}</span>
          </div>
          <div v-if="v.state==0">
            <span style="color:#FE552E">+￥{{v.amount}}</span>
          </div>
        </li>
        <!-- <li>
          <div>
            <h5>订单4515267845</h5>
            <p>2018-03-25 16:38:12</p>
          </div>
          <div>
            <span>+200.00</span>
            <i>待结算</i>
          </div>
        </li>-->
      </ul>
    </div>
    <div class="loading" v-if="more">
      <span>没有更多了</span>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
import formData from "@/utils";
export default {
  data() {
    return {
      more: false,
      leaderid: "",
      end: "",
      startime: "", //  起始时间
      endtime: "", //结束时间
      dataList: [],
      withdrawal: "", //提现金额
      income: "", // 收入金额
      page: 1,
      totalPage: 1,
      show: false,
      direct: 0
    };
  },
  //监听属性 类似于data概念
  computed: {
    moneyX() {
      return;
    }
  },
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "账单明细"
    });
    this.direct = options.id;

    console.log(this.direct);
    this.leaderid = JSON.parse(wx.getStorageSync("leaderInfo")).leaderid;
    this.loading(this.startime, this.endtime);
    this.end = formData.formatTime(new Date());
    console.log(this.end);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.direct == 1) {
      this.startime = this.endtime = formData.formatTime(new Date());
    } else {
      this.startime = this.endtime = "";
    }
  },
  //  上拉触底 加载
  onReachBottom() {
    console.log("触底");
    if (this.page < this.totalPage) {
      this.page += 1;
      this.loading();
    } else {
      this.more = true;
    }
  },
  //方法集合
  methods: {
    starChange(e) {
      console.log(e);
      this.startime = e.target.value;
    },
    endChange(e) {
      this.endtime = e.target.value;
      console.log(e);
    },
    loading(startime, endtime) {
      let parmas = {
        cmd: "billDetailList",
        leaderid: this.leaderid,
        pageNow: this.page,
        starttime: startime,
        endtime: endtime,
        state: this.direct
      };
      Request.postRequest(parmas)
        .then(res => {
          if (res.result == 0) {
            console.log(res);
            this.totalPage = res.totalPage;
            this.withdrawal = res.withdrawal;
            this.income = res.income;

            for (let i in res.dataList) {
              if (this.direct == 0) {
                this.dataList.push(res.dataList[i]);
              } else if (this.direct == 1) {
                if (res.dataList[i].state == 1) {
                  this.dataList.push(res.dataList[i]);
                }
              }
            }
          }
        })
        .catch(err => {});
    },
    goSearch() {
      this.dataList = [];
      this.loading(this.startime, this.endtime);
    }
  },
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  befopxount() {},
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
  min-height: 100%;
  width: 100%;
  background: #fafafa;
}
</style>
<style scoped lang="stylus">
.zhangdan {
  height: 100%;

  .containter {
    height: 100%;

    .top {
      padding: 0 20px;

      div {
        height: 50px;
        display: flex;
        font-size: 14px;
        align-items: center;

        .section {
          width: 130px;
          text-align: center;

          span {
            display: block;
            width: 130px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #fff;
          }
        }

        i {
          margin: 0 10px;
          font-size: 16px;
        }

        em {
          display: block;
          width: 70px;
          padding: 5px 8px;
          text-align: center;
          background: #72D241;
          border-radius: 4px;
          color: #fff;
        }

        p {
          font-size: 12px;
          flex: 1;
        }
      }
    }

    .detials {
      background: #fff;

      li {
        display: flex;
        height: 45px;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #F0F0F0;
        padding: 5px 10px;

        div {
          h5 {
            font-size: 13px;
            color: #000;
          }

          p {
            font-size: 11px;
            color: #999999;
          }
        }

        span {
          display: block;
          font-size: 13px;
          font-weight: bold;
        }

        i {
          font-size: 11px;
          color: #999999;
        }

        .addcolor {
          color: #FE552E;
        }

        .delcolor {
          color: #333333;
        }
      }
    }
  }
}
</style>