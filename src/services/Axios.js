import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://spice.c2-stem.org/",
});
export default axiosInstance;
