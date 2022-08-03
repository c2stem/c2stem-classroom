import { createStore } from "vuex";

export default createStore({
  state: {
    design_history: {},
    design_history_length: 0,
    checkedStatus: [],
  },
  mutations: {
    addDesignHistory(state, design) {
      let dh = {};
      design.forEach((element) => {
        dh[element["design"] - 2] = element;
      });
      state.design_history = {
        ...state.design_history,
        ...dh,
      };
      state.design_history_length = design.length;
    },
    addCheckedDesigns(state, checkList) {
      state.checkedStatus = [...state.checkedStatus, ...checkList];
    },
    updateCheckedDesigns(state, data) {
      state.checkedStatus[data.index] = data.status;
    },
  },
  getters: {
    getdhLength(state) {
      return state.design_history_length;
    },
    getDesignHistory(state) {
      return state.design_history;
    },
    getCheckedDesigns(state) {
      return state.checkedStatus;
    },
  },
  actions: {
    addDesignHistory(context, design) {
      context.commit("addDesignHistory", design);
    },
    addCheckedDesigns(context, checkList) {
      context.commit("addCheckedDesigns", checkList);
    },
    updateCheckedDesigns(context, data) {
      context.commit("updateCheckedDesigns", data);
    },
  },
  modules: {},
});
