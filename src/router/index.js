import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Explore from "../views/Explore.vue";
import Construct from "../views/Construct.vue";
import Manipulate from "../views/Manipulate.vue";
import ManipulateCode from "../views/ManipulateCode.vue";
import Landing from "../views/LandingPage.vue";
import EngineeringDesign from "../views/EngineeringDesign.vue";
import Login from "../views/Login.vue";

import AST from "../views/visualize/AST.vue";
import List from "../views/visualize/List.vue";

const routes = [
  // {
  //   path: "/",
  //   beforeEnter: () => {
  //     location.href = 'https://login.c2stem.org?redirect=http://localhost:8080/land'
  //   },
  // },
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/land",
    name: "Landing",
    component: Landing,
    meta: { requiresAuth : true}
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth : true}
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth : true}
  },
  {
    path: "/visualize/ast",
    name: "AST",
    component: AST,
    meta: { requiresAuth : true}
  },
  {
    path: "/visualize/list",
    name: "Action View Representation",
    component: List,
    meta: { requiresAuth : true}
  },
  {
    path: "/explore",
    name: "Explore View",
    component: Explore,
    meta: { requiresAuth : true}
  },
  {
    path: "/construct",
    name: "Construct View",
    component: Construct,
    meta: { requiresAuth : true}
  },
  {
    path: "/manipulate",
    name: "Manipulate View",
    component: Manipulate,
    meta: { requiresAuth : true}
  },
  {
    path: "/manipulate/code",
    name: "Manipulate Code View",
    component: ManipulateCode,
    meta: { requiresAuth : true}
  },
  {
    path: "/engineering",
    name: "Engineering Design View",
    component: EngineeringDesign,
    meta: { requiresAuth : true}
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

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user');

  if(to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
  
})

export default router;
