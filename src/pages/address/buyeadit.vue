<template>
  <div class="list">
    <!-- <main-header :text="text" @back="back"></main-header> -->
    <div class="box">
      <ul>
        <li>
          <span>联系人：</span>
          <input type="text" placeholder="请输入联系人的姓名" v-model="name" />
        </li>
        <li style="justify-content:center">
          <div
            class="common"
            :class="{active:itemIndex == k}"
            v-for="(v,k) in sex"
            :key="k"
            @click="change(k)"
          >{{v}}</div>
        </li>
        <li>
          <span>手机号：</span>
          <input type="number" placeholder="请输入联系人的电话" v-model="phone" />
        </li>
        <li @click="showAdd">
          <span>地址栏：</span>
          <input
            type="text"
            placeholder="请选择您的地理位置"
            disabled="disabled"
            id="cityName"
            style="background: none;"
            v-model="add"
          />
          <img src="/static/img/dingwei.png" alt />
        </li>
        <li>
          <span>门牌号：</span>
          <input type="text" placeholder="请输入详细地址 如门牌号" v-model="addr" />
        </li>
        <li>
          <van-checkbox :value="checked" @click="checkbox(checked)">设为默认</van-checkbox>
        </li>
      </ul>
      <button @click="addbtn">保存</button>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      text: "添加收货地址",
      radio: "1",
      checked: true,
      mo: 1,
      sex: ["女士", "先生"],
      itemIndex: 0,
      show: false,
      addr: "",
      lon: "",
      lat: "",
      province: "",
      city: "",
      town: "",
      name: "",
      phone: "",
      add: ""
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "编辑地址"
    });
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    if (wx.getStorageSync("adduser")) {
      let adduser = JSON.parse(wx.getStorageSync("adduser"));
      wx.removeStorageSync("adduser");
      console.log(adduser);
      this.name = adduser.receiverName;
      this.phone = adduser.mobile;
      this.itemIndex = adduser.call;
      this.addr = adduser.addr;
      this.lon = adduser.lon;
      this.lat = adduser.lat;
      this.province = adduser.province;
      this.city = adduser.city;
      this.town = adduser.town;
      this.add = adduser.province + adduser.city + adduser.town;
      this.itemIndex = adduser.call;
      this.mo = parseInt(adduser.isDefault);
      this.id = adduser.id;
    }
  },
  components: {},
  onShow() {
    if (wx.getStorageSync("adduser")) {
      let adduser = JSON.parse(wx.getStorageSync("adduser"));
      wx.removeStorageSync("adduser");
      console.log(adduser);
      this.addr = adduser.addr+adduser.add;
      this.lon = adduser.lng;
      this.lat = adduser.lat;
      this.province = adduser.province;
      this.city = adduser.city;
      this.town = adduser.town;
      this.add = adduser.add;
    }
  },
  methods: {
    change(k) {
      this.itemIndex = k;
      console.log(k);
    },
    checkbox(a) {
      this.checked = !this.checked;
      console.log(a);
      if (a == true) {
        this.mo = 1;
      } else {
        this.mo = 0;
      }
    },
    showAdd() {
      this.$router.push("../address/position");
    },
    cancel() {
      this.show = false;
    },
    addbtn() {
      console.log("添加地址");
      console.log(this.mo, this.name, this.phone, this.add);
      if (
        this.name == "" ||
        this.phone == "" ||
        this.province == "" ||
        this.city == "" ||
        this.town == "" ||
        this.add == ""
      ) {
        wx.showToast({
          title: "信息不能为空",
          icon:"none"
        });
      } else {
        let add = {
          cmd: "updateAddress",
          cid: this.cid,
          receiverName: this.name,
          call: this.itemIndex,
          mobile: this.phone,
          province: this.province,
          city: this.city,
          town: this.town,
          addr: this.add,
          lon: this.lon,
          lat: this.lat,
          isDefault: this.mo,
          id: this.id
        };
        console.log(add);
        Request.postRequest(add)
          .then(res => {
            console.log(res);
            if (res.result == 0) {
              wx.showToast({
                title: "编辑地址成功",
                icon:'none'
              });
              wx.removeStorageSync("adduser");

              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            }
          })
          .catch(res => {});
      }
    }
  },
  onHide() {
    console.log("hinde");
  }
};
</script>

  
<style>
page {
  min-height: 100%;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.active {
  background: #72D141;
  color: #fff !important;
  border: none !important;
}

.list {
  width: 100%;
  height: 100%;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      border-top: 1px solid #eee;

      li {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        position: relative;

        span {
          display: inline-block;
        }

        img {
          width: 0.4rem;
          height: 0.5rem;
          margin-left: 1rem;
          position: absolute;
          right: 0.2rem;
          top: 50%;
          transform: translateY(-50%);
        }

        input {
          flex: 1;
          padding-left: 15px;
        }

        .common {
          height: 0.7rem;
          line-height: 0.7rem;
          padding: 0 0.3rem;
          border: 1px solid #999;
          font-size: 14px;
          color: #999;
          border-radius: 4px;
          margin-right: 0.7rem;
        }
      }
    }

    button {
      width: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      border: none;
      background: #33CC66;
      color: #fff;
      height: 1rem;
      border-radius: 0;
    }
  }
}
</style>
