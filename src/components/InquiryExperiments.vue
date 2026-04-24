<template>
  <div class="experiments-wrapper">

    <!-- Left: Simulation Column -->
    <div class="sim-column">
      <div class="sim-buttons">
        <button class="btn btn-success btn-sm" @click="runFullStorm">Run full storm</button>
        <button class="btn btn-success btn-sm" @click="runOneHour">Run 1 hr</button>
      </div>

      <div class="sim-iframe-area">
        <iframe-loader
          :source="iframeSrc"
          iframeid="iframe-id"
          username="oele"
          projectname="meigs-computational-temporal-expert-shruti"
          :embed="true"
        ></iframe-loader>
      </div>

      <div class="sim-sliders">
        <div class="slider-row">
          <label class="slider-label">Rainfall rate (inch/hour)</label>
          <div class="slider-track">
            <span class="slider-min">0.1</span>
            <input type="range" class="form-range" v-model.number="rainfallRate"
                   min="0.1" max="3.0" step="0.1" @change="onSliderChange" />
            <span class="slider-max">3.0</span>
          </div>
          <span class="slider-value">{{ rainfallRate }}</span>
        </div>
        <div class="slider-row">
          <label class="slider-label">Rainfall duration (hours)</label>
          <div class="slider-track">
            <span class="slider-min">1</span>
            <input type="range" class="form-range" v-model.number="rainfallDuration"
                   min="1" max="24" step="1" @change="onSliderChange" />
            <span class="slider-max">24</span>
          </div>
          <span class="slider-value">{{ rainfallDuration }}</span>
        </div>
      </div>
    </div>

    <!-- Right: Display Column -->
    <div class="display-column">

      <!-- Hypothesis dropdown -->
      <div class="display-row">
        <label class="display-label fw-bold">Hypothesis:</label>
        <select v-model="selectedHypothesis" class="form-select form-select-sm">
          <option value="" disabled>Select a hypothesis</option>
          <option v-for="(claim, key) in hypothesisClaims" :key="key" :value="key">
            {{ claim }}
          </option>
        </select>
      </div>

      <!-- Variable to test -->
      <div class="display-row mt-2">
        <label class="display-label">Which variable would you change to test the hypothesis</label>
        <select v-model="selectedVariable" class="form-select form-select-sm">
          <option value="" disabled>Select a variable</option>
          <option value="rainfallRate">Rainfall rate</option>
          <option value="surfaceMaterial">Surface material</option>
          <option value="rainfallDuration">Rainfall duration</option>
        </select>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-pills exp-tabs mt-3 gap-2">
        <li class="nav-item">
          <button class="nav-link active" id="current-test-tab"
                  data-bs-toggle="pill" data-bs-target="#current-test"
                  type="button" role="tab">
            Current test
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" id="test-history-tab"
                  data-bs-toggle="pill" data-bs-target="#exp-test-history"
                  type="button" role="tab">
            Test history
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" id="compare-tab"
                  data-bs-toggle="pill" data-bs-target="#exp-compare"
                  type="button" role="tab">
            Compare
          </button>
        </li>
      </ul>

      <div class="tab-content exp-tab-content mt-2">
        <div class="tab-pane show active" id="current-test" role="tabpanel">
          <p class="text-muted fst-italic">Current test results will appear here.</p>
        </div>
        <div class="tab-pane" id="exp-test-history" role="tabpanel">
          <p class="text-muted fst-italic">Test history will appear here.</p>
        </div>
        <div class="tab-pane" id="exp-compare" role="tabpanel">
          <p class="text-muted fst-italic">Compare view will appear here.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import IframeLoader from "./IframeLoader.vue";
import Simulation from "../services/Simulation";

export default {
  name: "InquiryExperiments",
  components: { IframeLoader },
  data() {
    return {
      iframeSrc: "https://editor.c2stem.org",
      username: sessionStorage.getItem("user")?.replaceAll('"', "") || "",
      projectName: sessionStorage.getItem("projectName") || "meigs-computational-temporal-expert-shruti",
      rainfallRate: 0.1,
      rainfallDuration: 1,
      selectedHypothesis: "",
      selectedVariable: "",
      questions: [
        { id: 1, key: "rainfallRate",    condition: "If rainfall rate increases" },
        { id: 2, key: "surfaceMaterial", condition: "If we change the surface material" },
        { id: 3, key: "rainfallDuration",condition: "If rain continues for a long time" },
      ],
    };
  },
  computed: {
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
    hypothesisClaims() {
      const claims = {};
      this.questions.forEach((q) => {
        const h = this.hypotheses[q.id];
        const effects = h.effect.length ? h.effect.join(" or ") : "…";
        const reasons = h.reason.length ? h.reason.join(" or ") : "…";
        claims[q.key] = `${q.condition}, ${effects} because ${reasons}`;
      });
      return claims;
    },
  },
  methods: {
    runFullStorm() {
      Simulation.runProject();
    },
    runOneHour() {
      Simulation.runProject();
    },
    onSliderChange() {
      Simulation.setVariable("rainfallRate", this.rainfallRate);
      Simulation.setVariable("rainfallDuration", this.rainfallDuration);
    },
  },
};
</script>

<style scoped>
div{
  min-height: auto;
  height: auto;
}
.experiments-wrapper {
  display: flex;
  gap: 20px;
  height: 100%;
  min-width: 0;
  overflow-x: auto;
}

/* Left column */
.sim-column {
  width: 400px;
  min-width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sim-buttons {
  display: flex;
  gap: 8px;
}

.sim-iframe-area {
  width: 400px;
  height: 400px;
  min-width: 400px;
  min-height: 400px;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  display: block;
}

.sim-sliders {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slider-label {
  font-size: 0.85rem;
  font-weight: 500;
}

.slider-track {
  display: flex;
  align-items: center;
  gap: 6px;
}

.slider-min,
.slider-max {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.slider-value {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: right;
}

/* Right column */
.display-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.display-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.display-label {
  white-space: nowrap;
  font-size: 0.9rem;
}

.exp-tabs .nav-link {
  color: #fff;
  background-color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 0.3rem;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  font-weight: 400;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.exp-tabs .nav-link:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.exp-tabs .nav-link.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: #fff;
}

.exp-tabs .nav-link.active:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.exp-tab-content {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}
</style>
