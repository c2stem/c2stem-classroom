import axiosInstance from "./Axios";
import Token from "./Token";
const interceptors = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Token.getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
export default interceptors;
