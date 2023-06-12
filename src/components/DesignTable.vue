<template>
  <!-- Design Table Component -->
  <div class="container overflow-scroll">
    <!-- Table to present design history with all/filtered parameters -->
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th
            class="table-light header"
            v-for="(headerItem, index) in header"
            :key="index"
          >
            <p v-if="index === 0 && favorite.length">
              <i class="bi bi-star-fill headerStar"></i>
            </p>
            <p v-else>{{ headerItem }}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- loop over the list of designs and add checkboxes -->
        <tr v-for="(content, index) in contents" :key="index">
          <td v-if="favorite.length" class="table-warning">
            <button
              v-if="favorite[index]"
              class="btn btn-lg btn-link"
              @click="toggleStar(index, false)"
            >
              <i class="bi bi-star-fill headerStar"></i>
            </button>
            <button
              v-else
              class="btn btn-lg btn-link"
              @click="toggleStar(index, true)"
            >
              <i class="bi bi-star"></i>
            </button>
          </td>
          <td v-for="(items, i) in content" :key="i" :class="setCellColor(i)">
            <p>{{ items }}</p>
          </td>
          <td v-if="checked.length" class="table-warning">
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
    favorite: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
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
      if (this.currentRouteName === "Playground") {
        this.$store.dispatch("updatePlayChecks", {
          index: i,
          status: e.target.checked,
        });
      } else {
        this.$store.dispatch("updateCheckedDesigns", {
          index: i,
          status: e.target.checked,
        });
      }
    },

    toggleStar(i, status) {
      if (this.currentRouteName === "Playground") {
        this.$store.dispatch("updatePlayFavs", {
          index: i,
          status: status,
        });
      } else {
        this.$store.dispatch("updateFavoriteDesign", {
          index: i,
          status: status,
        });
      }
    },

    setCellColor(i) {
      i = i.toLowerCase();
      if (i.includes("date") || i.includes("test")) {
        return "table-warning";
      } else if (i.includes("cost")) {
        return "table-danger";
      } else if (i.includes("rainfall")) {
        return "table-primary";
      } else if (i.includes("absorption") || i.includes("runoff")) {
        return "table-info";
      } else {
        return "table-success";
      }
    },
  },
};
</script>

<style>
table {
  font-size: 1.1vw;
  font-weight: 600;
}

thead {
  vertical-align: middle;
  text-align: center;
}
.header {
  position: sticky;
  top: 0;
}
th,
td {
  padding: 0.2rem !important;
  vertical-align: middle;
}
p,
input {
  display: flex;
  justify-content: center;
  margin: auto !important;
}

.headerStar {
  color: #d8cd03;
}
</style>
