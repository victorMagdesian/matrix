import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room: null,
    players: [],
    status: 'idle',    // idle | waiting | matched
    mode: null         // 2 ou 3 — necessário para leave()
  }),

  actions: {
    connect() {
      console.log('[lobby] ↗️ iniciando conexão com WebSocket…')
      this.socket = io('http://localhost:3001')
      this.socket.on('connect', () => {
        console.log(`[lobby] ✅ conectado com id ${this.socket.id}`)
      })
      this.socket.on('matchFound', ({ room, players }) => {
        console.log('[lobby] 🔔 matchFound recebido', { room, players })
        this.room = room
        this.players = players
        this.status = 'matched'
      })
    },

    join(mode) {
      this.mode = mode                // guarda o modo selecionado
      this.status = 'waiting'
      console.log(`[lobby] ❇️ entrando na fila ${mode}-player`)
      this.socket.emit('joinQueue', mode)
    },

    leave() {
      if (!this.mode) return
      console.log(`[lobby] ⛔ saindo da fila ${this.mode}-player`)
      this.socket.emit('leaveQueue', this.mode)
      this.mode = null
      this.status = 'idle'
    }
  }
})
