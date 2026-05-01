<template>
  <div class="container py-3">
    <div v-for="(h, index) in questions" :key="h.id" class="mb-5">
      <h5 class="fw-bold">{{ index + 1 }}. {{ h.question }}</h5>
      <p class="text-muted fst-italic">{{ h.condition }}</p>
      <div class="d-flex align-items-start gap-3 ms-3">

        <!-- Box multi-select (question 1) -->
        <template v-if="h.multiSelect && !h.dropdownSelect">
          <div class="hyp-checkbox-list">
            <label v-for="opt in h.effectOptions" :key="opt"
                   class="hyp-option"
                   :class="{ selected: hypotheses[h.id].effect.includes(opt) }"
                   @click="toggleSelection(h.id, 'effect', opt)">
              {{ opt }}
            </label>
          </div>
        </template>

        <!-- Dropdown multi-select (questions 2 & 3) -->
        <template v-else-if="h.multiSelect && h.dropdownSelect">
          <div class="hyp-dropdown">
            <div class="hyp-dropdown-trigger" @click.stop="toggleDropdown(h.id, 'effect')">
              <span v-if="hypotheses[h.id].effect.length" class="trigger-text">
                {{ hypotheses[h.id].effect.join('; ') }}
              </span>
              <span v-else class="trigger-placeholder">Select one or more</span>
              <i class="bi bi-chevron-down trigger-arrow"
                 :class="{ open: openDropdown === `${h.id}-effect` }"></i>
            </div>
            <div v-if="openDropdown === `${h.id}-effect`" class="hyp-dropdown-menu">
              <label v-for="opt in h.effectOptions" :key="opt"
                     class="hyp-option"
                     :class="{ selected: hypotheses[h.id].effect.includes(opt) }"
                     @click.stop="toggleSelection(h.id, 'effect', opt)">
                {{ opt }}
              </label>
            </div>
          </div>
        </template>

        <!-- Single select fallback -->
        <select v-else class="hyp-select"
                :value="hypotheses[h.id].effect[0] || ''"
                @change="setSelection(h.id, 'effect', $event.target.value)">
          <option value="" disabled>Select one</option>
          <option v-for="opt in h.effectOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <span class="fw-500">because</span>

        <!-- Box multi-select (question 1) -->
        <template v-if="h.multiSelect && !h.dropdownSelect">
          <div class="hyp-checkbox-list">
            <label v-for="opt in h.reasonOptions" :key="opt"
                   class="hyp-option"
                   :class="{ selected: hypotheses[h.id].reason.includes(opt) }"
                   @click="toggleSelection(h.id, 'reason', opt)">
              {{ opt }}
            </label>
          </div>
        </template>

        <!-- Dropdown multi-select (questions 2 & 3) -->
        <template v-else-if="h.multiSelect && h.dropdownSelect">
          <div class="hyp-dropdown">
            <div class="hyp-dropdown-trigger" @click.stop="toggleDropdown(h.id, 'reason')">
              <span v-if="hypotheses[h.id].reason.length" class="trigger-text">
                {{ hypotheses[h.id].reason.join('; ') }}
              </span>
              <span v-else class="trigger-placeholder">Select one or more</span>
              <i class="bi bi-chevron-down trigger-arrow"
                 :class="{ open: openDropdown === `${h.id}-reason` }"></i>
            </div>
            <div v-if="openDropdown === `${h.id}-reason`" class="hyp-dropdown-menu">
              <label v-for="opt in h.reasonOptions" :key="opt"
                     class="hyp-option"
                     :class="{ selected: hypotheses[h.id].reason.includes(opt) }"
                     @click.stop="toggleSelection(h.id, 'reason', opt)">
                {{ opt }}
              </label>
            </div>
          </div>
        </template>

        <!-- Single select fallback -->
        <select v-else class="hyp-select"
                :value="hypotheses[h.id].reason[0] || ''"
                @change="setSelection(h.id, 'reason', $event.target.value)">
          <option value="" disabled>Select one</option>
          <option v-for="opt in h.reasonOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InquiryHypothesis",
  data() {
    return {
      openDropdown: null,
      questions: [
        {
          id: 1,
          question: "How does rainfall rate affect runoff?",
          condition: "If rainfall rate increases …",
          multiSelect: true,
          dropdownSelect: false,
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
          dropdownSelect: true,
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
          dropdownSelect: true,
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
    toggleSelection(id, field, value) {
      const current = [...this.hypotheses[id][field]];
      const idx = current.indexOf(value);
      if (idx === -1) current.push(value);
      else current.splice(idx, 1);
      this.$store.dispatch("updateHypothesis", { id, field, value: current });
    },
    setSelection(id, field, value) {
      this.$store.dispatch("updateHypothesis", { id, field, value: [value] });
    },
    toggleDropdown(id, field) {
      const key = `${id}-${field}`;
      this.openDropdown = this.openDropdown === key ? null : key;
    },
    closeAllDropdowns() {
      this.openDropdown = null;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeAllDropdowns);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeAllDropdowns);
  },
};
</script>

<style scoped>
.hyp-select {
  min-width: 280px;
  padding: 0;
  background-color: #fdf6e3;
  border: 1px solid #c8b89a;
  border-radius: 4px;
  font-size: 1rem;
}

.hyp-select option {
  padding: 4px 8px;
}

.hyp-checkbox-list {
  min-width: 280px;
  border: 1px solid #c8b89a;
  border-radius: 4px;
  background-color: #fdf6e3;
  overflow: hidden;
  padding: 4px;
}

.hyp-dropdown {
  position: relative;
  min-width: 280px;
}

.hyp-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 10px;
  background-color: #fdf6e3;
  border: 1px solid #c8b89a;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  min-height: 36px;
}

.trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.trigger-placeholder {
  color: #999;
  flex: 1;
}

.trigger-arrow {
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.trigger-arrow.open {
  transform: rotate(180deg);
}

.hyp-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: #fdf6e3;
  border: 1px solid #c8b89a;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 220px;
  overflow-y: auto;
  padding: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
}

.hyp-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
  font-weight: normal;
  margin: 0;
}

.hyp-option input[type="checkbox"] {
  display: none;
}

.hyp-option.selected {
  background-color: #0d6efd;
  color: #fff;
  border-radius: 6px;
}

div {
  height: auto;
}

p {
  justify-content: flex-start;
}
</style>
