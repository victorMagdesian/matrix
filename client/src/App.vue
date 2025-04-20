<template>
  <div id="app" class="min-h-screen flex items-center justify-center">
    <ModeSelect    v-if="status === 'idle'"    />
    <WaitingRoom   v-else-if="status === 'waiting'" />
    <GameRoom      v-else-if="status === 'matched'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from './stores/lobby'
import ModeSelect    from './components/ModeSelect.vue'
import WaitingRoom   from './components/WaitingRoom.vue'
import GameRoom      from './components/GameRoom.vue'

const lobby = useLobbyStore()
const status = computed(() => lobby.status)
</script>

<style>
/* só pra centralizar melhor, depois você personaliza */
#app { background: #1a1a1a; color: #fff; }
</style>
