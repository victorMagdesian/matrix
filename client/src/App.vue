<template>
  <Layout>
    <ModeSelect    v-if="status === 'idle'" />
    <WaitingRoom   v-else-if="status === 'waiting'" />
    <GameRoom      v-else-if="status === 'matched'" />
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from './stores/lobby'
import Layout       from './components/Layout.vue'
import ModeSelect   from './components/ModeSelect.vue'
import WaitingRoom  from './components/WaitingRoom.vue'
import GameRoom     from './components/GameRoom.vue'

const lobby  = useLobbyStore()
const status = computed(() => lobby.status)
</script>
