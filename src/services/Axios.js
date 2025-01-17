import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://run.c2stem.org/",
  baseURL: "http://localhost:8203/",
});
export default axiosInstance;
