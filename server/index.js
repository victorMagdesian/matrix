import express from 'express'
import cors    from 'cors'
import http    from 'http'
import { Server } from 'socket.io'

import {
  queues, joinQueue, leaveQueue, removeFromAll
} from './src/lobby.js'

import {
  startGame, drawDeck, discard, meld,
  gameStates, checkVictory
} from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

const sync = room => {
  const st = gameStates[room]
  if (st) io.to(room).emit('stateUpdate', st)
}

io.on('connection', socket => {
  console.log('🟢', socket.id, 'conectado')

  /* Lobby */
  socket.on('joinQueue', mode => { /* … */ })
  socket.on('leaveQueue', mode => leaveQueue(mode, socket))
  socket.on('disconnect',    () => removeFromAll(socket))

  /* Gameplay */
  socket.on('drawDeck',   ({ room })        => { drawDeck(room, socket.id);        sync(room) })
  socket.on('discard',    ({ room, card })  => { discard(room, socket.id, card);   sync(room) })
  socket.on('meld',       ({ room, cards }) => { meld(room, socket.id, cards);     sync(room) })

  /* Checagem de vitória */
  socket.on('checkVictory', ({ room }) => {
    const won = checkVictory(room, socket.id)
    socket.emit('victoryResult', { won })
  })

  /* Re‐sync manual */
  socket.on('getState', ({ room }) => {
    const st = gameStates[room]
    if (st) socket.emit('stateUpdate', st)
  })
})

httpServer.listen(3001, () =>
  console.log('🚀  Servidor em http://localhost:3001')
)
