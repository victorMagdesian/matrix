// server/src/game.js
// ────────────────────────────────────────────────────────────
import { buildDeck, shuffle } from './deck.js'

export const gameStates = {}

/* ========= helpers de validação ========= */

function isSequence(cards) {
  if (cards.length !== 3) return false
  const [c1, c2, c3] = cards.sort((a, b) => a.value - b.value)
  return (
    c1.color === c2.color &&
    c2.color === c3.color &&
    c1.value + 1 === c2.value &&
    c2.value + 1 === c3.value &&
    c1.value > 1 && c3.value < 9            // 1 e 9 não podem participar
  )
}

function isSet(cards) {
  if (cards.length !== 3) return false
  const valuesEqual = cards.every(c => c.value === cards[0].value)
  const colorsUnique = new Set(cards.map(c => c.color)).size === 3
  return valuesEqual && colorsUnique && ![1, 9].includes(cards[0].value)
}

export function isValidMeld(cards) {
  return isSequence(cards) || isSet(cards)
}

/* ========= inicialização ========= */

export function startGame(room, playerIds) {
  const deck     = shuffle(buildDeck())
  const HAND     = 11
  const cards    = {}            // id -> { color, value, owner }
  const hands    = {}            // pid -> [id]
  const discards = {}            // pid -> [id]
  let serial = 0

  for (const pid of playerIds) {
    hands[pid]    = []
    discards[pid] = []
    for (let i = 0; i < HAND; i++) {
      const card = deck.pop()
      card.owner = pid
      const id   = `c${serial++}`
      cards[id]  = card
      hands[pid].push(id)
    }
  }

  gameStates[room] = {
    cards,
    hands,
    DiscardPile : discards,
    melds       : {},              // pid -> [[ids]]
    turnOrder   : [...playerIds],
    currentTurnIdx : 0,
    phase          : 'draw'
  }

  return gameStates[room]
}

/* ========= util interno ========= */

function cloneFor(state, cardId, newOwner) {
  const newId = `c${Object.keys(state.cards).length}`
  state.cards[newId] = { ...state.cards[cardId], owner: newOwner }
  return newId
}

/* ========= ações ========= */

export function drawDiscard(room, pid, fromPid) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== pid || s.phase !== 'draw') return

  const pile = s.DiscardPile[fromPid]
  if (!pile?.length) return

  const oldId = pile.pop()
  const newId = cloneFor(s, oldId, pid)
  s.hands[pid].push(newId)
  s.phase = 'discard'
}

export function discard(room, pid, { color, value }) {
  const s = gameStates[room]
  if (!s || s.turnOrder[s.currentTurnIdx] !== pid || s.phase !== 'discard') return

  const idx = s.hands[pid].findIndex(cid => {
    const c = s.cards[cid]
    return c.color === color && c.value === value
  })
  if (idx === -1) return

  const [cid] = s.hands[pid].splice(idx, 1)
  s.DiscardPile[pid].push(cid)
  advanceTurn(room)
}

export function meld(room, pid, cardIds) {
  const s = gameStates[room]
  if (!s) return { error: 'room_not_found' }

  // todas as cartas devem estar na mão do jogador
  if (!cardIds.every(id => s.hands[pid].includes(id)))
    return { error: 'not_in_hand' }

  const cards = cardIds.map(id => s.cards[id])
  if (!isValidMeld(cards)) return { error: 'invalid_meld' }

  // remove da mão
  cardIds.forEach(id => {
    const i = s.hands[pid].indexOf(id)
    if (i !== -1) s.hands[pid].splice(i, 1)
  })

  // registra
  if (!s.melds[pid]) s.melds[pid] = []
  s.melds[pid].push(cardIds)

  return { success: true }
}

export function advanceTurn(room) {
  const s = gameStates[room]
  s.currentTurnIdx = (s.currentTurnIdx + 1) % s.turnOrder.length
  s.phase          = 'draw'
}
