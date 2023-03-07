import axios from "axios";
export default {
  async saveUserState(user, state) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    let response = await axios.post("https://run.c2stem.org/state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
  },

  async gerUserState(user) {
    let response = await axios.get("https://run.c2stem.org/state/getState/" + user, {
      withCredentials: true,
    });
    if (response) {
      return response.data;
    }else{
        return [];
    }
  },
};
