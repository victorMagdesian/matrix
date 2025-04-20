<template>
    <div class="game-room p-4">
      <h2 class="text-xl mb-2">Sala: {{ room }}</h2>
      <p>Jogadores na sala:</p>
      <ul class="list-disc list-inside">
        <li v-for="p in players" :key="p">{{ p }}</li>
      </ul>
      <!-- Aqui você integra a lógica/cena do seu jogo Matrix -->
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useLobbyStore } from '../stores/lobby'
  const lobby = useLobbyStore()
  const room = computed(() => lobby.room)
  const players = computed(() => lobby.players)
  </script>
  