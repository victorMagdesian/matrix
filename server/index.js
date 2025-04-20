// server/index.js
import express from 'express'
import http     from 'http'
import cors     from 'cors'
import { Server } from 'socket.io'

import { queues, joinQueue, leaveQueue, removeFromAll } from './src/lobby.js'
import {
  startGame, drawDiscard, discard, meld,
  advanceTurn, gameStates
} from './src/game.js'

const app = express()
app.use(cors())

const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

/* ───────── helper ───────── */
const syncState = (room) => {
  const state = gameStates[room]
  if (state) io.to(room).emit('stateUpdate', state)
}

/* ───────── conexões ───────── */
io.on('connection', (socket) => {
  console.log(`🟢 ${socket.id} conectado`)

  /* LOBBY */
  socket.on('joinQueue', (mode) => {
    const match = joinQueue(mode, socket)
    if (!match) return

    const { room, players } = match
    const ids = players.map(p => p.id)

    players.forEach(p => p.join(room))

    const initialState = startGame(room, ids)

    // 1º envia confirmação + IDs
    io.to(room).emit('matchFound', { room, players: ids })
    // 2º logo em seguida o estado completo
    io.to(room).emit('stateUpdate', initialState)

    console.log(`🎮 Match ${room} criado com ${ids.join(', ')}`)
  })

  socket.on('leaveQueue', (mode) => leaveQueue(mode, socket))
  socket.on('disconnect',      () => removeFromAll(socket))

  /* GAMEPLAY */
  socket.on('drawDiscard', ({ room, fromPlayerId }) => {
    drawDiscard(room, socket.id, fromPlayerId)
    syncState(room)
  })

  socket.on('discard', ({ room, card }) => {
    discard(room, socket.id, card)
    syncState(room)
  })

  socket.on('meld', ({ room, cards }) => {
    const res = meld(room, socket.id, cards)
    res.error ? socket.emit('invalidMeld', res) : syncState(room)
  })

  /* RE‑SYNC manual (caso o front perca o primeiro push) */
  socket.on('getState', ({ room }) => {
    const state = gameStates[room]
    if (state) socket.emit('stateUpdate', state)
  })
})

httpServer.listen(3001, () =>
  console.log('🚀 Servidor em http://localhost:3001')
)
