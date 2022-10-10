<template>
  <!-- Test Table Component -->
  <div class="container overflow-scroll">
    <!-- Table to present test history -->
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
        <!-- content -->
        <tr v-for="(content, index) in contents" :key="index">
          <td v-for="(items, i) in content" :key="i">
            <p>{{ items }}</p>
          </td>
          <!-- <td v-if="checked.length">
            <input
              v-if="checked[index]"
              class="form-check-input mt-0"
              type="checkbox"
              @change="check(content['design'], $event)"
              checked
            />
            <input
              v-else
              class="form-check-input mt-0"
              type="checkbox"
              @change="check(content['design'], $event)"
            />
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  /**
   * Test Table component
   * Can be integrated with any component that requires a table.
   * @example <test-table >
        header=[designHistory Header names list]
        contents=[Design History contents List]
      </test-table>
   */
  name: "Test Table",
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
    // /**
    //  * Status of the comparison checkbox in the table.
    //  * @values [true, false]
    //  */
    // checked: {
    //   type: Array,
    //   default: () => [],
    // },
  },
};
</script>
