<template>
  <div class="list">
    <div class="formList">
      <div class="formData">
        <div class="tel">
          <input v-model="tel" type="number" placeholder="请输入手机号" />
        </div>
        <div class="tel">
          <input style="width: 50%;" type="text" placeholder="请填写验证码" v-model="code" />
          <button type="button" :disabled="btnState" @click="getValidate" >
            {{rTime}}
            <span v-if="btnState">s</span>
          </button>
        </div>
        <div class="tel zhu" style="border: none;" @click.stop="onChange">
          <checkbox checked-color="rgb(114,209,65)"  size="12"  :checked="checked"></checkbox>
          <span class="text">我已阅读并同意</span>
          <span class="text" style="color: rgb(114,209,65);" @click.stop="xie">《用户注册协议》</span>
        </div>
         <form @submit="formid" report-submit="true">
        <div class="btn" @click="submit" formType="submit">确定</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      tel: "",
      code: "",
      btnState: false,
      checked: false,
      rTime: "获取验证码",
      ob: "",
      userlist: {},
      openId: "",
      formid:''
    };
  },

  components: {},
  onLoad() {
      wx.setNavigationBarTitle({
      title:"绑定手机号"
    });
    if (wx.getStorageSync("userlist")) {
      this.userlist = JSON.parse(wx.getStorageSync("userlist"));
      console.log(this.userlist);
    }
    if (wx.getStorageSync("user")) {
      this.openId = JSON.parse(wx.getStorageSync("user")).openId;
      console.log(this.openId);
    }
  },
  mounted() {},
  methods: {
    formid(e){
      this.formid=e.mp.detail.formId;
    },
    onChange() {
      console.log(this.checked);
      this.checked = !this.checked;
    },
    getValidate() {
      if (this.tel == "") {
        wx.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        return;
      } else if (
        !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
          this.tel
        )
      ) {
        wx.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        return;
      }
      let self = this;
      this.rTime = 60;
      let rTime = this.rTime;
      this.btnState = true;
      let interval = setInterval(() => {
        if (--self.rTime <= 0) {
          self.rTime = "获取验证码";
          clearInterval(interval);
          self.btnState = false;
        }
      }, 1000);
      let sendMe = {
        cmd: "sendMessage",
        mobile: this.tel
      };
      console.log(sendMe);
      Request.postCommon(sendMe)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: "发送中",
              icon: "none"
            });
          }
        })
        .catch(res => {});
    },
    xie() {
      console.log("查看协议");
      this.$router.push("../upSet/fuwutiaowen");
    },
    submit() {
      if (this.tel == "") {
        wx.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        return;
      } else if (
        !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
          this.tel
        )
      ) {
        wx.showToast({
          title: "手机号格式不正确,请更改手机号",
          icon: "none"
        });
        return;
      }

      if (this.code == "") {
        wx.showToast({
          title: "验证码不能为空",
          icon: "none"
        });
      }

      if (!this.checked) {
        wx.showToast({
          title: "请勾选协议",
          icon: "none"
        });
        return;
      }
      let datas = {
        cmd: "bindMobile",
        mobile: this.tel,
        identifyCode: this.code,
        openId: this.openId,
        loginType: "wx",
        headImage: this.userlist.avatarUrl,
        nickName: this.userlist.nickName,
        mode: "1"
      };
      console.log("开始绑定" + JSON.stringify(datas));
      Request.postRequest(datas)
        .then(res => {
          if (res.result == 0) {
            wx.showToast({
              title: "绑定成功",
              icon: "none"
            });
            let user = {};
            user.openId = this.openId;
            user.cid = res.cid;
            let formid={
              cmd:'uploadFormid',
              uid:res.cid,
              fromid:this.formid
            }
            Request.postRequest(formid).then(res=>{
              if(res.result==0){
                console.log(res);
              }
            })
            wx.setStorageSync("user", JSON.stringify(user));
            setTimeout(() => {
              this.$router.go(-1);
              wx.removeStorageSync("userlist");
            }, 30);
          }
        })
        .catch(res => {});
    },
    getUid() {}
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.list {
  width: 100%;
  height: 100%;

  .formList {
    width: 100%;

    .formData {
      width: 100%;
      border-top: 1px solid #eee;
      padding: 0 0.2rem;
      box-sizing: border-box;

      .tel {
        width: 100%;
        height: 0.7rem;
        border-bottom: 1px solid #eee;
        margin-top: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        input {
          width: 70%;
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: 15px;
          color: #333;
        }

        button {
          display: inline-block;
          width: 35%;
          height: 0.5rem;
          line-height: 0.5rem;
          margin-left: 5%;
          font-size: 15px;
          color: rgb(114, 209, 65);
          background: none;
          border: none;
        }
      }

      .btn {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        border-radius: 6px;
        background: rgb(114, 209, 65);
        font-size: 15px;
        color: #fff;
        text-align: center;
        margin-top: 1rem;
      }

      .zhu {
        display: flex;
        font-size: 13px;
        margin-top: 0.1rem;
        justify-content: flex-start;
      }
    }
  }
}
</style>
