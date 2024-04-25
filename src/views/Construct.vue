<template>
  <!-- Construct View for CMISE -->
  <div class="container">
    <coding-panel lessonName="Construct"></coding-panel>
    <iframe-loader
      source="https://editor.c2stem.org"
      iframeid="iframe-id"
      username="oele"
      projectname="cmise-project-computational"
      :embed="false"
    ></iframe-loader>
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
              <strong>{{ getModalText }} </strong>
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <button
              v-if="projectLoaded && modalText.includes('Loading')"
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
 * Construct view.
 * In this view User will have access to a C2STEM project in an iframe.
 * Data visualization is available on a button click in modals.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 */
import IframeLoader from "../components/IframeLoader.vue";
import CodingPanel from "../components/CodingSimulationPanel.vue";
import { Modal } from "bootstrap";
// import simulation from "../services/Simulation.js";

export default {
  name: "Construct",
  components: {
    IframeLoader,
    CodingPanel,
  },
  data() {
    return {
      projectName: " cmise-project-computational",
      loading: false,
      loadStatus: false,
      background: "static",
      modalText: "",
    };
  },
  computed: {
    projectLoaded() {
      return this.loadStatus;
    },
    backroundStatus() {
      return this.background;
    },
    getModalText() {
      return this.modalText;
    },
  },
  beforeRouteLeave() {
    const answer = window.confirm(
      "Do you really want to leave? you have unsaved changes!"
    );
    if (!answer) return false;
  },
  methods: {
    saveProject() {
      this.emitter.emit("save-project", { status: true });
    },
    getUser() {
      return sessionStorage.getItem("user");
    },
  },
  mounted() {
    /**
     * Import Google Library.
     */
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const myModal = new Modal(document.getElementById("loadModal"));
    this.modalText = "Loading Project....";
    myModal.show();
    iframe.onload = () => {
      api.addEventListener("projectSaved", () => {
        myModal.hide();
        this.emitter.emit("save-project", { status: true });
      });
      api.addEventListener("action", (e) => {
        if (e.detail.type === "openProject") {
          this.loadStatus = true;
          myModal.hide();
        }
      });
    };
    this.emitter.on("start-saving", (evt) => {
      if (evt.status) {
        this.modalText = "Saving Project....";
        myModal.show();
      }
    });
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  height: 86%;
  padding: 0;
  background-color: #1e1e1e;
}
div {
  min-height: 0;
}
.btn {
  margin-right: 5px;
  margin-left: 5px;
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
