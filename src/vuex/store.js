import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        ordertarba:3,
        login:false,
        user:{}
      }, 
      //  修改 全局数据
      mutations: {    
        increment: (state,val) => {
          state.ordertarba= val
        },    
        decrement: (state) => {
          state.count -= 1
        }
      }     
    })