<template>
  <div class="rescenter">
    <div class="res-container">
      <h4 class="title">请填写以下信息进行修改</h4>
      <ul class="star">
        <li>
          <span>小区名称：</span>
          <input type="text" placeholder="请输入小区名称" v-model="neighbourhood" />
        </li>
        <li>
          <span>小区地址：</span>
          <input type="text" placeholder="请输入小区地址" v-model="address" />
          <img src="/static/img/dingwei.png" alt @click="choseAddress" />
        </li>
        <div class="noplay">
          <span>详细地址：</span>
          <input type="text" placeholder="请输入详细地址" v-model="addressDetials" />
        </div>
        <li>
          <span>团长昵称：</span>
          <input type="text" placeholder="请输入团长昵称" v-model="nickname" />
        </li>
        <li>
          <span>真实姓名：</span>
          <!-- <input type="text" placeholder="请输入您的真实姓名" v-model="name" /> -->
          <div>{{name}}</div>
        </li>
        <li>
          <span>联系方式：</span>
          <input type="text" placeholder="请输入您的联系方式" v-model="phone" />
        </li>
        <li>
          <span>身份证号：</span>
          <div>{{idcard}}</div>
          <!-- <input type="text" placeholder="请输入您的身份证号" v-model="idcard" /> -->
        </li>
      </ul>

      <div class="button" @click="sub">
        <span>提交</span>
      </div>
      <div class="persion">
        <h4>证件照片</h4>
        <ul class="upimg">
          <li>
            <div>
              <img :src="negative" alt />
            </div>
          </li>
          <li>
            <div>
              <img :src="positive" alt />
            </div>
          </li>
          <li>
            <div>
              <img :src="inhand" alt />
            </div>
          </li>
        </ul>
      </div>
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
      leaderid: "",
      neighbourhood: "", //  小区名称
      address: "", // 小区地址
      idcard: "", //  身份证号码
      phone: "", // 手机号
      name: "", // 真是姓名
      nickname: "", //  昵称
      addressDetials: "", // 详细地址
      lon: "", //经度
      lat: "", // 维度
      province: "",
      city: "",
      town: "",
      positive: "", //  反面
      negative: "", //正面
      inhand: "", //  手照
      qqMapSdk: ""
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "修改资料"
    });
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;

    this.qqMapSdk = new QQMapWX({
      key: "JYKBZ-NJNCU-GVDVC-B3RUD-AA5EH-3PFYT"
    });
  },
  mounted() {
    if (wx.getStorageSync("leaderInfo")) {
      let leaderInfo = JSON.parse(wx.getStorageSync("leaderInfo"));
      console.log(leaderInfo);
      this.leaderid = leaderInfo.leaderid;
      this.name = leaderInfo.name;
      this.nickname = leaderInfo.nickname;
      this.addressDetials = leaderInfo.addressdetail;
      this.idcard = `${leaderInfo.idcard.slice(
        0,
        3
      )}****${leaderInfo.idcard.slice(-4)}`;
      // this.idcard = leaderInfo.idcard;
      this.phone = leaderInfo.phone;
      this.address = leaderInfo.address;
      this.neighbourhood = leaderInfo.neighbourhood;
      this.positive = leaderInfo.positive;
      this.negative = leaderInfo.negative;
      this.inhand = leaderInfo.inhand;
    }
  },
  onShow() {
    if (wx.getStorageSync("adduser")) {
      let adduser = JSON.parse(wx.getStorageSync("adduser"));
      wx.removeStorageSync("adduser");
      this.addressDetials = adduser.addr;
      this.lon = adduser.lng;
      this.lat = adduser.lat;
      this.province = adduser.province;
      this.city = adduser.city;
      this.town = adduser.town;
      this.address = adduser.add;
      console.log(adduser);
    }
  },
  //方法集合
  methods: {
    choseAddress() {
      console.log(11);
      wx.navigateTo({
        url: "/pages/address/position"
      });
    },
    changChoose() {
      this.check = !this.check;
    },
    xie() {
      this.$router.push("/pages/upSet/fuwutiaowen");
    },
    sub() {
      console.log(1);
      if (this.nickname == "") {
        wx.showToast({
          title: "请输入昵称",
          icon: "none"
        });
      } else if (this.neighbourhood == "") {
        wx.showToast({
          title: "请输入小区名称",
          icon: "none"
        });
      } else if (this.address == "") {
        wx.showToast({
          title: "请输入小区地址",
          icon: "none"
        });
      } else if (this.phone == "") {
        wx.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
      } else if (this.addressDetials == "") {
        wx.showToast({
          title: "请输入小区详细地址",
          icon: "none"
        });
      } else if (!this.phoneValid(this.phone)) {
        wx.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
      } else {
        if (this.lon == "" || this.lat == "") {
          if (this.address != "" && this.addressDetials != "") {
               let self=this;
            self.qqMapSdk.geocoder({
              address: self.address || self.addressDetials,
              success(res) {
                console.log(res);
             
                var res = res.result;
                self.lat = res.location.lat;
                self.lon = res.location.lng;
                self.province = res.address_components.province;
                self.city = res.address_components.city;
               self.town = res.address_components.district;
                let parmas = {
                  cmd: "updateLeader",
                  leaderid: self.leaderid,
                  neighbourhood: self.neighbourhood,
                  address: self.address,
                  addressdetail: self.addressDetials,
                  lon: self.lon,
                  lat: self.lat,
                  province: self.province,
                  city: self.city,
                  town: self.town,
                  nickname: self.nickname,
                  phone: self.phone
                };
                console.log(parmas);
                self.http(parmas);
              }
            });
          }
        } else {
          let parmas = {
            cmd: "updateLeader",
            leaderid: this.leaderid,
            neighbourhood: this.neighbourhood,
            address: this.address,
            addressdetail: this.addressDetials,
            lon: this.lon,
            lat: this.lat,
            province: this.province,
            city: this.city,
            town: this.town,
            nickname: this.nickname,
            phone: this.phone
          };
          console.log(parmas);
          this.http(parmas);
        }
      }
    },
    http(parmas) {
      Request.postRequest(parmas)
        .then(res => {
          let self = this;
          if (res.result == 0) {
            wx.showToast({
              title: "修改成功"
            });
            console.log(res);
            setTimeout(()=>{
              self.$router.go(-1);
            },1000)
          } else {
            wx.showToast({
              title: res.resultNote
            });
          }
        })
        .catch(err => {});
    },
    isHan(value) {
      var re = new RegExp(/^[\u4e00-\u9fa5]+$/);
      if (re.test(value)) {
        return true;
      } else {
        return false;
      }
    },
    phoneValid(value) {
      var re = new RegExp(/^[1][3456789]\d{9}$/);
      if (re.test(value)) {
        return true;
      } else {
        return false;
      }
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
<style scoped lang="stylus">
.button {
  // padding: 0 5px;
  width: 190px;
  box-sizing: border-box;
  margin: 25px auto;

  span {
    display: block;
    width: 100%;
    height: 40px;
    background: #72D241;
    border-radius: 6px;
    color: #fff;
    line-height: 45px;
    text-align: center;
    font-size: 17px;
  }
}

.res-container {
  .title {
    font-size: 16px;
    line-height: 43px;
    background: #FAFAFA;
    text-align: center;
    font-weight: bold;
  }

  .star {
    padding: 0 15px;

    .noplay {
      align-items: center;
      border-bottom: 1px solid #F0F0F0;
      height: 71px;

      // padding:10px 0;

      // flex-direction:column;
      // align-items:left;
      span {
        display: block;
        line-height: 25px;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        margin-top: 10px;
      }

      input {
        height: 30px;
        font-size: 13px;
        color: #999999;
        margin-top: 10px;
      }
    }

    li {
      display: flex;
      align-items: center;
      line-height: 45px;
      border-bottom: 1px solid #F0F0F0;
      position: relative;

      span {
        display: block;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
      }

      input, div {
        flex: 1;
        font-size: 13px;
        padding-left: 15px;
        color: #999999;
      }

      img {
        width: 15px;
        height: 20px;
        position: absolute;
        top: 10px;
        right: 0;
        z-index: 999;
      }
    }
  }

  .upimg {
    font-size: 0;
    background: #fff;
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #CCCCCC;

    li {
      width: 100px;
      padding-bottom: 10px;
      position: relative;
      margin-right: 10px;

      div {
        position: relative;
        width: 100px;
        height: 100px;
        border: 1px solid #CCCCCC;

        img {
          width: 100px;
          height: 100px;
        }

        span {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
        }
      }

      p {
        font-size: 13px;
        color: #333;
        text-align: center;
        margin-top: 10px; // width: 65px;
      }
    }
  }
}

.persion {
  // margin-top: 10px;
  padding: 0 20px;

  // border-bottom: 1px solid #ccc;
  h4 {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
    line-height: 35px;
    font-weight: bold;
  }
}
</style>