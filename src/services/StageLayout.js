/**
 * Stage Layout service.
 * Records which material is on each schoolyard tile when a design is run,
 * so the Compare view can redraw that design's stage later (StageRender.js).
 * Layouts are tiny ({ A: "grass", D: "concrete", ... }), are linked to the
 * design history row they belong to, and are saved to the server right away.
 */
import Simulation from "./Simulation";
import Visualize from "./Visualize";
import UserState from "./UserState";
import StageRender from "./StageRender";

/** Material columns of the design history row (tile counts per material). */
const MATERIAL_COLUMNS = [
  "concrete",
  "permeable concrete",
  "grass",
  "wood chips",
  "artificial turf",
  "poured rubber",
  "riparian buffer",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Number of rows in the project's "design history" variable, read without
 * the alert() popups that Visualize uses, because this is polled.
 * @returns {Promise<number>} row count, or -1 if it cannot be read.
 */
async function getDesignRowCount() {
  try {
    const gb = await Visualize.getGlobalVariables();
    const varName = Visualize.getGlobalVariableName(gb, "design history");
    const contents = gb.vars[varName].value.contents;
    return Array.isArray(contents) ? contents.length : -1;
  } catch (error) {
    return -1;
  }
}

/**
 * True when the tile layout has exactly the material counts recorded in the
 * design row. This guards against saving a layout the student changed after
 * running, or a costume swapped by hovering.
 */
function layoutMatchesDesign(materials, design) {
  const tiles = Object.values(materials);
  if (tiles.length === 0) return false;
  let checked = 0;
  for (const column of MATERIAL_COLUMNS) {
    if (design[column] === undefined || design[column] === "") continue;
    const expected = Number(design[column]);
    if (isNaN(expected)) continue;
    const actual = tiles.filter((material) => material === column).length;
    if (actual !== expected) return false;
    checked += 1;
  }
  return checked > 0;
}

export default {
  getDesignRowCount,
  layoutMatchesDesign,

  /**
   * Wait until the design history gains a row (the simulation finished),
   * polling once a second.
   * @param {number} previousCount row count before the run started.
   * @param {number} timeoutMs give up after this long.
   * @returns {Promise<boolean>} true when a new row appeared.
   */
  async waitForNewDesign(previousCount, timeoutMs = 120000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await sleep(1000);
      const count = await getDesignRowCount();
      if (previousCount >= 0 && count > previousCount) return true;
    }
    return false;
  },

  /**
   * Record the current tile layout for the newest design history row.
   * Call right after a run adds a row. Stores the layout in Vuex and saves
   * it to the server.
   * @param {Store} store Vuex store.
   * @param {string} projectName current project name.
   * @returns {Promise<boolean>} true when a layout was recorded.
   */
  async captureLatest(store, projectName) {
    if (!projectName) return false;
    let designs;
    try {
      designs = await Visualize.getData();
    } catch (error) {
      return false;
    }
    const rows = designs ? Object.values(designs) : [];
    if (rows.length === 0) return false;
    const latest = rows[rows.length - 1];
    const designKey = StageRender.designKey(latest);
    if (!designKey) return false;
    if (store.getters.getStageLayouts(projectName)[designKey]) return true;

    let materials;
    try {
      materials = await Simulation.getEngineeringStageMaterials();
    } catch (error) {
      return false;
    }
    if (!materials || !layoutMatchesDesign(materials, latest)) {
      console.warn(
        "Stage layout not recorded: tiles do not match design",
        designKey,
        materials
      );
      return false;
    }

    store.dispatch("setStageLayout", { projectName, designKey, materials });
    try {
      await UserState.saveStageLayout(projectName, designKey, materials);
    } catch (error) {
      console.warn("Could not save stage layout to the server", error);
    }
    return true;
  },
};
