<template>
  <main class="min-h-screen bg-gray-900 text-white p-6">
    <ModeSelect v-if="status !== 'matched'" />
    <GameRoom v-else />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from './stores/lobby'
import ModeSelect from './components/ModeSelect.vue'
import GameRoom   from './components/GameRoom.vue'

const lobby = useLobbyStore()
const status = computed(() => lobby.status)
</script>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}
</style>
