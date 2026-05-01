<template>
  <div>

  <div class="conclusions-wrapper">

    <!-- Left sidebar -->
    <div class="conclusions-sidebar">
      <button
          v-for="(q, index) in questions"
          :key="q.id"
          class="question-btn"
          :class="{ active: activeId === q.id }"
          @click="activeId = q.id"
      >
        {{ index + 1 }}. {{ q.question }}
      </button>
    </div>

    <!-- Right content panel -->
    <div class="conclusions-panel">

      <!-- Claim -->
      <div class="section">
        <h5 class="section-title">Claim</h5>
        <p class="section-subtitle">(From my hypothesis)</p>
        <div class="info-box">
          {{ activeQuestion.condition }},
          <template v-for="(e, i) in effectList" :key="e">
            <strong>{{ e }}</strong><template v-if="i < effectList.length - 1"> or </template>
          </template>
          because
          <template v-for="(r, i) in reasonList" :key="r">
            <strong>{{ r }}</strong><template v-if="i < reasonList.length - 1"> or </template>
          </template>
        </div>
      </div>

      <!-- Evidence -->
      <div class="section">
        <h5 class="section-title">Evidence</h5>
        <p class="section-subtitle">(From my findings)</p>
        <div class="info-box" :class="{ 'placeholder-text': !activeFinding }">
          {{ activeFinding || '(No findings saved yet for this question)' }}
        </div>
      </div>

      <!-- Reasoning -->
      <div class="section">
        <h5 class="section-title">Reasoning</h5>
        <p class="section-subtitle">(Why did this happen) My conclusions</p>
        <textarea
            class="reasoning-box"
            v-model="reasoning[activeId]"
            placeholder="Write your reasoning here using sentence starters like:
  - This happens because …
  - The scientific reason for this is …
  - This supports my claim because …
  - This goes against my claim because, …
  - Because … causes … , it makes sense that …"
        ></textarea>
      </div>

      <!-- Save -->
      <div class="save-row">
        <button class="btn btn-primary btn-lg" @click="saveResults">Save My Results</button>
      </div>

    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: "InquiryConclusions",
  data() {
    return {
      activeId: 1,
      reasoning: { 1: "", 2: "", 3: "" },
      questions: [
        {
          id: 1,
          question: "How does rainfall rate affect runoff?",
          condition: "If rainfall rate increases",
        },
        {
          id: 2,
          question: "How does surface material affect runoff?",
          condition: "If we change the surface material",
        },
        {
          id: 3,
          question: "How does rainfall duration affect runoff?",
          condition: "If rain continues for a long time",
        },
      ],
    };
  },
  mounted() {
    const keyMap = { 1: "rainfallRate", 2: "surfaceMaterial", 3: "rainfallDuration" };
    const saved = this.$store.getters.getConclusions;
    Object.entries(keyMap).forEach(([id, key]) => {
      if (saved[key]?.reasoning) this.reasoning[Number(id)] = saved[key].reasoning;
    });
  },
  methods: {
    goToHypotheses() {
      document.getElementById("hypotheses-tab")?.click();
    },
    saveResults() {
      const keyMap = { 1: "rainfallRate", 2: "surfaceMaterial", 3: "rainfallDuration" };
      const snapshot = {};
      this.questions.forEach((q) => {
        const key = keyMap[q.id];
        const h = this.hypotheses[q.id];
        const effects = h.effect.length ? h.effect.join(" or ") : "…";
        const reasons = h.reason.length ? h.reason.join(" or ") : "…";
        snapshot[key] = {
          claim: `${q.condition}, ${effects} because ${reasons}`,
          evidence: this.findings[key]?.finding || "",
          reasoning: this.reasoning[q.id] || "",
        };
      });
      this.$store.dispatch("saveConclusions", snapshot);
    },
  },
  computed: {
    hypothesesComplete() {
      return Object.values(this.hypotheses).every(
        (h) => h.effect.length > 0 && h.reason.length > 0
      );
    },
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
    findings() {
      return this.$store.getters.getFindings;
    },
    activeQuestion() {
      return this.questions.find((q) => q.id === this.activeId);
    },
    effectList() {
      const h = this.hypotheses[this.activeId];
      return h.effect.length ? h.effect : ["…"];
    },
    reasonList() {
      const h = this.hypotheses[this.activeId];
      return h.reason.length ? h.reason : ["…"];
    },
    activeFinding() {
      const keyMap = { 1: "rainfallRate", 2: "surfaceMaterial", 3: "rainfallDuration" };
      return this.findings[keyMap[this.activeId]]?.finding || "";
    },
  },
};
</script>

<style scoped>
p{
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

.conclusions-wrapper {
  display: flex;
  gap: 24px;
  height: 100%;
}

.conclusions-sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #f0f2f5;
  border-radius: 8px;
  padding: 16px;
}

.question-btn {
  width: 100%;
  padding: 16px 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.4;
}

.question-btn:hover {
  background-color: #e8f0fe;
  border-color: #0d6efd;
}

.question-btn.active {
  background-color: #0d6efd;
  border-color: #0a58ca;
  color: #fff;
  box-shadow: 0 2px 6px rgba(13, 110, 253, 0.35);
}

.conclusions-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.section-title {
  font-weight: 700;
  margin-bottom: 2px;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 6px;
}

.info-box {
  background-color: #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.95rem;
  min-height: 44px;
  color: #333;
}

.placeholder-text {
  color: #888;
  font-style: italic;
}

.reasoning-box {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.95rem;
  min-height: 130px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  color: #333;
}

.reasoning-box:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.2);
}

.save-row {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

</style>
