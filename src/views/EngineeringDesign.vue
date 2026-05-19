<template>
  <!-- Engineering Design View -->
  <div class="container">
    <div class="ed-row">
      <div class="sim-col" :class="{ 'sim-col-shrink': tableExpanded }">
        <engineering-simulation-panel :rainfall-rate="rainfallRate" :rainfall-duration="rainfallDuration" />
        <div v-if="containsRouteParams" class="iframe-panel">
          <iframe-loader
            :source="source"
            iframeid="iframe-id"
            :username="userID"
            :projectname="projectName"
            :embed="true"
          ></iframe-loader>
        </div>
        <div v-else class="iframe-panel">
          <iframe-loader
            source="https://editor.c2stem.org"
            iframeid="iframe-id"
            username="oele"
            projectname="spice-project-ED-gamification-DH"
            :embed="true"
          ></iframe-loader>
        </div>

        <div class="sim-sliders">
          <div class="slider-row">
            <div class="slider-label-row">
              <label class="slider-label">Rainfall rate (inch/hour)</label>
              <span class="slider-value-badge">{{ rainfallRate }} inch/hr</span>
            </div>
            <div class="slider-track">
              <span class="slider-min">0.1</span>
              <input type="range" class="form-range" v-model.number="rainfallRate"
                     min="0.1" max="3.0" step="0.1" @change="onSliderChange" />
              <span class="slider-max">3.0</span>
            </div>
          </div>
          <div class="slider-row">
            <div class="slider-label-row">
              <label class="slider-label">Rainfall duration (hours)</label>
              <span class="slider-value-badge">{{ rainfallDuration }} hr{{ rainfallDuration !== 1 ? 's' : '' }}</span>
            </div>
            <div class="slider-track">
              <span class="slider-min">1</span>
              <input type="range" class="form-range" v-model.number="rainfallDuration"
                     min="1" max="12" step="1" @change="onSliderChange" />
              <span class="slider-max">12</span>
            </div>
          </div>
        </div>
      </div>
      <div class="display-col" :class="{ 'display-col-expanded': tableExpanded }">
        <div class="right-panel mt-4">
          <engineering-display-panel />
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
import Simulation from "../services/Simulation";
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
      name: this.$route.params.name,
      userID: this.$route.params.userID,
      projectName: this.$route.params.projectName,
      source: this.$route.params.source,
      loadStatus: false,
      background: "static",
      projectSaved: true,
      rainfallRate: 0.1,
      rainfallDuration: 1,
      tableExpanded: false,
    };
  },
  computed: {
    projectLoaded() {
      return this.loadStatus;
    },
    backroundStatus() {
      return this.background;
    },
    containsRouteParams() {
      return !!this.$route.params.name;
    },
  },
  methods: {
    saveProject() {
      this.projectSaved = true;
      this.emitter.emit("save-project", { status: true });
    },
    getUser() {
      return sessionStorage.getItem("user");
    },
    onSliderChange() {
      Simulation.setVariable("rainfallRate", this.rainfallRate);
      Simulation.setVariable("rainfallDuration", this.rainfallDuration);
    },
  },
  // beforeRouteLeave(to, from, next) {
  //   if (this.projectSaved) {
  //     next();
  //   } else {
  //     const answer = window.confirm(
  //       "Do you really want to leave? you have unsaved changes!"
  //     );
  //     if (answer) {
  //       next();
  //     } else {
  //       next(false);
  //     }
  //   }
  // },
  mounted() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const myModal = new Modal(document.getElementById("loadModal"));
    myModal.show();
    this.emitter.on("update-data", (evt) => {
      if (evt.status) {
        this.projectSaved = false;
      }
    });
    this.emitter.on("display-tab-change", (tab) => {
      this.tableExpanded = tab === "history";
    });
    iframe.onload = () => {
      api.addEventListener("projectSaved", this.saveProject);
      api.addEventListener("action", (e) => {
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
.ed-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
}
.sim-col {
  flex: 0 0 40%;
  min-width: 0;
  transition: flex-basis 0.25s ease;
}
.sim-col.sim-col-shrink {
  flex: 0 0 auto;
}
.display-col {
  flex: 0 0 60%;
  min-width: 0;
  overflow: auto;
  transition: flex 0.25s ease;
}
.display-col.display-col-expanded {
  flex: 1 1 auto;
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
.sim-sliders {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  margin: 4px 10px 0 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
  height: auto;
  resize: horizontal;
  overflow: hidden;
}
.slider-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.slider-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.slider-label {
  font-size: 0.85rem;
  font-weight: 500;
}
.slider-track {
  display: flex;
  align-items: center;
  gap: 6px;
}
.slider-min,
.slider-max {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}
.slider-value-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0d6efd;
  background-color: #e7f0ff;
  border: 1px solid #b6d0ff;
  border-radius: 4px;
  padding: 1px 7px;
  white-space: nowrap;
}
</style>
