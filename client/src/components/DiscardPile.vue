<template>
    <div class="flex flex-col items-center">
      <div class="text-sm mb-1">{{ label }}</div>
      <div
        v-if="topCard"
        class="w-12 h-16 bg-gray-200 flex items-center justify-center rounded shadow"
      >
        <span :class="`text-${topCard.color}-600`">
          {{ topCard.color[0].toUpperCase() }}{{ topCard.value }}
        </span>
      </div>
      <div v-else class="w-12 h-16 border-2 border-dashed rounded flex items-center justify-center text-gray-500">
        Empty
      </div>
      <button class="mt-2 px-2 py-1 bg-primary text-white rounded text-xs"
        @click="$emit('draw', fromPlayerId)"
      >Pegar</button>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  defineProps({
    topCard:      Object,
    label:        String,
    fromPlayerId: String
  })
  </script>
  