<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <simulation-panel></simulation-panel>
        <div class="iframe-panel">
          <iframe-loader
            source="https://physdev.c2stem.org"
            iframeid="iframe-id"
            username="naveed"
            projectname="spice-template"
            :embed="true"
          ></iframe-loader>
        </div>
        <div class="left-group">
          <instructions></instructions>
          <button type="button" class="btn btn-primary codeBttn" @click="seeCode">
            See Code
          </button>
        </div>
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
import SimulationPanel from "../components/SimulationPanel.vue";

export default {
  name: "Manipulate View",
  components: {
    IframeLoader,
    Instructions,
    Displaypanel,
    Notes,
    SimulationPanel
  },
  methods: {
    seeCode() {
      this.$router.push("/manipulate/code");
    },
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
  margin: 0 10px 1px 10px;
  height: 400px;
  border: 3px inset #615195;
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

.left-group{
    height: auto;
    display: inline-flex;
    align-items: center;
}
.codeBttn{
    height: fit-content;
}
</style>
