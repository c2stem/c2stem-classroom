import axios_instance from "./Axios";
export default {
  async saveUserState(user, state, $axios) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    const token = state.user;
    axios_instance.setHeader($axios, token);
    let response = await $axios.post("state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
  },

  async gerUserState($axios, user) {
    let response = await $axios.get("state/getState/" + user, {
      withCredentials: true,
    });
    if (response) {
      return response.data;
    } else {
      return [];
    }
  },
};
