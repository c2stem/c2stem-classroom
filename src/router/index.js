import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Explore from "../views/Explore.vue";
import Construct from "../views/Construct.vue";
import Manipulate from "../views/Manipulate.vue";
import ManipulateCode from "../views/ManipulateCode.vue";
import Landing from "../views/LandingPage.vue";

import AST from "../views/visualize/AST.vue";
import List from "../views/visualize/List.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/visualize/ast",
    name: "AST",
    component: AST,
  },
  {
    path: "/visualize/list",
    name: "Action View Representation",
    component: List,
  },
  {
    path: "/explore",
    name: "Explore View",
    component: Explore,
  },
  {
    path: "/construct",
    name: "Construct View",
    component: Construct,
  },
  {
    path: "/manipulate",
    name: "Manipulate View",
    component: Manipulate,
  },
  {
    path: "/manipulate/code",
    name: "Manipulate Code View",
    component: ManipulateCode,
  },
  {
    path: "/:NotFound(.*)",
    name: "PageNotFound",
    component: PageNotFound,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
