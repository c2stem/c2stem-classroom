<template>
  <div>

  <div class="conclusions-wrapper">

    <!-- Left sidebar -->
    <div class="conclusions-sidebar">
      <button
          v-for="(q, index) in questions"
          :key="q.id"
          class="question-btn"
          :class="{ active: activeId === q.id, completed: isCompleted(q.id), locked: q.id > currentQuestion && !isCompleted(q.id) }"
          @click="q.id <= currentQuestion || isCompleted(q.id) ? activeId = q.id : null"
      >
        <span v-if="isCompleted(q.id)" class="btn-status-icon"><i class="bi bi-check-circle-fill"></i></span>
        <span v-else-if="q.id > currentQuestion" class="btn-status-icon"><i class="bi bi-lock-fill"></i></span>
      {{ index + 1 }}. {{ q.question }}
      </button>
    </div>

    <!-- Right content panel -->
    <div class="conclusions-panel">

      <!-- Missing requirements notice -->
      <div v-if="!hasClaimAndEvidence && !isCompleted(activeId)" class="missing-notice">
        <i class="bi bi-info-circle-fill me-2"></i>
        <span>
          <span v-if="!hypotheses[activeId] || (!hypotheses[activeId].effect.length || !hypotheses[activeId].reason.length)">Complete your hypothesis</span>
          <span v-else>Save findings for this question</span>
          before writing your conclusions.
        </span>
      </div>

      <!-- Inline Yes/No prompt -->
      <div v-if="needsClaimAnswer" class="claim-prompt-inline">
        <p class="claim-prompt-question">Would you like to update your claim?</p>
        <div class="claim-prompt-preview">
          {{ activeQuestion.condition }},
          <template v-for="(e, i) in effectList" :key="e">
            <strong>{{ e }}</strong><template v-if="i < effectList.length - 1"> or </template>
          </template>
          because
          <template v-for="(r, i) in reasonList" :key="r">
            <strong>{{ r }}</strong><template v-if="i < reasonList.length - 1"> or </template>
          </template>
        </div>
        <div class="claim-prompt-actions">
          <button class="btn btn-success" @click="answerClaim('no')">Yes</button>
          <button class="btn btn-outline-secondary" @click="answerClaim('yes')">No</button>
        </div>
      </div>

      <!-- Claim -->
      <div class="section" :class="{ 'section-locked': needsClaimAnswer || (!hasClaimAndEvidence && !isCompleted(activeId)) }">
        <h5 class="section-title">Claim</h5>
        <p class="section-subtitle">(From my hypothesis)</p>
        <template v-if="claimAnswer[activeId] === 'no'">
          <p class="editing-claim-label"><i class="bi bi-pencil-fill me-1"></i>Editing your claim</p>
          <textarea class="reasoning-box editing-claim" v-model="editedClaim[activeId]" :disabled="needsClaimAnswer" placeholder="Edit your claim here…"></textarea>
        </template>
        <div v-else class="info-box">
          {{ claimAnswer[activeId] === 'saved' && editedClaim[activeId] ? editedClaim[activeId] : activeQuestion.condition + ', ' }}
          <template v-if="claimAnswer[activeId] !== 'saved' || !editedClaim[activeId]">
            <template v-for="(e, i) in effectList" :key="e">
              <strong>{{ e }}</strong><template v-if="i < effectList.length - 1"> or </template>
            </template>
            because
            <template v-for="(r, i) in reasonList" :key="r">
              <strong>{{ r }}</strong><template v-if="i < reasonList.length - 1"> or </template>
            </template>
          </template>
        </div>
      </div>

      <!-- Evidence -->
      <div class="section" :class="{ 'section-locked': needsClaimAnswer || (!hasClaimAndEvidence && !isCompleted(activeId)) }">
        <h5 class="section-title">Evidence</h5>
        <p class="section-subtitle">(From my findings)</p>
        <div class="info-box" :class="{ 'placeholder-text': !activeFinding }">
          {{ activeFinding || '(No findings saved yet for this question)' }}
        </div>
      </div>

      <!-- Reasoning -->
      <div class="section" :class="{ 'section-locked': needsClaimAnswer || (!hasClaimAndEvidence && !isCompleted(activeId)) }">
        <h5 class="section-title">Reasoning</h5>
        <p class="section-subtitle">(Why did this happen) My conclusions</p>
        <textarea
            class="reasoning-box"
            v-model="reasoning[activeId]"
            :disabled="needsClaimAnswer"
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
        <span v-if="isCompleted(activeId)" class="completed-badge"><i class="bi bi-check-circle-fill"></i> Saved</span>
        <button v-else class="btn btn-primary btn-lg" :disabled="activeId !== currentQuestion || needsClaimAnswer || !hasClaimAndEvidence" @click="saveResults">
          Save My Results
        </button>
        <p v-if="activeId !== currentQuestion && !isCompleted(activeId)" class="locked-note">
          Complete question {{ currentQuestion }} first before saving this one.
        </p>
      </div>

    </div>
  </div>

  </div>
</template>

