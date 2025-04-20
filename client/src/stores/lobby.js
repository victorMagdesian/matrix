import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

const QUEUE_TIMEOUT_MS = 30_000  // 30 segundos de espera máxima

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room: null,
    players: [],
    status: 'idle',    // idle | waiting | matched
    mode: null,        // 2 ou 3 — necessário para leave()
    timeoutId: null    // 🚨 guarda o ID do setTimeout
  }),

  actions: {
    connect() {
      console.log('[lobby] ↗️ iniciando conexão com WebSocket…')
      this.socket = io('http://localhost:3001', {
        autoConnect: true,
        reconnectionAttempts: 5
      })

      this.socket.on('connect', () => {
        console.log(`[lobby] ✅ conectado com id ${this.socket.id}`)
      })

      this.socket.on('connect_error', (err) => {
        console.error('[lobby] ❌ erro de conexão:', err.message)
      })

      this.socket.on('disconnect', (reason) => {
        console.warn('[lobby] ⚠️ desconectado:', reason)
        // limpa estado  
        this.status = 'idle'
        this.room   = null
        this.players= []
        this.mode   = null
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = null
        }
      })

      this.socket.on('reconnect', (attempt) => {
        console.log(`[lobby] 🔄 reconectado após ${attempt} tentativas`)
      })

      this.socket.on('matchFound', ({ room, players }) => {
        console.log('[lobby] 🔔 matchFound recebido', { room, players })
        // 🚨 limpa o timeout quando encontrarmos o match
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
      console.log(`[lobby] ❇️ entrando na fila ${mode}-player`)
      this.socket.emit('joinQueue', mode)

      // 🚨 inicia timeout para saída automática da fila em QUEUE_TIMEOUT_MS
      if (this.timeoutId) clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => {
        console.warn('[lobby] ⏰ tempo na fila esgotado, saindo automaticamente')
        this.leave()
      }, QUEUE_TIMEOUT_MS)
    },

    leave() {
      if (!this.mode) return
      console.log(`[lobby] ⛔ saindo da fila ${this.mode}-player`)
      this.socket.emit('leaveQueue', this.mode)
      // 🚨 limpa timeout pendente
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = null
      }
      this.mode   = null
      this.status = 'idle'
    }
  }
})
