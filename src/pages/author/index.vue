<template>
  <div>
    <div>
      <div class="header">
        <img src="/static/img/tilogo.png" />
      </div>

      <div class="content">
        <div>山城乡鲜</div>
        <p class="eng">Raw fruits and vegetables</p>
        <p class="china">【及时配送到家】</p>
      </div>
      <button
        class="bottom"
        type="primary"
        open-type="getUserInfo"
        lang="zh_CN"
        @getuserinfo="bindGetUserInfo"
      >微信授权登录</button>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
export default {
  data() {
    return {
      no: false
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  onLoad() {
    // 查看是否授权
    // wx.showLoading({
    //   title: "加载中..."
    // });
    // if (wx.getStorageSync("user")) {
    //   console.log("已授权");
    //   setTimeout(() => {
    //     wx.switchTab({
    //       url: "../tarba/home"
    //     });
    //     wx.hideLoading();
    //   }, 30);
    // } else {
    //   this.no = true;
    //   wx.hideLoading();
    // }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    bindGetUserInfo(e) {
      let self = this;
      console.log(e.mp.detail.userInfo);
      wx.setStorageSync("userlist", JSON.stringify(e.mp.detail.userInfo));
      wx.login({
        success: function(res) {
          console.log("用户code...." + res.code);
          wx.setStorageSync("code", res.code);
          let parmas = {
            cmd: "wxAuthLogin",
            code: res.code,
            token: ""
          };
          Request.postRequest(parmas).then(res => {
            if (res.result == 0) {
              console.log(res);
              let user = {};
              user.openId = res.openId;
              if (res.cid==""||res.cid==undefined){
                wx.setStorageSync("user", JSON.stringify(user));
                setTimeout(() => {
                  self.$router.replace("/pages/bind/bindtell");
                }, 30);
              } else{
                user.cid = res.cid;
                wx.setStorageSync("user", JSON.stringify(user));
                setTimeout(() => {
                  self.$router.go(-1);
                }, 30);
              }
            }
          });
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
    }
  },
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
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
<style scoped>
.header {
  margin: 90rpx auto 0;
  text-align: center;
  width: 200rpx;
  height: 200rpx;
}

.header image {
  width: 200rpx;
  height: 200rpx;
}

.content {
  text-align: center;
}

.content div {
  height: 32px;
  font-size: 32px;
  font-family: FZCuHeiSongS-B-GB;
  font-weight: 400;
  color: rgba(0, 111, 48, 1);
  line-height: 42px;
  margin: 20rpx auto;
}

.content .eng {
  height: 18px;
  font-size: 15px;
  font-family: Segoe Print;
  font-weight: 400;
  color: rgba(0, 111, 48, 1);
  line-height: 30px;
}

.content .china {
  height: 19px;
  font-size: 20px;
  margin-top: 10px;
  font-family: SourceHanSansCN;
  font-weight: bold;
  color: rgba(241, 146, 0, 1);
  display: block;
}
.no {
  position: relative;
}
.fromd {
  position: absolute;
  top: 70rpx;
  left: 0;
  right: 0;
  height: 80rpx;
}

.bottom {
  height: 80rpx;
  background: rgba(114, 210, 65, 1);
  border-radius: 12rpx;
  margin: 70rpx 50rpx;
  font-size: 30rpx;
}
</style>