<script>
import Logger from "../services/Logger.js";
export default {
  name: "InquiryConclusions",
  data() {
    return {
      activeId: 1,
      reasoning: { 1: "", 2: "", 3: "" },
      claimAnswer: { 1: null, 2: null, 3: null },
      editedClaim: { 1: "", 2: "", 3: "" },
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
    this._prevHypotheses = JSON.stringify(this.$store.getters.getHypotheses);
  },
  watch: {
    hypotheses: {
      deep: true,
      handler(newVal) {
        const prev = JSON.parse(this._prevHypotheses || "{}");
        [1, 2, 3].forEach((id) => {
          if (!this.isCompleted(id)) return;
          const prevH = prev[id] || { effect: [], reason: [] };
          const newH = newVal[id] || { effect: [], reason: [] };
          const changed =
            JSON.stringify(prevH.effect) !== JSON.stringify(newH.effect) ||
            JSON.stringify(prevH.reason) !== JSON.stringify(newH.reason);
          if (changed) {
            this.$store.dispatch("resetQuestion", id);
            this.claimAnswer = { ...this.claimAnswer, [id]: null };
            this.editedClaim = { ...this.editedClaim, [id]: "" };
          }
        });
        this._prevHypotheses = JSON.stringify(newVal);
      },
    },
  },
  computed: {
    hasClaimAndEvidence() {
      const h = this.hypotheses[this.activeId];
      const hasClaim = h && h.effect.length > 0 && h.reason.length > 0;
      const hasEvidence = !!this.activeFinding;
      return hasClaim && hasEvidence;
    },
    needsClaimAnswer() {
      return this.hasClaimAndEvidence && this.claimAnswer[this.activeId] === null && this.activeId === this.currentQuestion && !this.isCompleted(this.activeId);
    },
    hypothesesComplete() {
      return Object.values(this.hypotheses).every(
        (h) => h.effect.length > 0 && h.reason.length > 0
      );
    },
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
    currentQuestion() {
      return this.$store.getters.getCurrentQuestion;
    },
    completedQuestions() {
      return this.$store.getters.getCompletedQuestions;
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
  methods: {
    isCompleted(id) {
      return this.completedQuestions.includes(id);
    },
    goToHypotheses() {
      document.getElementById("hypotheses-tab")?.click();
    },
    answerClaim(answer) {
      const keyMap = { 1: "rainfallRate", 2: "surfaceMaterial", 3: "rainfallDuration" };
      const key = keyMap[this.activeId];
      const h = this.hypotheses[this.activeId];
      const q = this.activeQuestion;
      const effects = h.effect.length ? h.effect.join(" or ") : "…";
      const reasons = h.reason.length ? h.reason.join(" or ") : "…";
      const originalClaim = `${q.condition}, ${effects} because ${reasons}`;
      this.claimAnswer = { ...this.claimAnswer, [this.activeId]: answer };
      if (answer === "no") {
        this.editedClaim = { ...this.editedClaim, [this.activeId]: originalClaim };
      }
      Logger.logUserActions({
        actionType: "inquiryConclusionsClaimUpdate",
        actionView: "InquiryConclusions",
        args: { questionId: this.activeId, hypothesis: key, updateClaim: answer === "no" },
      });
    },
    saveResults() {
      const keyMap = { 1: "rainfallRate", 2: "surfaceMaterial", 3: "rainfallDuration" };
      const snapshot = {};
      this.questions.forEach((q) => {
        const key = keyMap[q.id];
        const h = this.hypotheses[q.id];
        const effects = h.effect.length ? h.effect.join(" or ") : "…";
        const reasons = h.reason.length ? h.reason.join(" or ") : "…";
        const originalClaim = `${q.condition}, ${effects} because ${reasons}`;
        snapshot[key] = {
          claim: this.claimAnswer[q.id] === "no" ? (this.editedClaim[q.id] || originalClaim) : originalClaim,
          updatedClaim: this.claimAnswer[q.id] === "no",
          evidence: this.findings[key]?.finding || "",
          reasoning: this.reasoning[q.id] || "",
        };
      });
      this.$store.dispatch("saveConclusions", snapshot);
      this.$store.dispatch("completeQuestion", this.activeId);
      this.claimAnswer = { ...this.claimAnswer, [this.activeId]: "saved" };
      const activeKey = keyMap[this.activeId];
      Logger.logUserActions({
        actionType: "inquiryConclusions",
        actionView: "InquiryConclusions",
        args: {
          questionId: this.activeId,
          hypothesis: activeKey,
          claim: snapshot[activeKey].claim,
          updatedClaim: snapshot[activeKey].updatedClaim,
          evidence: snapshot[activeKey].evidence,
          reasoning: snapshot[activeKey].reasoning,
        },
      });
    },
  },
};
</script>

<style scoped>
p {
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

.question-btn.completed {
  border-color: #198754;
  color: #198754;
}

.question-btn.completed.active {
  background-color: #198754;
  border-color: #198754;
  color: #fff;
}

.question-btn.locked {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-status-icon {
  margin-right: 4px;
}

.completed-badge {
  color: #198754;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.locked-note {
  font-size: 0.82rem;
  color: #888;
  font-style: italic;
  margin-top: 6px;
  margin-bottom: 0;
}

.conclusions-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.missing-notice {
  display: flex;
  align-items: center;
  background: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
  color: #7c5a00;
}

.claim-prompt-inline {
  background: #eef4ff;
  border: 2px solid #0d6efd;
  border-radius: 10px;
  padding: 16px 20px;
}

.claim-prompt-question {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.claim-prompt-preview {
  background: #fff;
  border: 1px solid #b6d0ff;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 0.93rem;
  color: #333;
  margin: 0 0 10px 0;
}

.claim-prompt-sub {
  font-size: 0.88rem;
  color: #555;
  margin: 0 0 14px 0;
}

.claim-prompt-actions {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
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

.section-locked {
  opacity: 0.45;
  pointer-events: none;
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

.editing-claim-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #d97706;
  margin-bottom: 4px;
}

.editing-claim {
  border-color: #f59e0b;
  background-color: #fffbeb;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
}

.editing-claim:focus {
  border-color: #d97706;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.35);
}

.save-row {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}
</style>
