<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-full flex items-center justify-center"
             :class="iconClasses">
          <component :is="iconComponent" class="w-5 h-5 text-white" />
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium" :class="textClasses">{{ label }}</p>
        <p class="text-2xl font-semibold" :class="valueClasses">{{ value }}</p>
        <p v-if="subtitle" class="text-xs mt-1 text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    <div v-if="trend" class="mt-3 flex items-center">
      <svg v-if="trend.direction === 'up'" class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      <svg v-else-if="trend.direction === 'down'" class="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
      </svg>
      <span class="text-xs" :class="trend.direction === 'up' ? 'text-green-600' : 'text-red-600'">
        {{ trend.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'chart'
  },
  color: {
    type: String,
    default: 'blue',
    validator: value => ['blue', 'green', 'yellow', 'red', 'emerald', 'purple', 'indigo'].includes(value)
  },
  trend: {
    type: Object,
    default: null
  }
})

const iconClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }
  return colors[props.color] || colors.blue
})

const textClasses = computed(() => {
  const colors = {
    blue: 'text-blue-800',
    green: 'text-green-800',
    yellow: 'text-yellow-800',
    red: 'text-red-800',
    emerald: 'text-emerald-800',
    purple: 'text-purple-800',
    indigo: 'text-indigo-800'
  }
  return colors[props.color] || colors.blue
})

const valueClasses = computed(() => {
  const colors = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    yellow: 'text-yellow-900',
    red: 'text-red-900',
    emerald: 'text-emerald-900',
    purple: 'text-purple-900',
    indigo: 'text-indigo-900'
  }
  return colors[props.color] || colors.blue
})

const iconComponent = computed(() => {
  const icons = {
    chart: 'svg',
    book: 'svg',
    clock: 'svg',
    check: 'svg',
    user: 'svg',
    star: 'svg'
  }
  return icons[props.icon] || 'svg'
})
</script>
