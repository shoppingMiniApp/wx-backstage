import Vue from "vue/dist/vue.js";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import VueRouter from "vue-router";
import axios from '@/myaxios'

import Router from "vue-router";
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.use(Antd);
Vue.prototype.myaxios = axios

// import maxios from './maxios'
// Vue.prototype.maxios = maxios

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
