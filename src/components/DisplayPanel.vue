<template>
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
  <div class="tab-content" id="pills-tabContent">
    <div class="tab-pane show" role="tabpanel" tabindex="0">Display Panel</div>
    <div
      class="tab-pane fade"
      id="test-history"
      role="tabpanel"
      aria-labelledby="test-history-tab"
      tabindex="0"
    >
      <div id="table"></div>
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
import simulation from "../services/Simulation";
import visualize from "../services/Visualize";

export default {
  name: "DisplayPanel",
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
        "compare"
      ],
    };
  },
  computed: {
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    designHistory(){
      return this.$store.getters.getDesignHistory;
    }
  },
  methods: {
    runModel(event) {
      simulation.runProject(event);
    },
    generateTable() {
      this.designHistory_content = visualize.getData();
      let dhLength = this.designHistory_content.length;
      let statedhLength = this.historyLength;
      if (dhLength > statedhLength) {
        const dhList = [];
        this.designHistory_content.map((element, index) => {
          if (index === 0) {
            if (dhLength < 2) {
              visualize.drawTable(this.designHistoryHeader, dhList);
            }else{
              return;
            }
          } else if (index >= statedhLength && index < dhLength) {
            dhList.push(element.contents);
          }
        });
        this.$store.dispatch("addDesignHistory", dhList);
        visualize.drawTable(
          this.designHistoryHeader,
          this.designHistory
        );
        //save to store and generate an updated map.
        // update design history length.
      } else {
        // send old data to load the table.
        visualize.drawTable(
          this.designHistoryHeader,
          this.designHistory
        );
      }
    },
    generateChart() {
      this.designHistory_content = visualize.getData();
      visualize.drawChart(this.designHistory_content);
    },
  },
  mounted() {
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
