import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ConversationsIndexPage from '../views/ConversationsIndexPage.vue'
import ConversationShowPage from '../views/ConversationShowPage.vue'


import { useUserStore } from '../stores/user'
import { getActivePinia } from 'pinia'

const routes = [
  { path: '/', component: HomePage },
  { path: '/conversations', component: ConversationsIndexPage },
  { path: '/conversations/:id', component: ConversationShowPage }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const pinia = getActivePinia()
  if (!pinia) return next()

  const userStore = useUserStore(pinia)

  const requiresAuth = to.path.startsWith('/conversations')

  if (requiresAuth && !userStore.user) {
    return next('/')
  }

  next()
})

export default router
