<template>
  <table class="table table-hover table-bordered">
    <thead>
      <tr>
        <th
          class="table-light header"
          v-for="(headerItem, index) in header"
          :key="index"
        >
          {{ headerItem }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(dataItem, index) in data" :key="index">
        <td>{{ dataItem.email }}</td>
        <td>{{ dataItem.username }}</td>
        <td>{{ dataItem.password }}</td>
        <td>{{ dataItem.class }}</td>
        <td>{{ dataItem.role }}</td>
        <td>{{ dataItem.group }}</td>
        <td>{{ dataItem.teacher }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "UserDataTable",
  props: {
    header: {
      type: Array,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
td {
  text-align: center;
}
</style>
