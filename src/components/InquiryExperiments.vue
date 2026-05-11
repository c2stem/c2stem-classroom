<template>
  <div class="experiments-wrapper">

    <!-- Left: Simulation Column -->
    <div class="sim-column">
      <div class="sim-buttons">
        <button class="btn btn-success btn-sm" @click="runFullStorm" :disabled="loopActive || fullStormLoading || !selectionReady">
          {{ fullStormLoading ? 'Loading…' : 'Run full storm' }}
        </button>
        <button class="btn btn-primary btn-sm" @click="runOneHour" :disabled="(loopActive && hoursLeft === 0) || !selectionReady || (loopActive && hourlyLoading) || fullStormLoading">
          {{ loopActive && hourlyLoading ? `Loading hr ${currentHour}…` : loopActive ? `Run hr ${currentHour + 1} of ${rainfallDuration}` : 'Run 1 hr' }}
        </button>
        <transition name="run-complete-fade">
          <span v-if="runComplete" class="run-complete-badge">
            <i class="bi bi-check-circle-fill"></i> Run complete
          </span>
        </transition>
        <span v-if="loopActive" class="loop-hint">
          {{ hoursLeft }} hr{{ hoursLeft !== 1 ? 's' : '' }} left — keep clicking to advance the storm
        </span>
      </div>

      <!-- Live simulation values -->
      <div class="sim-info-box">
        <div class="sim-info-row">
          <span class="sim-info-label">Current Material</span>
          <span class="sim-info-value">{{ simMaterial || '—' }}</span>
        </div>
        <div class="sim-info-row">
          <span class="sim-info-label">Total Absorption Limit (inches)</span>
          <span class="sim-info-value">{{ simAbsorption !== null ? simAbsorption : '—' }}</span>
        </div>
        <div class="sim-info-row">
          <span class="sim-info-label">Absorption rate (in/hr)</span>
          <span class="sim-info-value">{{ simAbsorptionLimit !== null ? simAbsorptionLimit : '—' }}</span>
        </div>
      </div>

      <div class="sim-iframe-area" :class="{ 'sim-iframe-frozen': loopActive || fullStormLoading || !selectionReady }" @mouseenter="hoveringIframe = true" @mouseleave="hoveringIframe = false">
        <div v-if="loopActive || fullStormLoading || !selectionReady" class="iframe-overlay">
          <span v-if="!selectionReady" class="overlay-message">Select a hypothesis and variable to unlock</span>
          <span v-else class="overlay-message"><i class="bi bi-hourglass-split me-1"></i>Simulation running…</span>
        </div>
        <div v-else-if="needsMaterial && !hoveringIframe" class="material-hint-overlay">
          <span class="material-hint-message">
            <i class="bi bi-cursor-fill me-1"></i>Select material by clicking here
          </span>
        </div>
        <iframe-loader
          :source="iframeSrc"
          iframeid="iframe-id"
          username="oele"
          projectname="meigs-cm-inquiry"
          :embed="true"
        ></iframe-loader>
      </div>

      <div class="sim-sliders" :class="{ 'sliders-frozen': loopActive || fullStormLoading || !selectionReady }">
        <div class="slider-row">
          <div class="slider-label-row">
            <label class="slider-label">Rainfall rate (inch/hour)</label>
            <span class="slider-value-badge">{{ rainfallRate }} inch/hr</span>
          </div>
          <div class="slider-track">
            <span class="slider-min">0.1</span>
            <input type="range" class="form-range" v-model.number="rainfallRate"
                   min="0.1" max="3.0" step="0.1" @change="onSliderChange" :disabled="loopActive || fullStormLoading || !selectionReady" />
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
                   min="1" max="12" step="1" @change="onSliderChange" :disabled="loopActive || fullStormLoading || !selectionReady" />
            <span class="slider-max">12</span>
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
                  type="button" role="tab">
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
                  type="button" role="tab" @click="onCompareClick">
            Compare
          </button>
        </li>
        <li class="nav-item ms-auto">
          <button class="goto-findings-btn"
                  :disabled="!inquiryExperimentHistory.length"
                  @click="goToFindings">
            Go to Findings <i class="bi bi-arrow-right-circle"></i>
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
                  <design-table :header="hourlyHeader" :contents="hourlyTableContent" :local-only="true"></design-table>
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
          <p v-if="!inquiryExperimentHistory.length" class="text-muted fst-italic">No test history yet.</p>

          <div v-for="q in unlockedQuestions" :key="q.key" class="th-accordion mb-3">
            <!-- Accordion header -->
            <div class="th-accordion-header" :class="{ expanded: openHistoryKey === q.key }"
                 @click="openHistoryKey = openHistoryKey === q.key ? null : q.key">
              <div class="th-accordion-title">
                <span class="th-hyp-label">{{ hypothesisClaims[q.key] || q.condition }}</span>
                <span class="th-test-count">{{ (testsByHypothesis[q.key] || []).length }} test(s)</span>
              </div>
              <i :class="['bi', openHistoryKey === q.key ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
            </div>

            <!-- Accordion body -->
            <div v-if="openHistoryKey === q.key" class="th-accordion-body">
              <p v-if="!(testsByHypothesis[q.key] || []).length" class="text-muted fst-italic small">
                No tests run for this hypothesis yet.
              </p>
              <template v-else>
                <design-table
                  :header="testHistoryHeader"
                  :contents="hypothesisTableContents[q.key] || {}"
                  :checked="hypothesisChecked[q.key] || []"
                  :local-only="true"
                  @check-change="(e) => onHypothesisTestCheck(q.key, e)"
                ></design-table>
                <p v-if="totalChecked >= 2" class="compare-hint">
                  2 tests selected — go to Compare to view side by side.
                </p>
              </template>
            </div>
          </div>
        </div>
        <div class="tab-pane" id="exp-compare" role="tabpanel">
          <div v-if="compareData && Object.keys(compareData).length === 2" class="compare-launch-area">
            <p class="text-muted fst-italic small mb-2">
              Tests {{ compareTests.map(t => t.testNumber).join(' & ') }} selected.
            </p>
            <button class="btn btn-primary" @click="openCompareModal">
              <i class="bi bi-arrows-fullscreen me-1"></i> View Full Comparison
            </button>
          </div>
          <p v-else-if="testHistoryChecked.filter(v => v).length < 2" class="text-muted fst-italic">
            Select exactly 2 tests from the Test history tab to compare.
          </p>
          <p v-else class="text-muted fst-italic">Loading compare data…</p>
        </div>
      </div>

    </div>
  </div>

  <!-- Compare Full-Screen Modal -->
  <teleport to="body">
    <div class="modal fade" id="compareModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog compare-modal-dialog">
        <div class="modal-content">
          <div class="modal-header compare-modal-header">
            <h5 class="modal-title">
              <i class="bi bi-bar-chart-line me-2"></i>
              Comparing Hypothesis {{ hypothesisNumber(compareTests[0]?.hypothesisKey) }} Test {{ compareTests[0]?.testNumber }} vs Hypothesis {{ hypothesisNumber(compareTests[1]?.hypothesisKey) }} Test {{ compareTests[1]?.testNumber }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeCompareModal"></button>
          </div>
          <div class="modal-body compare-modal-body">
            <div v-for="(test, idx) in compareTests" :key="test.testNumber" class="compare-block">
              <div class="compare-block-header">
                Hypothesis {{ hypothesisNumber(test.hypothesisKey) }} Test {{ test.testNumber }}
                <span class="compare-meta">
                  {{ test.time }} &nbsp;|&nbsp; {{ test.material }} &nbsp;|&nbsp;
                  Rate: {{ test.rainfallRate }} in/hr &nbsp;|&nbsp;
                  Duration: {{ test.rainfallDuration }} hrs
                </span>
              </div>
              <div class="compare-row">
                <div class="ct-card compare-card-half">
                  <div class="ct-card-header"><span class="ct-card-title">Hourly Data</span></div>
                  <div class="ct-card-body">
                    <div class="hourly-table-wrap">
                      <design-table
                        v-if="Object.keys(test.hourlyData).length"
                        :header="hourlyHeader"
                        :contents="test.hourlyData"
                        :local-only="true"
                      ></design-table>
                      <p v-else class="text-muted fst-italic small">No hourly data for this test.</p>
                    </div>
                  </div>
                </div>
                <div class="ct-card compare-card-half">
                  <div class="ct-card-header"><span class="ct-card-title">Runoff Chart</span></div>
                  <div class="ct-card-body">
                    <div :id="`compare-modal-chart-${idx}`" class="hourly-chart"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import IframeLoader from "./IframeLoader.vue";
import DesignTable from "./DesignTable.vue";
import Simulation from "../services/Simulation";
import Visualize from "../services/Visualize";
import Logger from "../services/Logger.js";

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
      hoveringIframe: false,
      loopActive: false,
      currentHour: 0,
      hoursLeft: 0,
      fineGrainData: [],
      hourlyHeader: ["Time (hours)", "Total Rainfall (in)", "Total Absorption (in)", "Total Runoff (in)"],
      hourlyTableContent: {},
      testHistoryHeader: ["Test No.", "Time", "Material", "Rainfall Rate", "Rainfall Duration", "Compare"],
      testHistoryChecked: [],
      hypothesisChecked: { rainfallRate: [], surfaceMaterial: [], rainfallDuration: [] },
      netsbloxTestCount: 0,
      openHistoryKey: null,
      tableExpanded: false,
      chartExpanded: false,
      hourlyLoading: false,
      fullStormLoading: false,
      runComplete: false,
      compareData: null,
      simMaterial: null,
      simAbsorption: null,
      simAbsorptionLimit: null,
      questions: [
        { id: 1, key: "rainfallRate",    condition: "If rainfall rate increases" },
        { id: 2, key: "surfaceMaterial", condition: "If we change the surface material" },
        { id: 3, key: "rainfallDuration",condition: "If rain continues for a long time" },
      ],
    };
  },
  computed: {
    hypothesesComplete() {
      return Object.values(this.hypotheses).every(
        (h) => h.effect.length > 0 && h.reason.length > 0
      );
    },
    selectionReady() {
      return !!this.selectedHypothesis && !!this.selectedVariable;
    },
    needsMaterial() {
      const m = this.simMaterial;
      return this.selectionReady && (!m || m.toLowerCase() === 'nothing');
    },
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
    compareTests() {
      if (!this.compareData) return [];
      return Object.values(this.compareData);
    },
    inquiryExperimentHistory() {
      return this.$store.getters.getInquiryTestHistory;
    },
    testHistoryContent() {
      const content = {};
      this.inquiryExperimentHistory.forEach((test, idx) => {
        content[idx] = {
          "Test No.": test.testNumber,
          "Time": test.time,
          "Material": test.material,
          "Rainfall Rate": test.rainfallRate,
          "Rainfall Duration": test.rainfallDuration,
        };
      });
      return content;
    },
    currentQuestion() {
      return this.$store.getters.getCurrentQuestion;
    },
    completedQuestions() {
      return this.$store.getters.getCompletedQuestions;
    },
    testsByHypothesis() {
      return this.$store.getters.getTestsByHypothesis;
    },
    unlockedQuestions() {
      return this.questions.filter((q) => this.completedQuestions.includes(q.id) || q.id === this.currentQuestion);
    },
    totalChecked() {
      return Object.values(this.hypothesisChecked).flat().filter((v) => v).length;
    },
    hypothesisTableContents() {
      const result = {};
      this.questions.forEach((q) => {
        const tests = this.testsByHypothesis[q.key] || [];
        const content = {};
        tests.forEach((test, idx) => {
          content[idx] = {
            "Test No.": test.testNumber,
            "Time": test.time,
            "Material": test.material,
            "Rainfall Rate": test.rainfallRate,
            "Rainfall Duration": test.rainfallDuration,
          };
        });
        result[q.key] = content;
      });
      return result;
    },
    hypothesisClaims() {
      const claims = {};
      this.questions.forEach((q) => {
        if (!this.completedQuestions.includes(q.id) && q.id !== this.currentQuestion) return;
        const h = this.hypotheses[q.id];
        if (!h.effect.length || !h.reason.length) return;
        const effects = h.effect.join(" or ").toLowerCase();
        claims[q.key] = `${q.condition}, runoff will ${effects}`;
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
    testsByHypothesis: {
      deep: true,
      handler(newVal) {
        const updated = { ...this.hypothesisChecked };
        this.questions.forEach((q) => {
          const count = (newVal[q.key] || []).length;
          const existing = updated[q.key] || [];
          if (existing.length !== count) {
            updated[q.key] = Array(count).fill(false);
          }
        });
        this.hypothesisChecked = updated;
      },
    },
  },
  methods: {
    goToFindings() {
      document.getElementById("findings-tab")?.click();
    },
    interpolateRows(rows, timeKey, rainfallKey, absorptionKey, runoffKey) {
      const points = [{ t: 0, r: 0, a: 0, ru: 0 }];
      rows.forEach((row) => {
        points.push({
          t: Number(row[timeKey]),
          r: Number(row[rainfallKey]),
          a: Number(row[absorptionKey]),
          ru: Number(row[runoffKey]),
        });
      });
      const interpolated = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const steps = Math.round((p1.t - p0.t) / 0.1);
        for (let s = 0; s < steps; s++) {
          const frac = s / steps;
          interpolated.push([
            Math.round((p0.t + frac * (p1.t - p0.t)) * 10) / 10,
            p0.r + frac * (p1.r - p0.r),
            p0.a + frac * (p1.a - p0.a),
            p0.ru + frac * (p1.ru - p0.ru),
          ]);
        }
      }
      // push the final point
      const last = points[points.length - 1];
      interpolated.push([last.t, last.r, last.a, last.ru]);
      return interpolated;
    },
    drawHourlyChart() {
      const el = document.getElementById("inquiry-hourly-chart");
      if (!el || !window.google || !window.google.visualization) return;
      if (!this.fineGrainData.length) return;

      const data = new window.google.visualization.DataTable();
      data.addColumn("number", "Time (hours)");
      data.addColumn("number", "Rainfall (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Absorption (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Runoff (in)");
      data.addColumn({ type: "string", role: "tooltip" });

      this.fineGrainData.forEach(([t, r, a, ru]) => data.addRow([
        t,
        r,  `Time (hours): ${t} | Rainfall (in): ${r}`,
        a,  `Time (hours): ${t} | Absorption (in): ${a}`,
        ru, `Time (hours): ${t} | Runoff (in): ${ru}`,
      ]));

      const maxTime = this.fineGrainData[this.fineGrainData.length - 1][0];
      const hTicks = Array.from({ length: Math.round(maxTime) + 1 }, (_, i) => i);
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0, ticks: hTicks },
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
      new window.google.visualization.LineChart(el).draw(data, options);
    },
    toggleTableExpand() {
      this.tableExpanded = !this.tableExpanded;
      if (this.tableExpanded) this.chartExpanded = false;
      setTimeout(() => this.drawHourlyChart(), 250);
    },
    toggleChartExpand() {
      this.chartExpanded = !this.chartExpanded;
      if (this.chartExpanded) this.tableExpanded = false;
      setTimeout(() => this.drawHourlyChart(), 250);
    },
    generateHourlyData(maxHours) {
      const dt = 0.1;
      const rate = Number(this.rainfallRate);
      const absRate = this.simAbsorptionLimit !== null ? Number(this.simAbsorptionLimit) : 0;
      const absLimit = this.simAbsorption !== null ? Number(this.simAbsorption) : Infinity;
      // effective absorption rate per tick is bounded by material rate and rainfall rate
      const effectiveRate = Math.min(rate, absRate);

      let totalRainfall = 0;
      let totalAbsorption = 0;
      let totalRunoff = 0;

      const fineGrain = [[0, 0, 0, 0]];
      const steps = Math.round(maxHours / dt);

      for (let i = 1; i <= steps; i++) {
        const t = Math.round(i * dt * 10) / 10;

        totalRainfall += rate * dt;

        // absorb only what the material can still hold; once full, remainingCapacity = 0
        const remainingCapacity = Math.max(0, absLimit - totalAbsorption);
        const absorbed = Math.min(effectiveRate * dt, remainingCapacity);
        totalAbsorption += absorbed;
        totalRunoff += (rate * dt) - absorbed;

        fineGrain.push([
          t,
          Math.round(totalRainfall   * 10000) / 10000,
          Math.round(totalAbsorption * 10000) / 10000,
          Math.round(totalRunoff     * 10000) / 10000,
        ]);
      }

      this.fineGrainData = fineGrain;
    },
    async loadHourlyData(expectedRows) {
      this.hourlyLoading = true;
      await new Promise((r) => setTimeout(r, 1500));
      const maxAttempts = 20;
      const interval = 500;
      for (let i = 0; i < maxAttempts; i++) {
        const data = await Visualize.getInquiryHourlyData();
        if (data) {
          const rowCount = Object.keys(data).length;
          if (expectedRows === undefined || rowCount >= expectedRows) {
            this.hourlyTableContent = data;
            break;
          }
        }
        await new Promise((r) => setTimeout(r, interval));
      }
      this.hourlyLoading = false;
    },
    loadTestHistory() {
      this.testHistoryChecked = Array(this.inquiryExperimentHistory.length).fill(false);
      // Reset per-hypothesis checked arrays to match current test counts
      this.questions.forEach((q) => {
        const tests = this.testsByHypothesis[q.key] || [];
        this.hypothesisChecked[q.key] = Array(tests.length).fill(false);
      });
    },
    onHypothesisTestCheck(hypothesisKey, { index, status, event }) {
      const allChecked = Object.values(this.hypothesisChecked).flat().filter((v) => v);
      if (status && allChecked.length >= 2) {
        event.target.checked = false;
        return;
      }
      const updated = [...(this.hypothesisChecked[hypothesisKey] || [])];
      updated[index] = status;
      this.hypothesisChecked = { ...this.hypothesisChecked, [hypothesisKey]: updated };
    },
    async runFullStorm() {
      this.fullStormLoading = true;
      Simulation.runProject({ "hourly rainfall": this.rainfallRate, "rainfall duration": this.rainfallDuration, "full storm": true });
      this.generateHourlyData(this.rainfallDuration);
      await this.loadHourlyData(this.rainfallDuration);
      this.fullStormLoading = false;
      this.showRunComplete();
      await this.captureAndStoreTest(this.hourlyTableContent);
    },
    async runOneHour() {
      if (!this.loopActive) {
        this.loopActive = true;
        this.currentHour = 1;
        this.hoursLeft = this.rainfallDuration - 1;
      } else {
        this.currentHour += 1;
        this.hoursLeft -= 1;
      }
      const isLastHour = this.hoursLeft === 0;
      Simulation.runProject({ "hourly rainfall": this.rainfallRate, "rainfall duration": this.currentHour, "full storm": isLastHour });
      this.generateHourlyData(this.currentHour);
      await this.loadHourlyData(this.currentHour);
      if (isLastHour) {
        this.loopActive = false;
        this.currentHour = 0;
        await this.captureAndStoreTest(this.hourlyTableContent);
        this.showRunComplete();
      }
    },
    onTestHistoryCheck({ index, status, event }) {
      const checkedCount = this.testHistoryChecked.filter((v) => v).length;
      if (status && checkedCount >= 2) {
        event.target.checked = false;
        return;
      }
      const updated = [...this.testHistoryChecked];
      updated[index] = status;
      this.testHistoryChecked = updated;
    },
    onCompareClick() {
      if (this.totalChecked < 2) {
        alert("Please select exactly 2 tests from the Test history tab to compare.");
        return;
      }
      this.loadCompareData();
      this.openCompareModal();
    },
    openCompareModal() {
      const { Modal } = require("bootstrap");
      const el = document.getElementById("compareModal");
      if (!this._compareModal) {
        this._compareModal = new Modal(el, { backdrop: true });
        el.addEventListener("shown.bs.modal", () => {
          this.compareTests.forEach((_, idx) => this.drawCompareChart(idx, "compare-modal-chart"));
        });
        el.addEventListener("hidden.bs.modal", () => {
          document.getElementById("test-history-tab")?.click();
        });
      }
      this._compareModal.show();
    },
    closeCompareModal() {
      if (this._compareModal) this._compareModal.hide();
    },
    loadCompareData() {
      const selected = [];
      this.questions.forEach((q) => {
        const tests = this.testsByHypothesis[q.key] || [];
        const checked = this.hypothesisChecked[q.key] || [];
        checked.forEach((v, i) => {
          if (v && tests[i]) selected.push(tests[i]);
        });
      });
      if (selected.length !== 2) return;
      const result = {};
      selected.forEach((record, idx) => {
        result[idx] = record;
      });
      this.compareData = result;
      this.$nextTick(() => {
        this.compareTests.forEach((_, idx) => this.drawCompareChart(idx, "compare-modal-chart"));
      });
    },
    drawCompareChart(idx, prefix = "compare-chart") {
      const el = document.getElementById(`${prefix}-${idx}`);
      if (!el || !window.google || !window.google.visualization) return;
      const test = this.compareTests[idx];
      if (!test) return;

      const data = new window.google.visualization.DataTable();
      data.addColumn("number", "Time (hours)");
      data.addColumn("number", "Rainfall (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Absorption (in)");
      data.addColumn({ type: "string", role: "tooltip" });
      data.addColumn("number", "Runoff (in)");
      data.addColumn({ type: "string", role: "tooltip" });

      let maxTime = 1;

      if (test.fineGrainData && test.fineGrainData.length) {
        test.fineGrainData.forEach(([t, r, a, ru]) => data.addRow([
          t,
          r,  `Time (hours): ${t} | Rainfall (in): ${r}`,
          a,  `Time (hours): ${t} | Absorption (in): ${a}`,
          ru, `Time (hours): ${t} | Runoff (in): ${ru}`,
        ]));
        maxTime = test.fineGrainData[test.fineGrainData.length - 1][0];
      } else if (test.hourlyData && Object.keys(test.hourlyData).length) {
        const rows = Object.values(test.hourlyData);
        const keys = Object.keys(rows[0]);
        const [timeKey, rainfallKey, absorptionKey, runoffKey] = keys;
        this.interpolateRows(rows, timeKey, rainfallKey, absorptionKey, runoffKey)
          .forEach(([t, r, a, ru]) => data.addRow([
            t,
            r,  `Time (hours): ${t} | Rainfall (in): ${r}`,
            a,  `Time (hours): ${t} | Absorption (in): ${a}`,
            ru, `Time (hours): ${t} | Runoff (in): ${ru}`,
          ]));
        maxTime = Math.max(...rows.map((r) => Number(r[timeKey])));
      } else {
        return;
      }

      const hTicks = Array.from({ length: Math.round(maxTime) + 1 }, (_, i) => i);
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0, ticks: hTicks },
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
      new window.google.visualization.LineChart(el).draw(data, options);
    },
    async captureAndStoreTest(hourlyData = {}) {
      const result = await Visualize.getInquiryLastTestRecord(this.netsbloxTestCount);
      if (!result) return;
      this.netsbloxTestCount += 1;
      const record = { ...result, hourlyData, fineGrainData: [...this.fineGrainData], hypothesisKey: this.selectedHypothesis };
      this.$store.dispatch("addInquiryTestRecord", record);
      this.$nextTick(() => {
        this.testHistoryChecked = Array(this.inquiryExperimentHistory.length).fill(false);
      });
      Logger.logUserActions({
        actionType: "inquiryExperiments",
        actionView: "InquiryExperiments",
        args: {
          hypothesis: this.hypothesisClaims[this.selectedHypothesis] || this.selectedHypothesis,
          variable: this.selectedVariable,
          rainfallRate: this.rainfallRate,
          rainfallDuration: this.rainfallDuration,
          material: this.simMaterial,
        },
      });
    },
    hypothesisNumber(hypothesisKey) {
      const q = this.questions.find((q) => q.key === hypothesisKey);
      return q ? q.id : "?";
    },
    goToHypotheses() {
      document.getElementById("hypotheses-tab")?.click();
    },
    showRunComplete() {
      this.runComplete = true;
      setTimeout(() => { this.runComplete = false; }, 2500);
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

    const iframe = document.getElementById("iframe-id");
    if (iframe) {
      this._nbApi = new window.EmbeddedNetsBloxAPI(iframe);
      iframe.onload = () => {
        // Load initial values when project is opened
        this._nbApi.addEventListener("action", async (e) => {
          if (e.detail.type === "openProject") {
            try {
              const gb = await this._nbApi.getGlobalVariables();
              const vars = gb.vars;
              const keys = Object.keys(vars);
              const materialKey = keys.find((k) => k.includes("current material"));
              const absorptionKey = keys.find((k) => k.includes("absorption limit"));
              const limitKey = keys.find((k) => k.includes("hourly absorption limit"));
              if (materialKey) this.simMaterial = vars[materialKey].value || null;
              if (absorptionKey) this.simAbsorption = vars[absorptionKey].value ?? 0;
              if (limitKey) this.simAbsorptionLimit = vars[limitKey].value ?? 0;
            } catch (e) {
              console.warn("[simInfo] could not load initial values", e);
            }
          }
        });

        // Listen for live global variable updates
        this._nbApi.addEventListener("globalVariableChanged", (e) => {
          const { variable, value } = e.detail;
          console.log(e.detail);
          if (variable === "current material") this.simMaterial = value || null;
          // else if (variable === "absorption limit") this.simAbsorption = value;
          // else if (variable === "hourly absorption limit") this.simAbsorptionLimit = value;
        });

        this._nbApi.addEventListener("rpcCalled", (e) => {
          console.log("[rpcCalled]", e.detail);
          const value = e.detail?.params?.value;
          if (Array.isArray(value) && value[0] === "MaterialUpdated") {
            const pairs = value[1] || [];
            pairs.forEach(([key, val]) => {
              if (key === "absorption limit") this.simAbsorption = val;
              else if (key === "hourly absorption limit") this.simAbsorptionLimit = val;
            });
          }
        });

      };
    }
  },
  beforeUnmount() {
    this._nbApi = null;
  },
};
</script>

