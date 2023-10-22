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
import Home from "./components/Home.vue";
import PatientView from "./components/PatientView.vue";
import DoctorView from "./components/DoctorView.vue";
import PatientQuestionnaire from "./components/patientView/PatientQuestionnaire.vue";
import AnalyseQuestionnaires from "./components/doctorView/AnalyseQuestionnaires.vue";
import CreateQuestionnaire from "./components/doctorView/CreateQuestionnaire.vue";
import ViewQuestionnaires from "./components/doctorView/ViewQuestionnaires.vue";
import Login from "./components/Login.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons";

function validateJWTtoken(next) {
  function isAuthenticated() {
    if (!store.getters.isAuthenticated) {
      next('/login')
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
    { path: "/", name: "Home", component: Home },
    {
      path: "/login",
      name: "Login",
      component: Login
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
app.use(VueQrcodeReader);
app.use(store);
app.use(Vuex);
app.component("BootstrapIcon", BootstrapIcon);
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
