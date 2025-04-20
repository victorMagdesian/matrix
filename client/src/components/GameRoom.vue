<template>
  <div class="game-room max-w-lg mx-auto bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">
      Sala: <span class="text-primary">{{ room }}</span>
    </h2>

    <p class="font-medium mb-2">Jogadores na sala:</p>
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      <li
        v-for="p in players"
        :key="p"
        class="bg-gray-700/70 px-4 py-2 rounded-lg text-center font-medium"
      >
        {{ p === myId ? 'Você' : p.slice(-4) }}
      </li>
    </ul>

    <MatrixCanvas :room="room" />

    <Hand
      :cards="myHand"
      :selected="selectedKeys"
      @update:selected="selectedKeys = $event"
    />

    <div class="flex justify-between gap-4 my-4">
      <DiscardPile
        v-for="p in players"
        :key="p"
        :label="p === myId ? 'Meu Descarte' : 'Desc. ' + p.slice(-4)"
        :topCard="state.discardPiles[p]?.slice(-1)[0] || null"
        :fromPlayerId="p"
        @draw="onDraw"
      />
    </div>

    <MeldArea
      :melds="state.melds[myId] || []"
      :selected="selectedKeys"
      @meld="onMeld"
    />
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
const players = computed(() => lobby.players)

// myId só fica disponível após o socket conectar
const myId = ref(null)
socket.on('connect', () => myId.value = socket.id)

// estado de jogo
const state = reactive({
  hands: {}, discardPiles: {}, melds: {}, turnOrder: [], currentTurnIndex: 0
})

// seleção de cartas
const selectedKeys = ref([])

// monta a mão com __uid para seleção
const myHand = computed(() => {
  const hand = state.hands[myId.value] || []
  return hand.map((c, i) => ({ ...c, __uid: `${myId.value}-${i}` }))
})

onMounted(() => {
  socket.on('gameStart', initial => Object.assign(state, initial))
  socket.on('stateUpdate', upd   => Object.assign(state, upd))
})

function onDraw(fromPlayerId) {
  socket.emit('drawDiscard', { room: room.value, fromPlayerId })
}
function onMeld() {
  const cards = myHand.value.filter(c => selectedKeys.value.includes(c.__uid))
  socket.emit('meld', { room: room.value, cards })
  selectedKeys.value = []
}
</script>

<style scoped>
.game-room { display: flex; flex-direction: column; }
</style>
