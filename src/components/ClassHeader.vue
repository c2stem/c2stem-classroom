<template>
  <!-- Global header for the C2STEM/SPICE/CMISE environments -->
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark head">
    <div class="container-fluid">
      <button
        type="button"
        class="btn btn-link navbar-brand"
        @click="returnNav"
      >
        <img src="../assets/c2stemlogo.png" alt="" width="100" height="30" />
      </button>
      <button
        v-if="
          loggedIn &&
          (currentRouteName === 'Construct' ||
            currentRouteName === 'Engineering' ||
            currentRouteName === 'IE' ||
            currentRouteName === 'EE')
        "
        type="button"
        class="btn btn-primary btn-lg me-3"
        @click="saveProject"
      >
        Save Project
      </button>
      <div class="bttn-auth ms-2 me-2">
        <!--        <button-->
        <!--          v-if="-->
        <!--            loggedIn &&-->
        <!--            (currentRouteName === 'Construct' ||-->
        <!--              currentRouteName === 'IE' ||-->
        <!--              currentRouteName === 'EE' ||-->
        <!--              currentRouteName === 'Engineering')-->
        <!--          "-->
        <!--          type="button"-->
        <!--          class="btn btn-primary btn-lg me-3"-->
        <!--          @click.exact="exportProject"-->
        <!--          @click.shift.exact="$router.push('/dashboard')"-->
        <!--          data-bs-toggle="tooltip"-->
        <!--          data-bs-placement="bottom"-->
        <!--          title="Shift press click to upload project files!"-->
        <!--        >-->
        <!--          Export Project-->
        <!--        </button>-->
        <reset
          v-if="
            loggedIn &&
            (currentRouteName === 'Construct' || currentRouteName === 'IE')
          "
        ></reset>
        <button
          v-if="loggedIn && currentRole === 'admin'"
          type="button"
          class="btn btn-primary btn-lg me-3"
          @click="$router.push('/dashboard')"
        >
          Dashboard
        </button>
        <button
          v-if="
            loggedIn &&
            currentRole === 'admin' &&
            currentRouteName !== 'Register'
          "
          type="button"
          class="btn btn-primary btn-lg me-3"
          @click="$router.push('/register')"
        >
          Register
        </button>
        <button
          v-if="!loggedIn && currentRouteName === 'Login'"
          type="button"
          class="btn btn-primary btn-lg"
          @click="$router.push('/playground')"
        >
          Playground
        </button>
        <button
          v-if="!loggedIn && currentRouteName === 'Playground'"
          type="button"
          class="btn btn-primary btn-lg"
          @click="$router.push('/')"
        >
          Login
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
import Reset from "./ResetProject.vue";
import simulation from "../services/Simulation";
import Logger from "../services/Logger";

export default {
  name: "ClassHeader",
  components: {
    Logout,
    Reset,
  },
  computed: {
    loggedIn() {
      return this.$store.state.user;
    },
    currentRole() {
      let role = sessionStorage.getItem("userRole");
      return Formatter.removeQuotes(role);
    },
    currentRouteName() {
      return this.$route.name;
    },
    getProjectName() {
      return sessionStorage.getItem("projectName");
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
        // let checkList = this.getCheckedDesigns;
        // let username = this.loggedIn;
        // Simulation.saveHistory(checkList, username);
        // setTimeout(() => {
        //   Simulation.publishProject(name, true);
        // }, 5000);
      } catch (error) {
        console.log("Cannot save the project", error);
      }
    },
    // TO DO: need to be improved with new routes.
    returnNav() {
      const userClass = sessionStorage.getItem("userClass");
      const userRole = sessionStorage.getItem("userRole");
      const userGroup = sessionStorage.getItem("userGroup");
      const lastKnown = this.currentRouteName;
      const spiceRoutes = ["SpiceLanding", "AST", "Action View Representation"];
      if (lastKnown === "IE") {
        // restricting the home button to Ieland and IE for users in IE group.
        Logger.consoleLog("returning back to IE landing page.");
        this.$router.push("/ieLand");
      } else if (lastKnown === "EE") {
        // restricting the home button to eeland and EE for users in EE group.
        Logger.consoleLog("returning back to EE landing page.");
        this.$router.push("/eeLand");
      } else if (lastKnown === "Engineering") {
        Logger.consoleLog("returning back to landing page.");
        this.$router.push("/land");
      } else if (
        userClass.includes("SPICE") ||
        (!userRole.includes("admin") && !userGroup.includes("All"))
      ) {
        // Restricting the users to single page construct view for users in SPICE Class.
        if (userClass.includes("SPICE")) {
          Logger.consoleLog("returning back to SPICE landing page.");
          this.$router.push("/spiceLand");
        } else if (lastKnown === "Construct") {
          Logger.consoleLog("returning back to Constructor landing page.");
          this.$router.push("/ConstructLand");
        }
      } else if (spiceRoutes.includes(lastKnown)) {
        // restricting the home button to Home for users in SPICE class.
        Logger.consoleLog("returning back to SPICE landing page.");
        this.$router.push("/spiceLand");
      } else {
        Logger.consoleLog("returning back to landing page.");
        this.$router.push("/land");
      }
    },
    async exportProject() {
      await simulation.getProject(this.getProjectName);
    },
  },
  mounted() {
    this.emitter.on("save-project", (evt) => {
      if (evt.status) {
        Simulation.publishProject(this.getProjectName, true);
      }
    });
  },
};
</script>

<style scoped>
.head {
  background: #615195;
}
.btn:focus {
  box-shadow: none;
}
</style>
