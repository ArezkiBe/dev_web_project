<template>
  <div class="w-full">
    <div class="flex justify-between text-sm mb-1">
      <span class="text-gray-600">Progression</span>
      <span class="font-medium">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div 
        class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percentage: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100
  }
})
</script> 