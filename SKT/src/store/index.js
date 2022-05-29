import { createStore } from 'vuex'

export default createStore({
  state:{
    task_data: {},
  },
  mutations:{
    ADD_DATA(state, payload) {
      state.task_data[payload['task']] = payload['content']
    }
  },
  actions:{
    addData(context, data) {
      context.commit("ADD_DATA", data);
    }
  },
  getters:{
    getData(state) {
      return state.task_data;
    }
  }
});
