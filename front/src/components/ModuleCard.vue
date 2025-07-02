<template>
  <Card class="relative transition-all duration-200 hover:shadow-md">
    <div class="flex items-start gap-4">
      <!-- Module Number and Status -->
      <div class="flex-shrink-0">
        <div class="flex items-center justify-center w-12 h-12 rounded-full" :class="statusBadgeClass">
          <span v-if="module.status === 'completed'" class="text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </span>
          <span v-else-if="module.status === 'in-progress'" class="text-white font-semibold">
            {{ index }}
          </span>
          <span v-else class="text-gray-500 font-semibold">
            {{ index }}
          </span>
        </div>
      </div>

      <!-- Module Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ module.titre }}</h3>
            
            <!-- Status Badge -->
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3" :class="statusTextClass">
              {{ statusText }}
            </span>

            <!-- Link -->
            <div v-if="module.lienExterne" class="mb-3">
              <a 
                :href="module.lienExterne" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Accéder au contenu
              </a>
            </div>

            <!-- Dates -->
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <div v-if="module.dateDebut" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Début: {{ formatDate(module.dateDebut) }}
              </div>
              <div v-if="module.dateCible" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Échéance: {{ formatDate(module.dateCible) }}
                <span v-if="isOverdue" class="ml-1 text-red-500 font-medium">(en retard)</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-2 ml-4">
            <Button 
              @click="$emit('toggle-status', module.id)" 
              variant="outline" 
              size="sm"
              :class="statusButtonClass"
            >
              {{ statusButtonText }}
            </Button>
            
            <div class="relative">
              <Button 
                @click="showDropdown = !showDropdown"
                variant="ghost" 
                size="sm"
                class="p-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                </svg>
              </Button>
              
              <!-- Dropdown Menu -->
              <div v-if="showDropdown" 
                   class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                   @click="showDropdown = false"
              >
                <button 
                  @click="$emit('edit', module.id)"
                  class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Modifier
                </button>
                <button 
                  @click="$emit('delete', module.id)"
                  class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'

const props = defineProps({
  module: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

defineEmits(['toggle-status', 'edit', 'delete'])

const showDropdown = ref(false)

const statusBadgeClass = computed(() => {
  switch (props.module.status) {
    case 'completed':
      return 'bg-green-500'
    case 'in-progress':
      return 'bg-blue-500'
    default:
      return 'bg-gray-300'
  }
})

const statusTextClass = computed(() => {
  switch (props.module.status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const statusText = computed(() => {
  switch (props.module.status) {
    case 'completed':
      return 'Terminé'
    case 'in-progress':
      return 'En cours'
    default:
      return 'À faire'
  }
})

const statusButtonClass = computed(() => {
  switch (props.module.status) {
    case 'completed':
      return 'border-green-300 text-green-700 hover:bg-green-50'
    case 'in-progress':
      return 'border-blue-300 text-blue-700 hover:bg-blue-50'
    default:
      return 'border-gray-300 text-gray-700 hover:bg-gray-50'
  }
})

const statusButtonText = computed(() => {
  switch (props.module.status) {
    case 'completed':
      return 'Recommencer'
    case 'in-progress':
      return 'Terminer'
    default:
      return 'Commencer'
  }
})

const isOverdue = computed(() => {
  if (!props.module.dateCible) return false
  const targetDate = new Date(props.module.dateCible)
  const today = new Date()
  return today > targetDate && props.module.status !== 'completed'
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 