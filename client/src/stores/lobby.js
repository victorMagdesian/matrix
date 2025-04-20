// client/src/stores/lobby.js
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,      // instância do socket.io
    playerId: null,    // socket.id
    status: 'idle',    // 'idle' | 'waiting' | 'matched'
    mode: null,        // 2 ou 3 jogadores
    room: null,        // ID da sala atual
    players: []        // array de socket.id dos adversários
  }),

  actions: {
    /**
     * Conecta o socket e configura os listeners de lobby.
     * Deve ser chamado uma única vez no início do app.
     */
    connect() {
      if (this.socket) return
      this.socket = io('http://localhost:3001')

      this.socket.on('connect', () => {
        this.playerId = this.socket.id
        this.status = 'idle'
      })

      this.socket.on('disconnect', () => {
        this.status = 'idle'
        this.room = null
        this.mode = null
        this.players = []
      })

      // Evento emitido pelo servidor quando todos entraram na sala
      this.socket.on('matchFound', ({ room, players }) => {
        this.room = room
        this.players = players
        this.status = 'matched'
      })
    },

    /**
     * Entra na fila de um modo (2 ou 3).
     */
    join(mode) {
      if (!this.socket) this.connect()
      this.mode = mode
      this.status = 'waiting'
      this.socket.emit('joinQueue', mode)
    },

    /**
     * Sai da fila antes de formar o match.
     */
    leave() {
      if (this.socket && this.mode) {
        this.socket.emit('leaveQueue', this.mode)
      }
      this.status = 'idle'
      this.mode = null
      this.room = null
      this.players = []
    }
  }
})
