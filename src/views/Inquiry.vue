<template>
  <div class="inquiry-wrapper">
    <ul class="nav nav-pills inquiry-tabs mb-1 gap-2" id="inquiry-list">
      <li class="nav-item" role="presentation">
        <button
            class="nav-link active"
            id="hypotheses-tab"
            data-bs-toggle="pill"
            data-bs-target="#hypothesis"
            type="button"
            role="tab"
            aria-controls="hypothesis"
            aria-selected="true"
        >
          My Hypotheses
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="experiments-tab"
            data-bs-toggle="pill"
            data-bs-target="#experiments"
            type="button"
            role="tab"
            aria-controls="experiments"
            aria-selected="false"
        >
          My Experiments
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="findings-tab"
            data-bs-toggle="pill"
            data-bs-target="#findings"
            type="button"
            role="tab"
            aria-controls="findings"
            aria-selected="false"
        >
          My Findings
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
            class="nav-link"
            id="conclusions-tab"
            data-bs-toggle="pill"
            data-bs-target="#conclusions"
            type="button"
            role="tab"
            aria-controls="conclusions"
            aria-selected="false"
        >
          My Conclusions
        </button>
      </li>
    </ul>
    <div class="tab-content inquiry-card" id="pills-tabContent">
      <div class="tab-pane show active" id="hypothesis" aria-labelledby="hypotheses-tab" role="tabpanel" tabindex="0">
        <InquiryHypothesis></InquiryHypothesis>
      </div>
      <div class="tab-pane" id="experiments" aria-labelledby="experiments-tab" role="tabpanel" tabindex="0">
        <InquiryExperiments v-if="activeTab === 'experiments'"></InquiryExperiments>
      </div>
      <div class="tab-pane" id="findings" aria-labelledby="findings-tab" role="tabpanel" tabindex="0">
        <InquiryFindings v-if="activeTab === 'findings'"></InquiryFindings>
      </div>
      <div class="tab-pane" id="conclusions" aria-labelledby="conclusions-tab" role="tabpanel" tabindex="0">
        <InquiryConclusions></InquiryConclusions>
      </div>
    </div>
  </div>
</template>

<script>
import InquiryHypothesis from "../components/InquiryHypothesis.vue";
import InquiryConclusions from "../components/InquiryConclusions.vue";
import InquiryExperiments from "../components/InquiryExperiments.vue";
import InquiryFindings from "../components/InquiryFindings.vue";
export default {
  name: "Inquiry",
  components: {
    InquiryHypothesis,
    InquiryConclusions,
    InquiryExperiments,
    InquiryFindings,
  },
  data() {
    return {
      activeTab: "hypothesis",
    };
  },
  mounted() {
    const tabs = document.querySelectorAll("#inquiry-list button[data-bs-toggle='pill']");
    tabs.forEach((btn) => {
      btn.addEventListener("shown.bs.tab", (e) => {
        const target = e.target.getAttribute("data-bs-target");
        this.activeTab = target.replace("#", "");
      });
    });
  },
}
</script>

<style scoped>
.inquiry-wrapper {
  width: 95%;
  margin: 8px auto;
}

.inquiry-tabs {
  align-items: center;
}

.inquiry-tabs .nav-item {
  list-style: none;
}

.inquiry-tabs .nav-link {
  color: #fff;
  background-color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 0.3rem;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  font-weight: 400;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.inquiry-tabs .nav-link:hover {
  background-color: #5c636a;
  border-color: #565e64;
}

.inquiry-tabs .nav-link.active {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
  font-weight: 400;
}

.inquiry-tabs .nav-link.active:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.inquiry-card {
  border: 2px solid #adb5bd;
  border-radius: 10px;
  background-color: #fff;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
  height: calc(100vh - 120px);
  overflow-y: auto;
}
div{
  min-height: auto;
  height: auto;
}
</style>
