<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">{{ greeting }} - Tableau de bord</h2>
      <button 
        @click="refreshDashboard"
        class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        :disabled="isLoading"
      >
        <svg class="w-5 h-5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </button>
    </div>
    
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      <span class="ml-3 text-gray-600">Chargement des données...</span>
    </div>

    <div v-else-if="userStore.user" class="space-y-6">
      <div class="mb-6">
        <div class="flex items-center p-4 rounded-lg"
             :class="getMotivationalClass(motivationalMessage.type)">
          <div class="flex-shrink-0">
            <svg v-if="motivationalMessage.type === 'success'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg v-else-if="motivationalMessage.type === 'warning'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <svg v-else class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="font-medium" v-html="motivationalMessage.message"></p>
            <p class="text-sm mt-1 opacity-75" v-html="motivationalMessage.suggestion"></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-emerald-800">Parcours</p>
              <p class="text-2xl font-semibold text-emerald-900">{{ dashboardData.totalParcours }}</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-800">Modules</p>
              <p class="text-2xl font-semibold text-blue-900">{{ dashboardData.totalModules }}</p>
            </div>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-yellow-800">En cours</p>
              <p class="text-2xl font-semibold text-yellow-900">{{ dashboardData.modulesInProgress }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-800">Terminés</p>
              <p class="text-2xl font-semibold text-green-900">{{ dashboardData.modulesCompleted }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Progression générale</h3>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-emerald-500 h-3 rounded-full transition-all duration-300"
            :style="{ width: `${dashboardData.overallProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          {{ dashboardData.overallProgress }}% des modules terminés
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Parcours récents</h3>
          <div v-if="dashboardData.recentParcours.length === 0" class="text-gray-500 text-sm">
            Aucun parcours trouvé. Créez votre premier parcours !
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="parcours in dashboardData.recentParcours" 
              :key="parcours.id"
              class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              @click="$router.push(`/parcours/${parcours.id}`)"
            >
              <h4 class="font-medium text-gray-800">{{ parcours.titre }}</h4>
              <p class="text-sm text-gray-600 mt-1">
                {{ parcours.modules?.length || 0 }} modules
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Prochaines échéances</h3>
          <div v-if="analytics.upcomingDeadlines.length === 0" class="text-gray-500 text-sm">
            Aucune échéance prochaine. Vous êtes à jour !
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="deadline in analytics.upcomingDeadlines" 
              :key="deadline.id"
              class="p-3 rounded-lg border-l-4"
              :class="getDeadlineClass(deadline.daysUntilDeadline)"
            >
              <h4 class="font-medium text-gray-800">{{ deadline.titre }}</h4>
              <p class="text-sm text-gray-600 mt-1">
                Parcours: {{ deadline.parcoursTitre }}
              </p>
              <div class="flex items-center mt-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusClass(deadline.statut)">
                  {{ getStatusText(deadline.statut) }}
                </span>
                <span class="ml-2 text-xs font-medium"
                      :class="getDeadlineTextClass(deadline.daysUntilDeadline)">
                  {{ getDeadlineText(deadline.daysUntilDeadline) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <MiniCalendar :parcours="parcours" />
      </div>

      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            @click="$emit('openCreateParcours')"
            class="p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Nouveau parcours
          </button>
          
          <router-link 
            to="/parcours"
            class="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Voir tous les parcours
          </router-link>
          
          <router-link 
            to="/calendar"
            class="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Calendrier
          </router-link>
          
          <button 
            @click="refreshDashboard"
            class="p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-gray-700 mb-2">Authentification requise</h3>
      <p class="text-gray-600">Connectez-vous pour voir votre tableau de bord personnalisé</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { getParcours } from '../services/parcours'
import { calculateAnalytics, getMotivationalMessage, getTimeBasedGreeting } from '../services/analytics'
import MiniCalendar from './MiniCalendar.vue'

const userStore = useUserStore()
const isLoading = ref(true)
const parcours = ref([])

defineEmits(['openCreateParcours'])

const analytics = computed(() => {
  return calculateAnalytics(parcours.value)
})

const motivationalMessage = computed(() => {
  return getMotivationalMessage(analytics.value)
})

const greeting = computed(() => {
  return getTimeBasedGreeting()
})

const dashboardData = computed(() => {
  const allModules = parcours.value.flatMap(p => p.modules || [])
  
  const totalParcours = parcours.value.length
  const totalModules = allModules.length
  const modulesInProgress = allModules.filter(m => m.statut === 'in-progress').length
  const modulesCompleted = allModules.filter(m => m.statut === 'completed').length
  const modulesNotStarted = allModules.filter(m => m.statut === 'not-started').length
  
  const overallProgress = totalModules > 0 ? Math.round((modulesCompleted / totalModules) * 100) : 0
  
  const recentParcours = parcours.value.slice(0, 3)
  
  const nextTasks = allModules
    .filter(m => m.statut !== 'completed')
    .sort((a, b) => {
      if (a.dateCible && b.dateCible) {
        return new Date(a.dateCible) - new Date(b.dateCible)
      }
      if (a.dateCible) return -1
      if (b.dateCible) return 1
      return 0
    })
    .slice(0, 5)
  
  return {
    totalParcours,
    totalModules,
    modulesInProgress,
    modulesCompleted,
    modulesNotStarted,
    overallProgress,
    recentParcours,
    nextTasks
  }
})

async function loadDashboardData() {
  if (!userStore.user) {
    isLoading.value = false
    return
  }
  
  try {
    isLoading.value = true
    const data = await getParcours()
    parcours.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    parcours.value = []
  } finally {
    isLoading.value = false
  }
}

async function refreshDashboard() {
  await loadDashboardData()
}

function getStatusClass(status) {
  const classes = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return classes[status] || classes['not-started']
}

function getStatusText(status) {
  const texts = {
    'not-started': 'À faire',
    'in-progress': 'En cours',
    'completed': 'Terminé'
  }
  return texts[status] || 'À faire'
}

function getMotivationalClass(type) {
  const classes = {
    'success': 'bg-green-50 border border-green-200 text-green-800',
    'warning': 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    'info': 'bg-blue-50 border border-blue-200 text-blue-800'
  }
  return classes[type] || classes['info']
}

function getDeadlineClass(days) {
  if (days === 0) return 'border-red-400 bg-red-50'
  if (days === 1) return 'border-orange-400 bg-orange-50'
  if (days <= 3) return 'border-yellow-400 bg-yellow-50'
  return 'border-blue-400 bg-blue-50'
}

function getDeadlineTextClass(days) {
  if (days === 0) return 'text-red-600'
  if (days === 1) return 'text-orange-600'
  if (days <= 3) return 'text-yellow-600'
  return 'text-blue-600'
}

function getDeadlineText(days) {
  if (days === 0) return 'Échéance aujourd\'hui !'
  if (days === 1) return 'Échéance demain'
  return `Dans ${days} jours`
}

onMounted(() => {
  loadDashboardData()
})
</script>
