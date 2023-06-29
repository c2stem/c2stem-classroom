<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-body">
          <!--          <h5 class="card-title">Extract Users based on class</h5>-->
          <div class="filterCard">
            <label for="filterId" class="form-label">Extract a user by: </label>
            <select
              v-model="userFilter"
              class="form-select"
              aria-label="select"
              id="filterId"
            >
              <option value="class">Class</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div
            v-if="getFilter.length > 0 && getFilter === 'class'"
            class="filterCard"
          >
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
              @click="extractData((extractFilter = 'class'))"
            >
              Filter
            </button>
          </div>
          <div v-else-if="getFilter.length > 0" class="filterCard">
            <label for="teacherId" class="form-label">Select a teacher: </label>
            <select
              v-model="teacherName"
              class="form-select"
              aria-label="select"
              id="teacherId"
            >
              <option
                v-for="(teacher, index) in Teachers"
                :key="index"
                :value="teacher"
              >
                {{ teacher }}
              </option>
            </select>
            <button
              type="button"
              class="btn btn-primary btn-md me-3"
              @click="extractData((extractFilter = 'teacher'))"
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
              <span
                v-else-if="itemIndex === 'teacher' && editingIndex === index"
              >
                <input
                  v-model="updatedTeacherName"
                  placeholder="enter teacher name.."
                />
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
    <AlertBox :message="alertMessage" v-if="isAlertBoxActive"></AlertBox>
  </div>
</template>

<script>
import visualize from "../../services/Visualize.js";
import AlertBox from "../../components/AlertBox.vue";
export default {
  name: "Dashboard",
  components: {
    AlertBox,
  },
  data() {
    return {
      classname: "",
      groupname: "",
      userDataList: [],
      userDataHeader: [
        "Username",
        "Email",
        "Role",
        "Class",
        "Group",
        "Teacher",
        "",
      ],
      editStatus: false,
      editIndex: "",
      alertMessage: "",
      userFilter: "",
      teachers: [],
      teacherName: "",
      updatedTeacherName: "",
      extractFilter: "",
      cardActive: false,
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
      return this.cardActive;
    },
    getFilter() {
      if (this.userFilter === "teacher") {
        this.getTeachers();
        return this.userFilter;
      } else {
        return this.userFilter;
      }
    },
    Teachers() {
      return this.teachers;
    },
  },
  methods: {
    async extractData(filter) {
      let response = "";
      if (filter === "class") {
        response = await visualize.getUsersByClass(this.classname);
      } else if (filter === "teacher") {
        response = await visualize.getUsersByTeacher(this.teacherName);
      }
      if (response.status >= 200 && response.status < 300) {
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
            a["teacher"] = element.teacher;
            this.userDataList.push(a);
          });
        } else {
          this.sendAlert("No users found");
        }
      } else {
        this.sendAlert(response.message);
      }
    },
    editUser(index) {
      this.editIndex = index;
    },
    cancelEdit() {
      this.editIndex = "";
    },
    async saveUser(index) {
      if (this.editIndex === index) {
        const editedData = this.userDataList[index];
        if (editedData.group !== this.groupname && this.groupname.length > 0) {
          let response = await visualize.setUserGroup(
            editedData.username,
            this.groupname
          );
          if (response) {
            if (typeof response !== "undefined") {
              this.groupname = "";
              this.sendAlert("successfully saved the data.");
            } else {
              this.sendAlert("could not save group.");
            }
          }
        }
        if (
          editedData.teacher !== this.updatedTeacherName &&
          this.updatedTeacherName.length > 0
        ) {
          let teacherResponse = await visualize.setTeacherByUser(
            editedData.username,
            this.updatedTeacherName
          );
          if (teacherResponse) {
            if (typeof teacherResponse !== "undefined") {
              this.updatedTeacherName = "";
              this.sendAlert("successfully saved the data.");
            } else {
              this.sendAlert("could not save teacher.");
            }
          }
        }
        await this.extractData(this.extractFilter);
        this.editIndex = "";
      } else {
        this.editIndex = "";
        this.sendAlert("cannot save. Retry.");
      }
    },
    async getTeachers() {
      let response = await visualize.getTeacherList();
      if (response.data.length > 0) {
        this.teachers = response.data;
      } else {
        this.userFilter = "";
        this.sendAlert("Cannot find teachers.");
      }
    },
    sendAlert(message) {
      this.cardActive = true;
      this.alertMessage = message;
    },
  },
  mounted() {
    this.emitter.on("close-alert", () => {
      this.cardActive = false;
      this.alertMessage = "";
    });
  },
};
</script>

<style scoped>
div {
  min-height: 0;
}
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
