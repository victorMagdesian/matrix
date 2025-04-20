// server/src/lobby.js

export const queues = {
  2: [],
  3: []
}

export function joinQueue(mode, socket) {
  if (!queues[mode]) {
    console.warn(`🚫 Fila inválida para modo: ${mode}`)
    return null
  }

  // já na fila? evita duplicidade
  if (queues[mode].some(s => s.id === socket.id)) {
    console.log(`⚠️ Socket ${socket.id} já está na fila ${mode}`)
    return null
  }

  queues[mode].push(socket)
  console.log(`➕ Socket ${socket.id} entrou na fila ${mode} (${queues[mode].length}/${mode})`)

  if (queues[mode].length >= mode) {
    const match = queues[mode].splice(0, mode)
    const room = `room_${Date.now()}`
    const playerIds = match.map(s => s.id)

    console.log(`✅ Match formado: ${playerIds.join(', ')} → Sala: ${room}`)
    return { room, players: playerIds }
  }

  return null
}

export function leaveQueue(mode, socket) {
  if (!queues[mode]) return
  queues[mode] = queues[mode].filter(s => s.id !== socket.id)
  console.log(`🚪 Socket ${socket.id} saiu da fila ${mode}`)
}

export function removeFromAll(socket) {
  for (const mode in queues) {
    leaveQueue(mode, socket)
  }
}
