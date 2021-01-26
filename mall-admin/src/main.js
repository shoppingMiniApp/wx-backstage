import Vue from "vue/dist/vue.js";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import VueRouter from "vue-router";

import Router from "vue-router";
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
import axios from "axios";
Vue.prototype.$axios = axios;
axios.defaults.baseURL = "http://api_devs.wanxikeji.cn/";

Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.use(Antd);



new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
