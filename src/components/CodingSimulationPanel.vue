<template>
  <!-- Simulation Panel Component -->
  <div class="start-panel">
    <div>
      <button type="button" class="btn btn-success" @click="runModel">
        <i class="bi bi-flag-fill"> Run Model</i>
      </button>
      <button
        type="button"
        class="btn btn-primary codeBttn"
        data-bs-toggle="modal"
        data-bs-target="#TestHistoryModal"
        @click="generateTable"
      >
        Test History
      </button>
    </div>
    <div class="title">
      <h3 class="text-white">
        <strong>{{ lessonName }}</strong>
      </h3>
    </div>
    <div
      class="modal fade"
      id="TestHistoryModal"
      tabindex="-1"
      aria-labelledby="TestHistoryModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="TestHistoryModalLabel">Test History</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <design-table
              :header="testHistoryHeader"
              :contents="testHistory"
            ></design-table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Simulation Panel Component
 * A Panel with C2STEM simulation triggers.
 * Currently only has green flag to run scripts.
 */
import simulation from "../services/Simulation";
import visualize from "../services/Visualize";
import DesignTable from "./DesignTable.vue";

export default {
  name: "Simulation Panel",
  components: {
    DesignTable,
  },
  props: {
    lessonName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      testHistoryContent: [],
      testHistoryHeader: [
        "Test #",
        "Date",
        "Rainfall (inches)",
        "Surface Material",
        "Absorption limit (inches)",
        "Absorption (inches)",
        "Runoff (inches)",
      ],
      activeTableContent: this.testHistory,
    };
  },
  computed: {
    /**
     * Get the number of tests run by the user from store.
     */
    testHistoryLength() {
      return this.$store.getters.getthLength;
    },
    /**
     * Get the entire test history from the store.
     */
    testHistory() {
      if (this.currentRouteName === "IE") {
        return this.activeTableContent;
      } else {
        return this.$store.getters.getTestHistory;
      }
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
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
    /**
     * Generates a table by accessing design history content from c2stem environemnt.
     * The method gets design history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new design history from c2stem.
     */
    async generateTable() {
      if (this.currentRouteName === "IE") {
        this.testHistoryContent = await visualize.getTestData("manipulate");
        this.activeTableContent = this.testHistoryContent;
        // this.$store.dispatch("addIETestHistory", this.testHistoryContent);
      } else {
        this.activeTableContent = this.testHistory;
        this.testHistoryContent = await visualize.getTestData("construct");
        let thLength = Object.keys(this.testHistoryContent).length;
        let stateThLength = this.testHistoryLength;
        if (thLength > stateThLength) {
          const thList = [];
          Object.values(this.testHistoryContent).forEach((element, index) => {
            if (index >= stateThLength && index < thLength) {
              thList.push(element);
            }
          });
          console.log(thList);
          this.$store.dispatch("addTestHistory", thList);
        }
      }
    },
  },
};
</script>

<style scoped>
.start-panel {
  height: auto;
  width: 100%;
  margin: 2px 10px 1px 10px;
  display: flex;
}
.title {
  margin-left: 30%;
}
</style>
