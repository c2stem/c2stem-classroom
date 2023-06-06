import axios from "axios";

export default {
  axios_instance: axios.create({
    baseURL: "https://run.c2stem.org/",
  }),

  setHeader(token) {
    this.axios_instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  },
};
