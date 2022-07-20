<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="iframe-panel">
          <iframe-loader
            source="https://physdev.c2stem.org"
            iframeid="iframe-id"
            username="naveed"
            projectname="spice-template"
            :embed="true"
          ></iframe-loader>
        </div>
        <instructions></instructions>
      </div>
      <div class="col">
        <div class="right-panel mt-5">
          <displaypanel></displaypanel>
          <notes></notes>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IframeLoader from "../components/IframeLoader.vue";
import Instructions from "../components/Instructions.vue";
import Displaypanel from "../components/DisplayPanel.vue";
import Notes from "../components/Notes.vue";

export default {
  components: {
    IframeLoader,
    Instructions,
    Displaypanel,
    Notes,
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  max-height: 80%;
  display: grid;
}
div {
  min-height: 0;
}
.iframe-panel {
  margin: 10px;
  height: 400px;
}
.card {
  margin: 10px;
}
.right-panel {
  height: 70%;
}
.notes-panel {
  height: 30%;
  display: flex;
}
</style>
