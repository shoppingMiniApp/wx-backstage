import Vue from "vue/dist/vue.js";
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import VueRouter from "vue-router";
Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.use(Antd);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
