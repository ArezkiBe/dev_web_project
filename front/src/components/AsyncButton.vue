<template>
  <base-button
    :disabled="isPending"
    :color="color"
    @click.stop.prevent="handleClick"
  >
    <font-awesome-icon
      v-if="isPending"
      :icon="['fas', 'circle-notch']"
      pulse
      style="margin-right: 0.5rem;"
    />
    <slot />
  </base-button>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'AsyncButton',
  components: { BaseButton },
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      isPending: false
    }
  },
  methods: {
    async handleClick() {
      const originalOnClick = this.$attrs.onClick
      if (typeof originalOnClick !== 'function') return

      this.isPending = true
      try {
        await originalOnClick()
      } finally {
        this.isPending = false
      }
    }
  }
}
</script>
