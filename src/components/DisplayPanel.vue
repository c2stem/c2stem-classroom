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
      ...
    </div>
    <div
      class="tab-pane fade"
      id="visualize"
      role="tabpanel"
      aria-labelledby="visualize-tab"
      tabindex="0"
    >
      ...
    </div>
  </div>
</template>

<script>
import simulation from "../services/Simulation"

export default {
    name: "DisplayPanel",
    methods:{
      runModel(event){
        simulation.runProject(event);
      }
    }
}
</script>
