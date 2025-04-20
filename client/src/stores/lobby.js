import { defineStore } from 'pinia';
import { io } from 'socket.io-client';

export const useLobbyStore = defineStore('lobby', {
  state: () => ({
    socket: null,
    room: null,
    players: [],
    status: 'idle'  // idle | waiting | matched
  }),
  actions: {
    connect() {
      this.socket = io('http://localhost:3001');
      this.socket.on('matchFound', ({ room, players }) => {
        this.room = room;
        this.players = players;
        this.status = 'matched';
      });
    },
    join(mode) {
      this.status = 'waiting';
      this.socket.emit('joinQueue', mode);
    },
    leave(mode) {
      this.status = 'idle';
      this.socket.emit('leaveQueue', mode);
    }
  }
});
