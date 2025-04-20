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
  gameStates
} from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

io.on('connection', (socket) => {
  console.log(`[+] Conectado: ${socket.id}`)

  /* ───────────── LOBBY ───────────── */
  socket.on('joinQueue', (mode) => {
    socket.emit('queueJoined', { mode })

    const match = joinQueue(mode, socket)

    if (match) {
      const { room, players } = match

      // Corrigido: players são IDs, não socket instances
      players.forEach(playerId => {
        const s = io.sockets.sockets.get(playerId)
        if (!s) {
          console.warn('⚠️ Socket não encontrado:', playerId)
          return
        }
        s.join(room)
      })


      io.to(room).emit('matchFound', { room, players: players })

      console.log('🎮 startGame chamado com jogadores:', players)
      const initialState = startGame(room, players)

      console.log('📦 Estado inicial da sala:', initialState)
      io.to(room).emit('stateUpdate', initialState)
    }
  })

  socket.on('leaveQueue', (mode) => {
    leaveQueue(mode, socket)
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

/* 🔁 Função auxiliar para emitir o estado do jogo */
function syncState(room) {
  const state = gameStates[room]
  if (state) {
    console.log(`🛰️ Enviando stateUpdate para sala ${room}`)
    io.to(room).emit('stateUpdate', state)
  }
}

httpServer.listen(3001, () =>
  console.log('🟢 Lobby & Game server rodando em http://localhost:3001')
)
