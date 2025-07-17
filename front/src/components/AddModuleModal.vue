<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)" title="Ajouter un module" description="Créez un nouveau module pour enrichir votre parcours de formation">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="space-y-2">
        <label for="module-titre" class="text-sm font-medium text-gray-700">
          Titre du module <span class="text-red-500">*</span>
        </label>
        <input
          id="module-titre"
          v-model="formData.titre"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: Introduction aux concepts de base"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="module-lien" class="text-sm font-medium text-gray-700">
          Lien externe
        </label>
        <input
          id="module-lien"
          v-model="formData.lienExterne"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com/cours"
        />
        <p class="text-xs text-gray-500">Lien vers une vidéo, un cours en ligne, un article, etc.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="module-date-debut" class="text-sm font-medium text-gray-700">
            Date de début
          </label>
          <input
            id="module-date-debut"
            v-model="formData.dateDebut"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="space-y-2">
          <label for="module-date-cible" class="text-sm font-medium text-gray-700">
            Date cible
          </label>
          <input
            id="module-date-cible"
            v-model="formData.dateCible"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">
          Statut initial
        </label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="formData.statut"
              type="radio"
              value="not-started"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">À faire</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="formData.statut"
              type="radio"
              value="in-progress"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">En cours</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="formData.statut"
              type="radio"
              value="completed"
              class="mr-2 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Terminé</span>
          </label>
        </div>
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
        <span v-else>Ajouter le module</span>
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
  lienExterne: '',
  dateDebut: '',
  dateCible: '',
  statut: 'not-started'
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
    lienExterne: '',
    dateDebut: '',
    dateCible: '',
    statut: 'not-started'
  }
  error.value = null
  loading.value = false
}

async function handleSubmit() {
  if (!formData.value.titre.trim()) return
  
  if (formData.value.dateDebut && formData.value.dateCible) {
    const dateDebut = new Date(formData.value.dateDebut)
    const dateCible = new Date(formData.value.dateCible)
    
    if (dateDebut > dateCible) {
      error.value = 'La date de début ne peut pas être postérieure à la date cible'
      return
    }
  }
  
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