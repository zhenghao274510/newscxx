<template>
  <div class="contain">
    <div class="box">
      <div class="shop">
        <img :src="orders.simage" alt />
        <span>{{orders.sname}}</span>
      </div>
      <ul class="list">
        <li v-for="(x,l) in ordershop" :key="l">
          <div class="list_order">
            <img :src="x.image" alt />
            <div class="list_right">
              <span>{{x.name}}</span>
              <van-rate v-model="value[l]" size="16" @change="stars" :id="l" />
            </div>
          </div>
          <div class="message">
            <editor placeholder="请输入您对商品的评价信息" @blur="onChange" :id="l"></editor>
            <ul>
              <li v-for="(v,k) in imgs[l]" :key="k">
                <img :src="v" alt @click.stop="del(k,l)" />
                <div class="del" @click.stop="del(k,l)">X</div>
              </li>
              <li @click="onRead(l)" v-if="imgs[l].length<=2">
                <img src="/static/img/photo.png" alt />
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="button" @click="bao">
        <span>提交</span>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      datas: "提交",
      value: [],
      contxt: [],
      imgs: [],
      IMG: [],
      orders: [], //订单详情全部
      ordershop: [], //商品数据
      imgID: [],
      orderId: "",
      img: []
    };
  },
  components: {},
  onLoad(options) {
    this.orderId = options.ids;
    this.orderDetail(this.orderId);
    this.cid = JSON.parse(wx.getStorageSync("user")).cid;
  },
  mounted() {},
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
  methods: {
    onChange(e) {
      let k = e.target.id;
      this.contxt[k] = e.mp.detail.text;
    },
    bao() {
      let evaluate = [];
      for (let i in this.ordershop) {
        let evaluateI = {};
        evaluateI.itemId = this.ordershop[i].itemId;
        evaluateI.stars = this.value[i];
        evaluateI.content = this.contxt[i];
        evaluateI.upload = this.img[i].join("|");
        evaluate.push(evaluateI);
      }
      let evaluateOrder = {
        cmd: "evaluateOrder",
        orderId: this.orderId,
        cid: this.cid,
        evaluates: evaluate
      };
      console.log(evaluateOrder);
      Request.postRequest(evaluateOrder)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            wx.showToast({
              title: res.resultNote
            });
            // Toast(res.data.resultNote);
            setTimeout(() => {
              this.$router.go(-1);
            }, 500);
          }
        })
        .catch(res => {});
    },
    stars(e){
     console.log(e)
     let k = e.target.id;
      this.value[k] = e.mp.detail;
      console.log(this.value)
    },
    onRead(l) {
      console.log(l);
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
              self.imgs.push('');
              self.imgs.pop();
              self.imgs[l].push("https://m.scxxsx.com" + JSON.parse(res).url);
              // console.log( self.imgs[l])
              self.img[l].push(JSON.parse(res).url);
              //  self.imgID[l]=self.img[l].join('|');
            })
            .catch(res => {});
        }
      });
    },
    txt(e) {
      let k = e.target.id;
      this.texts[k] = e.mp.detail.text;
    },
    del(k, l) {
      console.log(k, l);
      this.imgs.push([]);
      this.imgs.pop();
      this.imgs[l].splice(k, 1);
    },
    orderDetail(id) {
      let orderDetail = {
        cmd: "orderDetail",
        id: id
      };
      console.log(orderDetail);
      Request.postRequest(orderDetail)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.orders = res;
            this.ordershop = res.goods;
            for (let i in res.goods) {
              this.imgs[i] = [];
              this.img[i] = [];
              this.value[i] = 5;
            }
            console.log(this.imgs[i]);
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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

.contain {
  width: 100%;
  padding-bottom: 100px;
  box-sizing: border-box;

  .box {
    width: 100%;
    display: flex;
    flex-direction: column;

    .shop {
      width: 100%;
      height: 2.5rem;
      display: flex;
      align-items: center;
      padding: 0 0.4rem;
      box-sizing: border-box;
      font-size: 14px;
      color: #333;
      border-top: 1px solid #eee;
      border-bottom: 8px solid #f5f5f5;

      img {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
      }

      span {
        margin-left: 0.3rem;
      }
    }

    .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 0.4rem;
      box-sizing: border-box;
      font-size: 14px;
      color: #333;

      li {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0.3rem 0;

        .list_order {
          width: 100%;
          display: flex;

          img {
            width: 1.8rem;
            height: 1.8rem;
          }

          .list_right {
            flex: 1;
            height: 2rem;
            padding: 0.2rem 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 0.3rem;
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
                width: 100%;
                height: 100%;
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
      }
    }
  }
}
</style>
