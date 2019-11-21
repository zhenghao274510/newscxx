<template>
  <!-- 选择自提点 -->
  <div class="chosebox">
    <div class="welcome">
      <h3>欢迎来到山城乡鲜</h3>
      <h3>请选择离您最近的团长为您服务</h3>
    </div>
    <div class="chose-cont">
      <div class="current-pos">
        <p>您当前的地址</p>
        <!-- <div> -->
          <span>{{current}}</span>
          <i @click="chose">修改</i>
        <!-- </div> -->
      </div>
      <ul v-if="dataList.length!=0">
        <li v-for="(v,k) in dataList" :key="k">
          <div class="icon-current">
            <div>
              <img src="/static/img/shouye-dingwei.png" alt />
              <span v-if="v.spacing<1">{{v.spacing*1000}}m</span>
              <span v-else>{{v.spacing}}km</span>
            </div>
          </div>
          <div class="info">
            <img :src="v.image" alt />
            <p class="one">{{v.name}}</p>
            <p class="two">{{v.neighbor}}</p>
            <p class="three">{{v.address}}</p>
            <span @click="enter(v)">进入团长小区</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="noLeader" @click="resTuan" v-if="dataList.length==0">
      <h3>附近暂无团长信息</h3>
      <span>申请成为团长</span>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
import QQMapWX from "@/common/jsdk/qqmap-wx-jssdk";
export default {
  data() {
    return {
      cid: "",
      center: {},
      page: 1,
      totalPage: 1,
      dataList: [],
      current: "",
      qqMapSdk: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad() {
    this.dataList = [];
    wx.setNavigationBarTitle({
      title: "附近团长"
    });
    this.qqMapSdk = new QQMapWX({
      key: "JYKBZ-NJNCU-GVDVC-B3RUD-AA5EH-3PFYT"
    });

    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    }

    if (wx.getStorageSync("point")) {
      this.center = JSON.parse(wx.getStorageSync("point"));
      this.getCurrent();
      console.log(this.center);
      this.getNearBy();
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  onShow() {
    if (wx.getStorageSync("adduser")) {
      this.current = JSON.parse(wx.getStorageSync("adduser")).addr;
      wx.removeStorageSync("adduser");
    }
  },
  mounted() {},
   onShareAppMessage() {
     return this.$share.share()
   },
  //方法集合
  methods: {
    enter(k) {
        k.neighbourhood=k.neighbor;
      wx.setStorageSync("leaderInfo", JSON.stringify(k));
      this.$router.go(-1);
    },
    getCurrent() {
      let self = this;
      self.qqMapSdk.reverseGeocoder({
        location: {
          latitude: self.center.latitude,
          longitude: self.center.longitude
        },
        success: function(res) {
          console.log(res.result);
          self.current = res.result.address;
        }
      });
    },
    chose() {
      wx.navigateTo({
        url: "/pages/address/position"
      });
    },
    resTuan() {
      this.$router.replace("/pages/my/tuanzhangcenter/restuanzhang");
    },
    getNearBy() {
      let parmas = {
        cmd: "nearbyGroupleader",
        cid: this.cid,
        lon: this.center.longitude+"",
        lat: this.center.latitude+"",
        pageNow: this.page
      };
      console.log(parmas)
      Request.postRequest(parmas)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            for (let i in res.dataList) {
              res.dataList[i].spacing = (
                Math.round(res.dataList[i].spacing / 100) / 10
              ).toFixed(1);

              this.dataList.push(res.dataList[i]);
            }
            //  this.dataList=res.dataList;
          }
        })
        .catch(err => {});
    }
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.page += 1;
      this.getNearBy();
    } else {
      this.more = true;
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
  width: 100%;
  min-height: 100%;
}
</style>
<style scoped lang="stylus">
.chosebox {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.noLeader {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    text-align: center;
  }

  span {
    padding: 5px 15px;
    background: #72D241;
    color: #fff;
    font-size: 14px;
    margin-top: 10px;
  }
}

.welcome {
  height: 150px;
  width: 100%;
  background: #72D241;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 18px;
    color: #fff;
    line-height: 35px;
  }
}

.chose-cont {
  background: #FAFAFA;
  position: relative;

  .current-pos {
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    p {
      font-size: 14px;
      color: #999999;
      line-height:25px;
    }
      span {
        width: 250px;
        text-align: center;
        font-size: 13px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      i {
        font-size: 13px;
        border: 1px solid #72D241;
        color: #72D241;
        height: 22px;
        width: 56px;
        display: inline-block;
        text-align: center;
        margin-top: 15px;
      }
    
  }

  ul {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;

    li {
      width: 100%;
      background: #fff;
      height: 215px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      position: relative;
      margin-bottom: 10px;

      .icon-current {
        position: absolute;
        top: 10px;
        left: 0;
        // width: 56px;
        height: 30px;
        border-radius: 0 11px 11px 0;
        color: #fff;
        display: flex;
        padding-left: 5px;
        align-items: center;
        font-size: 12px;
        background: #72D241;

        div {
          display: flex;
          align-items: center;

          img {
            width: 15px;
            height: 20px;
          }

          span {
            margin:0 5px ;
          }
        }
      }

      .info {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        p {
          line-height: 30px;
          text-align: center;
        }

        span {
          display: block;
          width: 200px;
          height: 30px;
          margin: 0 auto;
          border-radius: 50px;
          text-align: center;
          line-height: 30px;
          border-radius: 15px;
          background: #72D241;
          color: #fff;
          font-size: 13px;
        }

        .one {
          font-size: 14px;
          color: #333;
        }

        .two {
          font-size: 12px;
          color: #999;
        }

        .three {
          width: 70%;
          text-align: center;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #333;
        }
      }
    }
  }
}
</style>