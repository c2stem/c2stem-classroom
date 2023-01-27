<template>
  <!-- Construct View for CMISE -->
  <div class="container">
    <coding-panel></coding-panel>
    <iframe-loader
      source="https://editor.c2stem.org"
      iframeid="iframe-id"
      username="oele"
      projectname="cmise-project-computational"
      :embed="false"
    ></iframe-loader>
  </div>
</template>

<script>
/**
 * Construct view.
 * In this view User will have access to a C2STEM project in an iframe.
 * Data visualization is available on a button click in modals.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 */
import IframeLoader from "../components/IframeLoader.vue";
import CodingPanel from "../components/CodingSimulationPanel.vue";
// import simulation from "../services/Simulation.js";

export default {
  name: "Construct",
  components: {
    IframeLoader,
    CodingPanel,
  },
  data() {
    return {
      projectName: " cmise-project-computational",
      loading: false,
    };
  },
  beforeRouteLeave() {
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (!answer) return false;
  },
  // beforeMount() {
  //   window.addEventListener("beforeunload", this.confirm_leaving);
  // },
  // methods: {
  //   async confirm_leaving() {
  //       this.saveProject;
  //       // e.preventDefault();
  //       // e.returnValue = "";

  //   },
  // },
  
  methods:{
    saveProject() {
      this.emitter.emit('save-project', { 'status': true });
    },
    getUser(){
      return localStorage.getItem("user");
    }
  },
  mounted() {
    /**
     * Import Google Library.
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    iframe.onload = () => {
      api.addEventListener("projectSaved", this.saveProject);
    };
  },
  // beforeUnmount() {
  //   window.removeEventListener("beforeunload", this.confirm_leaving);
  // },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  height: 86%;
  padding: 0;
  background-color: #1e1e1e;
}
div {
  min-height: 0;
}
.btn {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
