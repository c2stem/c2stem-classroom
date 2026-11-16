<template>
  <!-- Comapre component  -->
  <div class="container overflow-scroll">
    <!-- Table to present selected designs with their respective parameters for comparison -->
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th
            class="table-info"
            v-for="(headerItem, index) in header"
            :key="index"
          >
            {{ headerItem }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="content in filteredContent" :key="designKey(content)">
          <td class="stage-cell">
            <img
              v-if="renderedStages[designKey(content)]"
              :src="renderedStages[designKey(content)]"
              class="img-fluid"
              :alt="'Stage for design ' + designKey(content)"
            />
            <template v-else>
              <img
                src="../../public/stage.png"
                class="img-fluid placeholder-stage"
                alt="Stage not available"
              />
              <small v-if="!layouts[designKey(content)]" class="text-muted">
                Stage not recorded for this design
              </small>
            </template>
          </td>
          <td v-for="(items, i) in content" :key="i">
            <p>{{ items }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 * Compare component.
 * Contains a table of the selected designs with their stages.
 * Each stage is redrawn from the tile layout recorded when the design was
 * run (see services/StageLayout.js and services/StageRender.js).
 * @example <compare >
        header=[designHistory Header names list]
        contents=[Design History contents List]
        checked=[checked list]
        layouts={ designKey: { A: "grass", ... } }
      </compare>
 */
import StageRender from "../services/StageRender";

export default {
  name: "Table",
  props: {
    /**
     * The Array list of header names
     */
    header: {
      type: Array,
      required: true,
    },
    /**
     * Dictionary of arrays. Each array consists of
     * contents from a design.
     */
    contents: {
      type: Object,
      required: true,
    },
    /**
     * Status of the comparison checkbox in the table.
     * @values [true, false]
     */
    checked: {
      type: Array,
      required: true,
    },
    /**
     * Tile layout of each design, keyed by design key
     * (the "design/date" value of the design).
     */
    layouts: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      renderedStages: {},
    };
  },
  computed: {
    filteredContent() {
      let filteredData = Object.entries(this.contents);
      filteredData = filteredData.filter((data, index) => {
        return this.checked[index];
      });
      return Object.fromEntries(filteredData);
    },
  },
  watch: {
    filteredContent: {
      handler() {
        this.renderStages();
      },
      immediate: true,
    },
    layouts: {
      handler() {
        this.renderStages();
      },
      deep: true,
    },
  },
  methods: {
    designKey(design) {
      return StageRender.designKey(design);
    },
    /**
     * Draw the stage of every selected design that has a recorded layout.
     */
    renderStages() {
      Object.values(this.filteredContent).forEach((design) => {
        const key = this.designKey(design);
        const materials = this.layouts[key];
        if (!key || !materials) return;
        StageRender.renderDesign(design, materials)
          .then((url) => {
            this.renderedStages = { ...this.renderedStages, [key]: url };
          })
          .catch((error) => {
            console.warn("Could not render stage for", key, error);
          });
      });
    },
  },
};
</script>

<style scoped>
table {
  font-size: 0.9vw;
  font-weight: 700;
}
.stage-cell {
  min-width: 240px;
}
.placeholder-stage {
  opacity: 0.4;
}
</style>
