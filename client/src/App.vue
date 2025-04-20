<template>
  <div id="app" class="min-h-screen flex items-center justify-center">
    <transition name="fade" mode="out-in">
      <component :is="currentComponent" key="lobby-status" />
    </transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLobbyStore } from './stores/lobby'
import ModeSelect  from './components/ModeSelect.vue'
import WaitingRoom from './components/WaitingRoom.vue'
import GameRoom    from './components/GameRoom.vue'

const lobby = useLobbyStore()
const status = computed(() => lobby.status)

const currentComponent = computed(() => {
  if (status.value === 'idle') return ModeSelect
  if (status.value === 'waiting') return WaitingRoom
  if (status.value === 'matched') return GameRoom
})
</script>

<style>
#app {
  background: #1a1a1a;
  color: #fff;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
