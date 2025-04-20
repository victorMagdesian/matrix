<!-- client/src/components/GameRoom.vue -->
<template>
  <div v-if="room && players.length" class="game-room mx-auto max-w-4xl space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        Sala: <span class="text-primary">{{ room }}</span>
      </h2>
      <p class="text-sm">
        Turno: <strong>{{ currentPlayerLabel }}</strong>
        <span v-if="myTurn"> – {{ phaseLabel }}</span>
      </p>
    </div>

    <!-- Canvas (animações etc.) -->
    <MatrixCanvas :room="room" />

    <!-- Área principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Mão do jogador -->
      <Hand
        :cards="myHand"
        :selected="selected"
        :phase="state.phase"
        :myTurn="myTurn"
        @update:selected="selected = $event"
        @discard="onDiscard"
        class="lg:col-span-2"
      />

      <!-- Pilhas de descarte abertas -->
      <DiscardPile
        :DiscardPile="state.DiscardPile"
        @draw="onDraw"
        class="lg:col-span-1"
      />
    </div>

    <!-- Botão DESCARTAR (caso prefira clicar em botão) -->
    <div v-if="myTurn && state.phase === 'discard'" class="flex justify-center">
      <button
        class="px-6 py-2 mt-2 rounded-lg bg-yellow-400 text-black font-semibold disabled:opacity-40"
        :disabled="selected.length !== 1"
        @click="onDiscard(mySelectedCard)"
      >
        Descartar carta selecionada
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import MatrixCanvas   from './MatrixCanvas.vue'
import Hand           from './Hand.vue'
import DiscardPile    from './DiscardPile.vue'

/* ───────── refs e estado global ───────── */
const lobby   = useLobbyStore()
const socket  = window.socket
const room    = computed(() => lobby.room)
const players = computed(() => lobby.players || [])
const myId    = ref(socket?.id)

/* ───────── estado recebido do servidor ───────── */
const state = reactive({
  hands          : {},
  DiscardPile    : {},
  melds          : {},
  turnOrder      : [],
  currentTurnIdx : 0,
  phase          : 'draw'
})

/* ───────── seleção de cartas ───────── */
const selected = ref([]) // armazena os __uid das cartas clicadas

/* ───────── computeds de conveniência ───────── */
const currentIdx = computed(() =>
  state.currentTurnIdx ?? state.currentTurnIndex ?? 0
)

const myTurn = computed(() => state.turnOrder[currentIdx.value] === myId.value)

const phaseLabel = computed(() =>
  state.phase === 'draw' ? 'comprar' :
  state.phase === 'discard' ? 'descartar' : ''
)

const currentPlayerLabel = computed(() => {
  const pid = state.turnOrder[currentIdx.value] || ''
  return pid === myId.value ? 'Você' : pid.slice(-4)
})

/* retorna array da mão do jogador já com __uid exclusivo por carta */
const myHand = computed(() => {
  const hand = state.hands[myId.value] || []
  return hand.map((c, idx) => ({ ...c, __uid: `${myId.value}-${idx}` }))
})

/* carta realmente selecionada (utilizado no botão) */
const mySelectedCard = computed(() =>
  myHand.value.find(c => selected.value.includes(c.__uid))
)

/* ───────── listener de estado enviado pelo servidor ───────── */
onMounted(() => {
  socket.on('connect', () => (myId.value = socket.id))

  socket.on('stateUpdate', data => {
    Object.assign(state, data)
  })

  socket.on('gameStart', data => {
    Object.assign(state, data)
  })
})

/* ───────── ações de UI -> servidor ───────── */
function onDraw(fromPlayerId) {
  if (myTurn.value && state.phase === 'draw' && room.value) {
    socket.emit('drawDiscard', {
      room: room.value,
      fromPlayerId
    })
  }
}

function onDiscard(card) {
  if (
    myTurn.value &&
    state.phase === 'discard' &&
    card &&
    room.value
  ) {
    socket.emit('discard', {
      room : room.value,
      card : { color: card.color, value: card.value }
    })
    selected.value = []
  }
}
</script>

<style scoped>
.game-room { display: flex; flex-direction: column; }
</style>
