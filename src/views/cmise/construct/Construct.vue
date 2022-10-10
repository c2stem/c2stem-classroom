<template>
<!-- Construct View -->
  <div class="container">
    <!-- Run Simulation and Test History Menu Bar -->
    <coding-panel></coding-panel>

    <!-- Load Netsblox Project -->
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
 * Construct code view.
 * It is based on the construct view with an ability to switch between 2 differnt views.
 */
import IframeLoader from "../../../components/IframeLoader.vue";
import CodingPanel from "../../../components/CodingSimulationPanel.vue";

export default {
  name: "Construct Computational Lessons View",
  components: {
    IframeLoader,
    CodingPanel,
  },
  mounted() {
    /**
     * import google visualization library.
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
  },
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
