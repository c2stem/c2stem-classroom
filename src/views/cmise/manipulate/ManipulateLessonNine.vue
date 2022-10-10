<template>
<!-- Manipulate Nine View -->
  <div class="container">
    <!-- Run Simulation and Test History Menu Bar -->
    <coding-panel></coding-panel>

    <!-- Load Netsblox Project -->
    <iframe-loader
      source="https://editor.c2stem.org"
      iframeid="iframe-id"
      username="oele"
      projectname="cmise-project-lesson9-manipulate"
      :embed="false"
    ></iframe-loader>
  </div>
</template>

<script>
/**
 * Manipulate code view.
 */
import IframeLoader from "../../../components/IframeLoader.vue";
import CodingPanel from "../../../components/CodingSimulationPanel.vue";

export default {
  name: "Manipulate Lesson Nine View",
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