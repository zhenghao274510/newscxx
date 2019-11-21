<template>
  <div class="tenants-box" ref="box">
    <div class="shuoming">
      <p>请参照以下说明进行</p>
      <p>1.点击复制</p>
      <p>2.打开浏览器</p>
      <p>3.长按搜索框，粘贴，开始下载</p>
    </div>
    <div class="tenants-zi">
      <div class="steps" ref="list">
        <h3>步骤:</h3>
        <rich-text :nodes="txt"></rich-text>
      </div>
      <button class="downLoad" @click="downLoad">复制</button>
    </div>
  </div>
</template>

<script>
// import linUrl from "@/components/webview";
import Request from "@/common/js/request";
export default {
  data() {
    return {
      shopjie: "",
      txt: "",
      ershop: ""
    };
  },
  components: {
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "商家中心"
    });
  },
  mounted() {
    this.getshop();
  },
  onShareAppMessage() {
    return this.$share.share();
  },
  methods: {
    getshop() {
      let goCarlist = {
        cmd: "businessEntry"
      };
      Request.postRequest(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.shopjie = res.alt;
            this.ershop = res.qrCode;
            this.txt = this.escape2Html(res.content);
          }
        })
        .catch(res => {
          // Toast("获取失败");
        });
    },
    downLoad() {
      let url = this.ershop;
      wx.setClipboardData({
        data: url,
        success(res) {
         console.log(res)
        }
      });
    },
    escape2Html(str) {
      var s = "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      s = s.replace(/<br\/>/g, "\n");
      return s;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.tenants-box {
  width: 100%;
  height: 100%;
}

.tenants-zi {
  width: 100%;
  height: 100%;
  padding: 10px 10px 0;
  box-sizing: border-box;
  overflow: hidden;
  margin-top:100px;

  .Qr-code {
    height: 200px;

    div {
      width: 200px;
      margin: 30px auto;
      text-align: center;

      img {
        width: 200rpx;
        height: 200rpx;
      }
    }
  }

  .steps {
    width: 100%;
    // height: 100%;
    padding: 0 0.1rem;
    box-sizing: border-box;
    margin-bottom: 50px;

    h3 {
      padding-bottom: 5px;
    }
  }
}
.shuoming{
   width:100%;
   background:#72D241;
   padding:10px;
   box-sizing:border-box;
   font-size:14px;
   color:#fff;
   position:fixed;
   top:0;
   left:0;
   z-index:99;
}

.downLoad {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height:50px;
  z-index: 99;
  font-size: 14px;
  width: 100%;
  background: #72D241;
  border-radius: 0;
  color: #fff;
}
</style>
