// server/index.js
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import { queues, joinQueue, leaveQueue, removeFromAll } from './src/lobby.js'
import { startGame, drawDiscard, discard, gameStates } from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('joinQueue', mode => {
    const match = joinQueue(mode, socket)
    if (match) {
      const { room, players } = match
      const initialState = startGame(room, players)
      io.to(room).emit('gameStart', initialState)
    }
  })

  socket.on('drawDiscard', ({ room, fromPlayerId }) => {
    drawDiscard(room, socket.id, fromPlayerId)
    io.to(room).emit('stateUpdate', gameStates[room])
  })

  socket.on('discard', ({ room, card }) => {
    discard(room, socket.id, card)
    io.to(room).emit('stateUpdate', gameStates[room])
  })

  socket.on('leaveQueue', mode => {
    leaveQueue(mode, socket)
  })

  socket.on('disconnect', () => {
    removeFromAll(socket)
  })
})

httpServer.listen(3001, () => console.log('Lobby & Game server rodando na porta 3001'))
