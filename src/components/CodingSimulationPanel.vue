<template>
<!-- Simulation Panel Component For Construct and Manipulate Views -->
  <div class="start-panel">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Model</i>
    </button>
    

  <!-- Modal -->
  <button 
    type="button" 
    class="btn btn-primary codeBttn" 
    data-bs-toggle="modal" 
    data-bs-target="#TestHistoryModal"
    @click="generateTable">
    Test History
  </button>
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
            <test-table
                :header="testHistoryHeader"
                :contents="testHistory"
            ></test-table>
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
 * Simulation Panel Component for Construct and Manipulate Views
 * A Panel with C2STEM simulation triggers.
 * Currently only has green flag to run scripts and test history modal.
 */
import simulation from "../services/Simulation";
import TestTable from "./TestTable.vue";
import visualize from "../services/Visualize";
// import SeeCode from "./SeeCode.vue";

export default {
  name: "Simulation Panel",
  components: {
    // SeeCode,
    TestTable,
  },
  data() {
    return {
      testHistoryContent: [],
      testHistoryHeader: [
        "test",
        "date",
        "rainfall",
        "material",
        "absorption",
        "runoff",
        "cost",
      ],
      // testHistoryChartHeader: [
      //   "material",
      //   "rainfall",
      //   "absorption",
      //   "runoff",
      // ],
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
      return this.$store.getters.getTestHistory;
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
      this.testHistory_content = await visualize.getTestData();
      console.log(this.designHistory_content)
      // this.checkedDesignStatus = this.getCheckedDesigns;
      let thLength = Object.keys(this.testHistory_content).length;
      let stateThLength = this.testHistoryLength;
      if (thLength > stateThLength) {
        const thList = [];
        // const checkList = [];
        Object.values(this.testHistory_content).forEach((element, index) => {
          if (index >= stateThLength && index < thLength) {
            thList.push(element);
            // checkList.push(false);
          }
        });
        console.log(thList)
        this.$store.dispatch("addTestHistory", thList);
      }
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
