<template>
<!-- Simulation Panel Component -->
  <div class="start-panel">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Simulation</i>
    </button>
  </div>
</template>

<script>
/**
 * Simulation Panel Component
 * A Panel with C2STEM simulation triggers.
 * Currently only has green flag to run scripts.
 */
import simulation from "../services/Simulation";
export default {
  name: "Simulation Panel",
  methods: {
    /**
     * Run scripts when green flag is pressed.
     * Extract a stage image after finishing running the script. 
     */
    async runModel(event) {
      simulation.runProject(event);
      let stageImg = await simulation.getImage();
      this.$store.dispatch("addStageImage", stageImg);
      // this.$store.dispatch("updateSimulationStatus", true);
    },
  },
};
</script>

<style scoped>
.start-panel {
  height: auto;
  margin: 2px 10px 1px 10px;
}
</style>
