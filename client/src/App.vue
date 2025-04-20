<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-4">
    <ModeSelect    v-if="status === 'idle'" />
    <WaitingRoom   v-else-if="status === 'waiting'" />
    <GameRoom      v-else-if="status === 'matched'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from './stores/lobby'
import ModeSelect  from './components/ModeSelect.vue'
import WaitingRoom from './components/WaitingRoom.vue'
import GameRoom    from './components/GameRoom.vue'

const lobby  = useLobbyStore()
const status = computed(() => lobby.status)
</script>

<style>
/* opcional: full‑height wrapper já estilizado no global CSS */
</style>
