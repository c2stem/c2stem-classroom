<template>
  <input
    class="form-control mb-2"
    type="file"
    id="importedFile"
    accept=".csv"
    @change="onFileImported($event)"
  />
  <button type="button" class="btn btn-primary" @click="importFile()">
    ImportFile
  </button>
</template>

<script>
import Papa from "papaparse";
export default {
  name: "csvHandler",
  data() {
    return {
      importedFile: "",
      fileData: "",
    };
  },
  methods: {
    onFileImported(event) {
      const file = event.target.files;
      if (file.length === 0) return;
      this.importedFile = file[0];
    },
    importFile() {
      Papa.parse(this.importedFile, {
        delimiter: ",",
        newline: "",
        header: false,
        dynamicTyping: true,
        skipEmptyLines: "greedy",
        complete: (result) => {
          this.fileData = result.data;
          console.log(this.fileData);
        },
      });
    },
  },
};
</script>

<style scoped>
button {
  float: right;
}
</style>
