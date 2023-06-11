import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Dashboard from "../views/visualize/Dashboard.vue";
import PageNotFound from "../views/PageNotFound.vue";
import EE from "../views/EE.vue";
import EELanding from "../views/EELand.vue";
import EETaskLanding from "../views/EETaskLand.vue";
import Construct from "../views/Construct.vue";
import IE from "../views/IE.vue";
import IELanding from "../views/IELand.vue";
// import Landing from "../views/LandingPage.vue";
import EngineeringDesign from "../views/EngineeringDesign.vue";
import Login from "../views/Login.vue";
import TempLanding from "../views/tempLandingPage.vue";
import Register from "../views/Register.vue";

import AST from "../views/visualize/AST.vue";
import List from "../views/visualize/List.vue";

function islogin(to, from, next) {
  if (!localStorage.getItem("user")) {
    next();
  } else {
    router.back();
  }
}

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
    beforeEnter: islogin,
    meta: { title: "C2STEM | Login" },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: true, role: "Admin", title: "C2STEM | Register" },
  },
  {
    path: "/land",
    name: "Landing",
    component: TempLanding,
    meta: { requiresAuth: true, class: "CMISE", title: "C2STEM" },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true, class: "SPICE", title: "C2STEM | Home" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, role: "Admin", title: "C2STEM | Dashboard" },
  },
  {
    path: "/visualize/ast",
    name: "AST",
    component: AST,
    meta: { requiresAuth: true, class: "SPICE", title: "C2STEM | AST" },
  },
  {
    path: "/visualize/list",
    name: "Action View Representation",
    component: List,
    meta: { requiresAuth: true, class: "SPICE", title: "C2STEM | List" },
  },
  {
    path: "/eeLand",
    name: "EELanding",
    component: EELanding,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | EE Landing",
      group: "EE",
    },
  },
  {
    path: "/eeTaskLand",
    name: "EETaskLanding",
    component: EETaskLanding,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | EE Task Landing",
      group: "EE",
    },
  },
  {
    path: "/ee/:userID/:projectName/:source",
    name: "EE",
    component: EE,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | EE",
      group: "EE",
    },
  },
  {
    path: "/construct",
    name: "Construct",
    component: Construct,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | Construct",
      group: "Construct",
    },
  },
  {
    path: "/ieLand",
    name: "IELanding",
    component: IELanding,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | IE Land",
      group: "IE",
    },
  },
  {
    path: "/ie/:userID/:projectName/:source",
    name: "IE",
    component: IE,
    meta: {
      requiresAuth: true,
      class: "CMISE",
      title: "C2STEM | IE",
      group: "IE",
    },
  },
  {
    path: "/engineering",
    name: "Engineering",
    component: EngineeringDesign,
    meta: { requiresAuth: true, class: "CMISE", title: "C2STEM | Engineering" },
  },
  {
    path: "/:NotFound(.*)",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole");
  const userClass = localStorage.getItem("userClass");
  const userGroup = localStorage.getItem("userGroup");

  if (to.meta && to.meta.title) {
    document.title = to.meta.title || "C2STEM";
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next("/");
  }
  if (userRole && userRole.includes("admin")) {
    next();
  } else {
    if (to.name === "Landing") {
      if (userGroup && userGroup !== "All") {
        if (from.name.includes("IE")) {
          router.push("/ieland");
        } else if (from.name.includes("EE")) {
          router.push("/eeland");
        }
      }
    } else {
      if (userClass && !userClass.includes(to.meta.class)) {
        router.back();
      }
      if (userGroup && to.meta.group) {
        if (!userGroup.includes(to.meta.group || "All")) {
          router.back();
        }
      }
    }
  }
  next();
});

export default router;
