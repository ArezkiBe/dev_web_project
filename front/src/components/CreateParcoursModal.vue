<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)" title="Créer un nouveau parcours" description="Remplissez les informations pour créer votre parcours de formation">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="modal-titre" class="text-sm font-medium text-gray-700">
          Titre <span class="text-red-500">*</span>
        </label>
        <input
          id="modal-titre"
          v-model="formData.titre"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Apprendre Vue.js"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="modal-description" class="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="modal-description"
          v-model="formData.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Décrivez brièvement votre parcours de formation"
        />
      </div>

      <div class="space-y-2">
        <label for="modal-objectifs" class="text-sm font-medium text-gray-700">
          Objectifs
        </label>
        <textarea
          id="modal-objectifs"
          v-model="formData.objectifs"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Quels sont vos objectifs d'apprentissage ?"
        />
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </form>

    <template #footer>
      <Button variant="outline" type="button" @click="$emit('update:open', false)">
        Annuler
      </Button>
      <Button type="submit" :disabled="loading || !formData.titre.trim()" @click="handleSubmit">
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Création...
        </span>
        <span v-else>Créer le parcours</span>
      </Button>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from './ui/Dialog.vue'
import Button from './ui/Button.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open', 'create'])

const formData = ref({
  titre: '',
  description: '',
  objectifs: ''
})

const loading = ref(false)
const error = ref(null)

watch(() => props.open, (newOpen) => {
  if (!newOpen) {
    resetForm()
  }
})

function resetForm() {
  formData.value = {
    titre: '',
    description: '',
    objectifs: ''
  }
  error.value = null
  loading.value = false
}

async function handleSubmit() {
  if (!formData.value.titre.trim()) return
  
  loading.value = true
  error.value = null
  
  try {
    emit('create', { ...formData.value })
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script> 