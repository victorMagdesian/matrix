<template>
    <div class="global-discard bg-gray-800/40 p-3 rounded-xl overflow-x-auto">
      <h3 class="text-sm mb-2 font-semibold text-gray-200">Descarte Geral</h3>
      <div class="flex gap-2">
        <Card
          v-for="cid in ids"
          :key="cid"
          v-bind="cards[cid]"
          class="w-10"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import Card from './Card.vue'
  defineProps({
    ids:   { type: Array,  default: () => [] }, // array com todos os IDs descartados
    cards: { type: Object, default: () => ({}) }
  })
  </script>
  
  <style scoped>
  .global-discard { max-height: 120px; }
  </style>
  