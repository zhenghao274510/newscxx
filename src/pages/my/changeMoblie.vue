<template>
  <div class="list">
    <div class="formList">
      <div class="formData">
        <div class="tel">
          <input v-model="tel" type="number" placeholder="请输入手机号"  />
        </div>
        <div class="tel">
          <input style="width: 50%;" type="text" placeholder="请填写验证码" v-model="code" />
          <button type="button" :disabled="btnState" @click="getValidate">
            {{rTime}}
            <span v-if="btnState">s</span>
          </button>
        </div>
        <!-- <div class="tel" style="border: none;background: none;">
           <radio>我已阅读并同意<span style="color:'green'" > 《 用户协议》</span></radio>
           <p></p>
         
        </div> -->
        <div class="btn" @click="btn">确定</div>
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
      cid:''
    };
  },
  components: {
  },
  onLoad() {
     this.cid=JSON.parse(wx.getStorageSync('user')).cid;
  },
  methods: {
    getValidate() {
      if (this.tel == "") {
        wx.showToast({
          title:"手机号不能为空",
          icon:'none'
        })
        return;
      } else if (
        !/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
          this.tel
        )
      ) {
         wx.showToast({
          title:"手机号格式不正确",
          icon:'none'
        })
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
      Request.postCommon(sendMe)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title:res.resultNote
            })
          }
        })
        .catch(res => {});
    },
    btn() {
      if (this.code == "") {
        wx.showToast({
          title:'验证码不能为空',
          icon:'none'
        })
      }
      let rebindMobile = {
        cmd: "rebindMobile",
        cid: this.cid,
        identifyCode: this.code,
        mobile: this.tel
      };
      // console.log(rebindMobile);
      Request.postRequest(rebindMobile)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title:'修改成功'
            })
            this.$router.go(-1);
          } else {
             wx.showToast({
              title:'该手机号已绑定!',
              icon:'none'
            })
            this.code = "";
          }
        })
        .catch(res => {});
    }
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
      padding: 0 10px;
      box-sizing: border-box;

      .tel {
        width: 100%;
        height: 1.3rem;
        background: #fafafa;
        margin-top: 0.3rem;
        padding: 0 0.3rem;
        border-radius: 6px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        input {
          width: 70%;
          height: 45px;
          line-height: 45px;
          font-size: 15px;
          color: #333;
          background: #fafafa;
        }

        button {
          display: inline-block;
          width: 35%;
          height: 0.6rem;
          line-height:0.6rem;
          margin-left: 8%;
          font-size: 15px;
          color: rgb(114, 209, 65);
          background: none;
          border: none;
          text-align: right;
        }

        p {
          font-size: 12px;
          color: #999;
          line-height: 18px;
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
        margin-top: 30px;
      }
    }
  }
}
</style>
