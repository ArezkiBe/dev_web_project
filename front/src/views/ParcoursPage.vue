<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Mes Parcours</h1>

    <!-- Form to create a new parcours -->
    <div class="mb-8 p-4 border rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-2">Créer un nouveau parcours</h2>
      <form @submit.prevent="handleCreateParcours">
        <div class="mb-4">
          <label for="titre" class="block text-sm font-medium text-gray-700">Titre</label>
          <input v-model="newParcours.titre" type="text" id="titre" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
        </div>
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea v-model="newParcours.description" id="description" rows="3" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div class="mb-4">
          <label for="objectifs" class="block text-sm font-medium text-gray-700">Objectifs</label>
          <textarea v-model="newParcours.objectifs" id="objectifs" rows="3" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Créer
        </button>
      </form>
    </div>

    <!-- List of parcours -->
    <div>
      <h2 class="text-xl font-semibold mb-2">Liste des parcours</h2>
      <div v-if="loading" class="text-center">Chargement...</div>
      <div v-if="error" class="text-red-500">{{ error }}</div>
      <div v-if="!loading && parcoursList.length === 0" class="text-gray-500">Aucun parcours trouvé.</div>
      <ul v-else class="space-y-4">
        <li v-for="parcours in parcoursList" :key="parcours.id" class="p-4 border rounded-lg shadow-sm">
          <h3 class="font-bold text-lg">{{ parcours.titre }}</h3>
          <p v-if="parcours.description">{{ parcours.description }}</p>
          <p v-if="parcours.objectifs" class="text-sm text-gray-600 mt-2"><b>Objectifs:</b> {{ parcours.objectifs }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getParcours, createParcours } from '../services/parcours'

const parcoursList = ref([])
const newParcours = ref({
  titre: '',
  description: '',
  objectifs: ''
})
const loading = ref(false)
const error = ref(null)

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

async function handleCreateParcours() {
  error.value = null
  try {
    const created = await createParcours(newParcours.value)
    parcoursList.value.push(created)
    // Reset form
    newParcours.value = { titre: '', description: '', objectifs: '' }
  } catch (err) {
    error.value = err.message
  }
}

onMounted(fetchParcours)
</script>