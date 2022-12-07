import axios from "axios";


export default {

    login(credentials) {
        return axios.post("//localhost:8203/user/login", credentials);
    }
}