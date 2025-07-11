import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ConversationsIndexPage from '../views/ConversationsIndexPage.vue'
import ConversationShowPage from '../views/ConversationShowPage.vue'
import ParcoursPage from '../views/ParcoursPage.vue'
import ParcoursDetailPage from '../views/ParcoursDetailPage.vue'

import { useUserStore } from '../stores/user'
import { getActivePinia } from 'pinia'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/parcours',
      name: 'parcours',
      component: ParcoursPage
    },
    {
      path: '/parcours/:id',
      name: 'parcours-detail',
      component: ParcoursDetailPage
    },
    {
      path: '/conversations',
      name: 'conversations',
      component: ConversationsIndexPage
    },
    {
      path: '/conversations/:id',
      name: 'conversation',
      component: ConversationShowPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  const pinia = getActivePinia()
  if (!pinia) return next()

  const userStore = useUserStore(pinia)

  const requiresAuth = to.path.startsWith('/conversations') || to.path.startsWith('/parcours')

  if (requiresAuth && !userStore.user) {
    return next('/')
  }

  next()
})

export default router
