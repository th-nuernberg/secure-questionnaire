import {createApp, h} from 'vue'
import Vuex from "vuex"

import { Buffer } from "buffer"
globalThis.Buffer = Buffer;


import App from "./App.vue"

import store from "./store"
import uuid from "vue-uuid"
import { createRouter, createWebHistory } from "vue-router"

import html2pdf from "html2pdf"

import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"

import "bootstrap/dist/js/bootstrap.js"

import Selection from "./components/Selection.vue"
import RespondView from "./components/RespondView.vue"
import AggregateView from "./components/AggregateView.vue"
import Questionnaire from "./components/respond/Questionnaire.vue"
import Analyze from "./components/admin/Analyze.vue"
import Create from "./components/admin/Create.vue"
import List from "./components/admin/List.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import BootstrapIcon from "@dvuckovic/vue3-bootstrap-icons"


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
  history: createWebHistory('/sq'),
  base: '/sq',
  routes: [
    { 
      path: "/", 
      name: "Home", 
      component: Login
    },
    {
      path: "/respond",
      name: "RespondView",
      component: RespondView,
    },
    {
      path: "/respond/:id",
      name: "Questionnaire",
      component: Questionnaire,
    },
    {
      path: "/admin",
      name: "Selection",
      component: Selection,
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
      name: "Create",
      component: Create,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/list",
      name: "List",
      component: List,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/aggregate",
      name: "AggregateView",
      component: AggregateView,
      beforeEnter(to, from, next) { validateJWTtoken(next) },
    },
    {
      path: "/admin/analyze",
      name: "Analyze",
      component: Analyze,
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


