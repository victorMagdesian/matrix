<!-- src/components/DiscardPile.vue -->
<template>
    <div class="discard-piles grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
      <div
        v-for="(pile, playerId) in DiscardPile"
        :key="playerId"
        class="flex flex-col items-center bg-gray-700/70 rounded-lg p-3 shadow-md"
      >
        <span class="text-sm font-semibold text-gray-300 mb-2">
          {{ isSelf(playerId) ? 'Você' : 'Jogador ' + playerId.slice(-4) }}
        </span>
  
        <Card
          v-if="pile.length"
          :color="pile[pile.length - 1].color"
          :value="pile[pile.length - 1].value"
          @click="onDraw(playerId)"
        />
        <div v-else class="w-12 h-16 rounded-md bg-gray-500 text-center text-xs text-white flex items-center justify-center">
          Vazio
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Card from './Card.vue'
  import { useLobbyStore } from '../stores/lobby'
  
  defineProps({
    DiscardPile: Object // { playerId: [ { color, value }, ... ] }
  })
  
  const emit = defineEmits(['draw'])
  const lobby = useLobbyStore()
  
  function isSelf(pid) {
    return pid === lobby.socket?.id
  }
  
  function onDraw(fromPlayerId) {
    emit('draw', fromPlayerId)
  }
  </script>
  