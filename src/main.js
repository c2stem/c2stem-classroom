import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createApp } from "vue";
import mitt from "mitt";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./services/Axios";

const emitter = mitt();
const app = createApp(App);
app.config.globalProperties.$axios = { ...axios.axios_instance };
store.$axios = axios.axios_instance;
app.config.globalProperties.emitter = emitter;
app.use(store).use(router);
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
