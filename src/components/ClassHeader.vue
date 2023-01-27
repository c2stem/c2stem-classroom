<template>
  <!-- Global header for the C2STEM/SPICE/CMISE environments -->
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark head">
    <div class="container-fluid">
      <a class="navbar-brand" href="/land">
        <!-- c2stem logo with link to home -->
        <img src="../assets/c2stemlogo.png" alt="" width="100" height="30" />
      </a>
      <button
        v-if="
          (loggedIn && currentRouteName == 'Construct') ||
          currentRouteName == 'Engineering'
        "
        type="button"
        class="btn btn-primary btn-lg me-3"
        @click="saveProject"
      >
        Save Project
      </button>
      <div class="bttn-auth ms-2 me-2">
        <button
          v-if="
            loggedIn &&
            currentRole == 'admin' &&
            currentRouteName !== 'Register'
          "
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
import Simulation from "../services/Simulation";

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
    },
    getProjectName() {
      return localStorage.getItem("projectName");
    },
    getCheckedDesigns() {
      return this.$store.getters.getCheckedDesigns;
    },
  },
  methods: {
    async saveProject() {
      try {
        let name = this.getProjectName;
        Simulation.saveToCloud(name);
        let checkList = this.getCheckedDesigns;
        let username = this.loggedIn;
        Simulation.saveHistory(checkList, username);
        setTimeout(() => {
          Simulation.publishProject(name, true);
        }, 5000);
      } catch (error) {
        console.log("Cannot save the project", error);
      }
    },
  },
  mounted() {

    this.emitter.on('save-project', (evt) => {
      if(evt.status){
        Simulation.publishProject(this.getProjectName, true);
      }
    })
  },
};
</script>

<style scoped>
.head {
  background: #615195;
}
</style>
