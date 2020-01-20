import Vue from 'vue'
import App from './App'
import Request from '@/common/js/request'
import store from '@/vuex/store'
//  兼容 vue  push replace 写法
import MpvueRouterPatch from 'mpvue-router-patch'
Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$share = Request;

const app = new Vue({
  ...App,
  store
})
app.$mount()
