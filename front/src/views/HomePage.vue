<template>
  <div class="home-content">
    <p v-if="userStore.user">Welcome, {{ userStore.user.name }}</p>
    <signin-button :user="userStore.user" @userChanged="$emit('userChanged', $event)" />
  </div>
</template>

<script>
import SigninButton from '../components/SigninButton.vue'

import { useUserStore } from '../stores/user'


export default {
  components: {
    SigninButton
  },
  props: ['user'],
  data() {
    return {
      userStore: useUserStore()
    }
  },
}
</script>

<style scoped>
.home-content {
  text-align: center;
  margin-top: 2rem;
}
</style>
