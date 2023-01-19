<template>
  <!-- Global header for the C2STEM/SPICE/CMISE environments -->
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark head">
    <div class="container-fluid">
      <a class="navbar-brand" href="/land">
        <!-- c2stem logo with link to home -->
        <img src="../assets/c2stemlogo.png" alt="" width="100" height="30" />
      </a>
      <div class="bttn-auth ms-2 me-2">
        <button
          v-if="loggedIn && currentRole == 'admin' && currentRouteName !== 'Register'"
          type="button"
          class="btn btn-primary btn-lg me-3"
          @click="$router.push('/register')"
        >
          Register
        </button>
        <logout></logout>
      </div>
    </div>
  </nav>
</template>

<script>
import Logout from "./Logout.vue";
import Formatter from "../helpers/format.js";

export default {
  name: "ClassHeader",
  components: {
    Logout,
  },
  computed: {
    loggedIn() {
      return localStorage.getItem("user");
    },
    currentRole() {
      let role = localStorage.getItem("userRole");
      return Formatter.removeQuotes(role);
    },
    currentRouteName() {
      let name = this.$route.name;
      return name;
    }
  },
};
</script>

<style scoped>
.head {
  background: #615195;
}
</style>
