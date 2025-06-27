<template>
  <base-layout :user="user" @userChanged="updateUser">
    <router-view />
  </base-layout>
</template>

<script>
import BaseLayout from './components/BaseLayout.vue'

export default {
  components: {
    BaseLayout,
  },
  data() {
    return {
      user: null
    }
  },
  methods: {
    updateUser(user) {
      this.user = user
    }
  }
}
</script>
