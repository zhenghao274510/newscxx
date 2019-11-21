<template>
  <div class="contain">
    <div class="box">
        <!-- <from class="button" @submit="bao" report-submit="true"> -->
      <ul>
        <li style="border-bottom: 10px solid #eee;">
          <span>修改头像</span>
          <div class="modify_right" @click="upload">
            <img :src="headicon" alt style="border-radius: 50%;" v-if="headImage!=''" />
            <img src="/static/img/touxiang.png" alt v-else />
            <img
              style="width:0.3rem;height:0.4rem;margin-left:0.3rem;"
              src="/static/img/jinru02.png"
              alt
            />
          </div>
        </li>
        <li>
          <span>昵称</span>
          <div class="modify_right">
            <input type="text" placeholder="请输入昵称" v-model="username" @blur="bao" />
            <img
              style="width:0.3rem;height:0.4rem;margin-left:0.3rem;"
              src="/static/img/jinru02.png"
              alt
            />
          </div>
        </li>
        <li @click="goModify">
          <span>绑定手机号</span>
          <div class="modify_right">
            <span>{{mobile}}</span>
            <img
              style="width:0.3rem;height:0.4rem;margin-left:0.3rem;"
              src="/static/img/jinru02.png"
              alt
            />
          </div>
        </li>
      </ul>
        <div class="button" @click="bao">
           <button >保存</button>
        </div>
        
      <!-- </from> -->
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      imgs: "",
      username: "", //昵称
      mobile: "", //手机号
      headicon: "", //头像
      url: "",
      ResMobile: ""
    };
  },
  components: {},
  onLoad() {
      wx.setNavigationBarTitle({
      title: "个人资料"
    });
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
    this.gouserInfo();
  },
  onShow() {},
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
  mounted() {},
  methods: {
    formid(){
         let parmas = {
        cmd: "uploadFormid",
        uid: this.cid,
        formid: this.formid
      };
      Request.postRequest(parmas).then(res => {
        if (res.result == 0) {
          console.log(res);
        }
      });
    },
    upload() {
      let self = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          console.log(res);
           Request.postFile(res.tempFiles[0]).then(res=>{
             console.log(JSON.parse(res).url)
             self.url=JSON.parse(res).url;
             self.headicon="https://m.scxxsx.com"+JSON.parse(res).url;
             self.bao();
           }).catch(res => {});
        }
      });
    },
    gouserInfo() {
      this.useryin = true;
      let goCarlist = {
        cmd: "myInfo",
        cid: this.cid
      };
      Request.postRequest(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.ResMobile = res.mobile;
            console.log(this.ResMobile);
            this.username = res.nickName; //昵称
            this.mobile = `${res.mobile.slice(0, 3)}****${res.mobile.slice(
              -4
            )}`; //手机号
            this.headicon = res.headImage; //头像
          }
        })
        .catch(res => {});
    },
    bao() {
      let goCarlist = {
        cmd: "updateMyInfo",
        cid: this.cid,
        headImage: this.url,
        nickName: this.username
      };
      Request.postRequest(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == "0") {
            console.log(res);
            this.gouserInfo();
            // this.headImage = this.url;
            wx.showToast({
              title: "修改成功"
            });
          }else{
            wx.showToast({
              title:"该手机号已绑定",
              icon:'none'
            })
          }
        })
        .catch(res => {});
    
    },
    goModify() {
      wx.navigateTo({
        url: "/pages/my/changeMoblie" 
      });
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      border-top: 1px solid #eee;

      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #333;
        padding: 0.4rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;

        .modify_right {
          display: flex;
          justify-content: space-between;
          align-items: center;

          img {
            width: 1.8rem;
            height: 1.8rem;
          }

          input {
            text-align: right;
          }
        }
      }
    }
  }
}

.button {
  margin-top: 30px;
  padding: 10px 5px;
  box-sizing: border-box;

  button {
    display: block;
    height: 45px;
    background: #72D241;
    border-radius: 6px;
    color: #fff;
    line-height: 45px;
    text-align: center;
    font-size: 17px;
  }
}
</style>
