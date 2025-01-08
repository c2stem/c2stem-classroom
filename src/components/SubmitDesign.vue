<template>
  <button
    type="button"
    class="btn btn-primary codeBttn"
    data-bs-toggle="modal"
    data-bs-target="#submitDesign"
  >
    Submit
  </button>
  <div
    class="modal fade"
    id="submitDesign"
    tabindex="-1"
    aria-labelledby="submitDesignLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="submitDesignLabel">Submit Design</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">Do you want to submit your current design?</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SubmitDesign",
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
