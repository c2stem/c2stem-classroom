<template>
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
        <div class="info-box placeholder-text">(auto-populate from my findings page)</div>
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
  methods: {
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
          evidence: "",
          reasoning: this.reasoning[q.id] || "",
        };
      });
      this.$store.dispatch("saveConclusions", snapshot);
    },
  },
  computed: {
    hypotheses() {
      return this.$store.getters.getHypotheses;
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
  },
};
</script>

<style scoped>
p{
  justify-content: flex-start;
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
