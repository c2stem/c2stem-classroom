import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {},
  mutations: {
    save_credentials(state, data) {
      state.user = data;
      localStorage.setItem("user", JSON.stringify(data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    },
    remove_credentials() {
      // state.user = null;
      localStorage.removeItem("user")
      // axios.defaults.headers.common["Authorization"] = null;
      location.reload()
    },
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post("//localhost:8201/user/register", credentials)
        .then(({ data }) => {
          commit("save_credentials", data);
        });
    },
    login({ commit }, credentials) {
      return axios
        .post("//localhost:8201/user/login", credentials)
        .then((data) => {
          commit('save_credentials', data)
        });
    },
    logout({ commit } ) {
      commit('remove_credentials')

    },
  },
  getters: {
    loggedIn (state) {
      return !!state.user
    }
  },
  modules: {},
});
