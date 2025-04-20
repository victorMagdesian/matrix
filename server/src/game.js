// server/src/game.js
import { buildDeck, shuffle, deal } from './deck.js'
import { isValidMeld } from './validation.js'

export const gameStates = {}

export function startGame(room, playerIds) {
  console.log('🎮 startGame chamado com jogadores:', playerIds)

  const deck = shuffle(buildDeck())
  const { hands, DiscardPile } = deal(deck, playerIds.length, playerIds)

  gameStates[room] = {
    hands,
    DiscardPile,
    melds: {},
    turnOrder: [...playerIds],
    currentTurnIndex: 0
  }

  console.log(`🎲 Jogo iniciado na sala ${room}`)
  console.log(JSON.stringify(gameStates[room], null, 2))

  return gameStates[room]
}

export function drawDiscard(room, playerId, fromPlayerId) {
  const s = gameStates[room]
  const pile = s.DiscardPile[fromPlayerId]
  if (!pile?.length) return
  const card = pile.pop()
  s.hands[playerId].push(card)
}

export function discard(room, playerId, card) {
  const s = gameStates[room]
  const idx = s.hands[playerId].findIndex(
    c => c.color === card.color && c.value === card.value
  )
  if (idx === -1) return
  const [removed] = s.hands[playerId].splice(idx, 1)
  s.DiscardPile[playerId].push(removed)
  s.currentTurnIndex = (s.currentTurnIndex + 1) % s.turnOrder.length
}

export function meld(room, playerId, cards) {
  const s = gameStates[room]
  if (!isValidMeld(cards)) return { error: 'invalid' }

  cards.forEach(card => {
    const i = s.hands[playerId].findIndex(
      c => c.color === card.color && c.value === card.value
    )
    if (i !== -1) s.hands[playerId].splice(i, 1)
  })

  if (!s.melds[playerId]) s.melds[playerId] = []
  s.melds[playerId].push(cards)

  return { success: true }
}

export function advanceTurn(room) {
  const state = gameStates[room]
  if (!state) return

  state.currentTurnIndex = (state.currentTurnIndex + 1) % state.turnOrder.length
}
