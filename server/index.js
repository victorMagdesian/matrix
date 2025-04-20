import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const queues = { 2: [], 3: [] };

io.on('connection', socket => {
  socket.on('joinQueue', mode => {
    queues[mode].push(socket);
    // se atingir o tamanho do grupo
    if (queues[mode].length >= mode) {
      const room = `room_${Date.now()}`;
      const players = queues[mode].splice(0, mode);
      players.forEach(s => {
        s.join(room);
        s.emit('matchFound', { room, players: players.map(x=>x.id) });
      });
    }
  });

  socket.on('leaveQueue', mode => {
    queues[mode] = queues[mode].filter(s => s.id !== socket.id);
  });

  socket.on('disconnect', () => {
    [2,3].forEach(m => {
      queues[m] = queues[m].filter(s => s.id !== socket.id);
    });
  });
});

httpServer.listen(3001, () => console.log('Lobby server rodando na porta 3001'));
