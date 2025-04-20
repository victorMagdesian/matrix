// server/src/lobby.js

export const queues = { 2: [], 3: [] }

/**
 * Adiciona um jogador à fila do modo especificado.
 * Se a fila atingir o número necessário, retorna { room, players }.
 */
export function joinQueue(mode, socket) {
  const list = queues[mode]
  if (!list) return null

  if (list.some(s => s.id === socket.id)) return null

  list.push(socket)

  if (list.length >= mode) {
    const players = list.splice(0, mode)
    const room = `room_${Date.now()}`
    return { room, players }
  }

  return null
}

/**
 * Remove o socket da fila de um modo.
 */
export function leaveQueue(mode, socket) {
  const list = queues[mode]
  if (!list) return
  const idx = list.findIndex(s => s.id === socket.id)
  if (idx !== -1) list.splice(idx, 1)
}

/**
 * Remove o socket de todas as filas.
 */
export function removeFromAll(socket) {
  Object.values(queues).forEach(list => {
    const idx = list.findIndex(s => s.id === socket.id)
    if (idx !== -1) list.splice(idx, 1)
  })
}
