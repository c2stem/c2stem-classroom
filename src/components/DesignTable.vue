<template>
  <!-- Design Table Component -->
  <div class="container overflow-scroll">
    <!-- Table to present design history with all/filtered parameters -->
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
        <!-- loop over the list of designs and add checkboxes -->
        <tr v-for="(content, index) in contents" :key="index">
          <td v-for="(items, i) in content" :key="i">
            <p>{{ items }}</p>
          </td>
          <td v-if="checked.length">
            <!-- changing content['design'] to index because of dynamic experiment ID. 
              Experiement Id does not always begi with 1. -->
            <input
              v-if="checked[index]"
              class="form-check-input mt-0"
              type="checkbox"
              @change="check(index, $event)"
              checked
            />
            <input
              v-else
              class="form-check-input mt-0"
              type="checkbox"
              @change="check(index, $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  /**
   * Design Table component
   * Can be integrated with any component that requires a table.
   * @example <design-table >
        header=[designHistory Header names list]
        contents=[Design History contents List]
        checked=[checked list]
      </design-table>
   */
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
      default: () => [],
    },
  },
  methods: {
    /**
     * Gets called when user clicks the checkbox.
     *
     * @param {Integer} i Index of the clicked design.
     * @param {Event} e Event from the checkbox.
     */
    check(i, e) {
      this.$store.dispatch("updateCheckedDesigns", {
        index: i,
        status: e.target.checked,
      });
    },
  },
};
</script>
