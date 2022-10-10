<template>
  <!-- Display Panel Component -->
  <!-- Navigation pills -->
  <ul class="nav nav-pills" id="pills-tab" role="tablist">
    <li class="nav-item me-3" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="instructions-tab"
        data-bs-toggle="pill"
        data-bs-target="#instructions"
        type="button"
        role="tab"
        aria-controls="instructions"
        aria-selected="false"
      >
        Instructions
      </button>
    </li>
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
    <!-- <li class="nav-item" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="visualize-tab"
        data-bs-toggle="pill"
        data-bs-target="#visualize"
        type="button"
        role="tab"
        aria-controls="visualize"
        aria-selected="false"
        @click="generateGraph"
      >
        Visualize
      </button>
    </li> -->
  </ul>
  <!-- Tab content for the pills -->
  <div class="tab-content" id="pills-tabContent">
    <div class="tab-pane show" role="tabpanel" tabindex="0">Display Panel</div>
    <div
      class="tab-pane fade"
      id="instructions"
      role="tabpanel"
      aria-labelledby="instructions-tab"
      tabindex="0"
    >
      <instructions />
    </div>
    <div
      class="tab-pane fade"
      id="test-history"
      role="tabpanel"
      aria-labelledby="test-history-tab"
      tabindex="1"
    >
      <test-table
        :header="testHistoryHeader"
        :contents="testHistory"
      ></test-table>
    </div>
    <!-- <div
      class="tab-pane fade"
      id="visualize"
      role="tabpanel"
      aria-labelledby="visualize-tab"
      tabindex="2"
    >
      <div id="chart"></div>
      
    </div> -->
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
import TestTable from "./TestTable.vue";
import Instructions from "./Instructions.vue"

export default {
  name: "DisplayPanel",
  components: {
    TestTable,
    Instructions,
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
        // this.$store.dispatch("addCheckedDesigns", checkList);
      // }
      // this.testHistory_content = await visualize.getTestData();
      // console.log(this.testHistoryContent)

      // let thLength = Object.keys(this.testHistoryContent).length;
      // console.log(thLength)

      // let stateThLength = this.testHistoryLength;
      // console.log(stateThLength)

      // if (thLength > stateThLength) {
      //   const thList = [];

      //   Object.values(this.testHistoryContent).forEach((element, index) => {
      //     if (index >= stateThLength && index < thLength) {
      //       thList.push(element);

      //     }
      //   });
      //   console.log(thList)
      //   this.$store.dispatch("addTestHistory", thList);
 
      }
    },
    /**
     * Generates a chart by accessing test history content from c2stem environemnt.
     * Passes the design history contents to the google library. 
     */
    // generateGraph() {
    //   this.testHistoryContent = visualize.getTestData();
    //   console.log(this.testHistoryContent)
    //   visualize.drawGraph(this.testHistoryChartHeader, this.testHistoryContent);
    // },
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
