// server/src/__tests__/lobby.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { queues as lobbyQueues, joinQueue, leaveQueue, removeFromAll } from '../lobby.js'

describe('server lobby logic', () => {
  let fakeSocket

  beforeEach(() => {
    // limpa filas
    lobbyQueues[2] = []
    lobbyQueues[3] = []

    // socket com id e spies
    fakeSocket = { id: 'S1', join: vi.fn(), emit: vi.fn() }
  })

  it('deve enfileirar e retornar null se grupo incompleto', () => {
    const result = joinQueue(2, fakeSocket)
    expect(lobbyQueues[2]).toContain(fakeSocket)
    expect(result).toBeNull()
  })

  it('deve formar sala e notificar quando fila completa', () => {
    // preenche primeira posição
    lobbyQueues[2] = [{ id: 'X', join: vi.fn(), emit: vi.fn() }]
    const ret = joinQueue(2, fakeSocket)
    expect(ret).toHaveProperty('room')
    expect(ret.players).toEqual(['X','S1'])
    // fila deve estar vazia após splice
    expect(lobbyQueues[2]).toHaveLength(0)
  })

  it('leaveQueue remove socket da fila', () => {
    lobbyQueues[3] = [fakeSocket]
    leaveQueue(3, fakeSocket)
    expect(lobbyQueues[3]).not.toContain(fakeSocket)
  })

  it('removeFromAll limpa todas as filas', () => {
    lobbyQueues[2] = [fakeSocket]
    lobbyQueues[3] = [fakeSocket]
    removeFromAll(fakeSocket)
    expect(lobbyQueues[2]).toHaveLength(0)
    expect(lobbyQueues[3]).toHaveLength(0)
  })
})
