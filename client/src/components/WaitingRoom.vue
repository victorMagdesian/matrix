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
  
      <!-- Banner de reconexão -->
      <div
        v-if="disconnected"
        class="mt-4 p-2 bg-yellow-600 text-yellow-100 rounded"
      >
        Reconectando ao servidor…
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useLobbyStore } from '../stores/lobby'
  
  const lobby = useLobbyStore()
  
  // contador local de 30 segundos
  const countdown = ref(30)
  let intervalId = null
  
  // flag de desconexão: true se socket estiver desconectado
  const disconnected = ref(false)
  
  onMounted(() => {
    // inicia o countdown
    intervalId = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--
      } else {
        clearInterval(intervalId)
      }
    }, 1000)
  
    // observa estado de conexão do socket
    lobby.socket.on('disconnect', () => {
      disconnected.value = true
    })
    lobby.socket.on('reconnect', () => {
      disconnected.value = false
    })
  })
  
  onUnmounted(() => {
    clearInterval(intervalId)
  })
  
  function cancel() {
    lobby.leave()
  }
  </script>
  