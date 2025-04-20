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
