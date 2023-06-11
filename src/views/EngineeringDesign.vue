<template>
  <!-- Engineering Design View -->
  <div class="container">
    <div class="row">
      <div class="col">
        <engineering-simulation-panel />
        <div class="iframe-panel">
          <iframe-loader
            source="https://editor.c2stem.org"
            iframeid="iframe-id"
            username="oele"
            projectname="cmise-project-engineering"
            :embed="true"
          ></iframe-loader>
        </div>
      </div>
      <div class="col">
        <div class="right-panel mt-4">
          <engineering-display-panel></engineering-display-panel>
        </div>
      </div>
    </div>
    <div
      class="modal show"
      id="loadModal"
      :data-bs-backdrop="backroundStatus"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <strong>Loading Project... </strong>
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <button
              v-if="projectLoaded"
              type="button"
              class="btn btn-secondary ms-5"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Engineering Design view.
 * Similar to manipulate view customized for engineering design with compare feature.
 * In this view user will have access to a C2STEM project in an iframe.
 * Instruction panel is available with resources.
 * Display panel has data visualization from C2STEM data.
 * The green flag is available to run scripts from outside of iframe.
 * A See code button to access the code of the project.
 * A compare tabs allows for design comparison.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 * @requires ../components/Instructions.vue to present resources to users.
 * @requires ../components/EngineeringDisplayPanel.vue for data visualization and comparison.
 * @requires ../components/SimulationPanel.vue for the green flag.
 */
import IframeLoader from "../components/IframeLoader.vue";
import EngineeringDisplayPanel from "../components/EngineeringDisplayPanel.vue";
import EngineeringSimulationPanel from "../components/EngineeringSimulationPanel.vue";
import { Modal } from "bootstrap";

export default {
  name: "Engineering",
  components: {
    IframeLoader,
    EngineeringDisplayPanel,
    EngineeringSimulationPanel,
  },
  data() {
    return {
      loadStatus: false,
      background: "static",
    };
  },
  computed: {
    projectLoaded() {
      return this.loadStatus;
    },
    backroundStatus() {
      return this.background;
    }
  },
  methods: {
    saveProject() {
      this.emitter.emit("save-project", { status: true });
    },
    getUser() {
      return localStorage.getItem("user");
    },
  },
  mounted() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const myModal = new Modal(document.getElementById("loadModal"));
    myModal.show();
    iframe.onload = () => {
      api.addEventListener("projectSaved", this.saveProject);
      api.addEventListener("action", (e)=>{
        if (e.detail.type === "openProject") {
        this.loadStatus = true;
        myModal.hide();
      }
      });
    };
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

.left-group {
  height: auto;
  display: inline-flex;
  align-items: center;
}
.codeBttn {
  height: fit-content;
}
.modal-body {
  display: flex;
  justify-content: center;
}
.modal-dialog {
  display: flex;
  align-items: center;
}
.modal-content {
  background-color: rgba(0, 0, 0, 0.0001) !important;
  border: 0;
}
strong {
  font-size: x-large;
  color: aliceblue;
}
</style>
