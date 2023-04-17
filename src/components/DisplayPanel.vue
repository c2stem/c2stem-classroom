<template>
  <!-- Display Panel Component -->
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
        Test History
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
        :header="testHistoryHeader"
        :contents="activeTableContent"
      ></design-table>
    </div>
    <div
      class="tab-pane fade overflow-auto show active"
      id="instructions"
      role="tabpanel"
      aria-labelledby="instructions"
      tabindex="0"
    >
      <instructions routeName="EE" />
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
import Instructions from "./Instructions.vue";

export default {
  name: "DisplayPanel",
  components: {
    DesignTable,
    Instructions,
  },
  data() {
    return {
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
      return this.$store.getters.getTestHistory;
    },
    currentRouteName() {
      let name = this.$route.name;
      return name;
    },
  },
  methods: {
    /**
     * Generates a table by accessing test history content from c2stem environemnt.
     * The method gets test history from c2stem and compares the results with the history in the store.
     * The history in the store is updated with new test history from c2stem.
     */
    async generateTable() {
      if (this.currentRouteName == "EE") {
        this.testHistoryContent = await visualize.getTestData("explore");
        this.activeTableContent = this.testHistoryContent;
        this.$store.dispatch("addEETestHistory", this.testHistoryContent);
      } else {
        this.activeTableContent = this.testHistory;
        this.testHistoryContent = await visualize.getTestData("explore");
        let thLength = Object.keys(this.testHistoryContent).length;
        let stateThLength = this.testHistoryLength;
        if (thLength > stateThLength) {
          const thList = [];
          Object.values(this.testHistoryContent).forEach((element, index) => {
            if (index >= stateThLength && index < thLength) {
              thList.push(element);
            }
          });
          this.$store.dispatch("addTestHistory", thList);
        }
      }
    },
  },
  mounted() {
    this.emitter.on("update-data", (evt) => {
      if (evt.status) {
        this.generateTable();
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
</style>
