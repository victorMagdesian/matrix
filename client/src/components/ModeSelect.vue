<template>
  <div
    class="mode-select max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    <button
      class="w-full sm:w-auto px-6 py-3 text-lg font-semibold bg-gradient-to-r from-primary to-primary-light rounded-2xl shadow-md transform transition hover:scale-105"
      @click="join(2)">
      1×1
    </button>
    <button
      class="w-full sm:w-auto px-6 py-3 text-lg font-semibold bg-gradient-to-r from-primary-dark to-primary rounded-2xl shadow-md transform transition hover:scale-105"
      @click="join(3)">
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
