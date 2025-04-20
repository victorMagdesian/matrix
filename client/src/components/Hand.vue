<template>
    <div class="hand flex flex-wrap gap-2 my-4">
      <div
        v-for="(card, idx) in cards"
        :key="idx"
        :class="[
          'card w-12 h-16 bg-white text-black flex items-center justify-center rounded shadow cursor-pointer select-none',
          selected.includes(cardKey(card)) ? 'ring-2 ring-primary' : ''
        ]"
        @click="toggle(card)"
      >
        <span :class="`text-${card.color}-600`">
          {{ card.color[0].toUpperCase() }}{{ card.value }}
        </span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    cards:    { type: Array, required: true },
    selected: { type: Array, default: () => [] }
  })
  const emit = defineEmits(['update:selected'])
  
  // Gera uma string única para cada carta
  function cardKey(card) {
    return `${card.color}-${card.value}-${card.__uid || ''}`
  }
  
  // Alterna seleção
  function toggle(card) {
    const key = cardKey(card)
    const next = props.selected.includes(key)
      ? props.selected.filter(k => k !== key)
      : [...props.selected, key]
    emit('update:selected', next)
  }
  </script>
  
  <style scoped>
  .card:hover {
    transform: scale(1.05);
    transition: transform 0.1s ease;
  }
  </style>
  