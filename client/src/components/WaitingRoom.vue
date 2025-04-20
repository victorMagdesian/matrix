<template>
    <div class="waiting-room p-4 text-center">
      <p class="mb-4 text-lg">Aguardando adversários...</p>
      <button
        class="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        @click="cancel"
      >
        Cancelar
      </button>
    </div>
  </template>
  
  <script setup>
  import { useLobbyStore } from '../stores/lobby'
  const lobby = useLobbyStore()
  
  function cancel() {
    lobby.leave(lobby.mode)
  }
  </script>
  