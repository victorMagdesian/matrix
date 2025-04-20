// server/index.js
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { queues, joinQueue, leaveQueue, removeFromAll } from './src/lobby.js'

const app = express()
app.use(cors())
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('joinQueue', mode => { joinQueue(mode, socket) })
  socket.on('leaveQueue', mode => { leaveQueue(mode, socket) })
  socket.on('disconnect', ()    => { removeFromAll(socket) })
})

httpServer.listen(3001, () => console.log('Lobby server rodando na porta 3001'))
