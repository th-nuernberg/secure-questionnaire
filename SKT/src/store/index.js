import { createStore } from 'vuex'

const state = {
  task_data: {},
};

const mutations = {
  ADD_IMAGE(state, payload) {
    //state.images.push(payload);
    //state.images = payload;

    state.task_data[payload['task']] = payload['content']
  }
};

const actions = {
  addImage(context, image) {
    context.commit("ADD_IMAGE", image);
  }
};

const getters = {
  getImages(state) {
    return state.task_data;
  }
};

export default createStore({
  state,
  mutations,
  actions,
  getters
});
