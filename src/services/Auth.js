import { enc, SHA512 } from "crypto-js";
import axiosInstance from "./Axios";
import axios from "axios";

export default {
  login(credentials) {
    try {
      return axiosInstance.post("user/login", credentials);
    } catch (error) {
      return error;
    }
  },
  register(credentials) {
    try {
      return axiosInstance.post("user/register", credentials);
    } catch (error) {
      return error;
    }
  },
  registerBulkUsers(userDataObj) {
    try {
      return axiosInstance.post("user/registerInBulk", userDataObj);
    } catch (error) {
      return error;
    }
  },
  netsbloxLogin(credentials) {
    const data = credentials;
    const username = data.username;
    const password = data.password;
    const serverUrl = data.ServerURL;
    const request = new XMLHttpRequest();
    request.open("POST", serverUrl + "/api", true);
    request.withCredentials = true;
    const gen_hash = SHA512(password).toString(enc.Hex);
    const loginData = {
      __u: username,
      __h: gen_hash,
    };
    return this._requestPromise(request, loginData);
  },

  netsbloxLogout() {
    const serverUrl = "https://editor.c2-stem.org";
    const request = new XMLHttpRequest();
    request.open("POST", serverUrl + "/api/logout", true);
    request.withCredentials = true;
    return this._requestPromise(request);
  },

  async initializeSyncFLow(username) {
    try {
      return axios.get("https://sharer-local.syncflow.live/api/token?", {
        params: { identity: username },
      });
    } catch (error) {
      return error;
    }
  },

  _requestPromise(request, data) {
    return new Promise(function (resolve, reject) {
      // stringifying undefined => undefined
      if (data) {
        request.setRequestHeader(
          "Content-Type",
          "application/json; charset=utf-8"
        );
      }
      request.send(JSON.stringify(data));
      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status >= 200 && request.status < 300) {
            resolve(request);
          } else {
            const err = new Error(
              request.statusText || "Unsuccessful Xhr response"
            );
            err.request = request;
            reject(err);
          }
        }
      };
    });
  },
};
