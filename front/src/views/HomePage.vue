<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <h1 class="text-4xl font-bold text-emerald-600 mb-4">Bienvenue sur votre espace personnel</h1>

    <p v-if="userStore.user" class="text-lg text-gray-700 mb-6">
      Connecté en tant que <strong>{{ userStore.user.username || 'Utilisateur' }}</strong>
    </p>

    <p v-else class="text-gray-600 mb-6">Veuillez vous connecter pour accéder aux fonctionnalités.</p>

    <SigninButton :user="userStore.user" @userChanged="$emit('userChanged', $event)" />

    <!-- Suggestions de contenus supplémentaires -->
    <div class="mt-10 w-full max-w-3xl">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Que souhaitez-vous faire ?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <router-link to="/parcours" class="p-4 bg-white shadow rounded hover:shadow-md transition">
          <span class="font-medium text-gray-800">Mes Parcours</span>
        </router-link>

        <div class="p-4 bg-white shadow rounded opacity-50 cursor-not-allowed">
          <span class="font-medium text-gray-500">Statistiques (bientôt)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SigninButton from '../components/SigninButton.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>
