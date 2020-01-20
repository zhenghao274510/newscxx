<template>
  <div class="contain" ref="list">
    <!-- <div class="top">
      <ul class="head">
        <li
          v-for="(item,index) in title "
          :key="index"
          :class="{'active':activeT==index}"
          @click="changactive(index)"
        >
          {{item.name}}
          <span v-if="item.count!=0">{{item.count}}</span>
        </li>
      </ul>
    </div> -->

    <div class="bianji">
      <div @click.stop="goEditor(shan)" v-if="dataList.length!=0">{{bianji}}</div>
    </div>

    <div class="lists" v-if="wei==false">
      <div class="uls" v-if="NOcart==false">
        <div v-for="(v,k) in dataList" :key="k">
          <div class="shop_all">
            <van-checkbox
              v-model="v.check"
              checked-color="#07c160"
              @click.stop="goOrder(k)"
            >{{v.title}}</van-checkbox>
          </div>
          <ul>
            <li v-for="(ite,ind) in v.items" :key="ind" @click.stop="gitto(ite.gid)">
              <van-checkbox v-model="ite.check" checked-color="#07c160" @click.stop="goShop(k,ind)"></van-checkbox>
              <div class="order">
                <img :src="ite.url" alt lazy-load />
                <div class="order_detail">
                  <h2>{{ite.name}}</h2>
                  <span style="color: #999">{{ite.kg}}</span>
                  <div class="changenum">
                    <span style="color: red;font-size: 16px;font-weight: 600;">￥{{ite.new}}</span>
                    <span class="fix fixnum" v-if="shan==false">x {{ite.number}}</span>
                    <div class="buynum" v-else @click.stop>
                      <span @click.stop="delnum(ite)">-</span>
                      <input type="number" v-model="ite.number" />
                      <span @click.stop="add(ite)">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="nomore"></div>
      </div>
      <div v-else class="kongbai">
        <img src="/static/img/bg.png" />
        <span @click.stop="gotoHome">去首页逛逛</span>
      </div>
    </div>

    <div class="finish" v-if="dataList.length!=0">
      <div>
        <van-checkbox v-model="checked" checked-color="#07c160" @click.stop="allOrder">全选</van-checkbox>
      </div>
      <div class="total" v-if="shan==false">
        合计：
        <span style="color: red;font-weight: 600;">￥{{total}}</span>
      </div>
      <div class="count" @click.stop="goCenter" v-if="shan==false">结算</div>
      <div class="count counts" @click.stop="del" v-else>删除</div>
    </div>
    <sec-footer :tabarA="a" :cartnum="cartnum"></sec-footer>
  </div>
</template>

