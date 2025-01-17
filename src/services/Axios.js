import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://run.c2stem.org/",
});
export default axiosInstance;
