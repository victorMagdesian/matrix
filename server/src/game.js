// server/src/game.js

import { buildDeck, shuffle, deal } from './deck.js'

// Guarda o estado de cada sala de jogo
export const gameStates = {}

/**
 * Inicia uma partida na sala, gerando e distribuindo cartas.
 * @param {string} room  ID da sala (ex: "room_123456")
 * @param {Array<string>} playerIds  Lista de socket IDs dos jogadores
 * @returns {object} Estado inicial da partida
 */
export function startGame(room, playerIds) {
  // 1. Gerar e embaralhar o deck
  const deck = shuffle(buildDeck())

  // 2. Distribuir as cartas conforme número de players
  const mode = playerIds.length
  const { hands, discardPiles } = deal(deck, mode, playerIds)

  // 3. Preparar estado base
  gameStates[room] = {
    hands,             // cartas na mão de cada jogador
    discardPiles,      // pilhas de descarte vazias
    melds: {},         // grupos baixados (por futuramente implementar)
    turnOrder: [...playerIds],  // sequência de turnos
    currentTurnIndex: 0         // começa pelo primeiro
  }

  return gameStates[room]
}

/**
 * Move o topo da pilha de descarte de fromPlayerId para a mão de playerId.
 */
export function drawDiscard(room, playerId, fromPlayerId) {
    const state = gameStates[room]
    if (!state) throw new Error(`Room ${room} not found`)
    const pile = state.discardPiles[fromPlayerId]
    if (!pile || pile.length === 0) return
    const card = pile.pop()
    state.hands[playerId].push(card)
  }
  
  /**
   * Remove card da mão de playerId e adiciona à sua pilha de descarte.
   * Avança o turno.
   */
  export function discard(room, playerId, card) {
    const state = gameStates[room]
    if (!state) throw new Error(`Room ${room} not found`)
    const hand = state.hands[playerId]
    const idx = hand.findIndex(c => c.color === card.color && c.value === card.value)
    if (idx === -1) throw new Error(`Card not found in hand for player ${playerId}`)
    const [removed] = hand.splice(idx, 1)
    state.discardPiles[playerId].push(removed)
    // Avança o índice de turno
    state.currentTurnIndex = (state.currentTurnIndex + 1) % state.turnOrder.length
  }