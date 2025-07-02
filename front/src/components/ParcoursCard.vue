<template>
  <Card 
    class="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
    @click="$emit('click')"
  >
    <template #header>
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {{ parcours.titre }}
          </h3>
          <div class="mt-2">
            <ProgressBar :percentage="progressPercentage" />
          </div>
        </div>
        <div class="ml-4 flex-shrink-0">
          <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </template>
    
    <div class="space-y-3">
      <p v-if="parcours.description" class="text-gray-600 text-sm line-clamp-2">
        {{ parcours.description }}
      </p>
      
      <div v-if="parcours.objectifs" class="p-3 bg-gray-50 rounded-md">
        <p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Objectifs</p>
        <p class="text-sm text-gray-700 line-clamp-2">{{ parcours.objectifs }}</p>
      </div>
      
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span v-if="moduleCount !== undefined">
          {{ completedModules }}/{{ moduleCount }} modules
        </span>
        <span v-if="parcours.createdAt">
          Créé le {{ formatDate(parcours.createdAt) }}
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from './ui/Card.vue'
import ProgressBar from './ui/ProgressBar.vue'

const props = defineProps({
  parcours: {
    type: Object,
    required: true
  },
  moduleCount: {
    type: Number,
    default: 0
  },
  completedModules: {
    type: Number,
    default: 0
  }
})

defineEmits(['click'])

const progressPercentage = computed(() => {
  if (props.moduleCount === 0) return 0
  return Math.round((props.completedModules / props.moduleCount) * 100)
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 