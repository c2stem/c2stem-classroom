<template>
  <!-- Logout Component -->
  <button
    v-if="loggedIn"
    type="button"
    class="btn btn-danger btn-lg"
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
    async logout() {
      const user = this.getUser().replaceAll('"', "");
      await userStateService.saveUserState(
        user,
        this.$store.state,
        this.$axios
      );
      authService.netsbloxLogout();
      this.$store.dispatch("removeCredentials");
    },
    getUser() {
      return sessionStorage.getItem("user");
    },
  },
};
</script>
