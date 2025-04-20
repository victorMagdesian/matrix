<template>
  <div class="max-w-md mx-auto p-6 bg-surface-1 backdrop-blur-lg rounded-2xl shadow-xl space-y-4 text-center">
    <h2 class="text-xl font-semibold">Selecione o modo</h2>
    <div class="flex gap-4 justify-center">
      <button
        class="px-6 py-3 bg-gradient-to-r from-primary to-primary-light rounded-2xl shadow hover:scale-105 transition"
        @click="join(2)">
        1×1
      </button>
      <button
        class="px-6 py-3 bg-gradient-to-r from-primary-dark to-primary rounded-2xl shadow hover:scale-105 transition"
        @click="join(3)">
        1×1×1
      </button>
    </div>
  </div>
</template>

<script setup>
import { useLobbyStore } from '../stores/lobby'
const lobby = useLobbyStore()
function join(n) { lobby.join(n) }
</script>
