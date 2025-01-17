import axiosInstance from "./Axios";

export default {
  async logUserActions(logData) {
    let user = sessionStorage.getItem("user");
    if (!user) {
      if (logData.username) {
        user = logData.username;
      } else {
        user = " ";
      }
    } else {
      user = user.replaceAll('"', "");
    }
    const timestamp = Date.now();
    const type = logData.actionType;
    const view = logData.actionView;
    const args = logData.args;

    let response = await axiosInstance.post("action/logAction", {
      username: user,
      time: timestamp,
      type: type,
      view: view,
      args: args,
    });
    if (response) {
      console.log(response);
    } else {
      console.log("could not save the action");
    }
  },
};
