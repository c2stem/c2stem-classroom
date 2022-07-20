<template>
  <ul class="nav nav-pills border border-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="test-model-tab"
        data-bs-toggle="pill"
        data-bs-target="#test-model"
        type="button"
        role="tab"
        aria-controls="test-model"
        aria-selected="true"
        @click="runModel"
      >
        Test Model
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
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
        class="nav-link"
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
  <div class="tab-content border border-3" id="pills-tabContent">
    <div
      class="tab-pane fade show active"
      id="test-model"
      role="tabpanel"
      aria-labelledby="test-model-tab"
      tabindex="0"
    >
      ...
    </div>
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
      <div id="chart"></div>>
    </div>
  </div>
</template>

<script>
import simulation from "../services/Simulation";
import visualize from "../services/Visualize";

export default {
  name: "DisplayPanel",
  data(){
    return{
      designHistory_content: []
    }
  },
  methods: {
    runModel(event) {
      simulation.runProject(event);
    },
    generateTable(){
      this.designHistory_content = visualize.getData();
      visualize.drawTable(this.designHistory_content);
    },
    generateChart(){
      this.designHistory_content = visualize.getData();
      visualize.drawChart(this.designHistory_content);
    }
  },
  mounted(){
    window.google.charts.load("current", { packages: ["table","corechart","line"] });
  }
};
</script>
