import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createApp } from "vue";
import mitt from "mitt";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axiosInterceptors from "./services/AxiosInterceptors";

const emitter = mitt();
const app = createApp(App);
axiosInterceptors();
app.config.globalProperties.emitter = emitter;
app.use(store).use(router);
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
