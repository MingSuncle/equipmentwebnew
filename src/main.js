import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import './assets/global.css';
import request from "@/utils/request";
import api from "@/api/index.js"


Vue.config.productionTip = false
Vue.prototype.$api = api;
Vue.prototype.request=request

Vue.use(ElementUI,{size:"mini"});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