<style scoped>
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

.run-complete-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  white-space: nowrap;
}

.run-complete-fade-enter-active,
.run-complete-fade-leave-active {
  transition: opacity 0.4s ease;
}
.run-complete-fade-enter-from,
.run-complete-fade-leave-to {
  opacity: 0;
}

.sim-info-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid #c8b89a;
  border-radius: 8px;
  background-color: #fdf6e3;
}

.sim-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.sim-info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.sim-info-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0d6efd;
  background: #e7f0ff;
  border: 1px solid #b6d0ff;
  border-radius: 4px;
  padding: 1px 8px;
  min-width: 60px;
  text-align: center;
}

.sim-iframe-area {
  width: 400px;
  height: 355px;
  min-width: 400px;
  min-height: 355px;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
  display: block;
  position: relative;
}

.sim-iframe-area :deep(iframe) {
  position: absolute;
  top: 0;
  left: 0;
  width: 480px !important;
  height: 432px !important;
  transform: scale(0.83);
  transform-origin: top left;
  border: none;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-message {
  background: rgba(255, 255, 255, 0.93);
  border: 1px solid #b6d0ff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0d6efd;
  text-align: center;
  max-width: 80%;
  pointer-events: none;
}

.material-hint-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-hint-message {
  background: rgba(255, 248, 220, 0.96);
  border: 1px solid #f0c040;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #7a5200;
  text-align: center;
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

.goto-findings-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #615195;
  color: #fff;
  transition: background-color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.goto-findings-btn:hover:not(:disabled) {
  background-color: #4e4077;
}

.goto-findings-btn:disabled {
  background-color: #c8c8d4;
  color: #888;
  cursor: not-allowed;
  opacity: 0.7;
}

.compare-modal-dialog {
  max-width: 92vw;
  width: 92vw;
  margin: 2.5vh auto;
}

.compare-modal-dialog .modal-content {
  display: flex;
  flex-direction: column;
  max-height: 95vh;
}

.compare-modal-header {
  background: #0d6efd;
  color: #fff;
  flex-shrink: 0;
}

.compare-modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
}

.compare-block {
  flex: 0 0 auto;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px;
  background: #fff;
}

.compare-block-header {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0d6efd;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.compare-meta {
  font-size: 0.78rem;
  font-weight: 400;
  color: #495057;
}

.compare-row {
  flex: 1;
  min-height: 260px;
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.compare-card-half {
  flex: 1 1 50%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.compare-card-half .ct-card {
  flex: 1;
  height: auto;
}

.compare-hint {
  font-size: 0.8rem;
  color: #198754;
  font-style: italic;
  margin-top: 4px;
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
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.hourly-table-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
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
}

/* Test history accordion */
.th-accordion {
  border: 2px solid #c8b89a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.07);
}

.th-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #fdf6e3;
  cursor: pointer;
  user-select: none;
  gap: 12px;
  transition: background-color 0.15s ease;
}

.th-accordion-header:hover {
  background-color: #f5ecd0;
}

.th-accordion-header.expanded {
  background-color: #e8dfc8;
  border-bottom: 2px solid #c8b89a;
}

.th-accordion-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.th-hyp-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c2c2c;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.th-test-count {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0d6efd;
  background: #e7f0ff;
  border: 1px solid #b6d0ff;
  border-radius: 12px;
  padding: 1px 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.th-accordion-body {
  padding: 12px;
  background: #fffdf7;
  overflow-x: auto;
}
</style>
