<template>
  <!-- See Code component -->
  <!-- Display static images of code in a modal based on the project -->
  <button
    type="button"
    class="btn btn-primary codeBttn"
    data-bs-toggle="modal"
    data-bs-target="#seeCode"
    @click="logAction('seeCode')"
  >
    See Code
  </button>
  <div
    class="modal fade"
    id="seeCode"
    tabindex="-1"
    aria-labelledby="seeCodeLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <img src="../assets/cmise-code.png" class="img-fluid" alt="..." />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logger from "../services/Logger";
export default {
  name: "SeeCode",
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    async logAction(actionType) {
      await Logger.logUserActions({
        actionType: actionType,
        actionView: this.currentRouteName,
        args: {},
      });
    },
  },
};
</script>

<style scoped>
.modal-content {
  background-color: rgba(0, 0, 0, 0.0001) !important;
  border: 0;
}
.modal-dialog {
  top: 10%;
  left: 30%;
}
</style>
