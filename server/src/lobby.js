// salas de espera por modo
export const queues = { 2: [], 3: [] }

/** adiciona à fila e retorna match se completar */
export function joinQueue(mode, socket) {
  queues[mode].push(socket)
  if (queues[mode].length >= mode) {
    const room  = `room_${Date.now()}`
    const group = queues[mode].splice(0, mode)
    const ids   = group.map(s => s.id)
    group.forEach(s => s.join(room))
    return { room, players: ids }
  }
  return null
}

export function leaveQueue(mode, socket) {
  queues[mode] = queues[mode].filter(s => s.id !== socket.id)
}
export function removeFromAll(socket) {
  [2,3].forEach(m => leaveQueue(m, socket))
}
