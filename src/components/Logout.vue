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
import authService from "../services/Auth.js";
export default {
  name: "Logout",
  computed: {
    loggedIn() {
      return localStorage.getItem("user");
    },
  },
  methods: {
    logout() {
      authService.netsbloxLogout();
      this.$store.dispatch("removeCredentials");
    },
  },
};
</script>
