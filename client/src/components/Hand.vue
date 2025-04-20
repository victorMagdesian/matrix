<!-- src/components/Hand.vue -->
<template>
    <div class="hand flex flex-wrap gap-2 justify-center p-4 bg-gray-800/60 rounded-lg">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :color="card.color"
        :value="card.value"
        :selected="selectedIndex === index"
        @click="select(index)"
      />
    </div>
  </template>
  
  <script setup>
  import Card from './Card.vue'
  
  const props = defineProps({
    cards: Array,                // [{ color: 'red', value: 4 }, ...]
    selectedIndex: Number        // índice da carta selecionada (opcional)
  })
  
  const emit = defineEmits(['select'])
  
  function select(index) {
    emit('select', index)
  }
  </script>
  