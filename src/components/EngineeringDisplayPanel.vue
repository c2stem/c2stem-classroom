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
    <div class="modal-dialog modal-xl">
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
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    designHistory() {
      return this.$store.getters.getDesignHistory;
    },
    getCheckedDesigns() {
      return this.$store.getters.getCheckedDesigns;
    },
    getSimulationImages() {
      return this.$store.getters.getStageImages;
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
.modal-dialog{
    --bs-modal-width:100%;
}
</style>
