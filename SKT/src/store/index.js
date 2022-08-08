import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'


const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({
  state:{
    task_data: {'audio':{}},
  },
  mutations:{
    ADD_DATA(state, payload) {
      state.task_data[payload['task']] = payload['content']
    },
    ADD_AUDIO(state,payload){
      state.task_data['audio'][payload['task']] = payload['content']
    }
  },
  actions:{
    addData(context, data) {
      context.commit("ADD_DATA", data);
    },
    addAudio(context, data){
      context.commit("ADD_AUDIO", data)
    }
  },
  getters:{
    getData(state) {
      return state.task_data;
    }
  },
  plugins: [vuexLocal.plugin]
});
