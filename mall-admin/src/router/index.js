import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("../views/login.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/main.vue"),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        next();
      }
    },
    children: [
      {
        path: "/managerAccount",
        name: "managerAccount",
        component: () => import("../views/pages/managerAccount.vue"),
      },
      {
        path: "/account",
        name: "account",
        component: () => import("../views/pages/account.vue"),
      },
      {
        path: "/sortModify",
        name: "sortModify",
        component: () => import("../views/pages/sortModify.vue"),
      },
      {
        path: "/itemModify",
        name: "itemModify",
        component: () => import("../views/pages/itemModify.vue"),
      },
      {
        path: "/bannerModify",
        name: "bannerModify",
        component: () => import("../views/pages/bannerModify.vue"),
      },
      {
        path: "/orderModify",
        name: "orderModify",
        component: () => import("../views/pages/orderModify.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
