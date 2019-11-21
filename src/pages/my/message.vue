<template>
  <div class="list">
    <div class="msg-box">
      <ul class="msg">
        <li v-for="(v,k) in msg" :key="k" @click.stop="goDetail(v,v.id)">
          <div class="xiaoxian">
            <img src="/static/img/xiaoxi01.png" alt />
          </div>
          <div class="msg-right">
            <div class="msg-top">
              <h3>{{v.title}}</h3>
              <span>{{v.adtime}}</span>
            </div>
            <div class="msg-bottom">
              <p>{{v.content}}</p>
              <img src="/static/img/delete.png" alt @click.stop="del(k,v.id)" />
            </div>
          </div>
        </li>
      </ul>
      <div class="no" v-if="noMessage">暂无系统消息</div>
        <div class="loading" v-if="more">
            <span>没有更多了</span>
          </div>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      totalPage: 2,
      page: 1,
      list: [],
      msg: [],
      more: false,
      cid: "",
      leaderid: "",
      noMessage:false
    };
  },
  components: {},
  onLoad() {
    wx.setNavigationBarTitle({
      title: "消息中心"
    });
    this.msg = [];
  },
  onShow() {
    this.msg = []
    if (wx.getStorageSync("user")) {
      this.cid = JSON.parse(wx.getStorageSync("user")).cid;
      this.beginLoading();
    } else {
      wx.showModal({
        title: "温馨提醒！",
        content: "你还没有绑定手机号,请先绑定手机号,确认信息",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/bind/bindtell"
            });
          }
        }
      });
    }
  },
  computed: {
    showMsg() {
      return this.msg.length;
    }
  },
  onReachBottom() {
    console.log("到底了");
    // let self=this;
    console.log(this.page, this.totalPage);
    if (this.page < this.totalPage) {
      this.page += 1;
      this.beginLoading();
    } else {
      this.more = true;
    }
  },
  methods: {
    beginLoading() {
      let datas = {
        cmd: "infoList",
        cid: this.cid,
        pageNow: this.page
      };
      console.log(datas);
      Request.postRequest(datas)
        .then(res => {
          console.log(res);
          if (res.result == 0){
            this.totalPage = res.totalPage;
            for (let i in res.dataList) {
              this.msg.push(res.dataList[i]);
            }
            console.log(this.msg);
            if(this.msg.length==0){
              this.noMessage=true;
            }
          }
        })
        .catch(res => {});
    },
    del(index, id) {
      console.log(11111)
      let datas = {
        cmd: "deleteInfo",
        id: id
      };
      Request.postRequest(datas)
        .then(res => {
          if (res.result == 0) {
            wx.showToast({
              title: "删除成功",
              icon: "none"
            });
          }
        })
        .catch(res => {
          wx.showToast({
            title: "删除失败",
            icon: "none"
          });
        });
      this.msg.splice(index, 1);
      if (this.msg.length == 0) {
        this.noMessage = true;
      }
    },
    //  "type":"0",//类型 0系统消息 1订单消息 2提现消息
    goDetail(v, id) {
      if (v.type == 1) {
        if (v.orderType != undefined) {
          let obj = { direct: v.orderType, id: v.orderId };
          if (v.orderType == 0) {
            wx.navigateTo({
              url: "/pages/order/orderdetials?id=" + JSON.stringify(obj)
            });
          } else {
            wx.navigateTo({
              url: "/pages/order/pinorderdetials?id=" + JSON.stringify(obj)
            });
          }
        } else {
          wx.showToast({
            title:'订单不存在!请确认',
            icon:'none'
          })
        }
      } else if (v.type ==0) {
        wx.showToast({
          title:'这个消息内容只有这么多了!',
          icon:'none'
        })
      } else {
        wx.navigateTo({
          url: "/pages/my/tuanzhangcenter/zhangdan?direct=" + 0
        });
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.systom {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
}
.no {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  color: #333;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 25;
}

.list {
  width: 100%;
  height: 100%;

  .msg-box {
    width: 100%;

    .msg {
      width: 100%;
      padding: 0 0.4rem;
      box-sizing: border-box;
      border-top: 1px solid #eee;

      li {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3rem 0;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;

        .xiaoxian {
          position: relative;
          width: 39px;
          height: 39px;

          img {
            width: 100%;
            height: 100%;
          }

          .xiaob {
            position: absolute;
            right: -10px;
            top: 0px;
            background: red;
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }
        }

        .msg-right {
          width: 85%;
          height: 1.3rem;
          padding: 0 0 0 0.3rem;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .msg-top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #333;

            h3 {
              font-size: 15px;
            }
          }

          .msg-bottom {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #333;

            p {
              width: 80%;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            img {
              width: 0.35rem;
              height: 0.35rem;
            }
          }
        }
      }
    }
  }
}
</style>
