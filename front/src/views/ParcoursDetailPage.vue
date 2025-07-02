<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Chargement du parcours...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <div class="flex justify-center gap-4">
          <Button @click="fetchParcours" variant="outline">
            Réessayer
          </Button>
          <Button @click="goBack" variant="outline">
            Retour aux parcours
          </Button>
        </div>
      </div>

      <!-- Parcours Content -->
      <div v-else-if="parcours">
        <!-- Header with breadcrumb -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <router-link 
                to="/parcours" 
                class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                Mes Parcours
              </router-link>
            </li>
            <li>
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">{{ parcours.titre }}</span>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Parcours Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ parcours.titre }}</h1>
              <p v-if="parcours.description" class="text-gray-600 mb-4">{{ parcours.description }}</p>
              
              <div v-if="parcours.objectifs" class="bg-blue-50 p-4 rounded-lg mb-4">
                <h3 class="font-semibold text-blue-900 mb-2">Objectifs</h3>
                <p class="text-blue-800">{{ parcours.objectifs }}</p>
              </div>
            </div>
            
            <div class="ml-6 flex-shrink-0">
              <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-2 relative">
                  <svg class="w-full h-full" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" stroke-width="3"/>
                    <circle 
                      cx="21" 
                      cy="21" 
                      r="15.915" 
                      fill="transparent" 
                      stroke="#3b82f6" 
                      stroke-width="3"
                      stroke-dasharray="100"
                      :stroke-dashoffset="100 - progressPercentage"
                      stroke-linecap="round"
                      transform="rotate(-90 21 21)"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-lg font-bold text-gray-900">{{ progressPercentage }}%</span>
                  </div>
                </div>
                <p class="text-sm text-gray-600">Progression</p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t pt-4">
            <div class="flex items-center space-x-6 text-sm text-gray-600">
              <span>{{ modules.length }} modules</span>
              <span>{{ completedModulesCount }} terminés</span>
              <span v-if="parcours.createdAt">Créé le {{ formatDate(parcours.createdAt) }}</span>
            </div>
            
            <Button @click="showAddModuleModal = true" class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un module
            </Button>
          </div>
        </div>

        <!-- Modules Section -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold text-gray-900">Modules du parcours</h2>
          </div>

          <!-- Empty State for Modules -->
          <div v-if="modules.length === 0" class="text-center py-12 bg-white rounded-lg border">
            <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun module</h3>
            <p class="text-gray-600 mb-6">Commencez par ajouter des modules à votre parcours</p>
            <Button @click="showAddModuleModal = true" size="lg">
              Ajouter le premier module
            </Button>
          </div>

          <!-- Modules List -->
          <div v-else class="space-y-4">
            <ModuleCard
              v-for="(module, index) in modules"
              :key="module.id"
              :module="module"
              :index="index + 1"
              @toggle-status="toggleModuleStatus"
              @edit="editModule"
              @delete="deleteModule"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Add Module Modal -->
    <AddModuleModal
      :open="showAddModuleModal"
      @update:open="showAddModuleModal = $event"
      @create="handleAddModule"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '../components/ui/Button.vue'
import ModuleCard from '../components/ModuleCard.vue'
import AddModuleModal from '../components/AddModuleModal.vue'

const route = useRoute()
const router = useRouter()

// Data
const parcours = ref(null)
const modules = ref([])
const loading = ref(false)
const error = ref(null)
const showAddModuleModal = ref(false)

// Computed
const progressPercentage = computed(() => {
  if (modules.value.length === 0) return 0
  const completedCount = modules.value.filter(module => module.status === 'completed').length
  return Math.round((completedCount / modules.value.length) * 100)
})

const completedModulesCount = computed(() => {
  return modules.value.filter(module => module.status === 'completed').length
})

// Methods
async function fetchParcours() {
  loading.value = true
  error.value = null
  try {
    // TODO: Remplacer par l'API réelle
    // Pour l'instant, on simule un parcours
    const parcoursId = route.params.id
    parcours.value = {
      id: parcoursId,
      titre: 'Parcours de démonstration',
      description: 'Ceci est un parcours de démonstration pour tester l\'interface',
      objectifs: 'Apprendre à utiliser la plateforme de formation',
      createdAt: new Date().toISOString()
    }
    
    // Modules simulés
    modules.value = [
      {
        id: 1,
        titre: 'Introduction',
        lienExterne: 'https://example.com/intro',
        dateDebut: '2024-01-15',
        dateCible: '2024-01-20',
        status: 'completed'
      },
      {
        id: 2,
        titre: 'Concepts de base',
        lienExterne: 'https://example.com/basics',
        dateDebut: '2024-01-21',
        dateCible: '2024-01-25',
        status: 'in-progress'
      },
      {
        id: 3,
        titre: 'Pratique avancée',
        lienExterne: 'https://example.com/advanced',
        dateDebut: '2024-01-26',
        dateCible: '2024-01-30',
        status: 'not-started'
      }
    ]
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/parcours')
}

function toggleModuleStatus(moduleId) {
  const module = modules.value.find(m => m.id === moduleId)
  if (!module) return
  
  // Cycle through statuses: not-started -> in-progress -> completed -> not-started
  switch (module.status) {
    case 'not-started':
      module.status = 'in-progress'
      break
    case 'in-progress':
      module.status = 'completed'
      break
    case 'completed':
      module.status = 'not-started'
      break
    default:
      module.status = 'not-started'
  }
}

function editModule(moduleId) {
  // TODO: Implémenter l'édition de module
  console.log('Edit module:', moduleId)
}

function deleteModule(moduleId) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
    modules.value = modules.value.filter(m => m.id !== moduleId)
  }
}

function handleAddModule(moduleData) {
  const newModule = {
    id: Date.now(), // Temporary ID
    ...moduleData,
    status: 'not-started'
  }
  modules.value.push(newModule)
  showAddModuleModal.value = false
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

.py-12 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
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

.space-y-6 > * + * {
  margin-top: 1.5rem !important;
}

.space-y-4 > * + * {
  margin-top: 1rem !important;
}

.gap-2 {
  gap: 0.5rem !important;
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