import Vue from 'vue'
import App from './App'
import store from './store/index'
// App({
//   onLaunch: function () {

//     if (!wx.cloud) {
//       console.error('请使用 2.2.3 或以上的基础库以使用云能力')
//     } else {
//       wx.cloud.init({
//         traceUser: true,
//       })
//     }

//     this.globalData = {}
//   }
// })
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store; //mpvue 不能直接在new Vue的时候传入store

// export default store;
const app = new Vue(App)
app.$mount()
