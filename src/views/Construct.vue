<template>
  <!-- Construct View for CMISE -->
  <div class="container">
    <coding-panel lessonName="Construct"></coding-panel>
    <iframe-loader
      source="https://editor.c2stem.org"
      iframeid="iframe-id"
      username="oele"
      projectname="meigs-project-computational-temporal"
      :embed="false"
    ></iframe-loader>
    <div
      class="modal show"
      id="loadModal"
      :data-bs-backdrop="backroundStatus"
      data-bs-keyboard="false"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <div>
              <strong>Loading Project... </strong>
              <div class="spinner-border text-light" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <button
              v-if="projectLoaded"
              type="button"
              class="btn btn-secondary ms-5"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <div class="fab-stack">
      <button class="fab-btn" @click="openPanel('table')" title="Test History Table">
        <i class="bi bi-table"></i>
      </button>
      <button class="fab-btn" @click="openPanel('chart')" title="Test History Chart">
        <i class="bi bi-graph-up"></i>
      </button>
    </div>

    <!-- Floating Table Panel -->
    <div
      v-if="panelOpen.table"
      class="float-panel"
      :style="panelStyle('table')"
      ref="tablePanel"
      @mousedown="focusPanel('table')"
    >
      <div class="float-panel-header" @mousedown="startDrag($event, 'table')">
        <span class="float-panel-title">Hourly Test History</span>
        <button class="float-close-btn" @click.stop="closePanel('table')">&times;</button>
      </div>
      <div class="float-panel-body">
        <p v-if="!hourlyRows.length" class="float-empty">
          No test data available. Run a test first.
        </p>
        <table v-else class="float-table">
          <thead>
            <tr>
              <th>Time (hours)</th>
              <th>Total Rainfall (in)</th>
              <th>Total Absorption (in)</th>
              <th>Total Runoff (in)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in hourlyRows" :key="i">
              <td>{{ row['Time (hours)'] }}</td>
              <td>{{ row['Total Rainfall (in)'] }}</td>
              <td>{{ row['Total Absorption (in)'] }}</td>
              <td>{{ row['Total Runoff (in)'] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Floating Chart Panel -->
    <div
      v-if="panelOpen.chart"
      class="float-panel"
      :style="panelStyle('chart')"
      ref="chartPanel"
      @mousedown="focusPanel('chart')"
    >
      <div class="float-panel-header" @mousedown="startDrag($event, 'chart')">
        <span class="float-panel-title">Hourly Test Chart</span>
        <button class="float-close-btn" @click.stop="closePanel('chart')">&times;</button>
      </div>
      <div class="float-panel-body float-chart-body" id="construct-float-chart"></div>
    </div>
  </div>
</template>

<script>
/**
 * Construct view.
 * In this view User will have access to a C2STEM project in an iframe.
 * Data visualization is available on a button click in modals.
 * @requires ../components/IframeLoader.vue to display a c2stem environment in an iframe.
 */
import IframeLoader from "../components/IframeLoader.vue";
import CodingPanel from "../components/CodingSimulationPanel.vue";
import ASTController from "../services/AST/ASTController";
import Visualize from "../services/Visualize";
import { Modal } from "bootstrap";

export default {
  name: "Construct",
  components: {
    IframeLoader,
    CodingPanel,
  },
  data() {
    return {
      projectName: " cmise-project-computational",
      loading: false,
      loadStatus: false,
      background: "static",
      panelOpen: { table: false, chart: false },
      panelPos: {
        table: { x: 60, y: 60 },
        chart: { x: 80, y: 80 },
      },
      dragState: null,
      hourlyTableData: {},
      pollInterval: null,
      focusedPanel: null,
    };
  },
  computed: {
    projectLoaded() {
      return this.loadStatus;
    },
    backroundStatus() {
      return this.background;
    },
    hourlyRows() {
      return Object.values(this.hourlyTableData);
    },
  },
  watch: {
    hourlyRows(newRows) {
      if (this.panelOpen.chart && newRows.length) {
        this.$nextTick(() => this.drawFloatChart());
      }
    },
  },
  methods: {
    saveProject() {
      this.emitter.emit("save-project", { status: true });
    },
    getUser() {
      return sessionStorage.getItem("user");
    },
    panelStyle(key) {
      return {
        left: this.panelPos[key].x + "px",
        top: this.panelPos[key].y + "px",
        zIndex: this.focusedPanel === key ? 1070 : 1060,
      };
    },
    focusPanel(key) {
      this.focusedPanel = key;
    },
    async openPanel(key) {
      if (this.panelOpen[key]) {
        this.panelOpen[key] = false;
        if (!this.panelOpen.table && !this.panelOpen.chart) this.stopPolling();
        return;
      }
      this.panelOpen[key] = true;
      this.focusedPanel = key;
      const data = await Visualize.getInquiryHourlyData();
      if (data) this.hourlyTableData = data;
      if (key === "chart") {
        this.$nextTick(() => {
          window.google.charts.setOnLoadCallback(() => this.drawFloatChart());
        });
      }
      this.startPolling();
    },
    closePanel(key) {
      this.panelOpen[key] = false;
      if (!this.panelOpen.table && !this.panelOpen.chart) this.stopPolling();
    },
    startPolling() {
      if (this.pollInterval) return;
      this.pollInterval = setInterval(async () => {
        const data = await Visualize.getInquiryHourlyData();
        if (data) this.hourlyTableData = data;
      }, 3000);
    },
    stopPolling() {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    },
    startDrag(e, key) {
      e.preventDefault();
      const startX = e.clientX - this.panelPos[key].x;
      const startY = e.clientY - this.panelPos[key].y;
      this.dragState = { key, startX, startY };
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.endDrag);
    },
    onDrag(e) {
      if (!this.dragState) return;
      const { key, startX, startY } = this.dragState;
      this.panelPos[key] = {
        x: e.clientX - startX,
        y: e.clientY - startY,
      };
    },
    endDrag() {
      this.dragState = null;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.endDrag);
    },
    drawFloatChart() {
      const el = document.getElementById("construct-float-chart");
      if (!el || !window.google?.visualization) return;
      const rows = this.hourlyRows;
      if (!rows.length) {
        el.innerHTML = '<p style="color:#888;font-style:italic;padding:12px;font-size:0.88rem;">No test data available. Run a test first.</p>';
        return;
      }
      const keys = Object.keys(rows[0]);
      const [timeKey, rainfallKey, absorptionKey, runoffKey] = keys;
      const data = new window.google.visualization.DataTable();
      data.addColumn("number", "Time (hours)");
      data.addColumn("number", "Rainfall (in)");
      data.addColumn("number", "Absorption (in)");
      data.addColumn("number", "Runoff (in)");
      data.addRow([0, 0, 0, 0]);
      rows.forEach((row) => {
        data.addRow([
          Number(row[timeKey]),
          Number(row[rainfallKey]),
          Number(row[absorptionKey]),
          Number(row[runoffKey]),
        ]);
      });
      const maxTime = Math.max(...rows.map((r) => Number(r[timeKey])));
      const hTicks = Array.from({ length: maxTime + 1 }, (_, i) => i);
      const w = el.offsetWidth || 680;
      const options = {
        hAxis: { title: "Time (hours)", minValue: 0, ticks: hTicks, titleTextStyle: { italic: false } },
        vAxis: { title: "Amount of Water (inches)", minValue: 0, titleTextStyle: { italic: false } },
        series: {
          0: { color: "#0d6efd" },
          1: { color: "#198754" },
          2: { color: "#dc3545" },
        },
        legend: { position: "top" },
        chartArea: { left: 70, top: 45, width: "75%", height: "65%" },
        width: w,
        height: 320,
      };
      new window.google.visualization.LineChart(el).draw(data, options);
    },
  },
  mounted() {
    window.google.charts.load("current", {
      packages: ["table", "corechart", "line"],
    });
    const astController = new ASTController(
      "blocks",
      "treeRoots",
      "actionList"
    );
    const iframe = document.getElementById("iframe-id");
    const api = new window.EmbeddedNetsBloxAPI(iframe);
    const myModal = new Modal(document.getElementById("loadModal"));
    myModal.show();
    iframe.onload = () => {
      api.addEventListener("projectSaved", this.saveProject);
      api.addEventListener("action", (e) => {
        if (e.detail.type === "openProject") {
          this.loadStatus = true;
          myModal.hide();
        } else {
          astController.actionListener(e.detail);
        }
      });
    };
  },
  beforeUnmount() {
    this.stopPolling();
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.endDrag);
  },
};
</script>

