<template>
  <!-- Engineering Display Panel Component -->
  <!-- A component based on Display Panel Component modified for CMISE engineering design -->
  <!-- Navigation pills -->
  <ul class="nav nav-pills" id="pills-tab" role="tablist">
    <li class="nav-item me-3" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="test-history-tab"
        data-bs-toggle="pill"
        data-bs-target="#test-history"
        type="button"
        role="tab"
        aria-controls="test-history"
        aria-selected="false"
        @click="generateTable"
      >
        Design History
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="visualize-tab"
        data-bs-toggle="modal"
        data-bs-target="#compare"
        @click="compareDesigns"
      >
        Compare
      </button>
    </li>
  </ul>
  <!-- Tab content for the pills -->
  <div class="tab-content" id="pills-tabContent">
    <div class="tab-pane show" role="tabpanel" tabindex="0">Display Panel</div>
    <div
      class="tab-pane fade"
      id="test-history"
      role="tabpanel"
      aria-labelledby="test-history-tab"
      tabindex="0"
    >
      <design-table
        :header="designHistoryHeader"
        :contents="designHistory"
        :checked="getCheckedDesigns"
      ></design-table>
    </div>
  </div>
  <div
    class="modal fade"
    id="compare"
    tabindex="-1"
    aria-labelledby="compareLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="compareLabel">Compare</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <compare
            :header="compareHeader"
            :contents="designHistory"
            :checked="getCheckedDesigns"
            :images="getSimulationImages"
          ></compare>
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
</template>

<script>
/**
 * Display Panel Component
 * Can be integrated with any component that requires design history visualization.
 * @requires ./DesignTable.vue Component to generate a table
 * @requires ../services/Visualize.js currently using Google library to generate charts.
 * @requires ./Compare.vue Component to generate a table of selected designs for comparison.
 */
import visualize from "../services/Visualize";
import DesignTable from "./DesignTable.vue";
import Compare from "./Compare.vue";

export default {
  name: "EngineeringDisplayPanel",
  components: {
    DesignTable,
    Compare,
  },
  data() {
    return {
      designHistoryContent: [],
      designHistoryHeader: [
        "design",
        "date",
        "cost",
        "rainfall",
        "runoff",
        "accessible squares",
        "concrete",
        "permeable concrete",
        "grass",
        "wood chips",
        "artificial turf",
        "poured rubber",
        "compare",
      ],
      compareHeader: [
        "Stage",
        "design",
        "date",
        "cost",
        "rainfall",
        "runoff",
        "accessible squares",
        "concrete",
        "permeable concrete",
        "grass",
        "wood chips",
        "artificial turf",
        "poured rubber",
      ],
      checkedDesignStatus: [],
    };
  },
  computed: {
    /**
     * Get the number of tests run by the user from store.
     */
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    /**
     * Get the entire design history from the store.
     */
    designHistory() {
      return this.$store.getters.getDesignHistory;
    },
    /**
     * Get a list of checkbox status in the design history table from the store.
     */
    getCheckedDesigns() {
      return this.$store.getters.getCheckedDesigns;
    },
    /**
     * Get a list of Stage images from the store.
     */
    getSimulationImages() {
      return this.$store.getters.getStageImages;
    },
    /**
     * Get the status of green flag from store.
     */
    getRunStatus() {
      return this.$store.getters.getSimulationStatus;
    },
  },
  // watch: {
  //   getRunStatus() {
  //     this.generateTable();
  //     this.$store.dispatch("updateSimulationStatus", false);
  //   },
  // },
  methods: {
    /**
     * Generates a table by accessing design history content from c2stem environemnt.
     * The method gets design history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new design history from c2stem.
     */
    async generateTable() {
      this.designHistory_content = await visualize.getData();
      this.checkedDesignStatus = this.getCheckedDesigns;
      let dhLength = Object.keys(this.designHistory_content).length;
      let stateDhLength = this.historyLength;
      if (dhLength > stateDhLength) {
        const dhList = [];
        const checkList = [];
        Object.values(this.designHistory_content).forEach((element, index) => {
          if (index >= stateDhLength && index < dhLength) {
            dhList.push(element);
            checkList.push(false);
          }
        });
        this.$store.dispatch("addDesignHistory", dhList);
        this.$store.dispatch("addCheckedDesigns", checkList);
      }
    },
  },
  mounted() {
    /**
     * Load google visualization library
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
  },
};
</script>

<style scoped>
ul,
div {
  border: 3px inset #615195;
}
.modal-dialog {
  --bs-modal-width: 100%;
}
</style>
