<template>
  <!-- Instructions component -->
  <!-- Instructions in a card with ability to add additional details in a modal -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instructions</h5>
      <p class="card-text">
        <ul>
          <li>Complete your design prototype by selecting materials for all
        non-building squares. To do so, click on a square and select the
        material for that square from the options that pop-up.</li>
          <li>When you are ready to test your design, click on "Test Design."</li>
          <li> You will
        be asked to "how much did it rain (in inches)?" In the textbox, inserts
        a value for rainfall in inches (such as 1, 1.2, 2, or another number
        value).</li>
          <li>Click the checkmark next to the textbox to check your design.</li>
        </ul> 
        </p>
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
            <div class="modal-body">
              <ul>
          <li>Complete your design prototype by selecting materials for all
        non-building squares. To do so, click on a square and select the
        material for that square from the options that pop-up.</li>
          <li>When you are ready to test your design, click on "Test Design."</li>
          <li> You will
        be asked to "how much did it rain (in inches)?" In the textbox, inserts
        a value for rainfall in inches (such as 1, 1.2, 2, or another number
        value).</li>
          <li>Click the checkmark next to the textbox to check your design.</li>
        </ul> 
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
    </div>
  </div>
</template>

<style>
div.modal-content {
  height: auto;
  min-height: 0;
}
.card {
  border: 3px inset #615195;
}
</style>
