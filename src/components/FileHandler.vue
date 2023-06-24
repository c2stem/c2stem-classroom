<template>
  <input
    class="form-control mb-2"
    type="file"
    id="importedFile"
    :accept="getFileType"
    @change="onFileImported($event)"
  />
  <button type="button" class="btn btn-primary" @click="importFile()">
    ImportFile
  </button>
  <div
    class="modal"
    id="userDataModal"
    tabindex="-1"
    aria-labelledby="userDataModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="userDataModalLabel">Register users</h5>
        </div>
        <div class="modal-body">
          <user-data-table
            :data="fileData"
            :header="dataHeader"
          ></user-data-table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="registerUsers()"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Parser from "../services/Parser";
import { Modal } from "bootstrap";
import UserDataTable from "./UserDataTable.vue";
import Auth from "../services/Auth";
export default {
  name: "FileHandler",
  components: {
    UserDataTable,
  },
  props: {
    fileType: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      importedFile: "",
      fileData: {},
      alertMessage: "",
      dataHeader: [
        "email",
        "username",
        "password",
        "class",
        "role",
        "group",
        "teacher",
      ],
      myModal: "",
    };
  },
  computed: {
    getFileType() {
      let types = "";
      this.fileType.forEach((element) => {
        if (element.includes(".")) {
          types += element + ",";
        } else {
          types += "." + element + ",";
        }
      });
      return types;
    },
  },
  methods: {
    onFileImported(event) {
      const file = event.target.files;
      if (file.length === 0) return;
      this.importedFile = file[0];
    },
    async importFile() {
      if (this.importedFile) {
        try {
          this.fileData = await Parser.parseCSV(this.importedFile);
          if (
            JSON.stringify(Object.keys(this.fileData[0])) !==
            JSON.stringify(this.dataHeader)
          ) {
            this.sendAlert(
              "Header Mismatch: CSV file does not satisfy the requirements."
            );
            return;
          }
          if (this.fileData) {
            this.myModal.show();
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        this.sendAlert("Select a file to be imported.");
      }
    },
    sendAlert(message) {
      this.emitter.emit("alert", { data: message });
    },
    registerUsers() {
      Auth.registerBulkUsers(this.$axios, this.fileData)
        .then(() => {
          this.myModal.hide();
          this.sendAlert("Users have been registered.");
        })
        .catch((error) => {
          this.myModal.hide();
          this.sendAlert(JSON.stringify(error.message) + "..Retry");
        });
    },
  },
  mounted() {
    this.myModal = new Modal(document.getElementById("userDataModal"));
  },
};
</script>

<style scoped>
button {
  float: right;
}
</style>
