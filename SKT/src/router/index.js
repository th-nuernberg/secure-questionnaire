import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/SKT',
    name: 'SKT',
    component: () => import('../views/SKT.vue')
  },
  {
    path: '/intro',
    name: 'Intro',
    component: () => import('../views/task/intro.vue')
  },
  {
    path: '/task1',
    name: 'Task1',
    component: () => import('../views/task/task1.vue')
  },
  {
    path: '/task2',
    name: 'Task2',
    component: () => import('../views/task/task2.vue')
  },
  {
    path: '/task3',
    name: 'Task3',
    component: () => import('../views/task/task3.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
