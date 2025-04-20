import { describe, it, expect } from 'vitest'
import { gameStates, startGame } from '../game.js'

describe('Game state initialization', () => {
  it('startGame() deve criar gameStates corretamente para 2 players', () => {
    const room = 'room_test'
    const players = ['P1','P2']
    const state = startGame(room, players)
    expect(gameStates[room]).toBe(state)
    // Mãos de 36 cartas cada
    expect(state.hands.P1).toHaveLength(36)
    expect(state.hands.P2).toHaveLength(36)
    // Discards vazios
    expect(state.DiscardPile.P1).toHaveLength(0)
    expect(state.DiscardPile.P2).toHaveLength(0)
    // Turn order e index
    expect(state.turnOrder).toEqual(players)
    expect(state.currentTurnIndex).toBe(0)
  })

  it('startGame() deve criar gameStates para 3 players', () => {
    const room = 'room_test3'
    const players = ['A','B','C']
    const state = startGame(room, players)
    expect(state.hands.A).toHaveLength(24)
    expect(state.hands.B).toHaveLength(24)
    expect(state.hands.C).toHaveLength(24)
  })
})
