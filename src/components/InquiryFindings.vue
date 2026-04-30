<template>
  <div>

    <!-- No hypotheses guard -->
    <div v-if="!hypothesesComplete" class="no-hypothesis-prompt">
      <i class="bi bi-exclamation-triangle-fill no-hypothesis-icon"></i>
      <div>
        <p class="no-hypothesis-title">No hypotheses found</p>
        <p class="no-hypothesis-body">
          Please go to the  <strong> My Hypotheses </strong> tab and complete all three hypotheses before recording findings.
        </p>
        <button class="btn btn-primary btn-sm" @click="goToHypotheses">Go to My Hypotheses</button>
      </div>
    </div>

    <div v-else class="findings-wrapper">

      <!-- Left column: instruction + textarea + save -->
      <div class="findings-left">
        <p class="findings-instruction">
          Explain your observations below using the evidence from the data tables and the graph:
        </p>
        <textarea
          class="findings-textarea"
          v-model="findingText"
          placeholder="Write your findings here using sentence starters like:
- The data shows that …
- I observed that …
- In my experiment, …
- The numbers in my data show …
- The graph shows that …"
        ></textarea>
        <button class="btn btn-success mt-3 w-100" @click="saveFindings">Save My Findings</button>
      </div>

      <!-- Right column: controls + stacked test cards -->
      <div class="findings-right">

        <!-- No iframe warning -->
        <div v-if="iframeMissing" class="no-hypothesis-prompt">
          <i class="bi bi-exclamation-triangle-fill no-hypothesis-icon"></i>
          <div>
            <p class="no-hypothesis-title">No experiment data available</p>
            <p class="no-hypothesis-body">
              Please visit the <strong>My Experiments</strong> tab and run at least one simulation before recording findings.
            </p>
            <button class="btn btn-primary btn-sm" @click="goToExperiments">Go to My Experiments</button>
          </div>
        </div>

        <template v-else>

        <!-- Hypothesis dropdown -->
        <div class="control-row">
          <label class="control-label fw-bold">Hypothesis:</label>
          <select v-model="selectedHypothesis" class="form-select form-select-sm">
            <option value="" disabled>Select a hypothesis</option>
            <option v-for="(claim, key) in hypothesisClaims" :key="key" :value="key">
              {{ claim }}
            </option>
          </select>
        </div>

        <!-- Test selector -->
        <div class="control-row mt-2">
          <label class="control-label fw-bold">Select your tests:</label>
          <select class="form-select form-select-sm" @change="onTestSelect" :value="''">
            <option value="" disabled>Select a test</option>
            <option
              v-for="(row, key) in testHistoryContent"
              :key="key"
              :value="key"
              :disabled="selectedTestKeys.length >= 2 && !selectedTestKeys.includes(String(key))"
            >
              Test {{ Object.values(row)[0] }} — {{ row['Material'] }} | Rate: {{ row['Rainfall Rate'] }} | Duration: {{ row['Rainfall Duration'] }}
            </option>
          </select>
        </div>

        <!-- Selected test chips -->
        <div v-if="selectedTestKeys.length" class="test-chips mt-1">
          <span v-for="key in selectedTestKeys" :key="key" class="test-chip">
            Test {{ Object.values(testHistoryContent[key])[0] }}
            <button class="chip-remove" @click="removeTest(key)">&times;</button>
          </span>
        </div>

        <!-- Stacked test cards -->
        <div class="findings-cards">
          <p v-if="!selectedTestKeys.length" class="text-muted fst-italic small mt-2">
            Select up to 2 tests above to display their data here.
          </p>

          <div v-for="key in selectedTestKeys" :key="key" class="findings-test-card">
            <div class="findings-card-header">
              Test {{ Object.values(testHistoryContent[key])[0] }}
              <span class="findings-card-meta">
                {{ testHistoryContent[key]['Material'] }} &nbsp;|&nbsp;
                Rate: {{ testHistoryContent[key]['Rainfall Rate'] }} in/hr &nbsp;|&nbsp;
                Duration: {{ testHistoryContent[key]['Rainfall Duration'] }} hrs
              </span>
            </div>
            <div class="findings-card-body">
              <div class="findings-card-half">
                <design-table
                  v-if="compareData[key] && Object.keys(compareData[key].hourlyData).length"
                  :header="hourlyHeader"
                  :contents="compareData[key].hourlyData"
                  :local-only="true"
                ></design-table>
                <p v-else class="text-muted fst-italic small">Loading data…</p>
              </div>
              <div class="findings-card-half">
                <div :id="`findings-chart-${key}`" class="findings-chart"></div>
              </div>
            </div>
          </div>
        </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DesignTable from "./DesignTable.vue";

