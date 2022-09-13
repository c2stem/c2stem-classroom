<template>
<!-- Manipulate Lesson Seven view -->
  <div class="container">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Simulation</i>
    </button>
    <!-- <button type="button" class="btn btn-danger" @click="closeCode">
      Close Code
    </button> -->
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#TestHistoryModal"
      @click="generateTable"
    >
      Get Test History
    </button>

    <!-- Modal -->
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
            <div id="table"></div>
            <notes></notes>
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
    <button
      type="button"
      class="btn btn-info"
      data-bs-toggle="modal"
      data-bs-target="#visualizeModal"
      @click="generateChart"
    >
      Visualize
    </button>

    <!-- Modal -->
    <div
      class="modal fade"
      id="visualizeModal"
      tabindex="-1"
      aria-labelledby="visualizeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="visualizeModalLabel">Visualize</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div id="chart"></div>
            <notes></notes>
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

    <iframe-loader
      source="https://editor.c2stem.org"
      iframeid="iframe-id"
      username="oele"
      projectname="cmise-project-lesson7-manipulate"
      :embed="false"
    ></iframe-loader>
  </div>
</template>

<script>
/**
 * Manipulate code view.
 * It is based on the construct view with an ability to switch between 2 differnt views.
 * In this view User will have access to a C2STEM project in an iframe. 
 * Data visualization is available on a button click in modals. 
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 * @requires ../services/Simulation.js for c2stem Simulation methods.
 * @requires ../services/Visualize.js for data visualization.
 */
import IframeLoader from "../../../components/IframeLoader.vue";
import simulation from "../../../services/Simulation";
import visualize from "../../../services/Visualize";
import Notes from "../../../components/Notes.vue";

export default {
  name: "Manipulate Code View",
  components: {
    IframeLoader,
    Notes,
  },
  data() {
    return {
      designHistory_content: [],
      designHistoryHeader: [
        "test",
        "date",
        "rainfall",
        "material",
        "absorption",
        "runoff",
        "cost",
      ],
    };
  },
  methods: {
    /**
     * Run green flag
     */
    runModel(event) {
      simulation.runProject(event);
    },
    /**
     * Get data from C2STEM and generate a table using google library.
     */
    generateTable() {
      this.designHistory_content = visualize.getData();
      visualize.drawTable(this.designHistoryHeader, this.designHistory_content);
    },
    /**
     * Get data from C2STEM and generate a chart using google library.
     */
    generateChart() {
      this.designHistory_content = visualize.getData();
      visualize.drawChart(this.designHistoryHeader, this.designHistory_content);
    },
    /**
     * route back to manipulate view.
     */
    // closeCode() {
    //     this.$router.push("/manipulate");
    // }
  },
  mounted() {
    /**
     * import google visualization library.
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  height: 86%;
  padding: 0;
  background-color: #1e1e1e;
}
div {
  min-height: 0;
}
.btn {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
