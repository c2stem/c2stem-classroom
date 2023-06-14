import { enc, SHA512 } from "crypto-js";

export default {
  login($axios, credentials) {
    try {
      return $axios.post("user/login", credentials);
    } catch (error) {
      return error;
    }
  },
  register($axios, credentials) {
    try {
      return $axios.post("user/register", credentials);
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
    const serverUrl = "https://physdev.c2stem.org";
    const request = new XMLHttpRequest();
    request.open("POST", serverUrl + "/api/logout", true);
    request.withCredentials = true;
    return this._requestPromise(request);
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
