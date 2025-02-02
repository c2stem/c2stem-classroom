/**
 * Visualize service.
 * Methods related to data visualization.
 */
import axiosInstance from "./Axios";
export default {
  // Data retrieving methods
  /**
   * Method to retreive global variables from the NetsBlox project.
   * @returns a VariableFrame object from NetsBlox that contains global variables
   */
  async getGlobalVariables() {
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    return await api.getGlobalVariables();
  },
  /**
   * Method to get the accurate keys of all the global variable names to retrieve respective values.
   * @param {object} gb a VariableFrame object from NetsBlox that contains global variables
   * @param {string} name global variable search name
   * @returns Accurate key of the global variable from the NetsBlox project.
   */
  getGlobalVariableName(gb, name) {
    var globalVariableList = Object.keys(gb.vars);
    switch (name) {
      case "absorption limit":
        return globalVariableList.find(
          (element) =>
            element.includes("absorption") && element.includes("limit")
        );
      case "total absorption":
        return globalVariableList.find(
          (element) =>
            element.includes("total") && element.includes("absorption")
        );
      case "design history":
        return globalVariableList.find(
          (element) => element.includes("design") && element.includes("history")
        );
      case "test history":
        return globalVariableList.find(
          (element) => element.includes("test") && element.includes("history")
        );
      default:
        break;
    }
  },
  /**
   * Method to get design history table global variable from the project.
   * @returns an array of design history table contents.
   */
  async getData() {
    try {
      const gb = await this.getGlobalVariables();
      const varName = this.getGlobalVariableName(gb, "design history");
      var designHistory = gb.vars[varName];
      var dhContents = designHistory.value.contents;
      return this.getObject(dhContents);
    } catch (error) {
      alert(error.message);
    }
  },
  /**
   * Method to get Test history table global variable from the project.
   * @param {string} source name of the condition [construct, explore, manipulate]
   * @returns an array of the test history table contents.
   */
  async getTestData(source) {
    try {
      const gb = await this.getGlobalVariables();
      const varName = this.getGlobalVariableName(gb, "test history");
      var testHistory = gb.vars[varName];
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
  /**
   * Method to get absorption limit global variable from the NetsBox project.
   * @returns absorption limit in number.
   */
  async getAbsorptionLimit() {
    try {
      const gb = await this.getGlobalVariables();
      const varName = this.getGlobalVariableName(gb, "absorption limit");
      return gb.vars[varName].value;
    } catch (error) {
      alert(error.message);
    }
  },
  /**
   * Method to get total absorption global variable from the NetsBox project.
   * @returns total absorption in number.
   */
  async getTotalAbsorption() {
    try {
      const gb = await this.getGlobalVariables();
      const varName = this.getGlobalVariableName(gb, "total absorption");
      var totalAbsorption = gb.vars[varName].value;
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
      const iframe = document.getElementById("iframe-id"),
        ide = iframe.contentWindow.world.children[0];
      const gb = ide.globalVariables;
      const designHistory = gb.getVar("design history");
      const dhContents = designHistory.contents;
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
    const data = new window.google.visualization.DataTable();
    const dhHeaders = header;

    for (let i = 0; i < dhHeaders.length; i++) {
      if (i === 1 || i === dhHeaders.length - 1) {
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
    const table = new window.google.visualization.Table(
      document.getElementById("table")
    );

    table.draw(data, { showRowNumber: true, width: "100%", height: "100%" });
  },

  /**
   * Generate a chart using Google library based on the design content provided.
   * @param header
   * @param {*} contents List of designs run by the user.
   */
  drawChart(header, contents) {
    const data = new window.google.visualization.DataTable();
    const dhHeaders = header;

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
    const options = {
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
    const chart = new window.google.visualization.LineChart(
      document.getElementById("chart")
    );

    chart.draw(data, options);
  },

  /**
   * Converts the existing design history format into an object representation.
   * @param {*} content Design history.
   * @returns An Object representation of the design contents.
   */
  /** 2025-update
   * changing the order for the SPICe 2025 study.
   * The current order is
   *  design, data, cost, rainfall, absorption limit, runoff, accessible squares, (rest of the materials).
   * */
  async getObject(content) {
    let obj = {};
    let header = content[0].contents;
    for (let i = 1; i < Object.keys(content).length; i++) {
      let childObj = {};
      let childContent = content[i].contents;
      for (let j = 0; j < childContent.length; j++) {
        if (j === 1) {
          const updatedContent = this.formatDate(childContent[j]);
          childObj[header[j - 1] / header[j]] =
            childContent[j - 1] + ". " + updatedContent; //combining design and date
        } else if (j === 2) {
          childObj[header[j]] = Number(childContent[j]).toLocaleString(
            "en-US",
            { style: "currency", currency: "USD", maximumFractionDigits: 0 }
          );
          // 2025-update
          // } else if (j === 3) {
          //   childObj[header[j + 1]] = childContent[j + 1];
          //   childObj[header[j + 2]] = childContent[j + 2];
          //   childObj[header[j]] = childContent[j];
        } else if (j === 4) {
          if (header.includes("absorption limit")) {
            let absorption = parseFloat(childContent[j + 8]).toFixed(4);
            childObj["Absorption (inches)"] = String(absorption);
            childObj[header[j]] = childContent[j];
          } else {
            childObj["Absorption (inches)"] = await this.getTotalAbsorption();
            childObj[header[j]] = childContent[j];
          }
        } else if (j !== 0 && j !== 12 && j !== 5) {
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
    const splitContent = content.split(" ");
    //convert 3 letter month to 2 number representation
    let map_month = this.mapMonths(splitContent[1]);
    if (!map_month) {
      map_month = splitContent[1];
    }
    const updatedDate =
      map_month +
      "/" +
      splitContent[2] +
      "/" +
      splitContent[3].substring(2) +
      " " +
      splitContent[4];
    return updatedDate;
  },
  /**
   * Converts the existing test history format into an object representation.
   * @param {*} content Test History
   * @returns An Object representation of the test contents.
   */
  async getTestObject(content) {
    let obj = {};
    let header = content[0].contents;
    for (let i = 1; i < Object.keys(content).length; i++) {
      let childObj = {};
      let childContent = content[i].contents;
      for (let j = 0; j < childContent.length; j++) {
        if (j === 1) {
          const updatedContent = this.formatDate(childContent[j]);
          childObj[header[j]] = updatedContent;
          // } else if ([4, 5, 6].indexOf(j) > -1) {
          //   childObj[header[j]] = childContent[j];
          // }
        } else if (j === 4) {
          childObj[header[7]] = childContent[7];
          childObj[header[j]] = childContent[j];
        } else if (j !== 6 && j !== 7) {
          childObj[header[j]] = childContent[j];
        }
      }
      obj[i] = childObj;
    }
    return obj;
  },
  /**
   * Method to change the string month representation to the numerical representation.
   * @param {string} month a string key to retrieve a assigned value.
   * @returns a numerical representation of the month.
   */
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

  async getUsersByClass(className) {
    try {
      return await axiosInstance.get("user/getUsersByClass/" + className, {
        withCredentials: true,
      });
    } catch (error) {
      return error;
    }
  },

  async setUserGroup(username, groupName) {
    try {
      return await axiosInstance.post("user/setUserGroup", {
        username: username,
        group: groupName,
      });
    } catch (error) {
      return error;
    }
  },

  async getTeacherList() {
    try {
      return await axiosInstance.get("user/getTeachers");
    } catch (error) {
      return error;
    }
  },

  async getUsersByTeacher(teacherName) {
    try {
      return await axiosInstance.get("user/getUsersByTeacher/" + teacherName, {
        withCredentials: true,
      });
    } catch (error) {
      return error;
    }
  },

  async setTeacherByUser(username, teacherName) {
    try {
      return await axiosInstance.post("user/setTeacherByUser", {
        username: username,
        teacher: teacherName,
      });
    } catch (error) {
      return error;
    }
  },

  /**
   * Check if the format fits the 2025 SPICe requirement.
   * */
  isDesignFormatted(designHistory) {
    const index = Object.keys(designHistory[0]).indexOf("rainfall");
    return index === 2;
  },

  /**
   * If the format does not fit the SPICe 2025 study requirement. Then change the format.
   * */
  changeDesignFormat(designHistory) {
    let header = [
      "design/date",
      "cost",
      "rainfall",
      "absorption",
      "runoff",
      "concrete",
      "permeable concrete",
      "grass",
      "wood chips",
      "artificial turf",
      "poured rubber",
    ];

    let obj = {};
    for (let i = 0; i < Object.keys(designHistory).length; i++) {
      let childObj = {};
      for (let j = 0; j < header.length; j++) {
        if (j === 0) {
          childObj[header[j]] = designHistory[i][NaN];
        } else if (header[j].includes("absorption")) {
          childObj[header[j]] = designHistory[i]["Absorption (inches)"];
        } else {
          childObj[header[j]] = designHistory[i][header[j]];
        }
      }
      obj[i] = childObj;
    }
    return obj;
  },
};
