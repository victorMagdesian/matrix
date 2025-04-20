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
  const list = queues[mode]
  if (!list) return

  // evita duplicados
  if (list.find(p => p.id === socket.id)) {
    console.warn(`⚠️ Socket ${socket.id} já está na fila ${mode}`)
    return
  }

  list.push(socket)
  console.log(`➕ Socket ${socket.id} entrou na fila ${mode} (${list.length}/${mode})`)

  if (list.length >= mode) {
    const players = list.splice(0, mode)
    const room = `room_${Date.now()}`

    console.log(`✅ Match formado: ${players.map(p => p.id).join(', ')} → Sala: ${room}`)
    return { room, players }
  }
}

/**
 * Remove jogador de uma fila.
 */
function leaveQueue(mode, socket) {
  const list = queues[mode]
  if (!list) return

  const i = list.findIndex(p => p.id === socket.id)
  if (i !== -1) {
    list.splice(i, 1)
    console.log(`🚪 Socket ${socket.id} saiu da fila ${mode}`)
  }
}

/**
 * Remove jogador de TODAS as filas.
 */
function removeFromAll(socket) {
  [2, 3].forEach(mode => leaveQueue(mode, socket))
}

export {
  queues,
  joinQueue,
  leaveQueue,
  removeFromAll
}
