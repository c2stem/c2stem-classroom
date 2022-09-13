/**
 * Visualize service.
 * Methods related to data visualization.
 */
export default {

  async getData(){
    try {
      const iframe = document.getElementById('iframe-id');
      const api = new window.EmbeddedNetsBloxAPI(iframe);
      const gb = await api.getGlobalVariables();
      var designHistory = gb.vars["design history"];
      var dhContents = designHistory.value.contents;
      return this.getObject(dhContents);
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
  getObject(content) {
    let obj = {};
    let header = content[0].contents;
    for (let i = 1; i < Object.keys(content).length; i++) {
      let childObj = {};
      let childContent = content[i].contents;
      for (let j = 0; j < childContent.length; j++) {
        if(j ==1){
          var updatedContent = this.formatDate(childContent[j])
          childObj[header[j]] = updatedContent;
        }else{
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
  formatDate(content){
    var splitContent = content.split(' ');
    var updatedDate = splitContent[1]+' '+splitContent[2]+' '+splitContent[3]+ ' '+splitContent[4]
    return updatedDate;
  }
};
