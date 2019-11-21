<template>
  <div class="problem-box">
    <div class="problem-zi">
      <ul>
        <li v-for="(item,index) in list" :key="index" @click="problemDetails(item.url)">
          <span>{{item.title}}</span>
          <span>
            <img src="/static/img/right.png" alt />
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Request from "@/common/js/request";
export default {
  data() {
    return {
      list: []
    };
  },
  components: {},
  onLoad() {
    this.getshop();
    wx.setNavigationBarTitle({
      title: "常见问题"
    });
  },
  mounted() {},
  methods: {
    problemDetails(url) {
      wx.setStorageSync("url", url);

      wx.navigateTo({
        url: "/pages/upSet/problemDetials"
      });
    },
    getshop() {
      let goCarlist = {
        cmd: "commonProblems"
      };
      Request.postRequest(goCarlist)
        .then(res => {
          console.log(res);
          if (res.result == 0) {
            this.list = res.dataList;
            console.log(this.list);
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.problem-zi {
  border-top: 1px solid #dedede;

  ul {
    li {
      padding: 0 30px;
      font-size: 16px;
      line-height: 40px;
      border-bottom: 1px solid #dedede;
      display: flex;
      justify-content: space-between;

      span {
        color: #000;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>