<script>
import Request from "@/common/js/request";
import secFooter from "@/components/SecFooter"
export default {
  data() {
    return {
      a:3,
      cartnum:0,
      activeT: 0,
      // title: [
      //   { name: "精品购物车", count: "" },
      //   { name: "拼团购物车", count: "" },
      //   { name: "拿货团购物车", count: "" }
      // ],
      title: [
        { name: "精品购物车", count: "" }
      ],
      num: 3,
      active: 2,
      checked: false,
      dataList: [],
      gou: 0,
      NOcart: false,
      yin: false,
      wei: false,
      shan: false,
      bianji: "编辑",
      cid: ""
    };
  },
  components:{
    secFooter
  },
  onShareAppMessage() {
    return {
      title: "山城乡鲜",
      desc:
        "山城乡鲜是一个专注于健康食品，包括水果、蔬菜、肉类、特产、海鲜、无公害及高品质的有机农产品等优质生鲜食材采购，并配套新鲜物流的服务平台。",
      path: "" // 路径，传递参数到指定页面。
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: "购物车"
    });
  },
  components: {
    secFooter
  },
  computed: {
    total() {
      let count = 0;
      for (let i = 0; i < this.dataList.length; i++) {
        for (let j = 0; j < this.dataList[i].items.length; j++) {
          if (this.dataList[i].items[j].check) {
            count +=
              Number(this.dataList[i].items[j].new) *
              Number(this.dataList[i].items[j].number);
          }
          count = Math.floor(count * 100) / 100;
        }
      }
      return count;
    }
  },
  onShow() {
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
     }
      if (this.cid == undefined ||this.cid=="") {
        this.dataList.length=0;
        wx.showModal({
          title: "温馨提醒！",
          content: "你还没有登录，请先登录",
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/author/index"
              });
            } else if (res.cancel) {
              console.log("quxiao");
            }
          }
        });
      } else {
        this.checked = false;
        this.yin = false;
        this.gounum();
        this.gocarlist(this.cid);
      }
   
  },
  methods: {
    add(item) {
      console.log(item);
      item.number += 1;
      this.updateCar(item, item.number);
    },
    delnum(item) {
      console.log(item);
      if (item.number > 1) {
        item.number -= 1;
        this.updateCar(item, item.number);
      }
    },
    changactive(ind) {
      this.activeT = ind;
      this.dataList = [];
      if (this.title[ind].count == 0) {
        this.NOcart = true;
      } else {
        this.gocarlist();
      }
      this.checked = false;
    },

    gitto(id) {
      console.log(id);
      let obj = { type: this.activeT, id: id };
      if (this.activeT == 1) {
        wx.navigateTo({
          url: "/pages/pintuan/gooddetailspin?id=" + JSON.stringify(obj)
        });
      } else {
        wx.navigateTo({
          url: "/pages/Good/gooddetials?id=" + JSON.stringify(obj)
        });
      }

      // let ID = {};
      // ID.id = id;
      // wx.setStorageSync("cart-shopID", JSON.stringify(ID));
    },
    //去首页
    gotoHome() {
      console.log(1)
      this.$router.replace({path:'/pages/tarba/home'})
    },
    gocarlist() {
      let golist = {
        cmd: "carList",
        cid: this.cid,
        type: this.activeT
      };
      console.log(golist);
      Request.postRequest(golist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.dataList = [];
            if (this.dataList.length == 0) {
              this.checked = false;
            }
            for (let i in res.dataList) {
              let carlist = {};
              carlist.check = false;
              carlist.title = res.dataList[i].sname;
              carlist.id = res.dataList[i].sid;
              carlist.items = [];
              for (let j in res.dataList[i].cars) {
                let carlistzi = {};
                carlistzi.name = res.dataList[i].cars[j].name;
                carlistzi.new = res.dataList[i].cars[j].price;
                carlistzi.old = res.dataList[i].cars[j].originalPrice;
                carlistzi.skuid = res.dataList[i].cars[j].specifications;
                carlistzi.kg = res.dataList[i].cars[j].specificationsVal;
                carlistzi.url = res.dataList[i].cars[j].image;
                carlistzi.id = res.dataList[i].cars[j].id;
                carlistzi.gid = res.dataList[i].cars[j].gid;
                carlistzi.number = res.dataList[i].cars[j].number;
                carlistzi.check = false;
                carlist.items.push(carlistzi);
              }
              this.dataList.push(carlist);
            }
            if (this.dataList.length > 0) {
              this.NOcart = false;
              this.yin = true;
            } else {
              this.NOcart = true;
              this.yin = false;
            }
            console.log(this.dataList);
            // localStorage.setItem("gocarlist", JSON.stringify(this.dataList));
          }
        })
        .catch(res => {});
    },
    gounum() {
      let datas = {
        cmd: "cartCount",
        cid: this.cid,
        flag: "1"
      };
      Request.noLoading(datas)
        .then(res => {
          console.log(res);
          this.cartnum=res.totalCount;
          if (res.result == 0) {
            this.title[0].count = res.jingpin;
            this.title[1].count = res.pint;
            // this.title[2].count = res.naht;
            if (res.jingpin != 0) {
              this.activeT = 0;
            } else {
              if (res.pint != 0) {
                this.activeT = 1;
              } else {
                this.activeT = 0;
              }
              //  if(res.naht!=0){
              //   this.activeT = 2;
              // }else
            }

            let result = res.totalCount + "";
            if (res.totalCount == 0) {
              this.NOcart = true;
            } else {
              this.gocarlist();
            }
            console.log(result);
            wx.setTabBarBadge({
              index: 3,
              text: result
            });
          } else {
            wx.showToast({
              title: res.resultNode,
              icon: "none"
            });
          }
        })
        .catch(res => {});
    },
    allOrder() {
      this.checked = !this.checked;
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].check = this.checked;
        for (let j = 0; j < this.dataList[i].items.length; j++) {
          this.dataList[i].items[j].check = this.checked;
        }
      }
    },
    goOrder(k) {
      console.log(k);
      this.dataList[k].check = !this.dataList[k].check;
      //判断下面各个店面产品的选择
      if (this.dataList[k].check) {
        //判断下面各个店面产品的选择
        for (let j = 0; j < this.dataList[k].items.length; j++) {
          this.dataList[k].items[j].check = true;
        }
        //判断总选择结算复选框
        var state = true;
        for (let i = 0; i < this.dataList.length; i++) {
          if (!this.dataList[i].check) {
            state = false;
          }
        }
        if (state) {
          this.checked = true;
        }
      } else {
        for (let j = 0; j < this.dataList[k].items.length; j++) {
          this.dataList[k].items[j].check = false;
        }
        //判断总选择结算复选框
        this.checked = false;
      }
    },
    goShop(ind, index) {
      this.dataList[ind].items[index].check = !this.dataList[ind].items[index]
        .check;
      for (let i = 0; i < this.dataList.length; i++) {
        var num = 0;
        for (let j = 0; j < this.dataList[i].items.length; j++) {
          if (this.dataList[i].items[j].check) {
            num = num + 1;
          } else {
            num = num - 1;
          }
        }
        if (num == this.dataList[i].items.length) {
          this.dataList[i].check = true;
          var state = true;
          for (let i = 0; i < this.dataList.length; i++) {
            if (!this.dataList[i].check) {
              state = false;
            }
          }
          if (state) {
            this.checked = true;
          }
        } else if (num >= -parseInt(this.dataList[i].items.length)) {
          this.dataList[i].check = false;
          this.checked = false;
        }
      }
    },
    goEditor(i) {
      if (i == false) {
        this.bianji = "完成";
        this.shan = true;
      } else {
        this.bianji = "编辑";
        this.shan = false;
        // this.gocarlist(this.cid);
      }
    },
    goCenter() {
      let num = 0;
      for (let i in this.dataList) {
        for (let j in this.dataList[i].items) {
          if (this.dataList[i].items[j].check) {
            num += 1;
          }
        }
      }
      wx.setStorageSync("car", JSON.stringify(this.dataList));

      if (num > 0) {
        if (this.activeT == 1) {
          wx.navigateTo({
            url: "/pages/pintuan/pintuanSub"
          });
        } else {
          let obj = { direct: this.activeT };
          wx.navigateTo({
            url: "/pages/order/finishorder?id=" + JSON.stringify(obj)
          });
        }
      } else if (num == 0) {
        wx.showToast({
          title: "请选择商品"
        });
      }
    },
    updateCar(item, number) {
      console.log(item, number);
      let updateCar = {
        cmd: "updateCar",
        cars: item.id + "-" + number
      };
      Request.noLoading(updateCar)
        .then(res => {
          console.log(res);
        })
        .catch(res => {});
    },
    del() {
      for (let i = 0; i < this.dataList.length; i++) {
        let delcar = this.dataList[i].items.filter(function(item) {
          return item.check;
        });
        if (delcar.length != 0) {
          for (let j in delcar) {
            this.delete(delcar[j]);
          }
        }
      }
    },
    delete(car) {
      console.log(car.id);
      let detele = {
        cmd: "carDelete",
        ids: car.id,
        cid: this.cid
      };
      Request.postRequest(detele)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            // wx.removeStorageSync("gocarlist");
            this.gocarlist(this.cid);
            this.gounum();
          }
        })
        .catch(res => {});
    }
  }
};
</script>
<style>
page {
  width: 100%;
}
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
.nomore {
  height: 90px;
}

