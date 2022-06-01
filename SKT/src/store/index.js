import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'


const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

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
  },
  plugins: [vuexLocal.plugin]
});
