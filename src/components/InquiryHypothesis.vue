<template>
  <div class="container py-3">
    <div v-for="(h, index) in questions" :key="h.id" class="accordion-card mb-4">

      <!-- Accordion Header -->
      <div class="accordion-header" :class="{ expanded: openQuestion === h.id }" @click="toggleQuestion(h.id)">
        <div class="accordion-title">
          <span class="question-number" :class="{ answered: isAnswered(h.id) }">{{ index + 1 }}</span>
          <span class="question-text">{{ h.question }}</span>
        </div>
        <div class="accordion-hint">
          <span class="click-hint" v-if="openQuestion !== h.id">Click to answer</span>
          <i :class="['bi', 'accordion-chevron', openQuestion === h.id ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
        </div>
      </div>

      <!-- Accordion Body -->
      <div v-if="openQuestion === h.id" class="accordion-body">
        <p class="condition-text">{{ h.condition }}</p>

        <div class="options-row">
          <!-- Effect options -->
          <div class="options-group">
            <div class="options-label">Runoff will…</div>
            <div class="hyp-checkbox-list">
              <label v-for="opt in h.effectOptions" :key="opt"
                     class="hyp-option"
                     :class="{ selected: hypotheses[h.id].effect.includes(opt) }"
                     @click="toggleSelection(h.id, 'effect', opt)">
                {{ opt }}
              </label>
            </div>
          </div>

          <span class="because-label">because</span>

          <!-- Reason options -->
          <div class="options-group">
            <div class="options-label">Reason…</div>
            <div class="hyp-checkbox-list">
              <label v-for="opt in h.reasonOptions" :key="opt"
                     class="hyp-option"
                     :class="{ selected: hypotheses[h.id].reason.includes(opt) }"
                     @click="toggleSelection(h.id, 'reason', opt)">
                {{ opt }}
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "InquiryHypothesis",
  data() {
    return {
      openQuestion: null,
      questions: [
        {
          id: 1,
          question: "How does rainfall rate affect runoff?",
          condition: "If rainfall rate increases …",
          multiSelect: true,
          effectOptions: [
            "Runoff will decrease",
            "Runoff will increase",
            "Runoff will change",
            "Runoff will not change",
          ],
          reasonOptions: [
            "Surface will absorb most of the water",
            "Surface will not absorb any water",
            "Surface will absorb all the water",
            "Surface will not be able to absorb water fast enough",
            "All the water will evaporate",
            "Runoff increases when rainfall rate is greater than absorption rate",
            "Runoff depends only on how long it rains",
          ],
        },
        {
          id: 2,
          question: "How does surface material affect runoff?",
          condition: "If we change the surface material …",
          multiSelect: true,
          effectOptions: [
            "Runoff will increase",
            "Runoff will decrease",
            "Runoff will change",
            "Runoff will not change",
          ],
          reasonOptions: [
            "Runoff only depends on rainfall rate",
            "Some surfaces absorb more water than others",
            "Different surface materials can have different slopes",
            "All surfaces absorb water the same way",
            "Different surface materials have different absorption rates",
            "Different surface materials have different absorption limits",
            "Different surface materials have different absorption rates and absorption limits",
            "Runoff only depends on temperature",
            "Runoff only depends on humidity",
          ],
        },
        {
          id: 3,
          question: "How does rainfall duration affect runoff?",
          condition: "If rain continues for a long time …",
          multiSelect: true,
          effectOptions: [
            "Runoff will increase",
            "Runoff will decrease",
            "Runoff will change",
            "Runoff will not change",
          ],
          reasonOptions: [
            "Runoff depends only on rainfall rate and material",
            "Once the surface is full, all additional rain becomes runoff",
            "Water keeps getting absorbed as long as it rains",
            "The longer it rains, the more water builds up over time",
            "Runoff only depends on temperature",
            "The surface will eventually reach its absorption limit and become saturated",
            "Runoff only depends on humidity",
            "Surface will stop absorbing water after some time",
          ],
        },
      ],
    };
  },
  computed: {
    hypotheses() {
      return this.$store.getters.getHypotheses;
    },
  },
  methods: {
    toggleQuestion(id) {
      this.openQuestion = this.openQuestion === id ? null : id;
    },
    isAnswered(id) {
      const h = this.hypotheses[id];
      return h && h.effect.length > 0 && h.reason.length > 0;
    },
    toggleSelection(id, field, value) {
      const current = [...this.hypotheses[id][field]];
      const idx = current.indexOf(value);
      if (idx === -1) current.push(value);
      else current.splice(idx, 1);
      this.$store.dispatch("updateHypothesis", { id, field, value: current });
    },
  },
};
</script>

<style scoped>
/* Accordion card */
.accordion-card {
  border: 2px solid #c8b89a;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}

.accordion-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
}

/* Header */
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background-color: #fdf6e3;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  gap: 12px;
}

.accordion-header:hover {
  background-color: #f5ecd0;
}

.accordion-header.expanded {
  background-color: #e8dfc8;
  border-bottom: 2px solid #c8b89a;
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  transition: background-color 0.25s ease;
}

.question-number.answered {
  background-color: #198754;
}

.question-text {
  font-weight: 600;
  font-size: 1.15rem;
  color: #2c2c2c;
}

.accordion-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.click-hint {
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

.accordion-chevron {
  font-size: 1.15rem;
  color: #555;
  transition: transform 0.2s ease;
}

/* Body */
.accordion-body {
  padding: 18px 20px;
  background-color: #fffdf7;
}

.condition-text {
  color: #666;
  font-style: italic;
  margin-bottom: 16px;
  font-size: 1.05rem;
}

.options-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.options-group {
  flex: 1;
  min-width: 240px;
}

.options-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.because-label {
  font-weight: 500;
  font-size: 1.05rem;
  padding-top: 28px;
  flex-shrink: 0;
  color: #444;
}

/* Option boxes */
.hyp-checkbox-list {
  border: 1px solid #c8b89a;
  border-radius: 6px;
  background-color: #fdf6e3;
  overflow: hidden;
  padding: 4px;
}

.hyp-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  user-select: none;
  font-weight: normal;
  font-size: 1.05rem;
  margin: 2px 0;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.hyp-option:hover {
  background-color: #f0e6cc;
  border-color: #c8b89a;
}

.hyp-option.selected {
  background-color: #0d6efd;
  color: #fff;
  border-color: #0a58ca;
  border-radius: 4px;
}

div {
  height: auto;
}
</style>
