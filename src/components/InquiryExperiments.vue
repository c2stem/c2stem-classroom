<template>
  <div class="experiments-wrapper">

    <!-- Left: Simulation Column -->
    <div class="sim-column">
      <div class="sim-buttons">
        <button class="btn btn-success btn-sm" @click="runFullStorm" :disabled="loopActive || !selectionReady">Run full storm</button>
        <button class="btn btn-primary btn-sm" @click="runOneHour" :disabled="(loopActive && hoursLeft === 0) || !selectionReady">
          {{ loopActive ? `Run hr ${currentHour} of ${rainfallDuration}` : 'Run 1 hr' }}
        </button>
        <span v-if="loopActive" class="loop-hint">
          {{ hoursLeft }} hr{{ hoursLeft !== 1 ? 's' : '' }} left — keep clicking to advance the storm
        </span>
      </div>

      <div class="sim-iframe-area" :class="{ 'sim-iframe-frozen': loopActive || !selectionReady }">
        <div v-if="loopActive || !selectionReady" class="iframe-overlay"></div>
        <iframe-loader
          :source="iframeSrc"
          iframeid="iframe-id"
          username="oele"
          projectname="meigs-cm-inquiry"
          :embed="true"
        ></iframe-loader>
      </div>

      <div class="sim-sliders" :class="{ 'sliders-frozen': loopActive || !selectionReady }">
        <div class="slider-row">
          <div class="slider-label-row">
            <label class="slider-label">Rainfall rate (inch/hour)</label>
            <span class="slider-value-badge">{{ rainfallRate }} inch/hr</span>
          </div>
          <div class="slider-track">
            <span class="slider-min">0.1</span>
            <input type="range" class="form-range" v-model.number="rainfallRate"
                   min="0.1" max="3.0" step="0.1" @change="onSliderChange" :disabled="loopActive || !selectionReady" />
            <span class="slider-max">3.0</span>
          </div>
        </div>
        <div class="slider-row">
          <div class="slider-label-row">
            <label class="slider-label">Rainfall duration (hours)</label>
            <span class="slider-value-badge">{{ rainfallDuration }} hr{{ rainfallDuration !== 1 ? 's' : '' }}</span>
          </div>
          <div class="slider-track">
            <span class="slider-min">1</span>
            <input type="range" class="form-range" v-model.number="rainfallDuration"
                   min="1" max="24" step="1" @change="onSliderChange" :disabled="loopActive || !selectionReady" />
            <span class="slider-max">24</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Display Column -->
    <div class="display-column">

      <div v-if="!selectionReady" class="selection-prompt">
        Select a hypothesis and variable below to unlock the experiment.
      </div>

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
      <ul class="nav nav-pills exp-tabs mt-3 gap-2" :class="{ 'tabs-frozen': !selectionReady }">
        <li class="nav-item">
          <button class="nav-link active" id="current-test-tab"
                  data-bs-toggle="pill" data-bs-target="#current-test"
                  type="button" role="tab" @click="loadHourlyData">
            Current test
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link" id="test-history-tab"
                  data-bs-toggle="pill" data-bs-target="#exp-test-history"
                  type="button" role="tab" @click="loadTestHistory">
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
          <div v-if="Object.keys(hourlyTableContent).length" class="current-test-layout">

            <!-- Table card -->
            <div class="ct-card" :class="tableExpanded ? 'ct-expanded' : chartExpanded ? 'ct-collapsed' : 'ct-half'">
              <div class="ct-card-header">
                <span class="ct-card-title">Hourly Data</span>
                <div class="ct-card-actions">
                  <button class="ct-action-btn" @click="toggleTableExpand" :title="tableExpanded ? 'Restore' : 'Expand'">
                    <i :class="tableExpanded ? 'bi bi-arrows-angle-contract' : 'bi bi-arrows-angle-expand'"></i>
                  </button>
                </div>
              </div>
              <div class="ct-card-body">
                <div class="hourly-table-wrap">
                  <design-table :header="hourlyHeader" :contents="hourlyTableContent"></design-table>
                </div>
              </div>
            </div>

            <!-- Chart card -->
            <div class="ct-card" :class="chartExpanded ? 'ct-expanded' : tableExpanded ? 'ct-collapsed' : 'ct-half'">
              <div class="ct-card-header">
                <span class="ct-card-title">Runoff Chart</span>
                <div class="ct-card-actions">
                  <button class="ct-action-btn" @click="toggleChartExpand" :title="chartExpanded ? 'Restore' : 'Expand'">
                    <i :class="chartExpanded ? 'bi bi-arrows-angle-contract' : 'bi bi-arrows-angle-expand'"></i>
                  </button>
                </div>
              </div>
              <div class="ct-card-body">
                <div id="inquiry-hourly-chart" class="hourly-chart"></div>
              </div>
            </div>

          </div>
          <p v-else class="text-muted fst-italic">Run the simulation to see hourly results.</p>
        </div>
        <div class="tab-pane" id="exp-test-history" role="tabpanel">
          <design-table
            v-if="Object.keys(testHistoryContent).length"
            :header="testHistoryHeader"
            :contents="testHistoryContent"
            :checked="testHistoryChecked"
          ></design-table>
          <p v-else class="text-muted fst-italic">No test history yet.</p>
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
import DesignTable from "./DesignTable.vue";
import Simulation from "../services/Simulation";
import Visualize from "../services/Visualize";

