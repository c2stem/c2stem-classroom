import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DashboardUsers from "../views/visualize/DashboardUsers.vue";
import PageNotFound from "../views/PageNotFound.vue";
import EE from "../views/EE.vue";
import EELanding from "../views/EELand.vue";
import EETaskLanding from "../views/EETaskLand.vue";
import Construct from "../views/Construct.vue";
import IE from "../views/IE.vue";
import IELanding from "../views/IELand.vue";
import Playground from "../views/Playground.vue";
// import Landing from "../views/LandingPage.vue";
import EngineeringDesign from "../views/EngineeringDesign.vue";
import Login from "../views/Login.vue";
import TempLanding from "../views/tempLandingPage.vue";
import Register from "../views/Register.vue";
import SpiceLanding from "../views/spice/SpiceLand.vue";
import ConstructLanding from "../views/ConstructLand.vue";
import DashboardHome from "../views/visualize/DashboardHome.vue";
import DashboardProjects from "../views/visualize/DashboardProjects.vue";
import Logger from "../services/Logger";

import UploadDocs from "../views/UploadDocs.vue";

import AST from "../views/visualize/AST.vue";
import List from "../views/visualize/List.vue";

function islogin(to, from, next) {
  if (!sessionStorage.getItem("user")) {
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
    path: "/playground",
    name: "Playground",
    component: Playground,
    meta: { role: "Admin", title: "C2STEM | Playground" },
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
    name: "DashboardHome",
    component: DashboardHome,
    children: [
      { path: "", name: "DashboardUsers", component: DashboardUsers },
      {
        path: "projects",
        name: "DashboardProjects",
        component: DashboardProjects,
      },
    ],
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
    path: "/ee/:name/:userID/:projectName/:source",
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
    path: "/ie/:name/:userID/:projectName/:source",
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
    path: "/spiceLand",
    name: "SpiceLanding",
    component: SpiceLanding,
    meta: { requiresAuth: true, class: "SPICE", title: "C2STEM | Home" },
  },
  {
    path: "/constructLand",
    name: "ConstructLanding",
    component: ConstructLanding,
    meta: { requiresAuth: true, class: "CMISE", title: "C2STEM | Home" },
  },
  {
    path: "/upload",
    name: "UploadDocs",
    component: UploadDocs,
    meta: { requiresAuth: true, class: "CMISE", title: "C2STEM | Upload" },
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

router.beforeEach(async (to, from, next) => {
  const loggedIn = sessionStorage.getItem("user");
  const userRole = sessionStorage.getItem("userRole");
  const userClass = sessionStorage.getItem("userClass");
  const userGroup = sessionStorage.getItem("userGroup");

  const spiceGroup = ["Home", "SpiceLanding", "Construct", "Engineering"];

  if (to.meta && to.meta.title) {
    document.title = to.meta.title || "C2STEM";
  }

  if (!from.name) {
    from.name = "Unknown";
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    await Logger.logUserActions({
      actionType: "changeView",
      actionView: to.name,
      args: {
        source: to.name,
        destination: to.name,
        redirection: "Home",
        message: "User is not logged in. Redirecting to Home.",
      },
    });
    next("/");
  }
  if (userRole && userRole.includes("admin")) {
    await Logger.logUserActions({
      actionType: "changeView",
      actionView: from.name,
      args: {
        source: from.name,
        destination: to.name,
        redirection: "None",
      },
    });
    next();
  } else if (
    userClass &&
    userClass.includes("SPICE") &&
    spiceGroup.includes(to.name)
  ) {
    await Logger.logUserActions({
      actionType: "changeView",
      actionView: from.name,
      args: {
        source: from.name,
        destination: to.name,
        redirection: "None",
      },
    });
    next();
  } else {
    if (to.name === "Landing") {
      if (typeof userGroup !== "undefined" && !userGroup.includes("All")) {
        if (typeof from.name === "undefined") {
          router.back();
        } else if (from.name.includes("IE")) {
          await Logger.logUserActions({
            actionType: "changeView",
            actionView: from.name,
            args: {
              source: from.name,
              destination: to.name,
              redirection: "IELanding",
            },
          });
          router.push("/ieland");
        } else if (from.name.includes("EE")) {
          await Logger.logUserActions({
            actionType: "changeView",
            actionView: from.name,
            args: {
              source: from.name,
              destination: to.name,
              redirection: "EELanding",
            },
          });
          router.push("/eeland");
        }
      }
    } else {
      if (userClass && !userClass.includes(to.meta.class)) {
        router.back();
      }
      if (userGroup && typeof to.meta.group !== "undefined") {
        if (!userGroup.includes(to.meta.group)) {
          if (!userGroup.includes("All")) {
            router.back();
          }
        }
      }
    }
  }
  next();
});

export default router;
