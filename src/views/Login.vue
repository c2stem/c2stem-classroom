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
  <AlertBox :message="alertMessage" v-if="isActive"></AlertBox>
</template>

<script>
/**
 * Login View
 * @requires ../services/Auth.js that contains method for login.
 */
import auth from "../services/Auth.js";
import nav from "../services/Navigation.js";
import Token from "../services/Token";
import AlertBox from "../components/AlertBox.vue";
export default {
  components: { AlertBox },
  data() {
    return {
      username: "",
      password: "",
      ServerURL: "https://editor.c2stem.org",
      cardActive: false,
      alertMessage: "",
    };
  },
  computed: {
    isActive() {
      return this.cardActive;
    },
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
        .login({
          username: this.username,
          password: this.password,
        })
        .then(({ data }) => {
          if (data.message) {
            this.cardActive = true;
            this.alertMessage = data.message;
            return;
          } else if (data.token) {
            this.cardActive = true;
            this.alertMessage = "User found. Logging in...";
          }
          auth
            .netsbloxLogin({
              username: this.username,
              password: this.password,
              ServerURL: this.ServerURL,
            })
            .catch((err) => {
              console.log(err);
            })
            .then((response) => {
              if (response) {
                data.username = this.username;
                Token.setAccessToken(data.token);
                this.$store.dispatch("updateStore", this.username);
                this.$store.dispatch("saveCredentials", data).then(() => {
                  const reRoute = nav.routeByClassOnLogin(data);
                  this.$router.push({ name: reRoute });
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.emitter.on("alert", (evt) => {
      if (evt.data) {
        if (document.getElementById("alertID")) {
          document.getElementById("alertText").innerText = evt.data;
          document.getElementById("alertID").style.display = "flex";
        } else {
          this.alertMessage = evt.data;
          this.cardActive = true;
        }
      }
    });
    this.emitter.on("close-alert", () => {
      this.cardActive = false;
      this.alertMessage = "";
    });
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
