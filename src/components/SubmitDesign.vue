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
        <table
          v-if="currentRouteName === 'Engineering'"
          class="table table-hover table-bordered"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Cost</th>
              <th>Rainfall</th>
              <th>Absorption</th>
              <th>Runoff</th>
              <th>concrete</th>
              <th>permeable concrete</th>
              <th>grass</th>
              <th>wood chips</th>
              <th>artificial turf</th>
              <th>poured rubber</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                v-for="(item, i) in getDHSummary"
                :key="i"
                class="table-success"
              >
                {{ item }}
              </td>
            </tr>
          </tbody>
        </table>
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
      if (this.currentRouteName === "Engineering") {
        let dhs = this.$store.getters.getDesignHistorySummary;
        if (dhs) {
          return dhs[this.designIndex].designHistory;
        } else {
          return [];
        }
      }
      return [];
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
        let dhSummary = this.$store.getters.getDesignHistorySummary;
        submitDesign = dhSummary[this.designIndex];
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
  width: fit-content;
  margin-top: 10%;
}
.modal-content {
  width: fit-content;
}
.custom-btn-size {
  font-size: large;
}
th,
td {
  text-align: center;
  vertical-align: middle;
}
</style>
