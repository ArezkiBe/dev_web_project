<template>
  <div>
    <base-header />
    <slot :user="user" />
    <base-footer />
  </div>
</template>

<script>
import BaseHeader from './BaseHeader.vue'
import BaseFooter from './BaseFooter.vue'

export default {
  components: {
    BaseHeader,
    BaseFooter
  },
  props: ['user']
}
</script>
