<template>
    <div class="matrix-canvas flex flex-col gap-6 items-center justify-center p-4">
      <div v-if="!isMyTurn" class="text-yellow-400 font-bold mb-2">
        Aguarde sua vez...
      </div>
  
      <!-- Pilhas de descarte -->
      <div class="discards flex flex-wrap gap-4 justify-center">
        <div v-for="(pile, playerId) in state.discards" :key="playerId"
          class="w-14 h-20 rounded bg-gray-700 flex items-center justify-center cursor-pointer border-2 border-gray-500 hover:border-yellow-400"
          @click="handleDraw(playerId)">
          <span class="text-xs text-white">
            {{ playerId === socketId ? 'Você' : playerId.slice(0, 4) }}
            <br />
            {{ pile[pile.length - 1]?.value ?? '–' }}
          </span>
        </div>
      </div>
  
      <!-- Mão do jogador -->
      <Hand :cards="playerHand" :selectedIndex="selectedIndex" @select="handleSelect" />
  
      <button v-if="selectedIndex !== null && isMyTurn"
        class="mt-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded shadow hover:bg-yellow-500"
        @click="handleDiscard">
        Descartar carta selecionada
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useLobbyStore } from '../stores/lobby'
  import Hand from './Hand.vue'
  
  const lobby = useLobbyStore()
  const state = ref({
    hands: {},
    discards: {},
    melds: {},
    turnOrder: [],
    currentTurnIndex: 0
  })
  
  const selectedIndex = ref(null)
  const socketId = computed(() => lobby.playerId)
  const isMyTurn = computed(() => {
    return state.value.turnOrder?.[state.value.currentTurnIndex] === socketId.value
  })
  
  const playerHand = computed(() => {
    return state.value.hands?.[socketId.value] || []
  })
  
  onMounted(() => {
    console.log('🧠 Meu socket.id:', socketId.value)
  
    lobby.socket?.on('stateUpdate', (newState) => {
      console.log('📦 stateUpdate:', newState)
      console.log('🎴 hands recebidas:', Object.keys(newState.hands))
      state.value = newState
    })
  })
  
  function handleSelect(index) {
    selectedIndex.value = index === selectedIndex.value ? null : index
  }
  
  function handleDiscard() {
    const card = playerHand.value[selectedIndex.value]
    if (card) {
      lobby.socket.emit('discard', {
        room: lobby.room,
        card
      })
      selectedIndex.value = null
    }
  }
  
  function handleDraw(fromPlayerId) {
    lobby.socket.emit('drawDiscard', {
      room: lobby.room,
      fromPlayerId
    })
  }
  </script>
  