// server/index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

import {
  queues,
  joinQueue,
  leaveQueue,
  removeFromAll
} from './src/lobby.js'

import {
  startGame,
  drawDiscard,
  discard,
  meld,
  advanceTurn,
  gameStates
} from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: { origin: '*' }
})

// 🎮 Evento por jogador conectado
io.on('connection', (socket) => {
  console.log(`[+] Conectado: ${socket.id}`)

  /* ───────────── LOBBY ───────────── */
  socket.on('joinQueue', (mode) => {
    console.log(`➕ Socket ${socket.id} entrou na fila ${mode}`)
    socket.emit('queueJoined', { mode })

    const match = joinQueue(mode, socket)

    if (match) {
      const { room, players } = match
      const ids = players.map(p => p.id)

      // Confirma os sockets válidos
      if (players.some(p => !p)) {
        console.warn('⚠️ Um dos sockets está undefined:', players)
        return
      }

      players.forEach(p => {
        if (p && typeof p.join === 'function') {
          p.join(room)
        } else {
          console.warn(`⚠️ Socket ${p?.id} não pôde entrar na sala`)
        }
      })

      io.to(room).emit('matchFound', { room, players: ids })

      const initialState = startGame(room, ids)
      console.log('🎲 Jogo iniciado na sala', room)
      console.log(initialState)

      io.to(room).emit('stateUpdate', initialState)
    }
  })

  socket.on('leaveQueue', (mode) => {
    leaveQueue(mode, socket)
    console.log(`🚪 Socket ${socket.id} saiu da fila ${mode}`)
  })

  socket.on('disconnect', () => {
    removeFromAll(socket)
    console.log(`[-] Desconectado: ${socket.id}`)
  })

  /* ───────────── GAME ───────────── */

  socket.on('drawDiscard', ({ room, fromPlayerId }) => {
    drawDiscard(room, socket.id, fromPlayerId)
    syncState(room)
  })

  socket.on('discard', ({ room, card }) => {
    discard(room, socket.id, card)
    advanceTurn(room)
    syncState(room)
  })

  socket.on('meld', ({ room, cards }) => {
    const result = meld(room, socket.id, cards)
    if (result.error) {
      socket.emit('invalidMeld', { reason: 'Grupo inválido' })
    } else {
      syncState(room)
    }
  })
})

/* 🔁 Envia estado atualizado para todos os sockets da sala */
function syncState(room) {
  const state = gameStates[room]
  if (state) {
    io.to(room).emit('stateUpdate', state)
  }
}

httpServer.listen(3001, () =>
  console.log('🟢 Lobby & Game server rodando em http://localhost:3001')
)
