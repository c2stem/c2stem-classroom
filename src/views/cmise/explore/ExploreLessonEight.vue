<template>
<!-- Explore view for CMISE -->
  <div class="container">
    <div class="row">
      <div class="col">
        <simulation-panel></simulation-panel>
        <div class="iframe-panel">
          <iframe-loader
            source="https://editor.c2stem.org"
            iframeid="iframe-id"
            username="oele"
            projectname="cmise-project-lesson8-explore"
            :embed="true"
          ></iframe-loader>
        </div>
        <!-- <instructions></instructions> -->
      </div>
      <div class="col">
        <div class="right-panel mt-4">
          <display-panel></display-panel>
          <!-- <notes></notes> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Explore view.
 * In this view user will have access to a C2STEM project in an iframe. 
 * Instruction panel is available with resources.
 * Display panel has data visualization from C2STEM data.
 * The green flag is availble to run scripts from outside of iframe.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 * @requires ../components/Instructions.vue to present resources to users.
 * @requires ../components/DisplayPanel.vue for data visualization.
 * @requires ../components/SimulationPanel.vue for the green flag.
 */
import IframeLoader from "../../../components/IframeLoader.vue";
// import Instructions from "../../../components/Instructions.vue";
import DisplayPanel from "../../../components/DisplayPanel.vue";
// import Notes from "../../../components/Notes.vue";
import SimulationPanel from "../../../components/SimulationPanel.vue";

export default {
  components: {
    IframeLoader,
    // Instructions,
    DisplayPanel,
    // Notes,
    SimulationPanel,
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
  margin: 1px 10px 10px 10px;
}
.right-panel {
  height: 70%;
}
.notes-panel {
  height: 30%;
  display: flex;
}
</style>
