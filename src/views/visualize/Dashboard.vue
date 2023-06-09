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
            <td v-for="(item, itemIndex) in userDataItems" :key="itemIndex">
              <span v-if="itemIndex === 'group' && editingIndex === index">
                <select
                  v-model="groupname"
                  class="form-select"
                  aria-label="select"
                  id="groupId"
                >
                  <option value="IE">IE</option>
                  <option value="EE">EE</option>
                  <option value="Construct">Construct</option>
                </select>
              </span>
              <span v-else>
                {{ item }}
              </span>
            </td>
            <td v-if="editingIndex === index">
              <button class="btn btn-lg btn-link" @click="saveUser(index)">
                <i class="bi bi-check-square-fill"></i>
              </button>
              <button class="btn btn-lg btn-link" @click="cancelEdit()">
                <i class="bi bi-x-square-fill"></i>
              </button>
            </td>
            <td v-else>
              <button class="btn btn-lg btn-link" @click="editUser(index)">
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AlertBox
      :message="alertMessage"
      display="flex"
      v-if="isAlertBoxActive"
    ></AlertBox>
  </div>
</template>

<script>
import visualize from "../../services/Visualize.js";
import AlertBox from "../../components/AlertBox.vue";
export default {
  name: "Dasboard",
  components: {
    AlertBox,
  },
  data() {
    return {
      classname: "",
      groupname: "",
      userDataList: [],
      userDataHeader: ["Username", "Email", "Role", "Class", "Group", ""],
      editStatus: false,
      editIndex: "",
      alertMessage: "",
    };
  },
  computed: {
    userData() {
      return this.userDataList;
    },
    editingStatus() {
      return this.editStatus;
    },
    editingIndex() {
      return this.editIndex;
    },
    isAlertBoxActive() {
      return this.alertMessage;
    },
  },
  methods: {
    async extractData() {
      let response = await visualize.getUsersByClass(
        this.$axios,
        this.classname
      );
      if (response) {
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
          this.alertMessage = "No users found";
        }
      }
    },
    editUser(index) {
      this.editIndex = index;
    },
    cancelEdit() {
      this.editIndex = "";
    },
    async saveUser(index) {
      if (document.getElementById("alertID")) {
        document.getElementById("alertID").style.display = "flex";
      }
      if (this.editIndex == index) {
        const editedData = this.userDataList[index];
        let response = await visualize.setUserGroup(
          this.$axios,
          editedData.username,
          this.groupname
        );
        if (response) {
          if (typeof response !== "undefined") {
            this.groupname = "";
            this.alertMessage = "succesfully saved the data.";
          } else {
            this.alertMessage = "could not save it.";
          }
        }
        this.extractData();
        this.editIndex = "";
      } else {
        this.editIndex = "";
        this.alertMessage = "cannot save. Retry.";
      }
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
