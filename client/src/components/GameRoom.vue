<!-- client/src/components/GameRoom.vue -->
<template>
  <div
    class="game-room mx-auto max-w-4xl space-y-6"
    v-if="room && players.length"
  >
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        Sala: <span class="text-primary">{{ room }}</span>
      </h2>
      <p class="text-sm">
        Turn: <strong>{{ currentPlayerLabel }}</strong>
      </p>
    </div>

    <MatrixCanvas :room="room" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Hand Column -->
      <Hand
        :cards="myHand"
        :selected="selectedKeys"
        @update:selected="selectedKeys = $event"
      />

      <!-- Discard Piles Column -->
      <div class="space-y-4">
        <DiscardPile
          v-for="p in players"
          :key="p"
          :label="p === myId ? 'Meu Descarte' : 'Desc. ' + (p ? p.slice(-4) : '')"
          :topCard="state.discardPiles[p]?.slice(-1)[0] || null"
          :fromPlayerId="p"
          @draw="onDraw"
        />
      </div>

      <!-- Meld Area Column -->
      <MeldArea
        :melds="state.melds[myId] || []"
        :selected="selectedKeys"
        @meld="onMeld"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useLobbyStore } from '../stores/lobby'
import MatrixCanvas from './MatrixCanvas.vue'
import Hand          from './Hand.vue'
import DiscardPile   from './DiscardPile.vue'
import MeldArea      from './MeldArea.vue'

const lobby  = useLobbyStore()
const socket = window.socket

const room    = computed(() => lobby.room)
const players = computed(() => Array.isArray(lobby.players) ? lobby.players : [])

// reactive myId
const myId = ref(null)
socket.on('connect', () => {
  myId.value = socket.id
})

// game state reactive
const state = reactive({
  hands: {}, discardPiles: {}, melds: {}, turnOrder: [], currentTurnIndex: 0
})

// selection for meld
const selectedKeys = ref([])

// compute myHand with unique __uid for selection
const myHand = computed(() => {
  const hand = state.hands[myId.value] || []
  return hand.map((c, i) => ({ ...c, __uid: `${myId.value}-${i}` }))
})

// safely compute current player label
const currentPlayerLabel = computed(() => {
  const order = Array.isArray(state.turnOrder) ? state.turnOrder : []
  if (!order.length) return ''
  const idx = state.currentTurnIndex || 0
  const pid = order[idx]
  if (!pid) return ''
  return pid === myId.value ? 'Você' : pid.slice(-4)
})

onMounted(() => {
  socket.on('gameStart', initial => {
    Object.assign(state, initial)
  })
  socket.on('stateUpdate', upd => {
    Object.assign(state, upd)
  })
})

function onDraw(fromPlayerId) {
  if (room.value) {
    socket.emit('drawDiscard', { room: room.value, fromPlayerId })
  }
}

function onMeld() {
  const cards = myHand.value.filter(c => selectedKeys.value.includes(c.__uid))
  if (room.value && cards.length) {
    socket.emit('meld', { room: room.value, cards })
    selectedKeys.value = []
  }
}
</script>

<style scoped>
.game-room {
  display: flex;
  flex-direction: column;
}
</style>
