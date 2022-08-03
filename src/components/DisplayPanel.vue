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
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    designHistory() {
      return this.$store.getters.getDesignHistory;
    },
    getCheckedDesigns() {
      return this.$store.getters.getCheckedDesigns;
    },
  },
  methods: {
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
