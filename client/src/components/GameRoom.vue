<!-- client/src/components/GameRoom.vue -->
<template>
  <div v-if="room" class="game-room mx-auto max-w-4xl space-y-6">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        Sala: <span class="text-primary">{{ room }}</span>
      </h2>
      <p class="text-sm">
        Turno: <strong>{{ currentPlayerLabel }}</strong>
        <span v-if="myTurn"> · {{ phaseLabel }}</span>
      </p>
    </div>

    <!-- Canvas ou animações -->
    <MatrixCanvas :room="room" />

    <!-- Área principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Mão do jogador -->
      <Hand
        class="lg:col-span-2"
        :cards="myHand"
        :selected="selected"
        :phase="state.phase"
        :myTurn="myTurn"
        @update:selected="selected = $event"
        @discard="onDiscard"
      />

      <!-- Pilhas de descarte -->
      <DiscardPile
        class="lg:col-span-1"
        :DiscardPile="state.DiscardPile"
        :cards="state.cards"
        @draw="onDraw"
      />
    </div>

    <!-- Botão de descartar (opcional) -->
    <div v-if="myTurn && state.phase === 'discard'" class="flex justify-center">
      <button
        class="px-6 py-2 mt-4 rounded-lg bg-yellow-400 text-black font-semibold disabled:opacity-40"
        :disabled="selected.length !== 1"
        @click="onDiscard(mySelectedCard)"
      >
        Descartar carta selecionada
      </button>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-mutating-props */
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import MatrixCanvas  from './MatrixCanvas.vue'
import Hand          from './Hand.vue'
import DiscardPile   from './DiscardPile.vue'

/* ───────── refs globais ───────── */
const lobby  = useLobbyStore()
const socket = lobby.socket
const room   = computed(() => lobby.room)
const myId   = computed(() => lobby.playerId || socket.id)

/* ───────── estado do jogo ───────── */
const state = reactive({
  cards       : {},       // id -> { color, value, owner }
  hands       : {},
  DiscardPile : {},       // pid -> [id]
  melds       : {},
  turnOrder   : [],
  currentTurnIdx : 0,
  phase          : 'draw'
})

/* ───────── seleção na mão ───────── */
const selected = ref([])

/* ───────── computeds auxiliares ───────── */
const currentIdx  = computed(() => state.currentTurnIdx)
const myTurn      = computed(() => state.turnOrder[currentIdx.value] === myId.value)

const phaseLabel = computed(() =>
  state.phase === 'draw' ? 'comprar' :
  state.phase === 'discard' ? 'descartar' : ''
)

const currentPlayerLabel = computed(() => {
  const pid = state.turnOrder[currentIdx.value] || ''
  return pid === myId.value ? 'Você' : pid.slice(-4)
})

const myHand = computed(() => {
  if (!state.cards) return []
  return Object.entries(state.cards)
    .filter(([, c]) => c.owner === myId.value)
    .map(([id, c]) => ({ __uid: id, ...c }))
})

const mySelectedCard = computed(() =>
  myHand.value.find(c => selected.value.includes(c.__uid))
)

/* ───────── helpers ───────── */
function requestState (r) {
  if (r) socket.emit('getState', { room: r })
}

/* ───────── listeners ───────── */
onMounted(() => {
  socket.on('stateUpdate', data => Object.assign(state, data))
  requestState(room.value)         // garante sync se montou tarde
})

watch(room, (n, o) => {
  if (n && n !== o) requestState(n)
})

/* ───────── ações de UI ───────── */
function onDraw(fromPlayerId) {
  if (myTurn.value && state.phase === 'draw') {
    socket.emit('drawDiscard', { room: room.value, fromPlayerId })
  }
}

function onDiscard(card) {
  if (!card || !myTurn.value || state.phase !== 'discard') return
  socket.emit('discard', {
    room: room.value,
    card: { color: card.color, value: card.value }
  })
  selected.value = []
}
</script>

<style scoped>
.game-room { display: flex; flex-direction: column; }
</style>
