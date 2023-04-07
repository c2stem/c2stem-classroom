<template>
  <!-- Instructions component -->
  <!-- Instructions in a card with ability to add additional details in a modal -->
  <div class="card overflow-auto">
    <div class="card-body">
      <h5 class="card-title">Instructions</h5>
      <p class="card-text" v-html="renderInstructions" />
      <button
        type="button"
        class="btn btn-link float-end"
        data-bs-toggle="modal"
        data-bs-target="#instructionModal"
      >
        Read More..
      </button>
      <!-- Modal -->
      <div
        class="modal fade"
        id="instructionModal"
        tabindex="-1"
        aria-labelledby="instructionModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="instructionModalLabel">
                Instructions
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" v-html="renderInstructions" />
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
    </div>
  </div>
</template>

<script>
import tempalteEngineering from "../assets/templates/templateEngineering.html";
import tempalteEE from "../assets/templates/templateEE.html";
export default {
  name: "Instructions",
  props: {
    routeName: {
      type: String,
      required: true,
    },
  },
  computed: {
    renderInstructions() {
      switch (this.routeName) {
        case "Engineering":
          return tempalteEngineering;
        case "IE":
          return tempalteEngineering;
        case "EE":
          return tempalteEE;
        default:
          return tempalteEngineering;
      }
    },
  },
};
</script>

<style>
div.modal-content {
  height: auto;
  min-height: 0;
}
.card {
  border: 3px inset #615195;
}
</style>
