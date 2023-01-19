import axios from "axios";
import { enc, SHA512 } from "crypto-js";

export default {

    login(credentials) {
        return axios.post("https://run.c2stem.org/user/login", credentials);
    },
    register(credentials) {
        return axios.post("https://run.c2stem.org/user/register", credentials);
    },
    netsbloxLogin(credentials) {
        const data = credentials;
        const username = data.username;
        const password = data.password;
        const serverUrl = data.ServerURL;
        var request = new XMLHttpRequest();
        request.open("POST", serverUrl + "/api", true);
        request.withCredentials = true;
        const gen_hash = SHA512(password).toString(enc.Hex);
        var loginData = {
            __u: username,
            __h: gen_hash,
        };
        return this._requestPromise(request, loginData);
    },

    netsbloxLogout() {
        var serverUrl = "https://physdev.c2stem.org";
        var request = new XMLHttpRequest();
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
                        var err = new Error(
                            request.statusText || "Unsuccessful Xhr response"
                        );
                        err.request = request;
                        reject(err);
                    }
                }
            };
        });
    }
}