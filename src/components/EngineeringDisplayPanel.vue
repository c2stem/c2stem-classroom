<template>
  <!-- Engineering Display Panel Component -->
  <!-- A component based on Display Panel Component modified for CMISE engineering design -->
  <!-- Navigation pills -->
  <ul class="nav nav-pills" id="pills-tab" role="tablist">
    <li class="nav-item me-3" role="presentation">
      <button
        class="nav-link active bg-info bg-gradient"
        id="instructions-tab"
        data-bs-toggle="pill"
        data-bs-target="#instructions"
        type="button"
        role="tab"
        aria-controls="instructions"
        aria-selected="false"
        @click="logAction('viewInstructions'); stopCtPolling(); emitter.emit('display-tab-change', 'instructions')"
      >
        Instructions
      </button>
    </li>
    <li class="nav-item me-3" role="presentation">
      <button
        class="nav-link bg-info bg-gradient"
        id="eng-current-test-tab"
        data-bs-toggle="pill"
        data-bs-target="#eng-current-test"
        type="button"
        role="tab"
        @click="onCurrentTestTabClick"
      >
        Current Test
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
        @click="generateTable(); stopCtPolling(); emitter.emit('display-tab-change', 'history')"
      >
        Design History
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link bg-warning bg-gradient"
        id="visualize-tab"
        data-bs-toggle="modal"
        data-bs-target="#compare"
        @click="logAction('compare')"
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
        v-if="currentRouteName === 'Playground'"
        :header="designHistoryHeader"
        :contents="playHistory"
        :checked="getPlayChecks"
        :favorite="getPlayFavs"
      ></design-table>
      <design-table
        v-else
        :header="designHistoryHeader"
        :contents="designHistory"
        :checked="getCheckedDesigns"
        :favorite="getFavoriteDesigns"
      ></design-table>
    </div>
    <div
      class="tab-pane fade overflow-auto show active"
      id="instructions"
      role="tabpanel"
      aria-labelledby="instructions"
      tabindex="0"
    >
      <instructions routeName="Engineering" />
    </div>
    <div class="tab-pane fade" id="eng-current-test" role="tabpanel" tabindex="0">
      <div v-if="Object.keys(hourlyTableContent).length" class="current-test-layout">
        <div class="ct-card" :class="ctTableExpanded ? 'ct-expanded' : ctChartExpanded ? 'ct-collapsed' : 'ct-half'">
          <div class="ct-card-header">
            <span class="ct-card-title">Hourly Data</span>
            <div class="ct-card-actions">
              <button class="ct-action-btn" @click="toggleCtTableExpand" :title="ctTableExpanded ? 'Restore' : 'Expand'">
                <i :class="ctTableExpanded ? 'bi bi-arrows-angle-contract' : 'bi bi-arrows-angle-expand'"></i>
              </button>
            </div>
          </div>
          <div class="ct-card-body">
            <div class="hourly-table-wrap">
              <design-table :header="hourlyHeader" :contents="hourlyTableContent" :local-only="true"></design-table>
            </div>
          </div>
        </div>
        <div class="ct-card" :class="ctChartExpanded ? 'ct-expanded' : ctTableExpanded ? 'ct-collapsed' : 'ct-half'">
          <div class="ct-card-header">
            <span class="ct-card-title">Runoff Chart</span>
            <div class="ct-card-actions">
              <button class="ct-action-btn" @click="toggleCtChartExpand" :title="ctChartExpanded ? 'Restore' : 'Expand'">
                <i :class="ctChartExpanded ? 'bi bi-arrows-angle-contract' : 'bi bi-arrows-angle-expand'"></i>
              </button>
            </div>
          </div>
          <div class="ct-card-body">
            <div id="eng-ct-chart" class="hourly-chart"></div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted fst-italic p-2">Run a test design to see hourly results.</p>
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
            v-if="currentRouteName === 'Playground'"
            :header="compareHeader"
            :contents="playHistory"
            :checked="getPlayChecks"
            :images="getPlayFavs"
          ></compare>
          <compare
            v-else
            :header="compareHeader"
            :contents="compareDesignHistory"
            :checked="getCheckedDesigns"
            :images="getSimulationImages"
          ></compare>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="logAction('closeCompare')"
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
/** 2025-update
 * changing the order for the SPICe 2025 study.
 * The current order is
 *  design, data, cost, rainfall, absorption limit, runoff, accessible squares, (rest of the materials).
 * */
