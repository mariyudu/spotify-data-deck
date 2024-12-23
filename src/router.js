import { createWebHistory, createRouter } from 'vue-router'

import DataDeck from './components/DataDeck.vue'
import ApiCallback from './components/ApiCallback.vue'

const routes = [
  { path: '/', component: DataDeck },
  { path: '/api-callback', component: ApiCallback },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router