<template>
  <div class="rescenter">
    <div class="res-container">
      <h4 class="title">你不是团长,请填写以下信息进行申请</h4>
      <ul class="star">
        <li>
          <span>小区名称：</span>
          <input type="text" v-model="neighbourhood" focus placeholder="请输入小区名称"  />
        </li>
        <li>
          <span>小区地址：</span>
          <input type="text" v-model="address" placeholder="请输入小区地址" />
          <img src="/static/img/dingwei.png" alt @click="choseAddress" />
        </li>
        <div class="noplay">
          <span>详细地址：</span>
          <input type="text" v-model="addressDetials" placeholder="请输入详细地址"/>
        </div>
        <li>
          <span>团长昵称：</span>
          <input type="text" v-model="nickname" placeholder="请输入团长昵称"  />
        </li>
        <li>
          <span>真实姓名：</span>
          <input type="text" v-model="name" placeholder="请输入您的真实姓名"  />
        </li>
        <li>
          <span>联系方式：</span>
          <input type="number" v-model="phone" placeholder="请输入您的联系方式"  />
        </li>
        <li>
          <span>身份证号：</span>
          <input type="idcard" v-model="idcard" placeholder="请输入您的身份证号"  />
        </li>
      </ul>
      <div class="persion">
        <h4>证件照片</h4>
        <ul class="upimg">
          <li @click="upFile(0)">
            <div>
              <img :src="negative" alt v-if="negative!=''" />
              <span v-else>+</span>
            </div>

            <p>身份证正面</p>
          </li>
          <li @click="upFile(1)">
            <div>
              <img :src="positive" alt v-if="positive!=''" />
              <span v-else>+</span>
            </div>

            <p>身份证反面</p>
          </li>
          <li @click="upFile(2)">
            <div>
              <img :src="inhand" alt v-if="inhand!=''" />
              <span v-else>+</span>
            </div>

            <p>营业执照</p>
          </li>
        </ul>
      </div>
      <div class="green" style="margin-top:10px;">
        <div class="choose" @click="changChoose">
          <van-icon name="circle" size="16px" v-if="!check" color="#ccc" />
          <van-icon name="checked" size="16px" color="#72D241" v-else />
          <!-- <van-icon name="certificate"  /> -->
        </div>
        <p>我已同意</p>
        <i class="greenxieyi" @click="xie">《用户协议》</i>
      </div>
      <div class="button" @click="sub">
        <span>提交</span>
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
      focus:false,
      check: false,
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
      title: "团长招募"
    });
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    this.qqMapSdk = new QQMapWX({
      key: "JYKBZ-NJNCU-GVDVC-B3RUD-AA5EH-3PFYT"
    });
  },
  onShow() {
    if (wx.getStorageSync("adduser")) {
      let adduser = JSON.parse(wx.getStorageSync("adduser"));
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
  onHide() {
    wx.removeStorageSync("adduser");
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
    upFile(ind) {
      let self = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          // console.log(res);
          Request.postFile(res.tempFiles[0])
            .then(res => {
              console.log(res);
              if (JSON.parse(res).result == 0) {
                switch (ind) {
                  case 0:
                    self.negative =
                      "https://m.scxxsx.com" + JSON.parse(res).url;
                    break;
                  case 1:
                    self.positive =
                      "https://m.scxxsx.com" + JSON.parse(res).url;
                    break;
                  case 2:
                    self.inhand = "https://m.scxxsx.com" + JSON.parse(res).url;
                    break;
                }
              }
            })
            .catch(res => {});
        },
        fail: () => {},
        complete: () => {}
      });
    },

    sub() {
      console.log(1);
      if (this.name == "") {
        wx.showToast({
          title: "请输入你的真实姓名",
          icon: "none"
        });
        return false;
      } else if (this.nickname == "") {
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
      } else if (this.idcard == "") {
        wx.showToast({
          title: "请输入你的身份证号码",
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
      } else if (this.positive == "") {
        wx.showToast({
          title: "请上传身份证反面照片",
          icon: "none"
        });
      } else if (this.negative == "") {
        wx.showToast({
          title: "请上传身份证正面照片",
          icon: "none"
        });
      } else if (this.inhand == "") {
        wx.showToast({
          title: "请上传手持身份证照片",
          icon: "none"
        });
      } else if (!this.isHan(this.name)) {
        wx.showToast({
          title: "请输入正确姓名",
          icon: "none"
        });
      } else if (!this.phoneValid(this.phone)) {
        wx.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
      } else if (!this.check) {
        wx.showToast({
          title: "请勾选用户协议",
          icon: "none"
        });
      } else {
        //   用户手动输入地址   获取   经纬度
        if (this.lon == "" || this.lat == "") {
          if (this.address != "" && this.addressDetials != "") {
            let self = this;
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
                  cmd: "leaderRegister",
                  cid: self.cid,
                  neighbourhood: self.neighbourhood,
                  address: self.address,
                  addressdetail: self.addressDetials,
                  lon: self.lon,
                  lat: self.lat,
                  province: self.province,
                  city: self.city,
                  town: self.town,
                  nickname: self.nickname,
                  phone: self.phone,
                  idcard: self.idcard,
                  positive: self.positive,
                  negative: self.negative,
                  inhand: self.inhand,
                  phone: self.phone
                };
                console.log(parmas);
                self.http(parmas);
              }
            });
          }
        } else {
          let parmas = {
            cmd: "leaderRegister",
            cid: this.cid,
            neighbourhood: this.neighbourhood,
            address: this.address,
            addressdetail: this.addressDetials,
            lon: this.lon,
            lat: this.lat,
            province: this.province,
            city: this.city,
            town: this.town,
            nickname: this.nickname,
            phone: this.phone,
            idcard: this.idcard,
            positive: this.positive,
            negative: this.negative,
            inhand: this.inhand,
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
              title:"你的审核已提交,请耐心等待!",
              icon:"none"
            })
            console.log(res);
            self.$router.replace("/pages/my/tuanzhangcenter/shenhetijiao");
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
textarea{
  position:absolute;
  top:0;
  left:0;
  opacity:0;
  height:358px;
  z-index:0;
}
.button {
  padding: 0 5px;
  box-sizing: border-box;
  margin: 50px 0;

  span {
    display: block;
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

      input {
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

  .green {
    display: flex;
    height: 25px;
    line-height: 25px;
    align-items: center;
    margin-top: 15px;
    font-size: 0;
    padding-left: 15px;

    .choose {
      width: 15px;
      height: 15px;
      position: relative;
      margin-right: 10px;

      i {
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    p {
      font-size: 14px;
    }

    .greenxieyi {
      color: #72D241;
      font-size: 14px;
      margin-left: 10px;
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