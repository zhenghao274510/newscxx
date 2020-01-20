<template>
  <div class="box">
    <div class="search">
      <input type="text" v-model="keywords" placeholder="请输入关键字" @confirm="search" />
      <span @click="search">搜索</span>
    </div>
    <map
      :longitude="longitude"
      :latitude="latitude"
      id="mymap"
      scale="17"
      show-location
      :markers="markers"
    ></map>
    <ul class="searchList">
      <li v-for="(item,index) in searchList" :key="index" @click="setAddress(item)">
        <!--根据需求渲染相应数据-->
        <!--渲染地址title-->
        <div>
          <p style="text-align:left;font-size:14px;">{{item.title}}</p>
          <p style="font-size:12px;color:#666;text-align:left;margin-top:5px;">{{item.address}}</p>
        </div>
        <van-icon name="checked" v-if="current==index" size="16" color="#72D241" />
      </li>
    </ul>
  </div>
</template>

<script>
//import 《组件名称》 from '《组件路径》';
import QQMapWX from "@/common/jsdk/qqmap-wx-jssdk";
export default {
  data() {
    return {
      qqMapSdk: "",
      longitude: "",
      latitude: "",
      markers: [],
      keywords: "",
      searchList: [],
      LoadList: [],
      adduser: {},
      current: 0
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //import引入的组件需要注入到对象中才能使用
  components: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  onLoad() {
    this.qqMapSdk = new QQMapWX({
      key: "JYKBZ-NJNCU-GVDVC-B3RUD-AA5EH-3PFYT"
    });
    this.getCurPositions();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {
    getCurPositions() {
      let self = this;
      wx.getLocation({
        type: "gcj02", //返回可以用于wx.openLocation的经纬度
        success(res) {
          self.latitude = res.latitude;
          self.longitude = res.longitude;
          self.qqMapSdk.reverseGeocoder({
            get_poi: 1,
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function(res) {
              console.log(res.result);
              var result = res.result;
              self.searchList = result.pois;

              //  当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用

              // for (var i = 0; i < result.pois.length; i++) {
              //   self.markers.push({
              //     // 获取返回结果，放到markers数组中
              //     title: result.pois[i].title,
              //     address: result.pois[i].address,
              //     id: result.pois[i].id,
              //     latitude: result.pois[i].location.lat,
              //     longitude: result.pois[i].location.lng,
              //     iconPath: "/static/img/dingwei.png", //图标路径
              //     width: 20,
              //     height: 30
              //   });
              // }
            }
          });
        }
      });
    },
    search() {
      let self = this;
      self.qqMapSdk.getSuggestion({
        keyword: self.keywords, //用户输入的关键词，可设置固定值,如keyword:'KFC'
        success: function(res) {
          //搜索成功后的回调
          console.log(res);
          self.clear();
          // self.center=res.data[0].location;
          self.searchList = res.data;
          for (var i = 0; i < res.data.length; i++) {
            self.markers.push({
              // 获取返回结果，放到sug数组中
              title: res.data[i].title,
              id: res.data[i].id,
              address: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              iconPath: "/static/img/dingwei.png", //图标路径
              width: 20,
              height: 30
            });
          }
        }
      });
    },
    clear() {
      this.searchList = [];
      this.markers = [];
    },
    setAddress(item) {
      console.log(item);
      if (item.ad_info != undefined) {
        this.adduser.province = item.ad_info.province;
        this.adduser.city = item.ad_info.city;
        this.adduser.town = item.ad_info.district;
      } else {
        this.adduser.province = item.province;
        this.adduser.city = item.city;
        this.adduser.town = item.district;
      }

      this.adduser.addr = item.address;
      this.adduser.add = item.title;
      this.adduser.lat = item.location.lat;
      this.adduser.lng = item.location.lng;

      wx.setStorageSync("adduser", JSON.stringify(this.adduser));
      this.$router.go(-1);
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
<style>
page {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
.box,
#mymap {
  width: 100%;
  height: 400px;
  overflow: hidden;
}
.searchList {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
  overflow-y: scroll;
  background: #fff;
}
.searchList li {
  padding: 5px 10px;
  height: 40px;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.searchList li div p {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.search {
  width: 70%;
  height: 30px;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search input {
  flex: 1;
  /* border:1px solid #ccc; */
  height: 30px;
  padding-left: 10px;
  font-size: 13px;
  background: #eee;
}
.search span {
  font-size: 13px;
  height: 30px;
  display: block;
  line-height: 30px;
  margin-left: 20px;
}
</style>