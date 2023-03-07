import axios from "axios";
export default {
  async saveUserState(user, state) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    let response = await axios.post("//localhost:8203/state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
  },

  async gerUserState(user) {
    let response = await axios.get("//localhost:8203/state/getState/" + user, {
      withCredentials: true,
    });
    if (response) {
      return response.data;
    }else{
        return [];
    }
  },
};
