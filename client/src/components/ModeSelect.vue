<template>
    <div class="mode-select p-4 flex justify-center gap-4">
      <button
        class="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        @click="join(2)"
      >
        1×1
      </button>
      <button
        class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        @click="join(3)"
      >
        1×1×1
      </button>
    </div>
  </template>
  
  <script setup>
  import { useLobbyStore } from '../stores/lobby'
  const lobby = useLobbyStore()
  
  function join(mode) {
    lobby.join(mode)
  }
  </script>
  