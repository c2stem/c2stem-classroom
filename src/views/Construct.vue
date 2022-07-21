<template>
  <div class="container">
    <button type="button" class="btn btn-success" @click="runModel">
      <i class="bi bi-flag-fill"> Run Simuation</i>
    </button>
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
      source="https://physdev.c2stem.org"
      iframeid="iframe-id"
      username="naveed"
      projectname="spice-template"
      :embed="false"
    ></iframe-loader>
  </div>
</template>

<script>
import IframeLoader from "../components/IframeLoader.vue";
import simulation from "../services/Simulation";
import visualize from "../services/Visualize";
import Notes from "../components/Notes.vue"

export default {
  name: "Construct View",
  components: {
    IframeLoader,
    Notes
  },
  data() {
    return {
      designHistory_content: [],
    };
  },
  methods: {
    runModel(event) {
      simulation.runProject(event);
    },
    generateTable() {
      this.designHistory_content = visualize.getData();
      visualize.drawTable(this.designHistory_content);
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
