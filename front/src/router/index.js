import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ParcoursPage from '../views/ParcoursPage.vue'
import ParcoursDetailPage from '../views/ParcoursDetailPage.vue'
import CalendarPage from '../views/CalendarPage.vue'

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
      path: '/calendar',
      name: 'calendar',
      component: CalendarPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  const pinia = getActivePinia()
  if (!pinia) return next()

  const userStore = useUserStore(pinia)

  const requiresAuth = to.path.startsWith('/conversations') || to.path.startsWith('/parcours') || to.path.startsWith('/calendar')

  if (requiresAuth && !userStore.user) {
    return next('/')
  }

  next()
})

export default router
