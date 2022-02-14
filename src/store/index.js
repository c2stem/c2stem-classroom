import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {},
  mutations: {
    save_credentials (state, data) {
      state.user = data
      localStorage.setItem('user', JSON.stringify(data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${
        data.token
      }`
    }
  },
  actions: {
    register({ commit },credentials) {
      return axios
        .post("//localhost:8201/user/register", credentials)
        .then(({ data }) => {
          console.log("user data is", data);
          commit('save_credentails', data)
        });
    },
  },
  modules: {},
});
