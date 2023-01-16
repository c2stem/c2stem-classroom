<template>
  <!-- Simulation Panel Component -->
  <div class="start-panel">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Model</i>
    </button>
    <see-code />
  </div>
</template>

<script>
/**
 * Simulation Panel Component
 * A Panel with C2STEM simulation triggers.
 * Currently only has green flag to run scripts.
 */
import simulation from "../services/Simulation";
import SeeCode from "./SeeCode.vue";
import Visualize from "../services/Visualize";

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
    }
  },
  computed: {
    historyLength() {
      return this.$store.getters.getdhLength;
    },
  },
  methods: {
    getDesignData() {
      return new Promise((resolve)=> {
        Visualize.getData().then((response) => {
        this.dhLength = Object.keys(response).length;
        this.stateDhLength = this.historyLength;
        resolve(true)
      })
      })

    },
    async processDesignData() {
      this.getDesignData().then((response) => {
        if (this.dhLength > this.stateDhLength && response) {
          simulation.getImage().then((response) => {
            this.$store.dispatch("addStageImage", response);
            this.updateData();
          });

        } else {
          this.processDesignData();
        }
      });
    },
    /**
     * Run scripts when green flag is pressed.
     * Extract a stage image after finishing running the script. 
     */
    async runModel(event) {
      simulation.runProject(event);
      this.sleep(10000).then(() => {
        this.processDesignData();
      })

    },
    updateData() {
      this.emitter.emit('update-data', { 'status': true });
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },
};
</script>

<style scoped>
.start-panel {
  height: auto;
  margin: 2px 10px 1px 10px;
}
</style>
