<template>
  <div
    class="waiting-room max-w-md w-full bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center space-y-4">
    <p class="text-xl font-semibold">Aguardando adversários…</p>
    <p class="text-3xl font-mono">
      {{ countdown }}<span class="text-lg">s</span>
    </p>
    <button
      class="px-6 py-3 font-medium bg-red-600 rounded-2xl shadow hover:bg-red-700 transform transition hover:scale-105"
      @click="cancel">
      Cancelar
    </button>
    <div v-if="lobby.isReconnecting"
      class="mt-4 inline-block px-4 py-2 bg-yellow-500 text-gray-900 font-medium rounded-full shadow">
      Reconectando ao servidor…
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'

const lobby = useLobbyStore()
const countdown = ref(30)
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(intervalId)
  }, 1000)
})
onUnmounted(() => clearInterval(intervalId))

function cancel() {
  lobby.leave()
}
</script>
