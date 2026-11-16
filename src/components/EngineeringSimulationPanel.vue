<template>
  <!-- Simulation Panel Component -->
  <div class="start-panel d-flex bd-highlight">
    <div class="p-1 bd-highlight">
      <button type="button" class="btn btn-success" @click="runModel">
        <i class="bi bi-flag-fill"> Test Design</i>
      </button>
    </div>
    <div class="p-1 bd-highlight">
      <see-code />
    </div>
  </div>
</template>

<script>
/**
 * Simulation Panel Component
 * A Panel with C2STEM simulation triggers.
 * Has green flag to run scripts and,
 * See code component to see an image of code in a modal.
 */
import simulation from "../services/Simulation";
import SeeCode from "./SeeCode.vue";
import Visualize from "../services/Visualize";
import Logger from "../services/Logger";
import StageLayout from "../services/StageLayout";

export default {
  name: "Simulation Panel",
  components: {
    SeeCode,
  },
  data() {
    return {
      designHistory_content: [],
      dhLength: 0,
      stateDhLength: 0,
    };
  },
  computed: {
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    currentRouteName() {
      return this.$route.name;
    },
    getProjectName() {
      return sessionStorage.getItem("projectName");
    },
  },
  methods: {
    getDesignData() {
      Visualize.getData().then((response) => {
        this.dhLength = Object.keys(response).length;
        this.stateDhLength = this.historyLength;
        return true;
      });
    },
    /**
     * Run scripts when "Test Design" is pressed.
     * Waits for the run to add its row to the design history, records the
     * tile layout for that design (used to redraw its stage in Compare),
     * then refreshes the design table.
     */
    async runModel(event) {
      await Logger.logUserActions({
        actionType: "runModel",
        actionView: this.currentRouteName,
        args: {
          activity: "Engineering",
          projectName: this.getProjectName,
        },
      });
      const rowsBefore = await StageLayout.getDesignRowCount();
      simulation.runProject(event);
      const finished = await StageLayout.waitForNewDesign(rowsBefore);
      if (finished) {
        await StageLayout.captureLatest(this.$store, this.getProjectName);
      }
      this.updateData();
    },
    updateData() {
      this.emitter.emit("update-data", { status: true });
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
