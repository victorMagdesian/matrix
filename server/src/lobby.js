// server/src/lobby.js
export const queues = { 2: [], 3: [] }

/**
 * Adiciona socket à fila e retorna room+players se completar o grupo.
 */
export function joinQueue(mode, socket) {
  queues[mode].push(socket)
  if (queues[mode].length >= mode) {
    const room    = `room_${Date.now()}`
    const group   = queues[mode].splice(0, mode)
    const players = group.map(s => s.id)
    // notificações de sala
    group.forEach(s => {
      s.join(room)
      s.emit('matchFound', { room, players })
    })
    return { room, players }
  }
  return null
}

/** Remove socket da fila do modo indicado */
export function leaveQueue(mode, socket) {
  queues[mode] = queues[mode].filter(s => s.id !== socket.id)
}

/** Remove socket de todas as filas (disconnect) */
export function removeFromAll(socket) {
  [2,3].forEach(mode => {
    queues[mode] = queues[mode].filter(s => s.id !== socket.id)
  })
}
// server/src/lobby.js
export const queues = { 2: [], 3: [] }

/**
 * Adiciona socket à fila e retorna room+players se completar o grupo.
 */
export function joinQueue(mode, socket) {
  queues[mode].push(socket)
  if (queues[mode].length >= mode) {
    const room    = `room_${Date.now()}`
    const group   = queues[mode].splice(0, mode)
    const players = group.map(s => s.id)
    // notificações de sala
    group.forEach(s => {
      s.join(room)
      s.emit('matchFound', { room, players })
    })
    return { room, players }
  }
  return null
}

/** Remove socket da fila do modo indicado */
export function leaveQueue(mode, socket) {
  queues[mode] = queues[mode].filter(s => s.id !== socket.id)
}

/** Remove socket de todas as filas (disconnect) */
export function removeFromAll(socket) {
  [2,3].forEach(mode => {
    queues[mode] = queues[mode].filter(s => s.id !== socket.id)
  })
}
