import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alerts: {},
    password: "",
  },
  getters: {},
  mutations: {
    alert(state, payload) {
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setPassword(state, payload) {
      state.password = payload;
    },
  },
  actions: {},
  modules: {},
});
