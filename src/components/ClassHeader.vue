<template>
  <!-- Global header for the C2STEM/SPICE/CMISE environments -->
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark head">
    <div class="container-fluid">
      <a class="navbar-brand" href="/land">
        <!-- c2stem logo with link to home -->
        <img src="../assets/c2stemlogo.png" alt="" width="100" height="30" />
      </a>
      <logout></logout>
    </div>
  </nav>
</template>

<script>
import Logout from "./Logout.vue";
export default {
  name: "ClassHeader",
  components: {
    Logout,
  },
};
</script>

<style scoped>
.head {
  background: #615195;
}
</style>