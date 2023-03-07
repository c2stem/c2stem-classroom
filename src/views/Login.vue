<template>
  <!-- Login View -->
  <div class="login-card">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="login">
          <div class="mb-3">
            <h2>Sign in to C2STEM</h2>
          </div>
          <div class="mb-3">
            <label for="userNameId" class="form-label">Username</label>
            <input
              v-model="username"
              type="string"
              class="form-control"
              id="userNameId"
            />
          </div>
          <div class="mb-3">
            <label for="passwordId" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              id="passwordId"
            />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Login View
 * @requires ../services/Auth.js that contains method for login.
 */
import auth from "../services/Auth.js";
export default {
  data() {
    return {
      username: "",
      password: "",
      ServerURL: "https://editor.c2stem.org",
    };
  },
  methods: {
    /**
     * Sends a http request to the server with user credentials.
     * @requires username,password.
     * On successful login save user credentials to maintain state.
     * On successful login route the user to landing page.
     */
    login() {
      auth
        .login({ username: this.username, password: this.password })
        .then(({ data }) => {
          auth
            .netsbloxLogin({
              username: this.username,
              password: this.password,
              ServerURL: this.ServerURL,
            })
            .then(
              (data.username = this.username),
              this.$store.dispatch("updateStore", this.username),
              this.$store.dispatch("saveCredentials", data).then(() => {
                if (data.class.includes("CMISE")) {
                  this.$router.push({ name: "Landing" });
                } else if (data.class.includes("SPICE")) {
                  this.$router.push({ name: "Home" });
                }
              })
            );
        });
    },
  },
};
</script>
<style scoped>
.card {
  height: fit-content;
  margin: 20px;
  width: 400px;
}
div {
  min-height: 0;
}
.login-card {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
