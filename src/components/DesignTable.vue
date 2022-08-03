<template>
  <div class="container overflow-scroll">
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th class=" table-info" v-for="(headerItem, index) in header" :key="index">
            {{ headerItem }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(content, index) in contents" :key="index">
          <td v-for="(items, i) in content" :key="i">
            <p>{{ items }}</p>
          </td>
          <td>
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
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    header: {
      type: Array,
      required: true,
    },
    contents: {
      type: Object,
      required: true,
    },
    checked: {
      type: Array,
      required: true,
    },
  },
  methods: {
    check(i, e) {
      this.$store.dispatch("updateCheckedDesigns", {
        index: i - 2,
        status: e.target.checked,
      });
    },
  },
};
</script>
