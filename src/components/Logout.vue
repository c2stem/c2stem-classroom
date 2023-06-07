<template>
  <!-- Logout Component -->
  <button
    v-if="loggedIn"
    type="button"
    class="btn btn-primary btn-lg"
    @click="logout"
  >
    Logout
  </button>
</template>

<script>
/**
 * Logout Component
 * Creates a logout button on the parent component.
 * Toggles visibility based on the existence of user token  in the local storage.
 * When clicked removes credentials of current user.
 */
import authService from "@/services/Auth.js";
import userStateService from "@/services/UserState.js";
export default {
  name: "Logout",
  computed: {
    loggedIn() {
      return this.$store.state.user;
    },
  },
  methods: {
    logout() {
      const user = this.getUser().replaceAll('"', "");
      authService.netsbloxLogout();
      userStateService.saveUserState(user, this.$store.state, this.$axios);
      this.$store.dispatch("removeCredentials");
    },
    getUser() {
      return localStorage.getItem("user");
    },
  },
};
</script>
