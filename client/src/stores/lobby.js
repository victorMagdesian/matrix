import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

const QUEUE_TIMEOUT_MS = 30_000

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room: null,
    players: [],
    status: 'idle',        // idle | waiting | matched
    mode: null,            // 2 ou 3
    timeoutId: null,
    isReconnecting: false  // 🚨 novo flag
  }),

  actions: {
    connect() {
      this.socket = io('http://localhost:3001', {
        autoConnect: true,
        reconnectionAttempts: 5
      })

      this.socket.on('connect', () => {
        console.log(`[lobby] ✅ conectado com id ${this.socket.id}`)
        this.isReconnecting = false
      })

      this.socket.on('connect_error', err => {
        console.error('[lobby] ❌ erro de conexão:', err.message)
      })

      this.socket.on('disconnect', reason => {
        console.warn('[lobby] ⚠️ desconectado:', reason)
        // Se estivermos em fila ou já matched, não volte a idle,
        // apenas sinalize reconexão pendente
        if (this.status === 'waiting' || this.status === 'matched') {
          this.isReconnecting = true
        } else {
          // se estivermos em idle, limpa tudo
          this.resetState()
        }
      })

      this.socket.on('reconnect', attempt => {
        console.log(`[lobby] 🔄 reconectado após ${attempt} tentativas`)
        this.isReconnecting = false
      })

      this.socket.on('matchFound', ({ room, players }) => {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = null
        }
        this.room    = room
        this.players = players
        this.status  = 'matched'
      })
    },

    join(mode) {
      this.mode   = mode
      this.status = 'waiting'
      this.isReconnecting = false
      this.socket.emit('joinQueue', mode)

      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        console.warn('[lobby] ⏰ tempo na fila esgotado')
        this.leave()
      }, QUEUE_TIMEOUT_MS)
    },

    leave() {
      if (!this.mode) return
      this.socket.emit('leaveQueue', this.mode)
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
      this.resetState()
    },

    resetState() {
      this.mode   = null
      this.status = 'idle'
      this.room   = null
      this.players= []
      this.isReconnecting = false
    }
  }
})
