import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

// Landing Pages
import Landing from "../views/LandingPage.vue";

// Generic Computational Model Views
import ComputationalModel from "../views/ComputationalModel.vue";

////////////////////////////////////////////////////////////////
// CMISE ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
import GroupLessonMenu from "../views/cmise/GroupLessonMenu.vue"; //CMISE

// Construct Group
import ConstructMenu from "../views/cmise/construct/ConstructMenu.vue";
import Construct from "../views/cmise/construct/Construct.vue";

// Explore Group
import Explore from "../views/cmise/explore/Explore.vue"; //template
import ExploreMenu from "../views/cmise/explore/ExploreMenu.vue";
import ExploreLessonSeven from "../views/cmise/explore/ExploreLessonSeven";
import ExploreLessonEight from "../views/cmise/explore/ExploreLessonEight";
import ExploreLessonNine from "../views/cmise/explore/ExploreLessonNine";

// Manipulate Group
import Manipulate from "../views/cmise/manipulate/Manipulate.vue"; //template
import ManipulateMenu from "../views/cmise/manipulate/ManipulateMenu";
import ManipulateLessonSeven from "../views/cmise/manipulate/ManipulateLessonSeven";
import ManipulateLessonEight from "../views/cmise/manipulate/ManipulateLessonEight";
import ManipulateLessonNine from "../views/cmise/manipulate/ManipulateLessonNine";
import ManipulateOriginal from "../views/cmise/manipulate/ManipulateOriginal.vue";

//Engineering Design View
import EngineeringDesign from "../views/cmise/EngineeringDesign.vue";

// Student Dashboard TODO: future work!
import Dashboard from "../views/Dashboard.vue";

// Data Analysis Views
import AST from "../views/visualize/AST.vue";
import List from "../views/visualize/List.vue";

// Other
import PageNotFound from "../views/PageNotFound.vue";

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
    path: "/model",
    name: "Computational Model",
    component: ComputationalModel,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  // DATA ANALYSIS VIEWS
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
  // CMISE PAGES
  {
    path: "/lessons",
    name: "Group Menu",
    component: GroupLessonMenu,
  },
  // Explore Group
  {
    path: "/explore",
    name: "Explore View",
    component: Explore,
  },
  {
    path: "/explore-menu",
    name: "Explore Menu",
    component: ExploreMenu,
  },
  {
    path: "/explore/lesson-seven",
    name: "Explore Lesson Seven View",
    component: ExploreLessonSeven,
  },
  {
    path: "/explore/lesson-eight",
    name: "Explore Lesson Eight View",
    component: ExploreLessonEight,
  },
  {
    path: "/explore/lesson-nine",
    name: "Explore Lesson Nine View",
    component: ExploreLessonNine,
  },
  // Construct Group
  {
    path: "/construct-menu",
    name: "Construct Menu",
    component: ConstructMenu,
  },
  {
    path: "/construct",
    name: "Construct View",
    component: Construct,
  },
  // Manipulate Group
  {
    path: "/manipulate",
    name: "Manipulate View",
    component: Manipulate,
  },
  {
    path: "/manipulate-menu",
    name: "Manipulate Menu",
    component: ManipulateMenu,
  },
  {
    path: "/manipulate/lesson-seven",
    name: "Manipulate Lesson Seven View",
    component: ManipulateLessonSeven,
  },
  {
    path: "/manipulate/lesson-eight",
    name: "Manipulate Lesson Eight View",
    component: ManipulateLessonEight,
  },
  {
    path: "/manipulate/lesson-nine",
    name: "Manipulate Lesson Nine View",
    component: ManipulateLessonNine,
  },
  {
    path: "/manipulate-old",
    name: "Manipulate Original View",
    component: ManipulateOriginal,
  },
  // Engineering Design
  {
    path: "/engineering",
    name: "Engineering Design View",
    component: EngineeringDesign,
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
