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
        <p class="text-muted">My Experiments content coming soon.</p>
      </div>
      <div class="tab-pane" id="findings" aria-labelledby="findings-tab" role="tabpanel" tabindex="0">
        <p class="text-muted">My Findings content coming soon.</p>
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
export default {
  name: "Inquiry",
  components: {
    InquiryHypothesis,
    InquiryConclusions,
  }
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
  color: #444;
  background-color: #e9ecef;
  border: 1px solid #adb5bd;
  border-radius: 20px;
  padding: 6px 20px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;
}

.inquiry-tabs .nav-link:hover {
  background-color: #d0d6dd;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.inquiry-tabs .nav-link.active {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0a58ca;
  font-weight: 600;
  box-shadow: 0 3px 8px rgba(13, 110, 253, 0.4);
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
