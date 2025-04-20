<template>
  <div class="matrix-canvas flex flex-col gap-6 items-center justify-center p-4">
    <!-- Indicação de turno -->
    <div class="text-center">
      <p class="text-lg font-bold text-yellow-400">
        {{ isMyTurn ? '🎯 Seu turno!' : '⏳ Aguardando o oponente...' }}
      </p>
      <p class="text-sm text-white mt-1">
        Você tem {{ playerHand.length }} carta{{ playerHand.length === 1 ? '' : 's' }}
      </p>
    </div>

    <!-- Pilhas de descarte -->
    <div class="discards flex flex-wrap gap-4 justify-center">
      <div
        v-for="(pile, playerId) in state.discards"
        :key="playerId"
        class="w-14 h-20 rounded bg-gray-700 flex items-center justify-center cursor-pointer border-2 border-gray-500 hover:border-yellow-400 transition-transform hover:scale-105"
        @click="handleDraw(playerId)"
      >
        <span class="text-xs text-white text-center leading-tight">
          {{ playerId === socketId ? 'Você' : playerId.slice(0, 4) }}<br />
          {{ pile[pile.length - 1]?.value ?? '–' }}
        </span>
      </div>
    </div>

    <!-- Mão do jogador -->
    <Hand :cards="playerHand" :selectedIndex="selectedIndex" @select="handleSelect" />

    <!-- Botão de descartar -->
    <button
      v-if="selectedIndex !== null && isMyTurn"
      class="mt-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded shadow hover:bg-yellow-500 transition-all"
      @click="handleDiscard"
    >
      Descartar carta selecionada
    </button>

    <!-- Melds já baixados -->
    <div v-if="myMelds.length" class="melds mt-6 w-full text-white text-center">
      <p class="font-semibold mb-2">Seus grupos baixados:</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <div
          v-for="(group, gIndex) in myMelds"
          :key="gIndex"
          class="flex gap-1 p-2 bg-gray-700/50 rounded-lg shadow-inner"
        >
          <Card v-for="(card, i) in group" :key="i" :color="card.color" :value="card.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import Hand from './Hand.vue'
import Card from './Card.vue'

const lobby = useLobbyStore()

const state = ref({
  hands: {},
  discards: {},
  melds: {},
  turnOrder: [],
  currentTurnIndex: 0
})

const selectedIndex = ref(null)
const socketId = computed(() => lobby.socket?.id || '')
const playerHand = computed(() => state.value.hands?.[socketId.value] || [])
const myMelds = computed(() => state.value.melds?.[socketId.value] || [])

const isMyTurn = computed(() => {
  return state.value.turnOrder?.[state.value.currentTurnIndex] === socketId.value
})

onMounted(() => {
  lobby.socket?.on('stateUpdate', (newState) => {
    console.log('📦 stateUpdate recebido:', newState)
    state.value = newState
  })
})

function handleSelect(index) {
  selectedIndex.value = index === selectedIndex.value ? null : index
}

function handleDiscard() {
  const card = playerHand.value[selectedIndex.value]
  if (!card || !isMyTurn.value) return

  lobby.socket.emit('discard', {
    room: lobby.room,
    card
  })
  selectedIndex.value = null
}

function handleDraw(fromPlayerId) {
  if (!isMyTurn.value) return

  lobby.socket.emit('drawDiscard', {
    room: lobby.room,
    fromPlayerId
  })
}
</script>

<style scoped>
.matrix-canvas {
  max-width: 768px;
  margin: auto;
}
</style>
