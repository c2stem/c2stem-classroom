class TokenService {
  setAccessToken(token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }
  setRefreshToken(token) {
    sessionStorage.setItem("refreshToken", JSON.stringify(token));
  }
  getAccessToken() {
    const token = JSON.parse(sessionStorage.getItem("token"));
    if (token) {
      return token;
    } else {
      return undefined;
    }
  }
  getRefreshToken() {
    const token = JSON.parse(sessionStorage.getItem("refreshToken"));
    if (token) {
      return token;
    } else {
      return undefined;
    }
  }
  updateAccessToken(token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }
}

export default new TokenService();
