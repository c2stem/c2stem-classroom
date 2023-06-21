<template>
  <!-- Login View -->
  <div class="register-card">
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="register">
          <div class="mb-1">
            <h2>Register users in C2STEM</h2>
          </div>
          <div class="mb-1">
            <label for="emailId" class="form-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="emailId"
            />
          </div>
          <div class="row mb-1">
            <div class="col">
              <label for="userNameId" class="form-label">Username</label>
              <input
                v-model="username"
                type="text"
                class="form-control"
                id="userNameId"
              />
            </div>
            <div class="col">
              <label for="passwordId" class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="passwordId"
              />
            </div>
          </div>
          <div class="row mb-1">
            <div class="col">
              <label for="classId" class="form-label">Class</label>
              <select v-model="classname" class="form-select" id="classId">
                <option value="CMISE">CMISE</option>
                <option value="SPICE">SPICE</option>
              </select>
            </div>
            <div class="col">
              <label for="roleId" class="form-label">Role</label>
              <select v-model="role" class="form-select" id="roleId">
                <option value="User">User</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col">
              <label for="groupId" class="form-label">Group</label>
              <select v-model="group" class="form-select" id="groupId">
                <option value="IE">IE</option>
                <option value="EE">EE</option>
                <option value="Construct">Construct</option>
                <option value="All">All</option>
              </select>
            </div>
            <div class="col">
              <label for="teacherId" class="form-label">Teacher</label>
              <input
                type="text"
                v-model="teacher"
                id="teacherId"
                class="form-control"
                data-toggle="tooltip"
                data-placement="right"
                title="Default : 'All'"
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
        <a href="/land">Back to Landing page</a>
      </div>
    </div>
  </div>
  <AlertBox :message="alertMessage" v-if="isActive"></AlertBox>
</template>

<script>
/**
 * Login View
 * @requires ../services/Auth.js that contains method for login.
 */
import auth from "../services/Auth.js";
import AlertBox from "../components/AlertBox.vue";

export default {
  components: {
    AlertBox,
  },
  data() {
    return {
      username: "",
      password: "",
      email: "",
      classname: "",
      role: "",
      cardActive: false,
      alertMessage: "",
      group: "",
      teacher: "",
    };
  },
  computed: {
    isActive() {
      return this.cardActive;
    },
  },
  methods: {
    /**
     * Sends a http request to the server with user credentials.
     * @requires username,password,email,class,role.
     * On successful register provide acknowledgment to the user.
     */
    register() {
      auth
        .register(this.$axios, {
          username: this.username,
          password: this.password,
          email: this.email,
          class: this.classname,
          role: this.role,
          group: this.group,
          teacher: this.teacher,
        })
        .then(() => {
          if (document.getElementById("alertID")) {
            document.getElementById("alertID").style.display = "flex";
          }
          this.cardActive = true;
          this.alertMessage =
            " User: " + this.username + " has been registered.";
        })
        .catch((error) => {
          if (document.getElementById("alertID")) {
            document.getElementById("alertID").style.display = "flex";
          }
          this.cardActive = true;
          this.alertMessage = error;
        });
    },
  },
};
</script>
<style scoped>
.card {
  height: fit-content;
  margin: 20px;
  width: 400px;
}

div {
  min-height: 0;
}

.register-card {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

label {
  margin-bottom: 0 !important;
}
</style>