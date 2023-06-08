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
    <div class="row" v-if="userData.length">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th
              class="table-light header"
              v-for="(headerItem, index) in userDataHeader"
              :key="index"
            >
              {{ headerItem }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(userDataItems, index) in userData" :key="index">
            <td v-for="(item, index) in userDataItems" :key="index">
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
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
      userDataHeader: ["Username", "Email", "Role", "Class", "Group", ""],
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
          if (this.userDataList.length) {
            this.userDataList = [];
          }
          if (response.data.length) {
            response.data.forEach((element) => {
              let a = {};
              a["username"] = element.username;
              a["email"] = element.email;
              a["role"] = element.role;
              a["class"] = element.class;
              a["group"] = element.group;
              this.userDataList.push(a);
            });
          } else {
            alert("No users found");
          }
        });
    },
  },
};
</script>

<style scoped>
.container {
  width: 50%;
  height: fit-content;
}
.row {
  margin: 10px;
  justify-content: center;
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
td {
  text-align: center;
}
</style>
