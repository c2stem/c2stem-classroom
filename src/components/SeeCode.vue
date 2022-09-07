<template>
<!-- See Code component -->
<!-- Display static images of code in a modal based on the project -->
  <button type="button" class="btn btn-primary codeBttn" data-bs-toggle="modal" data-bs-target="#seeCode">
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
            <img src="../assets/cmise-code.png" class="img-fluid" alt="...">
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
export default {
    name: "SeeCode",
}
</script>

<style scoped>
.modal-content {
    background-color: rgba(0,0,0,.0001) !important;
    border: 0;
}
</style>