<!-- src/components/Card.vue -->
<template>
    <div
      class="card flex items-center justify-center w-12 h-16 sm:w-14 sm:h-20 rounded-md shadow-md font-bold text-white cursor-pointer border-2 transition-all"
      :class="[
        bgClass,
        selected ? 'border-yellow-300 scale-105' : 'border-gray-600 hover:scale-105'
      ]"
      @click="$emit('click')"
    >
      {{ value }}
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Definindo props
  const props = defineProps({
    color: String,      // 'red' | 'blue' | 'green' | 'yellow'
    value: Number,
    selected: Boolean
  })
  
  // Usando props.color corretamente
  const bgClass = computed(() => {
    switch (props.color) {
      case 'red': return 'bg-red-600'
      case 'blue': return 'bg-blue-600'
      case 'green': return 'bg-green-600'
      case 'yellow': return 'bg-yellow-400 text-black'
      default: return 'bg-gray-400'
    }
  })
  </script>
  
  <style scoped>
  .card {
    user-select: none;
  }
  </style>
  