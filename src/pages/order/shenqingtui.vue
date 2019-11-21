<template>
  <div class="box">
    <h3>补偿原因</h3>
    <div class="message">
      <editor placeholder="请输入" @input="onChange"></editor>
      <ul>
        <li v-if="imgs!=''">
          <img :src="imgs" alt @click.stop="del" />
          <div class="del" @click.stop="del">X</div>
        </li>
        <li @click="onRead" v-else>
          <img src="/static/img/photo.png" alt />
        </li>
      </ul>
    </div>
    <div class="button" @click="bao">
      <span>提交</span>
    </div>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import Request from "@/common/js/request";
export default {
  data() {
    return {
      content: "",
      imgs: "",
      img: "",
      id: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad(options) {
    this.id = options.ids;
    this.imgs='';
    this.content="";
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    onChange(e) {
      console.log(e);
      this.content = e.mp.detail.text;
      console.log(this.content);
    },
    bao() {
      if (this.content=="") {
        wx.showToast({
          title: "请输入退款原因",
          icon: "none"
        });
      } else if (this.imgs == "") {
        wx.showToast({
          title: "请上传相关图片",
          icon: "none"
        });
      } else {
        let parmas = {
          cmd: "applyRefund",
          id: this.id,
          reason: this.content,
          images: this.img
        };
        console.log(parmas);
        Request.postRequest(parmas)
          .then(res => {
            if (res.result == 0) {
              wx.showToast({
                title: res.resultNote,
                icon: "none"
              });
              setTimeout(() => {
                this.$router.go(-1);
              },500);
            } else {
              wx.showToast({
                title: res.resultNote,
                icon: "none"
              });
            }
          })
          .catch(err => {});
      }
    },
    onRead() {
      // if (this.imgs[l].length <=3) {
      let self = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          Request.postFile(res.tempFiles[0])
            .then(res => {
              self.imgs = "https://m.scxxsx.com" + JSON.parse(res).url;
              // console.log( self.imgs[l])
              self.img = JSON.parse(res).url;
              //  self.imgID[l]=self.img[l].join('|');
            })
            .catch(res => {});
        }
      });
    },
    del() {
      this.imgs = "";
      this.img = "";
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
<style scoped lang="stylus">
.box {
  padding: 0 10px;
}

.button {
  padding: 10px 5px;
  box-sizing: border-box;

  span {
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

.message {
  width: 100%;
  margin-top: 0.3rem;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 0.3rem;
  box-sizing: border-box;
  position: relative;

  editor {
    width: 100%;
    height: 3rem;
    font-size: 14px;
    color: #333;
    border: none;
    resize: none;
    background: #f5f5f5;
  }

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    li {
      width: 22%;
      height: 1.9rem;
      position: relative;
      margin-right: 3%;
      margin-bottom: 3%;
      padding: 0;

      img {
        width:80px;;
        height: 80px;
      }

      .del {
        width: 14px;
        height: 14px;
        background: #333;
        border-radius: 50%;
        line-height: 14px;
        text-align: center;
        font-size: 10px;
        color: #fff;
        position: absolute;
        right: -7px;
        top: -7px;
      }
    }
  }
}
</style>