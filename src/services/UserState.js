import axiosInstance from "./Axios";
export default {
  async saveUserState(user, state) {
    const checkList = state.checkedStatus;
    const favList = state.favoriteStatus;
    const dhSummary = state.designHistorySummary;
    const dhSummaryLength = state.designHistorySummaryLength;
    let response = await axiosInstance.post("state/setState", {
      username: user,
      checkList: checkList,
      favList: favList,
      designHistorySummary: dhSummary,
      designHistorySummaryLength: dhSummaryLength,
    });
    if (response) {
      console.log("successfully saved state: ", response);
    }
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
