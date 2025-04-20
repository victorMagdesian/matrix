<template>
  <div class="game-room max-w-lg w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">
      Sala: <span class="text-primary">{{ room }}</span>
    </h2>
    <p class="font-medium mb-2">Jogadores na sala:</p>
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <li v-for="p in players" :key="p"
        class="bg-gray-700/70 px-4 py-2 rounded-lg shadow-inner text-center font-medium">
        {{ p }}
      </li>
    </ul>
    <!-- Aqui entra seu componente/canvas do jogo Matrix -->
    <div class="mt-6">
      <!-- <MatrixCanvas :room="room" /> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from '../stores/lobby'

const lobby = useLobbyStore()
const room = computed(() => lobby.room)
const players = computed(() => lobby.players)
</script>
