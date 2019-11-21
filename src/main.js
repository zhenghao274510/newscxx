import Vue from 'vue'
import App from './App'
import Request from '@/common/js/request'
// showTabBarRedDot
const getnum=(cid)=>{
  let parmas = {
    cmd: "cartCount",
    cid: cid,
    flag:"1"
  };
  Request.noLoading(parmas).then(res => {
    console.log(res)
    let result=res.totalCount+''
    console.log(result);
    wx.setTabBarBadge({
      index: 3,
      text: result
    });
  });
}

import store from '@/vuex/store'
//  兼容 vue  push replace 写法
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$api={getnum};
Vue.prototype.$share=Request;

const app = new Vue({
  ...App,
  store
})
app.$mount()
