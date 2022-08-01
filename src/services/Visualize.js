export default {
  getData() {
    try {
      var iframe = document.getElementById("iframe-id"),
        ide = iframe.contentWindow.world.children[0];
      var gb = ide.globalVariables;
      var designHistory = gb.getVar("design history");
      var dhContents = designHistory.contents;
      return dhContents;
    } catch (error) {
      alert(error.message);
    }
  },

  drawTable(header, contents) {
    // this.google.charts.load("current", { packages: ["table"] });
    var data = new window.google.visualization.DataTable();
    var dhHeaders = header;

    for (let i = 0; i < dhHeaders.length; i++) {
      if (i == 1 || i == dhHeaders.length -1) {
        data.addColumn("string", dhHeaders[i]);
      } else {
        data.addColumn("number", dhHeaders[i]);
      }
    }
    for (let j = 1; j < (Object.keys(contents).length) + 1; j++) {
      let contentArray = Object.values(contents[j]);
      for (let k = 0; k < contentArray.length; k++) {
        if (k !== 1 && k!== contentArray.length - 1) {
          contentArray[k] = Number(contentArray[k]);
        }else{
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

  drawChart(contents) {
    // this.google.charts.load("current", { packages: ["table"] });
    var data = new window.google.visualization.DataTable();
    var dhHeaders = contents[0].contents;

    for (let i = 0; i < dhHeaders.length; i++) {

        data.addColumn("number", dhHeaders[i]);
      
    }
    for (let j = 1; j < contents.length; j++) {
      let contentArray = contents[j].asArray();
      for (let k = 0; k < contentArray.length; k++) {
        if (k !== 1) {
          contentArray[k] = Number(contentArray[k]);
        }
        else{
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
};
