// server/src/__tests__/lobby.spec.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as lobby from '../lobby.js'

describe('server lobby logic', () => {
  let fakeSocket

  beforeEach(() => {
    // limpa filas antes de cada teste
    lobby.queues[2] = []
    lobby.queues[3] = []

    // socket fake com spies
    fakeSocket = { id: 'S1', join: vi.fn(), emit: vi.fn() }
  })

  it('deve enfileirar e retornar null se grupo incompleto', () => {
    const result = lobby.joinQueue(2, fakeSocket)
    expect(lobby.queues[2]).toContain(fakeSocket)
    expect(result).toBeNull()
  })

  it('deve formar sala e notificar quando fila completa', () => {
    // pré-popula uma posição
    lobby.queues[2] = [{ id: 'X', join: vi.fn(), emit: vi.fn() }]
    const ret = lobby.joinQueue(2, fakeSocket)
    expect(ret).toHaveProperty('room')
    expect(ret.players).toEqual(['X','S1'])
    // a fila deve ter sido esvaziada
    expect(lobby.queues[2]).toHaveLength(0)
  })

  it('leaveQueue remove socket da fila', () => {
    lobby.queues[3] = [fakeSocket]
    lobby.leaveQueue(3, fakeSocket)
    expect(lobby.queues[3]).not.toContain(fakeSocket)
  })

  it('removeFromAll limpa todas as filas', () => {
    lobby.queues[2] = [fakeSocket]
    lobby.queues[3] = [fakeSocket]
    lobby.removeFromAll(fakeSocket)
    expect(lobby.queues[2]).toHaveLength(0)
    expect(lobby.queues[3]).toHaveLength(0)
  })
})
