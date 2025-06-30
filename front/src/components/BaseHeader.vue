<template>
  <header>
    <nav>
      <div class="left">
        <router-link to="/">
          <base-button>
            <i class="fas fa-home"></i>
            <span>Home</span>
          </base-button>
        </router-link>

        <router-link v-if="userStore.user" to="/conversations">
          <base-button>
            <i class="fas fa-envelope"></i>
            <span>Conversations</span>
          </base-button>
        </router-link>

        <router-link v-if="userStore.user" to="/parcours">
          <base-button>
            <i class="fas fa-route"></i>
            <span>Parcours</span>
          </base-button>
        </router-link>
      </div>

      <div class="right">
        <base-button v-if="userStore.user" @click="handleSignOut">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </base-button>
        <base-button v-else>
          <i class="fas fa-user"></i>
          <span>Not yet logged-in</span>
        </base-button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import BaseButton from './BaseButton.vue'
import { useUserStore } from '../stores/user'
import { signOut } from '../lib/microsoftGraph'


const userStore = useUserStore()
function handleSignOut() {
  signOut()
  userStore.clearUser()
}
</script>


<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2db48b;
  color: black;
  padding: 0.6rem 1rem;
}
.left, .right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
i {
  font-size: 1rem;
}
a {
  text-decoration: none;
}
</style>
