<template>
<!-- Instructions component -->
<!-- Instructions in a card with ability to add additional details in a modal -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Instructions</h5>
      <p class="card-text">
        <ul>
          <li>Click on the green "Run Model" any time you would like to test your model or design.</li>
          <li>Results from each model run are saved in the History tab to the right of the model.</li>
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
              <h5 class="modal-title" id="instructionModalLabel">Instructions</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
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
.card{
  border: 3px inset #615195;
}
</style>
