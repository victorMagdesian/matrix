<template>
    <div class="history overflow-x-auto py-2 px-1 bg-gray-700/40 rounded-lg">
      <h3 class="text-sm text-gray-300 mb-1">Descarte Geral ({{ cardsShown.length }})</h3>
      <div class="flex gap-1">
        <Card v-for="c in cardsShown" :key="c.__uid" v-bind="c" small />
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import Card from './Card.vue'
  
  const props = defineProps({
    ids:   { type: Array,  default: () => [] },
    cards: { type: Object, default: () => ({}) }
  })
  
  const cardsShown = computed(() =>
    props.ids.map(id => ({ __uid: id, ...props.cards[id] }))
  )
  </script>
  
  <style scoped>
  .history { max-height: 120px; }
  </style>
  