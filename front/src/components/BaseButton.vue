<template>
  <button
    class="base-button"
    :class="buttonClass"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'warn', 'danger'].includes(value)
    }
  },
  inheritAttrs: false,
  computed: {
    buttonClass() {
      return `color-${this.color}`
    }
  }
}
</script>

<style scoped>
.base-button {
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-primary {
  background-color: #2db48b;
}
.color-primary:hover:not(:disabled),
.color-primary:focus:not(:disabled) {
  background-color: #249d76;
}

.color-warn {
  background-color: #ffb522;
}
.color-warn:hover:not(:disabled),
.color-warn:focus:not(:disabled) {
  background-color: #ff9f00;
}

.color-danger {
  background-color: #e53935;
}
.color-danger:hover:not(:disabled),
.color-danger:focus:not(:disabled) {
  background-color: #d32f2f;
}

/* Désactivé */
.base-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  color: #666;
}
</style>
