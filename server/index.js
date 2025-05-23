// server/index.js
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import {
  queues,
  joinQueue,
  leaveQueue,
  removeFromAll
} from './src/lobby.js'

import {
  startGame,
  drawDeck,
  discard,
  meld,
  checkVictory,
  gameStates
} from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

const sync = room => {
  const s = gameStates[room]
  if (s) io.to(room).emit('stateUpdate', s)
}

io.on('connection', socket => {
  console.log('🟢', socket.id, 'conectado')

  // 🎮 LOBBY
  socket.on('joinQueue', mode => {
    const match = joinQueue(mode, socket)
    if (match) {
      // players === array de IDs; sockets === array de objetos Socket
      const { room, players: ids, sockets } = match

      // faz cada socket entrar na sala
      sockets.forEach(s => s.join(room))

      // notifica matchFound apenas com os IDs
      io.to(room).emit('matchFound', { room, players: ids })

      const initialState = startGame(room, ids)
      io.to(room).emit('stateUpdate', initialState)
    }
  })

  socket.on('leaveQueue', mode => leaveQueue(mode, socket))
  socket.on('disconnect', () => removeFromAll(socket))

  // 🕹️ GAMEPLAY
  socket.on('drawDeck', ({ room }) => { drawDeck(room, socket.id); sync(room) })
  socket.on('discard', ({ room, card }) => { discard(room, socket.id, card); sync(room) })
  socket.on('meld', ({ room, cards }) => { meld(room, socket.id, cards); sync(room) })
  socket.on('checkVictory', ({ room }) => {
    const won = checkVictory(room, socket.id)
    socket.emit('victoryResult', { won })
  })

  socket.on('getState', ({ room }) => {
    const s = gameStates[room]
    if (s) socket.emit('stateUpdate', s)
  })
})

httpServer.listen(3001, () => {
  console.log('🚀  Servidor em http://localhost:3001')
})
