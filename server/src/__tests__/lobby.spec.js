import { describe, it, expect, beforeEach, vi } from 'vitest'
import { queues, joinQueue, leaveQueue, removeFromAll } from '../lobby.js'

describe('server lobby logic', () => {
  let fakeSocket

  beforeEach(() => {
    // limpa filas
    queues[2] = []
    queues[3] = []
    // socket com id e spies
    fakeSocket = { id: 'S1', join: vi.fn(), emit: vi.fn() }
  })

  it('deve enfileirar e retornar null se grupo incompleto', () => {
    const result = joinQueue(2, fakeSocket)
    expect(queues[2]).toContain(fakeSocket)
    expect(result).toBeNull()
  })

  it('deve formar sala e notificar quando fila completa', () => {
    // preenche primeira posição
    queues[2] = [{ id: 'X', join: vi.fn(), emit: vi.fn() }]
    const ret = joinQueue(2, fakeSocket)
    expect(ret).toHaveProperty('room')
    expect(ret.players).toEqual(['X','S1'])
    // filas deve estar vazia após splice
    expect(queues[2]).toHaveLength(0)
  })

  it('leaveQueue remove socket da fila', () => {
    queues[3] = [fakeSocket]
    leaveQueue(3, fakeSocket)
    expect(queues[3]).not.toContain(fakeSocket)
  })

  it('removeFromAll limpa todas as filas', () => {
    queues[2] = [fakeSocket]
    queues[3] = [fakeSocket]
    removeFromAll(fakeSocket)
    expect(queues[2]).toHaveLength(0)
    expect(queues[3]).toHaveLength(0)
  })
})
