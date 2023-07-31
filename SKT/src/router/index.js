import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/skt",
      name: "SKT",
      component: () => import("../views/SKT.vue"),
    },
    {
      path: "/intro",
      name: "Intro",
      component: () => import("../views/task/intro.vue"),
    },
    {
      path: "/task1",
      name: "Task1",
      component: () => import("../views/task/task1.vue"),
    },
    {
      path: "/task2",
      name: "Task2",
      component: () => import("../views/task/task2.vue"),
    },
    {
      path: "/task3",
      name: "Task3",
      component: () => import("../views/task/task3.vue"),
    },
    {
      path: "/task4",
      name: "Task4",
      component: () => import("../views/task/task4.vue"),
    },
    {
      path: "/task5",
      name: "Task5",
      component: () => import("../views/task/task5.vue"),
    },
    {
      path: "/task6",
      name: "Task6",
      component: () => import("../views/task/task6.vue"),
    },
    {
      path: "/task7",
      name: "Task7",
      component: () => import("../views/task/task7.vue"),
    },
    {
      path: "/lernphase",
      name: "Lernphase",
      component: () => import("../views/task/lernphase.vue"),
    },
    {
      path: "/auswertung",
      name: "Auswertung",
      component: () => import("../views/Auswertung.vue"),
    },
    {
      path: "/vft",
      name: "VFT",
      component: () => import("../views/VFT.vue"),
    },
    {
      path: "/vftintro",
      name: "VFTIntro",
      component: () => import("../views/task/vftintro.vue"),
    },
    {
      path: "/vftrecord",
      name: "VFTRecord",
      component: () => import("../views/task/vftrecord.vue"),
    },
    {
      path: "/vftresults",
      name: "VFTResults",
      component: () => import("../views/task/vftresults.vue"),
    },
    {
      path: "/bnt",
      name: "BNT",
      component: () => import("../views/BNT.vue"),
    },
    {
      path: "/bntintro",
      name: "BNTIntro",
      component: () => import("../views/task/bntintro.vue"),
    },
    {
      path: "/bntperform",
      name: "BNTPerform",
      component: () => import("../views/task/bntperform.vue"),
    },
  ],
});
