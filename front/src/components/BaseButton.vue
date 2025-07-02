<template>
  <button
    :class="[
      'inline-flex items-center gap-2 font-semibold text-white px-4 py-2 rounded-xl shadow-sm transition-colors duration-200',
      colorClass,
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'warn', 'danger'].includes(value)
  }
})

const colorClass = computed(() => {
  return {
    primary: 'bg-emerald-600',
    warn: 'bg-yellow-500',
    danger: 'bg-red-600'
  }[props.color] || 'bg-emerald-600'
})
</script>
