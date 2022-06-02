import Vue from "vue";
import VueRouter from "vue-router";
import adminPage from "@/pages/adminPage.vue";
import coursePage from "@/pages/coursePage.vue";
import homePage from "@/pages/homePage.vue";

const routes = [
  { path: "/", component: homePage },
  { path: "/admin", component: adminPage },
  { path: "/course", component: coursePage },
  { path: "/*", redirect: '/' },
];

const router = new VueRouter({
  mode:'history',
  routes, // short for `routes: routes`
});

Vue.use(VueRouter);

export default router
