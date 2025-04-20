// server/src/lobby.js

const queues = {
  2: [],
  3: []
}

/**
 * Enfileira jogador.
 * Se houver jogadores suficientes, retorna { room, players[] }
 */
function joinQueue(mode, socket) {
  const list = queues[mode];
  if (!list) return null;

  // evita duplicados
  if (list.find(p => p.id === socket.id)) {
    console.warn(`⚠️ Socket ${socket.id} já está na fila ${mode}`);
    return null;
  }

  list.push(socket);
  console.log(`➕ Socket ${socket.id} entrou na fila ${mode} (${list.length}/${mode})`);

  if (list.length >= mode) {
    // retira os sockets gravitados
    const sockets = list.splice(0, mode)
    const playerIds = sockets.map(p => p.id)
    const room = `room_${Date.now()}`
    // retorna os IDs (para o teste) e mantém os sockets num campo separado
    return { room, players: playerIds, sockets }
  }

  // Ainda faltam jogadores para formar a sala
  return null;
}

/**
 * Remove jogador de uma fila.
 */
function leaveQueue(mode, socket) {
  const list = queues[mode];
  if (!list) return;

  const i = list.findIndex(p => p.id === socket.id);
  if (i !== -1) {
    list.splice(i, 1);
    console.log(`➖ Socket ${socket.id} saiu da fila ${mode}`);
  }
}

/**
 * Remove jogador de TODAS as filas.
 */
function removeFromAll(socket) {
  [2, 3].forEach(mode => leaveQueue(mode, socket));
}

export {
  queues,
  joinQueue,
  leaveQueue,
  removeFromAll
}
