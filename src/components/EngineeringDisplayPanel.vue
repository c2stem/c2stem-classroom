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
        @click="logAction('viewInstructions')"
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
import Simulation from "../services/Simulation";
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
        "submit",
      ],
      compareHeader: [
        "Stage",
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
      let designHistory = this.$store.getters.getDesignHistory;
      if (Object.keys(designHistory).length !== 0) {
        if (!visualize.isDesignFormatted(designHistory)) {
          designHistory = visualize.changeDesignFormat(designHistory);
        }
      }
      return designHistory;
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
  methods: {
    /**
     * Generates a table by accessing design history content from c2stem environment.
     * The method gets design history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new design history from c2stem.
     */
    async generateTable() {
      this.designHistory_content = await visualize.getData();
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

    async addDSummary() {
      let dhs = {};
      let dh = await visualize.getData();
      let dhIndex = Object.keys(dh).length;
      dhs["designHistory"] = dh[dhIndex];
      dhs["checkStatus"] = false;
      dhs["favoriteStatus"] = false;
      dhs["stageMaterials"] = await Simulation.getEngineeringStageMaterials();
      this.$store.dispatch("addDesignHistorySummary", dhs);
    },
  },
  mounted() {
    /**
     * Load google visualization library
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });

    this.emitter.on("update-data", async (evt) => {
      if (evt.status) {
        this.generateTable();
        this.addDSummary();
        await Simulation.saveToCloud(this.getProjectName);
      }
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
