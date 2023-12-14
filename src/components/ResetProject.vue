<template>
  <button
    type="button"
    class="btn btn-secondary btn-lg me-3"
    data-bs-toggle="modal"
    data-bs-target="#ResetModal"
    aria-hidden="true"
  >
    Reset
  </button>
  <div
    class="modal fade"
    id="ResetModal"
    data-bs-backdrop="false"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="ResetModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ResetModalLabel">
            Please enter your credentials to reset the project:
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="row g-3" @submit.prevent="resetProject">
            <div class="col-md-6">
              <label for="usernameId" class="form-label">Username</label>
              <input
                v-model="username"
                type="text"
                class="form-control"
                id="usernameId"
              />
            </div>
            <div class="col-md-6">
              <label for="passwordId" class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="passwordId"
              />
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-primary">Reset</button>
            </div>
          </form>
          <AlertBox :message="alertMessage" v-if="isActive"></AlertBox>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "../services/Auth.js";
import simulationService from "../services/Simulation.js";
import AlertBox from "../components/AlertBox.vue";
export default {
  name: "ResetProject",
  components: {
    AlertBox,
  },
  data() {
    return {
      username: "",
      password: "",
      allowedRoles: ["admin", "teacher"],
      cardActive: false,
      alertMessage: "",
    };
  },
  props: {
    projectName: {
      type: String,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.cardActive;
    },
  },
  methods: {
    resetProject() {
      Auth.login({ username: this.username, password: this.password })
        .then(({ data }) => {
          let role = JSON.stringify(data.role)
            .toLowerCase()
            .replace(/["]+/g, "");
          if (this.allowedRoles.includes(role)) {
            simulationService
              .deleteProjectByName(this.projectName)
              .then((response) => {
                if (response) {
                  simulationService
                    .projectExists(this.projectName)
                    .then((response) => {
                      if (response) {
                        this.cardActive = true;
                        this.alertMessage = "Reset failed try again";
                      } else {
                        this.cardActive = true;
                        this.alertMessage = "Reset successful";
                        this.$router.go();
                      }
                    });
                } else {
                  this.cardActive = true;
                  this.alertMessage = "Reset failed: Could not reset";
                }
              });
          } else {
            this.cardActive = true;
            this.alertMessage = "Reset failed: No access";
          }
        })
        .catch((err) => {
          this.cardActive = true;
          this.alertMessage = JSON.stringify(err.message);
        });
    },
  },
  mounted() {
    this.emitter.on("alert", (evt) => {
      if (evt.data) {
        if (document.getElementById("alertID")) {
          document.getElementById("alertText").innerText = evt.data;
          document.getElementById("alertID").style.display = "flex";
        } else {
          this.alertMessage = evt.data;
          this.cardActive = true;
        }
      }
    });
    this.emitter.on("close-alert", () => {
      this.cardActive = false;
      this.alertMessage = "";
    });
  },
};
</script>
<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  width: 40%;
}
</style>
