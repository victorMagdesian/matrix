<template>
  <div class="game-room max-w-lg w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-xl p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">
      Sala: <span class="text-primary">{{ room }}</span>
    </h2>

    <p class="font-medium mb-2">Jogadores na sala:</p>
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
      <li
        v-for="p in players"
        :key="p"
        class="bg-gray-700/70 px-4 py-2 rounded-lg shadow-inner text-center font-medium"
      >
        {{ p === myId ? 'Você' : p.slice(-4) }}
      </li>
    </ul>

    <!-- Efeito Matrix ou fundo de jogo -->
    <MatrixCanvas :room="room" />

    <!-- Sua mão de cartas -->
    <Hand :cards="myHand" />

    <!-- Discard piles -->
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

    <!-- Área de melds -->
    <MeldArea
      :melds="state.melds[myId] || []"
      :selected="selectedCards"
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

// Pinia store e socket exposto
const lobby  = useLobbyStore()
const socket = window.socket

// sala e jogadores
const room    = computed(() => lobby.room)
const players = computed(() => lobby.players)
const myId    = socket.id

// estado do jogo reativo
const state = reactive({
  hands: {},         // mãos de cada jogador
  discardPiles: {},  // pilhas de descarte
  melds: {},         // grupos baixados
  turnOrder: [],     // ordem de turnos
  currentTurnIndex: 0
})

// seleção de cartas para meld
const selectedCards = ref([])

// minha mão computada
const myHand = computed(() => state.hands[myId] || [])

// ao montar, escutamos os eventos do servidor
onMounted(() => {
  // início de jogo: recebemos mãos e descartes iniciais
  socket.on('gameStart', (initial) => {
    Object.assign(state, initial)
  })

  // a cada ação, o servidor envia o estado atualizado
  socket.on('stateUpdate', (upd) => {
    Object.assign(state, upd)
  })
})

// pega do topo da pilha de descarte
function onDraw(fromPlayerId) {
  socket.emit('drawDiscard', { room: room.value, fromPlayerId })
}

// placeholder de baixar meld (implementar mais à frente)
function onMeld() {
  socket.emit('meld', { room: room.value, cards: selectedCards.value })
}
</script>

<style scoped>
.game-room {
  display: flex;
  flex-direction: column;
}
</style>
