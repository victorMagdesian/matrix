// server/src/lobby.js
// -------------------
// Contém APENAS lógica de pareamento para 2 e 3 jogadores.

const queues = { 2: [], 3: [] }

/**
 * Enfileira socket; quando há jogadores suficientes devolve
 *   { room: 'room_...', players: [socketA, socketB, …] }
 */
function joinQueue (mode, socket) {
  const list = queues[mode]
  if (!list) return

  if (list.find(p => p.id === socket.id)) return   // já estava na fila
  list.push(socket)

  if (list.length >= mode) {
    const players = list.splice(0, mode)
    const room    = `room_${Date.now()}`
    return { room, players }
  }
}

/* Remove jogador de uma fila específica */
function leaveQueue (mode, socket) {
  const list = queues[mode]
  if (!list) return
  const i = list.findIndex(p => p.id === socket.id)
  if (i !== -1) list.splice(i, 1)
}

/* Remove jogador de todas as filas (disconnect) */
function removeFromAll (socket) {
  [2, 3].forEach(mode => leaveQueue(mode, socket))
}

export { queues, joinQueue, leaveQueue, removeFromAll }
