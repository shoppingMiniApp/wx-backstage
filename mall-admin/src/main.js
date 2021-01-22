import Vue from "vue/dist/vue.js";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import VueRouter from "vue-router";
import axios from '@/myaxios'

Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.use(Antd);
Vue.prototype.myaxios = axios

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
