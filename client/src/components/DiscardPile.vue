<!-- client/src/components/DiscardPile.vue -->
<template>
  <div class="piles flex flex-col lg:flex-row gap-4 justify-center">
    <div
      v-for="(ids, pid) in DiscardPile"
      :key="pid"
      class="pile flex flex-col items-center cursor-pointer"
      @click="$emit('draw', pid)"
    >
      <!-- Mostra topo da pilha -->
      <Card
        v-if="ids.length"
        v-bind="cards[ids.at(-1)]"
      />
      <span class="text-xs mt-1">
        P{{ pid.slice(-4) }} ({{ ids.length }})
      </span>
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue'

defineProps({
  DiscardPile: { type: Object, default: () => ({}) },
  cards      : { type: Object, default: () => ({}) }
})

defineEmits(['draw'])
</script>

<style scoped>
.pile { min-width: 60px; }
</style>
