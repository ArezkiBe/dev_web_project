<template>
  <header class="bg-emerald-600 text-white shadow-md">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
      <div class="flex items-center gap-4">
        <router-link to="/">
          <BaseButton>
            <span>Accueil</span>
          </BaseButton>
        </router-link>

        <router-link v-if="userStore.user" to="/parcours">
          <BaseButton>
            <span>Parcours</span>
          </BaseButton>
        </router-link>
      </div>

      <div>
        <BaseButton v-if="userStore.user" color="warn" @click="handleSignOut">
          <span>Déconnexion</span>
        </BaseButton>
        <BaseButton v-else color="danger">
          <span>Non connecté</span>
        </BaseButton>
      </div>
    </nav>
  </header>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import { useUserStore } from '../stores/user'
import { signOut } from '../lib/microsoftGraph'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

function handleSignOut() {
  signOut()
  userStore.clearUser()
  router.push('/') // redirection vers la page d’accueil
}
</script>