import visualize from "../services/Visualize";
import DesignTable from "./DesignTable.vue";
import Compare from "./Compare.vue";
import Instructions from "./Instructions.vue";
import Logger from "../services/Logger";
// import Simulation from "../services/Simulation";
export default {
  name: "EngineeringDisplayPanel",
  components: {
    DesignTable,
    Compare,
    Instructions,
  },
  data() {
    return {
      designHistoryContent: [],

      designHistoryHeader: [
        "fav",
        "design/date",
        "cost",
        "rainfall",
        "absorption",
        "runoff",
        "concrete",
        "permeable concrete",
        "grass",
        "wood chips",
        "artificial turf",
        "poured rubber",
        "compare",
        // "submit",
      ],
      compareHeader: [
        "Stage",
        "design/date",
        "cost",
        "rainfall",
        "absorption",
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
      hourlyTableContent: {},
      hourlyHeader: ["Time (hours)", "Total Rainfall (in)", "Total Absorption (in)", "Total Runoff (in)"],
      ctTableExpanded: false,
      ctChartExpanded: false,
      ctPollInterval: null,
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
      let designHistory = this.$store.getters.getDesignHistory;
      if (Object.keys(designHistory).length !== 0) {
        if (!visualize.isDesignFormatted(designHistory)) {
          designHistory = visualize.changeDesignFormat(designHistory);
        }
      }
      return designHistory;
    },
    compareDesignHistory() {
      let dh = this.$store.getters.getDesignHistory;
      if (Object.keys(dh).length === 0) return dh;
      if (!visualize.isDesignFormatted(dh)) {
        return visualize.changeDesignFormatFull(dh);
      }
      return dh;
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
    getFavoriteDesigns() {
      return this.$store.getters.getFavoriteDesigns;
    },
    currentRouteName() {
      return this.$route.name;
    },
    playHistory() {
      return this.$store.getters.getPlayHistory;
    },
    getPlayChecks() {
      return this.$store.getters.getPlayChecks;
    },
    getPlayFavs() {
      return this.$store.getters.getPlayFavs;
    },
    getProjectName() {
      return sessionStorage.getItem("projectName");
    },
  },
  watch: {
    hourlyTableContent(newVal) {
      if (Object.keys(newVal).length) {
        this.$nextTick(() => this.drawEngCtChart());
      }
    },
  },
  methods: {
    /**
     * Generates a table by accessing design history content from c2stem environment.
     * The method gets design history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new design history from c2stem.
     */
    async generateTable() {
      this.designHistory_content = await visualize.getData();
      if (!this.designHistory_content) return;
      if (this.currentRouteName === "Playground") {
        const dhList = [];
        const checkList = [];
        const favList = [];
        Object.values(this.designHistory_content).forEach((element) => {
          dhList.push(element);
          checkList.push(false);
          favList.push(false);
        });
        this.$store.dispatch("addPlayHistory", dhList);
        this.$store.dispatch("addPlayFavorites", favList);
        this.$store.dispatch("addPlayCheckedStatus", checkList);
      } else {
        const dhList = [];
        const checkList = [];
        const favList = [];
        let dhLength = Object.keys(this.designHistory_content).length;
        this.checkedDesignStatus = this.getCheckedDesigns;
        let checkLength = this.checkedDesignStatus.length;
        // let favLength = this.favoriteStatus.length;
        this.favoriteStatus = this.getFavoriteDesigns;
        let stateDhLength = this.historyLength;
        if (checkLength > stateDhLength) {
          if (checkLength === dhLength || checkLength === dhLength - 1) {
            this.checkedDesignStatus.forEach((element) => {
              checkList.push(element);
            });
            this.favoriteStatus.forEach((element) => {
              favList.push(element);
            });
          } else {
            this.$store.dispatch("resetCheckedDesigns");
            this.$store.dispatch("resetFavoriteDesigns");
          }
        }
        if (dhLength > stateDhLength) {
          Object.values(this.designHistory_content).forEach(
            (element, index) => {
              if (index >= stateDhLength && index < dhLength) {
                dhList.push(element);
                checkList.push(false);
                favList.push(false);
              }
            }
          );
          this.$store.dispatch("addDesignHistory", dhList);
          // if (this.getFavoriteDesigns.length === 0) {
          this.$store.dispatch("addFavoriteDesigns", favList);
          // }
          // if (this.getCheckedDesigns.length === 0) {
          this.$store.dispatch("addCheckedDesigns", checkList);
          // }
        }
        let logDh = [];
        if (dhList.length > 0) {
          logDh = dhList[dhList.length - 1];
        } else {
          logDh = [];
        }
        await Logger.logUserActions({
          actionType: "viewDesignHistory",
          actionView: this.currentRouteName,
          args: {
            projectName: this.getProjectName,
            Model: logDh,
          },
        });
      }
    },

    async logAction(actionType) {
      await Logger.logUserActions({
        actionType: actionType,
        actionView: this.currentRouteName,
        args: {},
      });
    },

    async onCurrentTestTabClick() {
      this.emitter.emit('display-tab-change', 'current-test');
      const data = await visualize.getInquiryHourlyData();
      if (data) this.hourlyTableContent = data;
      this.$nextTick(() => this.drawEngCtChart());
      this.startCtPolling();
    },
    startCtPolling() {
      if (this.ctPollInterval) return;
      this.ctPollInterval = setInterval(async () => {
        const data = await visualize.getInquiryHourlyData();
        if (data) this.hourlyTableContent = data;
      }, 3000);
    },
    stopCtPolling() {
      clearInterval(this.ctPollInterval);
      this.ctPollInterval = null;
    },
    drawEngCtChart() {
      const el = document.getElementById("eng-ct-chart");
      if (!el || !window.google?.visualization) return;
      const rows = Object.values(this.hourlyTableContent);
      if (!rows.length) return;
      const keys = Object.keys(rows[0]);
      const [timeKey, rainfallKey, absorptionKey, runoffKey] = keys;
      const data = new window.google.visualization.DataTable();
      data.addColumn("number", "Time (hours)");
      data.addColumn("number", "Rainfall (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Absorption (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Runoff (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addRow([0, 0, null, 0, null, 0, null]);
      rows.forEach((row) => {
        const t = Number(row[timeKey]);
        const r = Number(row[rainfallKey]);
        const a = Number(row[absorptionKey]);
        const ru = Number(row[runoffKey]);
        data.addRow([
          t,
          r,  `Time (hours): ${t} | Total Rainfall (in): ${r}`,
          a,  `Time (hours): ${t} | Total Absorption (in): ${a}`,
          ru, `Time (hours): ${t} | Total Runoff (in): ${ru}`,
        ]);
      });
      const maxTime = Math.max(...rows.map((r) => Number(r[timeKey])));
      const hTicks = Array.from({ length: maxTime + 1 }, (_, i) => i);
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0, ticks: hTicks, titleTextStyle: { italic: false } },
        vAxis: { title: "Amount of Water (inches)", minValue: 0, titleTextStyle: { italic: false } },
        series: {
          0: { color: "#0d6efd" },
          1: { color: "#198754" },
          2: { color: "#dc3545" },
        },
        legend: { position: "top" },
        chartArea: { width: "65%", height: "65%" },
        width: "100%",
        height: 260,
      };
      new window.google.visualization.LineChart(el).draw(data, options);
    },
    toggleCtTableExpand() {
      this.ctTableExpanded = !this.ctTableExpanded;
      if (this.ctTableExpanded) this.ctChartExpanded = false;
      setTimeout(() => this.drawEngCtChart(), 250);
    },
    toggleCtChartExpand() {
      this.ctChartExpanded = !this.ctChartExpanded;
      if (this.ctChartExpanded) this.ctTableExpanded = false;
      setTimeout(() => this.drawEngCtChart(), 250);
    },
    // async addDSummary() {
    //   let dhs = {};
    //   let dh = await visualize.getData();
    //   let dhIndex = Object.keys(dh).length;
    //   dhs["designHistory"] = dh[dhIndex];
    //   dhs["checkStatus"] = false;
    //   dhs["favoriteStatus"] = false;
    //   dhs["stageMaterials"] = await Simulation.getEngineeringStageMaterials();
    //   this.$store.dispatch("addDesignHistorySummary", dhs);
    // },
  },
  mounted() {
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });

    this.emitter.on("update-data", async (evt) => {
      if (evt.status) {
        this.generateTable();
      }
    });
  },
  beforeUnmount() {
    this.stopCtPolling();
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
.current-test-layout {
  display: flex;
  gap: 10px;
  align-items: stretch;
  height: 300px;
  border: none;
}
.ct-half     { flex: 1 1 50%; min-width: 0; transition: flex 0.2s ease; }
.ct-expanded { flex: 1 1 100%; min-width: 0; transition: flex 0.2s ease; }
.ct-collapsed{ flex: 0 0 0; overflow: hidden; min-width: 0; transition: flex 0.2s ease; }
.ct-card {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
}
.ct-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  background: #f0f4ff;
  border-bottom: 1px solid #dee2e6;
  flex-shrink: 0;
  border: none;
}
.ct-card-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #0d6efd;
  border: none;
}
.ct-card-actions {
  display: flex;
  gap: 4px;
  border: none;
}
.ct-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 0 2px;
  font-size: 0.85rem;
  line-height: 1;
}
.ct-action-btn:hover {
  color: #0d6efd;
}
.ct-card-body {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: none;
}
.hourly-table-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  border: none;
}
.hourly-table-wrap :deep(table) {
  font-size: 0.9rem;
}
.hourly-table-wrap :deep(th),
.hourly-table-wrap :deep(td) {
  padding: 0.3rem 0.4rem !important;
  white-space: nowrap;
}
.hourly-chart {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: none;
}
</style>
