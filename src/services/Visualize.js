/**
 * Visualize service.
 * Methods related to data visualization.
 */
export default {
  // Data retrieving methods
  async getGlobalVariables() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const gb = await api.getGlobalVariables();
    return gb;
  },
  async getData() {
    try {
      const gb = await this.getGlobalVariables();
      var designHistory = gb.vars["design history"];
      var dhContents = designHistory.value.contents;
      return this.getObject(dhContents);
    } catch (error) {
      alert(error.message);
    }
  },
  async getTestData(source) {
    try {
      const gb = await this.getGlobalVariables();
      var testHistory = gb.vars["test history"];
      var thContents = testHistory.value.contents;
      /**
       * The switch was created in case a differnt table structure was required for was condition.
       * The feature has been revised but leaving the implementation for future improvements.
       *  */
      switch (source) {
        case "construct":
          return this.getTestObject(thContents);
        case "explore":
          return this.getTestObject(thContents);
        case "manipulate":
          return this.getTestObject(thContents);
        default:
          return this.getTestObject(thContents);
      }
    } catch (error) {
      alert(error.message);
    }
  },

  async getAbsorptionLimit() {
    try {
      const gb = await this.getGlobalVariables();
      var absorptionLimit = gb.vars["absorption-limit"].value;
      return absorptionLimit;
    } catch (error) {
      alert(error.message);
    }
  },

  async getTotalAbsorption() {
    try {
      const gb = await this.getGlobalVariables();
      var totalAbsorption = gb.vars["total absorption amount (inches)"].value;
      return Math.round(totalAbsorption * 10000) / 10000;
    } catch (error) {
      alert(error.message);
    }
  },
  /**
   * Accesses the NetsBloxMorph of C2STEM and extract design history contents.
   * @returns Object representation of Design History from C2STEM.
   */
  getDataOnDomain() {
    try {
      var iframe = document.getElementById("iframe-id"),
        ide = iframe.contentWindow.world.children[0];
      var gb = ide.globalVariables;
      var designHistory = gb.getVar("design history");
      var dhContents = designHistory.contents;
      return this.getObject(dhContents);
    } catch (error) {
      alert(error.message);
    }
  },

  // Data formatting methods
  /**
   * Generate a table using Google library based on the header and content provided.
   * @param {*} header Array consisting the names of attributes from Design History.
   * @param {*} contents List of designs run by the user.
   */
  drawTable(header, contents) {
    var data = new window.google.visualization.DataTable();
    var dhHeaders = header;

    for (let i = 0; i < dhHeaders.length; i++) {
      if (i == 1 || i == dhHeaders.length - 1) {
        data.addColumn("string", dhHeaders[i]);
      } else {
        data.addColumn("number", dhHeaders[i]);
      }
    }
    for (let j = 1; j < Object.keys(contents).length + 1; j++) {
      let contentArray = Object.values(contents[j]);
      for (let k = 0; k < contentArray.length; k++) {
        if (k !== 1 && k !== contentArray.length - 1) {
          contentArray[k] = Number(contentArray[k]);
        } else {
          contentArray[k] = String(contentArray[k]);
        }
      }
      data.addRow(contentArray);
    }
    var table = new window.google.visualization.Table(
      document.getElementById("table")
    );

    table.draw(data, { showRowNumber: true, width: "100%", height: "100%" });
  },

  /**
   * Generate a chart using Google library based on the design content provided.
   * @param {*} contents List of designs run by the user.
   */
  drawChart(header, contents) {
    var data = new window.google.visualization.DataTable();
    var dhHeaders = header;

    for (let i = 0; i < dhHeaders.length; i++) {
      data.addColumn("number", dhHeaders[i]);
    }
    for (let j = 1; j < contents.length; j++) {
      let contentArray = contents[j].asArray();
      for (let k = 0; k < contentArray.length; k++) {
        if (k !== 1) {
          contentArray[k] = Number(contentArray[k]);
        } else {
          contentArray[k] = 0;
        }
      }
      data.addRow(contentArray);
    }
    var options = {
      title: "Design History",
      hAxis: {
        title: "Design Number",
      },
      vAxis: {
        title: "Design Values",
      },
      width: 550,
      height: 400,
    };
    var chart = new window.google.visualization.LineChart(
      document.getElementById("chart")
    );

    chart.draw(data, options);
  },

  /**
   * Converts the existing design history format into an object representation.
   * @param {*} content Design history.
   * @returns An Object representation of the design contents.
   */
  async getObject(content) {
    let obj = {};
    let header = content[0].contents;
    for (let i = 1; i < Object.keys(content).length; i++) {
      let childObj = {};
      let childContent = content[i].contents;
      for (let j = 0; j < childContent.length; j++) {
        if (j == 1) {
          var updatedContent = this.formatDate(childContent[j]);
          childObj[header[j - 1] / header[j]] =
            childContent[j - 1] + ". " + updatedContent; //combining design and date
        } else if (j == 4) {
          const totalAbsorption = await this.getTotalAbsorption();
          childObj["Absorption (inches)"] = totalAbsorption;
          childObj[header[j]] = childContent[j];
        } else if (j != 0) {
          childObj[header[j]] = childContent[j];
        }
      }
      obj[i] = childObj;
    }
    return obj;
  },

  /**
   * Changing date format from 'day mon dd yyyy hh:mm:ss GMT-0500 (Central Daylight Time)'
   * to 'mon dd yyyy hh:mm:ss'
   * @param {*} content Design History
   * @returns date
   */
  formatDate(content) {
    var splitContent = content.split(" ");
    //convert 3 letter month to 2 number representation
    var map_month = this.mapMonths(splitContent[1]);
    if (!map_month) {
      map_month = splitContent[1];
    }
    var updatedDate =
      map_month +
      "/" +
      splitContent[2] +
      "/" +
      splitContent[3].substring(2) +
      " " +
      splitContent[4];
    return updatedDate;
  },

  async getTestObject(content) {
    let obj = {};
    let header = content[0].contents;
    for (let i = 1; i < Object.keys(content).length; i++) {
      let childObj = {};
      let childContent = content[i].contents;
      for (let j = 0; j < childContent.length; j++) {
        if (j == 1) {
          var updatedContent = this.formatDate(childContent[j]);
          childObj[header[j]] = updatedContent;
          // } else if ([4, 5, 6].indexOf(j) > -1) {
          //   childObj[header[j]] = childContent[j];
          // }
        } else if (j == 4) {
          const absorptionLimit = await this.getAbsorptionLimit();
          childObj["Absorption limit(inches)"] = absorptionLimit;
          childObj[header[j]] = childContent[j];
        } else if (j !== 6) {
          childObj[header[j]] = childContent[j];
        }
      }
      obj[i] = childObj;
    }
    return obj;
  },

  mapMonths(month) {
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Sept: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    return monthMap[month];
  },
};
