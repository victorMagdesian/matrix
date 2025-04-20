<template>
    <div class="waiting-room p-4 text-center">
      <p class="mb-2 text-lg">Aguardando adversários…</p>
      <p class="mb-4 text-sm text-gray-300">
        Tempo restante: {{ countdown }}s
      </p>
      <button
        class="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        @click="cancel"
      >
        Cancelar
      </button>
  
      <!-- Banner de reconexão via store -->
      <div
        v-if="lobby.isReconnecting"
        class="mt-4 p-2 bg-yellow-600 text-yellow-100 rounded"
      >
        Reconectando ao servidor…
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useLobbyStore } from '../stores/lobby'
  
  const lobby = useLobbyStore()
  
  // contador local de 30 segundos
  const countdown = ref(30)
  let intervalId = null
  
  onMounted(() => {
    intervalId = setInterval(() => {
      if (countdown.value > 0) countdown.value--
      else clearInterval(intervalId)
    }, 1000)
  })
  
  onUnmounted(() => {
    clearInterval(intervalId)
  })
  
  function cancel() {
    lobby.leave()
  }
  </script>
  