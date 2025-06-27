<template>
  <async-button :onClick="handleSignin" color="primary">
    {{ user ? user.username : 'Sign in with Microsoft' }}
  </async-button>
</template>

<script>
import AsyncButton from './AsyncButton.vue'
import { signInAndGetUser } from '../lib/microsoftGraph'
import { useUserStore } from '../stores/user'

export default {
  components: { AsyncButton },
  setup() {
    const userStore = useUserStore()

    async function handleSignin() {
      const user = await signInAndGetUser()
      userStore.setUser(user)
    }

    return {
      handleSignin,
      user: userStore.user
    }
  }
}
</script>

