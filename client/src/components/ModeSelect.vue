<template>
  <div class="mode-select flex flex-col items-center justify-center gap-4 p-8">
    <h2 class="text-2xl font-bold text-white mb-4">Escolha o modo de jogo</h2>

    <button
      class="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
      @click="join(2)"
    >
      Jogar 1×1
    </button>

    <button
      class="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
      @click="join(3)"
    >
      Jogar 1×1×1
    </button>
  </div>
</template>

<script setup>
import { useLobbyStore } from '../stores/lobby'
const lobby = useLobbyStore()

function join(mode) {
  console.log(`🕹️ Selecionado modo: ${mode}`)
  lobby.join(mode)
}
</script>
