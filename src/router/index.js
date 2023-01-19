import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";
import Explore from "../views/Explore.vue";
import Construct from "../views/Construct.vue";
import Manipulate from "../views/Manipulate.vue";
import ManipulateCode from "../views/ManipulateCode.vue";
// import Landing from "../views/LandingPage.vue";
import EngineeringDesign from "../views/EngineeringDesign.vue";
import Login from "../views/Login.vue";
import TempLanding from "../views/tempLandingPage.vue";
import Register from "../views/Register.vue";

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
    meta: {title: 'C2STEM | Login'}
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Rgister'}
  },
  {
    path: "/land",
    name: "Landing",
    component: TempLanding,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM'}
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth : true, class: 'SPICE', title: 'C2STEM | Home'}
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth : true, role: 'Admin', title: 'C2STEM | Dashboard'}
  },
  {
    path: "/visualize/ast",
    name: "AST",
    component: AST,
    meta: { requiresAuth : true, class: 'SPICE', title: 'C2STEM | AST'}
  },
  {
    path: "/visualize/list",
    name: "Action View Representation",
    component: List,
    meta: { requiresAuth : true, class: 'SPICE', title: 'C2STEM | List'}
  },
  {
    path: "/explore",
    name: "Explore View",
    component: Explore,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Explore'}
  },
  {
    path: "/construct",
    name: "Construct View",
    component: Construct,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Construct'}
  },
  {
    path: "/manipulate",
    name: "Manipulate View",
    component: Manipulate,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Manipulate'}
  },
  {
    path: "/manipulate/code",
    name: "Manipulate Code View",
    component: ManipulateCode,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Manipulate Code'}
  },
  {
    path: "/engineering",
    name: "Engineering Design View",
    component: EngineeringDesign,
    meta: { requiresAuth : true, class: 'CMISE', title: 'C2STEM | Engineering'}
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

  if (to.meta && to.meta.title) {
    document.title = to.meta.title || 'Your Website Title';
  }

  if(from.name){
    console.log("here");
  }
  if(to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  if(userClass && !userClass.includes(to.meta.class)){
    router.back();
  }
  next()
  
})

export default router;
