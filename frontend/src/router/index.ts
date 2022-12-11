import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ExportView from "../views/ExportView.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: (to, from, next) => {
      store.commit("setPassword", "");
      next();
    },
  },
  {
    path: "/:keyword",
    name: "chat",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "chat" */ "../views/MainChatView.vue"),
  },
  {
    path: "/:keyword/export",
    name: "export_view",
    component: ExportView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
