import axiosInstance from "./Axios";
export default {
  async saveUserState(user, state) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    let response = await axiosInstance.post("state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
      designHistorySummary: {},
      designHistorySummaryLength: 0,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
  },

  /**
   * Save one design's tile layout (used to redraw its stage in Compare).
   * The server takes the username from the auth token.
   */
  async saveStageLayout(projectName, designKey, materials) {
    return axiosInstance.post("state/setStageLayout", {
      projectName,
      designKey,
      materials,
    });
  },

  async gerUserState(user) {
    let response = await axiosInstance.get("state/getState/" + user, {
      withCredentials: true,
    });
    if (response) {
      return response.data;
    } else {
      return [];
    }
  },
};
