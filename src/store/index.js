import { createStore } from "vuex";

export default createStore({
  state: {
    design_history: {},
    design_history_length: 0,
    checkedStatus: [],
    simulationStageImages: [],
    runSimulation: false,
    cmise_group: '',
    test_history: {},
    test_history_length: 0,
  },
  mutations: {
    /**
     * Adds new tests to the test_history in the state. 
     * @param {state} state Current state of the store.
     * @param {*} test updated test from  C2STEM.
     */
     addTestHistory(state, test) {
      let th = {};
      test.forEach((element) => {
        th[element["test"] - 1] = element;
      });
      state.test_history = {
        ...state.test_history,
        ...th,
      };
      state.test_history_length = test.length;
    },
    /**
     * Adds new designs to the design_history in the state. 
     * @param {state} state Current state of the store.
     * @param {*} design updated designs from the C2STEM.
     */
    addDesignHistory(state, design) {
      let dh = {};
      design.forEach((element) => {
        dh[state.design_history_length] = element;
      });
      state.design_history = {
        ...state.design_history,
        ...dh,
      };
      state.design_history_length += design.length;
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
    updateSimulationStatus(state, status){
      state.runSimulation = status;
    },
    /**
     * Status of green flag.
     * @param {state} state Current state of the store. 
     * @param {Boolean} newGroup CMISE group selected for view. 
     */
    changeGroup(state, { newGroup }) {
      state.cmise_group = newGroup;
      console.log(state.cmise_group);
    }
  },
  getters: {
    /**
     * Get the number of test run by users.
     * @param {state} state 
     * @returns test_history_length
     */
     getthLength(state) {
      return state.test_history_length;
    },
    /**
     * Gets an array of all the tests run by the user.
     * @param {state} state 
     * @returns test_history
     */
    getTestHistory(state) {
      return state.test_history;
    },
    /**
     * Get the number of test run by users.
     * @param {state} state 
     * @returns design_history_length
     */
    getdhLength(state) {
      return state.design_history_length;
    },
    /**
     * Gets an array of all the designs run by the user.
     * @param {state} state 
     * @returns design_history
     */
    getDesignHistory(state) {
      return state.design_history;
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
    getSimulationStatus(state){
      return state.runSimulation;
    }
  },
  actions: {
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
    updateSimulationStatus(context, status){
      context.commit("updateSimulationStatus", status);
    }
  },
  modules: {},
});
