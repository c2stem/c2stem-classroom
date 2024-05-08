<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Extract users by teacher:</h5>
          <div class="filterCard">
            <label for="teacherId" class="form-label">Select a teacher: </label>
            <select
              v-model="teacherName"
              class="form-select"
              aria-label="select"
              id="teacherId"
              @change="extractData()"
            >
              <option
                v-for="(teacher, index) in Teachers"
                :key="index"
                :value="teacher"
              >
                {{ teacher }}
              </option>
            </select>
          </div>
          <div v-if="getTeacherName.length > 0" class="filterCard">
            <label for="classId" class="form-label">Filter by group: </label>
            <select
              v-model="groupName"
              class="form-select"
              aria-label="select"
              id="groupId"
            >
              <option value="IE">IE</option>
              <option value="EE">EE</option>
              <option value="Construct">Construct</option>
              <option value="All">All</option>
            </select>
            <button
              type="button"
              class="btn btn-primary btn-md me-3"
              @click="filterUsers(groupName)"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="filteredUserData.length">
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
          <tr v-for="(userDataItems, index) in filteredUserData" :key="index">
            <td v-for="(item, itemIndex) in userDataItems" :key="itemIndex">
              {{ item }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import visualize from "../../services/Visualize";
import simulationService from "../../services/Simulation";

export default {
  name: "DashboardProjects",
  data() {
    return {
      userDataList: [],
      userDataHeader: ["Username", "Group", "Teacher", "Projects"],
      filteredUserDataList: [],
      teachers: [],
      teacherName: "",
      updatedTeacherName: "",
      extractFilter: "",
      groupName: "",
    };
  },
  computed: {
    Teachers() {
      return this.teachers;
    },
    getTeacherName() {
      return this.teacherName;
    },
    userData() {
      return this.userDataList;
    },
    filteredUserData() {
      return this.filteredUserDataList;
    },
  },
  methods: {
    async getTeachers() {
      let response = await visualize.getTeacherList();
      if (response.data.length > 0) {
        this.teachers = response.data;
      } else {
        //send error alert
      }
    },
    async extractData() {
      let response = await visualize.getUsersByTeacher(this.teacherName);
      if (response.status >= 200 && response.status < 300) {
        if (this.userDataList.length) {
          this.userDataList = [];
        }
        if (response.data.length) {
          response.data.forEach(async (element) => {
            let a = {};
            a["username"] = element.username;
            a["group"] = element.group;
            a["teacher"] = element.teacher;
            a["projects"] = await simulationService.getProjectListByUser(
              element.username
            );
            this.userDataList.push(a);
          });
        } else {
          //send error alert
        }
      } else {
        //send error alert
      }
    },

    async filterUsers(groupFilter) {
      this.filteredUserDataList = this.userDataList.filter(
        (x) => x.group === groupFilter
      );
    },
  },
  mounted() {
    this.getTeachers();
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
