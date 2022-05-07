import { createStore } from 'vuex'

const state = {
  images: []
};

const mutations = {
  ADD_IMAGE(state, payload) {
    state.images.push(payload);
  }
};

const actions = {
  addImage(context, image) {
    context.commit("ADD_IMAGE", image);
  }
};

const getters = {
  getImages(state) {
    return state.images;
  }
};

export default createStore({
  state,
  mutations,
  actions,
  getters
});
