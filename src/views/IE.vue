<template>
  <!--IE view for CMISE-->
  <div class="container">
    <coding-panel :lessonName="name"></coding-panel>
    <iframe-loader
      :source="source"
      iframeid="iframe-id"
      :username="userID"
      :projectname="projectName"
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
 * IE view.
 * In this view User will have access to a C2STEM project in an iframe.
 * test data is available in a table on a button click in modals.
 *
 */
import IframeLoader from "../components/IframeLoader.vue";
import CodingPanel from "../components/CodingSimulationPanel.vue";
import { Modal } from "bootstrap";

export default {
  name: "IE",
  components: {
    IframeLoader,
    CodingPanel,
  },
  data() {
    return {
      name: this.$route.params.name,
      userID: this.$route.params.userID,
      projectName: this.$route.params.projectName,
      source: this.$route.params.source,
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
  methods: {
    saveProject() {
      this.emitter.emit("save-project", { status: true });
    },
    getUser() {
      return sessionStorage.getItem("user");
    },
  },
  mounted() {
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
@media (max-height: 768px) {
  .container {
    height: 84%;
  }
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