<style scoped>
.container {
  max-width: 100%;
  height: 86%;
  padding: 0;
  background-color: #1e1e1e;
}
div {
  min-height: 0;
}
.btn {
  margin-right: 5px;
  margin-left: 5px;
}
.modal-body {
  display: flex;
  justify-content: center;
}
.modal-dialog {
  display: flex;
  align-items: center;
}

.modal-content {
  background-color: rgba(0, 0, 0, 0.0001) !important;
  border: 0;
}

strong {
  font-size: x-large;
  color: aliceblue;
}

/* FABs */
.fab-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1050;
  justify-content: flex-end;
}

.fab-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #7a6aab;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 8px 2px rgba(180, 150, 255, 0.8), 0 4px 14px rgba(0, 0, 0, 0.35);
  transition: background 0.15s, box-shadow 0.15s;
}

.fab-btn:hover {
  background: #6a5a9b;
  box-shadow: 0 0 14px 4px rgba(180, 150, 255, 1), 0 4px 14px rgba(0, 0, 0, 0.35);
}

/* Floating panels */
.float-panel {
  position: fixed;
  width: 720px;
  height: 420px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
  resize: both;
  overflow: hidden;
  min-width: 400px;
  min-height: 240px;
}

.float-panel-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #7a6aab;
  color: #fff;
  padding: 0 14px;
  border-radius: 8px 8px 0 0;
  cursor: grab;
  user-select: none;
  box-sizing: border-box;
}

.float-panel-header:active {
  cursor: grabbing;
}

.float-panel-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.float-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.float-close-btn:hover {
  color: #ffc0c0;
}

.float-panel-body {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: 8px;
  box-sizing: border-box;
}

.float-chart-body {
  padding: 0;
  overflow: hidden;
}

#construct-float-chart {
  display: block;
  width: 100%;
}

.float-empty {
  color: #888;
  font-style: italic;
  font-size: 0.88rem;
  margin: 0;
}

.float-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.float-table th {
  background: #f0f4ff;
  color: #7a6aab;
  font-weight: 700;
  padding: 6px 8px;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
  position: sticky;
  top: 0;
}

.float-table td {
  padding: 5px 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  white-space: nowrap;
}

.float-table tbody tr:hover {
  background: #f8f9fa;
}
</style>
