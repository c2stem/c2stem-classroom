<template>
<!-- Simulation Panel Component -->
  <div class="start-panel">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Test Model</i>
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
      this.sleep(10000).then(() => {
        this.updateData();
      });
    },
    updateData() {
      this.emitter.emit("update-data", { status: true });
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
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
