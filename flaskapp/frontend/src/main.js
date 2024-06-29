import { Buffer } from "buffer";
globalThis.Buffer = Buffer;
import { createApp, h } from "vue";
import "./style.css";
import App from "./App.vue";
import Vuex from "vuex";
import store from "./store";
import uuid from "vue-uuid";
import { createRouter, createWebHistory } from "vue-router";
import html2pdf from "html2pdf";
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
      component: Login
    },
    {
      path: "/participate",
      name: "PatientView",
      component: PatientView,
    },
    {
      path: "/participate/:id",
      name: "PatientQuestionnaire",
      component: PatientQuestionnaire,
    },
    {
      path: "/admin/",
      name: "Selection",
      component: "Selection",
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/retrieve",
      name: "DoctorView",
      component: DoctorView,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/register",
      name: "Register",
      component: Register,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/create",
      name: "CreateQuestionnaire",
      component: CreateQuestionnaire,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/list",
      name: "ViewQuestionnaires",
      component: ViewQuestionnaires,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/analyse",
      name: "AnalyseQuestionnaires",
      component: AnalyseQuestionnaires,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
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
app.use(store);
app.use(Vuex);
app.component("BootstrapIcon", BootstrapIcon);
app.mount("#app");
import "bootstrap/dist/js/bootstrap.js";
