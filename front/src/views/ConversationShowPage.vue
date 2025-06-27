<template>
  <div class="conversation">
    <h2>Conversation ID: {{ id }}</h2>
    <div v-if="mail">
      <h3>{{ mail.subject }}</h3>
      <p><strong>From:</strong> {{ mail.from?.emailAddress?.name }}</p>
      <p><strong>To:</strong> {{ mail.toRecipients?.[0]?.emailAddress?.name }}</p>
      <div v-html="mail.body?.content" />
    </div>
    <div v-else-if="loading">Loading email...</div>
    <div v-else>Email not found or access denied.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMailById } from '../lib/microsoftGraph'

const route = useRoute()
const id = route.params.id

const mail = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    mail.value = await getMailById(id)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.conversation {
  padding: 1rem;
}
</style>
