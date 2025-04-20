import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room:   null,
    players: [],
    status:  'idle',   // idle | waiting | matched
    isReconnecting: false
  }),

  actions: {
    connect() {
      if (this.socket) return
      this.socket = io('http://localhost:3001', {
        autoConnect: true, reconnectionAttempts: 5
      })

      this.socket.on('connect', () => {
        this.isReconnecting = false
      })

      this.socket.on('disconnect', () => {
        this.isReconnecting = true
      })

      this.socket.on('matchFound', ({ room, players }) => {
        this.room    = room
        this.players = players
        this.status  = 'matched'
      })
    },

    join(mode) {
      this.status = 'waiting'
      this.socket.emit('joinQueue', mode)
    },

    leave() {
      this.status = 'idle'
      this.socket.emit('leaveQueue', 2)
    }
  }
})
