<template>
  <!-- Engineering Design View -->
  <div class="container">
    <div class="row">
      <div class="col">
        <engineering-simulation-panel />
        <div class="iframe-panel">
          <iframe-loader
            source="https://editor.c2stem.org"
            iframeid="iframe-id"
            username="oele"
            projectname="cmise-project-engineering"
            :embed="true"
          ></iframe-loader>
        </div>
      </div>
      <div class="col">
        <div class="right-panel mt-4">
          <engineering-display-panel></engineering-display-panel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Engineering Design view.
 * Similar to manipulate view customized for engineering design with compare feature.
 * In this view user will have access to a C2STEM project in an iframe.
 * Instruction panel is available with resources.
 * Display panel has data visualization from C2STEM data.
 * The green flag is availble to run scripts from outside of iframe.
 * A See code button to access the code of the project.
 * A compare tabs allows for design comparison.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 * @requires ../components/Instructions.vue to present resources to users.
 * @requires ../components/EngineeringDisplayPanel.vue for data visualization and comparison.
 * @requires ../components/SimulationPanel.vue for the green flag.
 */
import IframeLoader from "../components/IframeLoader.vue";
import EngineeringDisplayPanel from "../components/EngineeringDisplayPanel.vue";
import EngineeringSimulationPanel from "../components/EngineeringSimulationPanel.vue";

export default {
  name: "Engineering",
  components: {
    IframeLoader,
    EngineeringDisplayPanel,
    EngineeringSimulationPanel,
  },
  methods: {
    saveProject() {
      this.emitter.emit("save-project", { status: true });
    },
    getUser(){
      return localStorage.getItem("user");
    }
  },
  // beforeMount() {
  //   let user = localStorage.getItem("user");
  //   // this.$store.dispatch("setupCheckedDesigns", user);
  //   // this.$store.dispatch("setupStageImages", user);
  // },
  mounted() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    iframe.onload = () => {
      api.addEventListener("projectSaved", this.saveProject);
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  max-height: 80%;
  display: grid;
}
div {
  min-height: 0;
}
.iframe-panel {
  margin: 0 10px 1px 10px;
  height: 400px;
  border: 3px inset #615195;
}
.card {
  margin: 10px;
}
.right-panel {
  height: 70%;
}
.notes-panel {
  height: 30%;
  display: flex;
}

.left-group {
  height: auto;
  display: inline-flex;
  align-items: center;
}
.codeBttn {
  height: fit-content;
}
</style>
