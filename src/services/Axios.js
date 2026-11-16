import axios from "axios";

/**
 * API base URL. Production uses https://spice.c2-stem.org/.
 * In development (`npm run serve`) .env.development sets it to "/spice-api/",
 * which the dev server proxies to production (see vue.config.js), avoiding
 * CORS errors from http://localhost:8080. To use a local c2stem-server
 * instead, put VUE_APP_API_URL=http://localhost:8203/ in .env.development.local.
 */
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "https://spice.c2-stem.org/",
});
export default axiosInstance;