.kongbai {
  // height: 100%;
  width: 100%;
  position: relative;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  span {
    display: block;
    margin: 0 auto;
    margin-top: 270px;
    width: 200px;
    font-size: 20px;
    color: #fff;
    background: green;
    border-radius: 5px;
    padding: 5px 10px;
    text-align: center;
  }
}

.contain {
  width: 100%;
  height: 100%;
  padding-bottom: 60px;
  box-sizing: border-box;

  .top {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: #fff;

    .head {
      width: 100px;
      margin: 20px auto;
      // width:100%;
      // padding: 20px 50px 0 50px;
      // border: 1px solid #ccc;
      border-radius: 20px;
      box-sizing: border-box;
      height: 33px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      justify-content: centr;

      li {
        padding: 0 15px;
        font-size: 14px;
        border-radius: 20px;
        color: #72D241;
        height: 33px;
        line-height: 33px;
        position: relative;
        border-radius: 20px;
        text-align: center;

        span {
          position: absolute;
          top: 0;
          right: 0;
          width: 15px;
          height: 15px;
          line-height: 15px;
          text-align: center;
          border-radius: 50%;
          color: #fff;
          background: red;
          display: block;
          font-size: 14px;
        }
      }

      .one {
        border-radius: 5px 0 0 5px;
        border-right: none;
      }

      .last {
        border-radius: 0 5px 5px 0;
        border-left: none;
      }

      .active {
        background: #72D241;
        color: #fff;
      }
    }
  }

  .bianji {
    width: 90%;
    margin: 0 auto;
    font-size: 15px;
    text-align: right;
    margin-top: 10px;
    overflow: hidden;

    div {
      float: right;
      height: 30px;
      line-height: 30px;
    }
  }

  .lists {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .uls {
      width: 100%;
      display: flex;
      flex-direction: column;

      .shop_all {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
        font-size: 14px;
        color: #333;
      }

      ul {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        box-sizing: border-box;
        color: #333;
        border-bottom: 10px solid #f5f5f5;

        li {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          overflow: hidden;

          .order {
            width: 90%;
            display: flex;
            align-items: center;
            margin-left: 10px;
            box-sizing: border-box;
            position: relative;

            .fix {
              position: absolute;
              bottom: 0;
              right: 0;
              font-size: 14px;
            }

            .fixnum {
              font-size: 14px;
              color: #333;
              bottom: 10px;
              box-sizing: border-box;
            }

            img {
              width: 110px;
              height: 110px;
            }

            .order_detail {
              width: 70%;
              height: 110px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              font-size: 14px;
              color: #333;
              padding-left: 0.2rem;
              box-sizing: border-box;

              h2 {
                width: 50%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }

              .changenum {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .buynum {
                  display: flex;
                  justify-content: flex-end;
                  align-items: center;

                  span {
                    width: 25px;
                    height: 24px;
                    border: 1px solid #ccc;
                    border-radius: 2rpx;
                    line-height: 24px;
                    text-align: center;
                    font-size: 12px;
                  }

                  input {
                    margin: 0 5px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    text-align: center;
                    border: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .finish {
    position: fixed;
    left: 0;
    bottom:50px;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 0.4rem;
    box-sizing: border-box;
    font-size: 14px;
    color: #333;
    background: #fff;
    z-index: 10;

    .total {
      margin-left: 0.8rem;
    }

    .count {
      width: 35%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: rgb(114, 209, 65);
      color: #fff;
    }

    .counts {
      background: rgb(253, 86, 44);
    }
  }
}

.van-stepper {
  width: 35%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
