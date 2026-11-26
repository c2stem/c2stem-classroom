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
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <img
            src="../assets/UVA-code.png"
            class="code-img"
            alt="Code snippet"
            data-bs-dismiss="modal"
          />
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
  max-width: 80vw;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
.modal-body {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}
.code-img {
  display: block;
  max-width: 80vw;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  cursor: pointer;
}
</style>
