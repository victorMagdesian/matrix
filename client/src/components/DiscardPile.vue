<template>
  <div class="discard-piles flex gap-4">
    <Card
      v-for="card in cards"
      :key="card.id"
      :color="card.color"
      :value="card.value"
      @click="$emit('draw')"
    />
    <div v-if="!cards.length" class="w-14 h-20 rounded bg-gray-700 flex items-center justify-center text-xs italic text-gray-400">
      Vazio
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Card from './Card.vue'

const props = defineProps({ cards: Array })
const emit = defineEmits(['draw'])
</script>