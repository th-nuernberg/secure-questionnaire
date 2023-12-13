import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { createApp, h } from "vue";
import "./style.css";
import App from "./App.vue";
import Vuex from "vuex";
import store from "./store";
import uuid from "vue-uuid";
import { createRouter, createWebHistory } from "vue-router";
import VueQrcodeReader from "vue3-qrcode-reader";
import html2pdf from "html2pdf";
import Vue3Tour from "vue3-tour";
import Selection from "./components/Selection.vue";
import PatientView from "./components/PatientView.vue";
import DoctorView from "./components/DoctorView.vue";
import PatientQuestionnaire from "./components/patientView/PatientQuestionnaire.vue";
import AnalyseQuestionnaires from "./components/doctorView/AnalyseQuestionnaires.vue";
import CreateQuestionnaire from "./components/doctorView/CreateQuestionnaire.vue";
import ViewQuestionnaires from "./components/doctorView/ViewQuestionnaires.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'vue3-tour/dist/vue3-tour.css';

import MockLogin from "./MockComponents/MockLogin.vue";
import MockSelection from "./MockComponents/MockSelection.vue"
import MockCreateQuestionnaire from "./MockComponents/MockDoctorView/MockCreateQuestionnaire.vue";
import MockDoctorView from "./MockComponents/MockDoctorView.vue";

function validateJWTtoken(next) {
  function isAuthenticated() {
    if (!store.getters.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }

  isAuthenticated()

  // TODO: CS: to be implemented; needs something to remove the interval on leaving.. beforeLeave() { clearInterval() }
  // setInterval(function () {
  //   isAuthenticated()
  // }.bind(this), 10000); 
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: "/", 
      name: "Home", 
      component: Login },
    {
      path: "/register",
      name: "Register",
      component: Register,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/select",
      name: "Selection",
      component: Selection,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/doctorView",
      name: "DoctorView",
      component: DoctorView,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/patient",
      name: "PatientView",
      component: PatientView,
    },
    {
      path: "/doctorView/create",
      name: "CreateQuestionnaire",
      component: CreateQuestionnaire,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/doctorView/ViewQuestionnaires",
      name: "ViewQuestionnaires",
      component: ViewQuestionnaires,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/doctorView/analyse",
      name: "AnalyseQuestionnaires",
      component: AnalyseQuestionnaires,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/patient/questionnaire/:id",
      name: "PatientQuestionnaire",
      component: PatientQuestionnaire,
    },
    // Mock routes for guided tour
    {
      path: "/mockLogin",
      name: "MockLogin",
      component: MockLogin,
    },
    {
      path: "/mockSelection",
      name: "MockSelection",
      component: MockSelection,
    },
    {
      path: "/mockCreateQuestionnaire",
      name: "MockCreateQuestionnaire",
      component: MockCreateQuestionnaire,
    },
    {
      path: "/mockDoctorView",
      name: "MockDoctorView",
      component: MockDoctorView,
    },
  ],
});

const app = createApp({
  router,
  render: () => h(App),
  components: { App },
});

app.use(router);
app.use(uuid);
app.use(html2pdf);
app.use(Vue3Tour);
app.use(VueQrcodeReader);
app.use(store);
app.use(Vuex);
app.component("BootstrapIcon", BootstrapIcon);
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
