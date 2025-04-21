<template>
  <div v-if="room" class="game-room mx-auto max-w-4xl space-y-6">

    <TurnIndicator :show="myTurn" />

    <!-- Cabeçalho -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold">
          Sala: <span class="text-primary">{{ room }}</span>
        </h2>
        <p class="text-sm">
          Turno: <strong>{{ currentLabel }}</strong>
          <span v-if="myTurn"> · {{ phaseLabel }}</span>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="px-4 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          @click="checkVictory"
        >
          Checar vitória
        </button>
      </div>
    </div>

    <!-- Mensagem de vitória -->
    <div v-if="victoryMsg" class="text-center text-lg font-semibold text-green-400">
      {{ victoryMsg }}
    </div>

    <!-- Botão comprar -->
    <div v-if="myTurn && state.phase === 'draw'" class="text-center">
      <button
        class="px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow-md"
        @click="socket.emit('drawDeck', { room })"
      >
        Comprar carta
      </button>
    </div>

    <MatrixCanvas :room="room" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Hand
        class="lg:col-span-2"
        :cards="myHand"
        :selected="selected"
        :phase="state.phase"
        :myTurn="myTurn"
        :autoDiscard="autoDiscard"
        @update:selected="selected = $event"
        @discard="onDiscard"
      />
    </div>

    <!-- Histórico global de descartes -->
    <GlobalDiscard
      :ids="state.allDiscards"
      :cards="state.cards"
    />

    <!-- Botão descartar selecionado -->
    <div
      v-if="myTurn && state.phase === 'discard' && mySelectedCard"
      class="flex justify-center"
    >
      <button
        class="px-6 py-2 mt-4 rounded-lg bg-yellow-400 text-black font-semibold"
        @click="onDiscard(mySelectedCard.id)"
      >
        Descartar carta
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import TurnIndicator from './TurnIndicator.vue'
import MatrixCanvas from './MatrixCanvas.vue'
import Hand from './Hand.vue'
import DiscardPile from './DiscardPile.vue'
import GlobalDiscard from './GlobalDiscard.vue'

/* Globals */
const lobby = useLobbyStore()
const socket = lobby.socket
const room = computed(() => lobby.room)
const myId = computed(() => lobby.playerId || socket.id)

/* Synced state */
const state = reactive({
  cards: {},
  hands: {},
  DiscardPile: {},
  drawPile: [],
  allDiscards: [],
  melds: {},
  turnOrder: [],
  currentTurnIdx: 0,
  phase: 'draw'
})

/* Local selection */
const selected = ref([])
const victoryMsg = ref('')

/* Computeds */
const myTurn = computed(() => state.turnOrder[state.currentTurnIdx] === myId.value)
const phaseLabel = computed(() => state.phase === 'draw' ? 'comprar' : 'descartar')
const currentLabel = computed(() =>
  myTurn.value
    ? 'Você'
    : (state.turnOrder[state.currentTurnIdx] || '').slice(-4)
)

const myHand = computed(() => {
  const list = state.hands[myId.value] || []
  return list.map(cid => ({ id: cid, ...state.cards[cid] }))
})

const autoDiscard = computed(() =>
  myTurn.value && state.phase === 'discard' && myHand.value.length === 12
)

const mySelectedCard = computed(() =>
  myHand.value.find(c => selected.value.includes(c.id))
)

/* Socket events */
onMounted(() => {
  socket.on('stateUpdate', data => Object.assign(state, data))
  socket.on('victoryResult', ({ won }) => {
    victoryMsg.value = won ? 'Você venceu!' : 'Ainda não é vitória.'
    setTimeout(() => (victoryMsg.value = ''), 3000)
  })
  socket.emit('getState', { room: room.value })
})

watch(room, r => r && socket.emit('getState', { room: r }))

/* Actions */
function onDraw(fromPlayerId) {
  socket.emit('drawDiscard', { room: room.value, from: fromPlayerId })
}

function onDiscard(cardOrId) {
  const id = typeof cardOrId === 'object' ? cardOrId.id : cardOrId
  const card = state.cards[id]
  if (!card) return
  socket.emit('discard', {
    room: room.value,
    card: { color: card.color, value: card.value }
  })
  selected.value = []
}

function checkVictory() {
  socket.emit('checkVictory', { room: room.value })
}
</script>

<style scoped>
.game-room {
  display: flex;
  flex-direction: column;
}
</style>
