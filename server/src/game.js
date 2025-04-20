// server/src/game.js
import { buildDeck, shuffle, deal } from './deck.js'
import { isValidMeld }             from './validation.js'

// Estado de todas as salas
export const gameStates = {}

/**
 * Cria estado inicial da sala: baralho, mãos, pilhas.
 */
export function startGame(room, playerIds) {
  const deck = shuffle(buildDeck())
  const mode = playerIds.length
  const { hands, discardPiles } = deal(deck, mode, playerIds)

  gameStates[room] = {
    hands,
    discardPiles,
    melds: {},
    turnOrder: [...playerIds],
    currentTurnIndex: 0
  }
  return gameStates[room]
}

/**
 * Pega topo do descarte de outro jogador.
 */
export function drawDiscard(room, playerId, fromPlayerId) {
  const s = gameStates[room]
  const pile = s.discardPiles[fromPlayerId]
  if (!pile?.length) return
  const card = pile.pop()
  s.hands[playerId].push(card)
}

/**
 * Descarta carta e avança turno.
 */
export function discard(room, playerId, card) {
  const s = gameStates[room]
  const idx = s.hands[playerId].findIndex(
    c => c.color === card.color && c.value === card.value
  )
  if (idx === -1) return
  const [removed] = s.hands[playerId].splice(idx, 1)
  s.discardPiles[playerId].push(removed)
  s.currentTurnIndex = (s.currentTurnIndex + 1) % s.turnOrder.length
}

/**
 * Valida meld, move cartas da mão → melds.
 * Retorna { success:true } ou { error:'invalid' }.
 */
export function meld(room, playerId, cards) {
  const s = gameStates[room]
  if (!isValidMeld(cards)) return { error: 'invalid' }

  // remove das mãos
  cards.forEach(card => {
    const i = s.hands[playerId].findIndex(
      c => c.color === card.color && c.value === card.value
    )
    if (i !== -1) s.hands[playerId].splice(i, 1)
  })
  // adiciona ao melds
  if (!s.melds[playerId]) s.melds[playerId] = []
  s.melds[playerId].push(cards)

  return { success: true }
}
