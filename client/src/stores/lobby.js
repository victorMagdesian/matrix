import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

const QUEUE_TIMEOUT_MS = 30_000 // 30 s de espera máxima

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room: null,
    players: [],
    status: 'idle',        // idle | waiting | matched
    mode: null,            // 2 ou 3 — modo selecionado
    timeoutId: null,       // ID do timeout da fila
    isReconnecting: false  // flag de reconexão
  }),

  actions: {
    connect() {
      console.log('[lobby] ↗️ iniciando conexão com WebSocket…')
      // Se já houver socket (e.g. em testes), não sobrescreve
      if (!this.socket) {
        this.socket = io('http://localhost:3001', {
          autoConnect: true,
          reconnectionAttempts: 5
        })
      }
      const sock = this.socket

      sock.on('connect', () => {
        console.log(`[lobby] ✅ conectado com id ${sock.id}`)
        this.isReconnecting = false
      })

      sock.on('connect_error', err => {
        console.error('[lobby] ❌ erro de conexão:', err.message)
      })

      sock.on('disconnect', reason => {
        console.warn('[lobby] ⚠️ desconectado:', reason)
        if (this.status === 'waiting' || this.status === 'matched') {
          this.isReconnecting = true
        } else {
          this.resetState()
        }
      })

      sock.on('reconnect', attempt => {
        console.log(`[lobby] 🔄 reconectado após ${attempt} tentativas`)
        this.isReconnecting = false
      })

      sock.on('matchFound', ({ room, players }) => {
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
      this.mode           = mode
      this.status         = 'waiting'
      this.isReconnecting = false
      console.log(`[lobby] ❇️ entrando na fila ${mode}-player`)
      this.socket.emit('joinQueue', mode)

      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        console.warn('[lobby] ⏰ tempo na fila esgotado')
        this.leave()
      }, QUEUE_TIMEOUT_MS)
    },

    leave() {
      if (!this.mode) return
      console.log(`[lobby] ⛔ saindo da fila ${this.mode}-player`)
      this.socket.emit('leaveQueue', this.mode)
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
      this.resetState()
    },

    resetState() {
      this.mode           = null
      this.status         = 'idle'
      this.room           = null
      this.players        = []
      this.isReconnecting = false
    }
  }
})
