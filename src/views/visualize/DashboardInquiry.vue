<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Extract inquiry data by username:</h5>
          <div class="filterCard">
            <label for="usernameId" class="form-label">Enter a username: </label>
            <input
              v-model="usernameInput"
              class="form-control"
              id="usernameId"
              placeholder="Username…"
              @keyup.enter="fetchInquiry"
            />
            <button
              type="button"
              class="btn btn-primary btn-md me-3"
              @click="fetchInquiry"
              :disabled="loading"
            >
              {{ loading ? 'Loading…' : 'Search' }}
            </button>
          </div>
          <p v-if="notFound" class="not-found mt-2">No inquiry data found for "{{ searchedUsername }}".</p>
          <p v-if="error" class="error-msg mt-2">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="inquiryData" class="row results-wrapper">
      <h5 class="results-title">Inquiry data for <strong>{{ searchedUsername }}</strong></h5>

      <ul class="nav nav-pills inquiry-tabs gap-2 mb-3">
        <li class="nav-item" v-for="tab in tabs" :key="tab.key">
          <button
            class="nav-link"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>

      <!-- Hypotheses -->
      <div v-if="activeTab === 'hypotheses'" class="tab-panel">
        <div v-for="q in questions" :key="q.id" class="snapshot-card">
          <div class="snapshot-card-header">Question {{ q.id }}: {{ q.question }}</div>
          <div class="snapshot-card-body">
            <div class="snapshot-row">
              <span class="snapshot-label">Effect</span>
              <span class="snapshot-value">
                {{ hypothesisEffect(q.id) || '—' }}
              </span>
            </div>
            <div class="snapshot-row">
              <span class="snapshot-label">Reason</span>
              <span class="snapshot-value">
                {{ hypothesisReason(q.id) || '—' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Experiments -->
      <div v-if="activeTab === 'experiments'" class="tab-panel">
        <div v-if="inquiryData.inquiryExperiments">
          <div class="snapshot-card">
            <div class="snapshot-card-header">Latest Experiment</div>
            <div class="snapshot-card-body">
              <div class="snapshot-row"><span class="snapshot-label">Hypothesis</span><span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.hypothesis || '—' }}</span></div>
              <div class="snapshot-row"><span class="snapshot-label">Variable</span><span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.variable || '—' }}</span></div>
              <div class="snapshot-row"><span class="snapshot-label">Rainfall Rate</span><span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.rainfallRate }} in/hr</span></div>
              <div class="snapshot-row"><span class="snapshot-label">Rainfall Duration</span><span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.rainfallDuration }} hrs</span></div>
              <div class="snapshot-row"><span class="snapshot-label">Material</span><span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.currentMaterial || '—' }}</span></div>
              <div v-if="inquiryData.inquiryExperiments.args.test" class="snapshot-row">
                <span class="snapshot-label">Test No.</span>
                <span class="snapshot-value">{{ inquiryData.inquiryExperiments.args.test.testNumber }}</span>
              </div>
              <div v-if="inquiryData.inquiryExperiments.args.test && Object.keys(inquiryData.inquiryExperiments.args.test.hourlyData || {}).length" class="hourly-section">
                <div class="snapshot-label mb-1">Hourly Data</div>
                <table class="hourly-table">
                  <thead>
                    <tr>
                      <th v-for="col in hourlyColumns(inquiryData.inquiryExperiments.args.test)" :key="col">{{ col }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in inquiryData.inquiryExperiments.args.test.hourlyData" :key="idx">
                      <td v-for="col in hourlyColumns(inquiryData.inquiryExperiments.args.test)" :key="col">{{ row[col] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-msg">No experiment tests recorded.</p>
      </div>

      <!-- Findings -->
      <div v-if="activeTab === 'findings'" class="tab-panel">
        <div v-if="hasAnyFinding" class="snapshot-card">
          <div class="snapshot-card-header">Latest Finding</div>
          <div class="snapshot-card-body">
            <div class="snapshot-row">
              <span class="snapshot-label">Hypothesis</span>
              <span class="snapshot-value">{{ inquiryData.inquiryFindings.args.hypothesis || '—' }}</span>
            </div>
            <div class="snapshot-row">
              <span class="snapshot-label">Finding</span>
              <span class="snapshot-value">{{ inquiryData.inquiryFindings.args.finding || '—' }}</span>
            </div>
            <div v-if="inquiryData.inquiryFindings.args.tests && inquiryData.inquiryFindings.args.tests.length">
              <div class="snapshot-label mb-1">Tests used</div>
              <div v-for="test in inquiryData.inquiryFindings.args.tests" :key="test.testNo" class="snapshot-card mt-2">
                <div class="snapshot-card-header">Test {{ test.testNo }}</div>
                <div class="snapshot-card-body">
                  <div class="snapshot-row"><span class="snapshot-label">Material</span><span class="snapshot-value">{{ test.material }}</span></div>
                  <div class="snapshot-row"><span class="snapshot-label">Rainfall Rate</span><span class="snapshot-value">{{ test.rainfallRate }} in/hr</span></div>
                  <div class="snapshot-row"><span class="snapshot-label">Rainfall Duration</span><span class="snapshot-value">{{ test.rainfallDuration }} hrs</span></div>
                  <div v-if="test.hourlyData && test.hourlyData.length" class="hourly-section">
                    <div class="snapshot-label mb-1">Hourly Data</div>
                    <table class="hourly-table">
                      <thead>
                        <tr>
                          <th>Hour</th>
                          <th>Total Rainfall (in)</th>
                          <th>Total Absorption (in)</th>
                          <th>Total Runoff (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in test.hourlyData" :key="row.hour">
                          <td>{{ row.hour }}</td>
                          <td>{{ row.totalRainfall }}</td>
                          <td>{{ row.totalAbsorption }}</td>
                          <td>{{ row.totalRunoff }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="empty-msg">No findings recorded.</p>
      </div>

      <!-- Conclusions -->
      <div v-if="activeTab === 'conclusions'" class="tab-panel">
        <div v-if="hasAnyConclusion">
          <div v-for="q in questions" :key="q.id" class="snapshot-card">
            <div class="snapshot-card-header">{{ q.question }}</div>
            <div class="snapshot-card-body">
              <template v-if="conclusionFor(q.id)">
                <div class="snapshot-row">
                  <span class="snapshot-label">Claim</span>
                  <span class="snapshot-value">{{ conclusionFor(q.id).claim || '—' }}</span>
                </div>
                <div class="snapshot-row">
                  <span class="snapshot-label">Evidence</span>
                  <span class="snapshot-value">{{ conclusionFor(q.id).evidence || '—' }}</span>
                </div>
                <div class="snapshot-row">
                  <span class="snapshot-label">Reasoning</span>
                  <span class="snapshot-value">{{ conclusionFor(q.id).reasoning || '—' }}</span>
                </div>
              </template>
              <span v-else class="empty-inline">No conclusion saved.</span>
            </div>
          </div>
        </div>
        <p v-else class="empty-msg">No conclusions recorded.</p>
      </div>

    </div>
  </div>
</template>


<script>
import axiosInstance from "../../services/Axios.js";

export default {
  name: "DashboardInquiry",
  data() {
    return {
      usernameInput: "",
      searchedUsername: "",
      inquiryData: null,
      notFound: false,
      loading: false,
      error: "",
      activeTab: "hypotheses",
      tabs: [
        { key: "hypotheses",  label: "My Hypotheses" },
        { key: "experiments", label: "My Experiments" },
        { key: "findings",    label: "My Findings" },
        { key: "conclusions", label: "My Conclusions" },
      ],
      questions: [
        { id: 1, variableKey: "rainfallRate",    question: "How does rainfall rate affect runoff?" },
        { id: 2, variableKey: "surfaceMaterial", question: "How does surface material affect runoff?" },
        { id: 3, variableKey: "rainfallDuration",question: "How does rainfall duration affect runoff?" },
      ],
    };
  },
  computed: {
    hasAnyFinding() {
      return !!this.inquiryData?.inquiryFindings?.args;
    },
    hasAnyConclusion() {
      return !!this.inquiryData?.inquiryConclusions?.args;
    },
  },
  methods: {
    async fetchInquiry() {
      const username = this.usernameInput.trim();
      if (!username) return;
      this.loading = true;
      this.notFound = false;
      this.error = "";
      this.inquiryData = null;
      this.searchedUsername = username;
      try {
        const response = await axiosInstance.get(`action/getInquiryActions/${username}`);
        this.inquiryData = response.data;
        this.activeTab = "hypotheses";
      } catch (e) {
        if (e.response?.status === 404) {
          this.notFound = true;
        } else {
          this.error = "Failed to retrieve data. Please check the username and try again.";
        }
      }
      this.loading = false;
    },
    hypothesisEffect(id) {
      const h = this.inquiryData.inquiryHypotheses?.args?.[String(id)];
      return h?.effect?.length ? h.effect.join(", ") : "";
    },
    hypothesisReason(id) {
      const h = this.inquiryData.inquiryHypotheses?.args?.[String(id)];
      return h?.reason?.length ? h.reason.join(", ") : "";
    },
    findingFor(key) {
      const findings = this.inquiryData.inquiryFindings?.args;
      if (!findings) return null;
      return findings.hypothesis === key ? findings : null;
    },
    conclusionFor(id) {
      return this.inquiryData.inquiryConclusions?.args?.[String(id)] || null;
    },
    hourlyColumns(test) {
      const rows = Object.values(test.hourlyData);
      if (!rows.length) return [];
      return Object.keys(rows[0]).filter((k) => k !== "test");
    },
  },
};
</script>

<style scoped>
div {
  min-height: 0;
}

.container {
  width: 80%;
  height: fit-content;
}

.row {
  margin: 10px;
  justify-content: center;
}

.card {
  height: fit-content;
  width: fit-content;
}

.filterCard {
  display: flex;
  align-items: center;
}

.filterCard .form-control {
  width: fit-content;
  margin: 10px;
}

.not-found {
  color: #dc3545;
  font-style: italic;
}

.error-msg {
  color: #dc3545;
}

.results-title {
  margin-bottom: 16px;
}

.inquiry-tabs .nav-link {
  color: #fff;
  background-color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 0.3rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.inquiry-tabs .nav-link:hover {
  background-color: #5c636a;
}

.inquiry-tabs .nav-link.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.snapshot-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
}

.snapshot-card-header {
  padding: 8px 14px;
  background: #f0f4ff;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0d6efd;
}

.snapshot-card-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.snapshot-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.snapshot-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  min-width: 130px;
  flex-shrink: 0;
}

.snapshot-value {
  font-size: 0.9rem;
  color: #333;
}

.hourly-section {
  margin-top: 8px;
}

.hourly-table {
  width: 100%;
  font-size: 0.82rem;
  border-collapse: collapse;
}

.hourly-table th,
.hourly-table td {
  padding: 4px 8px;
  border: 1px solid #dee2e6;
  text-align: left;
}

.hourly-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.empty-msg {
  color: #888;
  font-style: italic;
}

.empty-inline {
  color: #888;
  font-style: italic;
  font-size: 0.88rem;
}
</style>
