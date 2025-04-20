// server/src/game.js
// ────────────────────────────────────────────────────────────
import { buildDeck, shuffle, deal }   from './deck.js'
import { isValidMeld }                from './validation.js'

export const gameStates = {}

/** Inicia a partida */
export function startGame (room, playerIds) {
  const deck                  = shuffle(buildDeck())
  const { hands, DiscardPile} = deal(deck, playerIds)

  gameStates[room] = {
    hands,
    DiscardPile,                 // pilha de descarte por jogador
    melds          : {},         // grupos baixados
    turnOrder      : [...playerIds],
    currentTurnIdx : 0,          // índice do jogador da vez
    phase          : 'draw'      // 'draw' → comprar | 'discard' → descartar
  }

  return gameStates[room]
}

/* ────────── Ações de turno ────────── */

/**
 * Comprar a carta do topo da pilha de descarte de QUALQUER jogador.
 * Só é permitido se for a fase de compra do jogador da vez.
 */
export function drawDiscard (room, playerId, fromPlayerId) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== playerId || s.phase !== 'draw') return

  const pile = s.DiscardPile[fromPlayerId]
  if (!pile?.length) return                              // nada pra pegar

  const card = pile.pop()
  s.hands[playerId].push(card)
  s.phase = 'discard'                                    // agora precisa descartar
}

/**
 * Descartar uma carta da mão.
 * Após o descarte, a vez passa ao próximo jogador e volta para fase de compra.
 */
export function discard (room, playerId, card) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== playerId || s.phase !== 'discard') return

  const idx = s.hands[playerId]
               .findIndex(c => c.color === card.color && c.value === card.value)

  if (idx === -1) return                                 // carta inexistente

  const [removed] = s.hands[playerId].splice(idx, 1)
  s.DiscardPile[playerId].push(removed)

  advanceTurn(room)                                      // passa a vez
}

/**
 * Baixa um grupo/trinca na mesa (validação em validation.js).
 * Não interfere no fluxo de compra/descarga.
 */
export function meld (room, playerId, cards) {
  const s = gameStates[room]
  if (!isValidMeld(cards))       return { error: 'invalid' }

  cards.forEach(card => {
    const i = s.hands[playerId]
              .findIndex(c => c.color === card.color && c.value === card.value)
    if (i !== -1) s.hands[playerId].splice(i, 1)
  })

  if (!s.melds[playerId]) s.melds[playerId] = []
  s.melds[playerId].push(cards)
  return { success: true }
}

/** Avança turno e reseta a fase para compra */
export function advanceTurn (room) {
  const s = gameStates[room]
  if (!s) return
  s.currentTurnIdx = (s.currentTurnIdx + 1) % s.turnOrder.length
  s.phase          = 'draw'
}
