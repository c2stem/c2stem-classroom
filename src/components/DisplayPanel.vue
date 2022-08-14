<template>
  <!-- Display Panel Component -->
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
        Get Test History
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="visualize-tab"
        data-bs-toggle="pill"
        data-bs-target="#visualize"
        type="button"
        role="tab"
        aria-controls="visualize"
        aria-selected="false"
        @click="generateChart"
      >
        Visualize
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
    <div
      class="tab-pane fade"
      id="visualize"
      role="tabpanel"
      aria-labelledby="visualize-tab"
      tabindex="0"
    >
      <div id="chart"></div>
      >
    </div>
  </div>
</template>

<script>
/**
 * Display Panel Component
 * Can be integrated with any component that requires design history visualization.
 * @requires ./DesignTable.vue Component to generate a table
 * @requires ../services/Visualize.js currently using Google library to generate charts.
 */
import visualize from "../services/Visualize";
import DesignTable from "./DesignTable.vue";

export default {
  name: "DisplayPanel",
  components: {
    DesignTable,
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
  },
  methods: {
    /**
     * Generates a table by accessing design history content from c2stem environemnt.
     * The method gets design history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new design history from c2stem.
     */
    generateTable() {
      this.designHistory_content = visualize.getData();
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
    /**
     * Generates a chart by accessing design history content from c2stem environemnt.
     * Passes the design history contents to the google library. 
     */
    generateChart() {
      this.designHistory_content = visualize.getData();
      visualize.drawChart(this.designHistory_content);
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
</style>
