// server/index.js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { buildDeck, shuffle, deal } from './src/deck.js'
import cors from 'cors'
import { queues, joinQueue, leaveQueue, removeFromAll } from './src/lobby.js'
import { startGame } from './src/game.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('joinQueue', mode => {
    const match = joinQueue(mode, socket)
    // Se o match foi encontrado (mode jogadores prontos)
    if (match) {
      const { room, players } = match
      // Inicializa o estado do jogo para esta sala
      const initialState = startGame(room, players)
      // Emite evento de início de jogo, enviando o estado inicial
      io.to(room).emit('gameStart', initialState)
    }
  })
  socket.on('leaveQueue', mode => { leaveQueue(mode, socket) })
  socket.on('disconnect', () => { removeFromAll(socket) })
})

httpServer.listen(3001, () => console.log('Lobby server rodando na porta 3001'))
