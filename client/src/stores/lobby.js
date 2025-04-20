import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    playerId: null,
    room:   null,
    players: [],
    status:  'idle',       // idle | waiting | matched
    isReconnecting: false
  }),

  actions: {
    /* ── cria conexão ── */
    connect() {
      if (this.socket) return

      this.socket = io('http://localhost:3001', {
        autoConnect: true,
        reconnectionAttempts: 5
      })
      
      this.socket.on('connect', () => {
        this.playerId = this.socket.id
        this.isReconnecting = false
        console.log('🧩 Meu ID atual:', this.playerId)
      })
      

      /* eventos globais */
      this.socket.on('connect',    () => this.isReconnecting = false)
      this.socket.on('disconnect', () => this.isReconnecting = true)

      /* entrou na fila */
      this.socket.on('queueJoined', () => {
        this.status = 'waiting'
      })

      /* match pronto */
      this.socket.on('matchFound', ({ room, players }) => {
        this.room    = room
        this.players = players
        this.status  = 'matched'
      })
    },

    /* ── user actions ── */
    join(mode) {
      this.status = 'waiting'
      this.socket.emit('joinQueue', mode)
    },

    leave() {
      this.status = 'idle'
      this.socket.emit('leaveQueue', 2)  // 2 ou 3 se precisar
    }
  }
})
