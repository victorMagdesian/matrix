<template>
  <div class="p-8 text-center space-y-6">
    <h1 class="text-3xl font-bold text-white">Escolha um modo de jogo</h1>

    <button
      class="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700"
      @click="join(2)"
      :disabled="status === 'waiting'"
    >
      Jogar 1×1
    </button>

    <button
      class="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
      @click="join(3)"
      :disabled="status === 'waiting'"
    >
      Jogar 1×1×1
    </button>

    <div v-if="status === 'waiting'" class="text-gray-300 mt-4">
      Aguardando outros jogadores...
      <div class="mt-2">
        <button @click="leave" class="text-sm underline text-gray-400 hover:text-white">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from '../stores/lobby'

const lobby = useLobbyStore()
const status = computed(() => lobby.status)

function join(mode) {
  lobby.join(mode)
}

function leave() {
  lobby.leave()
}
</script>
