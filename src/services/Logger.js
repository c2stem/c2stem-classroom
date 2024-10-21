export default {
  consoleLog(message) {
    var timestamp = new Date()
      .toLocaleString()
      .replace(",", "")
      .replace(/:.. /, " ");
    console.log(timestamp, ":", message);
  },
};
