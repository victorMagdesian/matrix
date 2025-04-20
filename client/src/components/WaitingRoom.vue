<template>
  <div class="max-w-md mx-auto p-6 bg-surface-1 backdrop-blur-lg rounded-2xl shadow-xl space-y-6 text-center">
    <h2 class="text-xl font-semibold">Aguardando adversários…</h2>
    <p class="text-4xl font-mono">{{ countdown }}<span class="text-lg">s</span></p>
    <button class="px-6 py-3 bg-red-600 rounded-2xl shadow hover:bg-red-700 transition" @click="cancel">
      Cancelar
    </button>
    <div v-if="lobby.isReconnecting" class="mt-4 inline-block px-4 py-2 bg-yellow-500 text-gray-900 rounded-full">
      Reconectando ao servidor…
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'

const lobby = useLobbyStore()
const countdown = ref(30)
let id

onMounted(() => {
  id = setInterval(() => {
    if (countdown.value > 0) countdown.value--
    else clearInterval(id)
  }, 1000)
})
onUnmounted(() => clearInterval(id))

function cancel() { lobby.leave() }
</script>
