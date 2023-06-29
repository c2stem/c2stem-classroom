class TokenService {
  setAccessToken(token) {
    localStorage.setItem("token", JSON.stringify(token));
  }
  setRefreshToken(token) {
    localStorage.setItem("refreshToken", JSON.stringify(token));
  }
  getAccessToken() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      return token;
    } else {
      return undefined;
    }
  }
  getRefreshToken() {
    const token = JSON.parse(localStorage.getItem("refreshToken"));
    if (token) {
      return token;
    } else {
      return undefined;
    }
  }
  updateAccessToken(token) {
    localStorage.setItem("token", JSON.stringify(token));
  }
}

export default new TokenService();
