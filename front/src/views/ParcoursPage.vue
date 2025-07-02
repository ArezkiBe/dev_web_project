<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mes Parcours</h1>
          <p class="text-gray-600 mt-1">Gérez et suivez vos parcours de formation</p>
        </div>
        
        <Button @click="showCreateModal = true" size="lg" class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouveau parcours
        </Button>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total parcours</dt>
                <dd class="text-lg font-medium text-gray-900">{{ parcoursList.length }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">En cours</dt>
                <dd class="text-lg font-medium text-gray-900">{{ inProgressCount }}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Progression moyenne</dt>
                <dd class="text-lg font-medium text-gray-900">{{ averageProgress }}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un parcours..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select 
            v-model="selectedFilter"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les parcours</option>
            <option value="progress">En cours</option>
            <option value="completed">Terminés</option>
            <option value="not-started">Non commencés</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Chargement des parcours...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <Button @click="fetchParcours" variant="outline">
          Réessayer
        </Button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && filteredParcours.length === 0 && parcoursList.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun parcours</h3>
        <p class="text-gray-600 mb-6">Commencez par créer votre premier parcours de formation</p>
        <Button @click="showCreateModal = true" size="lg">
          Créer mon premier parcours
        </Button>
      </div>

      <!-- No Search Results -->
      <div v-else-if="!loading && filteredParcours.length === 0 && parcoursList.length > 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
        <p class="text-gray-600 mb-4">Aucun parcours ne correspond à votre recherche</p>
        <Button @click="clearFilters" variant="outline">
          Effacer les filtres
        </Button>
      </div>

      <!-- Parcours Grid -->
      <div v-else-if="!loading && filteredParcours.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ParcoursCard
          v-for="parcours in filteredParcours"
          :key="parcours.id"
          :parcours="parcours"
          :module-count="getModuleCount(parcours)"
          :completed-modules="getCompletedModules(parcours)"
          @click="goToParcoursDetail(parcours.id)"
        />
      </div>
    </div>

    <!-- Create Parcours Modal -->
    <CreateParcoursModal
      :open="showCreateModal"
      @update:open="showCreateModal = $event"
      @create="handleCreateParcours"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getParcours, createParcours } from '../services/parcours'
import Button from '../components/ui/Button.vue'
import ParcoursCard from '../components/ParcoursCard.vue'
import CreateParcoursModal from '../components/CreateParcoursModal.vue'

const router = useRouter()

// Data
const parcoursList = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateModal = ref(false)
const searchQuery = ref('')
const selectedFilter = ref('all')

// Computed
const filteredParcours = computed(() => {
  let filtered = parcoursList.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(parcours => 
      parcours.titre.toLowerCase().includes(query) ||
      parcours.description?.toLowerCase().includes(query) ||
      parcours.objectifs?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(parcours => {
      const progress = getProgressPercentage(parcours)
      switch (selectedFilter.value) {
        case 'progress':
          return progress > 0 && progress < 100
        case 'completed':
          return progress === 100
        case 'not-started':
          return progress === 0
        default:
          return true
      }
    })
  }

  return filtered
})

const inProgressCount = computed(() => {
  return parcoursList.value.filter(parcours => {
    const progress = getProgressPercentage(parcours)
    return progress > 0 && progress < 100
  }).length
})

const averageProgress = computed(() => {
  if (parcoursList.value.length === 0) return 0
  const totalProgress = parcoursList.value.reduce((sum, parcours) => {
    return sum + getProgressPercentage(parcours)
  }, 0)
  return Math.round(totalProgress / parcoursList.value.length)
})

// Methods
async function fetchParcours() {
  loading.value = true
  error.value = null
  try {
    parcoursList.value = await getParcours()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function handleCreateParcours(parcoursData) {
  try {
    const created = await createParcours(parcoursData)
    parcoursList.value.push(created)
    showCreateModal.value = false
  } catch (err) {
    console.error('Erreur lors de la création:', err)
  }
}

function goToParcoursDetail(parcoursId) {
  router.push(`/parcours/${parcoursId}`)
}

function clearFilters() {
  searchQuery.value = ''
  selectedFilter.value = 'all'
}

// Helper functions for modules (to be implemented when modules are added)
function getModuleCount(parcours) {
  return parcours.modules?.length || 0
}

function getCompletedModules(parcours) {
  return parcours.modules?.filter(module => module.status === 'completed').length || 0
}

function getProgressPercentage(parcours) {
  const moduleCount = getModuleCount(parcours)
  if (moduleCount === 0) return 0
  const completedModules = getCompletedModules(parcours)
  return Math.round((completedModules / moduleCount) * 100)
}

// Lifecycle
onMounted(fetchParcours)
</script>

<style scoped>
/* Forcer les marges et espacements pour éviter les conflits CSS */
.container {
  margin: 0 auto !important;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.py-8 {
  padding-top: 2rem !important;
  padding-bottom: 2rem !important;
}

.mb-8 {
  margin-bottom: 2rem !important;
}

.mb-6 {
  margin-bottom: 1.5rem !important;
}

.mb-4 {
  margin-bottom: 1rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mt-1 {
  margin-top: 0.25rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.ml-5 {
  margin-left: 1.25rem !important;
}

.ml-4 {
  margin-left: 1rem !important;
}

.gap-6 {
  gap: 1.5rem !important;
}

.gap-4 {
  gap: 1rem !important;
}

.gap-2 {
  gap: 0.5rem !important;
}

.space-x-2 > * + * {
  margin-left: 0.5rem !important;
}

.space-x-4 > * + * {
  margin-left: 1rem !important;
}

.space-x-6 > * + * {
  margin-left: 1.5rem !important;
}

.space-y-1 > * + * {
  margin-top: 0.25rem !important;
}

.space-y-2 > * + * {
  margin-top: 0.5rem !important;
}

/* Responsive */
@media (min-width: 768px) {
  .container {
    max-width: 768px !important;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px !important;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px !important;
  }
}
</style>