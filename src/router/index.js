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
    meta: { requiresAuth : true, class: 'CMISE'}
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth : true, class: 'SPICE'}
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth : true, role: 'Admin'}
  },
  {
    path: "/visualize/ast",
    name: "AST",
    component: AST,
    meta: { requiresAuth : true, class: 'SPICE'}
  },
  {
    path: "/visualize/list",
    name: "Action View Representation",
    component: List,
    meta: { requiresAuth : true, class: 'SPICE'}
  },
  {
    path: "/explore",
    name: "Explore View",
    component: Explore,
    meta: { requiresAuth : true, class: 'CMISE'}
  },
  {
    path: "/construct",
    name: "Construct View",
    component: Construct,
    meta: { requiresAuth : true, class: 'CMISE'}
  },
  {
    path: "/manipulate",
    name: "Manipulate View",
    component: Manipulate,
    meta: { requiresAuth : true, class: 'CMISE'}
  },
  {
    path: "/manipulate/code",
    name: "Manipulate Code View",
    component: ManipulateCode,
    meta: { requiresAuth : true, class: 'CMISE'}
  },
  {
    path: "/engineering",
    name: "Engineering Design View",
    component: EngineeringDesign,
    meta: { requiresAuth : true, class: 'CMISE'}
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
  // const userRole = localStorage.getItem('userRole');
  const userClass = localStorage.getItem('userClass');

  if(to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  if(userClass && !userClass.includes(to.meta.class)){
    router.back();
  }
  next()
  
})

export default router;
