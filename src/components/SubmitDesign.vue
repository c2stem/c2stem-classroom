<template>
  <button
    type="button"
    class="btn btn-success custom-btn-size"
    data-bs-toggle="modal"
    data-bs-target="#submitDesign"
    @click="logAction('openSubmitModal')"
  >
    Submit
  </button>
  <div
    class="modal fade"
    id="submitDesign"
    data-bs-backdrop="false"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="submitDesignLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="submitDesignLabel">
            {{ getSubmitHeader }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">{{ getSubmitDescription }}</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="logAction('closeSubmitModal')"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="submitDesign">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Simulation from "../services/Simulation";
import { Modal } from "bootstrap";
import Logger from "../services/Logger";
export default {
  name: "SubmitDesign",
  props: {
    designIndex: {
      type: [Number, String],
    },
  },
  data() {
    return {
      enggStageMaterials: {},
      checkedLength: 0,
      favLength: 0,
      submittedDesigns: [],
      myModal: Modal,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    getCheckedDesigns() {
      return this.$store.getters.getCheckedDesigns;
    },
    getFavoriteDesigns() {
      return this.$store.getters.getFavoriteDesigns;
    },
    designHistory() {
      return this.$store.getters.getDesignHistory;
    },
    testHistory() {
      return this.$store.getters.getTestHistory;
    },
    historyLength() {
      return this.$store.getters.getdhLength;
    },
    testHistoryLength() {
      return this.$store.getters.getthLength;
    },
    getSubmitDescription() {
      if (this.currentRouteName === "Engineering") {
        return "Do you want to submit the selected design?";
      } else {
        return "Do you want to submit your current Model?";
      }
    },
    getSubmitHeader() {
      if (this.currentRouteName === "Engineering") {
        return "Submit Design";
      } else {
        return "Submit Model";
      }
    },
    getDHSummary() {
      return this.$store.getters.getDesignHistorySummary;
    },
  },
  methods: {
    async getEnggStageMaterials() {
      this.enggStageMaterials = await Simulation.getEngineeringStageMaterials();
    },
    getASTTreeRoots() {
      return JSON.parse(window.sessionStorage.getItem("treeRoots"));
    },
    getASTBlocks() {
      return JSON.parse(window.sessionStorage.getItem("blocks"));
    },

    async submitDesign() {
      let submitDesign = {};
      if (this.currentRouteName === "Engineering") {
        // if (this.historyLength > 0) {
        //   await this.getEnggStageMaterials();
        //   this.checkedLength = this.getCheckedDesigns.length;
        //   this.favLength = this.getFavoriteDesigns.length;
        //   submitDesign["time"] = Date.now();
        //   submitDesign["checkedStatus"] =
        //     this.getCheckedDesigns[this.checkedLength - 1];
        //   submitDesign["favouriteStatus"] =
        //     this.getFavoriteDesigns[this.favLength - 1];
        //   submitDesign["designHistory"] =
        //     this.designHistory[this.historyLength - 1];
        //   submitDesign["StageMaterials"] = this.enggStageMaterials;
        //   this.$store.dispatch("addSubmittedDesigns", submitDesign);
        // }
        let dhSummary = this.$store.getters.getDesignHistorySummary;
        let selectedDesign = dhSummary[this.designIndex];
        submitDesign = selectedDesign;
        this.$store.dispatch("addSubmittedDesigns", submitDesign);
        await Logger.logUserActions({
          actionType: "submitDesign",
          actionView: this.currentRouteName,
          args: {
            activity: "Engineering",
            submittedDesign: submitDesign,
          },
        });
      } else {
        if (this.testHistoryLength > 0) {
          this.checkedLength = this.getCheckedDesigns.length;
          this.favLength = this.getFavoriteDesigns.length;
          submitDesign["time"] = Date.now();
          submitDesign["checkedStatus"] =
            this.getCheckedDesigns[this.checkedLength - 1];
          submitDesign["favouriteStatus"] =
            this.getFavoriteDesigns[this.favLength - 1];
          submitDesign["testHistory"] =
            this.testHistory[this.testHistoryLength - 1];
          submitDesign["ASTTreeRoots"] = this.getASTTreeRoots();
          submitDesign["ASTBlocks"] = this.getASTBlocks();
          this.$store.dispatch("addSubmittedDesigns", submitDesign);
          await Logger.logUserActions({
            actionType: "submitDesign",
            actionView: this.currentRouteName,
            args: {
              activity: "Computational Modelling",
              submittedDesign: submitDesign,
            },
          });
        }
      }
      this.myModal.hide();
    },
    async logAction(actionType) {
      await Logger.logUserActions({
        actionType: actionType,
        actionView: this.currentRouteName,
        args: {},
      });
    },
  },
  mounted() {
    this.myModal = new Modal(document.getElementById("submitDesign"));
  },
};
</script>
<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  width: 40%;
  margin-top: 10%;
}
.custom-btn-size {
  font-size: large;
}
</style>
