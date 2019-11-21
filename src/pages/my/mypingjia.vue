<template>
  <div class="problem-box">
    <div class="box">
        <ul v-if="dataList.length!=0">
          <li v-for="(v,k) in dataList" :key="k">
            <div class="wrapper">
              <img :src="v.headImage" alt class="imgtop" lazy-load />
              <div class="s_right">
                <p>
                  {{v.nickName}}
                  <span @click.stop="del(v.id,k)">删除</span>
                </p>
                <div class="s_top">
                  <div class="ping">
                    <van-rate :value="v.stars" :size="12" disabled disabled-color="rgb(255,210,30)" />
                    <span>{{v.stars}}.0</span>
                  </div>
                  <p>{{v.createTime}}</p>
                </div>
              </div>
            </div>
            <p class="s_content">{{v.content}}</p>
            <div v-if="v.images==[]"></div>
            <div v-else style="margin-bottom:10px">
              <img :src="i" alt v-for="(i,s) in v.images" :key="s" />
            </div>
            <div class="to_shop" @click.stop="shang(v.sid)">
              <div class="main">
                <img :src="v.simg" alt lazy-load  @click.stop="seecomment(k,s)"  />
                <div>{{v.sname}}</div>
                <img src="/static/img/right.png" alt class="shop_right" />
              </div>
            </div>
          </li>
        </ul>
        <div class="no" v-else>你还没有评论</div>
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
      dataList: [],
      cid:'',
      more:false
    };
  },
  components: {
  },
  onLoad() {
      wx.setNavigationBarTitle({
      title: "我的评价"
    });
    this.dataList=[];
  },
   onShareAppMessage() {
     return this.$share.share()
   },
  mounted() {
    this.cid=JSON.parse(wx.getStorageSync("user")).cid;
      this.evaluteList();
  },
    onReachBottom() {
      console.log('到底了')
      // let self=this;
      console.log(this.page,this.totalPage)
      if (this.page < this.totalPage) {
        this.page += 1;
        this.evaluteList(this.active, this.page);
      } else {
       this.more=true;
      }
    },
  methods: {
    //   图片预览
      seecomment(k,inx) {
      wx.previewImage({
        // 当前展示
        current: this.dataList[k].images[inx],
        //  要展示的数组
        urls: this.dataList[k].images
      });
    },
    evaluteList() {
      let evaluteList = {
        cmd: "evaluteList",
        cid: this.cid,
        pageNow: this.page
      };
      console.log(evaluteList);
      Request.postRequest(evaluteList)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.totalPage = res.totalPage;
            for(let i in res.dataList){
              res.dataList[i].createTime=res.dataList[i].createTime.replace(/\./g,'-');
              this.dataList.push(res.dataList[i]);
            }
            // this.dataList = res.dataList;
          }
        })
        .catch(res => {});
    },
    del(id,k) {
      console.log("删除", id);
      let deleteEvalute = {
        cmd: "deleteEvalute",
        id: id
      };
      Request.postRequest(deleteEvalute)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
           this.dataList.splice(k, 1);
          }
        })
        .catch(res => {});
    },
    shang(ID) {
      // this.$router.push("/pages/shopdetails/index");
      wx.navigateTo({
        url:"/pages/shopdetails/index?id="+ID
      })
      // let IDs = {};
      // IDs.id = ID;
      // wx.setStorage({
      //   key:"shangID",
      //   data:JSON.stringify(IDs)
      // })
      // localStorage.setItem("shangID", JSON.stringify(IDs));
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.box {
  padding:10px 0;
}

.order_list {
  width: 100%;
  position: relative;

  .order_wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}

ul {
  width: 100%;
  display: flex;
  flex-direction: column;

  li {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 0.4rem;
    box-sizing: border-box;
    margin-bottom:10px;

    a {
      display: block;
      width: 100%;
      height: 100%;
    }

    img {
      width: 1rem;
      height: 1rem;
    }

    .wrapper {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .s_right {
      padding: 0 5px;
      width: 100%;

      p {
        display: flex;
        justify-content: space-between;
        font-size: 16px;

        span {
          color: green;
        }
      }

      .s_top {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;

        .ping {
          display: flex;

          span {
            padding-left: 5px;
          }
        }
      }
    }

    .s_content {
      line-height: 1rem;
      color: #818080;
    }

    .to_shop {
      padding: 10px 15px;
      position: relative;
      height: 1rem;
      background:#F8F8F8;

      .main {
        display: flex;
        justify-content: flex-start;

        div {
          margin-left: 10px;
          line-height: 1rem;
          font-size: 18px;
        }
      }

      .shop_right {
        position: absolute;
        right: 15px;
        top: 20px;
        width: 0.5rem;
        height: 0.5rem;
      }
    }
  }
}
.no{
  text-align:center;
  margin-top:50px;
}
</style>