<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Extract Users based on class</h5>
          <div class="filterCard">
            <label for="classId" class="form-label">Select a class: </label>
            <select
              v-model="classname"
              class="form-select"
              aria-label="select"
              id="classId"
            >
              <option value="CMISE">CMISE</option>
              <option value="SPICE">SPICE</option>
            </select>
            <button
              type="button"
              class="btn btn-primary btn-md me-3"
              @click="extractData"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="userData">{{ userData }}</div>
    </div>
  </div>
</template>

<script>
import visualize from "../../services/Visualize.js";
export default {
  name: "Dasboard",
  data() {
    return {
      classname: "",
      userDataList: [],
    };
  },
  computed: {
    userData() {
      return this.userDataList;
    },
  },
  methods: {
    async extractData() {
      visualize
        .getUsersByClass(this.$axios, this.classname)
        .then((response) => {
          this.userDataList = response.data;
        });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
div {
  height: fit-content;
}

select {
  width: fit-content;
  margin: 10px;
}
.card {
  height: fit-content;
  width: fit-content;
}
.filterCard {
  display: flex;
  align-items: center;
}
</style>
