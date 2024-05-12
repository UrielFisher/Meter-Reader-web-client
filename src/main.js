import './assets/main.css'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import Home from './views/home.vue'
import Camera from './views/camera.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/camera', component: Camera },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

createApp(App).use(router).mount('#app')