export default {
  name: "InquiryExperiments",
  components: { IframeLoader, DesignTable },
  data() {
    return {
      iframeSrc: "https://editor.c2stem.org",
      username: sessionStorage.getItem("user")?.replaceAll('"', "") || "",
      projectName: sessionStorage.getItem("projectName") || "meigs-computational-temporal-expert-shruti",
      rainfallRate: 0.1,
      rainfallDuration: 1,
      selectedHypothesis: "",
      selectedVariable: "",
      loopActive: false,
      currentHour: 0,
      hoursLeft: 0,
      hourlyHeader: ["Time (hours)", "Total Rainfall (in)", "Total Absorption (in)", "Total Runoff (in)"],
      hourlyTableContent: {},
      testHistoryHeader: ["Test No.", "Time", "Material", "Rainfall Rate", "Rainfall Duration", "Compare"],
      testHistoryContent: {},
      testHistoryChecked: [],
      tableExpanded: false,
      chartExpanded: false,
      questions: [
        { id: 1, key: "rainfallRate",    condition: "If rainfall rate increases" },
        { id: 2, key: "surfaceMaterial", condition: "If we change the surface material" },
        { id: 3, key: "rainfallDuration",condition: "If rain continues for a long time" },
      ],
    };
  },
  computed: {
    selectionReady() {
      return !!this.selectedHypothesis && !!this.selectedVariable;
    },
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
  watch: {
    hourlyTableContent(newVal) {
      if (Object.keys(newVal).length) {
        this.$nextTick(() => {
          window.google.charts.setOnLoadCallback(() => this.drawHourlyChart());
        });
      }
    },
  },
  methods: {
    drawHourlyChart() {
      const el = document.getElementById("inquiry-hourly-chart");
      if (!el || !window.google || !window.google.visualization) return;

      const rows = Object.values(this.hourlyTableContent);
      if (!rows.length) return;

      // Use the actual keys from the first row
      const keys = Object.keys(rows[0]);
      // keys: [timeKey, rainfallKey, absorptionKey, runoffKey]
      const [timeKey, rainfallKey, absorptionKey, runoffKey] = keys;

      const data = new window.google.visualization.DataTable();
      data.addColumn("number", "Time (hours)");
      data.addColumn("number", "Rainfall (in)");
      data.addColumn("number", "Absorption (in)");
      data.addColumn("number", "Runoff (in)");
      data.addRow([0, 0, 0, 0]);
      rows.forEach((row) => {
        data.addRow([
          Number(row[timeKey]),
          Number(row[rainfallKey]),
          Number(row[absorptionKey]),
          Number(row[runoffKey]),
        ]);
      });
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0 },
        vAxis: { title: "Amount of Water (inches)", minValue: 0 },
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
      const chart = new window.google.visualization.LineChart(el);
      chart.draw(data, options);
    },
    toggleTableExpand() {
      this.tableExpanded = !this.tableExpanded;
      if (this.tableExpanded) this.chartExpanded = false;
      this.$nextTick(() => this.drawHourlyChart());
    },
    toggleChartExpand() {
      this.chartExpanded = !this.chartExpanded;
      if (this.chartExpanded) this.tableExpanded = false;
      this.$nextTick(() => this.drawHourlyChart());
    },
    async loadHourlyData(expectedRows) {
      const maxAttempts = 20;
      const interval = 500;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, interval));
        const data = await Visualize.getInquiryHourlyData();
        if (!data) continue;
        const rowCount = Object.keys(data).length;
        if (expectedRows === undefined || rowCount >= expectedRows) {
          this.hourlyTableContent = data;
          return;
        }
      }
    },
    async loadTestHistory() {
      const data = await Visualize.getInquiryTestData();
      if (data) {
        this.testHistoryContent = data;
        this.testHistoryChecked = Array(Object.keys(data).length).fill(false);
      }
    },
    runFullStorm() {
      Simulation.runProject({ "hourly rainfall": this.rainfallRate, "rainfall duration": this.rainfallDuration });
      this.loadHourlyData(this.rainfallDuration);
    },
    runOneHour() {
      if (!this.loopActive) {
        this.loopActive = true;
        this.currentHour = 1;
        this.hoursLeft = this.rainfallDuration - 1;
      } else {
        this.currentHour += 1;
        this.hoursLeft -= 1;
      }
      Simulation.runProject({ "hourly rainfall": this.rainfallRate, "rainfall duration": this.currentHour });
      this.loadHourlyData(this.currentHour);
      if (this.hoursLeft === 0) {
        this.loopActive = false;
        this.currentHour = 0;
      }
    },
    onSliderChange() {
      Simulation.setVariable("rainfallRate", this.rainfallRate);
      Simulation.setVariable("rainfallDuration", this.rainfallDuration);
    },
  },
  mounted() {
    window.google.charts.load("current", { packages: ["corechart"] });
    window.google.charts.setOnLoadCallback(() => {
      this.googleChartsReady = true;
    });
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
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.loop-hint {
  font-size: 0.8rem;
  color: #0d6efd;
  font-style: italic;
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
  position: relative;
}

.sim-iframe-frozen {
  border-color: #0d6efd;
}

.iframe-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(13, 110, 253, 0.08);
  cursor: not-allowed;
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

.sliders-frozen {
  opacity: 0.5;
  pointer-events: none;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slider-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.slider-value-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0d6efd;
  background-color: #e7f0ff;
  border: 1px solid #b6d0ff;
  border-radius: 4px;
  padding: 1px 7px;
  white-space: nowrap;
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

.tabs-frozen {
  opacity: 0.45;
  pointer-events: none;
}

.selection-prompt {
  font-size: 1rem;
  font-weight: 700;
  color: #dc3545;
  font-style: italic;
  margin-bottom: 8px;
}

.current-test-layout {
  display: flex;
  gap: 10px;
  align-items: stretch;
  height: 300px;
}

/* size states */
.ct-half     { flex: 1 1 50%; min-width: 0; transition: flex 0.2s ease; }
.ct-expanded { flex: 1 1 100%; min-width: 0; transition: flex 0.2s ease; }
.ct-collapsed{ flex: 0 0 0; overflow: hidden; min-width: 0; transition: flex 0.2s ease; }

.ct-card {
  display: flex;
  flex-direction: column;
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
}

.ct-card-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #0d6efd;
}

.ct-card-actions {
  display: flex;
  gap: 4px;
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
  flex: 1;
  overflow: auto;
  padding: 4px;
}

.hourly-table-wrap {
  height: 100%;
  overflow-y: auto;
}

.hourly-table-wrap :deep(table) {
  font-size: 0.68rem;
}

.hourly-table-wrap :deep(th),
.hourly-table-wrap :deep(td) {
  padding: 0.15rem 0.3rem !important;
  white-space: nowrap;
}

.hourly-chart {
  width: 100%;
  height: 100%;
}
</style>
