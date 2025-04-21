<template>
  <div class="matrix-canvas flex flex-col items-center gap-6 p-4">
    <!-- Status -->
    <div class="text-center text-white">
      <p class="text-lg font-bold">
        {{ isMyTurn ? '🎯 Seu turno!' : '⏳ Aguarde' }}
      </p>
      <p>Cartas: {{ playerHand.length }}</p>
    </div>

    <!-- Descartes -->
    <div class="flex gap-2">
      <DiscardPile
        :cards="state.discards[playerId] || []"
        @draw="handleDraw(playerId)"
      />
    </div>

    <!-- Mão -->
    <Hand
      :cards="playerHand"
      :phase="state.phase"
      :myTurn="isMyTurn"
      :autoDiscard="true"
      @update:selected="handleSelect"
      @discard="handleDiscard"
    />

    <!-- Botão de descarte -->
    <button v-if="selected !== null && isMyTurn" @click="handleDiscard"
      class="px-4 py-2 bg-yellow-400 rounded text-black font-semibold"
    >Descarte</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import Hand from './Hand.vue'
import DiscardPile from './DiscardPile.vue'

const lobby = useLobbyStore()
const state = ref({ hands: {}, discards: {}, phase: 'draw', turnOrder: [], currentTurnIndex: 0 })
const selected = ref(null)

const playerId = computed(() => lobby.socket.id)
const playerHand = computed(() => state.value.hands[playerId.value] || [])
const isMyTurn = computed(() => state.value.turnOrder[state.value.currentTurnIndex] === playerId.value)

onMounted(() => {
  lobby.socket.on('stateUpdate', s => state.value = s)
})

function handleSelect(id) { selected.value = id }
function handleDiscard() { lobby.socket.emit('discard',{ room: lobby.room, card: playerHand.value[selected.value] }); selected.value = null }
function handleDraw(from) { lobby.socket.emit('drawDiscard',{ room: lobby.room, fromPlayerId: from }) }
</script>