import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import Home from './views/home.vue'
import Camera from './views/camera.vue'
import SumUp from './views/sumUp.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/camera/:type([we])?/:name?',
    name: 'Camera',
    component: Camera
  },
  {
    path: '/sumup/:name',
    name: 'SumUp',
    component: SumUp
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

const pinia = createPinia()

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