export default {
  name: "InquiryFindings",
  components: { DesignTable },
  data() {
    return {
      selectedHypothesis: "",
      selectedTestKeys: [],
      findingText: "",
      hourlyHeader: ["Time (hours)", "Total Rainfall (in)", "Total Absorption (in)", "Total Runoff (in)"],
      questions: [
        { id: 1, key: "rainfallRate",     condition: "If rainfall rate increases" },
        { id: 2, key: "surfaceMaterial",  condition: "If we change the surface material" },
        { id: 3, key: "rainfallDuration", condition: "If rain continues for a long time" },
      ],
    };
  },
  computed: {
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
    hypothesesComplete() {
      return Object.values(this.hypotheses).every(
        (h) => h.effect.length > 0 && h.reason.length > 0
      );
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
    inquiryTestHistory() {
      return this.$store.getters.getInquiryTestHistory;
    },
    testHistoryContent() {
      const content = {};
      this.inquiryTestHistory.forEach((test, idx) => {
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
    compareData() {
      const data = {};
      this.selectedTestKeys.forEach((key) => {
        const record = this.inquiryTestHistory[Number(key)];
        if (record) data[key] = record;
      });
      return data;
    },
    iframeMissing() {
      return this.inquiryTestHistory.length === 0;
    },
  },
  watch: {
    selectedTestKeys(newKeys) {
      this.$nextTick(() => {
        window.google.charts.setOnLoadCallback(() => {
          newKeys.forEach((key) => this.drawChart(key));
        });
      });
    },
  },
  methods: {
    goToHypotheses() {
      document.getElementById("hypotheses-tab")?.click();
    },
    goToExperiments() {
      document.getElementById("experiments-tab")?.click();
    },
    onTestSelect(e) {
      const key = String(e.target.value);
      if (!key || this.selectedTestKeys.includes(key)) return;
      if (this.selectedTestKeys.length >= 2) return;
      this.selectedTestKeys = [...this.selectedTestKeys, key];
      e.target.value = "";
    },
    removeTest(key) {
      this.selectedTestKeys = this.selectedTestKeys.filter((k) => k !== key);
    },
    drawChart(key) {
      const el = document.getElementById(`findings-chart-${key}`);
      if (!el || !window.google || !window.google.visualization) return;
      const test = this.compareData[key];
      if (!test || !Object.keys(test.hourlyData).length) return;
      const rows = Object.values(test.hourlyData);
      const keys = Object.keys(rows[0]);
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
      const w = el.offsetWidth || 400;
      const h = el.offsetHeight || 260;
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0, titleTextStyle: { italic: false } },
        vAxis: { title: "Amount (in)", minValue: 0, titleTextStyle: { italic: false } },
        series: {
          0: { color: "#0d6efd" },
          1: { color: "#198754" },
          2: { color: "#dc3545" },
        },
        legend: { position: "top", alignment: "center" },
        chartArea: { left: 60, top: 50, width: w - 80, height: h - 100 },
        width: w,
        height: h,
      };
      new window.google.visualization.LineChart(el).draw(data, options);
    },
    saveFindings() {
      if (!this.selectedHypothesis) {
        alert("Please select a hypothesis before saving.");
        return;
      }
      const selectedTests = {};
      this.selectedTestKeys.forEach((key) => {
        selectedTests[key] = this.testHistoryContent[key];
      });
      const snapshot = {
        [this.selectedHypothesis]: {
          hypothesis: this.hypothesisClaims[this.selectedHypothesis] || "",
          tests: selectedTests,
          finding: this.findingText,
        },
      };
      this.$store.dispatch("saveFindings", snapshot);
      alert("Findings saved!");
    },
  },
  mounted() {
    window.google.charts.load("current", { packages: ["corechart"] });
  },
};
</script>

<style scoped>
p {
  justify-content: flex-start;
}

.no-hypothesis-prompt {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 20px;
  margin-top: 12px;
}

.no-hypothesis-icon {
  font-size: 2rem;
  color: #f59e0b;
  flex-shrink: 0;
}

.no-hypothesis-title {
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 4px;
}

.no-hypothesis-body {
  font-size: 0.88rem;
  color: #78350f;
  margin-bottom: 10px;
}

.findings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 16px;
  height: 100%;
  min-height: 0;
  align-items: stretch;
}

/* Left column: fixed width, full height, textarea + save */
.findings-left {
  width: 220px;
  min-width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  overflow: hidden;
}

.findings-instruction {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.findings-textarea {
  flex: 1;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  font-family: inherit;
  resize: none;
  color: #333;
  box-sizing: border-box;
  min-height: 0;
  overflow-y: auto;
}

.findings-textarea:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

/* Right column: controls + stacked test cards */
.findings-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow-y: auto;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.control-label {
  white-space: nowrap;
  font-size: 0.9rem;
  min-width: 120px;
}

.test-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.test-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #e7f0ff;
  border: 1px solid #b6d0ff;
  border-radius: 20px;
  padding: 2px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #0d6efd;
}

.chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #0d6efd;
  line-height: 1;
  padding: 0;
}

.chip-remove:hover {
  color: #dc3545;
}

.findings-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.findings-test-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  flex-shrink: 0;
}

.findings-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: #f0f4ff;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0d6efd;
}

.findings-card-meta {
  font-size: 0.78rem;
  font-weight: 400;
  color: #495057;
}

.findings-card-body {
  display: flex;
  gap: 8px;
  padding: 8px;
  height: 200px;
}

.findings-card-half {
  flex: 1 1 50%;
  min-width: 0;
  overflow: hidden;
}

.findings-card-half :deep(table) {
  font-size: 0.68rem;
}

.findings-card-half :deep(th),
.findings-card-half :deep(td) {
  padding: 0.15rem 0.3rem !important;
  white-space: nowrap;
}

.findings-chart {
  width: 100%;
  height: 100%;
}
</style>
