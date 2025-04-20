// client/src/stores/__tests__/lobby.spec.js
import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useLobbyStore } from '../lobby'

describe('lobby store', () => {
  let store
  let mockSocket

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useLobbyStore()

    // mock do socket.io-client
    mockSocket = {
      emit: vi.fn(),
      on: vi.fn(),
    }
    store.socket = mockSocket
  })

  it('deve entrar na fila ao chamar join()', () => {
    store.join(2)
    expect(store.mode).toBe(2)
    expect(store.status).toBe('waiting')
    expect(mockSocket.emit).toHaveBeenCalledWith('joinQueue', 2)
  })

  it('deve sair da fila ao chamar leave()', () => {
    // pré-condição
    store.mode = 3
    store.status = 'waiting'

    store.leave()
    expect(store.mode).toBeNull()
    expect(store.status).toBe('idle')
    expect(mockSocket.emit).toHaveBeenCalledWith('leaveQueue', 3)
  })

  it('deve resetar estado após disconnect se idle', () => {
    store.status = 'idle'
    store.mode = null
    // simula evento disconnect
    const cb = mockSocket.on.mock.calls.find(c => c[0] === 'disconnect')[1]
    cb('transport close')
    expect(store.status).toBe('idle')
    expect(store.isReconnecting).toBe(false)
  })

  it('deve sinalizar isReconnecting em disconnect durante waiting', () => {
    store.status = 'waiting'
    const cb = mockSocket.on.mock.calls.find(c => c[0] === 'disconnect')[1]
    cb('transport close')
    expect(store.isReconnecting).toBe(true)
  })
})
