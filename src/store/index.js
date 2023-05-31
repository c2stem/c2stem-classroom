import { createStore } from "vuex";
import axios from "axios";
import userStateService from "@/services/UserState.js";

const store = createStore({
  state: {
    designHistory: {},
    designHistoryLength: 0,
    checkedStatus: [],
    simulationStageImages: [],
    stageImagesLength: 0,
    runSimulation: false,
    user: "",
    testHistory: {},
    testHistoryLength: 0,
    favoriteStatus: [],
  },
  mutations: {
    initializeStorage(state) {
      const localStore = localStorage.getItem("store");
      if (localStore) {
        if (localStorage.getItem("user")) {
          this.replaceState(
            Object.assign(state, JSON.parse(localStorage.getItem("store")))
          );
        }
      }
    },
    /**
     * Adds new tests to the testHistory in the state.
     * @param {state} state Current state of the store.
     * @param {*} test updated test from  C2STEM.
     */
    addTestHistory(state, test) {
      let th = {};
      test.forEach((element) => {
        th[element["test"] - 1] = element;
      });
      state.testHistory = {
        ...state.testHistory,
        ...th,
      };
      state.testHistoryLength = test.length;
    },
    /**
     * Adds new designs to the designHistory in the state.
     * @param {state} state Current state of the store.
     * @param {*} design updated designs from the C2STEM.
     */
    addDesignHistory(state, design) {
      let dh = {};
      design.forEach((element) => {
        dh[state.designHistoryLength] = element;
        state.designHistoryLength += 1;
      });
      state.designHistory = {
        ...state.designHistory,
        ...dh,
      };
      // state.designHistoryLength += design.length;
    },
    /**
     * Add a boolean checkbox status to the checkedStatus List.
     * @param {state} state Current state  of the store.
     * @param {*} checkList List of new checkbox status.
     */
    addCheckedDesigns(state, checkList) {
      state.checkedStatus = [...state.checkedStatus, ...checkList];
    },
    /**
     * Update the state of the checkbox based on the index.
     * @param {state} state Current state of the store.
     * @param {*} data An object with index and status of the checkbox that has been clicked.
     */
    updateCheckedDesigns(state, data) {
      state.checkedStatus[data.index] = data.status;
    },
    /**
     * Add a new stage image to the simulationStageImages List
     * @param {state} state Current state of the store.
     * @param {Image} image stage image after running simulation.
     */
    addStageImage(state, image) {
      state.simulationStageImages.push(image);
    },
    /**
     * Status of green flag.
     * @param {state} state Current state of the store.
     * @param {Boolean} status Boolean value of press green flag.
     */
    updateSimulationStatus(state, status) {
      state.runSimulation = status;
    },
    saveCredentials(state, data) {
      state.user = data.token;
      localStorage.setItem("user", JSON.stringify(data.username));
      localStorage.setItem("userRole", JSON.stringify(data.role));
      localStorage.setItem("userClass", JSON.stringify(data.class));
      localStorage.setItem("userGroup", JSON.stringify(data.group));
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    },
    removeCredentials(state) {
      state.user = null;
      window.localStorage.clear();
      location.reload();
    },
    addFavoriteDesigns(state, favList) {
      state.favoriteStatus = [...state.favoriteStatus, ...favList];
    },
    updateFavoriteDesign(state, data) {
      state.favoriteStatus[data.index] = data.status;
    },
    async updateStore(state, user) {
      let response = await userStateService.gerUserState(
        user.replaceAll('"', "")
      );
      if (response.length == 0) {
        localStorage.setItem("store", JSON.stringify(state));
      } else {
        let newState = state;
        newState.checkedStatus = response[0].checkStatus;
        newState.favoriteStatus = response[0].favoriteStatus;
        localStorage.setItem("store", JSON.stringify(newState));
      }
    },
  },
  getters: {
    /**
     * Get the number of test run by users.
     * @param {state} state
     * @returns testHistoryLength
     */
    getthLength(state) {
      return state.testHistoryLength;
    },
    /**
     * Gets an array of all the tests run by the user.
     * @param {state} state
     * @returns testHistory
     */
    getTestHistory(state) {
      return state.testHistory;
    },
    /**
     * Get the number of test run by users.
     * @param {state} state
     * @returns designHistoryLength
     */
    getdhLength(state) {
      return state.designHistoryLength;
    },
    /**
     * Gets an array of all the designs run by the user.
     * @param {state} state
     * @returns designHistory
     */
    getDesignHistory(state) {
      return state.designHistory;
    },
    /**
     * Get a List of status of all the cehckboxes in the engineering design table.
     * @param {state} state
     * @returns checkedStatus
     */
    getCheckedDesigns(state) {
      return state.checkedStatus;
    },
    /**
     * Get a list of all the stage images from each design run by user.
     * @param {state} state
     * @returns simulationStageImages
     */
    getStageImages(state) {
      return state.simulationStageImages;
    },
    /**
     * Get boolean status of green flag.
     * @param {state} state
     * @returns runSimulation
     */
    getSimulationStatus(state) {
      return state.runSimulation;
    },
    loggedIn(state) {
      return !!state.user;
    },
    getFavoriteDesigns(state) {
      return state.favoriteStatus;
    },
  },
  actions: {
    initializeStorage(context) {
      context.commit("initializeStorage");
    },
    addTestHistory(context, test) {
      context.commit("addTestHistory", test);
    },
    addDesignHistory(context, design) {
      context.commit("addDesignHistory", design);
    },
    addCheckedDesigns(context, checkList) {
      context.commit("addCheckedDesigns", checkList);
    },
    updateCheckedDesigns(context, data) {
      context.commit("updateCheckedDesigns", data);
    },
    addStageImage(context, image) {
      context.commit("addStageImage", image);
    },
    updateSimulationStatus(context, status) {
      context.commit("updateSimulationStatus", status);
    },
    saveCredentials(context, data) {
      context.commit("saveCredentials", data);
    },
    removeCredentials(context) {
      context.commit("removeCredentials");
    },
    addFavoriteDesigns(context, favList) {
      context.commit("addFavoriteDesigns", favList);
    },
    updateFavoriteDesign(context, data) {
      context.commit("updateFavoriteDesign", data);
    },
    updateStore(context, newStateData) {
      context.commit("updateStore", newStateData);
    },
  },
  modules: {},
  // plugins: [vuexLocal.plugin],
});

store.subscribe((mutation, state) => {
  // Store the state object as a JSON string
  localStorage.setItem("store", JSON.stringify(state));
});

export default store;
