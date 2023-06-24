import Papa from "papaparse";
export default {
  parseCSV(filename) {
    return new Promise((resolve, reject) => {
      Papa.parse(filename, {
        delimiter: ",",
        newline: "",
        header: true,
        dynamicTyping: true,
        skipEmptyLines: "greedy",
        complete: (result) => {
          resolve(result.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  },
};
