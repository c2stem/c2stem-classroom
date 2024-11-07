<template>
  <button
    type="button"
    class="btn btn-secondary btn-lg me-3"
    data-bs-toggle="modal"
    data-bs-target="#ResetModal"
    aria-hidden="true"
  >
    AST
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
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <AST></AST>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AST from "../views/visualize/AST.vue";
export default {
  name: "ASTViewer",
  components: { AST },
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
