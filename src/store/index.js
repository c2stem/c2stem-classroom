import { createStore } from "vuex";

export default createStore({
  state: {
    design_history:{},
    design_history_length : 0
  },
  mutations: {
    addDesignHistory(state, design){
        let dh = {}
        design.forEach((element) => {
            dh[element[0] - 1] =   [...element, "false"]
        });
        state.design_history = {
            ...state.design_history, ...dh

        }
        state.design_history_length = design.length;
    }
  },
  getters: {
    getdhLength(state){
        return state.design_history_length;
    },
    getDesignHistory(state){
        return state.design_history;
    }
  },
  actions: {
    addDesignHistory(context, design){
        context.commit('addDesignHistory',design);
    }
  },
  modules: {},
});
